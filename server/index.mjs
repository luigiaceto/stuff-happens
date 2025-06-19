// import di libreria
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import dayjs from 'dayjs';
import crypto from 'crypto';

// import di passport
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// import locali
import * as MatchDAO from './dao/matchDAO.mjs';
import * as SituationDAO from './dao/situationDAO.mjs';
import { getUser } from './dao/userDAO.mjs';

// inizializzazione server express
const app = new express();
const port = 3001;
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

// setup e attivazione CORS
const corsOptions = {
    // il server accetta richieste solo da qui
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    // permette l'invio di cookies tra domini diversi e l'uso di 
    // Authorization headers se presenti
    credentials: true
};
// applicazione middlewere CORS a tutte le routes del server
app.use(cors(corsOptions));

// setup Passport
// - utilizzo della local strategy che sfrutta username e password
// - verify è una callback di verifica chiamata con username e
//   password presi dal body della richiesta
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  // retrieve dell'user dal DB per vedere se esiste
  const user = await getUser(username, password);
  // se non è stato trovato si torna messaggio di errore al client
  if(!user)
    return cb(null, false, 'Username o password errati');
  return cb(null, user);
}));

// per salvare l'oggetto user nella sessione
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// quando una richiesta arriva con una sessione attiva, questa 
// funzione viene chiamata per ricostruire req.user
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// definizione middlewere di autenticazione da applicare a route
// specifiche (quelle da proteggere), non è globale
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

// attiva le sessioni sul server
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
// middlewere che legge la sessione da express-session,
// altrimenti Passport non ricorda l'utente tra una
// richiesta e l'altra
app.use(passport.authenticate('session'));

/*** Utils ***/
// per estrazione carte casuali
function getRandomObjects(array, n) {
  const arrayCopy = [...array];
  const result = [];

  while (result.length < n) {
    const randomIndex = getSecureRandomInt(0, arrayCopy.length - 1);
    result.push(arrayCopy.splice(randomIndex, 1)[0]);
  }

  return result;

  // interi casuali sicuri con crypto
  function getSecureRandomInt(min, max) {
    const range = max - min + 1;
    const maxUint32 = 2 ** 32;
    const maxAcceptable = Math.floor(maxUint32 / range) * range;

    let rand;
    do {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      rand = array[0];
    } while (rand >= maxAcceptable);

    return min + (rand % range);
  }
}

//  A  B  C  D
// 0 1  2  3  4
function checkCardOrder(position, misfortune_index, hand) {
  // nel caso al server arrivino mani non ordinate
  const orderedHand = hand.sort((a, b) => a.misfortune_index - b.misfortune_index);

  if (position === 0) {
    return misfortune_index < orderedHand[0].misfortune_index;
  } else if (position === hand.length) {
    return misfortune_index > orderedHand[orderedHand.length - 1].misfortune_index;
  } else {
    return misfortune_index > orderedHand[position-1].misfortune_index && 
           misfortune_index < orderedHand[position].misfortune_index;
  }
}

/*** ROUTES ***/
// POST /api/matches/new
app.post('/api/matches/new', 
  async (req, res) => {
    // se l'utente è loggato passport avrà iniettato l'user nella
    // richiesta tramite middlewere. Evito così di far mandare 
    // all'utente il campo nel body "demo: Yes/No" così non devo fare 
    // controlli per vedere se manda 'No' nonostante non sia loggato
    const user_id = req.user ? req.user.id : null;
    try {
      const match_id = await MatchDAO.addMatch(user_id);
      const allSituations = await SituationDAO.getAllSituations();
      const someSituations = getRandomObjects(allSituations, 4);
      const startingHand = someSituations.slice(0, 3);
      const tableSituation = someSituations[3];

      await Promise.all(startingHand.map(situation => 
        MatchDAO.addSituationInMatch(situation.id, match_id, 0, 'Vinta'))
      );
      
      // null poichè devo aspettare la risposta del client per l'esito della guess
      await MatchDAO.addSituationInMatch(tableSituation.id, match_id, 1, null);

      const responseData = {
        match_id: match_id,
        starting_situations: startingHand.map(s => ({
          id: s.id,
          name: s.name,
          misfortune_index: s.misfortune_index,
          img_path: s.img_path
        })),
        table_situation: {
          id: tableSituation.id,
          name: tableSituation.name,
          img_path: tableSituation.img_path
        }
      }

      res.status(201).json(responseData);
    } catch (error) {
      res.status(503).end();
    }
  }
)

// POST /api/matches/<matchId>/guess
app.post('/api/matches/:matchId/guess', [
    check('match_id').isInt(),
    check('guessed_situation_id').isInt(),
    check('guessed_position').isInt(),
    check('match_situations').isArray()
  ], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }

    const match_id = parseInt(req.params.matchId);
    const matchExistance = await MatchDAO.getMatch(match_id);
    if (matchExistance.error) {
      return res.status(404).json(matchExistance);
    }

    let demo = matchExistance.user_id === null;
    try {
      const end_timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const {true_situation_id, start_timestamp} = await MatchDAO.getGuessStartingTime(match_id);

      // verifico che siano effettivamente passati al massimo 30s + un delta (1s), e che
      // la situazione indovinata sia quella richiesta prima dal client. Altri check
      // per coprire eventuali tentativi di rottura del gioco
      if (dayjs(end_timestamp).diff(start_timestamp, 'second') > 31 ||
          req.body.guessed_situation_id !== true_situation_id || 
          req.body.match_situations.length > 5 ||
          req.body.guessed_position > req.body.match_situations.length) {
        return res.status(422).json({cheatError: 'Sospetto di cheat'});
      }
      
      const guessedSituation = await SituationDAO.getSituationById(req.body.guessed_situation_id);
      const guessedPosition = req.body.guessed_position;
      // in realtà il server potrebbe andarsi a recuperare le carte in mano
      // all'utente ma ciò vorrebbe dire fare un ulteriore query nel DB che richiede
      // un join tra la tabella delle situazioni nei match e la tabella delle situazioni
      const hand = req.body.match_situations;

      let responseData = {
        match_state: 'in_progress'
      }
      if (guessedPosition >=0 && checkCardOrder(guessedPosition, guessedSituation.misfortune_index, hand)) {
        // carta vinta
        responseData.complete_situation = {
          id: guessedSituation.id,
          name: guessedSituation.name,
          misfortune_index: guessedSituation.misfortune_index,
          img_path: guessedSituation.img_path
        };
        await MatchDAO.updateSituationInMatch(guessedSituation.id, match_id, 'Vinta');
        responseData.guess_result = 'correct';
        if (await MatchDAO.getWonSituations(match_id) === 6 || demo) {
          // match vinto
          // non c'è bisogno di aggiornare la partita demo tanto non verrà mai visualizzata
          !demo && await MatchDAO.endMatch(match_id, 'Vittoria');
          responseData.match_state = 'won';
        }
      } else {
        // carta persa
        await MatchDAO.updateSituationInMatch(guessedSituation.id, match_id, 'Persa');
        responseData.guess_result = 'wrong';
        if (await MatchDAO.getLostSituations(match_id) === 3 || demo) {
          // match perso
          !demo && await MatchDAO.endMatch(match_id, 'Sconfitta');
          responseData.match_state = 'lost';
        }
      }

      res.status(201).json(responseData);
    } catch (error) {
      res.status(503).end();
    }
  }
)

// GET /api/matches/<matchId>/situation
app.get('/api/matches/:matchId/situation',
  isLoggedIn,
  async (req, res) => {
    const match_id = parseInt(req.params.matchId);
    const matchExistance = await MatchDAO.getMatch(match_id);
    if (matchExistance.error) {
      return res.status(404).json(matchExistance);
    }

    try {
      const situations = await SituationDAO.getUnseenSituations(match_id);
      const situation = getRandomObjects(situations, 1)[0];
      const round = await MatchDAO.incrementAndGetRound(match_id);
      await MatchDAO.addSituationInMatch(situation.id, match_id, round, null);

      const responseData = {
        id: situation.id,
        name: situation.name,
        img_path: situation.img_path,
      }

      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).end();
    }
  }
)

// GET /api/users/<userId>/matches
app.get('/api/users/:userId/matches', 
  isLoggedIn,
  async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
      const matches = await MatchDAO.getUserMatches(userId);

      const responseData = await Promise.all(
        matches.map(async (match) => {
          const situations = (await MatchDAO.getMatchSituations(match.id))
            .map(situation => ({
              id: situation.id,
              name: situation.name,
              round: situation.round,
              result: situation.result
            }));
          const collected_cards = situations.filter(s => s.result === 'Vinta').length;
          return {
            match_id: match.id,
            match_result: match.result,
            card_collected: collected_cards,
            date: match.date,
            match_situations: situations
          };
        })
      );

      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).end();
    }
  }
);

// POST /api/sessions - login utente, ritorna al client i dati dell'utente
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // messaggio login errato
        return res.status(401).send(info);
      }
      // successo
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contiene l'user autnticato, rimando le info al client
        return res.status(201).json(req.user);
      });
  }) (req, res, next);
});

// GET /api/sessions/current - controllo se c'è una sessione attiva (utente loggato)
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current - logout utente, elimina sessione
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// attiva server express
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
// libraries imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';

// local imports
import * as MatchDAO from './dao/matchDAO.mjs';
import * as SituationDAO from './dao/situationDAO.mjs';
import dayjs from 'dayjs';

// init express
const app = new express();
const port = 3001;
app.use(express.json());
app.use(morgan('dev'));

/*
// expose img folder 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/img', express.static(path.join(__dirname, '..', 'img')));

// set up and enable CORS
const corsOption = {
    // il server accetta richieste solo da qui
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    // permette l'invio di cookies tra domini diversi e l'uso di 
    // Authorization headers se presenti
    credentials: true
};
// applica il middlewere CORS a tutte le routes del server
app.use(cors(corsOption));

// Set up Passport
// - utilizzo della local strategy ceh sfrutta username e password
// - verify è una callback di verifica chiamata con username e
//   password presi dal body della richiesta
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  // retrieve dell'user per vedere se esiste
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
  // se l'utente è valido
  return cb(null, user);
}));

// per salvare l'oggetto user nella sessione
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// quando una richiesta arriva con una sessione attiva, Passport 
// richiama questa funzione per ricostruire req.user
passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

// middlewere di autenticazione da applicare poi a route
// specifiche
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
*/

/*** Utils ***/
function getRandomObjects(array, n) {
  const arrayCopy = [...array];
  const result = [];
    
  for (let i = 0; i < n; i++) {
    // Scelgo un indice casuale dall'array rimanente
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    // Rimuovo l'elemento selezionato dall'array copia e lo aggiungo al risultato
    const [selectedObject] = arrayCopy.splice(randomIndex, 1);
    result.push(selectedObject);
  }
    
  return result;
}

//  A  B  C  D
// 0 1  2  3  4
function checkCardOrder(position, misfortune_index, hand) {
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
// POST /api/matches/new - Starting a match
app.post('/api/matches/new', [
    check('demo').isString().isIn(['Yes', 'No'])
  ], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }

    //const user_id = req.body.demo === 'No' ? req.session.user.id : null;
    const user_id = 1; // MOMENTANEO PER TESTING PRIMA DI PASSPORT
    try {
      const match_id = await MatchDAO.addMatch(user_id);

      const allSituations = await SituationDAO.getAllSituations();
      const someSituations = getRandomObjects(allSituations, 4);
      const startingHand = someSituations.slice(0, 3);
      const tableSituation = someSituations[3];

      await Promise.all(startingHand.map(situation => 
        MatchDAO.addSituationInMatch(situation.id, match_id, 0, 'Won'))
      );

      // null poichè devo aspettare la risposta del client per l'esito del guess
      await MatchDAO.addSituationInMatch(tableSituation.id, match_id, 0, null);

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

// GET /api/matches/<matchId>/situation - Get a new situation for a match
app.get('/api/matches/:matchId/situation',
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

// POST /api/matches/<matchId>/guess - Guess card position
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
    
    try {
      const end_timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const {true_situation_id, start_timestamp} = await MatchDAO.getGuessStartingTime(match_id);

      // verifico che siano effettivamente passati al massimo 30s + un delta, e che
      // la situazione indovinata sia quella richiesta prima dal client
      if (dayjs(end_timestamp).diff(start_timestamp, 'second') > 31 ||
          req.body.guessed_situation_id !== true_situation_id) {
        return res.status(422).json({error: 'Guess time exceeded or wrong situation guessed'});
      }
      
      const guessedSituation = await SituationDAO.getSituationById(req.body.guessed_situation_id);
      const guessedPosition = req.body.guessed_position;
      const hand = req.body.match_situations;

      let responseData = {
        match_state: 'in_progress',
        complete_situation: {}
      }
      if (guessedPosition >=0 && checkCardOrder(guessedPosition, guessedSituation.misfortune_index, hand)) {
        // carta vinta
        responseData.complete_situation = {
          id: guessedSituation.id,
          name: guessedSituation.name,
          misfortune_index: guessedSituation.misfortune_index,
          img_path: guessedSituation.img_path
        };
        await MatchDAO.updateSituationInMatch(guessedSituation.id, match_id, 'Won');
        responseData.guess_result = 'correct';
        if (await MatchDAO.getWonSituations(match_id) === 6) {
          // match vinto
          await MatchDAO.endMatch(match_id, 'Won');
          responseData.match_state = 'won';
        }
      } else {
        // carta persa
        await MatchDAO.updateSituationInMatch(guessedSituation.id, match_id, 'Lost');
        responseData.guess_result = 'wrong';
        if (await MatchDAO.getLostSituations(match_id) === 3) {
          // match perso
          await MatchDAO.endMatch(match_id, 'Lost');
          responseData.match_state = 'lost';
        }
      }

      res.status(201).json(responseData);
    } catch (error) {
      res.status(503).end();
    }
  }
)

// GET /api/users/<userId>/matches - Get the match history for a user
app.get('/api/users/:userId/matches', 
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
          const collected_cards = situations.filter(s => s.result === 'Won').length;
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

/*
// POST /api/sessions - Login of the user, returns the user data to the client
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current - Checks if there's an active session (the user is logged)
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current - Logout of the user, deletes the session
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});
*/

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
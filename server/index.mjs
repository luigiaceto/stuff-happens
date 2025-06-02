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

// init express
const app = new express();
const port = 3001;
app.use(express.json());
app.use(morgan('dev'));

/*** utils ***/
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
    check('user_id').isInt()
  ], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }
    const user_id = req.body.user_id;
    try {
      const match_id = await MatchDAO.addMatch(user_id);
      const situations = await SituationDAO.getAllSituations();
      const startingHand = getRandomObjects(situations, 3);
      
      await Promise.all(startingHand.map(situation => 
        MatchDAO.addSituationInMatch(situation.id, match_id, 'Starting hand', 'Won'))
      );

      const responseData = {
        match_id: match_id,
        situations: startingHand.map(s => ({
          id: s.id,
          name: s.name,
          misfortune_index: s.misfortune_index,
          img_path: s.img_path
        }))
      }

      res.status(201).json(responseData);
    } catch (error) {
      res.status(503).end();
    }
  }
)

// GET /api/matches/<matchId>/situation - Get a new situation for the match
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
    check('guessed_position').isInt(),
    check('match_situations').isArray(),
    check('guessed_situation_id').isInt(),
    check('round').isString()
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
      const guessedSituation = await SituationDAO.getSituationById(req.body.guessed_situation_id);
      const guessedPosition = req.body.guessed_position;
      const hand = req.body.match_situations;
      const round = req.body.round;

      let responseData = {};
      if (guessedPosition >=0 && checkCardOrder(guessedPosition, guessedSituation.misfortune_index, hand)) {
        // card won
        responseData = {
          id: guessedSituation.id,
          name: guessedSituation.name,
          misfortune_index: guessedSituation.misfortune_index,
          img_path: guessedSituation.img_path
        };
        await MatchDAO.addSituationInMatch(guessedSituation.id, match_id, round, 'Won');
      } else {
        // card lost
        await MatchDAO.addSituationInMatch(guessedSituation.id, match_id, round, 'Lost');
      }

      res.status(201).json(responseData);
    } catch (error) {
      res.status(503).end();
    }
  }
)

// PATCH /api/matches/<matchId>/end - End the match
app.patch('/api/matches/:matchId/end', [
    check('result').isString().isIn(['Win', 'Lose']),
    check('user_id').isInt()
  ], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }
    const match_id = parseInt(req.params.matchId);
    const user_id = req.body.user_id;
    const matchExistance = await MatchDAO.getMatch(match_id);
    if (matchExistance.error) {
      return res.status(404).json(matchExistance);
    }
    try {
      // utente anonimo
      if (user_id < 0) {
        await MatchDAO.deleteMatch(match_id);
        await MatchDAO.deleteMatchSituations(match_id);
      } else {
        await MatchDAO.endMatch(match_id, req.body.result);     
      }
      res.status(200).json();
    } catch (error) {
      res.status(503).end();
    }
  }
);

// GET /api/users/<userId>/matches - Get the match history for a user
app.get('/api/users/:userId/matches', 
  async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
      const matches = await MatchDAO.getUserMatches(userId);

      const responseData = await Promise.all(
        matches.map(async (match) => {
          const situations = await MatchDAO.getMatchSituations(match.id);
          const collected_cards = situations.filter(s => s.result !== 'Lost').length;
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

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
import dayjs from "dayjs";
import db from "../db.mjs";
import { Match, Situation } from "../models.mjs";

export const addMatch = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO match (user_id, result, terminated, date) VALUES (?, ?, ?, ?)";
    db.run(sql, [user_id, null, 'No', dayjs().format('YYYY-MM-DD')], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export const getMatch = (match_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM match WHERE id = ?";
    db.get(sql, [match_id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        const match = new Match(
          row.id,
          row.user_id,
          row.result,
          row.collected_cards,
          row.terminated,
          row.date
        );
        resolve(match);
      } else {
        resolve({error: "Match not found"});
      }
    });
  });
}

export const endMatch = (match_id, result) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE match SET result = ?, terminated = 'Yes' WHERE id = ?";
    db.run(sql, [result, match_id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

export const addSituationInMatch = (situation_id, match_id, round, result) => {
  // non mi serve il timestamp per le carte iniziali
  const timestamp = round === 'Starting hand' ? null : dayjs().format('YYYY-MM-DD HH:mm:ss');

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO situation_in_match (situation_id, match_id, round, result, timestamp) VALUES (?, ?, ?, ?)";
    db.run(sql, [situation_id, match_id, round, result, timestamp], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

export const getMatchSituations = (matchId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * 
      FROM situation_in_match 
      JOIN situation ON situation.id = situation_in_match.situation_id 
      WHERE match_id = ?
    `;
    db.all(sql, [matchId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const situationsInMatch = rows.map(
          r => new Situation(
            r.situation_id,
            r.name,
            r.misfortune_index,
            r.img_path,
            r.match_id,
            r.round,
            r.result
          )
        );
        resolve(situationsInMatch);
      }
    });
  });
}

export const getUserMatches = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM match WHERE user_id = ? and terminated = 'Yes'";
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const matches = rows.map(
          r => new Match(
            r.id,
            r.user_id,
            r.result,
            r.collected_cards,
            r.terminated,
            r.date
          )
        );
        resolve(matches);
      }
    });
  });
}

export const deleteMatch = (matchId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM match WHERE id = ?";
    db.run(sql, [matchId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

export const deleteMatchSituations = (matchId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM situation_in_match WHERE match_id = ?";
    db.run(sql, [matchId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

// cleans-up the match table
export const clearMatches = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM match";
    db.run(sql, [], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

// cleans-up the situation_in_match table
export const clearSituationsInMatch = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM situation_in_match";
    db.run(sql, [], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}
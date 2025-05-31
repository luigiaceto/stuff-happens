import db from "../db.mjs";
import SituationInMatch from "../models.mjs";

export const addSituationInMatch = (situation_id, match_id, round, result) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO situations_in_match (situation_id, match_id, round, result) VALUES (?, ?, ?, ?)";
    db.run(sql, [situation_id, match_id, round, result], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

export const getMatchSituations = (matchId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM situations_in_match WHERE match_id = ?";
    db.all(sql, [matchId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const situationsInMatch = rows.map(
          r => new SituationInMatch(
            r.situation_id,
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
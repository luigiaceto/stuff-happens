import db from "../db.mjs";
import Match from "../models/Match.mjs";

export const addMatch = (match) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO matches (user_id, result, collected_cards, terminated, date) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [match.user_id, match.result, match.collected_cards, match.terminated, match.date], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

export const getUserMatches = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM matches WHERE user_id = ?";
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
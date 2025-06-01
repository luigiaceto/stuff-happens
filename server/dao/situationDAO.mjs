import db from "../db.mjs";
import Situation from "../models/Situation.mjs";

export const addSituation = (situation) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO situation (name, misfortune_index, img_path) VALUES (?, ?, ?)";
    db.run(sql, [situation.name, situation.misfortune_index, situation.img_path], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export const getAllSituations = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM situation";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const situations = rows.map(
          r => new Situation(
            r.id,
            r.name,
            r.misfortune_index,
            r.img_path
        ));
        resolve(situations);
      }
    });
  });
}

export const getSituationById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM situation WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        const situation = new Situation(
          row.id,
          row.name,
          row.misfortune_index,
          row.img_path
        );
        resolve(situation);
      } else {
        resolve(null);
      }
    });
  });
}
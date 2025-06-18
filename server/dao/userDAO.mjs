import db from "../db.mjs";
import crypto from 'crypto';

export const addUser = (name, email, password, salt, profile_pic) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO user(name, email, password, salt, profile_pic) VALUES(?, ?, ?, ?, ?)";
    db.run(sql, [name, email, password, salt, profile_pic], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export const clearUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM user";
    db.run(sql, [], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("ok");
      }
    });
  });
}

export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, email: row.email, name: row.name, profile_pic: row.profile_pic};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};
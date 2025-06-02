import sqlite from 'sqlite3';

const db = new sqlite.Database('./database.sqlite', (err) => {
	if (err) {
		console.log('Error loading the db');
		throw err;
	}
});

export default db;
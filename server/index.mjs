// imports
import express from 'express';

// init express
const app = new express();
const port = 3001;
app.use(express.json());
app.use(morgan('dev'));

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
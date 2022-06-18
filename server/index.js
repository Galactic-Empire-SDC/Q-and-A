const express = require('express');
require('dotenv').config();
const db = require('./qaDB');

const app = express();
module.exports.app = app;

app.use(express.json());

app.listen(process.env.PORT);
console.log('listening at port', process.env.PORT);

app.get('/qa/questions', (req, res) => {
  db.getQuestions(req, res);
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  db.getAnswers(req, res);
})

const express = require('express');
require('dotenv').config();
const db = require('./qaDB');

const app = express();
module.exports.app = app;

app.use(express.json());

app.listen(process.env.PORT);
console.log('listening at port', process.env.PORT);

app.get('/qa/questions', (req, res) => {
  console.log('in server, question api', req);
  db.getQuestions(req, res);
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log('in server, answers api', req);
  db.getAnswers(req, res);
})


// app.post('/qa/questions', (req, res) => {
//   console.log('in server, adding question', req)
//   db.addQuestion(req, res)
// })
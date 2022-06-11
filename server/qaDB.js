const {Client} = require('pg');
require('dotenv').config();

const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

db.connect();

const getQuestions = (req, res) => {
  console.log('inside db question: req =', req.query);

  const queryString =
  `SELECT q.question_id, q.question_body, q.asker_name, q.question_helpfulness,
    (SELECT json_object_agg(a.answer_id,
      json_build_object (
        'id', a.answer_id,
        'body', a.body,
        'date', a.date,
        'answerer_name', a.answerer_name,
        'helpfulness', a.helpfulness,
        'photos', array_to_join
        (SELECT array_agg(
          json_build_object(
            'id', ap.id,
            'url', ap.url
            )
          )
        FROM answers_photo AS ap
        WHERE answer_id = a.answer_id))) as answers
    FROM answers AS a
    WHERE question_id = q.question_id
    )
  FROM questions AS q
  WHERE product_id = $1
  LIMIT $2
  OFFSET $3`;

  const queryString = `SELECT * FROM questions WHERE product_id = ${req.query.product_id};`
  db.query(queryString)
  .then((results) => {
    res.status(200).send(results.rows);
  })
  .catch((err) => {
    res.status(500);
    res.send(err);
  })
}
// to_timestamp(date_written) as time_from_epoch
// (product_id, body, asker_name, asker_email, reported, helpful)
const getAnswers = (req, res) => {
  console.log('inside db answers: req =', req.params);
  const queryString = `SELECT * FROM get_answers_data(${req.params.question_id}, ${req.params.count}, ${req.params.page});`;
  db.query(queryString)
  .then((results) => {
    res.status(200).send(results);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
}

const getAnswerPhotos = (req, res) => {
  const queryString = `SELECT *, ARRAY_AGG(url || '') FROM answers, answers_photos WHERE answer_id;`

}

const addQuestion = (req, res) => {
  console.log('inside db addQuestion: req ', req);
  const queryString = 'INSERT INTO questions VALUES ()'
}

module.exports = {
  getQuestions,
  getAnswers
}
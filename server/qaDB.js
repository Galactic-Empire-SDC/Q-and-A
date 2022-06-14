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
  `SELECT q.product_id ,
  (SELECT json_agg (
  json_build_object (
    'question_id', q.question_id,
    'question_body', q.question_body,
    'question_date', (SELECT TO_TIMESTAMP(question_date / 1000)::date FROM questions WHERE question_id = q.question_id),
    'asker_name', q.asker_name,
    'question_helpfulness', q.question_helpfulness,
    'reported', q.reported,
	  'photos',(SELECT json_object_agg(a.answer_id,
		 json_build_object (
			'id', a.answer_id,
			'body', a.body,
			'date', (SELECT TO_TIMESTAMP(date / 1000)::date FROM answers WHERE answer_id = a.answer_id),
		  	'answerer_name', a.answerer_name,
			'helpfulness', a.helpfulness,
			'photos', (SELECT array_agg (ap.url)
		FROM answers_photos AS ap
	   	WHERE answer_id = a.answer_id ))) as answers
	  FROM answers AS a
	  WHERE question = q.question_id
	  )
   )) as results
 )
 FROM questions q
 WHERE product_id = ${req.query.product_id}
 GROUP BY q.product_id
  `
  // const queryString = `SELECT * FROM questions WHERE product_id = ${req.query.product_id};`
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
  const queryString =
  `SELECT
	a.question,
	(SELECT
	json_agg((json_build_object(
 		'answer_id', a.answer_id,
		'body', a.body,
		'date', (SELECT TO_TIMESTAMP(date / 1000)::date FROM answers WHERE answer_id = a.answer_id),
		'answerer_name', a.answerer_name,
		'helpfulness', a.helpfulness,
		'photos', (SELECT array_agg
			(json_build_object(
				'id', ap.id,
				'url', ap.url
			))
			FROM answers_photos AS ap
			WHERE answer_id = a.answer_id)
	)))as results)
	FROM answers AS a
	WHERE question = ${req.params.question_id}
  GROUP BY a.question
  `
  db.query(queryString)
  .then((results) => {
    console.log(results);
    res.status(200).send(results.rows[0]);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
}

const getAnswerPhotos = (req, res) => {
  const queryString = `SELECT *, ARRAY_AGG(url || '') FROM answers, answers_photos WHERE answer_id;`

}

module.exports = {
  getQuestions,
  getAnswers
}
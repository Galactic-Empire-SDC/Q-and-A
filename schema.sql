DROP DATABASE IF EXISTS qadb;
CREATE DATABASE qadb;
\c qadb;


DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  question_body TEXT NOT NULL,
  question_date BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported BOOLEAN NOT NULL,
  question_helpfulness INT NOT NULL
);

DROP TABLE IF EXISTS answers CASCADE;
CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  question INT references questions (question_id),
  body TEXT NOT NULL,
  date BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported BOOLEAN NOT NULL,
  helpfulness INT NOT NULL
);

DROP TABLE IF EXISTS answers_photos CASCADE;
CREATE TABLE answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INT references answers (answer_id),
  url TEXT NOT NULL
);

-- COPY questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM '/Users/esmy/Dev/sdc-data/questions.csv' delimiter ',' CSV HEADER ;

-- COPY answers (answer_id, question, body, date, answerer_name, answerer_email, reported, helpfulness) FROM '/Users/esmy/Dev/sdc-data/answers.csv' delimiter ',' CSV HEADER;

-- COPY answers_photos (id, answer_id, url) FROM '/Users/esmy/Dev/sdc-data/answers_photos.csv' delimiter ',' CSV HEADER;


CREATE INDEX questionIndex ON questions (question_id);
CREATE INDEX productForeignkeyIndex ON questions (product_id);
CREATE INDEX answersIndex ON answers (answer_id)
CREATE INDEX questionForeignKeyIndex ON answers (question);
CREATE INDEX answersPhotoIndex ON answers_photos (id);
CREATE INDEX answersIdForeignKeyIndex ON answers_photos (answer_id);
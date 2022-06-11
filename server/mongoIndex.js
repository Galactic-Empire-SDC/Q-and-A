const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:3000/qa/questions', (err)=>{
  if(err) {
    console.log(err);
    return;
  }
  console.log('connected to mongo')
});

const questionSchema = new mongoose.Schema({
  product_id: Number,
  question_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  email: String
})

const answerSchema = new mongoose.Schema({
  answer_id: Number,
  question_id: Number,
  body: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number,
  photos: [{url: String}],
  email: String
})

const qnaQuestion = mongoose.model('qna_Question', questionSchema);
const qnaAnswer = mongoose.model('qna_Answer', answerSchema);

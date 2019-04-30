const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionResponseSchema = Schema({
   quizId : {
      ref: 'Quiz',
      type: Schema.Types.ObjectId
   },
   questionId : Schema.Types.ObjectId,
   userId: Schema.Types.ObjectId,
   optionResponded: Number,
   correct: Boolean
})

module.exports = mongoose.model('QuestionResponse', questionResponseSchema)
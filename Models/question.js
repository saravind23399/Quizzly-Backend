const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = Schema({
    quizId: Schema.Types.ObjectId,
    questionNumber: Number,
    questionText: String,
    questionImagePath: String,
    option1Text: String,
    option2Text: String,
    option3Text: String,
    option4Text: String,
    correctOptionNumber: Number
})

module.exports = mongoose.model('Question', questionSchema)
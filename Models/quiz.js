const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = Schema({
    createdBy: Schema.Types.ObjectId,
    quizTitle: String,
    postedOn: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Quiz', quizSchema)
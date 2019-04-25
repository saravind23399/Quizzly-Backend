const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    username: String,
    password: String,
    role: String  
})

module.exports = mongoose.model('User', userSchema)
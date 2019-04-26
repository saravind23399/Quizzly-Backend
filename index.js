const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyparser = require('body-parser')

const config = require('./Config/config')

const app = express()
const PORT = process.env.PORT | 3000

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const userRoute = require('./Routes/user')
const questionRoute = require('./Routes/question')
const quizRoute = require('./Routes/quiz')

app.use('/user', userRoute)
app.use('/quiz', quizRoute)
app.use('/question', questionRoute)

app.listen (PORT, (startError)=>{
    if(startError){
        console.log('Cannot Start Server!')
    } else {
        mongoose.connect(config.production? config.databaseConfig.productionDbUrl : config.databaseConfig.devDbUrl, {useNewUrlParser: true} ,(dbError)=>{
        if(dbError){
            console.log('Cannot Connect to Database')
        } else {
            console.log('Connected to Quizzly Server @ Port ' + PORT)
        }
    })
    }
})
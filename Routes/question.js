const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const config = require('../Config/config')
const quizModel = require('../Models/quiz')
const questionModel = require('../Models/question')
const questionResponseModel = require('../Models/questionResponse')


router.get('/getQuestion', (req, res) => {
    questionModel.findById(req.body.id, (findError, findDocs) => {
        if (findError) {
            res.json({
                success: false,
                message: 'Cannot find requested Question',
                debug: config.production ? undefined : findError
            })
        } else {
            res.json({
                success: true,
                message: findDocs,
                debug: config.production ? undefined : findDocs
            })
        }
    })
})

router.post('/answerQuestion', (req, res) => {
    questionResponseModel.countDocuments({ questionId: req.body.questionId, userId: req.body.userId }, (countError, count) => {
        if (countError) {
            res.json({
                success: false,
                message: 'Cannot record Question Response',
                debug: config.production ? undefined : countError
            })
        } else {
            if (count == 0) {
                const newQuestionResponse = questionResponseModel({
                    quizId: req.body.quizId,
                    questionId: req.body.questionId,
                    userId: req.body.userId,
                    optionResponded: req.body.optionResponded,
                    correct: req.body.correct
                })

                newQuestionResponse.save((saveError, saveDocs) => {
                    if (saveError) {
                        res.json({
                            success: false,
                            message: 'Cannot record Question Response',
                            debug: config.production ? undefined : saveError
                        })
                    } else {
                        res.json({
                            success: true,
                            message: 'New Question Response recorded!',
                            debug: config.production ? undefined : saveDocs
                        })
                    }
                })
            } else {
                res.json({
                    success: true,
                    message: 'Question has been already answered!',
                    debug: config.production ? undefined : count
                })
            }
        }
    })
})

router.post('/newQuestion', (req, res) => {
    const newQuestion = questionModel({
        quizId: req.body.quizId,
        questionNumber: req.body.questionNumber,
        questionText: req.body.questionText,
        questionImagePath: req.body.questionImagePath,
        option1Text: req.body.option1Text,
        option2Text: req.body.option2Text,
        option3Text: req.body.option3Text,
        option4Text: req.body.option4Text,
        correctOptionNumber: req.body.correctOptionNumber
    })

    newQuestion.save((saveError, saveDocs) => {
        if (saveError) {
            res.json({
                success: false,
                message: 'Cannot create a new Question',
                debug: config.production ? undefined : saveError
            })
        } else {
            res.json({
                success: true,
                message: 'New Question Created!',
                debug: config.production ? undefined : saveDocs
            })
        }
    })
})

module.exports = router
const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const config = require('../Config/config')
const userModel = require('../Models/user')
const quizModel = require('../Models/quiz')
const questionModel = require('../Models/question')
const questionResponseModel = require('../Models/questionResponse')


router.get('/allQuizes', (req, res) => {
    quizModel.find({}).sort({ postedOn: -1 }).exec((findError, findDocs) => {
        if (findError) {
            res.json({
                success: false,
                message: 'Cannot get Quizes',
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

router.post('/getQuiz', (req, res) => {
    quizModel.findById(req.body.quizId, (findError, findDocs) => {
        if (findError) {
            res.json({
                success: false,
                message: 'Cannot find requested Quiz',
                debug: config.production ? undefined : findError
            })
        } else {
            questionResponseModel.countDocuments({ quizId: req.body.quizId, userId: req.body.userId }, (countError, count) => {
                if (countError) {
                    res.json({
                        success: false,
                        message: 'Error in parsing data. Try again',
                        debug: config.production ? undefined : countError
                    })
                } else {
                    if (count == 0) {
                        questionModel.find({ quizId: req.body.quizId }, (questionFindError, questions) => {
                            if (questionFindError) {
                                res.json({
                                    success: false,
                                    message: 'Error in parsing data. Try again',
                                    debug: config.production ? undefined : questionFindError
                                })
                            } else {
                                res.json({
                                    success: true,
                                    message: {
                                        quiz: findDocs,
                                        questions: questions
                                    },
                                    debug: config.production ? undefined : findDocs
                                })
                            }
                        })
                    } else {
                        res.json({
                            success: true,
                            message: 'You have already answered this quiz!',
                            debug: config.production ? undefined : findDocs
                        })
                    }
                }
            })
        }
    })
})

router.post('/getQuizScore', (req, res) => {
    questionResponseModel.find({ quizId: req.body.quizId, userId: req.body.userId }, (findError, findDocs) => {
        if (findError) {
            res.json({
                success: false,
                message: 'Cannot get score',
                debug: config.production ? undefined : findError
            })
        } else {
            const total = findDocs.length
            var correctAnswers = 0;

            findDocs.forEach(response => {
                if (response.correct) {
                    correctAnswers += 1
                }
            });

            res.json({
                success: true,
                message: {
                    correctAnswers: correctAnswers,
                    totalQuestions: total,
                    percentage: correctAnswers / total
                },
                debug: config.production ? undefined : { findDocs }
            })
        }
    })
})

router.post('/postQuiz', (req, res) => {
    const newQuiz = quizModel({
        quizTitle: req.body.quizTitle,
        createdBy: req.body.createdBy
    })

    newQuiz.save((saveError, saveDocs) => {
        if (saveError) {
            res.json({
                success: false,
                message: 'Cannot create a new Quiz',
                debug: config.production ? undefined : saveError
            })
        } else {
            res.json({
                success: true,
                message: 'New Quiz Created!',
                debug: config.production ? undefined : saveDocs
            })
        }
    })
})

module.exports = router
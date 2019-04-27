const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const config = require('../Config/config')
const userModel = require('../Models/user')

router.post('/authenticate', (req, res) => {
    userModel.find({ username: req.body.username }, { username: 1, password: 1, role: 1 }, (findError, findDocs) => {
        if (findError) {
            res.json({
                success: false,
                message: 'Cannot Login. Please try again',
                debug: config.production ? undefined : findError
            })
        } else {
            if (findDocs.length == 0) {
                res.json({
                    success: false,
                    message: 'Username not found. Please register',
                    debug: config.production ? undefined : findDocs
                })
            } else {
                bcrypt.compare(req.body.password, findDocs[0].password, (compareError, compareSuccess) => {
                    if (compareSuccess) {
                        res.json({
                            success: true,
                            message: 'Login Successfull',
                            role: findDocs[0].role,
                            debug: config.production ? undefined : findDocs
                        })
                    } else {
                        res.json({
                            success: false,
                            message: 'Password incorrect',
                            debug: config.production ? undefined : findDocs
                        })
                    }
                })
            }
        }
    })
})

router.post('/register', (req, res) => {
    userModel.countDocuments({ username: req.body.username }, (countError, count) => {
        if (countError) {
            res.json({
                success: false,
                message: 'Cannot register new user',
                debug: config.production ? undefined : countError
            })
        } else {
            if (count == 1) {
                res.json({
                    success: false,
                    message: 'Username already registered',
                })
            } else {
                bcrypt.genSalt((saltError, salt) => {
                    if (saltError) {
                        res.json({
                            success: false,
                            message: 'Cannot register new user',
                            debug: config.production ? undefined : saltError
                        })
                    } else {
                        bcrypt.hash(req.body.password, salt, (hashError, hashedPassword) => {
                            if (hashError) {
                                res.json({
                                    success: false,
                                    message: 'Cannot register new user',
                                    debug: config.production ? undefined : hashError
                                })
                            } else {
                                const newUser = userModel({
                                    username: req.body.username,
                                    password: hashedPassword,
                                    role: 'user'
                                })

                                newUser.save((saveError, saveDocs) => {
                                    if (saveError) {
                                        res.json({
                                            success: false,
                                            message: 'Cannot register new user',
                                            debug: config.production ? undefined : saveError
                                        })
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Registration Successfull !',
                                            userId: saveDocs._id,
                                            debug: config.production ? undefined : saveDocs
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})

router.get('/ping', (req, res) => {
    res.json({
        success: true,
        message: 'Server live at /user'
    })
})

module.exports = router
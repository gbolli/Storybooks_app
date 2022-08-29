const express = require('express')
// const passport = require('../config/passport');
const passport = require('passport')
const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),  // failure
    (req, res) => { 
        res.redirect('/dashboard')         // success
    })

module.exports = router
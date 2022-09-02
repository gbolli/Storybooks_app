const express = require('express')
const router = express.Router();
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// @desc    Show Add Page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    Show Single Story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()
        if (!story) return res.render('error/404')
        if (story.user._id != req.user.id && story.status === "private") {
            return res.redirect('/stories')
        } else {
            res.render('stories/show', { story })
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Process Add Form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Show All Stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', { stories })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Show Edit Page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        // const story = await Story.findOne({ _id: req.params.id }).lean()
        const story = await Story.findById(req.params.id).lean()
        if (!story) return res.render('error/404')
        if (story.user != req.user.id) {
            return res.redirect('/stories')
        } else {
            res.render('stories/edit', { story })
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Update Story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
        if (!story) return res.render('error/404')
        if (story.user != req.user.id) {
            return res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate( { _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Delete Story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove( { _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router
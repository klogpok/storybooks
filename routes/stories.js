const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Load Story Model
const Story = mongoose.model('stories');

// Load User Model
const User = mongoose.model('users');

router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

// Add story router
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Proccess Add Story
router.post('/', ensureAuthenticated, (req, res) => {
  //console.log(req.body.allowComments);
  let allowComments = req.body.allowComments === 'on' ? true : false;

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id
  };

  new Story(newStory)
    .save()
    .then(story => {
      //res.redirect(`/stories/show/${story.id}`);
      res.redirect('/stories');
    })
    .catch(err => console.log(err));
});

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('stories/edit');
});

router.get('/show', (req, res) => {
  res.render('stories/show');
});

module.exports = router;

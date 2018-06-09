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
      //console.log(stories[0].user.id);
      // const filteredStories = stories.filter(
      //   story => story.user.id === stories.user._id
      // );
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

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .then(story => {
      res.render('stories/show', { story });
    });
});

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('stories/edit');
});

module.exports = router;

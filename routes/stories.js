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
  let allowComments = req.body.allowComments == 'on' ? true : false;

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
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      res.render('stories/show', { story });
    });
});

// Edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .then(story => {
      res.render('stories/edit', { story });
    });
});

// Edit Form Proccess
router.put('/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    let allowComments = req.body.allowComments == 'on' ? true : false;

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save().then(() => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

// Delete Story
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.remove({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add comment to comments array
    story.comments.unshift(newComment);
    story.save().then(story => res.redirect(`/stories/show/${story.id}`));
  });
});

module.exports = router;

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

// Load Models
require('./models/User');
require('./models/Story');

// Passport config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Load Handlebars helper
const { trancate, stripTags } = require('./helpers/hbs');

// Mongoose Promise
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(keys.mongoURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

// Load Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load Cookie Parser middleware
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

// Load Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      trancate,
      stripTags
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Load Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Add Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port: ${port}`));

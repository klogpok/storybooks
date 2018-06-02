const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User Model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Mongoose Promise
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(keys.mongoURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

// Habdlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port: ${port}`));

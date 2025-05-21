//initialize env variables, database and loaders.
const config = require('./loaders/config');

//load database
const mongoose = require('./database/mongoose');

//load fabric environemtn
require('./loaders/fabric-loader');


//third party libraries
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

//local imports
let limiter = require('./middleware/rate-limiter-middleware');
const logger = require('./services/logger');
const sessionMiddleware = require('./loaders/express-session-loader');

//Router imports
let indexRouter = require('./routes/index-router');
let apiRouter = require('./routes/api-router');
let universityRouter = require('./routes/university-router');
let studentRouter = require('./routes/student-router');
let verifyRouter = require('./routes/verify-router');

//express
let app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000',
  credentials: true
}));

//middleware
app.use(limiter.rateLimiterMiddlewareInMemory);
app.use(morgan('tiny', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//routers
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/university', universityRouter);
app.use('/student', studentRouter);
app.use('/verify', verifyRouter);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // In development, serve React dev server
  app.get('*', (req, res) => {
    res.redirect('http://localhost:3000');
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response as JSON
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});


module.exports = app;

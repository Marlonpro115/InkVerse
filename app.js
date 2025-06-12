const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const flash = require('express-flash');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('./lib/db');

const app = express();
const PORT = 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 día
  store: new session.MemoryStore(),
  saveUninitialized: false,
  resave: false,
  secret: 'secret'
}));

app.use(flash());

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      name: req.session.user.name,
      email: req.session.user.email,
      username: req.session.user.username || null,
      profile_picture: req.session.user.profile_picture || null,
      profile_cover: req.session.user.profile_cover || null,
    };
  } else {
    res.locals.user = null;
  }
  next();
});

// Main routes
const indexRouter = require('./routes/index');
const booksMainRouter = require('./routes/main/books_main');

// Dashboard routes
const booksRouter = require('./routes/dashboard/books');
const authorsRouter = require('./routes/dashboard/authors');
const categoriesRouter = require('./routes/dashboard/categories');
const publishersRouter = require('./routes/dashboard/publishers');
const dashboardRouter = require('./routes/dashboard/index');

// Authentication routes
const authRouter = require('./routes/auth/auth');
const registerRouter = require('./routes/auth/register');
const forgotPasswordRouter = require('./routes/auth/forgot-password');

// Profile route
const profileRouter = require('./routes/main/profile/index');

// Main routes
app.use('/', indexRouter);
app.use('/books', booksMainRouter);

// Dashboard routes
app.use('/dashboard', dashboardRouter);
app.use('/dashboard/books', booksRouter);
app.use('/dashboard/authors', authorsRouter);
app.use('/dashboard/categories', categoriesRouter);
app.use('/dashboard/publishers', publishersRouter);

// Authentication routes
app.use('/auth', authRouter);
app.use('/auth/register', registerRouter);
app.use('/auth/forgot-password', forgotPasswordRouter);

// Profile route
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('404');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
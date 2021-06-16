var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const dbUtil = require('./db/dbUtil');
var port = process.env.PORT || 3000;

dbUtil.mongooseConenct(() => {
  var usersRouter = require('./routes/users');
  var dashboardRouter = require('./routes/dashboard');

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
   }));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  })); 
  app.use(cookieParser());
  app.set('static', __dirname);
  app.use('/static', express.static( path.resolve(__dirname,'public')));
  
  //setting multer
  // var multer = require('multer');
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "./GOT");
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, file.fieldname + "-" + Date.now());
  //   },
  // });
  // app.use(multer({storage}).single('asd'));
  // app.use(multer({storage}).array('sxa'));

  app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  });
  app.use('/api/users', usersRouter);
  app.use('/api/dashboard', dashboardRouter);
  
  
  
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.sendStatus(err.status || 500);
  });
  
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })
});
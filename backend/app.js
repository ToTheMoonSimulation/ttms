var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const dbUtil = require('./db/dbUtil');
var port = process.env.PORT || 3000; //배포 서버에서 설정된 PORT 환경 변수가 있다면 그것을 쓰고 없으면 3000번 쓰기.

//DB 연결 수립 완료 후 express 웹서버 생성
//반드시 DB 연결 수립 완료 후 웹서버 생성하도록 콜백으로 넘김
dbUtil.mongooseConenct(() => {
  var usersRouter = require('./routes/users');
  var dashboardRouter = require('./routes/dashboard');
  var playRouter = require('./routes/play');
  var adminRouter = require('./routes/admin');

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  //미들웨어 등록
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

  //루트 디렉토리는 get으로 설정. 만약 use로 한다면 '/' 으로 시작하는 모든 디렉토리는 '/' 루트 디렉토리로 연결됨.
  app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  });
  app.use('/api/users', usersRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/play', playRouter);
  app.use('/api/admin', adminRouter);
  
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
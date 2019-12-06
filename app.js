var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
var fs = require('fs');
var cookies = require('request-cookies');
var parser = require('node-html-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.status(err.status || 500);
  res.render('error');
});



const options = {
  url: "https://account.playkakaogames.com/",
  method: "GET",
  headers: {}
}

jar = new cookies.CookieJar();
//make initial request to login page
loginoptions = options;
loginoptions.url = loginoptions.url + "bdo/login"

var loginCall = function(options, jar) {
  request(options, function(err, res, body) {
    setHeaders = res.headers['set-cookie'];
    if(setHeaders && setHeaders.length == 2) {
      jar.add(new cookies.Cookie(setHeaders[0]), options.url);
      jar.add(new cookies.Cookie(setHeaders[1]), options.url);

      csrfString = new RegExp('"_csrf" value=".*"').exec(body);
      if(csrfString && csrfString.length > 0) {
        perform_loginCall(options, jar, csrfString[0].toString().split('\"')[3]);
      }
    }
  });
};

var perform_loginCall = function(options, jar, csrf) {
    //build options for perform_login call
    perform_loginOptions = options;
    perform_loginOptions.method = "POST";
    perform_loginOptions.scheme = "https";
    perform_loginOptions.url = perform_loginOptions.url + "/bdo/perform_login";
    perform_loginOptions.formData = JSON.stringify({
      bdoLogin: "true",
      username: "BDO_USERNAME",
      password: "BDO_PASSWORD",
      "_csrf": csrf
    });
    perform_loginOptions.headers = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,pl;q=0.8,zh;q=0.7,zh-TW;q=0.6",
      "cache-control": "no-cache",
      "content-length": "110",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "set-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "upgrade-insecure-requests": 1,
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    };
    perform_loginOptions.cookie = jar.getCookieHeaderString(options.url)
    

    request(perform_loginOptions, function(err, res, body) {
      console.log("");
    });
};

loginCall(options, jar);

module.exports = app;
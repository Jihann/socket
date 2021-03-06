var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.user == null) {
    res.redirect('/login');
  } else {
    res.sendfile('views/index.html');
  }
});

//login
router.get('/login', function(req, res) {
  res.render('login')
});

//login
router.post('/login', function(req, res) {
  var username = req.body.name;
  console.log('-------------username：' + username);
  if(username == null || username == '') {
    res.redirect('/login');
  }else {
    res.cookie('user', username, {maxAge: 1000 * 60 * 60 * 24 * 30});
    res.redirect('/');
  }
});

module.exports = router;

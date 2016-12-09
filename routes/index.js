var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// http://localhost:3000/verify
// https://nuuneoi.com/blog/blog.php?read_id=882
// https://github.com/geumatee/LineBotTest/blob/master/routes/verify.js
// https://developers.line.me/ba/u90cdac5120436b4e35bde4e039ec3575/bot
// https://admin-official.line.me/6647483/bot-api/setting
// https://code.visualstudio.com/docs/runtimes/nodejs

//heroku git:remote -a protected-tundra-50195
//heroku logs --tail

var test = "in bot js";


var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(test);
});

app.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/',function(req, res){
  console.log('call function');
  if (req.body != undefined) {
    res.send(JSON.stringify(req.body));
  }else {
    res.send("no body");
  }
});

module.exports = router;
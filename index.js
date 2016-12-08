var app = require('express')();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var bot = require('./bot');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/bot', function (req, res) {
	res.json(bot.findAll());
})

app.get('/', function (req, res) {
	res.send('<h1>Hello Node.js</h1>');
});

app.listen(port , function() {
	console.log('Starting node.js on port ' + port);
});

// https://nuuneoi.com/blog/blog.php?read_id=882

// http://www.siamhtml.com/restful-api-with-node-js-and-express/
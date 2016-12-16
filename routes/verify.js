/*eslint no-undef: "error"*/
/*eslint-env node*/

var express = require('express');
var router = express.Router();

var request = require('request');

var mids;

router.get('/', function(req, res, next) {
    var headers = {
        'Authorization': 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU='
    };

    var options = {
        url: 'https://api.line.me/v1/oauth/verify',
        //proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
            //mids = res.send(body.mid);

            console.log('content: ' + JSON.stringify(body).mid);

        }
    }

    request(options, callback);
});

module.exports = router;
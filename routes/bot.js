var test = "in bot js";


var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/',function(req, res){
  console.log('call function***********************');
  console.log(getAuthorization());

  
  if (req.body != undefined) {
    //console.log('request body: ' + JSON.stringify(req.body));

    var i;
    var header;
    var options;

    for(i = 0; i < req.body.events.length; i++){
      
      if(req.body.events[i].type == 'message'){
        if(req.body.events[i].message.type == 'text'){
          var message = {
            'type': 'text',
            'text': req.body.events[i].message.text
          };

          var data = {
            'replyToken': req.body.events[i].replyToken,
            'messages':[message]
          };

          headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU='
          };

          console.log(JSON.stringify(data));
          console.log("######data.messages########");
          console.log(JSON.stringify(data.messages[0].text));
          console.log("########end######");

          options = {
                  url: 'https://api.line.me/v2/bot/message/reply',
                  //proxy: '',
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(data)
              };

          request(options, function (error, response, body) {
                        console.log("respond " + error + " " + JSON.stringify(response) + " " + JSON.stringify(body) + "############End##########");
                        res.send(JSON.stringify(response));
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                        }else {
                            console.log("Error statusCode" + response.statusCode + "################################################");
                        }
          });

        } else if(req.body.events[i].message.type == 'image') {
                    headers = {
                        'Authorization': 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU='
                    };

                    options = {
                        url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
                        headers: headers,
                        encoding: null,
                        method: 'GET'
                    };
        }
      }
    }
  }else {
    res.send("no body");
  }
});


function getAuthorization(){
  return 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU=';
}

/* GET users listing. */
router.get('/', function(req, res, next) {
 res.send(test);
});

module.exports = router;
var test = "in bot js";


var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var data_img;
var fs = require('fs');

// var gcs = require('@google-cloud/storage')({
//   projectId: '<projectID>',
//   keyFilename: '/app/testfacebook-37d35-firebase-adminsdk-xjhtw-a095d994f6.json'
// });

var streamifier = require('streamifier');

app.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/',function(req, res){
  console.log('call function***********************');
  if (req.body != undefined) {
    //console.log('request body: ' + JSON.stringify(req.body));

    var i;
    var header;
    var options;

    for(i = 0; i < req.body.events.length; i++){
      
      if(req.body.events[i].type == 'message'){
        if(req.body.events[i].message.type == 'text'){

        //   var message = {
        //     'type': 'text',
        //     'text': getText(req.body.events[i].message.text)
        //     //'text': req.body.events[i].message.text
        //     //'text': "TESTTTTT"

        //   };

          var message = {
            "type": "template",
            "altText": "this is a buttons template",
            "template": {
                "type": "buttons",
                "thumbnailImageUrl": "http://images.all-free-download.com/images/graphiclarge/beach_patrol_604977.jpg",
                "title": "Menu",
                "text": "Please select",
                "actions": [
                    {
                        "type": "message",
                        "label": "#ABC",
                        "text": "#ABC"
                    },
                    {
                        "type": "message",
                        "label": "#ABC2",
                        "text": "#ABC2"
                    },
                    {
                        "type": "message",
                        "label": "#ABC3",
                        "text": "#ABC3"
                    }
                ]
            }
          }

        // confirm template
        //   var message = {
        //                 "type": "template",
        //                 "altText": "this is a confirm template",
        //                 "template": {
        //                     "type": "confirm",
        //                     "text": "Are you sure?",
        //                     "actions": [
        //                         {
        //                             "type": "message",
        //                             "label": "Yes",
        //                             "text": "yes"
        //                         },
        //                         {
        //                             "type": "message",
        //                             "label": "No",
        //                             "text": "no"
        //                         }
        //                     ]
        //                 }
        //     }

          var data = {
            'replyToken': req.body.events[i].replyToken,
            'messages':[message]
          };

          headers = {
            'Content-Type': 'application/json',
            'Authorization': getAuthorization()
          };

          //console.log(JSON.stringify(data));
          //console.log("######data.messages########");
          //console.log(JSON.stringify(data.messages[0].text));
          //console.log("########end######");

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
                            //console.log(body);
                            console.log(JSON.stringify(data.messages[0].text));
                        }else {
                            console.log("Error statusCode" + response.statusCode + "################################################");
                        }
          });

        } else if(req.body.events[i].message.type == 'image') {
          
          console.log("########CALL GET IMAGE######");

          headers = {
              'Authorization': getAuthorization()
          };

          options = {
              url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
              headers: headers,
              encoding: null,
              method: 'GET'
          };

          getImage(options, req.body.events[i], res);

        }
      }
    }
  }else {
    res.send("no body");
  }
});



function getImage(options, event, res) {

  request(options, function (error, response, body) {
      // var img_byte_array;
      if (!error && response.statusCode == 200) {
          // console.log('type: ' + typeof(body));
          //console.log("#######BODY######");
          //console.log('content: ' + JSON.stringify(body));
          //console.log("########RESPONSE IMAGE######");
          getProfileURL(event, body, res);
      } else {
          console.log('error');
          res.send("error");
      }
  });
}

function getProfileURL(event, body ,res){

    var image = body;
    console.log("########GET PROFILE URL######");

    var headers = {
        'Authorization': getAuthorization()
    };


    //console.log("########event######"+ JSON.stringify(event));
    //console.log("########userId######"+ event.source.userId);
  
    var options = {
        url: 'https://api.line.me/v2/bot/profile/' + event.source.userId,
        headers: headers,
        method: 'GET'
    };    

    //console.log("########options######"+ JSON.stringify(options));

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            //console.log('GET PROFILE URL content: ' + JSON.stringify(body));
            postAPI(options, body, res , image);
        }else {
           console.log('GET PROFILE URL error: ' + error);
        }
    });
}

function postAPI(event, body ,res ,image){

      //console.log("########SHOW IMAGE######");
      //send image
      var data = JSON.parse(body);
      var photo_meta = {
                  'id': data.userId,
                  'fname': data.displayName,
                  'lname': '',
                  'email': 'hello@selfiprint.com',
                  'profile_url': data.pictureUrl,
                  'share': 0
              };

      var headers = {
          'Content-Type': 'multipart/form-data'
          };

      //console.log("########data######" + JSON.stringify(data));
      //console.log("########photo_meta######" + JSON.stringify(photo_meta));

      var reqPost = request.post({url:'http://console.selfiprint.com/api/1.0/uploadPhoto', headers: headers}, function optionalCallback(err, httpResponse, body) {
          if (err) {
              console.error('upload failed:', err);
          } else {
              console.log('Upload successful!  Server responded with:', body);
          }
      });

      var form = reqPost.form();
      form.append('hashtag', 'selfitest');
      form.append('photo_meta', JSON.stringify(photo_meta));
      form.append('photo_file', image, {
          filename: 'myfile.jpg',
          contentType: 'image/jpg'
      });
      //end send image
}

function getText(str){
    var t = ""
    switch(str) {
    case "1":
        t = "ตอบ 1";
        break;
    case "2":
        t = "ตอบ 2";
        break;
    default:
        t = "ตอบ ไม่มี";
}
  return t;
}

function getAuthorization(){
  return 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU=';
}


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(test);
});



module.exports = router;
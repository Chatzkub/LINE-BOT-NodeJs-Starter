var test = "in bot js";


var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var data_img;

// var gcs = require('@google-cloud/storage')({
//   projectId: '<projectID>',
//   keyFilename: '/app/testfacebook-37d35-firebase-adminsdk-xjhtw-a095d994f6.json'
// });

// var streamifier = require('streamifier');

// var bucket = gcs.bucket('testfacebook-37d35.appspot.com');

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

          headers = {
              'Authorization': getAuthorization()
          };

          options = {
              url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
              headers: headers,
              encoding: null,
              method: 'GET'
          };

          request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // console.log('type: ' + typeof(body));
                  // console.log('content: ' + body);
                  console.log("########GET IMAGE######");
                  //console.log('content json: ' + JSON.stringify(body));
                  //console.log('content json: ' + JSON.stringify(body));
                  data_img = JSON.stringify(body)
                  console.log("########END LOAD IMAGE######");
              } else {
                  console.log('error');
                  res.send("error");
              }
              // console.log("########LOAD IMAGE######");
              //console.log("########DATA######", data_img);

              console.log("########SHOW IMAGE######");

              var photo_meta = {
                        'id': '999999999',
                        'fname': 'fname',
                        'lname': 'lname',
                        'email': 'email',
                        'profile_url': 'profile_url',
                        'share': 'share'
                      };
              var data = {
                        'hashtag': 'selfitest',
                        'photo_meta': photo_meta,
                        'photo_file': data_img
                      };

              var formData = {
                // Pass a simple key-value pair
                my_field: data,
                // Pass data via Buffers
                my_buffer: new Buffer(data_img),

              };

              console.log("########formData######" + formData);


              request.post({url:'http://console.selfiprint.com/api/1.0/uploadPhoto', formData: formData}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                  return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
              });


              // var photo_meta = {
              //           'id': '999999999',
              //           'fname': 'fname',
              //           'lname': 'lname',
              //           'email': 'email',
              //           'profile_url': 'profile_url',
              //           'share': 'share'
              //         };
              // var data = {
              //           'hashtag': 'selfitest',
              //           'photo_meta': photo_meta,
              //           'photo_file': data_img
              //         };

                     


              // console.log("########DATA######"+ data);
              // //http://console.selfiprint.com/api/1.0/uploadPhoto
              // options = {
              //           url: '10.20.22.79:1337/api/1.0/uploadPhoto',
              //           method: 'POST',
              //           body: JSON.stringify(data)
              //         };

              // request(options, function (error, response, body) {
              //   console.log("########RESPOND######");
              //   // console.log("statusCode " + response.statusCode);
              //   // console.log("respond " + JSON.stringify(response));
              //   // console.log("error " + error);
              //   // console.log("body " + JSON.stringify(body));
              //   console.log("########END RESPOND######");

              //   res.send(JSON.stringify(response));
              //   if (!error && response.statusCode == 200) {
              //       console.log("########YEAH######"+ data);
              //       console.log(body);
              //   }
              // });
          });
        }
      }
    }
  }else {
    res.send("no body");
  }
});


// function sendImage(){
//   console.log("########SEND IMAGE######");

//   var photo_meta = {
//               'id': '999999999',
//               'fname': 'fname',
//               'lname': 'lname',
//               'email': 'email',
//               'profile_url': 'profile_url',
//               'share': 'share'
//             };
//   var data = {
//               'hashtag': 'hashtag',
//               'photo_meta': photo_meta,
//               'photo_file': data_img
//             };
//   console.log("########DATA######"+ data);

//   options = {
//               url: 'http://console.selfiprint.com/api/1.0/uploadPhoto',
//               method: 'POST',
//               body: JSON.stringify(data)
//             };

//   request(options, function (error, response, body) {
//       console.log("respond " + error + " " + JSON.stringify(response) + " " + JSON.stringify(body));
//       res.send(JSON.stringify(response));
//       if (!error && response.statusCode == 200) {
//           console.log(body);
//       }
//   });
// }

function getAuthorization(){
  return 'Bearer tf9fUp9VHwDxPcN9xZm+/lNoo+tDfA+02hmpiYqWFe1ob4ehXwzJKIvQnZY6mKbS68gai5ebRkhrd93NX5GycjDXrWwHhEjzl0Vx3aRAmuH621KoKsZve23jKAeaq80jRGhuCWMjJg5iQGyTo2zD7AdB04t89/1O/w1cDnyilFU=';
}

router.get('/ABC', function(req, res, next) {
    res.send('ABC');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(test);
    // res.type('jpg'); 
    // var file = bucket.file("temp.jpg");
    // file.download().then(function(data) {
    //     var contents = data[0];
    //     res.end(contents, 'binary');
    // });


  //     var photo_meta = {
  //             'id': '999999999',
  //             'fname': 'fnameData',
  //             'lname': 'lname',
  //             'email': 'email',
  //             'profile_url': 'profile_url',
  //             'share': 'share'
  //           };
  //     var data = {
  //             'hashtag': 'hashtag',
  //             'photo_meta': photo_meta,
  //             'photo_file': 'sdsds'
  //           };

  // console.log("########photo_meta######"+ photo_meta.fname);
  // console.log("########DATA######"+ data.photo_meta.fname);
});



module.exports = router;
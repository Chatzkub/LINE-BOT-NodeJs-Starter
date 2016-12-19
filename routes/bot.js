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

function getImage(options, event, res) {

  request(options, function (error, response, body) {
      // var img_byte_array;
      if (!error && response.statusCode == 200) {
          // console.log('type: ' + typeof(body));
          //console.log("#######BODY######");
          //console.log('content: ' + JSON.stringify(body));
          console.log("########RESPONSE IMAGE######");
          // var body_json_str = JSON.stringify(body);
          // var body_json = JSON.parse(body_json_str);
          // img_byte_array = body_json.data;
          // console.log(img_byte_array);

          //console.log('content json: ' + JSON.stringify(body));
          //console.log("########END LOAD IMAGE######");

          getProfileURL(event, body, res);
      } else {
          console.log('error');
          res.send("error");
      }

      // console.log("########GET MID######");
      // // get Mid

      // var options = {
      //     url: 'https://api.line.me/v1/oauth/verify',
      //     headers: headers
      // };

      // request(options, function (error, response, body) {
      //       if (!error && response.statusCode == 200) {
      //           //res.send(body);
      //           //mids = res.send(body.mid);
      //           console.log('content: ' + JSON.stringify(body));
      //           getProfileURL(event, body, res);
      //       }else {
      //           console.log('error: ' + error);
      //       }
      // });
      // //########END MID######
  });
}


function getProfileURL(event, body ,res){

  var image = body;
  console.log("########GET PROFILE URL######");

  var headers = {
      'Authorization': getAuthorization()
  };


  console.log("########event######"+ JSON.stringify(event));
  console.log("########userId######"+ event.source.userId);

  var options = {
    url: 'https://api.line.me/v2/bot/profile/' + event.source.userId,
    headers: headers,
    method: 'GET'
  };
  console.log("########URL######"+ "https://api.line.me/v2/bot/profile/" + event.source.userId);

  request(options, function (error, response, body) {
        //console.log("respond " + error + " " + JSON.stringify(response) + " " + JSON.stringify(body) + "############End##########");
        if (!error && response.statusCode == 200) {
            //res.send(body);
            //mids = res.send(body.mid);
            //var b = JSON.parse(body)
            console.log('GET PROFILE URL content: ' + JSON.stringify(body));

            getImage(options, body, res , image);
        }else {
           console.log('GET PROFILE URL error: ' + error);
        }
  });
  //########END PROFILE URL######
}

function postAPI(event, body ,res ,image){
      console.log("########SHOW IMAGE######");
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

      console.log("########data######" + data);
      console.log("########photo_meta######" + formData.photo_meta);
      // console.log("########photo_file######" + formData.photo_file);

      // var reqPost = request.post({url:'http://console.selfiprint.com/api/1.0/uploadPhoto', headers: headers}, function optionalCallback(err, httpResponse, body) {
      //     if (err) {
      //         console.error('upload failed:', err);
      //     } else {
      //         console.log('Upload successful!  Server responded with:', body);
      //     }
      // });

      // var form = reqPost.form();
      // form.append('hashtag', 'selfitest');
      // form.append('photo_meta', JSON.stringify(photo_meta));
      // form.append('photo_file', body, {
      //     filename: 'myfile.jpg',
      //     contentType: 'image/jpg'
      // });
      //end send image
}


router.get('/testsendiamge', function(req, res, next) {
    res.send('ABC');


    
    //  var photo_meta = {
    //                     'id': '999999',
    //                     'fname': 'fname',
    //                     'lname': 'lname',
    //                     'email': 'email',
    //                     'profile_url': 'profile_url',
    //                     'share': 'share'
    //                   };

    //           var headers = {
    //               'Content-Type': 'image/jpg'
    //             };


    //           var formData = {
    //             // Pass a simple key-value pair
    //             hashtag: 'selfitest',
    //             photo_meta: JSON.stringify(photo_meta),
    //             photo_file: fs.createReadStream('cat.jpg')
    //             //photo_file: streamifier.createReadStream(body)

    //           };

    //           console.log("########formData######" + formData);
    //           console.log("########photo_meta######" + formData.photo_meta);
    //           console.log("########photo_file######" + formData.photo_file);


    //           request.post({url:'10.20.22.79:1337/api/1.0/uploadPhoto', formData: formData, headers: headers }, function optionalCallback(err, httpResponse, body) {
    //             if (err) {
    //               return console.error('upload failed:', err);
    //             }

    //             console.log("##################################################");
    //             //console.log('httpResponse:', httpResponse);
    //             console.log('Upload successful!  Server responded with:', body);
    //           });

    // var photo_meta = {
    //   'id': '999999',
    //   'fname': 'fname',
    //   'lname': 'lname',
    //   'email': 'email',
    //   'profile_url': 'profile_url',
    //   'share': 'share'
    // };

    // var file    = 'cat.jpg';
    // var options = {
    //   url: 'http://console.selfiprint.com/api/1.0/uploadPhoto',
    //   //url: '10.20.22.79:1337/api/1.0/uploadPhoto',
    //   method: 'POST',
    //   json: true,
    //   formData: {
    //     front: fs.createReadStream(file),
    //     hashtag: 'selfitest',
    //     photo_meta: JSON.stringify(photo_meta),
    //   }
    // };

    // request(options, function(err, resp, body) {
    //   console.log(err, body);
    // });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(test);
});



module.exports = router;
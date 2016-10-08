var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'EAASLu7nF7xcBABUlwSyoDFMslmRDEq2QvjDjkAxEwNTP5SDqTg8nCBvmihwtTTGdyCkNHHFYTFvtZAVNy2sAcGXkXwuchbOSx4mzmZAD0gvIo3ZBMnU8zC8zlo86KUGGlfma1kCqE5BnKvR8EHdWYv08wAynm7OreAD2xZCaDgZDZD') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

router.post('/webhook/', function (req, res) {
  const events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    const event = req.body.entry[0].messaging[i];
    if (event.message && event.message.text) {
      const text = event.message.text;
      console.log(text)
      sendTextMessage(sender, "Text received, echo: " + text);
    }
  }
  res.sendStatus(200);
});

var request = require('request')

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN

function sendTextMessage(sender, text) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

/* webhook */
router.post('/webhook', function (req, res) {
  console.log('webhook!')
  const events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    const event = req.body.entry[0].messaging[i];
    const sender = event.sender.id;
    if (event.message && event.message.text) {
      const text = event.message.text;
      console.log(text)
      sendTextMessage(sender, "Text received, echo: " + text);
    }
  }
  res.sendStatus(200);
});

module.exports = router;

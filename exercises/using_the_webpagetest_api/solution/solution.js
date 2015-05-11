'use strict';

/*
 * The API key below is for perfschool, and getting your own is free.
 * https://www.webpagetest.org/getkey.php
 *
 * Yes. This is a terrible practice. Please be gentle about it.
 * Always keep your API keys in environment variables.
 * Never hard-code them into your app like I just did.
 *
 * See also: http://12factor.net/config
 */
var WPT_API_KEY = 'A.0924adb01b5d0e593e1fc074cb648fe5';

var fs = require('fs');
var path = require('path');
var request = require('request');
var express = require('express');
var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org', WPT_API_KEY);
var localtunnel = require('localtunnel');
var app = express();
var port = process.env.PORT || 7777;

app.set('json spaces', 2);
app.get('/', home);
app.get('/test', test);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function home (req, res) {
  var file = path.join(__dirname, 'index.html');
  var index = fs.readFileSync(file, 'utf8');
  res.send(index);
}

function test (req, res, next) {
  var tunnel;

  console.log('Tunneling http://localhost:%s onto the open web...', port);
  localtunnel(port, ready);

  function ready (err, t) {
    if (err) {
      next(err); return;
    }
    var location = process.env.WPT_LOCATION || 'ec2-us-west-2';
    tunnel = t;
    console.log('Scheduling a WebPageTest job against %s (on "%s")...', t.url, location);
    wpt.runTest(t.url, { location: location }, pull);
  }
  function pull (err, state) {
    if (err) {
      next(err); return;
    }
    welcome(state);
    poll();
    function handle (err, res) {
      if (err) {
        next(err); return;
      }
      var body = read(res.body);

      console.log('(%s) %s', body.statusCode, body.statusText);

      if (body.statusCode < 200) {
        poll(); return;
      }
      respond(body.data.runs[1]);
    }
    function poll () {
      setTimeout(function soon () { request(state.data.jsonUrl, handle); }, 5000);
    }
    function respond (run) {
      tunnel.close();
      res.json({
        timing: {
          ttfb: run.firstView.TTFB,
          speedIndex: run.firstView.SpeedIndex,
          domLoaded: run.firstView.domContentLoadedEventStart
        }
      });
    }
  }
  function welcome (body) {
    console.log([
      'Pulling down results from %s...',
      'It might take a considerable while until the job is completed!',
      'Go grab a coffee or help a workshopper in distress!',
      '',
      'Also, visit the human-readable test result page here:',
      '%s',
      ''
    ].join('\n'), body.data.jsonUrl, body.data.userUrl);
  }
}

function read (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
  }
}

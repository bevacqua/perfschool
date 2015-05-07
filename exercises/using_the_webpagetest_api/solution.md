For comparison, here's the reference solution.

We're obviously using localtunnel again, and pretty much every opportunity
we have from now on will be a good excuse to get our hands on it! Anyways,
got your API key handy? I inlined mine in the `solution.js` file, but you
shouldn't. API keys are precious secrets. Keep them in environment variables.

See: http://12factor.net/config

```js
var localtunnel = require('localtunnel');
var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org', WPT_API_KEY);
```

I've removed logging statements, error handling, tunnel cleanup, and otherwise
"irrelevant" pieces of code from the solution listed below, as to keep
the example brief and focused.

You've already solved it anyways, right!?

```js
function test (req, res, next) {
  localtunnel(port, ready);
  function ready (err, t) {
    wpt.runTest(t.url, { location: 'ec2-us-west-2' }, pull);
  }
  function pull (err, state) {
    poll();
    function handle (err, res) {
      var body = read(res.body);
      if (body.statusCode < 200) {
        poll(); return;
      }
      respond(body.data.runs[1]);
    }
    function poll () {
      setTimeout(function soon () { request(state.data.jsonUrl, handle); }, 5000);
    }
    function respond (run) {
      res.json({
        timing: {
          ttfb: run.firstView.TTFB,
          speedIndex: run.firstView.SpeedIndex,
          domLoaded: run.firstView.domContentLoadedEventStart
        }
      });
    }
  }
}
```

If you've taken your time in this exercise, you've probably noticed the vast
amounts of data that WPT produces for you. This kind of intelligence on how
your website is performing is super-useful when trying to optimize and track
how well your website is performing.

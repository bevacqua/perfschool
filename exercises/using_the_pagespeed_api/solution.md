For comparison, here's the reference solution. Note that we should
close the `tunnel` as soon as we're done with it, but not before!

Aside from that, the implementation is straightforward and mostly
comes down to reading the documentation for both `localtunnel`
and `psi`.

```js
var psi = require('psi');
var localtunnel = require('localtunnel');

function insights (req, res, next) {
  localtunnel(port, tunneled);
  function tunneled (err, tunnel) {
    if (err) {
      next(err); return;
    }
    psi(tunnel.url, stats);
    function stats (err, data) {
      tunnel.close();

      if (err) {
        next(err); return;
      }
      res.json({
        resources: {
          js: data.pageStats.numberJsResources,
          css: data.pageStats.numberCssResources,
          total: data.pageStats.numberResources,
          hosts: data.pageStats.numberHosts
        }
      });
    }
  }
}
```

Although tunneling stuff into the open web is quite freaking cool,
remember that the point in this exercise is more about the ability you
have to run performance tests during continuous integration or even build
processes.

When you automate these performance tests, you're able to define a baseline,
essentially declaring that your application won't be deployable if it's not
performing well enough. We'll come back to the topic of performance baselines
in a future exercise.

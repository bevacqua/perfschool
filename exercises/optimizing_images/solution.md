For comparison, here's the reference solution.

To keep things brief, we went for an on-the-fly solution. We've set up a proxy
at `/lynx?source={cat_image_source}` that uses `request` to pull the image off
the Internet, and then passes that through the GraphicsMagick `gm` module,
letting us set a maximum size for the image, remove EXIF headers, and convert
the image to `jpg`, which are quite small.

The endpoint looks like this:

```js
var gm = require('gm');
var url = require('url');
var path = require('path');
var request = require('request');

app.get('/lynx', lynx);

function lynx (req, res) {
  var src = req.query.source;
  var base = path.basename(src);
  var local = 'http://localhost:' + port;
  var qualified = url.resolve(local, src);
  gm(request(qualified), base)
    .autoOrient()
    .noProfile() // remove exif data
    .resize(600, 600) // set maximum image size
    .stream('jpg') // convert to jpg and avoid bloated gifs
    .pipe(res);
}
```

Once that was out of the way, all that was left was to implement `GET /cats` so
that it returns the proper amount of `<img>` tags pointing at the `/lynx` endpoint,
which will be doing the performance optimizations on the fly.

Here's the endpoint as implemented in the solution, without the bits of the solution
that added randomness, as to not return the same boring kittens over and over.

```js
function cats (req, res) {
  var url = 'https://api.imgur.com/3/gallery/r/kittens';
  var options = {
    headers: { Authorization: 'Client-ID ' + IMGUR_CLIENT_ID },
    qs: { q_size_px: 'small' },
    url: url,
    json: true
  };
  request(options, got);
  function got (err, response) {
    var title = '<title>Optimizing Images!</title>';
    var cats = _.pluck(response.body.data, 'link').slice(0, req.query.amount);
    var html = title + cats.map(toImageTag).join('\n');
    res.contentType('text/html');
    res.end(html);
  }
  function toImageTag (cat) {
    return util.format('<img src="/lynx?source=%s" />', cat);
  }
}
```

In case you didn't know, the HTML5 spec allows you to omit `<head>`, `<body>`, and
`<html>`, while browsers should still be able to figure out how to render some cats.

The reference solution is definitely not the most performant, because it spends a
bunch of time in optimizing the image before serving them, every time. This is useful
during user uploads, because that's usually a one-time thing that's expected to take a
while. If you aren't particularly interested in the image having 100% the provided
resolution, then resizing and optimizing them can bring considerable savings to your
application.

If the images are meant to be displayed, you'll probably want to have an intermediate
step where you get the images, optimize them, and then save them somewhere to be able
to respond with the (already optimized) images immediately, rather than optimize them
on the spot.

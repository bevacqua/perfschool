Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# INTRODUCTION

Image optimization is one of the quickest, simplest, and most effective ways of shrinking
your responses when it comes to websites. The two best ways of optimizing images are:

You can remove artifacts such as `EXIF` and other irrelevant data, pick an efficient
image format such as `WebP` or `jpg`, or otherwise meddle with the binary formatting.

You can make the image physically smaller. Going from `2880x1880` in a typical Macbook
screenshot to `576x376` will drastically reduce the footprint for the image.

It really depends on how you are going to end up using the image to know whether you can
afford to shrink them in resolution or you're just able to modify their binary in order
to reduce their total content.

There's a few tools you can use from both the command-line and from Node.js _(or io.js)_.
Namely, you could use `GraphicsMagick` _(`gm` on `npm`)_, `imagemin`, and dozens of different
tools that are focused on a single image format such as `jpegtran`, `optipng`, `gifsicle`, and
many many others.

# PROBLEM

You are going to implement a `GET /cats` endpoint that receives an `amount` parameter,
as shown below. You are supposed to return an HTML page with that many `<img>` tags.
Only cat pictures are allowed!

```
GET /cats?amount=13
< HTTP/1.1 200 OK
< Content-Type: text/html; charset=utf-8
<
<img src='http://i.imgur.com/WPhNosa.jpg' />
<img src='http://i.imgur.com/qmGTuSw.jpg' />
<img src='http://i.imgur.com/vpLSKxM.jpg' />
<img src='http://i.imgur.com/Hkv4kBK.jpg' />
<img src='http://i.imgur.com/szp6mtc.jpg' />
<img src='http://i.imgur.com/LDi7dQc.jpg' />
<img src='http://i.imgur.com/QTWNuxD.jpg' />
<img src='http://i.imgur.com/blSnwaJ.jpg' />
<img src='http://i.imgur.com/Kd4vU6t.jpg' />
<img src='http://i.imgur.com/GM8I8CN.jpg' />
<img src='http://i.imgur.com/90s0qAP.jpg' />
<img src='http://i.imgur.com/976ITaH.jpg' />
<img src='http://i.imgur.com/47ePYw8.gif' />
```

We're going to use the Imgur API. First off, you'll need to register an application at:
https://api.imgur.com/oauth2/addclient

Select `"OAuth 2 authorization without a callback URL"`, enter your email address, and grab
your `client_id`. That's all you'll need.

Next, you'll be ready to start querying the "semi-public" parts of their API _(after all,
they do require you to register)_. However, it's important to use their API, since it has
the most cats.

You can pick your favorite subreddit for cat image fulfillment needs. I'm particularly fond
of `/r/kittens`, so I'll use that as an example. You can use the following API endpoint:

```
https://api.imgur.com/3/gallery/r/{subreddit}
```

You'll need to set a header like this:

```
Authorization: Client-ID {{YOUR_CLIENT_ID}}
```

You can test that with `curl` in your terminal before actually coding your solution.

```bash
curl -H 'Authorization: Client-ID {{YOUR_CLIENT_ID}}' https://api.imgur.com/3/gallery/r/kittens
```

A bunch of JSON should come up in your terminal. You can have a peek at the format of that
response by visiting the following link:

```
https://api.imgur.com/models/gallery_image
```

The field you're probably looking for is the `link` field in each array item in `data`.
If you're trying things out in your terminal first, and you have `jq` installed, I suggest
that you use the following pattern on your imgur API response:

```bash
jq -r '.data[].link'
```

Verification will set up a tunnel of its and ask PageSpeed to evaluate your `/cats`. You'll
have a budget of `amount * 20kB` to return the expected `amount` of cats. If you don't meet
the budget, then verification will fail.

Consider minifying your cats using `gm`, `imagemin`, or your own clever tricks! Be creative
and try to come up with the best way to display as many cats as the request demands without
sacrificing performance!

As far as using the cats from the Imgur API, you could save the files to disk, manipulate
them reducing them in size, and then use those pre-baked small images in your response. Or,
you could also set up a proxy that takes an image url in a parameter and responds with a
smaller version of that same image on the fly. In the case of this exercise, both approaches
are valid ways of staying below the `25kB` limit per cat.

Good luck!

Run `perfschool verify solution.js` to make sure it all works when you're done!

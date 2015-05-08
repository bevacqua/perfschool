Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# INTRODUCTION

Performance budgets are a great way of ensuring a certain level of quality when it comes
to the performance output of your application. An example of a #perfbudget would be to
allocate at most 1MB for tne entire landing page to load, or demand that it results in a
[SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)
that's not greater than `1000`.

Setting these budgets is a good preventive measure to avoid potential loss of income.
Research shows that gains of as little as 100ms can have a significant impact in
human experience, engagement, and ultimately sales.

Tim Kadlec (@tkadlec) has a few great articles on the topic that I recommend you go through,
if you haven't already.

http://timkadlec.com/tags/performance-budget/

Defining a #perfbudget is only half the battle, though. The real benefits come when you
automate and enforce these constraints.

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
of `/r/kittens`, so I'll use that as an example. You'll need to set a header like this:

```
Authorization: Client-ID {{YOUR_CLIENT_ID}}
```

You can test that with `curl` in your terminal before actually coding your solution.

```bash
curl -H 'Authorization: Client-ID {{YOUR_CLIENT_ID}}' https://api.imgur.com/3/gallery/r/kittens
```

A bunch of JSON should come up in your terminal. You can have a peek at the format of that
response by visiting the following link:

https://api.imgur.com/models/gallery_image

The field you're probably looking for is the `link` field in each array item in `data`.
If you're trying things out in your terminal first, and you have `jq` installed, I suggest
that you use the following pattern on your imgur API response:

```bash
jq -r '.data[].link'
```

Verification will set up a tunnel of its and ask PageSpeed to evaluate your `/cats`. You'll
have a budget of `amount * 40k` to return the expected `amount` of cats. If you don't meet
the budget, then verification will fail.

Consider minifying your cats using `gm`, `imagemin`, or your own clever tricks! Become
creative and try to come up with the best way to display as many cats as the request demands
without sacrificing performance!

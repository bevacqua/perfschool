Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

WebPageTest.org offers a service that's fundamentally similar to PageSpeed, although
its reports are drastically more detailed than those of PageSpeed. With WebPageTest.org
you'll be able to figure out performance bottlenecks down to the TCP level. What exactly is
bogging down the connection or preventing those fonts from showing up? WPT has your back.

What is the visual representation over time? How long does it take for the first byte of the
request to get through? How long until page load? How long until document ready? WPT is able
to tell you all of these things and quite a bit more, *in excruciating detail*.

WebPageTest tells you all of these things, but is also quite cumbersome to use.

# PROBLEM

First off, you'll need an API key. These are easy to get, you just fill the form and get an
email with your API key. Each key is limited to something like 200 requests a day, though.

https://www.webpagetest.org/getkey.php

You can use the `webpagetest` module to interact with the WebPageTest API.

WPT allows you to place your requests on different servers around the world so that you
can test how the site performs for each corner of the world. For the purposes of this
exercise, I suggest you try to find a `location` that isn't very crowded. In testing,
`'ec2-us-west-2'` seemed to be fairly unpopular, and your tests shouldn't _(hopefully)_
take over a minute if you use it.

Also, consider polling the WPT API on your own, that way you'll be able to log progress
and figure out if something has gone wrong. For example, sometimes there's just way too
many requests in the queue, and you're not going to get anywhere anytime soon.

In those cases, it's best to forget about it and try to find a different `location`.
Find one that's not so overcrowded!

When a request is made against `/test`, you are expected to return a JSON object with
the following schema. Just like in the first exercise, point WPT to the landing page
on your local web server, through `localtunnel`.

```json
{
  "timing": {
    "ttfb": 944,
    "speedIndex": 2623,
    "domLoaded": 2119
  }
}
```

You could also give `ngrok` a try, it's similar to `localtunnel`. It has more features,
but it's API is also quite more complicated.

After setting up the `/test` endpoint to do the following, you should be ready to `verify`.

- Create a tunnel to your local server
- Enqueue a job on WebPageTest with the API
- Poll the results endpoint until the job completes
- Respond to the request with the `timing` information requested above
- Run `perfschool verify solution.js` to make sure it all works!

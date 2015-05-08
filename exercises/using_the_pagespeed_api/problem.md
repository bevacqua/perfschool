Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# PROBLEM

We've put together a `solution.js` file for you which has a web server built on `express`.
You have to set up an `/insights` route that responds with the PageSpeed score for the
landing page `/`, as well as its stats.

The exercise involves a very small dose of mad science. PageSpeed isn't really able to access
a website that's hosted locally in your computer. However, we can use the `localtunnel`
module to create a secure tunnel between your computer and http://localtunnel.me!

You just give it a `port` number and it'll create the bridge for you. Once that's out of
the way, you can point `psi` to your `tunnel` and wait for the stats to come back.

The exercise won't verify that you actually did any of the tunneling or any of the
reporting.

We are on the *honor system* here!

Consider running `psi` against http://ponyfoo.com if you can't figure out
how `localtunnel` works.

You are expected to return a JSON object with the following schema.

```json
{
  "resources": {
    "css": 3,
    "js": 3,
    "hosts": 6,
    "total": 18
  }
}
```

This fun little exercise shows how you are perfectly able to integrate PageSpeed into your
builds, even in development environments, and without any setup overhead!
There are no accounts or API keys involved, either.

After setting up the `/insights` endpoint to create a tunnel and ask for insights on the
landing page, run `perfschool verify solution.js` to verify your solution works.

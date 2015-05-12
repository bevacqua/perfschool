Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

A `Flash of Invisible Text`, or FOIT, occurs whenever a browser is blocked on loading a custom
font. It's usually a decent cue for a developer to figure out `"this font is render-blocking"`,
but not so useful as a human being visiting your site.

Preventing FOIT is something that isn't discussed often enough in web performance circles.

# PROBLEM

A designer brought you a clever design using four different font families, pulled from
Google Web Fonts. The page looks great, and it's too late to ask the designers to remove
a few typefaces from their designs. That would involve significant rework on their part.

You are given an `index.html` page that loads four fonts from Google Web Fonts: `Cardo`,
`Merriweather`, `Roboto` and `Lato`. Defer stylesheet loading as you learned in `"DEFER ALL
THE THINGS"`. Then use `FontFaceOnload` to defer usage of the custom fonts.

Read their documentation here: https://github.com/zachleat/fontfaceonload

Then we had to add the `FontFaceOnload` library to our page. This library is on `npm` *but* it's not
prepared to be used with Browserify _(at the time of this writing)_.

Luckily we can change all that with `browserify-shim`.

```bash
npm install fontfaceonload browserify browserify-shim --save
```

Then we add some code to our `package.json`, namely so that we can build the script we'll
be serving visitors of our site. The `build` script will compile our `main.js` into the
file we're going to be serving from `index.html`. The `browser.fontfaceonload` property
points out where the entry point for `FontFaceOnload` is to be found, since they don't
specify that in their `package.json`. Then, `browserify-shim.fontfaceonload` points to
the global they've registered, `FontFaceOnload`, and maps that to the `fontfaceonload`
package name, so that Browserify knows where to look when `require('fontfaceonload')`
comes knocking. Lastly, `browserify.transform` is set to `['browserify-shim']` so that
everything I've just explained actually works.

This is what you should have in your `package.json`:

```json
{
  "scripts": {
    "build": "browserify main.js -o index.js"
  },
  "browser": {
    "fontfaceonload": "./node_modules/fontfaceonload/dist/fontfaceonload.js"
  },
  "browserify-shim": {
    "fontfaceonload": "FontFaceOnload"
  },
  "browserify": {
    "transform": ["browserify-shim"]
  }
}
```

Then, you should watch for each individual font family to load, and when the `success` callback
is fired, you add a class to your document, such as `loaded-lato`. Then you're able to do
something like the following in your stylesheet.

```css
body {
  font-family: sans-serif;
}
.loaded-lato .lato {
  font-family: 'Lato', sans-serif;
}
```

This setup warrants that you don't run into FOIT issues, because the font loading is deferred,
but it's only used when it becomes available. Transforming FOIT into FOUT (flash of unstyled
text).

After setting up the font loader through Browserify, run `perfschool verify solution.js`. Note
that the exercise will check that your code works via Browserify, so you'll also need to figure
out how to make a Browserify bundle, as I've explained above!

For comparison, here's the reference solution.

As a solution, we defer stylesheet loading for the Google Fonts stylesheet, just like
we did in `"DEFER ALL THE THINGS"`.

```css
<noscript>
  <link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Cardo|Merriweather|Roboto|Lato'>
</noscript>
<script>
  (function () {
    function loadStyle (url) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.media = 'only x';
      link.href = url;
      head.appendChild(link);
      setTimeout(function () {
        link.media = 'all';
      }, 0);
    }

    loadStyle('http://fonts.googleapis.com/css?family=Cardo|Merriweather|Roboto|Lato');
  })();
</script>
```

Then we had to add the `FontFaceOnload` library. This library is on `npm` *but* it's not
prepared to be used with Browserify _(at the time of this writing)_.

Luckily we can change all that with `browserify-shim`.

```bash
npm install fontfaceonload browserify browserify-shim --save
```

This is what the `package.json` had to look like in order for us to be able to use the
`fontfaceonload` package.

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

Here's my `main.js` script, where I wait until font families are loaded and add
their names to the `<html>` element's `class` property.

```js
var ffol = require('fontfaceonload');
var html = document.documentElement;

watch('Lato');
watch('Cardo');
watch('Roboto');
watch('Merriweather');

function watch (family) {
  ffol(family, { success: loaded });
  function loaded () {
    html.className += ' ok-' + family
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/--/g, '-')
      .replace(/^-|-$/g, '');
  }
}
```

I compile the script above using `npm run build`, and then added the `index.js` file
to my HTML page by placing this `<script>` tag at the bottom:

```
<script src='/index.js'></script>
```

The CSS file was slightly modified so that font-families would only be swapped if the
fonts are actually loaded, as indicated by `FontFaceOnload`.

```css
body {
  background-color: #ffc;
  color: #333;
  padding: 20px;
  font-family: sans-serif;
}
.ok-lato .lato {
  font-family: 'Lato', sans-serif;
}
.ok-cardo .cardo {
  font-family: 'Cardo', sans-serif;
}
.ok-roboto .roboto {
  font-family: 'Roboto', sans-serif;
}
.ok-merriweather .merriweather {
  font-family: 'Merriweather', sans-serif;
}
```

Looks like a lot! But the solution was fairly straightforward!

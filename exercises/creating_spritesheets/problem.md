Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

Spritesheets have the same underlying concept as script concatenation. You bundle a bunch of
smaller files into a larger one, saving HTTP requests. Sprites are most effective when you have
large collections of icons, and a spritesheet can be represented as a single image with every
icon in it, or a font where the different codepoints are the actual images.

Sprite generation has traditionally been a major hassle because it'd be done without any tools,
but instead manually, by going to the designer's desk and asking them to add an icon to the image.
With the advent of web development productivity tooling such as Grunt, Gulp, Broccoli, etc, there
has also been a boom of automating all the things. With spritesheet creation being an automated
process, we can now just collect icons in a directory, point a tool to it, and get back our sprites.

Spritesheets typically consist on an image with all the icons, and a series of CSS style declarations.
These styles are used to map different portions of an image to a specific class, thus separating the
icons by offseting `background-position`.

For this exercise you can use `spritesmith-cli`, which allows you to run `spritesmith` as a CLI
tool. Install it locally by running `npm install spritesmith-cli --save-dev`. Then, add a `script`
entry to your `package.json` like below:

```
{
  "scripts": {
    "build": "spritesmith"
  }
}
```

After creating a `.spritesmith.js` file with the contents shown below, you can run `npm run build`
and get back the spritesheet image and its matching CSS map.

```
var util = require('util');

module.exports = {
  src: 'icons/*',
  destImage: 'icons.png',
  destCSS: 'icons.css',
  cssOpts: {
    cssClass: function (item) {
      return util.format('.ic-%s:before', item.name);
    }
  }
};
```

Note that you could further configure `spritesmith` to output Stylus, LESS, SCSS, or even JSON.
Using these tools, `spritesmith` makes it easy to create retina versions of your icons, as well
as the regular versions. The best part is that the designer doesn't have to be involved at all!
They just need to drop the icons in a folder for you, presumably via Dropbox, which they seem to
be fond of.

# PROBLEM

You are given an `index.html` page with an assortments of images on the page. Each one of these
images are placed in `<img>` tags. Use `spritesmith` to create a spritesheet. Then change the
`<img>` tags into `<span>` and style them so that they look identical to the `index.html` page
you were originally handed.

After creating a spritesheet for all your images and using it in the page, run the following
command.

```
perfschool verify solution.js
```

The verification script will diff your solution against the expected solution by taking an
screenshot and comparing it visually.

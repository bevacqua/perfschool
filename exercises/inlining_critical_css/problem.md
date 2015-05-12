Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

Stylesheets in the `<head>` block rendering. This is acceptable because we need to be able
to display the page without having confusing flickers as our styles load. That would be bad
user experience. The problem is that usually our stylesheets serve way more content than what's
necessary to display the critical content on first page load. Critical content is slang for
"anything that's within the viewport as you open the page". If we were to extract the CSS that's
needed to render what's initially visible in the viewport from our stylesheets, that'd be
significantly smaller than the entire stylesheet.

This would be something we could actually inline inside a `<style>` tag, without making our
HTML files significantly larger. Once that `<style>` tag is in your HTML, you can defer the rest
of the styles just as you learned in `"DEFER ALL THE THINGS"`!

The extraction bit is the hard part. As usual, a tool can help take care of that. There's this
tool called `penthouse` which runs on top of PhantomJS and extracts the relevant styles for a
given URL and CSS stylesheet. Let's try that out!

# PROBLEM

You are given a `index.html` file with a bunch of markup and a `super.css` file. Extract the
relevant styles and place them in a `<style>` tag in the `index.html` inside the `<head>`. Then,
defer the rest of the stylesheet as explained in `"DEFER ALL THE THINGS"`.

For the extraction part, here's some help. Install `penthouse` locally. Run the provided application
for this exercise, and also install PhantomJS. Then run the following command.

```bash
phantomjs node_modules/penthouse/penthouse.js http://localhost:7777 super.css
```

If all went well, you should get back a the styles that are relevant to the critical path. Paste
those into a `<style>` tag, and only the deferring part is left!

After inlining the critical styles and deferring the rest, run `perfschool verify solution.js`

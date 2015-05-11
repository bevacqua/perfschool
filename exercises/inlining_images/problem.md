Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# INTRODUCTION

Sometimes we have very small images that don't deserve the overhead of an extra request.
There's plenty of use cases for trying to avoid the extra request, such as when you're
loading a partial view via AJAX that has a couple of tiny images on them. In emails,
where you want to ensure the images can be viewed offline, you may want to inline images
as well.

Image inlining can be done by creating a `"base64-encoded data uri"`, getting a string
like the one below.

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

Take into account that URL-encoded data images are roughly 30% larger than their binary
counterparts, which is why you have to consider whether it makes sense to inline an image
in a case by case basis.

# PROBLEM

You are given a web application that has a showcase of emoji, and you are going to render
them inline in the page, since they are small, different, and presumably one-ofs.

You can use the `datauri` module on npm for this purpose. It comes with a command-line
interface and packaged with an API as well. Just pass in your images and get back the
encoded data url ready to use.

Keep Hodor as-is, as he is a bit larger than the icons. Inline the icons in the page.
Then run `perfschool verify solution.js`!

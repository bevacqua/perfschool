For comparison, here's the reference solution.

While the flow was complicated, the solution was fairly simple. We just had to download
and install PhantomJS, `penthouse`, and then run the following commands.

```bash
node solution.js &
phantomjs node_modules/penthouse/penthouse.js http://localhost:7777 super.css > inline.css
```

We could then take `inline.css` and paste that into a `<style>{{STYLES HERE}}</style>` tag
in the `<head>` of our `index.html`. That, coupled with deferring the rest of the styles was
more than enough to vastly improve the performance on the critical path for our page.

One caveat to note is that this is a very time-consuming build step, and one that's not easily
automated. In particular, you should be careful to have dedicated styles that you'll inline
for the various layouts and views in your site, otherwise, the pages might flicker. This is
something to be especially careful about when implementing it for authenticated views.

Alternatively, you could just implement a critical CSS inlining solution just on the landing
page, and load CSS in every other page synchronously, while providing a faster experience at
the domain root.

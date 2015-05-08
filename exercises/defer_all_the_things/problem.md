Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# PROBLEM

In this exercise there's an `index.html` page you need to fix. It presents
a series of issues.

First off, the `<script>` tags shouldn't be anywhere else on the page than at
the very bottom, right before the `<body>` tag closes. This prevents JavaScript
requests from blocking the critical path to the precious content your humans
crave. Second, scripts should also be loaded asynchronously, with the `async`
attribute. This prevents the script from blocking even if they're at the bottom
of the page. The advantages of adding these attributes to `<script>` tags on
the bottom of the page is negligible, but you could easily replicate this
behavior with a piece of code like the following:

```js
function loadScript (url) {
  var first = document.getElementsByTagName('script')[0];
  var script = document.createElement('script');
  script.async = true;
  script.src = url;
  first.parentNode.insertBefore(script, first);
}

loadScript('http://v.campjs.com/js/all.js');
```

We also need to load styles asynchronously, which will become more useful in later
exercises. Stylesheets are a bit trickier. For some obscure reason, there's no
`async` attribute for `<link>` tags. However, you could defer the load by using
JavaScript to create a `<link>` tag with `media` type `'only x'`, or some other
invalid `media`. When added to the document, the resource won't be fetched as
the browser would have no use for invalid `media` type styles. After a `setTimeout`,
you can set the `media` type to `'all'` and the resource would be fetched.

Note that this technique foils modern browser technology, such as prefetching,
and also thwarts static analysis in general terms. It does in fact also mess with
ancient browsers, so let's be great citizens and add a `<noscript>` fallback that
loads the stylesheet as you've originally found them.

After deferring both the scripts and the styles, run `perfschool verify solution.js`

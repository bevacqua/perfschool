For comparison, here's the reference solution.

First off, we can get rid of jQuery, since we're not even using it!

```xml
<script src='//code.jquery.com/jquery-1.11.3.min.js'></script>
```

Then, and just like in `"DEFER ALL THE THINGS"`, we've deferred the loading of CSS. We're
not even using the styles in `bootstrap-theme.min.css`, so we can get rid of that one. Also,
instead of using `bootstrap.min.css`, we can add the following CSS to our local stylesheet
and get pretty much the same result, only at a much smaller footprint.

```css
body {
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
}
```

Bottom line in this case is, don't blindly include libraries, think about the impact they'll
have on your website's performance, and then you can ponder whether it's going to be a
worthwhile addition to your toolbox.

The `data-cards='hidden'` attribute on Twitter cards significantly reduces their performance
implications, as images and other embedded media is omitted, saving us from a hefty hit during
load.

Another small change we made was to wrap some of the styles in a `@media` query, so that
the site was more mobile-friendly. UX is intertwined with performance and they share many
concerns, particularly when it comes to human perception.

```css
@media only screen and (min-width: 768px) {
  body {
    padding: 25px;
  }
  div {
    vertical-align: top;
    display: inline-block;
    width: 33%
  }
}
```

The largest performance gains in this page can be attained by looking at the kittens. In the
problem description you were given two options. The first one is optimizing the images. This
would've been the most straightforward way of improving performance, given that besides changes
in your implementation, the user experience remains pretty much the same (albeit considerably
faster). The second option was to load the images after a while, as to avoid the cost of loading
them during page load. This would probably entail modifying the user experience, but I believe
it's a nice thought experiment that we don't indulge in often enough.

Since we'll be covering image optimization techniques in future exercises, I went with the UX
change here. I've added a button that reads `'See kittens!'` to display the kittens, and hid
all the images inside a container. I changed the `src` attribute on images to `data-src`, so
that they wouldn't start fetching even though they're not shown on the page. The following piece
of code binds a click event that displays the kittens.

```xml
<script>
  document.querySelector('.see').addEventListener('click', function () {
    document.querySelector('.cats').style.display = 'block';
    var cats = document.querySelectorAll('.cat');
    Array.prototype.slice.call(cats).forEach(load);
    function load (cat) {
      cat.src = cat.getAttribute('data-src');
    }
  });
</script>
```

The important take-away in this exercise is that you should respect a `#perfbudget`,
if you've set one, and try to enforce it as aggressively as possible. You might
incorporate one into your build processes using `grunt-perfbudget`, or you could always
hand-code one, where you simply use `psi` or `webpagetest` to verify that the application
is within your budget, and if it's not, you crash the build.

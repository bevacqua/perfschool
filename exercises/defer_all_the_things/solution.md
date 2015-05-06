For comparison, here's the reference solution.

# Head

The `'only x'` trick below allows us to defer the loading of a stylesheet and prevent render-blocking.

```js
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

  loadStyle('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css');
  loadStyle('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css');
})();
```

We use a fallback so that the page still loads the styles _(blocking)_ if scripting isn't available.

```xml
<noscript>
  <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css'>
  <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css'>
</noscript>
```

# Body (at the very bottom)

```xml
<script async src='//code.jquery.com/jquery-1.11.3.min.js'></script>
<script async src='//platform.twitter.com/widgets.js' charset='utf-8'></script>
```

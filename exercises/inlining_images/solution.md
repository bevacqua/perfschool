For comparison, here's the reference solution.

The solution to this exercise is fairly striaghtforward. We start by installing `datauri`.

```
npm install datauri -g
```

Then you can compile the data uris like so:

```
datauri fire.png
datauri grin.png
datauri hot.png
datauri pirate.png
datauri plane.png
```

Once you have each of the data uris, you can simply paste them in your HTML file, replacing
the `src` field in the corresponding image tag. The process definitely becomes simpler when
using a templating engine such as `Mustache`, `Jade`, and similar, as you could even do it
dynamically on your server.

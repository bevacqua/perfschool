For comparison, here's the reference solution.

After creating a spritesheet as explained in the problem definition, we replaced all
image tags with `<span>` with each of the different image classes. We moved the styles
on the `img` selector to the `span` selector, and added a couple of styles to `:before`.

```
span:before {
  display: block;
  content: '';
}
```

Voilá! You now have a reusable and automated process you can take home for all your
spritesheet creation needs. Feel free to look into creating retina versions, as well!

Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

# INTRODUCTION

Performance budgets are a great way of ensuring a certain level of quality when it comes
to the performance output of your application. An example of a #perfbudget would be to
allocate at most 1MB for the entire landing page to load, or demand that it results in a
[SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)
that's not greater than `1000`.

Setting these budgets is a good preventive measure to avoid potential loss of income.
Research shows that gains of as little as 100ms can have a significant impact in
human experience, engagement, and ultimately sales.

Tim Kadlec (@tkadlec) has a few great articles on the topic that I recommend you go through,
if you haven't already.

```
http://timkadlec.com/tags/performance-budget/
```

Defining a #perfbudget is only half the battle, though. The real benefits come when you
automate and enforce these constraints.

# PROBLEM

You are given a web application that has many pictures of kittens, and displays three tweets.
Figure out a way to pass the PageSpeed test during verification using `perfschool verify solution.js`.

One possible solution is to serve optimized versions of the cats. Another is to load the images after
a while, without blocking rendering. How would you do that without damaging the user experience?

Take into account the things you've learned during the `"DEFER ALL THE THINGS"` exercise as well!

One more hint: embedded tweets will omit extra media images if you add `data-cards='hidden'` to the
`<blockquote>` tag for each tweet.

Bon voyage!

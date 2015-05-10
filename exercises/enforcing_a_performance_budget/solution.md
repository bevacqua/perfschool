For comparison, here's the reference solution.

xxx

The important take-away in this exercise is that you should respect a `#perfbudget`,
if you've set one, and try to enforce it as aggressively as possible. You might
incorporate one into your build processes using `grunt-perfbudget`, or you could always
hand-code one, where you simply use `psi` or `webpagetest` to verify that the application
is within your budget, and if it's not, you crash the build.

Run `perfschool verify solution.js` to make sure it all works when you're done!

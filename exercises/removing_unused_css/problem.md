Hey there! If you haven't yet, make sure to run `perfschool init` _before proceeding_.
It will create a `perfschool-playground` directory with everything you need to get started.

From time to time, you'll work on a project where you use a CSS framework such as `Bootstrap`.
Or, you may be working in a legacy project with tons of CSS that you just _know_ it's not being
used anymore. In these cases there's a nifty little tool you can use to get rid of all those CSS
rules that are not being put to good use.

This saves your users considerable bytes, especially when it comes to including a framework only
to get access to a couple of the styles they've defined.

The `uncss` package allows you to get rid of all of those useless bytes by loading a file or URL
using PhantomJS, a headless browser that's able to interpret resources such as CSS and JavaScript.

# PROBLEM

You are given an application with a bunch of CSS that's used, and a bunch of CSS that's unused.
Leverage `uncss` to filter out the unused CSS and only serve what's needed.

Don't inline the styles. Instead, serve a stylesheet in your responses that *only* has the used
styles. You are free to merge all the stylesheets into a single one.

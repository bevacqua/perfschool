For comparison, here's the reference solution.

I just started the web server, without any modifications, and then executed
the following command in my terminal:

```bash
uncss http://localhost:7777 > reduced.css
```

After `uncss` I got rid of the extra `<link>` tags pointing to Bootstrap's CDN, and
I had to remove a few extra rules to satisfy the whims of `perfschool verify`.

The `reduced.css` file is `1.3kB` gzipped, versus the `22kB` in the source files.
If we translate that difference into percentages, that's a `94.1%` reduction overall.
If you also take into account that most projects have way larger code bases, the
potential savings more than justify using `uncss` in your projects.

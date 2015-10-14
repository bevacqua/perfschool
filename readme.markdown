# perfschool

> Find your way through the performance optimization maze in this NodeSchool workshopper

This workshop is based on one of my talks, ["High Performance in the Critical Path"][3]. The `perfschool` workshopper was originally written for [CampJS V][4].

# Screenshots

![menu.png][1]

![cat.png][2]

# Install

Get it from `npm`

```bash
npm install perfschool -g
```

**`perfschool` requires you to use Node.js `v0.10.x`.

# Usage

First off, the command below will give you fresh copies of the files you'll need to run the exercises.

```bash
perfschool init
```

Once that's out of the way, just run the command below and choose one of the exercises!

```bash
cd perfschool-playground ; npm install ; perfschool
```

# FAQ

- Haven't you read this!? [PageSpeed Service deprecation][5]

Yes, yes I have. That article talks about **PageSpeed Service**, a CloudFlare-like CDN service that's going to be shut down. The PageSpeed Insights product and related open-source products are still alive and well [(source)][6].

# License

MIT

[1]: https://github.com/bevacqua/perfschool/blob/master/resources/menu.png
[2]: https://github.com/bevacqua/perfschool/blob/master/resources/cat.png
[3]: https://speakerdeck.com/bevacqua/high-performance-in-the-critical-path
[4]: http://v.campjs.com/#high-performance
[5]: https://developers.google.com/speed/pagespeed/service/Deprecation
[6]: https://news.ycombinator.com/item?id=9500195

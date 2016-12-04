# Assimilate JS

This is a collection of Markdown files that are also literate JavaScript
modules (EcmaScript 2015 edition, to be precise) that demonstrate fundamental
but perhaps non-obvious language concepts to novice and intermediate JavaScript
developers. Together they comprise a book that you can [read online](https://foxbunny.gitbooks.io/assimilate-js/content/).

## The book contents

See `SUMMARY.md` for a complete table of contents.

Have a topic you would like to see covered? Use the [issue tracker](
https://github.com/foxbunny/javascript-by-example/issues) to submit feature
requests.

## Getting the sources

To obtain the sources, simply clone [the repository](
https://github.com/foxbunny/javascript-by-example/) using git, or [download](
https://github.com/foxbunny/javascript-by-example/archive/master.zip) it.

To clone the repository run:

    git clone https://github.com/foxbunny/javascript-by-example.git
    cd javascript-by-example

Then run this command in the source directory:

    npm install

This will install [Babel](https://babeljs.io/) and a few more related packages,
which enables you to run the examples.

## Running the examples

To run the examples, use `npm start [example module]` command, where `[example
module]` is the module's file name with or without the `.js` extension. For
example, if you wish to run `proto.js`, you would run this command:

    npm start proto

## Literate modules

The markdown modules are literate JavaScript modules. They are made executable
using the [literatejs](https://github.com/foxbunny/literatejs) program. There
is some boilerplate code in the
[run.js](https://github.com/foxbunny/javascript-by-example/blob/master/run.js)
script if you are curious.

## License

This code in this repository is licensed under the MIT license. See the license
file for more information.

## Reporting issues

Please use the [issue tracker](
https://github.com/foxbunny/javascript-by-example/issues) to report issues with
the examples or documentation. You are also welcome to submit pull requests
with fixes or even completely new modules.

Ideas for new topics to cover is also very welcome!

## About the author

I am a long-time web developer with over 8 years of experience programming
in JavaScript. My relationship with JavaScript has started even before frontend
engineering was *the* thing, scripting Adobe software using the JavaScript
scripting API. Although I have also done NodeJS development, my main focus
nowadays is on frontend engineering. I love JavaScript, and lately also writing
about it.

You can tweet to me, `@foxbunny`, [on Twitter](https://twitter.com/foxbunny),
and read more of the musings, that didn't quite fit this book, [on my
blog](http://hayavuk.tumblr.com/).

## Acknowledgements

I would like to thank all my friends that gave me with encouragement and
feedback. In particular, I would like to mention:

- Andrean
- Manish
- Ben
- Abhishek
- Vitomir

I keep writing this book thanks to these great buddies!

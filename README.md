# JavaScript by example

This is a collection of JavaScript modules (EcmaScript 2015 edition, to be
precise) that demonstrate fundamental but non-obvious language concepts to
novice and not-so-novice JavaScript developers.

Each module in this collection can be read as a guide on a particular topic it
covers, and can also be executed using NodeJS. You will need to have reasonably
recent versions of NodeJS and NPM installed in order to run the examples.

Running the examples is not necessary in order to follow them, though. The
command output is also noted in the form of comments next to each (relevant)
line of code.

## Table of contents

- [func](./func.md) - The ins and outs of functions in JavaScript
- [this](./this.md) - In-depth discussion of the `this` object
- [proto](./proto.md) - Prototypal inheritance and examples of object creation
  and inheritance using several different patterns
- [not-new](./not-new.md) - An implementation of `new` keyword as a JavaScript
  function to demonstrate how instantiating objects using constructors and
  classes actually works
- [type-detection](./type-detection.md) - In-depth tour of various type
  detection techniques in JavaScript
- [declarative](./declarative.md) - Declarative (functional) programming in
  JavaScript with side-by-side comparison with procedural and OOP styles.

Have a topic you would like to see covered? Use the [issue tracker](
https://github.com/foxbunny/javascript-by-example/issues) to submit feature
requests.

## Getting the sources

To obtain the sources, simply clone [this repository](
https://github.com/foxbunny/javascript-by-example/) using git, or [download](
https://github.com/foxbunny/javascript-by-example/archive/master.zip) it, then
run this command in the source directory:

    npm install

This will install [Babel](https://babeljs.io/) and a few more related packages,
which enables you to run the examples.

## Running the examples

To run the examples, use `npm start [example module]` command, where `[example
module]` is the module's file name with or without the `.js` extension. For
example, if you wish to run `proto.js`, you would run this command:

    npm start proto

## License

This code in this repository is licensed under the MIT license.

## Reporting issues

Please use the [issue tracker](
https://github.com/foxbunny/javascript-by-example/issues) to report issues with
the examples or documentation. You are also welcome to submit pull requests
with fixes or even completely new modules.

## About the author

I am a long-time web developer with over 8 years of experience programming
in JavaScript. My relationship with JavaScript has started even before frontend
engineering was *the* thing, scripting Adobe software using the JavaScript
scripting API. Although I have also done NodeJS development, my main focus
nowadays is on frontend engineering. I love JavaScript, and lately also writing
about it.

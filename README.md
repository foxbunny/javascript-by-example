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

- [proto](./proto.js) - Prototypal inheritance and examples of object creation
and inheritance using several different patterns
- [not-new](./not-new.js) - An implementation of `new` keyword as a JavaScript
function to demonstrate how instantiating objects using constructors and
classes actually works

## Getting the sources

To obtain the sources, simply clone this repository. Then run this command in
the source directory:

    npm install

This will install [Babel](https://babeljs.io/) and a few more related packages,
which enables you to run the examples.

## Running the examples

To run the examples, use `npm start -- [example module]` command, where
`[example module]` is the module's file name with or without the `.js`
extension. For example, if you wish to run `proto.js`, you would run this
command:

    npm start -- proto

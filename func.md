```
import {NOTE} from './_util'
```

# About functions in JavaScript

JavaScript was heavily influenced by Scheme, a functional programming language
of the LISP lineage. You may not see it from the syntax, and the [Wikipedia
article on JavaScript](
https://en.wikipedia.org/wiki/JavaScript#Beginnings_at_Netscape) explains why:

> In 1995, [Netscape] recruited Brendan Eich with the goal of embedding the
> Scheme programming language into its Netscape Navigator. [...] Netscape
> Communications then decided that [JavaScript] would complement Java and
> should have a similar syntax[...]

Even though JavaScript doesn't quite resemble Scheme, functions in JavaScript
are still among the most pleasant to work with, and we can definitely feel the
functional nature of the language in many places.

You can write programs without any functions in JavaScript, but you would be
missing out on a rich set of features that stem from the language's heritage.
As you start tackling complexity in your code, regardless of whether you do so
using object orientation or functional programming, functions will become
essential (or unavoidable, depending on how you look at things). JavaScript
functions have a few tricks up their sleeves that are useful to know, and we'll
take a look at them in this module.

**NOTE:** Even though there does not seem to be a clear-cut consensus, we will
use the word 'parameters' to mean 'the names that a function uses to refer
to values that may be passed to it', and 'arguments' to refer to 'the values
being passed to a function on invocation'.

Let's talk about syntax first.

There are three ways to define functions.

- (1) function assigned to a variable or object property (a.k.a. function
  expression)

```
// 1a. anonymous function expression:
const foo = function (x, y, z) { /* ... */ }

// 1b. named function expression:
const fooNamed = function fooNamed(x, y, z) { /* ... */ }
```

- (2) function that you don't assign (a.k.a. function declaration statement) and
  cannot be anonymous

```
function bar(x, y, z) { /* ... */ }
```

- (3) the new arrow function expression that you assign to a variable

```
const baz = (x, y, z) => { /* ... */ }
```

- (4) object property

```
const bam = {
  property(x, y, z) { /* ... */ }
}
```

The first two forms can be used more or less interchangeably. The only tiny
difference is that the named functions can be defined anywhere in the scope,
and they are treated as if they were defined at the very top of the scope
(the module they are defined in, or a function in which they are defined):

```
whereDoYouComeFrom() // look at the bottom!
```

This characteristic of named functions is called 'hoisting'. Because these
functions are hoisted, some programmers like to use them for utility functions
that would only get in the way if defined before the business logic code.

In some versions of some JavaScript engines, it is possible to declare
functions in an `if` block using function statements, even if the `if`
condition is not met. You should, therefore, avoid using function statements in
`if` blocks as it may lead to confusion and subtle bugs.

The arrow function form is a new syntax introduced in ECMAScript 6, and the one
I prefer to use. There are subtle differences between arrow- and non-arrow
functions in both syntax and semantics, though, and they can't be used
interchangeably in all situations. We'll talk about the differences later,
after we've covered the basics.

**NOTE:** In this module we'll call both function expressions and functions
statements 'non-arrow functions', to distinguish them from arrow functions.

The last form, the object property, is syntactic sugar for defining a property
and assigning a function expression to it. It is new in ES6, and it is the same
as saying `{property: function (x, y, z) { /* ... */ }}`.

In all cases we have three parameters: x, y, and z. If you are used to
languages where you can invoke functions using named arguments (keyword
arguments), you should be aware that JavaScript does not have this feature.
There are ways to work around that, but it is often times simpler to just work
with positional arguments instead.

If you find that your parameter list is becoming a maintenance nightmare,
consider passing a single object and accessing its properties instead. This is
especially useful combined with argument destructuring discussed in this
module.

Arrow functions have a few syntax variations depending on the number of
parameters and/or the complexity of the function body.

When there is only one parameter, the parenthesis can be omitted.

```
const noParens = x => { /* .... */ }
```

When the function body is a single expression, then the braces can be
omitted.

```
const noBraces = x => x + 1
```

In the above form, if you wish to return an object, it must be wrapped in
parenthesis.

```
const noBracesObject = x => ({foo: x})
```

You don't *have* to omit neither braces nor parenthesis if you don't want to,
though. Keep in mind that, if you don't omit braces, you must use a `return`
statement to return values.

```
const fullPackage = (x) => { return x + 1 }
```

Except for single-expression arrow functions, you generally have to use the
`return` statement to return a value. If you don't, `undefined` is returned
instead.

```
const returning = function (x) {
  return x + 1
}
```

Starting with ES6, function arguments can be destructured using parameters with
pattern-matching. We'll go over a few examples of how this destructuring works:

```
const takesArray = ([x, y, z]) => {
  console.log('took array:', x, y, z)
}
takesArray([1, 2, 3]) // took array: 1 2 3

const takesArrayWithSplat = ([head, ...tail]) => {
  console.log('took array with splat:', head, tail)
}
takesArrayWithSplat([1, 2, 3]) // took array with splat: 1 [ 2, 3 ]

const takesObj = ({x, y, z}) => {
  console.log('took obj:', x, y, z)
}
takesObj({x: 'foo', y: 'bar', z: 'baz'}) // took obj: foo bar baz

const takesComplex = ({x: [y, z], w}) => {
  // x is not used here because it was mapped to an array containing y and z
  console.log('took complex:', y, z, w)
}
takesComplex({x: [1, 2], w: 3}) // took complex: 1 2 3

const remapsKeys = ({x: foo, y: bar}) => {
  console.log('remapped:', foo, bar)
}
remapsKeys({x: 'x', y: 'y'}) // remapped: x y
```

As of ES6, default values of parameters can also be specified.

```
const havingDefault = (x = 12) => {
  console.log(x)
}
NOTE('Invoking havingDefault with an argument')
havingDefault(10) // 10
NOTE('Invoking havingDefault without an argument')
havingDefault() // 12
```

JavaScript functions do not have any restrictions on the number of arguments
you can pass. You can call the same function with as many or as little
arguments as you want, and it always works (sort of). The flip side is that
there is no way to define required parameters nor are exceptions thrown when
arguments are missing. Any parameters for which no arguments are passed will be
`undefined`.

```
const noArg = (x) => {
  console.log(x)
}

NOTE('Invoking noArg without arguments')
noArg() // undefined
NOTE('Invoking noArg with more arguments than parameters')
noArg(1, 2, 3, 4) // 1 (other arguments are silently ignored)
```

This is in just how JavaScript does this. Whether you like it or not, it's a
language feature. Resistance is undefined!

The extra arguments passed to a function can be trapped using splats, which
appeared in ES6 for the first time. These are also known as 'rest parameters'.

```
const withSplat = (x, ...rest) => {
  console.log(x, rest)
}

NOTE('Invoking withSplat(1, 2, 3)')
withSplat(1, 2, 3) // 1 [ 2, 3 ]
```

Splats are an empty array if there are no extra arguments.

```
NOTE('Invoking withSplat(1)')
withSplat(1) // 1 [ ]
```

You have already seen that function expressions can be assigned to variables.
They can also be defined as and assigned to object properties. As mentioned,
there is no difference between defining a callable property using the
short-hand notation and assigning a function expression.

Merely defining as, and assigning to, object properties does not make functions
special. They are still the same functions. You will find more details about
how functions are effectively used as object properties (methods) in the
`this.js` module, but try to read this module to the end before going there.
For now, let's continue with the examples:

```
const property = () => console.log("I'm a property")
const proprietor = {
  prop: property
}
NOTE('Invoking proprietor.prop()')
proprietor.prop() // I'm a property

const proprietor2 = {
  prop() { console.log("I'm a property") }
}
NOTE('Invoking proprietor2.prop()')
proprietor2.prop() // I'm a property
```

Functions can be used as arguments to other functions, and returned from them.
Functions that receive other functions as arguments or return functions (or
both) are called higher-order functions. Higher-order functions allow for great
composability.

```
const is = x => y => x === y
const isTwo = is(2)
const not = fn => x => ! fn(x)
const notTwo = not(isTwo)
console.log('notTwo(1) === ' + notTwo(1)) // true
console.log('notTwo(2) === ' + notTwo(2)) // false
```

When a value is passed to `is()`, a new function is returned which will compare
its argument to the value that was passed to `is()`.  The `isTwo()` function is
created by invoking `is()` with 2 as the value. The `not()` function takes a
function `fn`, and returns a function that, given an argument, calls `fn()`
with that argument and returns the negated return value. We combined the two
functions to create an opposite of `isTwo()`: `notTwo()`. Although these
examples are quite trivial, the way we can compose functions can scale to much
more complex problems without making things much more difficult.

On the other hand, don't fall into a trap of breaking everything down into tiny
functions and write a big function using bazillion of them. It ultimately makes
the code harder to follow.

Functions in JavaScript allow us to build closures. When a function is defined
within another function, the inner function has access to the outer function's
scope (variables defined in the outer function as well as the outer function's
arguments), even after it is returned and invoked outside of the outer
function. Furthermore, the scope of the outer function is private (not
accessible to anything outside it except the inner function's scope). In this
configuration, we say that the outer function 'closes over' the inner one. We
have seen this with `is()` and `not()` already, where the returned function
retain access to the outer function's arguments. Let's do one more example
where the inner function uses a variable defined in the outer function.

```
const makeRequester = () => {
  // This could be generated dynamically for example:
  const token = {
    code: '1234567',
    username: 'bob'
  }
  return (x) => {
    console.log(`Request ${x} for ${token.username} using code ${token.code}`)
  }
}
const requester = makeRequester()
requester('hamburger') // Request hamburger for bob using code 1234567
```

In the above example, the token is generated within `makeRequester()`'s
closure, and is completely inaccessible to the outside world. This effectively
makes it tamper-free.

Immediately-invoked function expressions (IIFE for short) are function
expressions that are... well... immediately invoked. A stand-alone (i.e.,
unassigned) function expression is constructed by enclosing a function
expression in parenthesis, and then invoked by adding another set of
parenthesis right after the ones around the function. This works with both the
function expression that uses the `function` keyword, and with arrow function
expressions. Here's an example:

```
;(() => {
  console.log("I'm invoked immediately!")
})()
```

**NOTE:** We use a semi-colon before the opening parenthesis to avoid the
automatic semi-colon insertion (ASI) from interfering with our code. Not doing
this would have cause the JavaScript engine to interpret our code as
`requester('hamburger')(() => { ... })()`. If you find that ugly, you could
also use semi-colons everywhere at the end of each statement, or just the
preceding statements.

IIFE's return value can be assigned to a variable.

```
const requester2 = ((username) => {
  // This could be generated dynamically, for example
  const token = {
    code: '1234567',
    username: username
  }
  return (x) => {
    console.log(`Request ${x} for ${token.username} using code ${token.code}`)
  }
})('john')
requester2('beer') // Request beer for john using code 1234567
```

In the above example, we have converted the `makeRequester()` function into an
IIFE, which generates the requester function on the fly, and its return value
is assigned to `requester2()`.

An IIFE is only ever invoked once, so this pattern is commonly used for
initialization before returning functions or other objects, or to create
private state that should not be accessible to the outside code.

Let me remind you again that JavaScript functions are objects. This is quite
evident when you start noticing that you can define properties on them.

```
const funcWithProps = () => { /* ... */ }
funcWithProps.someProp = 'foo'
```

Although user-defined properties on functions are not all that useful,
functions also have a few built-in properties that are. You can use the
`length` property to figure out the number of parameters it expects.

```
const howMany = (a, b, c) => { /* ... */ }
console.log('howMany.length === ' + howMany.length) // 3
```

We could, for example, use the `length` property to implement a function that,
given a function, accumulates arguments until there are enough (or more) of
them to satisfy the original function's parameter list.

```
const accumulate = (fn, accumulated = []) => {
  // Immediately return a function
  return (...args) => {
    // Add the new args to the accumulated args
    const allArgs = accumulated.concat(args)
    if (allArgs.length < fn.length) {
      // We don't have enough args, so return a new accumulator function which
      // starts from the currently accumulated arguments.
      return accumulate(fn, allArgs)
    }
    // we have all the arguments we need (or more), so we can now call the
    // original function.
    return fn(...allArgs)
  }
}

const printThree = (x, y, z) => {
  console.log(x, y, z)
}

const printWhenThree = accumulate(printThree)

NOTE('printWhenThree(1)')
let next = printWhenThree(1) // (no output)

NOTE('printWhenThree(2)')
next = next(2) // (no output)

NOTE('printWhenThree(3)')
next(3) // 1 2 3
```

In the `accumulate()` function, we have quasi-recursion, where the inner
function invokes the outer function passing the state (array of arguments
accumulated thus far). It is not real recursion because the call happens after
the user has invoked the inner function.

**NOTE:** Yes, `accumulate()` is cute and not very useful in real life. See the
`bind()` function used later on that *is* useful.

A function's `name` property will tell us what the function is named.

```
console.log('howMany.name === ' + howMany.name) // howMany
```

While it may sound silly, it can be useful in some cases. For example, if you
are writing code that sets up routing, you can encode the route name in the
function name.

```
const router = (function () {
  const routes = {}
  return {
    add(fn) {
      routes[`/${fn.name.toLowerCase()}/`] = fn
    },
    show() {
      console.log(routes)
    },
  }
})()

const home = () => {}
router.add(home)
router.show() // { '/home/': [Function: home] }
```

You can also call the `toString()` property to get the source representation
of a function.

```
console.log(howMany.toString()) // (a, b, c) => {/* ... */}
```

**NOTE:** The output is generally going to be different from the original
function in terms of formatting, because it is decompiled from the JavaScript
byte code, and not a reference to your source code. If you are running this
code in NodeJS with Babel transpiler, it will, of course, be completely
different because it is compiled into a non-arrow function expression.

There are several more properties like `call()`, `apply()`, or `bind()`, but we
will only talk about `bind()` in this module. `call()` and `apply()` are
discussed in the `this.js` module.

All functions have a `bind()` function. This function is normally used to bind
non-arrow functions' `this` to some value, but it can also be used to perform
partial application of functions. For instance:

```
const onlyNeedsThree = (a, b, c) => {
  console.log(a, b, c)
}

const onlyNeedsOne = onlyNeedsThree.bind(undefined, 1, 2)

NOTE('Calling partially applied onlyNeedsTree')
onlyNeedsOne(3) // 1 2 3
```

The first argument to the `bind()` call is going to be the value of `this` in
an non-arrow function. With arrow functions, we don't really care, so we leave
it as `undefined`. Since this may look a little confusing, we could write our
own function to partially apply.

```
const partial = (fn, ...args) => fn.bind(undefined, ...args)

const onlyNeedsTwo = partial(onlyNeedsThree, 'a')

NOTE('Calling partially applied onlyNeedsThree')
onlyNeedsTwo('b', 'c') // a b c
```

You may be wondering why there are two kinds of functions in JavaScript (arrow
and non-arrow). The `function` function has a few characteristics that the
arrow function does not. Let's take a look at what those are.

Non-arrow functions have two special constants that are accessible within their
scope. These objects are `this`, and `arguments`.

The `arguments` object is an array-like object that contains all the arguments
passed to a function (regardless of its parameters). It is array-like because
it is not truly an array, and lacks some of the functions that real array
objects have. We won't go into further discussion of this object, as ES6 offers
much more elegant ways to get equivalent functionality, but if you ever run
into weird code like `[].slice.call(arguments)` you should know that this is
because `arguments` is only array-like.

The `this` object is convoluted enough to deserve a module of its own. Please
refer to `this.js` module for more information.

Furthermore, non-arrow functions can be used as object constructors, a topic
that is covered in more detail in the `proto.js` module.

As mentioned before, arrow functions *do not have `arguments` and `this` (and
also some other things that are not that important). Some programmers may tell
you that the arrow function has `this` which is bound to `this` in the outer
scope, but that is only true for practical purposes. You can access `this` in
an outer non-arrow function, for sure, but if your arrow function is defined
outside non-arrow functions, it will *not* have access to any kind of `this`
from any scope. If you care about `this` at all, you probably want to use
non-arrow functions instead and avoid having to think about whether `this`
means this or that (pun intentional).

If you want to restrict yourself to one of the function forms, you can pick the
arrow functions if you are willing to forget about `this` and constructors
(which may not be a bad thing, judging from what people who have done so say),
or forget about arrow functions. You could always use both, and you should
definitely *know* both, though.

Hopefully this gives you enough material to continue exploring programming with
functions in more detail.

```
// This function is intentionally hanging down here
function whereDoYouComeFrom() {
  console.log('Look at the bottom!')
}
```

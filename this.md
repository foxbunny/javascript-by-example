```javascript
import {NOTE} from './_util'
```

# About `this` and function invocation context

The `this` object represents the function's invocation context. This module
will try to explain what `this` is, and what 'invocation context' means.

**NOTE:** One of the main problems with `this` is that it is hard to talk about
it. When someone says 'this is the problem', you don't know whether they are
referring to the `this` object or trying to point something else out.
Unfortunately, it is too late to fix this, and `this` is here to stay. :)

Before you start reading this module, you should peruse the [func](./func.md)
module and make sure you have a firm understanding of what functions are in
JavaScript, and how they work. If you really feel like you'd like to read this
module first, at least remember this: in JavaScript, you (can) assign function
expressions to object properties but that is no different from assigning values
like `1` or `'hello'` to it, and has no special meaning. In other words it
doesn't automatically make them a method!

Functions in JavaScript can be invoked either directly or using dot notation,
as a method on an object, and a few other ways. Here's a list of the various
ways a function can be invoked.

```javascript
const myFunc = () => {}
const myObj = {
  myMeth: myFunc
}
```

- (1) We can invoke a function normally (directly)

```javascript
myFunc()
```

- (2) We can invoke it as an object method

```javascript
myObj.myMeth()
```

- (3) We can apply it to an object using `call()` or `apply()` functions

```javascript
myFunc.apply(myObj)
```

- (4) Invoked using `new` keyword as an object constructor

```javascript
new myFunc
```

Cases 2 and 3 are more or less the same, only using different syntax (which has
its uses). We won't talk much about the 4th case, which is discussed separately
in the [proto](./proto.md) module.

When a non-arrow function is invoked as an object's method or applied to an
object (cases 2 and  3), then the object in question is accessible as `this`.
If it is invoked as a constructor, then the newly created object is accessible
as `this` within the function body. In all other cases, the function is not
going to have a this (it will be `undefined`).

The last sentence is only true in ECMAScript 5 using strict mode, and later
versions of JavaScript. The diagram below illustrates this:

    ES3 ---- ES5 --+-- ES5 strict ---- ES6 ---->
                   |
         global <- | -> undefined


**NOTE:** `global` refers to `window` in browsers and `global` in NodeJS.

To ensure that you always get the correct behavior, include `'use strict';`
(single-quoted string) on its own line at the top of your module or use a
transpiler that does (almost all of them do).

When the value of `this` is defined, we say that function 'binds `this`' or
'defines `this`'. This formulation is suggestive of something that may come as
a surprise to many developers coming from primarily OOP languages. The `this`
binding is dynamic, not static: it is determined on *each* invocation, and not
at compile time. If you are coming from other OOP languages, you would do
yourself a great favor by remembering that.

Let's first look at a typical usage of `this` (one that's going to be the most
useful to you).

```javascript
const bear = {
  name: 'Teddy',
  own: function (what) {
    console.log(this.name + ' owns ' + what)
  }
}

NOTE('Invoke bear.own()')
bear.own('honey pot') // Teddy owns honey pot
```

When the `bear.own()` function is invoked as a method, using dot notation, the
value of `this` is the `bear` object. The same function can be assigned to a
variable and invoked stand-alone.

```javascript
let own = bear.own
try {
  own('honey pot') // in <ES5 w/o strict mode, logs 'undefined owns honey pot'
} catch (e) {
  NOTE('Error when invoking own() stand-alone')
}
```

The `bear.own` can also be passed to another function as an argument and
invoked within it.

```javascript
const callWithPot = (fn) => {
  fn('honey pot')
}

try {
  callWithPot(bear.own) // in <ES5 w/o strict mode, logs 'undefined owns...'
} catch (e) {
  NOTE('Error when invoking callWithPot(bear.own)')
}
```

As you can see from the examples, we get a `TypeError` exception if we try to
invoke `bear.own` without using the dot notation, because `this` is `undefined`
and does not have a `name` property. This happens because by assigning or
passing `bear.own` we merely pass the value of the property, which is a
function, and when the function is invoked, it is invoked in a different
context.

As mentioned before, if we run the same code in ES5 without strict mode we are
not going to get a `TypeError`, because `this` is bound to the global object.
This property of `this` has been subject to much controversy (and even more
bugs in ES5 and older), to the point where some programmers consciously avoid
using `this` in any form.

It is probably clear by now, but except when calling `bear.own()`, the fact
that we refer to it the function as `bear.own` has no special meaning, and it
is treated as any other function. This is why I tend to call callable
properties of JavaScript objects just 'functions' and not 'methods', although I
may sometimes say 'invoke *as* a method' to emphasize the dot notation. I also
avoid using terms like 'static method' or 'instance method' for the same
reason.

The context can be affixed using the `bind()` function. For instance:

```javascript
own = bear.own.bind(bear)
NOTE('Calling bound own()')
own('bound honey pot') // Teddy owns bound honey pot
```

In the above code, we have redefined the `own` variable to use a bound version
of `bear.own` which has `this` bound to `bear`. This binding allows us to
invoke `own()` stand-alone. The binding is permanent, and cannot be overridden
by additional calls to `bind()`. Although I haven't run into formal terminology
for functions that are bound, I like to call them 'bound functions'.

The `this` binding can also be changed temporarily using `call()` and `apply()`
functions which are properties on the function objects. These two functions are
similar, and serve the same purpose. The main difference is in how they treat
the arguments.

Let's define another object to work with.

```javascript
const deer = {
  name: 'Bambi'
}
```

The `deer` object we've defined does not have the `own` function, but we can
borrow one from the `bear`.

```javascript
NOTE("Borrowing bear's own() function")
bear.own.call(deer, 'flower pot') // Bambi owns flower pot
```

The `call()` call invokes `bear.own()` and binds `this` to the first argument
(`deer` object), passing the rest of the arguments to `bear.own()`.

If for some reason we don't know how many arguments we will have at runtime, we
can use `apply()`, which takes the arguments as an array.

```javascript
NOTE('Borrowing own() using apply()')
bear.own.apply(deer, ['flower pot']) // Bambi owns flower pot
```

As I mentioned before, both `call()` and `apply()` do the same thing.

We have already mentioned that the `this` binding is dynamic. It just so
happens that you can use this to your advantage quite easily. We will show this
by splicing the `bear`'s `own()` function into the `deer` object.

```javascript
deer.own = bear.own
NOTE("Using deer's own() function")
deer.own('flower pot') // Bambi owns flower pot
```

Invoking the `own()` function as `deer`'s method correctly uses the `name`
property on `deer` and not `bear` where the function was originally defined.
You can imagine that this type of borrowing can dramatically simplify code
where you would normally use inheritance in languages that statically bind
methods to objects.

We said that `this` is bound by a function. This includes any and all non-arrow
functions. This is also true when a function is defined within another one. A
common scenario is trying to access the outer function's `this`. A solution to
this issue is to assign `this` to a variable in the outer scope.

```javascript
const alligator = {
  name: 'Al',
  bites: 12,
  eat: function (food) {
    const that = this;
    (function bite() {
      // `this` in `bite()` is undefined, but `that` points to
      // `eat()`'s `this`
      if (that.bites <= 0) {
        console.log(that.name + ' is full')
        return;
      }
      console.log(that.name + ' took a bite out of ' + food.name)
      that.bites -= 1
      return bite()
    })()
    console.log(this.name + ' is going to bed now')
  }
}

alligator.eat(deer)
  // Al took a bite out of Bambi
  // ...
  // Al took a bite out of Bambi
  // Al is full
  // Al is going to bed now
```

You will see JavaScript programmers assign `this` to variables of different
names, including the popular choices like `that` and `self`. In general, you
should stick to the existing convention in the code base, or use one of the
popular choices for clarity.

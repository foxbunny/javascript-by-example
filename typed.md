```javascript
// The following comment enables Flow type checking in this module:
// @flow

import { NOTE } from './_util'
```

# Typed JavaScript

It is becoming more and more popular to write JavaScript code that has type
hints. Some developers go as far as to use proper statically typed languages
that compile to JavaScript. [Elm](http://elm-lang.org/) even boast having no
possibility of a runtime error thanks to its type system.

In this module we will explore why typing can be good for our code, and how to
take advantage of types. We will briefly touch on topics like using types to
model data flow as well as using them to formalize duck typing.

You should be fairly familar with types in JavaScript in order to follow the
type annotations that appear in the code. I recommend first visiting the [Type
detection](./type-detection.md) module if you haven't already.

**NOTE:** In the Markdown source for this module, you will see that many code
blocks are formatted as non-literate blocks (indented as opposed to fenced with
triple-backticks, they don't run). This is because such code blocks demonstrate
code that would not pass the type check. If you wish to run such code to see the
type check errors, enclose the block in triple-backticks:

    ``` <-- add this

        counterFactory('12')

    ``` <-- and this

## Working with untyped JavaScript

Working with untyped JavaScript is what most JavaScript developers would shorten
to just 'working with JavaScript'. Not only is JavaScript dynamically typed, but
it is also weakly typed as well. In other words, there aren't any safety
mechanisms in the JavaScript's type system that would save us from ourselves.
Despite all that, we have managed to write working software. How come there is
such hype around types now?

In reality, there is no such thing as 'working with untyped JavaScript'. We all
work with types whenever we are coding. That's just the nature of the beast.
Even without a safe type system, we do type inference and similar things that
type checkers do... in our heads!

Let's say we have an object factory like this one:

```javascript
let counterFactory = start => ({
  current() { return start },
  increment(i = 1) { start += i }
});
```

There is not a lot wrong with the code. We write a few tests and push the code
into production.

```javascript
NOTE('Using the counter factory')
let c = counterFactory(1)
c.increment()
console.log('c is incremented once:', c.current()) // 2
c.increment()
console.log('c is incremented twice:', c.current()) // 3
```

Seems to be working fine. At some point in time, we get a call from our teammate saying that the counter that started with 12 jumped straight to 121.

We track the bug down:

```javascript
NOTE('Passing wrong arguments to counter factory')
let userInput = '12'
c = counterFactory(userInput)
c.increment()
console.log('c with user input is incremented', c.current()) // 121
```

The form validation function did not convert the user input to a number, so we
passed a string to `counterFactory()`. In JavaScript, it's perfectly valid to
add a number to a string, and the number gets coerced into string before
concatenation.

In this case, strings are clearly no good to us. We need to make sure we can
only use numbers.

```javascript
counterFactory = start => {
  if (typeof start !== 'number') {
    throw new Error(`counterFactory needs a number, got ${typeof start}`)
  }
  return {
    current() { return start },
    increment() { start += 1 }
  }
}
```

Now if we try to repeat the stunt from before, we get a juicy error.

```javascript
NOTE('Calling factory with wrong argument type')
try {
  counterFactory(userInput)
} catch (e) {
  console.log('It raised: ' + e) // counterFactory needs a number, got string
}
```

Rinse and repeat for any type-sensitive code. Or maybe there's a better way...

## Enter type checking

What would happen if we could just say what type we want, and have our code be
unable to run until that condition were satisified? We're in luck, because
that's exactly what type checking does for us.

Let's see an example:

```javascript
counterFactory = (start: number) => ({
  current() { return start },
  increment() { start += 1 }
})
```

We have now declared that `start` is a number. Because of this, the code like
the following will not even compile:

    counterFactory('12')

Instead, we would get an error message like the following:

    xx: counterFactory('12')
                       ^^^^ string. This type is incompatible with the expected param type of
    xx: counterFactory = (start: number) => ({
                                 ^^^^^^ number

This is essentially the same as throwing an exception, but with an important
difference: this error happens *before our code is deployed and executed!*

In the example with an exception on type mismatch, there's no guarantee we'd
ever see the error ourselves. The code may only trigger the exception under some
condition that cannot be replicated in our tests (or is quite expensive to do
so), and/or we may forget to manually test that case. In contrast, type check
errors are always triggered (well, technically *almost* always as, in some
scenarios, types can be difficult to figure out even for type checkers).

What kind of magic is this? The answer is static code analysis. Tools like
[Flow](https://flowtype.org/) and [TypeScript](typescriptlang.org) will go
through your code and visit all possible branches (without running it!) and
determine whether the types of various objects that are being passed around all
match up.

For this project, we have selected Flow as our type checker. We have also
mentioned TypeScript. The differences are many, but the key difference is that
Flow is a type checker, while TypeScript is a type-checking compiler. If you are
familiar with [Babel](http://babeljs.io/), TypeScript is basically like Babel +
Flow.

We won't go into how setting either of the tools up goes as the instructions are
given in the respective documentation (see [Flow
docs](https://flowtype.org/docs/getting-started.html#_) and [TypeScript
docs](http://www.typescriptlang.org/docs/tutorial.html)).

## Adding type hints (Flow)

Let's go back to our counter factory example. We have, thus far, only added a
type hint for the input value, `start`. We can add hints for everything that
goes on inside the created object, though, as well as the return value of the
factory function. 

Let's see a complete example:

```javascript
/*:: 
type Counter = {| 
  current: () => number, 
  increment: (?number) => void 
|} 
*/

counterFactory = (start: number): Counter => ({
  current() { return start },
  increment(i = 1) { start += i },
})
```

We have added the `Counter` type alias. A type alias is a separate piece of code
that describes the shape of an object. It is enclosed in the special Flow
comments (`/*::`) so Flow will pick it up, but that is not necessary. You can
also write type aliases without wrapping them in the comments. (In my case, it
broke syntax highlighting in the editor, so I chose to use the comment style.
YMMV)

Type alias is not the same as a `class`. We are merely saying that `Counter` is
*any* object that has properties `current` and `increment`, where both
properties are functions. We also declared what these functions may do. In
particular, we declared that the `increment()` function may take one optional
argument which should be a `number`, by adding a `?number` annotation. We did
not have to annotate the actual properties that are on the returned object
because we have taken care of that in the type alias. (I'll leave it as an
exercise to the reader to modify the return value of the function and observe
Flow's error when the return value no longer matches the type alias.)

We are encosing the properties in `{|` and `|}` to tell Flow that these are
the only properties for this type. If we wanted to allow for other properties
that may or may not exist (e.g., be added to the returned object by some other
part of our code), we would have used `{` and `}` instead.

Let's see what we get out of the type alias. If we were to run code like this:

    c = counterFactory(12)
    // Maybe someone thought this is how you reset the counter?
    c.x = 0

we would get an error:

    xx:     c.x = 0
              ^ property `x`. Property not found in
    xx:     c.x = 0
            ^ object type

In plain JavaScript, it would still be possible to run this code and it would
work, because we can always assign properties to objects. We woudn't get the
desired result, and we'd be scratching our head. Flow did not let our code pass
because we told it that we don't want extra properties in our `Counter` type, and thus saved us some head-scratching.

As you can see, by declaring the return type, we made sure that bad (or even
merely weird) things cannot happen to the code that uses the factory function,
not even by accident.

Let's now take a look at a few more examples:

```javascript
const identity = x => x
```

The above is the plain version of an identity function. It takes a value of any
type, and returns the same value, which, by defintiion, must be of the same type
as the input.

```javascript
const identity1 = <T>(x: T): T => x
```

The new identity function is exactly the same as the previous one, but annotated
as a polymorphic function where the type itself behaves like a variable.
'Polymorphic' is fancy jargon to say that the type `T` itself is a variable.
This is different from a function that takes `any` type, in that the type does
matter as long as input and output are of the same type.

Now that we know how polymorphic functions are annotated, we can get a bit more
practical and use this annotation for the identity function:

```javascript
const identity2 = (x: any) => x
```

Since we are returning the same thing, it is a given that the output must be of
the same type as input. We could also omit `any` as it is implied, but we will
keep it as a reminder to ourselves that `x` can be of any type.

```javascript
const compose2 = (g: Function, h: Function): Function => 
  (...args: Array<any>): any => 
    g(h(...args))
```

**NOTE:** If you are new to ECMAScript 6, `...args` is syntactic sugar to
capture all arguments and convert them into an array. We are using `Array<any>`
in the type annotation to denote that these arguments can be of any type (mixed
array).

The `compose2()` function takes two arguments that are functions, and returns a
function. The returned function takes any number of arguments of any type, and
calls a composition of the two functions on those arguments, returning a result
of any type. Let's focus on `compose2()`'s type itself:

    (g: Function, h: Function): Function

We can learn a thing or two from the type annotation. First of all, this is a
binary operation (takes two arguments) on values of the same type that produces
a value of the same type as the inputs. This means that this function folds
values. Functions that fold values can be used to reduce arrays containing
objects of the same type as the function's inputs. 

The *implementation* of the function determines what the end result is, whereas
the *type* of the function tells us what we can do with the function. Where it
fits, so to speak. Types, in other words, help us form and reason about
interfaces.

Let's see an example of reducing an array using `compose2()`:

```javascript
const compose = (...fns: Array<Function>): Function => 
  fns.reduce(compose2)
```

We were able to use `compose2()` function to compose an array of functions
taking advantage of the fact that binary operations on the same types can be
used to reduce arrays. Type signatures can be a powerful tool for modelling our
application's data flow, in addition to being a safety net. (I like to think
this is reason behind Flow's name, too.)

If you are like me, an important detail may have eluded you initially. By
declaring `fns` as `Array<Functions>`, we are restricting `compose()` to take
only functions. If we call it with anything else, our program would fail to pass
the type check.

    compose('foo', 1, null)

The above code results in this error:

    ...
    xx:     compose('foo', 1, null)
            ^^^^^^^^^^^^^^^^^^^^^^^ function call
    xx:     compose('foo', 1, null)
                    ^^^^^ string. This type is incompatible with
    xx: const compose = (...fns: Array<Function>): Function =>
                                       ^^^^^^^^ function type

    ...
    xx:     compose('foo', 1, null)
            ^^^^^^^^^^^^^^^^^^^^^^^ function call
    xx:     compose('foo', 1, null)
                            ^ number. This type is incompatible with
    xx: const compose = (...fns: Array<Function>): Function =>
                                       ^^^^^^^^ function type

    ...
    xx:     compose('foo', 1, null)
            ^^^^^^^^^^^^^^^^^^^^^^^ function call
    xx:     compose('foo', 1, null)
                              ^^^^ null. This type is incompatible with
    xx: const compose = (...fns: Array<Function>): Function =>
                                       ^^^^^^^^ function type

Saved by the type check again!

## A more complex example

Let us now look at a fairly complex example:

```javascript
/*:: 
type Composition = {
  (x: any): any,
  add: (fn: Function) => Composition 
}
*/

const composer = (fn: Function): Composition => {
  function f(x) { return fn(x) }
  f.add = (fn2) => composer(compose2(fn, fn2))
  return f
}
```

The `composer()` factory function returns a callable object (which is a fancy
name for a normal function). The returned function has a property called `add`,
which is a method. We call the return value a `Composition`. We can compose the
composition with another function by calling `add()`. Each time we call this
function, a new `Composition` object is returned.

The return value of the `compose()` function is annotated using a `Composition`
type alias. Even though the return value is a function, we treat it as an
object. A callable property has been added to the type alias definition: `(x:
any): any`. This signifies that the object is, indeed, a function.

Note that we cannot use `{| |}` for annotating callable object types. This does
not mean that the returned functions can have their properties modified without
triggering an error. In fact, callble objects cannot be modified at all, ever.

The following code will not work:

    c = composer(x => x + 1)
    c.foo = 12

It results in the following error:

    xx:     c.foo = 12
              ^^^ property `foo`. Property not found in
    xx:     c.foo = 12
            ^ object type

## Higher-order functions

We've already looked at a few higher order functions, but we haven't talked
about higher order functions that take a specific type of functions.

Consider this example:

```javascript
const apply = (x, fn) =>
  fn(x)
```

`apply()` is a simple function that takes a value and a function and returns the
result of calling the function on the value.

Let's look at another function:

```javascript
const applyS = (s: string, fn: (x: string) => number): number =>
  fn(s)
```

The `applyS()` function is mechanically identical to `apply()`. In fact, when
the type annotations are stripped by Babel, they are completely identical! The
only difference is the type annotation. `applyS()` will only take strings, and
the function passed to it must also only accept strings. Both the `applyS()`
function and its second argument must return a number. When type checking is
involved, `apply()` and `applyS()` become completely different functions.

If we try to shoot ourselves in the foot:

    const myFn = (x: number) => x + 1
    applyS('foo', myFn)

we are loudly warned:

    xx: const applyS = (s: string, fn: (x: string) => number): number =>
                                           ^^^^^^ string. This type is 
                                           incompatible with the expected 
                                           param type of
    xx:     const myFn = (x: number) => x + 1
                             ^^^^^^ number

## Functions that accept multiple types

It is sometimes useful to have a function that can take multiple types. The
following example is a function that accepts the result of a regex match, and
returns any groups.

```javascript
const groups = (m: null | Array<string>): Array<string> =>
  (m === null) ? [] : m.slice(1)

const rxp = /^([a-z0-9]{3})-([0-9]{4})-([0-9]{4})-([0-9]{4})/ig
console.log('match:', groups(rxp.exec('F71-4451-6773-8193')))
console.log('no match:', groups(rxp.exec('bogus')))
```

The union type, `null | Array<string>`, allows for either null or an array of
strings, but no other types.

One thing to note about union types is that you may still need to do type
detection, even though type checking is done. In fact, the `groups()` function
is doing just that: `m === null`. What we gain from this is that type detection
is now more restricted, and less error-prone. For example, there is no way
`m.slice()` is ever going to get called on something other than an array of
strings because anything other than a null must be an array of strings.

## Generic containers

Array is a generic container. We have seen `Array<Function>` and `Array<string>`
before. This means that an array can contain some other type. We may or may not
be interested in array members' type(s). For example, this function does not
care:

```javascript
const arrayMap = (fn: (x: any) => any, xs: Array<any>) =>
  xs.map(fn)
```

We can generalize this even further and ask for any object that has a `map()`
function.

```javascript
/*::
type Functor = { +map: (fn: Function) => Functor }
*/

let map = (fn: (x: any) => any, x: Functor) => 
  x.map(fn)
```

Note the use of `+` in `+map` of the type alias. For now just ignore it. We'll
come back to that later.

Back our example. We have defined a new type alias called Functor, which is any
object that has a `map()` property that takes any value and returns any value.
It may also have other properties but we only care about `map`.

This should, in theory, work on arrays, but it does not, becuase Flow currently
treats arrays as non-objects. Because of this, we will use a union type instead.

```javascript
map = (fn: (x: any) => any, x: Functor | Array<any>) => 
  x.map(fn)
```

Now we can give our function a try.

```javascript
const increment = (x: number) => x += 1
console.log('map over array:', map(increment, [1, 2, 3])) // [2, 3, 4]
```

And to prove an important point, we will also build our own container type, and
use `map()` on it:

```javascript
class Some {
  x: any  // <-- this is a type declaration, not part of the class syntax

  constructor(x: any) {
    this.x = x
  }

  map(fn: Function) {
    return new Some(fn(this.x))
  }

  static of(x: any) {
    return new Some(x)
  }
}

console.log('mapping over Some:', map(increment, Some.of(2))) // Some { x: 3 }
```

Even though we never said anything about `Some` being a functor (which it is), Flow detected that `Some` has functory features, and let us run this code.

Going back to our type alias, our take-away is that we can use types not only to
define complete objects, but also aspects thereof that we are interested in. In
other words, we can use type aliases like a filter for our data, or, to put it
differently, as formalized duck typing.

## Type variance

**NOTE:** In this subsection, you will see terms that may sound scary. Don't try
to memorize/understand everything you find here if you find it too much to take
in, though. Just remember that you've seen these terms here so you can refer to
this part of the module if you encounter the terms in the error messages.

We haven't touched on this yet, but before we delve deeper into the topic of
variance, we should give out a short definition of what types are. 

When we talk about types, we are not talking about classes. Types are a more
generic concept.

In the context of this discussion, types are **collections of possible values**
that we could pass, return, expect. Although these collections could be familiar
types like `string` or `number`, they could also be union types like like
`string | number` or `null | boolean`, or abstract things like `Functor`.

Since we are talking about collections, I will use `<=`, `==`, `<>`, and `>=`
operators to talk about the relationships between them. These operators roughly
describe the relative sizes of collections. For example, when we say `A <= B` it
means that `A` is a subtype of `B`, meaning that all possible values in `A` are
contained in `B`. Although it is kind of incorrect, we could get away with
saying that `A` is more specific than `B`, and `B` is more generic than `A`.

Two types can be bivariant, invariant, covariant, or contravariant. These are
the technical terms for how we describe a comparison between the types in terms
of type-subtype relationship.

* covariant: `A <= B`
* contravariant: `A >= B`
* invariant: `A <> B`
* bivariant: `A == B`

In concrete terms, `Cats <= Animals`, and `Dogs <= Animals`. So `Cats` and 
`Animals` are covariant. `Dogs` and `Cats` are invariant. `Animals` and `Cats` 
are contravariant.

### Property variance

When writing programs, we may also say that function input can be covariant, or
that object properties are contravariant. In most cases, we are talking about
the argument being passed in or a value being read/assigned, as compared to the
type in the type annotations.

Remember the plus sign next to `map()` in our functor type alias? The plus sign
marks it as covariant. When a function takes an object of the `Functor` type, 
it must have a `map` property that is covariant with the `map` property in our 
type alias, or, in other words, more specific than (or equivalent to) the 
`Functor`'s `map`, i.e., a subtype.

In order to write a value to a property (assign, call as a function, etc), the
value must 'fit'. In other words, the type of the value (`V`) must be a subset
of the values that the property will accept (`A`). This can be written as `V <=
A`, which we recognize as 'covariant'. In concrete terms, a property that can
hold values of `Animals` type can also hold a value of `Cats` type, but the
other way would not work.

Conversely, when reading a value from a property, we cannot expect less than the
property could possibly throw at us (we must be prepared!). In other words, the
expected type (`V`) must be a superset of what the property could return (`A`).
Written as `V >= A` this reveals these types are 'contravariant'. Again, in
concrete terms, if we expect a `Cats` from a property that can hold `Animals`
values, we may get a `Dogs`. The other way around would work just fine.

If this is a bit too much to take in, remember this rule:

* If you are reading from a property `foo.bar`, mark `bar` with minus sign.
* If you are assigning to a property or calling it as a function (`foo.bar =
  x`), then mark `bar` with a plus sign.
* If you are describing a return value, you don't need either

### Function variance

Although you don't have to do anything special, variance of function types can
also play a role in what you can, or cannot do.

When considering whether functions can be passed in as an argument, we also have
to think about variance. Let's call the functions accepted inptus `A`, and
possible outputs `O`. If we call the function with a value that has a type `V`,
and we expect the return value to be `R`, and looking from the perspective of
our function, we have the following relationships:

* `A >= V`: we can only pass subtypes of function's expected input types
* `R <= O`: we can only expect to receive a supertype of what function can return

For the most part, you won't have to worry about this as long as you are working
with relatively simple types.

## So much more

This module merely scratched the surface of the topic, and is still one of the
longest modules in the collection. Going into details on all possible scenarios
would probably lead to a book of its own.

Due to time and space constraints, we are ending the discussion of typed
JavaScript here. Hopefully this was enough material to get you started.

## A word of warning

The last thing I want is for you to dive in, realize how hard things are in
reality, and then feel like I've cheated you into it. I should warn you that
things aren't all peaches and creme. JavaScript type checkers are relatively
new, and JavaScript was not designed for static typing. You will certainly run
into weird edge cases. To give you a taste of what's in the store:

- Flow won't bother checking JSX, so if you're a React fan, Flow will *not* save
  you from some of the foot-guns.
- TypeScript is not curry-friendly, so it will complain about perfectly valid
  partially applied functions.
- Flow does not like it when you use code that enhances built-in prototypes.
- Many (most?) third party libraries you may want to use do not have any type
  hints.

This is just a few of the issues I've seen online or encountered myself.

Type checking is also not a replacement for unit testing, nor will it make your
code free of runtime errors like Elm does.

If this discouraging, remember one thing: we have programmed in JavaScript
before type checking existed. The world *won't* end if Flow and TypeScript
suddenly disappeared. No, seriously, it won't.

You should also know that, at least with Flow, you can always just run the code
that fails the type check if you think the type checker was not correct (example
code in this book is rigged to not do that, but you can set your project up to
bypass type checks).
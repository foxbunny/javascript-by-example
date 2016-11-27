```javascript
import {NOTE} from './_util'
import daggy from 'daggy'
```

# What is prototypal inheritance in JavaScript?

With the influx of developers from various backgrounds, the JavaScript scene
has been 'enriched' with plenty of confusion around object orientation. The
gist of it is that JavaScript OOP is not class-based, and grasping this idea is
probably the key to clearing this confusion up and becoming a better JavaScript
programmer.

The goal of this module is to demonstrate how prototypal inheritance works, and
hopefully shorten the time it takes for novice JavaScript programmers to master
it .

To get started, let's say we have two objects:

```javascript
let printer = {
  print() {
    console.log(this.num)
  }
}

let counter = {
  increment() {
    this.num += 1
  },
  decrement() {
    this.num -= 1
  }
}
```

How do we combine these two objects so that we can use the functionality of
both objects in a new object? The answer is prototypes. Let's create yet
another object. This time the object will only have the `num` property to which
the other two objects were referring to.

```javascript
let thing = {
  num: 0
}
```

Let's set `thing`'s prototype to `printer` so that we can use the `print()`
function.

```javascript
Object.setPrototypeOf(thing, printer)
```

Now we can call `print()` function as `thing`'s property.

```javascript
NOTE('thing.print()')
thing.print() // 0
```

Now let's modify the `num` property on `thing` and invoke `print()` again, to
make sure that we're getting the correct result.

```javascript
thing.num = 12
NOTE('thing.print() after setting num to 12')
thing.print() // 12
```

Now we know that the `print()` function has been borrowed from the `printer`
object. We'll digress here a bit to note a few things about this borrowing.

The borrowing you see is done at runtime, not compile time. For instance, if we
were to modify the original `print()` function, the modified version will be
used even if we modified it *after* the prototype chain is established.

```javascript
printer.print = function () {
  console.log('num is: ' + this.num)
}

NOTE('thing.print() after modifying printer.print()')
thing.print() // num is: 12
```

As you can see, this lookup is dynamic, and the updated `print()` function from
`printer` is being used.

Now let's define a print function on `thing` itself, and see what happens.

```javascript
thing.print = function () {
  console.log('I am thing')
}

NOTE('After adding a print function on thing')
thing.print() // I am thing
```

Defining the `print()` function on `thing` causes that version to be used
instead. The lookup on `printer` is only done if `thing` does not have the
property we are asking for. This new `print` property is called 'own property'
to distinguish it from inherited properties.

For now, let's revert the last change by deleting the `thing`'s own print
property.

```javascript
delete thing.print

NOTE('Calling thing.print() after deleting the own property')
thing.print() // num is: 12
```

We will now combine all three objects. To do this, we'll change the prototype
chain a little.

```javascript
Object.setPrototypeOf(counter, printer)
Object.setPrototypeOf(thing, counter)
```

As you can no doubt guess, we are setting the prototype chain such that
`thing`'s prototype is `counter`, whose prototype is `printer`. In other words,
the chain now looks like `thing -> counter -> printer`.

We can still invoke the `print()` function as `thing`'s property as before:

```javascript
NOTE('thing.print() after changing the prototype chain to thing -> counter -> printer')
thing.print() // num is: 12
```

In addition, we also have access to the two functions in the `counter` object.

```javascript
NOTE('thing.increment()')
thing.increment()
thing.print() // num is: 13

NOTE('thing.decrement()')
thing.decrement()
thing.print() // num is: 12
```

If we log `thing` itself, though, we'll learn something interesting.

```javascript
NOTE('Log thing itself')
console.log(thing) // { num: 12 }
```

It does not list any of the properties from the prototypes. It only lists own
properties. We can get a list of all properties -- own and inherited -- by
looping over the keys:

```javascript
NOTE('Looping over keys on thing')
for (let key in thing) {
  console.log('thing has key', key)

  // The `hasOwnProperty()` function can be used to test if some key is an own
  // property of an object. Incidentally, this method comes from the
  // `Object.prototype` which all objects have as the final prototype.

  if (thing.hasOwnProperty(key)) {
    console.log(key + ' is an own property')
  } else {
    console.log(key + ' is not an own property')
  }
}
```

To get all own properties as an array, we can use `Object.keys()` function.

```javascript
NOTE('Object.keys(thing)')
console.log(Object.keys(thing)) // [ 'num' ]
```

Now `thing` is just one object. What if we want to create multiple versions of
`thing` where each has a specific value of `num`? Kinda like... erm... classes?
Armed with what we have seen thus far, it is not unimaginable that we could
write functions for the purpose. It's not quite the same as a class in other
languages, sure, but the effect is more or less the same.

```javascript
const makeStuff = function (num = 0) {
  let thing = {num: num}
  Object.setPrototypeOf(thing, counter)
  return thing
}

let thing1 = makeStuff(5)
let thing2 = makeStuff(3)
let thing3 = makeStuff(100)

NOTE('thing1.print()')
thing1.print() // 5
NOTE('thing2.print()')
thing2.print() // 3
NOTE('thing3.print()')
thing3.print() // 100
```

The use of `setPrototypeOf()` function to create prototype chains is used
very rarely in real life, if at all. The main reason for this is that it
changes the prototype of an already instantiated object, which can be slow
when the object you've created is *already* referenced in many places in
your code *when you call `setPrototypeOf()` on it*. You should definitely
*not* use it in such a scenario (fixing inheritance after the fact).

For object creation, though, the use of `setPrototypeOf()` seems to be on par
with other methods of creating objects in terms of performance. Therefore,
there is no reason to avoid it.

Another way to establish prototypal inheritance is to use `Object.create()`.
This method is discussed in much more depth by Douglas Crockford in his famous
article entitled Prototypal inheritance (see
http://javascript.crockford.com/prototypal.html). Since he wrote the article,
the example code has made it into the official ECMAScript 5 specification and
is now supported in virtually all JavaScript engines.

Let's replicate the above three objects using `Object.create()`. We'll leave
`printer` alone, as it is the last member of the chain and we don't need to do
anything special.

```javascript
counter = Object.create(printer)
```

This code creates an empty `counter` object which has its prototype set to
`printer`. Since it's an empty object, we need to add the two own properties.
In ECMAScript 2015 (a.k.a. ECMAScript 6), we can use `Object.assign()` to
create all own properties using an object. This approach is not possible in
earlier versions of JavaScript, where you have to add properties one by one.
We'll see both approaches, starting with the old approach first.

```javascript
counter.increment = function () {
  this.num += 1
}

counter.decrement = function () {
  this.num -= 1
}
```

The new way to achieve the above (and the above is still a valid approach)
would be:

```javascript
Object.assign(counter, {
  increment() {
    this.num += 1
  },
  decrement() {
    this.num -= 1
  }
})
```

Although I say 'new way', it does not do exactly the same thing as assigning
properties. The way we use `Object.assign()` here, a new object literal is
first created, and then its own properties are copied to the `counter` object
after that. This is probably fast enough in most situations, but it stands to
reason that it would be slower than assigning properties one by one. In most
cases, I imagine it will not be an issue. Profiling is your friend, though.

Now `counter` is equipped with the same own properties as the original
`counter`. Finally we create `thing` which inherits the properties on
`counter`. For this we will write a new version of the `makething` function
using `Object.create()` and `Object.assign()`.

```javascript
const createThing = function (num = 0) {
  let thing = Object.create(counter)
  Object.assign(thing, {
    num: num
  })
  return thing
}

thing = createThing(0)
```

We can now use the prototype chain to do what we could do with the original
three objects.

```javascript
NOTE('thing.increment() twice')
thing.increment() // thing.num === 1
thing.increment() // thing.num === 2

NOTE('thing.decrement() once')
thing.decrement() // thing.num === 1

NOTE('thing.print()')
thing.print() // num is: 1
```

We will not go into too much detail on constructor functions and classes, since
there is plenty of material on those already. It should be noted, though, that
prototypal inheritance is at the heart of both ways of object creation in
JavaScript and you should not forget that. In this guide, I will just show some
examples of how to replicate the prototype chain using the two methods
mentioned. For brevity, I will leave `printer` and `counter` alone, and
demonstrate just the `thing` part.

```javascript
function Thing(num = 0) {
  this.num = num
}
Thing.prototype = counter

thing = new Thing(0)

NOTE('thing.increment()')
thing.increment() // thing.num === 1

NOTE('thing.print()')
thing.print() // num is: 1
```

A few notes about the constructor function. The constructor function is a
normal function just like any other. There is no hidden magic in it. It
capitalized as a convention as a cue that it's a constructor. The trick is in
the `new` keyword. When a function is invoked with the `new` keyword, a new
blank object is created. The object's prototype is set to the constructor's
`prototype` property (in our case, it's `Thing.prototype` which we point to
`counter`), and the function is invoked with `this` set to the newly created
object. Anything we do to `this` in the constructor is done to the new object
(in our example, assigning the `num` property).

**NOTE:** see the [not-new](./not-new.md) module for an implementation of the
`new` keyword as a JavaScript function.

A common complaint about constructor functions was the requirement to use
`new`. This is actually quite easy to mitigate with a little bit of code.

```javascript
function AnotherThing(name) {
  if (!this) return new AnotherThing(name)
  // Do the normal constructor things below:
  this.name = name
}

AnotherThing.prototype.print = function () {
  console.log('another thing:', this.name)
}

const another1 = AnotherThing('without new')
const another2 = new AnotherThing('with new')

another1.print() // another thing: without new
another2.print() // another thing: with new
```

The reason it works without `new` is that when invoked without `new`, the
`this` is undefined (you need to use strict mode for this, though, so be
careful).

As mentioned before, ECMAScript 6 introduced a new `class` keyword to help out
developers that feel more comfortable thinking in terms of classes. The keyword
does not really change the fact that we are doing prototypal inheritance,
though, and if you fancy using it, you should be aware of this fact.

Again, doing `thing` as the example, we will implement an ES6 class. This time,
though, we cannot do direct inheritance from the `counter` object as ES6
classes can only inherit other classes or constructors.

For the purposes of this example, let's just imagine we have a `counter` class
that implements `counter`.

```javascript
class Counter /* extends printer */ {
  constructor() { /* ... */ }
}

// We use 'Thing1' below because we cannot have multiple classes and
// constructors  of the same name

class Thing1 extends Counter {
  constructor(num = 0) {
    super() // <-- must call this when using inheritance
    this.num = num
  }
}
```

You will notice the `super()` call in the `Thing1`'s constructor. This is a
shortcut for invoking the `Counter`'s constructor and it is *required* if you
need to manipulate `this` in the constructor. This is good example of why I
think the classes in ES6 introduce completely unnecessary levels of complexity,
and why I personally don't find them so useful.

If we don't want to have a `counter` class, and we want to stick to using
`counter` object we can still do that.

```javascript
class Thing2 {
  constructor(num = 0) {
    this.num = num
  }
}

Thing2.prototype = counter
```

In this case, we don't need to invoke `super()` as there is no superclass. We
can also clearly see that classes also have the `prototype` property which
works the same way as the `prototype` property on constructors.

Instantiating the class is exactly the same as with constructors (the whole
`class` business is actually just another way to write constructors).

```javascript
NOTE('Create thing using a class')
thing = new Thing2(8)
thing.increment() // thing.num === 9
thing.print() // 9
```

All of the built-in types in JavaScript are implemented as or have matching
constructor functions. For instance, `Date`, `Array`, `String` and similar, are
all constructors. This is the reason you will frequently see references to
`Array.prototype.slice()` and similar functions, which are properties on the
objects created by the mentioned constructors. `Array.prototype.slice()` is the
same as `[].slice()`, and the former notation is simply used as a convention
(possibly because `[].slice()` looks a bit weird in documentation).

**TRIVIA:** `Math` is named like a constructor, but it is not.

If you want to create a constructor function quickly, and you don't care about
inheritance at all (there are valid use cases for this in declarative
programming), there is a very nice library called daggy. Although I don't
normally recommend any particular library for anything, daggy is an exception
because it is very small, and it doesn't try to do too many things at once.

To create a constructor using daggy, you just call the `tagged()` function. For
example:

```javascript
const Thing3 = daggy.tagged('name')

Thing.prototype.print = function () {
  console.log(this.name)
}
```

Then you can work with it as with a normal constructor. The library doesn't
just create constructors. The arguments passed to `tagged()` become the
constructor arguments an the object properties. The constructor also checks if
*all* the arguments were supplied, and allows the usage without `new`. In a
way, daggy's tagged constructors are constructors on steroids.

```javascript
try {
  let thing3 = Thing3()
} catch (e) {
  console.log('Could not create Thing3 without arguments')
}
```

With this, we conclude the module on prototypal inheritance. Remember that
there is no one correct way to do these things in JavaScript, and with ES5
and ES6 we now have more options than ever. On the other hand, prototypal
model is at the heart of it all in JavaScript, and that is the single truth
that you have to keep in mind whatever path you choose.

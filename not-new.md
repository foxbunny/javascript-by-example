```
import {NOTE} from './_util'
```

# How the `new` keyword works

This module will implement the JavaScript's `new` keyword as a function, that
can be invoked on a normal constructor function to faithfully replicate the
keyword's functionality. The function is by no means useful in real-life
situations. It's purpose is to reveal the guts of the `new` keyword so you can
understand what it does.

For more information on prototypal inheritance in JavaScript (which covers the
usage of constructor functions), take a look at the `proto.js` module.

We will start by defining a constructor function.

```
function Foo(name) {
  this.name = name
}
```

We also want the objects to inherit some properties, which we will set using
the constructor's `prototype` property.

```
Foo.prototype.exclaim = function () {
  console.log(this.name + '!')
}
```

Normally, we would use this constructor like so:

```
NOTE('Create foo using Foo constructor')
let foo = new Foo('Superman')
console.log('foo.name ===', foo.name) // foo.name === Superman

NOTE('foo.exclaim()')
foo.exclaim() // Superman!
```

A function that replaces the `new` keyword may look something like this:

```
const neo = function (ctor, ...ctorArgs) {
  // Create the new object
  let obj = {}
  // Set the object's prototype to constructor's `prototype` property
  Object.setPrototypeOf(obj, ctor.prototype)
  // Apply the constructor to the new object using constructor arguments
  ctor.apply(obj, ctorArgs)
  // Return the new object
  return obj
}
```

Let's see if the function actually does what we want.

```
NOTE('Create bar using Foo constructor and neo() function')
let bar = neo(Foo, 'Batman')
console.log('bar.name === ', bar.name) // bar.name === Batman

NOTE('bar.exclaim()')
bar.exclaim() // Batman!
```

Hopefully, the `new` keyword has been demystified and you have a better
understanding of what exactly it does.

**NOTE:** In the example function, the first and second step can be merged into
a single `Object.create()` call. This has not been done in order to break down
the operations that the `new` keyword performs. A slightly shorter version of
the `neo()` function may look like this:

```
const neo2 = function (ctor, ...ctorArgs) {
  let obj = Object.create(ctor.prototype)
  ctor.apply(obj, ctorArgs)
  return obj
}
```

```javascript
import {NOTE} from './_util'
```

# Type detection

JavaScript is a loosely typed language. This means that most of the time, you
don't care about types. Not that there are no  types, mind you, but it's just
that there's no syntax for you to explicitly specify types. If you come from a
statically typed language, this may sound blasphemous, but try to think about
it as one less thing to worry about. While this is generally true, there are
occasionally cases, where you have to know what type some input is in order to
take appropriate action, and that's where this module's content comes in handy.

Before we go into type detection itself, let's talk about types in JavaScript.

There are two types of values in JavaScript: primitive values and objects.
Primitive values are:

- boolean (true, false)
- null
- undefined
- string
- symbol (since ECMAScript 6)

The primitive types can generally be obtained using the `typeof` function,
which returns the name of the primitive value's type.

```javascript
console.log('type of true:', typeof(true)) // boolean
console.log('type of 1:', typeof(1)) // number
console.log('type of null:', typeof(null)) // object
console.log('type of undefined:', typeof(undefined)) // undefined
console.log('type of string:', typeof('hello')) // string
console.log('type of Symbol("hello"):', typeof(Symbol('hello'))) // symbol
```

In both the browsers and on NodeJS, you will notice something strange. When you
call `typeof()` on `null` you will get "object" instead of "null". This is
generally a big omission in the JavaScript specification, and `null` is the
only primitive value whose type you cannot test with `typeof`. Luckily, `null`
is the only value of `null` type, so you can simply test for equality:

```javascript
let nothing = null;
console.log('null === null:', nothing === null) // true
```

There is no difference between floating point numbers and integers. They are
both `number` type.

```javascript
console.log('type of 1.344:', typeof(1.344)) // number
```

**NOTE:** `typeof(x)` can also be written as `typeof x`, and there is no
difference.

Functions are the only non-primitive type that you can detect using `typeof()`
and it returns "function" as expected.

```javascript
console.log('type of function:', typeof(() => {}))
```

When it comes to built-in non-primitive types such as `Arrays`, `typeof()`
always returns `object`.

```javascript
console.log('type of [1, 2, 3]:', typeof([1, 2, 3])) // object
console.log('type of {a: 12}:', typeof({a: 12})) // object
console.log('type of new Date():', typeof(new Date())) // object
console.log('type of /regexp/:', typeof(/regexp/)) // object
```

There are a few ways to check the type of these objects. One of the common
methods is to use the `instanceof` operator.

```javascript
console.log('/regexp/ is instance of RegExp:', /regexp/ instanceof RegExp)
```

This also works with custom constructors that you may create.

```javascript
class MyCtor { }
let my = new MyCtor
console.log('my is instance of MyClass:', my instanceof MyCtor) // true
```

It does not work, however, if you are doing prototypal inheritance some
other method.


```javascript
const myBase = {
  foo: 12
}

const myFactory = () => {
  const newMy = {}
  Object.setPrototypeOf(newMy, myBase)
  return newMy
}

my = myFactory()

try {
  console.log('my is instance of myBase:', my instanceof myBase) // throws
} catch (e) {
  NOTE('Error while testing whether my is instance of myBase')
}
```

To check whether `my` inherits from `myBase`, you need to use the
`isPrototypeOf()` function instead:

```javascript
console.log('myBase is prototype of my:', myBase.isPrototypeOf(my)) // true
```

We mentioned that `instanceof` operator is one of the ways to test the type of
built-in non-primitives. Another way is a bit hackish, but you will see that it
is surprisingly useful. Every plain object has a `toString()` function. For
example:

```javascript
console.log('({n: 12}).toString():', ({n: 12}).toString()) // [object Object]
```

This function, when applied to objects other than the plain objects, gives us
information about their type. Since this function is a property on the objects
themselves, we can access it as `Object.prototype.toString()` (see the
[proto](./proto.md) module for more information on how this works).

```javascript
const toString = Object.prototype.toString
console.log('toString() on [1,2,3]:', toString.call([1, 2, 3])) // [object Array]
console.log('toString() on /regexp/', toString.call(/regexp/)) // [object RegExp]
console.log('toString() on new Date()', toString.call(new Date())) // [object Date]
```

Interesting thing about this approach is that it also works on primitive types.

```javascript
console.log('toString() on true:', toString.call(true)) // [object Boolean]
console.log('toString() on 1:', toString.call(1)) // [object Number]
console.log('toString() on "hello":', toString.call('hello')) // [object String]
console.log('toString() on null:', toString.call(null)) // [object Null]
console.log('toString() on undefined:', toString.call(undefined)) // [object Undefined]
```

Not only does it work on primitive types, but it is also able to differentiate
between `null` and other objects, so it's a double-win. Since the whole
business of using `Object.prototype.toString.call()` is a bit too much, we'll
wrap it in a function and also clean up the output a little.

```javascript
const what = obj => {
  return Object.prototype.toString.call(obj)
    .replace(/\[object ([^\]]+)\]/, '$1')
}
```

**NOTE:** When using the `replace()` function on string objects, we can use
capture groups in regular expressions, and then use the captured groups in
the replacement string using `$N` notation, where `N` is the number of the
group.

Now let's take this function for a spin:

```javascript
console.log('what(true):', what(true)) // Boolean
console.log('what(1):', what(1)) // Number
console.log('what(null):', what(null)) // Null
console.log('what(undefined):', what(undefined)) // Undefined
console.log('what("hello"):', what('hello')) // String
console.log('what({}):', what({})) // Object
console.log('what([]):', what([])) // Array
console.log('what(new Date):', what(new Date)) // Date
console.log('what(/regexp/):', what(/regexp/)) // RegExp
```

Perfect! Well... not quite.

```javascript
console.log('what(1 / 0):', what(1 / 0)) // Number
```

Well, clearly 1 divided by 0 cannot be a Number.

```javascript
console.log('type of 1 / 0:', typeof(1 / 0)) // NaN (but it can also be number)
```

JavaScript has failed us again! :( We can fix this by handling `NaN` values
separately in our `what()` function, of course, but I'll leave that as an
exercise for the reader. `NaN` is most reliably tested for using the
`isNaN()` function, by the way.

As mentioned before, objects that use simple prototypal inheritance using
`Object.create()` and `Object.setPrototypeOf()` are not subject to this kind
of type detection since they are all plain objects, but that's not a big
issue in the real world where you rarely care about inheritance chain.

We've covered the *how* of type detection, and now it's time to talk about
*why*. The rule of the thumb is: don't use it. In rare cases, you will still
need to do it, simply because some other solution may be orders of magnitude
more difficult, and your job is to get things done after all, not adhere to
rules set out by random guy writing about JavaScript on the Internet.

One common reason for type checking is to hunt down unspecified arguments.
Nine out ten times, you can get away with something like `!param` to test
whether the argument has been passed. But there are cases where this won't
work. Let's say we have a function that looks like this:

```javascript
let logNum = num => {
  if (!num) {
    console.log('You did not pass a number')
  } else {
    console.log('You passed ' + num)
  }
}

logNum(12) // You passed 12
logNum(2) // You passed 2
logNum(0) // You did not pass a number (oops!)
```

Let's fix this:

```javascript
logNum = num => {
  if (num === undefined) {
    console.log('You did not pass a number')
  } else {
    console.log('You passed ' + num)
  }
}

logNum(12) // You passed 12
logNum(2) // You passed 2
logNum(0) // You passed 0
```

Now let's say our manager comes to us and asks us to implement `logNum()` so
that it takes an array of numbers and logs them all out.

```javascript
logNum = num => {
  if (num === undefined) {
    console.log('You did not pass a number')
  } else if (Array.isArray(num)) {
    num.forEach(logNum)
  } else {
    console.log('You passed ' + num)
  }
}

logNum(12) // You passed 12
logNum([1, 2, 3])
// You passed 1
// You passed 2
// You passed 3
```

What? I didn't tell you about `Array.isArray()`? Right, testing if something
is an array is so common that there is a shortcut for it. You can still use
our `what()` function for this if you want, but it's much better to use it if
you have multiple types you need to test for. In this particular case, using
`Array.isArray()` makes more sense.

Prior to ECMAScript 6, setting default argument values was also done using
type detection. For instance:

```javascript
let increment = x => {
  if (x === undefined) x = 0
  return x + 1
}
```

**NOTE:** The above example is actually a very good case where you cannot
avoid type detection because you *can* add 1 to undefined, in which case you
would get  a `NaN` as a result, and your code will not throw an exception. It
makes sense mathematically in a way, but hardly useful in real life.

With ES6, it is now possible to specify the default value in the function
signature:

```javascript
increment = (x = 0) => x + 1
```

Duck typing is the opposite of type detection. Instead of checking whether the
thing is a duck, we check that it quacks, or has feathers, whatever aspect are
interested in. For instance, if your function takes an object, and you need to
invoke `foo()` on the object, you may test that it is an object, then test that
the `foo` property is a function, and then you finally call it. Or, with duck
typing, you could simply call it and pray for the best. Although the latter
approach sounds like a better fit for religious people, it works surprisingly
well in many, many cases. Still, duck typing in JavaScript does not work as well
as it does in, say, Python. The main reason for this is that trying to access a
missing property on an object evaluates to `undefined` *without* throwing an
exception. Here's an example:

```javascript
const logStuff = thing => console.log('thing.prop ===', thing.prop)
logStuff({wrongProp: 12}) // undefined
```

The code appears to work, but the result is not what we intended. You may
think that the solution for this is to test whether the prop is not
`undefined`. That's one way to look at it, sure. There is also another way,
which is to test whether the object has such a key using the `in` operator.
For example:

```javascript
my = {}
console.log('my has "foo" key?', 'foo' in my) // false
```

If we want the property to be of a specific type, we could also test for that
type rather than testing that it is not `undefined`. This also makes our code
clearer as it shows our intent.

If all of this sounds a bit scary, don't worry about it. As I keep saying,
most of the time, you don't have to worry about it. 9 out of 10 times, you
don't have to concern yourself with types at all.

```javascript
import {NOTE} from './_util'
```

# How and when to use arrays

JavaScript has two built-in container types, arrays and objects. No matter what
you do, you cannot avoid arrays in your code. Unless you are writing a fairly
trivial program, you are going to work with sequences of values, and arrays
tend to be the best option for representing them.

In this module, we are going to look at how to reason about arrays and how to
get most out of them.

Before we move on, I will also mention that arrays are called different names
in different languages and the word 'array' may also refer to different things
in another language.

In some languages, the JavaScript array may be called a *list* or a *sequence*.
In some other languages, an *array* may also be something that we would call an
*object* in JavaScript. If you make it a habit to look at other languages'
documentation for programming insights, or you are coming from another
language, it can be useful to keep these differences in mind.

**NOTE:** In this module, we will use some of the newer JavaScript features
that may not be present in the versions of JavaScript prior to ECMAScript 6
specification. All of the code in this module works because it is transpiled to
ECMAScript 5 using [Babel](http://babeljs.io/). If you find that something does
not work natively in the browser, that's because it is an ECMAScript 6 feature.
I am making a leap of faith assuming that my reader will know how to find out
if a feature is supported in their target platforms
([hint](https://kangax.github.io/compat-table/es6/)).

## Quick recap

Let's do a quick recap of array basics.

To build an array, we simply enclose a comma-separated list of values in square
brackets.

```javascript
let myarray = ['first', 'second', 'third', 'fourth']
```

To access a value from an array, we use subscript notation:

```javascript
console.log('4th item of an array:', myarray[3]) // fourth
```

Arrays in JavaScript are indexed starting from 0 (first item). Indices are
numbers, but you can use a string which can be converted to a number:

```javascript
console.log('2nd item using string index:', myarray['1']) // second
```

This is because arrays in JavaScript are syntactic sugar over plain objects.
All keys in a JavaScript objects are strings, and the indices of JavaScript
arrays are actually also strings. We normally use integers because JavaScript
does not care, and it's easier to type them that way.

As with everything else in JavaScript, arrays are untyped, so you can put items
of different types in them. (If you are unsurprised by this, you probably
haven't used languages where `[1, 'hello']` breaks your code at compile time.)
Because of this property, JavaScript does not have a separate tuple type, and
arrays can be used as tuples.

The length of an array is obtained by accessing its `length` property. This
property will give us the number of items in the array.

```javascript
console.log('Length of myarray is', myarray.length) // 4
```

The `length` property can also be written to. When you assign a new value to it,
the array is forced to become that length. You can trim an array by setting the
`length` property, but extending an array using `length` is less useful because
the new slots in the array are not usable until you populate them. This is
especially true when using `map()` and similar array functions which will ignore
the new blank slots.

We can assign values to specific indices in an array:

```javascript
myarray[3] = '4th'
console.log('Updated 4th item:', myarray) // ['first', 'second', 'third', '4th']
```

This also says that arrays in JavaScript are mutable structures (they can be
modified in-place). Having mutable arrays can get us off the ground fast, but it
can also cause problems in the long run, so in this module we will take a look
at techniques to avoid the mutation.

## Creating arrays of repeating values

Sometimes it is useful to create arrays that contain a known number of repeating
values.

One way to achieve this is to use the `Array` constructor. When the constructor
is invoked with a single numeric value it creates an array of that many elements.

```javascript
let arrayOf30 = new Array(30)
// arrayOf30 is [undefined, undefined, undefined, ...]
```

This array contains values that all unindexed (see next section). Before this
array can be used it must be given some values.

```javascript
arrayOf30.fill(true)
// arrayOf30 is now [true, true, true, true, ...]
```

The `fill()` function will take a value and replace all values in the array
(`undefined` or otherwise) with the specified value.

Another way to create an array of repeating values is to (ab)use a string. This
is especially useful when the default value should be a string.

```javascript
arrayOf30 = '0'.repeat(30).split('')
// arrayOf30 is now ['0', '0', '0', '0', ...]
```

It's worth mentioning that JavaScript does not have functions like the Python's
`range()` that would generate iterables or arrays of numbers in a specified
range. There are such functions provided by many libraries, so we won't go into
them here.

## Unindexed values

Arrays can contain two kinds of `undefined` value. An indexed `undefined` and an
unindexed `undefined`. The problem is that there is no good way of telling the
difference, but there is an impact on the code. Let's unindex an array element
to see this in action.

```javascript
NOTE('Unindexing memeber')
let totalArray = [1, 2, 3]
totalArray[1] = undefined
console.log('Array with undefined:', totalArray) // [1, undefined, 3]
console.log('Undefined member:', totalArray[1]) // undefined
delete totalArray[1] // deletes 2
console.log('Array with unindexed member:', totalArray) // [1, , 3]
console.log('Unindexed member:', totalArray[1]) // undefined
```

As you can see, in the first version, we have just assigned an `undefined` to
index `1`. Accessing this index returns `undefined`. In the second case, we have
deleted the memeber at index `1`. While the index still returns `undefined`, 
logging the array gives us a slightly different output.

It is the unindexed value that appears as a gap in `[1, , 3]`. We can confirm 
that the array no longer has the index `1` by checking it with `Object.keys()`.

```javascript
console.log('Indices:', Object.keys(totalArray)) // ['0', '2']
```

While it is quite rare that you will ever run into this, you should be aware
that creating arrays using `new Array(count)` call will result in an array of
unindexed elements.

To delete items from an array without causing this kind of confusion, use the
`splice()` function.

```javascript
totalArray.splice(1, 1)
console.log('Fixed indices:', Object.keys(totalArray)) // ['0', '1']
```

The first argument to the `splice()` function is the start index, the second
argument is the number of items to delete or replace. If third argument is
supplied, items are replaced, otherwise they are removed. Unlike `delete`,
indices and array length are updated correctly. (Don't forget to specify the
delete count or else the entire portion of array starting with the index will be
deleted!)

## Iterating over arrays

There are several techniques for iterating over arrays. The most common one is
to use a for loop. Let's take a look at the canonical looping technique.

```javascript
NOTE('Looping an array using for loop (canonical)')
for (let l = myarray.length, i = 0; i < l; i++) {
  console.log('Item at index', i, '===', myarray[i])
}
```

Although this is not array-specific, let's break down what `for` loop does:

    let l = myarray.length, i = 0; i < l; i++

This breaks down to three segments like so:

1. `let l = myarray.length, i = 0`
2. `i < l`
3. `i++`

The first segment is the initializer. We create two variables, `l`, and `i`. The
former tells us how long the array is, and the latter is the index of an array
element in the current iteration.

The second segment is the check, which tells the `for` loop whether the current
iteration should happen. In our case, we are performing iterations as long as
the current index is less than the length (length is always larger than the last
index by 1, so we use the `<` in comparison instead of `<=`).

The third segment is performed *after* each iteration. In our case, we set the
*next* index.

In some cases, the order in which we iterate may not matter, or we want to
iterate the array in reverse. In such cases, the for loop may become somewhat
simpler:

```javascript
NOTE('Looping an array using for loop (reverse)')
for (let l = myarray.length; l; l--) {
  console.log('Item at index', l - 1, '===', myarray[l - 1])
}
```

In this case, we use `l - 1` as an index, because the length is always larger
than the last index by 1.

The last example can actually be used for forward iteration as well:

```javascript
NOTE('Looping an array using for loop (reverse-forward)')
for (let l = myarray.length; l; l--) {
  const i = myarray.length - l
  console.log('Item at index', i, '===', myarray[i])
}
```

It turns out that this way of iterating an array is just a little bit faster
than the version that uses two variables to perform the check on each iteration.
The difference is usually negligible, though, and not reliable, as improvements
in JavaScript virtual machines may change the performance of these loops.

When modifying the array in-place during iteration, an uncomfortable amount of
complexity is introduced. It is therefore not worth doing in most cases.

```javascript
NOTE('Modifying the array during iteration')
let a = [1, 2, 3, 4, 5]
for (let l = a.length, i = 0; i < l; i++) {
  console.log('Item at index', i, '===', a[i])
  a.unshift(a[i] + 1)
}
```

The above example outputs:

    Item at index 0 === 1
    Item at index 1 === 1
    Item at index 2 === 1
    Item at index 3 === 1
    Item at index 4 === 1

This happens because we are adding one item at the beginning of the array in
each iteration, so the current index always points to the first item we started
with.

To fix this, we need to modify the index.

```javascript
NOTE('Modifying the array during iteration correctly, kind-of')
a = [1, 2, 3, 4, 5]
for (let l = a.length, i = 0; i < l; i++) {
  console.log('Item at index', i / 2, '===', a[i])
  a.unshift(a[i] + 1)
  i++
  l++
}
```

This outputs:

    Item at index 0 === 1
    Item at index 1 === 2
    Item at index 2 === 3
    Item at index 3 === 4
    Item at index 4 === 5

This looks alright on paper, but the code is now confusing to say the least. In
the `console.log()` line, we are now using `i / 2` to print out the *original*
index, but using just `i` to fetch the actual value.

We also have to increment both `i` and `l` when a new item is added to the
beginning of the array.

It all adds confusion and complexity, and opens the code up to numerious bugs.
The best way to do this is to simply avoid mutating the existing array and build
a new one instead.

Arrays also have a `forEach()` function that can be used to iterate over them.
This is a higher-level abstraction and the one we should normally use.

```javascript
NOTE('Looping an array using forEach()')
myarray.forEach((item, i, arr) => {
  console.log('Item at index', i, )
})
```

In theory, we can get away with never ever using `for` loops. There are some
fairly rare cases where `for` loops cannot be avoided. For instance, for loop is
typically a lot more performant and memory efficient than a `forEach()`.
However, in an overwhelming majority of cases, this is not a stable performance
difference, meaning that improvements in the JavaScript engine may delete any
advantage you gain from using the more complex code. As with any performance
tuning stuff, do not default to `for` loops using performance as a reason. You
most likely don't benefit from it, and you're writing more complex code in the
process: in other words, very likely wasting your time.

If you are wondering why I've even bothered to explain `for` loops in the first
place, the reason is that it is still quite a common idiom and you are very
likely to encounter it in other people's code, and also so you know how they
work when you decide you *do* need them. Speaking of which...

## Terminating iteration early

If we need to terminate iteration early we may want to use the `for` loop
instead of `forEach()`. For example:

```javascript
NOTE('Sort-circuit for loop')
const firstWith = (f, xs) => {
  for (let l = xs.length, i = 0; i < l; i++) {
    const x = xs[i]
    if (f(x)) return x
  }
}

let b = ['foo', 'bar', 'baz']
console.log('First item that starts with "b" is', firstWith(x => x[0] === 'b', b)) // bar
```

Since `for` loop is a block, and not a separate function, we can `return` from
it and thus short-circuit the function in which it appears. This is not possible
with `forEach()` because the control over iteration is entrusted to the
JavaScript engine instead of our code (inversion of control).

We can still use `forEach()`, and we can work around the inversion of control by
using exceptions and `try` and `catch`.

```javascript
NOTE('Breaking out of forEach with throw')
const firstWith2 = (f, xs) => {
  try {
    xs.forEach(x => {
     if (f(x)) throw x
    })
  }
  catch (e) {
    return e
  }
}

console.log('First item that starts with "b" is', firstWith(x => x[0] === 'b', b)) // bar
```

This is also an example of using exception handling for flow control. I'm not a
big fan of using exceptions for flow control in JavaScript, though, mostly
because it can obscure an actual exception that can happen in the `forEach()`,
and adding code to differentiate between exceptions is painful. Another reason
is that there are better ways.

Another way to break out of iteration early is to not do it at all. Instead of
iteration, we can do recursion.

```javascript
NOTE('Recursion instead of iteration')
const firstWith3 = (f, xs) => {
  if (!xs.length) return
  const [head, ...tail] = xs
  if (f(head)) return head
  return firstWith3(f, tail)
}

console.log('First item that starts with "b" is', firstWith(x => x[0] === 'b', b)) // bar
```

If you are not familiar with recursion, the function does this: it keeps testing
the first item until it finds a match or array is exhausted. To exhaust the
array, we recursively call the same function with the remainder of the array.

    1st call:  ['foo', 'bar', 'baz']   'foo' does not match, return 2nd call
    2nd call:  ['bar', 'baz']          'bar' matches, return 'bar'

It may require a bit of getting used to, but once you wrap your head around
writing recursively, it is one of the more elegant solutions for early
termination.

## Transforming items in the array

It is sometimes necessary to transform all items in an array in exactly the same
way. This is called mapping. In some languages we may also see terms like *lift*
(as in *lift a function into an array*). While mapping is very simple to write,
it helps to adjust our intuition about how it works.

Suppose we have an array like this:

    [1, 2, 3, 4, 5]

Now suppose we want to map its contents using a function `f()`. The resulting
array can be written as:

    [f(1), f(2), f(3), f(4), f(5)]

In other words, we put the function into our array to wrap each value with it.
Perhaps you can see how we *lift* a function into the array now.

Mapping also produces a completely new array.

Let's see map in action:

```javascript
const cart = [
  {name: 'Milk', price: 12},
  {name: 'Bread', price: 10},
  {name: 'Car', price: 12567}
]
const itemPrice = x => x.price
console.log('Prices of cart items:', cart.map(itemPrice)) // [12, 10, 12567]
```

Because `map()` returns a new array, we can chain mappings. This is a very
useful property that can be taken advantage of to reduce the
complexity of our code in many situations.

Let's say we want to calculate the VAT tax of the cart products. If the tax is
20%, the tax portion of the price is roughly 0.166 times the price.

```javascript
const vat = x => x * 0.16
console.log('VAT taxes:', cart.map(x => vat(x.price))) // [1.92, 1.6, 2010.72]
```

Now consider the alternative where we separate getting the `price` property from
the tax calculation:

```javascript
console.log('VAT taxes (simple):', cart.map(itemPrice).map(vat))  // [1.92, 1.6, 2010.72]
```

We get exactly the same result both times but in the second one we have reduced
the complexity of our code somewhat by reusing the `itemPrice()` function we
have defined earlier. 

The code was not complex to begin with so this micro optimization is not even
worth the mental effort in real life, but it demonstrates a neat property:
associativity. If we have a mapping that has two operations, we can also have
two mappings of one operation each, which gives us the same result as the
two-operation mapping. We can use this property to merge and split operations to
reduce the number of iterations or code complexity, respectively, depending on
our needs and goals.

Mapping can be used creatively to do things that may seem a bit
counter-intuitive. For example, we have seen examples where a single function
is applied to  multiple values, but we can also do the opposite.

```javascript
NOTE('Pager simulation')

const applyTo = x => fn => fn(x)

const maxPage = 15

let pagerParams = [
  x => x + 1,
  x => x - 1,
  x => x < maxPage,
  x => x > 1,
  x => Math.max(Math.min(x, maxPage), 1),
]

const [next, prev, hasNext, hasPrev, page] = pagerParams.map(applyTo(12))
console.log('next page:', next) // 13
console.log('previous page:', prev) // 11
console.log('has next:', hasNext) // true
console.log('has previous:', hasPrev) // true
console.log('actual page:', page) // 12
```

The `applyTo()` function takes a value, and returns a function that takes a
function and calls the function with the value as its argument. We then use an
array of functions to have each one applied to a single value, `12`.

## Reducing (folding) arrays

While mapping transforms the array contents, there are also operations that
transform the array itself.

Arrays can be transformed into a single non-array value, or a new array with
different structure.

The process of reducing an array of values into a single value is called...
reducing. In some contexts, you may see a term *fold* used to denote the same
thing.

Typically, reduce starts with a base value. This value is called an accumulator,
and is usually used to hold the intermediate as well as the initial state of the
reduction.

Continuing with our shopping cart theme, let's reduce the cart to the subtotal:

```javascript
NOTE('Reduce example')
console.log('Subtotal:', cart.reduce(
  (accum, item) => accum + item.price, 
  0 // accumulator
)) // 12589
```

Unlike `map()`, `reduce()` is not associative. Like `map()`, `reduce()` returns
a new array so we an chain array functions.

Accumulator can be any value, including arrays and objects. Let's say we want to
convert our cart into an object that maps product names to respective prices.

```javascript
NOTE('Reduce to object')
const accumulator = {}
console.log('Products and prices:', cart.reduce(
  (accum, x) => {
    accum[x.name] = x.price
    return accum
  },
  accumulator
)) // { Milk: 12, Bread: 10, Car: 12567 }
```

In the example, our object serves as an accumulator: in each iteration, we
accumulate new properties in it.

One little detail to note here is that our `accumulator` object is now modified
by the reduction.

```javascript
console.log('Modified accumulator:', accumulator)  // { Milk: 12, Bread: 10, Car: 12567 }
```

This type of side effect is almost never desirable. The correct way to write
the above reduction is:

```javascript
NOTE('Reduce to object with inline accumulator')
console.log('Products and prices:', cart.reduce(
  (accum, x) => {
    accum[x.name] = x.price
    return accum
  },
  {}
)) // { Milk: 12, Bread: 10, Car: 12567 }
```

We have inlined the accumulator object so it is local to our reduction. We can
further simplify the code by using `Object.assign()`.

```javascript
NOTE('Reduce to object using Object.assign()')
console.log('Products and prices:', cart.reduce(
  (accum, x) => Object.assign(accum, {[x.name]: x.price}),
  {}
)) // { Milk: 12, Bread: 10, Car: 12567 }
```

The `{[x.name]: x.price}` syntax is new in ECMAScript 6, and lets us use the
`x.name` variable as a key.

## Combining map and reduce

Using `map()` and `reduce()` in tandem is a common technique. In this section,
we will use map and reduce to create a `toObject()` function which takes two
arrays and builds an object that takes keys from the first array, and values
from the second.

```javascript
NOTE('Create object from two arrays')

const toObject = (keys, values) =>
  keys
    .map((key, index) => ({[key]: values[index]}))
    .reduce((obj, keyVal) => Object.assign(obj, keyVal), {})

console.log('Object:', toObject(['foo', 'bar', 'baz'], [1, 2, 3]))
// { foo: 1, bar: 2, baz: 3 }
```

In the map stage, we prepare a new array that will be suitable for reducing. The
function that we pass to `map()` takes the value as well as the index of the
value. We use the index to pair the value with a value from the `values` array
at the same index as the current item in a single-key object. This gives us an
array that looks like `[{foo:, 1}, {bar: 2}, {baz: 3}]`.

Once we have a suitable array we can reduce it to a single object by merging all
the objects in the array returned by `map()`.

## Filtering arrays

Another transformation on arrays is filter. Filter takes a predicate, which is a
function that returns either `true` or `false` depending on a user-defined
condition, and returns a subset of the array for which the predicate returns
true.

```javascript
NOTE('Filter example')
const itemName = x => x.name
const isExpensiveProduct = x => x.price > 1000
console.log(
  'Expensive products:',
  cart.filter(isExpensiveProduct).map(itemName)
) // ['Car']
```

The `filter()` function is associative, and also returns a new array.

## Sorting arrays

Sorting is another common array transformation. At its simplest, array sort is
a simple function call:

```javascript
NOTE('Dumb sort')
let names = ['Bob', 'Steve', 'Jane', 'Samantha', 'Ivan']
names.sort()
console.log('Sorted names:', names) // ['Bob', 'Ivan', 'Jane', 'Samantha', 'Steve']
```

This way of sorting only works for arrays of strings. Anything that is not an
array of strings is not going to be sorted correctly this way. Another thing to
note is that calling `sort()` on an array sorts the array in-place. This is a
mutation and can lead to much grief in some situation.

Let's first... ehm... sort out... the mutation problem.

```javascript
NOTE('Immutable sort')
const sorted = (arr, predicate) => {
  let copy = [].concat(arr)
  copy.sort(predicate)
  return copy
}

console.log('Sorted names:', sorted(names))
```

Using `[].concat(arr)`, we create a copy of the original array. We then sort the
copy and return it. This way, the mutation is contained inside the `sorted()`
function and won't affect our code.

Now, let's try sorting arrays of numbers:

```javascript
NOTE('Naive numeric sort')
let nums = [1, 221, 2, 112, 421, 30, 3]
console.log('Sorted numbers:', sorted(nums)) // [1, 112, 2, 221, 3, 30, 421]
```

Even my kids know that `112` is larger than `2`!

The default sort order for array's `sort()` function uses lexicographical sort
order. This means that it treats all values as strings. It takes the first
character (digit) of all numbers and sorts them according to that. For values
whose first character is the same, it looks at the next character, and so on.

The `sort()` function takes a predicate that can instruct it to sort in a
specific way. The predicate function is called a *comparison function*, takes
two values that are being compared, and its return values are as follows:

- less than 0 if first value is smaller
- 0 if values are equal
- more than 0 if first value is larger

We can now implement a simple numeric sort by supplying a predicate:

```javascript
NOTE('Simple numeric sort')
console.log('Sorted numbers:', sorted(nums, (x, y) => x - y)) // [1, 2, 3, 30, 112, 221, 421]
```

Now the order is correct.

Using the predicate, we can sort arrays that contain more complex values.

```javascript
NOTE('Complex numeric sort')
console.log('Sorted cart:', sorted(cart, (x, y) => x.price - y.price))
// [
//  { name: 'Bread', price: 10 },
//  { name: 'Milk', price: 12 },
//  { name: 'Car', price: 12567 }
// ]
```

## Testing array items

In addition to what we have covered thus far, testing array items can sometimes
be very handy.

To demonstrate one of the testing methods, we are going to implement a simple
form validation function library.

```javascript
NOTE('Validator example')
const isTrue = x => x === true
const isEmpty = x => x && x.trim() === ''
const nonEmpty = x => x !== undefined && x !== null && x.trim() !== ''
const isNumber = x => !isEmpty(x) && /^\d+$/.test(x.trim())

const validators = [nonEmpty, isNumber]

const isValid = validators.map(applyTo('12')).every(isTrue)
console.log('Value is valid:', isValid) // true
```

In the example we have some validator functions like `nonEmpty()` and
`isNumber()`, which return `true` or `false` for a given string value. We then
build a list of validators for the user input, and use `map()` to apply them
to the input string, `'12'`. Finally, we use `every()` which tests that every
item in the array is `true`.

Another useful test is to check whether some value is present in the array.

```javascript
NOTE('Using includes')
const sessions = ['jane', 'bob', 'steve', 'catherine']
const currentSession = 'catherine'
const isLoggedIn = sessions.includes(currentSession)
console.log(currentSession, isLoggedIn ? 'is' : 'is not', 'logged in')
// catherine is logged in
```

A variant of the `includes()` test is a `find()`, which is not really a test,
but a way to, well, find elements of an array that match a specific criteria.
(In some libraries, this may be called `where()`.)

Suppose we have a search field that lets us quickly filter a list of options in
a settings dashboard.

```javascript
NOTE('Section search using find()')
const sections = [
  {name: 'Profile', element: '#profile'},
  {name: 'Colors', element: '#colors'},
  {name: 'Notifications', element: '#notifications'},
  {name: 'Account', element: '#account'},
]
const keyword = 'col'
const found = sections.find(section =>
  section.name.toLowerCase().includes(keyword.trim().toLowerCase()))
console.log('Matching section:', found) // { name: 'Colors', element: '#colors' }
```

Good thing about `find()` is that it will stop at the first element that matches
the predicate. This can be used in other creative ways. For example in our
validator feature, we went though all validators, we might actually want to stop
as soon as we know there is an error.

```javascript
NOTE('Validator micro optimization using find()')
const hasErrors12 = validators.find(v => !v('12'))
const hasErrorsA = validators.find(v => !v('A'))
console.log('12 has errors?', hasErrors12) // undefined
console.log('A has errors?', hasErrorsA) // isNumber...
```

## When to use arrays

Although arrays are pretty straightforward, and most programmers probably have a
reasonably good handle on when to use arrays, it's worth mentioning a few things
about when to use arrays for optimal results.

First of all, use arrays to structure data where order matters. This may sound
obvious, but it's easily overlooked. The reason arrays should *only* be used
where order matters is that by relying on arrays we bind our code to the order
of values in the arrays. This is OK in cases where order really matters but it
creates unnecessary binding when order does not matter.

For instance:

    const fieldValidators = [
      ['name', isRequired],
      ['age', isRequired, isNumeric]
    ]

We might have done it like that because we can now easily iterate over the
structure to access the keys, but that is not a very good reason to use arrays
here. We could have used objects just the same.

    const fieldValidators = {
      name: [isRequired],
      age: [isRequired, isNumeric]
    }

With an object, we can still do `Object.keys(fieldValidators)` to access the
field names as an array if we need to.

Another place where arrays don't fare well is large data sets. Since arrays are
kept in memory, large data sets mean big RAM usage. If all we need to do is
iterate the data set once, we would consider using
[iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
instead.

Having said all this, arrays, along with object literals, are two of the
simplest containers in JavaScript. Becuase of their simplicity, and rich APIs
they provide there is rarely a good reason to invent a new data structure. If
you need a container for an ordered set of values, you should definitely
consider arrays before anything.
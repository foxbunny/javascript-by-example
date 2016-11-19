import {NOTE} from './_util'

// =======================
// Declarative programming
// =======================

// Declarative programming is a way of dealing with complexity in your programs.
// It achieves this goal by formulating the end product of computation rather
// than specifying steps necessary to arrive at the result.

// In this module, we will see how declarative style can be achieved in
// JavaScript, and how this can simplify our programs. We will do so without
// going into too much theory, though, so you can focus on the result, and not
// the tools. However, we do need tools. We will, therefore, introduce tools
// as wel go.

// Let's first start with a very simple example. Say we have an array of numbers
// and we want to sum them up, and calculate an average. The numbers are these:

const scores = [4, 2.2, 2, 3, 5.6, 4, 3.8, 4.2]

// If we were to talk about the solution in terms of steps, it would probably
// go something along these lines:

// 1. take the first number from the list, and remember it, and the count is 1
// 2. take the next number from the list, and add it to the first one,
//    and add one to the count
// 3. repeat (2) for the remaining numbers
// 4. once we have the sum and the count, we divide the sum by the count to get
//    the average

// Let's write the code for the steps we discussed. This is how most programmers
// start when they start programming.

let psum = 0
let pcount = 0
for (; pcount < scores.length; pcount++) {
  psum += scores[pcount]
}
let paverage = psum / pcount
NOTE('Procedural, results:')
console.log('sum is', psum) // 28.79999...
console.log('average is', paverage) // 3.5999...

// NOTE: The weird numbers you see is the floating point precision error that is
// common in many programming languages. Just imagine those are 28.8 and 3.6. ;)
// This is not important for our discussion.

// As you get a bit more advanced, you may say "Oh, look, Array has a forEach()
// function which is a much nicer way to loop over it. And I don't need the
// count variable because the array has a length property which gives me the
// same thing!"

let lsum = 0
scores.forEach(function (n) {
  lsum += n
})
let laverage = lsum / scores.length
NOTE('Procedural 2, results:')
console.log('sum is', lsum) // 28.79999...
console.log('average is', laverage) // 3.5999...

// The second attempt looks nicer, for sure.

// After you learn a bit of Java, you may do this instead:

class SumAvg {
  constructor(scores) {
    this.count = scores.length
    this.scores = scores
  }

  get sum() {
    let sum = 0
    this.scores.forEach(function (n) {
      sum += n
    })
    return sum
  }

  get average() {
    return this.sum / this.count
  }
}

const savg = new SumAvg(scores)
NOTE('OOP, results:')
console.log('sum is', savg.sum) // 28.79999...
console.log('average is', savg.average) // 3.5999...

// That is just beathtakingly fancy! Look at all the code! Alas, it still does
// not change the fundamental approach. If you look at it carefully, you'll
// see that it has just shifted the code around a bit.

// NOTE: Yes, the author is just using a bunch of strawmen to demonstrate the
// downsides of using procedural and OOP paradigms *for this particular problem*
// and is fully aware that there are valid cases for those paradigms for some
// other problems (which he hopes not to encounter ever in his life).

// And now for something completely different. It's going to seem a bit long and
// tedious, but bear with me. I'm just being extra-verbose about the though
// process for demonstration purposes. In the end, it's just a few lines of
// code, but just showing that code doesn't mean much.

// To give you some context we will attempt to *describe* all the calculations
// before we ever touch the actual number, instead of plowing through the
// numbers one by one and doing all the intermediate steps. You an think of it
// as carefully setting up the dominos (our calculations) before we hit the
// first one with our finger (the input).

// If you think about summing, it is simply a series of additions. And we know
// what addition looks like:

const add = (x, y) => x + y

// Summing also reduces a bunch of numbers to a single number using addition.
// We now know all we need to describe sums. Now we need to describe that in our
// program.

// What we want to say is, we take some thing (that possible contains numbers),
// that can be reduced somehow, and we reduce it using addition. Arrays happen
// to be a reducible container, and that works fine for us.

// Let's map out the reduction first as it's a generic operation.

const reduce = operation => reducible => reducible.reduce(operation)

// We've written this in somewhat weird way, but you'll see why in a bit. This
// is called currying. Instead of taking all of the operational parameters at
// once we feed the `reduce()` functions its paramters one by one. Each time
// we feed one parameter, we produce a function that is hard-coded to the
// parameters that were already passed. Now we can write our sum as a reduce
// that is hard-coded to addition.

const sum = reduce(add)

// What `sum()` has become is this: `reducible => reducible.reduce(add)`, a
// function that takes a reducible container, and reduces it using addition.
// With currying and two simple genric functions, we are able to build a
// slightly more complex concept. In fact, this way of breaking things down
// is fractal, and it goes all the way up to fairly complex systems.

// We won't do systems in this module, but let's take a bit more complex
// problem which is the average.

// NOTE: We can now simply calculate the sum, and derive the average by dividing
// that value by the length of the array. That would be the most practical
// solution in the real life. However, we will do something a bit more
// complicated here as an exercise.

// For average we need the sum (which we already) know how to derive, and we
// also need the count. The count is the length of an array, so:

const count = (x) => x.length

// To calculate the average of a reducible, we need to divide its sum with
// the count of its elements. We need to describe division as well, so here it
// goes:

const div = (x, y) => x / y

// Now we're ready to state what average is:

const naiveAvg = (reducible) => div(sum(reducible), count(reducible))

// We have the average now, but it's somehow wrong. Reducible is repeated twice,
// and it definitely looks like we can get rid of it. Remember, our goal is to
// describe the calculation itself, not how to perform it.

// We have three things in this calculation. We have the count and the sum. They
// are both coming from the same reducible, but they represent different
// calculations. We can think of it as some kind of branching. The division,
// on the other hand, reduces two things into one value, so just like add, it
// would make sense that it could operate on a reducible. If we could somehow
// transform the original reducible into another reducible that has sum and
// count as its members, we might be able to simplify the problem.

// We will first define the transformation for sum and count.

const expand = (...ops) => reducible => ops.map(op => op(reducible))

// The `expand()` function takes a number of operations, and returns a function
// that takes a reducible. The returned function will pass the reducible to each
// of the operations and return an array of results. Since arrays are reducible,
// we can call div on it. But we can't use our `div()` function as is, as it
// does not work on reducibles yet, so we will need to define a new one.

const division = reduce(div)

// It's now time to write the final version of the average function. We just
// need one more little thing. We need a way to combine functions.

const combine = (f, g) => (...args) => f(g(...args))
const compose = (...fns) => reduce(combine)(fns)

// The first of the two functions we have introduced describes how we can
// combine two functions. The second function takes a collection of functions
// and reduces them to the combined version.

// I think you are already seeing a pattern here, but we'll get into that a bit
// later.

// And (drumrolls), the average function:

const average = compose(division, expand(sum, count))

// And just like that, we drove the reducible out of our original function. Here
// are the two versions side by side:

// old: (reducible) => div(sum(reducible), count(reducible))
// new: compose(divide, expand(sum, count))

// Now the `average()` function only describes the calculation, and does not
// deal with data at all anymore!

// Since the code was fragmented with narrative a lot, let's collect it here
// in one comment block so we can see what we have ended up with.

/*

// Reusable utitilies
const reduce = operation => reducible => reducible.reduce(operation)
const combine = (f, g) => (...args) => f(g(...args))
const compose = (...fns) => reduce(combine)(fns)

// Basic operations
const div = (x, y) => x / y
const add = (x, y) => x + y
const count = (x) => x.length

// Derived calculations
const sum = reduce(add)
const division = reduce(div)
const average = compose(division, expand(sum, count))

*/

// Let's give these a try:

NOTE('Declarative, results:')
console.log('sum is', sum(scores))
console.log('average is', average(scores))

// I have mentioned this time and again, but the whole adventure we went through
// had only one goal: drive the data out of our functions. The data, in this
// case, is the `scores` array that we call 'reducible'.

// You will notice that we did not actually get ride of reducible completely.
// There is one place that deals with them, and that's the `reduce()` function.
// Importantly, it's the one and only one place where we ever talk about it, and
// we talk about it in  a very generic way: 'how to work with reducibles in
// general'. As you can see from our code, we were able to apply this concept in
// multiple places.

// Now I mentioned something about a pattern earlier. When you have an operation
// that is performed on two values of the same type (e.g., number, string,
// function, etc) and produces a single value of the same type, you can always
// use such operations (functions) to reduce arrays. We had three examples of
// this:

// - sum reduces a reducible to a number using addition that takes two numbers
//   and returns a single number
// - division reduces a reducible to a number using an operation that takes two
//   numbers and returns a single number
// - compose reduces a reducible to a single function using an operation that
//   takes two functions and returns a single function

// We keep mentioning reducibles. Arrays are reducible (they have a `reduce()`
// function that can be used to reduce the entire array to a single value), but
// there is no reason why you can define your own objects that implement the
// `reduce()` function and can be reduced to a single value in a way that makes
// sense to them.

// There is a similar pattern called 'functors', which are objects that have a
// `map()` function and that for each member they contain return the same number
// of members that are transformed using a supplied operation. We used this
// pattern in our `expand()` function, where we had a functor containing two
// functions which were transformed into their return values. As you may have
// guessed, an array in JavaScript is also a functor. As with reducibles, you
// can define your own functors and use them in a variety of ways.

// Yet another take-away is that, although we have produce a bit more lines of
// code than the procedural counterpart, we have also been able to clearly
// delineate generic and concrete operations (functions). For example, functions
// like `reduce()`, `compose()`, and `add()`, are clearly generally useful in
// many programs we may write (in fact, there are many libraries that already
// provide them, and we could have simply used one of them instead of writing
// our own). If we factor all our generic functions out, we are left with only
// three lines of code that are directly related to the problem we are solving.

// Finally, looking at our code, you will probably agree that each of the
// functions are very very short and relatively easy to reason about provided
// you know what the underlying code is doing. There are, of course, drawbacks
// too. For example, if you *don't* know what `reduce()` or `compose()` does,
// you may not understand what `reduce(div)` and some of the other derived
// functions may do. At least until you get used to this style of programming,
// you should know that it's not an either-or choice, and you can always use
// and of the other styles where clarity (at least for you) appears to be
// compromised.

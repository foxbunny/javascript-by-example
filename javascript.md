# What JavaScript is and what it isn't

JavaScript, like PHP decade or so ago, got a very bad reputation as a
suboptimal language, half-arsed version of Java, and any number of completely
wrong attributes that were assigned to it over time. As with most languages,
there is a fair deal of bad JavaScript code floating on the Internet, and I
myself have probably contributed some to that when I was younger. However,
this is probably not the main reason for its reputation.

JavaScript has, for very long, been the only language supported in the web
browsers. If you wanted to do anything inside the browsers, you *had* to use
it, even if you did not really *like* JavaScript (or at least liked some other
language better). Because of this, many developers were frustrated, and
attributed such frustration to the language rather than the fact that they had
to use something they did not want to.

And let's not forget the fact that programmers can get quite religious when it
comes to choosing tools.

JavaScript is, of course, not flawless. It has its share of warts that can
annoy even the seasoned JavaScript programmers. It even has features that were
meant to help programmers coming from languages such as Java orient themselves,
that ended up doing the exact opposite. However, most arguments against
JavaScript that you will commonly find online have *nothing* to do with those
warts. In this module, I will try to clarify some of the misconceptions, and
hopefully set the record straight for those of you that are looking to dive
into this book's other modules.

## JavaScript is a programming language

Have you ever encountered a person that divides programming languages into
*real* programming languages and so-called *scripting* languages? If you have,
have you ever been told that JavaScript is 'just a scripting language' (as
opposed to a real one)? Well, they are wrong.

A scripting language *is* a programming language that happen to have the kind
of features that make it extremely useful for scripting. Scripting is an
exercise in programming with the goal of automating simple tasks that you'd
have to perform manually otherwise.

For instance, let's say there's a designer that has a few hundred icons stored
in individual files in, say, Adobe Illustrator, and they want all of them to be
exported as `.png` files, it would be tedious to do all that by hand. They ask
a programmer friend to write a script that automates this. Using languages like
Java or C# for this type of work is clearly very expensive. It could probably
be done if Illustrator had bindings for these languages, but that would not
necessarily be a smart choice. Languages that are commonly used for this type
of task are typically lightweight, in the sense that there is very little
boilerplate and/or tooling necessary to write a fully functional program. They
are, in other words, **simple to code in**.

We all like simple, though. Even for *real* programming. 'Scripting language'
is not a label that you give to crippled languages that can't do anything. It's
a badge of honor that says 'you can get started with this language very
quickly.' Many of the so-called 'scripting languages' are perfectly usable, and
in some cases even preferred, for real-life work. Starting with JavaScript,
there are also Python, Ruby, PHP, Perl, and the list goes on. All of them have
been used to write complex real life programs people use, love, and depend on.

## JavaScript is object-oriented

JavaScript is a multi-paradigm language. Among its paradigms, you will find
object-oriented (OO). Although this is true, you will find many developers that
consider this to be untrue, or that JavaScript doesn't do *real*
object-orientation.

JavaScript *is*, indeed, an OO programming language, but it's  among the rare
prototype-based OO languages (another main-stream example is  Lua).

Suppose we were building houses. You would normally make a blueprint that
describes what the house should look like. And then you build a house according
to the blueprint. Class-based OO mimics this approach by using classes as
blueprints for objects (called 'instances'). In prototype-based OO, you build a
house by borrowing parts from an existing house and you add only the parts that
are new and unique to your house. When we say 'borrow' we don't mean remove
from the first house and bolt onto the new one. They are not cloned either.
It's closer to you looking at a non-existing wall on your new house, and seeing
the one from the old one magically appears before you! In fact, building a
house is not even a very good analogy for prototype-based OO. After all, this
is not the real world, it's a virtual world where things work the way we
imagine them to.

Programmers that love the class-based OO sometimes don't like the
prototype-based OO, and they complain about it loudly. Usually not even fully
understanding the prototypal model, they jump to a conclusion that something
is wrong with it and/or that it's incomplete.

There are also valid arguments against prototype-based OO, such as difficulty
in ensuring correctness of your programs at compile time, and poor performance.
While these stand, in practice, it is rarely a critical flaw.

Prototype-based OO is neither wrong or incomplete. It is what it is, and it's
not class-based. If you want to do OO programming in JavaScript, there is very
little choice but to embrace prototypes (or use
[TypeScript](http://www.typescriptlang.org/)).

## JavaScript is functional

JavaScript was originally intended to be a functional programming language.
I don't mean 'functional' as in 'working'. I mean a language that supports
the functional programming paradigm.

There are programmers out there that say this is impossible, but what they
really mean is that JavaScript is not a *pure* functional programming language.

In pure functional programming languages, you cannot have mutation and
side-effects. Mutation means reassigning variable values. In JavaScript, it is
possible to reassign them, so it's impure. JavaScript also embraces
side-effects. It's not only impure, but outright filthy!

However, it *is* possible to write programs in functional style, with or
without helpers and checkers that ensure mutations and side-effects are kept to
bare minimum, and this tends to be really successful because of what JavaScript
was intended to be.

JavaScript is also a good language to start learning functional programming at
work, because it allows you to fall back on other paradigms and stay productive
while you convert your code to functional style. In other words it's not an
either-or choice.

Due to steadily growing interest in this paradigm, JavaScript is only going to
get better and better at it, too.

## JavaScript is a platform

JavaScript is not only a programming language, but also a platform. There are
many languages that target JavaScript as the runtime environment. Starting with
various variants of JavaScript, including ECMAScript 6 that is used in this
book, to TypeScript mentioned earlier, to
[CoffeeScript](http://coffeescript.org/), [LiveScript](http://livescript.net/),
[Elm](http://elm-lang.org/), [PureScript](http://www.purescript.org/), and even
[F#](http://funscript.info/), and
[C/C++](https://kripken.github.io/emscripten-site/)!

Some of these languages simply fix a few warts authors found in JavaScript or
bring in features that are not (yet) supported, others are completely different
languages with no semblance to JavaScript, created to solve different problems
than those JavaScript was originally intended for, and some are different
main-stream languages on their own, where the main goal of compiling to
JavaScript is code reuse across platforms. This ecosystem is becoming larger
and larger, and nowadays it's increasingly rare to write JavaScript programs
that are intended to be executed as is.

Even though JavaScript originated in browsers, it is now capable of running
on servers and desktops, and even embedded devices! The incentive to target
JavaScript as a platform rather than a language is clearly there.

If you are wondering whether you should even bother learning JavaScript, I
don't have a clear answer for you. These are very exciting times, and there are
so many options. JavaScript, the language, is still evolving, and there is a
large  volume of know-how and code around it. It's quite obviously not going
away any time soon. That much is for sure.

## You can make money programming in JavaScript

I doubt anyone would dispute this, but let me throw it in just in case.
Whatever anyone says about any of the above, you can make a handsome living
programming in JavaScript, and JavaScript alone. You would be missing out on so
many cool languages, but the point is that JavaScript programmers are
sought-after commodity and you couldn't go wrong making it your first and/or
primary weapon of choice.

## In conclusion

JavaScript is a pretty awesome programming language that supports many exciting
ways to express your programs, from simplest scripts to complex real-life
systems, and allows you to make a decent living while doing so. Try to not get
mislead by what people who cannot accept JavaScript for what it is say, and
explore the awesome projects created by those who could not accept it and
decided do something about it.

Also remember that JavaScript is not the best language out there, and certainly
not the only one. It's not an end-all-be-all language that you can use in every
situation. You should continue to learn new languages throughout your
programming life and enrich yourself with new perspectives. Even if you, like
me, keep coming to JavaScript, you will find that your programming is always
permanently expanded by the experiences you have in other languages.

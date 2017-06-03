MUD reminiscing with node & redux
=================================

Why not?

Getting started
---------------

- `npm i`
- `npm run start`
- `telnet localhost 1337`

Test
----

- `npm run test`

Dependencies
------------

- the latest version of [telnet](https://www.npmjs.com/package/telnet) is unfortunately not on NPM, so using git url as dependency instead.

Middleware
----------

You can define middleware to create interactions between the client and the server. `server` exposes `use` which takes two arguments:

- `matchCommand`: string or regex used to match the user's command, e.g. `/join/` would match user input `join` and `joint` but not `joi`
- `response`: callback that is executed when the command matches. The callback is executed with a single argument which is an object:
```
{
    command, // the user's input
    client, // object representing user's connection to server
    l, // write a line to the client
    prompt, // show the user's prompt
}
```

Note:
- You can define as many middleware functions as you want
- Middleware is matched and executed in the order of which they are defined
- If `matchCommand` is `undefined`, or `use` is called with a single argument, the middleware is executed when no middleware was matched with the user's input
- You can use [colors](https://www.npmjs.com/package/colors) when outputting text to the client using 'l()', e.g. `l('Connected to MUD!'.red.bold);` outputs `Connected to MUD` in bold, red text

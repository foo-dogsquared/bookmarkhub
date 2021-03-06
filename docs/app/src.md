# [`src/`](../../src/)
The most important directory is the `src/` directory where the core source code is located. Obviously... 😁

## The JavaScript files
### [`app_constants.js`](../../src/app_constants.js)
The suitable file to be introduced first into the project is the `./app_constants.js` where it contains the routes, information, error messages, and configuration data. It's just there since I just want to have an easy way of editing a bunch of settings while not going through each file replacing every one of them (though, I could use Visual Studio Code's directory-wide search and replace text function but you know...). 

### [`session_store.js`](../../src/session_store.js)
Next is the `./session_store.js`, it simply contains the session store to be used. It uses the [connect-mongo](https://www.npmjs.com/package/connect-mongo) plugin for managing the session store. The sessions will be stored with MongoDB in the same database but in different collections. You can also see that the `./app_constants.js` is also used here for easily referring to the MongoDB database URL.

### [`cryptokey.js`](../../src/cryptokeys.js)
It's simply a JavaScript file that contains the cryptographic functions such as generating salt and the hash function. Also app constants are being used there (you see how they're everywhere).

### [`app.js`](../../src/app.js)
Last but certainly not the least (in fact, it's the most important) is the `./app.js` where it contains the creation of the Express application, middleware chaining, and configuration of the server.

```js
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cookie_parser = require("cookie-parser");
const nanoid_generate = require("nanoid/generate");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const nanoid_url_friendly_alphabet = require("nanoid/url");
const bookmarkhub_router = require("./router");
const path = require("path");
const app_constants = require("./app_constants");   // remember this?
const session_store = require("./session_store");   // also this one?
```

In the first few lines until the first newline the dependencies used for the server. We've also imported the app constants from `app_constants.js` and used the session store from `session_store` as the location to where the sessions will be stored (is that enough redundancy for 'ya?).

Then the Express application is now created then a bunch of middleware chaining happened. 

```js
app
    .use(helmet())
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "pug")
    .use(logger("dev"))
    .use(express.static(path.join(__dirname, "../public")))
    .use(express.urlencoded({extended: true}))
    .use(express.json())
    .use(cookie_parser())
```

We can see the setting up of security headers from the [`helmet` plugin](https://www.npmjs.com/package/helmet), configuring the view engine to be used (which is [Pug](https://pugjs.org/)) and the directory of the views (which is in `./views/`), the directory of the static files (which is in `../public/`), accepting data from HTML forms and JSON, and the ability to parse cookies from the request.

The next major thing is setting up the settings for web sessions and the user sessions:

```js
.use(session({
    cookie: {
        secure: true,
        maxAge: app_constants.cookies.MAX_AGE
    },
    genid: function(req) {return "_" + nanoid_generate(nanoid_url_friendly_alphabet, 64)},
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    resave: true,
    store: session_store,
}))
```

I've followed (most of) the [recommended practices for setting secure cookies on the official Express docs](https://expressjs.com/en/advanced/best-practice-security.html#use-cookies-securely), read the [recommended settings for a secure cookie on the Express `session` plugin](https://github.com/expressjs/session), and read a bunch of articles of the use cases for the recommended settings. And that code is the result of those things. 

We can also see that the session store from `./session_store.js` is used here.

'K. Next part:

```js
.use(function(req, res, next) {
    if (req.cookies[app_constants.cookies.ERROR]) res.clearCookie(app_constants.cookies.ERROR);
    res.cookie(app_constants.cookies.SESSION_ID, req.sessionID);
    if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res[app_constants.cookies.USER_SESSION_ID_COPY] = req.cookies[app_constants.cookies.USER_SESSION_ID];
    next();
})
.use(app_constants.app_configuration.home, bookmarkhub_router.home)
.use(app_constants.app_configuration.page, bookmarkhub_router.page)
.use(app_constants.app_configuration.account, bookmarkhub_router.account)
.use(app_constants.app_configuration.bookmarks_page, bookmarkhub_router.bookmark)
```

Next is a bunch of main routes and their subroutes with their responses stored from `bookmarkhub_router`. Go on, you can [quickly skim the code from the files in the [`../router/ directory`](../../router/) to get a general idea of the app. 

Might as well talk about the app constants from `./app_constants.js` that are starting to get spammed the crap out of it here. You'll get used it (hopefully).

Of course, there is also the obvious middleware function at the start of the code block which basically erases the cookies that serves as an error message handler but you'll get the whole picture of it once you see more of the codebase. Again, there is the spam of the app constants. Nothing to see here.

I've also followed the [best practices for maximizing performance](https://expressjs.com/en/advanced/best-practice-performance.html) as consistently as possible but you'd be the judge of that (and please do tell me how bad it is).

## [`views/`](../../src/views/)
I've used [Pug](https://pugjs.org/) as the view engine since I based it on the [Express generator scaffoldings](https://expressjs.com/en/starter/generator.html) and I also saw a [demo](https://github.com/madhums/node-express-mongoose-demo) of the thing and it is exactly on the way on how I'll code the thing (except the demo uses with Passport).

Anyways, the `./views/` directory contains a bunch of `.pug` files.

The main pages are included within the `layout/` directory. The important template files here are:

- `./layout/default.pug` &mdash; it is the main template where the important HTML tags such as `<html>` and `<body>` (except for the `<head>`) is contained. All of the pages so far are generated with this template.
- `./include/head.pug` &mdash; obviously this contains the `<head>` tag and the usual needed tags like the `<title>` and a bunch of `<meta>` tags.
- `./include/header.pug` &mdash; this is the header template; contains the link for the usual user account actions
- `./include/footer.pug` &mdash; need to say more?

The remaining unmentioned files inside of the `./layout/` directory is the usual pages: the landing page, the help page, and the about page. 

There are also `.pug` files for the errors (like the `./error.pug`), signup and login templates, account page templates, bookmark container mixins, and the little things like the signup box when you're not logged in yet.

## [`style/`](../../src/style/)
The `.style/` directory simply the `.scss` files. How they're compiled is just by executing the npm scripts I've set up. You can compile them one time by running `npm run scss:build` but you can also watch the files by `npm run scss:watch` to get immediate feedback.

If you're familiar with [Jekyll](https://jekyllrb.com/), specifically with the [default theme](https://github.com/jekyll/minima/tree/master/_sass), you may also notice that the structure of the `.scss` files is quite similar and you'd be right.

The folder contains three `.scss` files which separates the styles for the components of the site:

- [`./_base.scss`](../../src/style/_base.scss) contains the default style of the elements
- [`./_layout.scss`](../../src/style/_layout.scss) contains the style of the layouts or elements with certain classes
- [`./main.scss](../../src/style/main.scss) contains the variables and the index file that connects all of the `.scss` files together

## [`models/`](../../src/models/)
The app uses [MongoDB](https://mongodb.com/) as the database but since MongoDB is such a very kind database (or just doesn't give so much crap) that you, the developer, are in full charge and discipline to how will you handle your data. Which is why I use [Mongoose](https://mongoosejs.com/) to mitigate against that particular problem.

If you didn't get the context, MongoDB is not strict when it comes to forming data. Of course, that means the data can be horizontally scaled but that also means that you are going to be responsible and gather the discipline to make your individual data consistent and uniform. This is unlike SQL where it requires planning of modelling the data in the first place.

Mongoose solves that very problem by imposing modelling options and helper functions that usually comes with it like validations and data type setting.

To get started to Mongoose, we need to structure our data which is simply the users. Here is how I planned the structure:

![User schema](../assets/user_schema.png)

The users structure is quite simple, we just have the common user data like username, email address, password (hashed, of course), and the main point of the site which is the bookmarks. The bookmark object has four objects which contains the name of the bookmark, the name of the root folder, the type of bookmark which is imported from, and the structure of the bookmark itself. There's also a specific field that marks the user account whether it has been verified or not which is obviously the `confirmed` field.

Mongoose provides [a LOT of out-of-the-box features](https://mongoosejs.com/docs/guide.html) which is suitably needed for a database which will handle user data and of course, I decided to use it. Please read more of the previously linked guide if you want to understand most of the code at this directory. Just understand what are schema, virtuals, models, and validation. Also take note that validation for passwords are not really working when updating it since they are virtuals so in case you have to check for the password themselves, you need to validate them yourself.

## [`controllers/`](../../src/controllers/)
This is basically a bunch of scripts containing how the data should interact. It mainly serves as a gatekeeper between the routes and the database. It also serves as an additional validator since Mongoose cannot validate everything (or at least I think it is) especially with the password since we can't just store them in plaintext.

Anyway, at the moment, we have three JavaScript files.

- [`./index.js`](../../src/controllers/index.js) &mdash; contains the exports of the rest of the other scripts; it basically serves as a module for the directory 
- [`./accounts.js`](../../src/controllers/accounts.js) &mdash; contains the functions for interacting with the account when you logged in; functions include retrieving users when you visit a particular page, checking for session cookies and validating them in the session store, saving the edited description, and saving and converting the bookmarks (from `../parser/` directory which will be discussed later)
- [`./users.js`](../../src/controllers/users.js) &mdash; contains the functions for usual user actions such as signing up, logging in, logging out, resetting and confirming password resets, and sending out specific types of email;

All of these relate for interacting with the routing which will be the next directory to be discussed.

## [`router/`](../../src/router/)
The directory contains the scripts for the routes. It contains the scripts where a guest visitor could go and not go without restricting it.

Like the `../controllers/` directory, it also contains an `index.js` file that serves as a uniform way of exposing the functions without importing them all but let's discuss about the rest:

- [`./route_account.js/`](../../src/router/route_account.js) &mdash; this contains all of the routes for `<ORIGIN>/account/`; mostly contains interaction with your personal account and uses functions from `../controllers/account.js` 
- [`./route_home.js/`](../../src/router/route_home.js) &mdash; this contains all of the routes for `<ORIGIN>`; this includes the help, about, signup, login, logout, reset password and the confirmation page; mostly uses the functions from `../controllers/users.js`
- [`./route_users.js/`](../../src/router/route_users.js) &mdash; it contains only route and that is the route for the user page who was able to sign up for the app

## [`parser/`](../../src/parser/)
This contains the parser for the bookmark imports. So far, only the Netscape and Pocket exports are complete and functional which you can test it out from the `test/` directory on the root.

Like with the rest of the directories, it also contains an `index.js` that serves as a bridge between the rest of the files in the same directory but this time, it serves as the export to create one core function.

Well, you can also check out the additional resources I was able to look up for [Netscape bookmarks](../netscape_bookmarks/). You may also add your own notes as well and make a pull request, if you want to.

## Conclusion
Anyway, this concludes the tour of the source code. Let me know how this documentation turns out to be whether it is good or bad in quality. Feel free to ping me with email or something. 🙂

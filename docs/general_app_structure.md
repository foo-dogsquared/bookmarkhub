# Code walkthrough
If you want to fork this app, you should get a folder structure similar to the given example below:

```
- docs/
- public/
    - css/
    - img/
    - js/
- src/
    - controllers/
    - models/
    - views/
    - parser/
    - router/
    - style/
    - app.js
    - app_constants.js
    - session_store.js
- test/
- package.json
- package-lock.json
- README.md
- server.js
```

To start this walkthrough, I suggest you would look at the `package.json` to see the needed dependencies and available scripts. Just go with `npm i` and go with it. Anyways, in the `scripts` field of the JSON file, the most important scripts to get started are the `watch`, `start`, and `scss:watch`.

If you want to debug it with full experience, make sure to run both `watch` and `scss:watch` on separate shell sessions. I did use the [middleware for SASS](https://github.com/sass/node-sass-middleware) but I find it hard to use (but most likely it's just me not following instructions right 🤔).

If you're testing this app on your local machine, make sure to have an `.env` file that contains the keys `MONGODB_DB_NAME` and `SECRET`. Otherwise, if you're deploying it live on production mode, make sure to have a way to access those environmental variables. On [Heroku](https://devcenter.heroku.com/articles/config-vars), for example, they offer a way to set environmental variables and their values so you won't need to send the `.env` file.

Anyways, if you want to have a tour of the app structure, just follow the links provided below:
- [`src/`](./app/src.md) <-- I RECOMMEND TO START HERE

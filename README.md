# bookmarkhub
A place to share your bookmarks or something.

## Documentation
### Specification
- Node v11.3.0
- npm 6.4.1

Also, if you want to tinker this app, I provided a documentation on the whole app on [the `docs/` folder](./docs/). Make sure to start with the [`general_app_structure.md`](./docs/general_app_structure.md).

There's no demo link yet but you can deploy this on your own but you have to provide some stuff on your own.

Here are the following requirements before you can fully deploy your app along with the representation in environmental variables that you can find within the source code (take note that you have to use an `.env` file and set `dotenv` to the files with the `process.env`):
 
- MongoDB database &mdash; `MONGODB_URL` 
- Google Analytics ID &mdash; `GOOGLE_ANALYTICS_ID`
- support email &mdash; `SUPPORT_EMAIL`
- support email password &mdash; `SUPPORT_EMAIL_PASSWORD`
- account verification secret string &mdash; `VERIFICATION_TOKEN_SECRET`
- password reset secret string &mdash; `PASSWORD_RESET_TOKEN_SECRET`
- cookie secret string &mdash; `COOKIE_SECRET`
- production app link &mdash; `APP_LINK`

## User Stories
- ~~Support Netscape bookmarks from major browsers~~
- Add URL bookmark support 
- ~~User account management~~
- ~~Session management~~
- MAKE IT WORK IN PRODUCTION ENVIRONMENT 😋

## Resources used
- https://iconmonstr.com
- http://oldbookillustrations.com/
- https://iconfindr.com

## Support
If you like my work, you could support me through donations:

[![Buy Me A Coffee image](./docs/assets/button-orange.png)](https://www.buymeacoffee.com/foodogsquared)

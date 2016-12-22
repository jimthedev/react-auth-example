## Getting started

### Development

1. Clone this repo
2. `npm install`
3. copy `server/.env.example` to `server/.env`
4. Edit `server/.env` to add your auth0 client id and secret
5. Run `npm start` to start the front end.
6. In another tab run `nodemon server/index.js`.

### To do a build

1. Run `npm run build`

### To do a deployment (front end only)

Use heroku.
Make sure to set the environment variables listed in server/.env

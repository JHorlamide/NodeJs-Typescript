# Quick Start Guide

To run the cloned codebase directly, you need to have Node.js and Docker installed.

1. Run `npm i` to install dependencies.
2. Run `sudo docker-compose up -d` to get a MongoDB instance running.
3. Make your own `.env` file in the project root, following the key name but not value used in [`.env.example`](https://github.com/makinhs/toptal-rest-series/blob/toptal-article-03/.env.example).

4. From there, any the following should work:
  - `npm run test`
  - `npm run test-debug`
  - `npm start`
  - `npm run debug`
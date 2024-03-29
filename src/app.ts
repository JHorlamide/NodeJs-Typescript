import dotenv from "dotenv";
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  throw dotenvResult.error;
}

import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import helmet from 'helmet'
import { CommonRouteConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import { AuthRoutes } from "../src/auth/auth.route.config";
import debug from "debug";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 9000;
const routes: Array<CommonRouteConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());
app.use(helmet())

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
  if (typeof global.it === "function") {
    loggerOptions.level = "http"; // for non-debug test runs, squelch entirely
  }
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default server.listen(port, () => {
  routes.forEach((route: CommonRouteConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});

import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { commonRouteConfig } from "./src/common/common.routes.config";
import { UserRoutes } from "./src/users/users.routes.config";
import pino from 'pino';

const app = express();

app.listen(9000, () => {
  console.log(`Server started on port 9000`);
});

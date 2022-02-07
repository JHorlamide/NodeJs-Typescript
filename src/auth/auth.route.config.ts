import express from "express";
import { CommonRouteConfig } from "../common/common.routes.config";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import AuthController from "./controller/auth.controller";
import AuthMiddleware from "./middleware/auth.middleware";
import JwtMiddleware from "./middleware/jwt.middleware";
import { body } from "express-validator";

export class AuthRoutes extends CommonRouteConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post("/auth", [
      body("email").isEmail(),
      body("password").isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AuthMiddleware.verifyUserPassword,
      AuthController.createJWT
    ]);

    this.app.post("/auth/refresh-token", [
      JwtMiddleware.validJWTNeeded,
      JwtMiddleware.verifyRefreshBodyField,
      JwtMiddleware.validRefreshNeeded,
      AuthController.createJWT
    ]);

    return this.app;
  }
}

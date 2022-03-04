import express from "express";
import { CommonRouteConfig } from "../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middlewares/users.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import { body } from "express-validator";
import JwtMiddleware from "../auth/middleware/jwt.middleware";
import CommonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

export class UsersRoutes extends CommonRouteConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get(
        JwtMiddleware.validJWTNeeded,
        CommonPermissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        UsersController.listUsers
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("Must include password (5+ characters)"),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app.param(`userId`, UsersMiddleware.extractUserId);

    this.app
      .route("/users/:userId")
      .all(
        UsersMiddleware.validateUserExists,
        JwtMiddleware.validJWTNeeded,
        CommonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put("/users/:userId", [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Must include password (5characters)"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersMiddleware.userCantChangePermission,
      CommonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      UsersController.put
    ]);

    this.app.patch("/users/:userId", [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be 5 characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.userCantChangePermission,
      CommonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      UsersController.patch
    ]);

    this.app.put("/users/:userId/permissionFlags/:permissionFlags", [
      JwtMiddleware.validJWTNeeded,
      CommonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      // Note: The above two pieces of middleware are needed despite
      // the reference to them in the .all() call, because that only covers
      // /users/:userId, not anything beneath it in the hierarchy
      CommonPermissionMiddleware.permissionFlagRequired(PermissionFlag.FREE_PERMISSION),
      UsersController.updatePermissionFlag,
    ]);

    return this.app;
  }
}

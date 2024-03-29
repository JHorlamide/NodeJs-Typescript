import express from "express";
import UserService from "../service/users.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:user-middleware");

class UserMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required fields email and password`
      });
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await UserService.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: "User email already exists" });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // const user = await UserService.getUserByEmail(req.body.email);
    // if (user && user._id == req.params.userId) {
    if (res.locals.user._id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: "Invalid email" });
    }
  }

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      log("Validating email", req.body.email);
      this.validateSameEmailBelongToSameUser(req, res, next);
    }
  };

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await UserService.readById(req.params.userId);
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`
      });
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

  async userCantChangePermission(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      "permissionFlags" in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      return res
        .status(403)
        .send({ errors: ["User cannot change permission flags"] });
    } else {
      next();
    }
  }
}

export default new UserMiddleware();

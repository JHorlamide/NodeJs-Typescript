import express from "express";
import { PermissionFlag } from "./common.permissionflag.enum";
import debug from "debug";

const log: debug.IDebugger = debug("app:common-permission-middleware");

class CommonPermissionMiddleware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userPermissionFlag = parseInt(res.locals.jwt.permissionFlags);
        if (userPermissionFlag & requiredPermissionFlag) {
          return next();
        } else {
          res.status(403).send();
        }
      } catch (error) {
        log(error);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userPermissionFlag = parseInt(res.locals.jwt.permissionFlags);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionFlag & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        res.status(403).send();
      }
    }
  }
}

export default new CommonPermissionMiddleware();

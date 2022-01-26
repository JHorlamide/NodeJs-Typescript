import express, {
  Application,
  Request,
  Response,
  NextFunction
} from "express";
import { commonRouteConfig } from "../common/common.routes.config";

export class UserRoutes extends commonRouteConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get((req: Request, res: Response) => {
        return res.status(200).sendFile("List of users");
      })
      .post((req: Request, res: Response) => {
        return res.status(200).sendFile("Post of users");
      });

    this.app
      .route("users/:userId")
      .all((req: Request, res: Response, next: NextFunction) => {
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).sendFile(`GET requested for id ${req.params.userId}`);
      })
      .put((req: Request, res: Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.userId}`);
      });
    return this.app;
  }
}

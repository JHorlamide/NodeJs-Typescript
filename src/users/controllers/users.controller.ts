// we import express to add types to the request/response objects from our controller functions
import express from "express";

// we import our newly created user services
import UserService from "../service/users.service";

// we import the argon2 library for password hashing
import argon2 from "argon2";

// we use debug with a custom context as described in Part 1
import debug from "debug";

import { PatchUserDTO } from "../dto/patch.user.dto";

const log: debug.IDebugger = debug("app:users-controller");

class UserController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await UserService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await UserService.readById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await UserService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }

    log(await UserService.patchById(req.body.id, req.body));
    res.status(240).send();
  }

  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await UserService.putById(req.body.password, req.body));
    res.status(204).send();
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await UserService.deleteById(req.body.id));
    res.status(204).send();
  }

  async updatePermissionFlag(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDTO = {
      permissionFlags: parseInt(req.params.permissionFlags)
    };

    log(await UserService.patchById(req.body.id, patchUserDto));
    res.status(204).send();
  }
}

export default new UserController();

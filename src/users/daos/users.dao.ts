import shortid from "shortid";
import debug from "debug";

import { CreateUserDTO } from "../dto/create.user.dto";
import { PutUserDTO } from "../dto/put.user.dto";
import { PatchUserDTO } from "../dto/patch.user.dto";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDAO {
  users: Array<CreateUserDTO> = [];

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(user: CreateUserDTO) {
    user.id = shortid.generate();
    this.users.push(user);
    return user.id;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId);
  }

  async putUserById(userId: string, user: PutUserDTO) {
    const objectIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(objectIndex, 1, user);
    return `${user.id} was update via put`;
  }

  async patchUserById(userId: string, user: PatchUserDTO) {
    const objectIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    let currentUser = this.users[objectIndex];

    const allowedPatchFields = [
      "password",
      "firstName",
      "lastName",
      "permissionLevel"
    ];

    for (let field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        currentUser[field] = user[field];
      }
    }

    this.users.splice(objectIndex, 1, currentUser);
    return `${user.id} patched`;
  }

  async removeUserById(userId: string) {
    const objectIndex = this.users.findIndex(
      (user: { id: string }) => user.id === userId
    );
    this.users.splice(objectIndex, 1);
    return `${userId} removed`;
  }

  async getUserByEmail(email: string) {
      const objectIndex = this.users.findIndex((user: {email: string}) => user.email === email);
      const currentUser = this.users[objectIndex];

      if(currentUser) {
        return currentUser;
      } else {
        return null;
      }
  }
}

export default new UsersDAO();

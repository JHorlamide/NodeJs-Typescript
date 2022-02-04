import UserDAO from "../daos/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDTO } from "../dto/create.user.dto";
import { PutUserDTO } from "../dto/put.user.dto";
import { PatchUserDTO } from "../dto/patch.user.dto";

class UserService implements CRUD {
  async create(resource: CreateUserDTO) {
    return UserDAO.addUser(resource);
  }

  async deleteById(id: string) {
    return UserDAO.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UserDAO.getUsers(limit, page);
  }

  async patchById(id: string, resource: PatchUserDTO) {
    return UserDAO.updateUserById(id, resource);
  }

  async readById(id: string) {
    return UserDAO.getUserById(id);
  }

  async putById(id: string, resource: PutUserDTO) {
    return UserDAO.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UserDAO.getUserByEmail(email);
  }
}

export default new UserService();
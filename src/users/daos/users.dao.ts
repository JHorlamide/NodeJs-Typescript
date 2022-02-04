import shortid from "shortid";
import debug from "debug";
import { CreateUserDTO } from "../dto/create.user.dto";
import { PutUserDTO } from "../dto/put.user.dto";
import { PatchUserDTO } from "../dto/patch.user.dto";
import MongooseService from "../../common/service/mongoose.service";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDAO {
  Schema = MongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number
    },
    { id: false }
  );

  User = MongooseService.getMongoose().model("User", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDTO) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1
    });

    await user.save();
    return userId;
  };

  async getUserByEmail(email: String) {
    return this.User.findOne({ email: email }).exec();
  };

  async getUserById(userId: String) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  };

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  };

  async updateUserById(userId: string, userFields: PutUserDTO | PatchUserDTO) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    );

    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({_id: userId}).exec();
  }
}

export default new UsersDAO();

import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

class MongooseService {
  private count = 0;
  // private mongooseOptions = {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   serverSelectionTimeoutMS: 5000,
  //   useFindAndModify: false
  // };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  async connectWithRetry() {
    log("Attempting MongoDB connection (will retry if needed)");
    try {
      const connectionResult = await mongoose.connect(
        "mongodb://localhost:27017/api-db"
      );

      if (connectionResult) log("MongoDB is connected");
    } catch (error) {
      const retrySeconds = 5;
      log(
        `MongoDB connection unsuccessful (will retry #${++this
          .count} after ${retrySeconds} seconds):`,
        error
      );
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    }
  }
}

export default new MongooseService();

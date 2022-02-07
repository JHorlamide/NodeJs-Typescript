"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)("app:mongoose-service");
class MongooseService {
    // private mongooseOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   serverSelectionTimeoutMS: 5000,
    //   useFindAndModify: false
    // };
    constructor() {
        this.count = 0;
        this.connectWithRetry();
    }
    getMongoose() {
        return mongoose_1.default;
    }
    connectWithRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            log("Attempting MongoDB connection (will retry if needed)");
            try {
                const connectionResult = yield mongoose_1.default.connect("mongodb://localhost:27017/api-db");
                if (connectionResult)
                    log("MongoDB is connected");
            }
            catch (error) {
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful (will retry #${++this
                    .count} after ${retrySeconds} seconds):`, error);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            }
        });
    }
}
exports.default = new MongooseService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc2VydmljZS9tb25nb29zZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLGtEQUEwQjtBQUUxQixNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUUzRCxNQUFNLGVBQWU7SUFFbkIsOEJBQThCO0lBQzlCLDJCQUEyQjtJQUMzQiw4QkFBOEI7SUFDOUIsb0NBQW9DO0lBQ3BDLDRCQUE0QjtJQUM1QixLQUFLO0lBRUw7UUFSUSxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBU2hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxrQkFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFSyxnQkFBZ0I7O1lBQ3BCLEdBQUcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1lBQzVELElBQUk7Z0JBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLGtCQUFRLENBQUMsT0FBTyxDQUM3QyxrQ0FBa0MsQ0FDbkMsQ0FBQztnQkFFRixJQUFJLGdCQUFnQjtvQkFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQzthQUNuRDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsR0FBRyxDQUNELGdEQUFnRCxFQUFFLElBQUk7cUJBQ25ELEtBQUssVUFBVSxZQUFZLFlBQVksRUFDMUMsS0FBSyxDQUNOLENBQUM7Z0JBQ0YsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDeEQ7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksZUFBZSxFQUFFLENBQUMifQ==
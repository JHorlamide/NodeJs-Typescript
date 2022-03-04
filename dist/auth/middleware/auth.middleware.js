"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const users_service_1 = __importDefault(require("../../users/service/users.service"));
const argon2 = __importStar(require("argon2"));
class AuthMiddleware {
    verifyUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmailWithPassword(req.body.email);
            if (user) {
                const passwordHash = user.password;
                if (yield argon2.verify(passwordHash, req.body.password)) {
                    req.body = {
                        userId: user._id,
                        email: user.email,
                        permissionFlags: user.permissionFlags
                    };
                    return next();
                }
            }
            // Giving the same message in both cases
            // helps protect against cracking attempts:
            res.status(400).send({ errors: ["Invalid email and/or password"] });
        });
    }
}
exports.default = new AuthMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F1dGgvbWlkZGxld2FyZS9hdXRoLm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esc0ZBQTZEO0FBQzdELCtDQUFpQztBQUVqQyxNQUFNLGNBQWM7SUFDWixrQkFBa0IsQ0FDdEIsR0FBb0IsRUFDcEIsR0FBcUIsRUFDckIsSUFBMEI7O1lBRTFCLE1BQU0sSUFBSSxHQUFRLE1BQU0sdUJBQVksQ0FBQywwQkFBMEIsQ0FDN0QsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2YsQ0FBQztZQUNGLElBQUksSUFBSSxFQUFFO2dCQUNSLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBRW5DLElBQUksTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN4RCxHQUFHLENBQUMsSUFBSSxHQUFHO3dCQUNULE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRzt3QkFDaEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNqQixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7cUJBQ3RDLENBQUM7b0JBQ0YsT0FBTyxJQUFJLEVBQUUsQ0FBQztpQkFDZjthQUNGO1lBRUQsd0NBQXdDO1lBQ3hDLDJDQUEyQztZQUMzQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLCtCQUErQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxjQUFjLEVBQUUsQ0FBQyJ9
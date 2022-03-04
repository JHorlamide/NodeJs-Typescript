"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
const users_middleware_1 = __importDefault(require("./middlewares/users.middleware"));
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const express_validator_1 = require("express-validator");
const jwt_middleware_1 = __importDefault(require("../auth/middleware/jwt.middleware"));
const common_permission_middleware_1 = __importDefault(require("../common/middleware/common.permission.middleware"));
const common_permissionflag_enum_1 = require("../common/middleware/common.permissionflag.enum");
class UsersRoutes extends common_routes_config_1.CommonRouteConfig {
    constructor(app) {
        super(app, "UserRoutes");
    }
    configureRoutes() {
        this.app
            .route("/users")
            .get(jwt_middleware_1.default.validJWTNeeded, common_permission_middleware_1.default.permissionFlagRequired(common_permissionflag_enum_1.PermissionFlag.ADMIN_PERMISSION), users_controller_1.default.listUsers)
            .post((0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password")
            .isLength({ min: 5 })
            .withMessage("Must include password (5+ characters)"), body_validation_middleware_1.default.verifyBodyFieldsErrors, users_middleware_1.default.validateSameEmailDoesntExist, users_controller_1.default.createUser);
        this.app.param(`userId`, users_middleware_1.default.extractUserId);
        this.app
            .route("/users/:userId")
            .all(users_middleware_1.default.validateUserExists, jwt_middleware_1.default.validJWTNeeded, common_permission_middleware_1.default.onlySameUserOrAdminCanDoThisAction)
            .get(users_controller_1.default.getUserById)
            .delete(users_controller_1.default.removeUser);
        this.app.put("/users/:userId", [
            (0, express_validator_1.body)("email").isEmail(),
            (0, express_validator_1.body)("password")
                .isLength({ min: 5 })
                .withMessage("Must include password (5characters)"),
            (0, express_validator_1.body)("firstName").isString(),
            (0, express_validator_1.body)("lastName").isString(),
            (0, express_validator_1.body)("permissionFlags").isInt(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.validateSameEmailBelongToSameUser,
            users_middleware_1.default.userCantChangePermission,
            common_permission_middleware_1.default.permissionFlagRequired(common_permissionflag_enum_1.PermissionFlag.PAID_PERMISSION),
            users_controller_1.default.put
        ]);
        this.app.patch("/users/:userId", [
            (0, express_validator_1.body)("email").isEmail().optional(),
            (0, express_validator_1.body)("password")
                .isLength({ min: 5 })
                .withMessage("Password must be 5 characters")
                .optional(),
            (0, express_validator_1.body)("firstName").isString().optional(),
            (0, express_validator_1.body)("lastName").isString().optional(),
            (0, express_validator_1.body)("permissionFlags").isInt().optional(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.userCantChangePermission,
            common_permission_middleware_1.default.permissionFlagRequired(common_permissionflag_enum_1.PermissionFlag.PAID_PERMISSION),
            users_controller_1.default.patch
        ]);
        this.app.put("/users/:userId/permissionFlags/:permissionFlags", [
            jwt_middleware_1.default.validJWTNeeded,
            common_permission_middleware_1.default.onlySameUserOrAdminCanDoThisAction,
            // Note: The above two pieces of middleware are needed despite
            // the reference to them in the .all() call, because that only covers
            // /users/:userId, not anything beneath it in the hierarchy
            common_permission_middleware_1.default.permissionFlagRequired(common_permissionflag_enum_1.PermissionFlag.FREE_PERMISSION),
            users_controller_1.default.updatePermissionFlag,
        ]);
        return this.app;
    }
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91c2Vycy91c2Vycy5yb3V0ZXMuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHlFQUFtRTtBQUNuRSxzRkFBNkQ7QUFDN0Qsc0ZBQTZEO0FBQzdELGlIQUF1RjtBQUN2Rix5REFBeUM7QUFDekMsdUZBQThEO0FBQzlELHFIQUEyRjtBQUMzRixnR0FBaUY7QUFFakYsTUFBYSxXQUFZLFNBQVEsd0NBQWlCO0lBQ2hELFlBQVksR0FBd0I7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHO2FBQ0wsS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUNmLEdBQUcsQ0FDRix3QkFBYSxDQUFDLGNBQWMsRUFDNUIsc0NBQTBCLENBQUMsc0JBQXNCLENBQy9DLDJDQUFjLENBQUMsZ0JBQWdCLENBQ2hDLEVBQ0QsMEJBQWUsQ0FBQyxTQUFTLENBQzFCO2FBQ0EsSUFBSSxDQUNILElBQUEsd0JBQUksRUFBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFDdkIsSUFBQSx3QkFBSSxFQUFDLFVBQVUsQ0FBQzthQUNiLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNwQixXQUFXLENBQUMsdUNBQXVDLENBQUMsRUFDdkQsb0NBQXdCLENBQUMsc0JBQXNCLEVBQy9DLDBCQUFlLENBQUMsNEJBQTRCLEVBQzVDLDBCQUFlLENBQUMsVUFBVSxDQUMzQixDQUFDO1FBRUosSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLDBCQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsZ0JBQWdCLENBQUM7YUFDdkIsR0FBRyxDQUNGLDBCQUFlLENBQUMsa0JBQWtCLEVBQ2xDLHdCQUFhLENBQUMsY0FBYyxFQUM1QixzQ0FBMEIsQ0FBQyxrQ0FBa0MsQ0FDOUQ7YUFDQSxHQUFHLENBQUMsMEJBQWUsQ0FBQyxXQUFXLENBQUM7YUFDaEMsTUFBTSxDQUFDLDBCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0IsSUFBQSx3QkFBSSxFQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRTtZQUN2QixJQUFBLHdCQUFJLEVBQUMsVUFBVSxDQUFDO2lCQUNiLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDcEIsV0FBVyxDQUFDLHFDQUFxQyxDQUFDO1lBQ3JELElBQUEsd0JBQUksRUFBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDNUIsSUFBQSx3QkFBSSxFQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFBLHdCQUFJLEVBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDL0Isb0NBQXdCLENBQUMsc0JBQXNCO1lBQy9DLDBCQUFlLENBQUMsaUNBQWlDO1lBQ2pELDBCQUFlLENBQUMsd0JBQXdCO1lBQ3hDLHNDQUEwQixDQUFDLHNCQUFzQixDQUMvQywyQ0FBYyxDQUFDLGVBQWUsQ0FDL0I7WUFDRCwwQkFBZSxDQUFDLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDL0IsSUFBQSx3QkFBSSxFQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxJQUFBLHdCQUFJLEVBQUMsVUFBVSxDQUFDO2lCQUNiLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDcEIsV0FBVyxDQUFDLCtCQUErQixDQUFDO2lCQUM1QyxRQUFRLEVBQUU7WUFDYixJQUFBLHdCQUFJLEVBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLElBQUEsd0JBQUksRUFBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDdEMsSUFBQSx3QkFBSSxFQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQzFDLG9DQUF3QixDQUFDLHNCQUFzQjtZQUMvQywwQkFBZSxDQUFDLHdCQUF3QjtZQUN4QyxzQ0FBMEIsQ0FBQyxzQkFBc0IsQ0FDL0MsMkNBQWMsQ0FBQyxlQUFlLENBQy9CO1lBQ0QsMEJBQWUsQ0FBQyxLQUFLO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxFQUFFO1lBQzlELHdCQUFhLENBQUMsY0FBYztZQUM1QixzQ0FBMEIsQ0FBQyxrQ0FBa0M7WUFDN0QsOERBQThEO1lBQzlELHFFQUFxRTtZQUNyRSwyREFBMkQ7WUFDM0Qsc0NBQTBCLENBQUMsc0JBQXNCLENBQUMsMkNBQWMsQ0FBQyxlQUFlLENBQUM7WUFDakYsMEJBQWUsQ0FBQyxvQkFBb0I7U0FDckMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQW5GRCxrQ0FtRkMifQ==
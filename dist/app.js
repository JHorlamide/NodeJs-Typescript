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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dotenvResult = dotenv_1.default.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const users_routes_config_1 = require("./users/users.routes.config");
const auth_route_config_1 = require("../src/auth/auth.route.config");
const debug_1 = __importDefault(require("debug"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = 9000;
const routes = [];
const debugLog = (0, debug_1.default)("app");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }))
};
if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
    if (typeof global.it === "function") {
        loggerOptions.level = "http"; // for non-debug test runs, squelch entirely
    }
}
// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));
// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new users_routes_config_1.UsersRoutes(app));
routes.push(new auth_route_config_1.AuthRoutes(app));
// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req, res) => {
    res.status(200).send(runningMessage);
});
exports.default = server.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    // our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    console.log(runningMessage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsTUFBTSxZQUFZLEdBQUcsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNyQyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDdEIsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDO0NBQzFCO0FBRUQsc0RBQThCO0FBQzlCLDJDQUE2QjtBQUU3QixpREFBbUM7QUFDbkMsZ0VBQWtEO0FBQ2xELGdEQUF3QjtBQUN4QixvREFBMkI7QUFFM0IscUVBQTBEO0FBQzFELHFFQUEyRDtBQUMzRCxrREFBMEI7QUFFMUIsTUFBTSxHQUFHLEdBQXdCLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQzNDLE1BQU0sTUFBTSxHQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFNLE1BQU0sR0FBNkIsRUFBRSxDQUFDO0FBQzVDLE1BQU0sUUFBUSxHQUFvQixJQUFBLGVBQUssRUFBQyxLQUFLLENBQUMsQ0FBQztBQUUvQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsZ0JBQU0sR0FBRSxDQUFDLENBQUE7QUFFakIsTUFBTSxhQUFhLEdBQWlDO0lBQ2xELFVBQVUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQ3ZDO0NBQ0YsQ0FBQztBQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtJQUN0QixhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLGlEQUFpRDtJQUM3RSxJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsS0FBSyxVQUFVLEVBQUU7UUFDbkMsYUFBYSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyw0Q0FBNEM7S0FDM0U7Q0FDRjtBQUVELHFEQUFxRDtBQUNyRCxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUU5QyxrREFBa0Q7QUFDbEQsdUZBQXVGO0FBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQ0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDhCQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVqQyxxRUFBcUU7QUFDckUsTUFBTSxjQUFjLEdBQUcsc0NBQXNDLElBQUksRUFBRSxDQUFDO0FBRXBFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7SUFDM0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBZSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQXdCLEVBQUUsRUFBRTtRQUMxQyxRQUFRLENBQUMseUJBQXlCLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFSCwyREFBMkQ7SUFDM0QsMERBQTBEO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUMifQ==
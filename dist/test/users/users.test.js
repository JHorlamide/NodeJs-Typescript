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
const app_1 = __importDefault(require("../../app"));
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const shortid_1 = __importDefault(require("shortid"));
const mongoose_1 = __importDefault(require("mongoose"));
let firstUserIdTest = ""; // will later hold a value returned by our API
const firstUserBody = {
    email: `marcos.henrique+${shortid_1.default.generate()}@toptal.com`,
    password: "Sup3rSecret!23"
};
let accessToken = "";
let refreshToken = "";
const newFirstName = "";
const newFirstName2 = "";
const newLastName2 = "";
describe("users and auth endpoint", function () {
    let request;
    before(function () {
        request = supertest_1.default.agent(app_1.default);
    });
    after(function (done) {
        // shut down the Express.js server, close our MongoDB connection, then
        // tell Mocha we're done:
        app_1.default.close(() => {
            mongoose_1.default.connection.close(done);
        });
    });
    it("Should allow a POST request to /users", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request.post("/users").send(firstUserBody);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body.id).to.be.a("string");
            firstUserIdTest = res.body.id;
        });
    });
    it("Should allow a POST  request to /auth", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request.post("/auth").send(firstUserBody);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body.accessToken).to.be.a("string");
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
        });
    });
    it("Should allow a GET request from /user/:userId with an access token", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request
                .get(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body._id).to.be.a("string");
            (0, chai_1.expect)(res.body._id).to.equal(firstUserIdTest);
            (0, chai_1.expect)(res.body.email).to.equal(firstUserBody.email);
        });
    });
    describe("With a valid access token", function () {
        it("Should disallow a GET request from /users", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .get("/users")
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                (0, chai_1.expect)(res.status).to.equal(403);
            });
        });
        it("Should disallow a PATCH request to /user/:userId", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield yield request
                    .patch(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({ firstName: newFirstName });
                (0, chai_1.expect)(res.status).to.equal(403);
            });
        });
        it("should disallow a PUT to /users/:userId with an nonexistent ID", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .put("/users/i-do-not-exist")
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: "Olamide",
                    lastName: "Jubril",
                    permissionFlags: 285
                });
                (0, chai_1.expect)(res.status).to.equal(404);
            });
        });
        it("should disallow a PUT to /users/:userId trying to change the permission flags", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield yield request
                    .put(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: "Olamide",
                    lastName: "Jubril",
                    permissionFlags: 285
                });
                (0, chai_1.expect)(res.status).to.equal(403);
                (0, chai_1.expect)(res.body.errors).to.be.an("array");
                (0, chai_1.expect)(res.body.errors).to.have.length(1);
                (0, chai_1.expect)(res.body.errors[0]).to.equal("User cannot change permission flags");
            });
        });
        it("should allow a PUT to /users/:userId/permissionFlags/2 for testing", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .put(`/users/${firstUserIdTest}/permissionFlags/2`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({});
                (0, chai_1.expect)(res.status).to.equal(204);
            });
        });
        describe("With a new set of permission flag", function () {
            it("should allow a POST to /auth/refresh-token", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield yield request
                        .post("/auth/refresh-token")
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({ refreshToken });
                    (0, chai_1.expect)(res.status).to.equal(201);
                    (0, chai_1.expect)(res.body).not.to.be.empty;
                    (0, chai_1.expect)(res.body).to.an("object");
                    (0, chai_1.expect)(res.body.accessToken).to.be.a("string");
                    accessToken = res.body.accessToken;
                    refreshToken = res.body.refreshToken;
                });
            });
            it("should allow a PUT to /users/:userId to change first and last names", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .put(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                        email: firstUserBody.email,
                        password: firstUserBody.password,
                        firstName: newFirstName2,
                        lastName: newLastName2,
                        permissionFlags: 2
                    });
                    (0, chai_1.expect)(res.status).to.equal(204);
                });
            });
            it("should allow a GET from /users/:userId and should have a new full name", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .get(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    (0, chai_1.expect)(res.status).to.equal(200);
                    (0, chai_1.expect)(res.body).not.to.be.empty;
                    (0, chai_1.expect)(res.body).to.be.an("object");
                    (0, chai_1.expect)(res.body._id).to.be.a("string");
                    (0, chai_1.expect)(res.body.firstName).to.equal(newFirstName2);
                    (0, chai_1.expect)(res.body.lastName).to.equal(newLastName2);
                    (0, chai_1.expect)(res.body.email).to.equal(firstUserBody.email);
                    (0, chai_1.expect)(res.body._id).to.equal(firstUserIdTest);
                });
            });
            it("should allow a DELETE from /users/:userId", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .delete(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    (0, chai_1.expect)(res.status).to.equal(204);
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0L3VzZXJzL3VzZXJzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsMERBQWtDO0FBQ2xDLCtCQUE4QjtBQUM5QixzREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQyxDQUFDLDhDQUE4QztBQUN4RSxNQUFNLGFBQWEsR0FBRztJQUNwQixLQUFLLEVBQUUsbUJBQW1CLGlCQUFPLENBQUMsUUFBUSxFQUFFLGFBQWE7SUFDekQsUUFBUSxFQUFFLGdCQUFnQjtDQUMzQixDQUFDO0FBRUYsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDeEIsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsSUFBSSxPQUFpQyxDQUFDO0lBRXRDLE1BQU0sQ0FBQztRQUNMLE9BQU8sR0FBRyxtQkFBUyxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLElBQUk7UUFDbEIsc0VBQXNFO1FBQ3RFLHlCQUF5QjtRQUN6QixhQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNiLGtCQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFOztZQUMxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTdELElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDakMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLENBQUM7S0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7O1lBQzFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUQsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDbkMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3ZDLENBQUM7S0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7O1lBQ3ZFLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTztpQkFDdEIsR0FBRyxDQUFDLFVBQVUsZUFBZSxFQUFFLENBQUM7aUJBQ2hDLEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRSxFQUFFLENBQUM7aUJBQy9DLElBQUksRUFBRSxDQUFDO1lBRVYsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDL0MsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUEsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTs7Z0JBQzlDLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTztxQkFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQztxQkFDYixHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMvQyxJQUFJLEVBQUUsQ0FBQztnQkFFVixJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDO1NBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFOztnQkFDckQsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLE9BQU87cUJBQzVCLEtBQUssQ0FBQyxVQUFVLGVBQWUsRUFBRSxDQUFDO3FCQUNsQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMvQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFFckMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQztTQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTs7Z0JBQ25FLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTztxQkFDdEIsR0FBRyxDQUFDLHVCQUF1QixDQUFDO3FCQUM1QixHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMvQyxJQUFJLENBQUM7b0JBQ0osS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO29CQUMxQixRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7b0JBQ2hDLFNBQVMsRUFBRSxTQUFTO29CQUNwQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsZUFBZSxFQUFFLEdBQUc7aUJBQ3JCLENBQUMsQ0FBQztnQkFFTCxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDO1NBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtFQUErRSxFQUFFOztnQkFDbEYsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLE9BQU87cUJBQzVCLEdBQUcsQ0FBQyxVQUFVLGVBQWUsRUFBRSxDQUFDO3FCQUNoQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMvQyxJQUFJLENBQUM7b0JBQ0osS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO29CQUMxQixRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7b0JBQ2hDLFNBQVMsRUFBRSxTQUFTO29CQUNwQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsZUFBZSxFQUFFLEdBQUc7aUJBQ3JCLENBQUMsQ0FBQztnQkFFTCxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUNqQyxxQ0FBcUMsQ0FDdEMsQ0FBQztZQUNKLENBQUM7U0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7O2dCQUN2RSxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU87cUJBQ3RCLEdBQUcsQ0FBQyxVQUFVLGVBQWUsb0JBQW9CLENBQUM7cUJBQ2xELEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRSxFQUFFLENBQUM7cUJBQy9DLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFWixJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDO1NBQUEsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1DQUFtQyxFQUFFO1lBQzVDLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTs7b0JBQy9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxPQUFPO3lCQUM1QixJQUFJLENBQUMscUJBQXFCLENBQUM7eUJBQzNCLEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRSxFQUFFLENBQUM7eUJBQy9DLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBRTFCLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakMsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0MsV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNuQyxZQUFZLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZDLENBQUM7YUFBQSxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7O29CQUN4RSxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU87eUJBQ3RCLEdBQUcsQ0FBQyxVQUFVLGVBQWUsRUFBRSxDQUFDO3lCQUNoQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3lCQUMvQyxJQUFJLENBQUM7d0JBQ0osS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO3dCQUMxQixRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7d0JBQ2hDLFNBQVMsRUFBRSxhQUFhO3dCQUN4QixRQUFRLEVBQUUsWUFBWTt3QkFDdEIsZUFBZSxFQUFFLENBQUM7cUJBQ25CLENBQUMsQ0FBQztvQkFDTCxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzthQUFBLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3RUFBd0UsRUFBRTs7b0JBQzNFLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTzt5QkFDdEIsR0FBRyxDQUFDLFVBQVUsZUFBZSxFQUFFLENBQUM7eUJBQ2hDLEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRSxFQUFFLENBQUM7eUJBQy9DLElBQUksRUFBRSxDQUFDO29CQUNWLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNqQyxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BDLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3ZDLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbkQsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNqRCxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyRCxJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ2pELENBQUM7YUFBQSxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7O29CQUM5QyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU87eUJBQ3RCLE1BQU0sQ0FBQyxVQUFVLGVBQWUsRUFBRSxDQUFDO3lCQUNuQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsVUFBVSxXQUFXLEVBQUUsRUFBRSxDQUFDO3lCQUMvQyxJQUFJLEVBQUUsQ0FBQztvQkFDVixJQUFBLGFBQU0sRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzthQUFBLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9
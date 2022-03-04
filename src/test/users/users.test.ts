import app from "../../app";
import supertest from "supertest";
import { expect } from "chai";
import shortid from "shortid";
import mongoose from "mongoose";

let firstUserIdTest = ""; // will later hold a value returned by our API
const firstUserBody = {
  email: `marcos.henrique+${shortid.generate()}@toptal.com`,
  password: "Sup3rSecret!23"
};

let accessToken = "";
let refreshToken = "";
const newFirstName = "";
const newFirstName2 = "";
const newLastName2 = "";

describe("users and auth endpoint", function () {
  let request: supertest.SuperAgentTest;

  before(function () {
    request = supertest.agent(app);
  });

  after(function (done) {
    // shut down the Express.js server, close our MongoDB connection, then
    // tell Mocha we're done:
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("Should allow a POST request to /users", async function () {
    const res = await request.post("/users").send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.id).to.be.a("string");
    firstUserIdTest = res.body.id;
  });

  it("Should allow a POST  request to /auth", async function () {
    const res = await request.post("/auth").send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.a("string");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("Should allow a GET request from /user/:userId with an access token", async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body._id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe("With a valid access token", function () {
    it("Should disallow a GET request from /users", async function () {
      const res = await request
        .get("/users")
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();

      expect(res.status).to.equal(403);
    });

    it("Should disallow a PATCH request to /user/:userId", async function () {
      const res = await await request
        .patch(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ firstName: newFirstName });

      expect(res.status).to.equal(403);
    });

    it("should disallow a PUT to /users/:userId with an nonexistent ID", async function () {
      const res = await request
        .put("/users/i-do-not-exist")
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: "Olamide",
          lastName: "Jubril",
          permissionFlags: 285
        });

      expect(res.status).to.equal(404);
    });

    it("should disallow a PUT to /users/:userId trying to change the permission flags", async function () {
      const res = await await request
        .put(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: "Olamide",
          lastName: "Jubril",
          permissionFlags: 285
        });

      expect(res.status).to.equal(403);
      expect(res.body.errors).to.be.an("array");
      expect(res.body.errors).to.have.length(1);
      expect(res.body.errors[0]).to.equal(
        "User cannot change permission flags"
      );
    });

    it("should allow a PUT to /users/:userId/permissionFlags/2 for testing", async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}/permissionFlags/2`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({});

      expect(res.status).to.equal(204);
    });

    // describe("With a new set of permission flag", function () {
    //   it("should allow a POST to /auth/refresh-token", async function () {
    //     const res = await request
    //       .post("/auth/refresh-token")
    //       .set({ Authorization: `Bearer ${accessToken}` })
    //       .send({ refreshToken });

    //     expect(res.status).to.equal(201);
    //     expect(res.body).not.to.be.empty;
    //     expect(res.body).to.an("object");
    //     expect(res.body.accessToken).to.be.a("string");
    //     accessToken = res.body.accessToken;
    //     refreshToken = res.body.refreshToken;
    //   });

    //   it("should allow a PUT to /users/:userId to change first and last names", async function () {
    //     const res = await request
    //       .put(`/users/${firstUserIdTest}`)
    //       .set({ Authorization: `Bearer ${accessToken}` })
    //       .send({
    //         email: firstUserBody.email,
    //         password: firstUserBody.password,
    //         firstName: newFirstName2,
    //         lastName: newLastName2,
    //         permissionFlags: 2,
    //       });

    //     expect(res.status).to.equal(204);
    //   });

    //   it("should allow a GET from /users/:userId and should have a new full name", async function () {
    //     const res = await request
    //       .get(`/users/${firstUserIdTest}`)
    //       .set({ Authorization: `Bearer ${accessToken}` })
    //       .send();
    //     expect(res.status).to.equal(200);
    //     expect(res.body).not.to.be.empty;
    //     expect(res.body).to.be.an("object");
    //     expect(res.body._id).to.be.a("string");
    //     expect(res.body.firstName).to.equal(newFirstName2);
    //     expect(res.body.lastName).to.equal(newLastName2);
    //     expect(res.body.email).to.equal(firstUserBody.email);
    //     expect(res.body._id).to.equal(firstUserIdTest);
    //   });

    //   it("should allow a DELETE from /users/:userId", async function () {
    //     const res = await request
    //       .delete(`/users/${firstUserIdTest}`)
    //       .set({ Authorization: `Bearer ${accessToken}` })
    //       .send();
    //     expect(res.status).to.equal(204);
    //   });
    // });

    describe("with a new set of permission flags", function () {
      it("should allow a POST to /auth/refresh-token", async function () {
        const res = await request
          .post("/auth/refresh-token")
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({ refreshToken });

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body.accessToken).to.be.a("string");

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
      });

      it("should allow a PUT to /users/:userId to change first and last names", async function () {
        const res = await request
          .put(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            email: firstUserBody.email,
            password: firstUserBody.password,
            firstName: newFirstName2,
            lastName: newLastName2,
            permissionFlags: 2
          });
        expect(res.status).to.equal(204);
      });

      it("should allow a GET from /users/:userId and should have a new full name", async function () {
        const res = await request
          .get(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body._id).to.be.a("string");
        expect(res.body.firstName).to.equal(newFirstName2);
        expect(res.body.lastName).to.equal(newLastName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
      });

      it("should allow a DELETE from /users/:userId", async function () {
        const res = await request
          .delete(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(204);
      });
    });
  });
});

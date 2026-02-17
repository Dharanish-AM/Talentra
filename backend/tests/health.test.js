const request = require("supertest");
const app = require("../src/index");
const mongoose = require("mongoose");

describe("Health Check", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "running");
  });
});

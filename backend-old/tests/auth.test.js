const request = require("supertest");
const app = require("../src/index");
const { connect, close, clear } = require("./setup");

beforeAll(async () => await connect());
afterAll(async () => await close());
afterEach(async () => await clear());

describe("Auth Endpoints", () => {
  it("should register a new student", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: "test@student.com",
      password: "password123",
      role: "student",
      phone: "1234567890",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should login a student", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: "test@student.com",
      password: "password123",
      role: "student",
      phone: "1234567890",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@student.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("token");
  });
});

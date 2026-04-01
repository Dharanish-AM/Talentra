const request = require("supertest");
const app = require("../src/index");
const { connect, close, clear } = require("./setup");
const User = require("../src/models/User");

beforeAll(async () => await connect());
afterAll(async () => await close());
afterEach(async () => await clear());

describe("Analytics Endpoints", () => {
  let adminToken;

  beforeEach(async () => {
    // Create Admin
    await User.create({
      name: "Admin User",
      email: "admin@talentra.com",
      password: "password123",
      role: "admin",
    });

    // Login Admin
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@talentra.com",
      password: "password123",
    });
    adminToken = res.body.data.token;
  });

  it("should export analytics data as CSV", async () => {
    const res = await request(app)
      .get("/api/admin/analytics/export")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toContain("text/csv");
    expect(res.header["content-disposition"]).toContain("attachment");
  });
});

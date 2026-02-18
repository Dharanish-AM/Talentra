const request = require("supertest");
const app = require("../src/index");
const { connect, close, clear } = require("./setup");
const Company = require("../src/models/Company");
const User = require("../src/models/User");
const StudentProfile = require("../src/models/StudentProfile");

beforeAll(async () => await connect());
afterAll(async () => await close());
afterEach(async () => await clear());

describe("Recruitment Flow", () => {
  let recruiterToken;
  let studentToken;
  let companyId;
  let driveId;

  beforeEach(async () => {
    // 1. Create Recruiter
    const recruiter = await User.create({
      name: "Recruiter One",
      email: "recruiter@company.com",
      password: "password123",
      role: "recruiter",
    });

    // 2. Create Company
    const company = await Company.create({
      name: "Tech Corp",
      industry: "IT",
      description: "Tech Company",
      createdBy: recruiter._id,
    });

    // 3. Link Recruiter to Company
    recruiter.companyId = company._id;
    await recruiter.save();
    companyId = company._id;

    // 4. Login Recruiter
    const resRec = await request(app).post("/api/auth/login").send({
      email: "recruiter@company.com",
      password: "password123",
    });
    recruiterToken = resRec.body.data.token;

    // 5. Create Student & Login
    const student = await User.create({
      name: "Student One",
      email: "student@test.com",
      password: "password123",
      role: "student",
    });

    const resStud = await request(app).post("/api/auth/login").send({
      email: "student@test.com",
      password: "password123",
    });
    studentToken = resStud.body.data.token;

    // 6. Create Student Profile
    await StudentProfile.create({
      userId: student._id,
      department: "Computer Science",
      cgpa: 8.5,
      backlogs: 0,
      phone: "1234567890",
      graduationYear: 2024,
    });
  });

  it("should allow recruiter to post a job", async () => {
    const res = await request(app)
      .post("/api/recruiter/drives")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        title: "Software Engineer",
        description: "Development role for SDE",
        role: "SDE",
        package: "10 LPA",
        location: "Bangalore",
        eligibility: {
          minCgpa: 7,
          allowedDepartments: ["Computer Science"],
          maxBacklogs: 0,
        },
        deadline: new Date(Date.now() + 86400000),
        driveDate: new Date(Date.now() + 172800000),
        companyId: companyId.toString(),
      });

    if (res.statusCode !== 201)
      console.log("Drive creation failed:", JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.drive).toHaveProperty("title", "Software Engineer");
    expect(res.body.data.drive).toHaveProperty(
      "companyId",
      companyId.toString(),
    );
  });

  it("should allow student to apply for a drive", async () => {
    // Create drive first
    const driveRes = await request(app)
      .post("/api/recruiter/drives")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        title: "Software Engineer",
        description: "Development role for SDE",
        role: "SDE",
        package: "10 LPA",
        location: "Bangalore",
        eligibility: {
          minCgpa: 7,
          allowedDepartments: ["Computer Science"],
          maxBacklogs: 0,
        },
        deadline: new Date(Date.now() + 86400000),
        driveDate: new Date(Date.now() + 172800000),
        companyId: companyId,
      });

    const createdDriveId = driveRes.body.data?.drive?._id;

    // Apply
    const res = await request(app)
      .post(`/api/student/drives/${createdDriveId}/apply`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.application).toHaveProperty("status", "applied");
  });
});

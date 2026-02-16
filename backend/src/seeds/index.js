require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const logger = require("../config/logger");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Company = require("../models/Company");
const JobDrive = require("../models/JobDrive");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

const seedData = async () => {
  try {
    await connectDB();

    logger.info("Clearing existing data...");
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Company.deleteMany({});
    await JobDrive.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});

    logger.info("Creating users...");
    const users = await User.create([
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@university.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Priya Patel",
        email: "priya.patel@university.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Dr. Meera Iyer",
        email: "admin@placements.edu",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Arjun Reddy",
        email: "recruiter@techcorp.com",
        password: "recruiter123",
        role: "recruiter",
      },
    ]);

    logger.info("Creating student profiles...");
    await StudentProfile.create([
      {
        userId: users[0]._id,
        department: "Computer Science",
        cgpa: 8.7,
        backlogs: 0,
        phone: "+91 98765 43210",
        graduationYear: 2025,
        skills: ["React", "Node.js", "Python", "SQL"],
      },
      {
        userId: users[1]._id,
        department: "Electronics",
        cgpa: 7.9,
        backlogs: 1,
        phone: "+91 98765 43211",
        graduationYear: 2025,
        skills: ["VLSI", "Embedded C", "MATLAB"],
      },
    ]);

    logger.info("Creating companies...");
    const companies = await Company.create([
      {
        name: "TechCorp Solutions",
        industry: "IT Services",
        description:
          "Leading IT consulting and services company with global presence.",
        website: "https://techcorp.example.com",
        createdBy: users[2]._id,
      },
      {
        name: "InnovateLabs",
        industry: "Product Development",
        description:
          "AI-first product company building next-gen SaaS solutions.",
        website: "https://innovatelabs.example.com",
        createdBy: users[2]._id,
      },
      {
        name: "FinServe Global",
        industry: "Financial Technology",
        description:
          "Fintech company transforming digital payments across Asia.",
        website: "https://finserve.example.com",
        createdBy: users[2]._id,
      },
      {
        name: "GreenTech Energy",
        industry: "Clean Energy",
        description:
          "Renewable energy solutions and smart grid technology provider.",
        website: "https://greentech.example.com",
        createdBy: users[2]._id,
      },
    ]);

    logger.info("Creating job drives...");
    const drives = await JobDrive.create([
      {
        companyId: companies[0]._id,
        companyName: companies[0].name,
        title: "Software Engineer Campus 2025",
        role: "Software Engineer",
        description:
          "Full-stack development role working on enterprise applications.",
        package: "₹12 LPA",
        location: "Bangalore",
        eligibility: {
          minCgpa: 7.0,
          allowedDepartments: ["Computer Science", "IT", "Electronics"],
          maxBacklogs: 0,
        },
        deadline: new Date("2025-03-15"),
        driveDate: new Date("2025-03-25"),
        status: "active",
        createdBy: users[2]._id,
      },
      {
        companyId: companies[1]._id,
        companyName: companies[1].name,
        title: "ML Engineer Intern",
        role: "ML Engineer",
        description: "Research and implement ML models for production systems.",
        package: "₹18 LPA",
        location: "Hyderabad",
        eligibility: {
          minCgpa: 8.0,
          allowedDepartments: ["Computer Science", "AI/ML"],
          maxBacklogs: 0,
        },
        deadline: new Date("2025-03-10"),
        driveDate: new Date("2025-03-20"),
        status: "active",
        createdBy: users[2]._id,
      },
      {
        companyId: companies[2]._id,
        companyName: companies[2].name,
        title: "Business Analyst",
        role: "Business Analyst",
        description:
          "Analyze financial data and derive insights for product strategy.",
        package: "₹10 LPA",
        location: "Mumbai",
        eligibility: {
          minCgpa: 6.5,
          allowedDepartments: [
            "Computer Science",
            "IT",
            "Electronics",
            "Mechanical",
          ],
          maxBacklogs: 1,
        },
        deadline: new Date("2025-04-01"),
        driveDate: new Date("2025-04-10"),
        status: "upcoming",
        createdBy: users[2]._id,
      },
      {
        companyId: companies[3]._id,
        companyName: companies[3].name,
        title: "Embedded Systems Engineer",
        role: "Embedded Engineer",
        description: "Design and develop firmware for smart grid controllers.",
        package: "₹9 LPA",
        location: "Pune",
        eligibility: {
          minCgpa: 7.0,
          allowedDepartments: ["Electronics", "Electrical"],
          maxBacklogs: 0,
        },
        deadline: new Date("2025-02-28"),
        driveDate: new Date("2025-03-05"),
        status: "completed",
        createdBy: users[2]._id,
      },
    ]);

    logger.info("Creating applications...");
    const applications = await Application.create([
      {
        studentId: users[0]._id,
        studentName: users[0].name,
        driveId: drives[0]._id,
        driveName: drives[0].title,
        companyName: drives[0].companyName,
        status: "shortlisted",
        appliedAt: new Date("2025-02-20"),
      },
      {
        studentId: users[0]._id,
        studentName: users[0].name,
        driveId: drives[1]._id,
        driveName: drives[1].title,
        companyName: drives[1].companyName,
        status: "applied",
        appliedAt: new Date("2025-02-25"),
      },
      {
        studentId: users[1]._id,
        studentName: users[1].name,
        driveId: drives[0]._id,
        driveName: drives[0].title,
        companyName: drives[0].companyName,
        status: "interview",
        appliedAt: new Date("2025-02-18"),
      },
      {
        studentId: users[1]._id,
        studentName: users[1].name,
        driveId: drives[2]._id,
        driveName: drives[2].title,
        companyName: drives[2].companyName,
        status: "applied",
        appliedAt: new Date("2025-03-01"),
      },
    ]);

    logger.info("Creating interviews...");
    await Interview.create([
      {
        driveId: drives[0]._id,
        studentId: users[1]._id,
        studentName: users[1].name,
        date: "2025-03-25",
        time: "10:00 AM",
        mode: "online",
        link: "https://meet.example.com/interview-1",
        result: "pending",
      },
      {
        driveId: drives[0]._id,
        studentId: users[0]._id,
        studentName: users[0].name,
        date: "2025-03-25",
        time: "11:30 AM",
        mode: "online",
        link: "https://meet.example.com/interview-2",
        result: "pending",
      },
    ]);

    logger.info("✅ Database seeded successfully!");
    logger.info("\nTest Credentials:");
    logger.info("Student 1: rahul.sharma@university.edu / password123");
    logger.info("Student 2: priya.patel@university.edu / password123");
    logger.info("Admin: admin@placements.edu / admin123");
    logger.info("Recruiter: recruiter@techcorp.com / recruiter123");

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();

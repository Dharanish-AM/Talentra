require("dotenv").config();
const connectDB = require("../config/database");
const logger = require("../config/logger");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Company = require("../models/Company");
const JobDrive = require("../models/JobDrive");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// Helper functions
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- REALISTIC DATA SETS ---

const departments = [
  "Computer Science",
  "IT",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "AI/ML",
  "Chemical",
  "Chemical",
];

const technicalSkills = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Analysis",
  "Figma",
  "SQL",
  "MongoDB",
  "Express",
  "TypeScript",
  "Go",
  "Rust",
  "Flutter",
  "Spring Boot",
  "TensorFlow",
  "PyTorch",
];

// Indian specific names for realism
const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayaan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharva",
  "Dhruv",
  "Rohan",
  "Kabir",
  "Aryan",
  "Siddharth",
  "Ananya",
  "Diya",
  "Saanvi",
  "Aadhya",
  "Pari",
  "Kiara",
  "Myra",
  "Sarah",
  "Riya",
  "Anvi",
  "Aarya",
  "Kyra",
  "Shanaya",
  "Nisha",
  "Kavya",
  "Mira",
  "Sneha",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Gupta",
  "Malhotra",
  "Bhatia",
  "Saxena",
  "Mehta",
  "Chopra",
  "Singh",
  "Das",
  "Patel",
  "Reddy",
  "Nair",
  "Iyer",
  "Rao",
  "Kumar",
  "Mishra",
  "Joshi",
  "Desai",
  "Yadav",
  "Kulkarni",
  "Reddy",
  "Menon",
  "Banerjee",
];

const companyData = [
  {
    name: "TechCorp Solutions",
    industry: "IT Services",
    description:
      "A global leader in IT services and consulting, helping clients navigate their digital transformation journeys with AI-driven solutions.",
    website: "https://techcorp.example.com",
  },
  {
    name: "InnovateLabs",
    industry: "Product Development",
    description:
      "A fast-paced product company building next-generation SaaS platforms for the creator economy, backed by top-tier VCs.",
    website: "https://innovatelabs.example.com",
  },
  {
    name: "FinServe Global",
    industry: "Financial Technology",
    description:
      "Fintech giant revolutionizing digital payments and banking infrastructure across Asia and Africa.",
    website: "https://finserve.example.com",
  },
  {
    name: "GreenTech Energy",
    industry: "Clean Energy",
    description:
      "Pioneering sustainable energy solutions with smart grid technology and renewable power generation systems.",
    website: "https://greentech.example.com",
  },
  {
    name: "HealthPlus AI",
    industry: "Healthcare Tech",
    description:
      "Leveraging artificial intelligence to improve diagnostic accuracy and patient outcomes in hospitals worldwide.",
    website: "https://healthplus.example.com",
  },
  {
    name: "UrbanMobility",
    industry: "Automotive & EV",
    description:
      "Designing the future of urban transportation with autonomous electric vehicles and smart charging networks.",
    website: "https://urbanmobility.example.com",
  },
  {
    name: "CyberShield Systems",
    industry: "Cybersecurity",
    description:
      "Providing enterprise-grade security solutions to protect critical infrastructure from advanced cyber threats.",
    website: "https://cybershield.example.com",
  },
  {
    name: "EduVerse",
    industry: "EdTech",
    description:
      "Democratizing education through immersive VR/AR learning experiences and personalized AI tutors.",
    website: "https://eduverse.example.com",
  },
  {
    name: "CloudScale Infra",
    industry: "Cloud Computing",
    description:
      "Building resilient and scalable cloud infrastructure services for high-growth enterprises.",
    website: "https://cloudscale.example.com",
  },
  {
    name: "MediaStream",
    industry: "Media & Entertainment",
    description:
      "Top-tier streaming platform delivering 4K HDR content to millions of subscribers globally.",
    website: "https://mediastream.example.com",
  },
];

const jobRoles = [
  {
    title: "Software Development Engineer - I",
    role: "Software Engineer",
    description:
      "Join our core engineering team to build scalable backend services. You will work with Node.js, Microservices, and High-scale databases.",
    packageRange: [12, 18],
    eligibility: {
      depts: ["Computer Science", "IT"],
      minCgpa: 8.0,
    },
  },
  {
    title: "Frontend Engineer",
    role: "Frontend Developer",
    description:
      "Create stunning user interfaces using React and TypeScript. Focus on performance, accessibility, and responsive design.",
    packageRange: [10, 16],
    eligibility: {
      depts: ["Computer Science", "IT", "Electronics"],
      minCgpa: 7.5,
    },
  },
  {
    title: "Data Scientist",
    role: "Data Scientist",
    description:
      "Analyze large datasets to derive actionable insights. Expertise in Python, SQL, and Machine Learning algorithms required.",
    packageRange: [14, 22],
    eligibility: {
      depts: ["Computer Science", "AI/ML"],
      minCgpa: 8.5,
    },
  },
  {
    title: "DevOps Engineer",
    role: "DevOps Engineer",
    description:
      "Automate deployment pipelines and manage cloud infrastructure on AWS/Azure. Knowledge of Docker and Kubernetes is a must.",
    packageRange: [11, 17],
    eligibility: {
      depts: ["Computer Science", "IT", "Electronics"],
      minCgpa: 7.0,
    },
  },
  {
    title: "Embedded Systems Engineer",
    role: "Embedded Engineer",
    description:
      "Design and implement firmware for IoT devices. Strong command over C/C++ and microcontroller architecture needed.",
    packageRange: [9, 15],
    eligibility: {
      depts: ["Electronics", "Electrical"],
      minCgpa: 7.0,
    },
  },
  {
    title: "Business Analyst",
    role: "Business Analyst",
    description:
      "Bridge the gap between business requirements and technical solutions. Strong analytical and communication skills required.",
    packageRange: [8, 14],
    eligibility: {
      depts: ["Computer Science", "IT", "Mechanical", "Civil"],
      minCgpa: 6.5,
    },
  },
  {
    title: "Product Management Intern",
    role: "Product Manager",
    description:
      "Work with cross-functional teams to define product strategy and roadmap. Passion for user experience is key.",
    packageRange: [10, 15],
    eligibility: {
      depts: ["Computer Science", "IT", "AI/ML"],
      minCgpa: 7.5,
    },
  },
];

const locations = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Gurgaon",
  "Mumbai",
  "Noida",
  "Chennai",
  "Remote",
];

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

    // --- USERS ---
    logger.info("Creating base users...");
    const baseUsers = await User.create([
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

    const adminUser = baseUsers.find((u) => u.role === "admin");

    logger.info("Generating additional students...");
    const extraStudents = [];
    for (let i = 0; i < 28; i++) {
      // Increased count slightly
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      // Clean email generation
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 99)}@university.edu`;

      extraStudents.push({
        name,
        email,
        password: "password123",
        role: "student",
      });
    }
    const createdExtraStudents = await User.create(extraStudents);
    const allStudents = [baseUsers[0], baseUsers[1], ...createdExtraStudents];

    // --- PROFILES ---
    logger.info("Creating student profiles...");
    const studentProfiles = [];
    for (const student of allStudents) {
      const numSkills = getRandomInt(4, 10);
      const studentSkills = [];
      while (studentSkills.length < numSkills) {
        const skill = getRandomElement(technicalSkills);
        if (!studentSkills.includes(skill)) studentSkills.push(skill);
      }

      // Consistent profile for base users
      let dept = getRandomElement(departments);
      let cgpa = parseFloat((Math.random() * (9.8 - 6.5) + 6.5).toFixed(2));

      if (student.email === "rahul.sharma@university.edu") {
        dept = "Computer Science";
        cgpa = 8.9;
      } else if (student.email === "priya.patel@university.edu") {
        dept = "Electronics";
        cgpa = 9.2;
      }

      studentProfiles.push({
        userId: student._id,
        department: dept,
        cgpa: cgpa,
        backlogs: Math.random() > 0.85 ? getRandomInt(1, 2) : 0,
        phone: `+91 ${getRandomInt(60000, 99999)} ${getRandomInt(10000, 99999)}`,
        graduationYear: 2025,
        skills: studentSkills,
      });
    }
    await StudentProfile.create(studentProfiles);

    // --- COMPANIES ---
    logger.info("Creating companies...");
    const companiesWithType = companyData.map((c) => ({
      ...c,
      createdBy: adminUser._id,
    }));
    const companies = await Company.create(companiesWithType);

    // --- JOB DRIVES ---
    logger.info("Creating job drives...");
    const drivesData = [];

    // Create at least 2 drives for each company
    for (const company of companies) {
      const numDrives = getRandomInt(2, 3);

      for (let i = 0; i < numDrives; i++) {
        const job = getRandomElement(jobRoles);
        const isPast = Math.random() > 0.6; // 60% chance of past/completed drives

        const driveDate = isPast
          ? getRandomDate(new Date("2024-11-01"), new Date("2025-02-10"))
          : getRandomDate(new Date("2025-02-25"), new Date("2025-05-30"));

        const deadline = new Date(driveDate);
        deadline.setDate(driveDate.getDate() - getRandomInt(7, 14)); // Deadline 1-2 weeks before drive

        const status = isPast
          ? "completed"
          : Math.random() > 0.4
            ? "active"
            : "upcoming";
        const pkg = getRandomInt(job.packageRange[0], job.packageRange[1]);

        drivesData.push({
          companyId: company._id,
          companyName: company.name,
          title: job.title,
          role: job.role,
          description: job.description,
          package: `₹${pkg} LPA`,
          location: getRandomElement(locations),
          eligibility: {
            minCgpa: job.eligibility.minCgpa,
            allowedDepartments: job.eligibility.depts,
            maxBacklogs: i % 2 === 0 ? 0 : 1, // Occasional backlog allowance
          },
          deadline: deadline,
          driveDate: driveDate,
          status: status,
          createdBy: adminUser._id,
        });
      }
    }
    const drives = await JobDrive.create(drivesData);

    // --- APPLICATIONS ---
    logger.info("Creating applications...");
    const applicationsData = [];
    const applicationStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
      "offer",
    ];

    for (const drive of drives) {
      // Filter students who are eligible (simple check on department)
      const eligibleStudents = allStudents.filter((s) => {
        // Need to find their profile, but for simplicity in seeding, we'll just pick random subset
        // In a real app, strict eligibility check happens. Here we just want data.
        return Math.random() > 0.7; // 30% of students apply
      });

      for (const student of eligibleStudents) {
        // Prevent random duplicates
        if (
          applicationsData.some(
            (a) => a.studentId === student._id && a.driveId === drive._id,
          )
        )
          continue;

        const status = getRandomElement(applicationStatuses);
        const appliedAt = new Date(drive.deadline);
        appliedAt.setDate(appliedAt.getDate() - getRandomInt(1, 10));

        applicationsData.push({
          studentId: student._id,
          studentName: student.name,
          driveId: drive._id,
          driveName: drive.title,
          companyName: drive.companyName,
          status: status,
          appliedAt: appliedAt,
        });
      }
    }

    // Ensure Rahul (Student 1) has specific relevant data
    const rahul = baseUsers[0];
    const techCorp = companies.find((c) => c.name === "TechCorp Solutions");
    const techDrive = drives.find(
      (d) => d.companyId.equals(techCorp?._id) && d.status === "active",
    );

    if (techDrive) {
      // Check if already applied
      const existingAppIndex = applicationsData.findIndex(
        (a) => a.studentId === rahul._id && a.driveId === techDrive._id,
      );
      if (existingAppIndex !== -1) {
        applicationsData[existingAppIndex].status = "shortlisted";
      } else {
        applicationsData.push({
          studentId: rahul._id,
          studentName: rahul.name,
          driveId: techDrive._id,
          driveName: techDrive.title,
          companyName: techDrive.companyName,
          status: "shortlisted",
          appliedAt: new Date(),
        });
      }
    }

    const createdApplications = await Application.create(applicationsData);

    // --- INTERVIEWS ---
    logger.info("Creating interviews...");
    const interviewsData = [];

    const interviewEligibleApps = createdApplications.filter((app) =>
      ["shortlisted", "interview", "selected", "offer"].includes(app.status),
    );

    for (const app of interviewEligibleApps) {
      if (Math.random() > 0.5) {
        const drive = drives.find((d) => d._id.equals(app.driveId));
        const interviewDate = new Date(drive.driveDate);
        interviewDate.setDate(interviewDate.getDate() + getRandomInt(1, 5));

        interviewsData.push({
          driveId: app.driveId,
          studentId: app.studentId,
          studentName: app.studentName,
          date: interviewDate.toISOString().split("T")[0], // YYYY-MM-DD
          time: `${getRandomInt(9, 17)}:${getRandomInt(0, 1) === 0 ? "00" : "30"}`,
          mode: getRandomElement(["online", "offline"]),
          link: "https://meet.google.com/abc-defg-" + getRandomInt(100, 999),
          result:
            app.status === "rejected"
              ? "rejected"
              : app.status === "selected" || app.status === "offer"
                ? "selected"
                : "pending",
        });
      }
    }

    await Interview.create(interviewsData);

    logger.info("✅ Database seeded with HIGH QUALITY data successfully!");
    logger.info("------------------------------------------------");
    logger.info(`Generated:`);
    logger.info(`- Users: ${allStudents.length}`);
    logger.info(`- Companies: ${companies.length}`);
    logger.info(`- Job Drives: ${drives.length}`);
    logger.info(`- Applications: ${createdApplications.length}`);
    logger.info(`- Interviews: ${interviewsData.length}`);
    logger.info("------------------------------------------------");

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedData();

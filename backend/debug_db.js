const mongoose = require("mongoose");
const Company = require("./src/models/Company");
const JobDrive = require("./src/models/JobDrive");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/talentra")
  .then(async () => {
    console.log("Connected to MongoDB");

    console.log("\n--- Companies ---");
    const companies = await Company.find({});
    console.log(JSON.stringify(companies, null, 2));

    console.log("\n--- Job Drives ---");
    const drives = await JobDrive.find({});
    console.log(JSON.stringify(drives, null, 2));

    // Check relationship
    if (drives.length > 0 && companies.length > 0) {
      console.log("\n--- Relationship Check ---");
      drives.forEach((drive) => {
        console.log(`Drive: ${drive.title} (${drive._id})`);
        console.log(
          `  - companyId in Drive: ${drive.companyId} (Type: ${typeof drive.companyId})`,
        );

        const linkedCompany = companies.find(
          (c) => c._id.toString() === drive.companyId.toString(),
        );
        console.log(`  - Direct Match Found: ${!!linkedCompany}`);
      });
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

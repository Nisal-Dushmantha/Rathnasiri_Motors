const mongoose = require("mongoose");
require("dotenv").config();
const Insurance = require("./Model/InsuranceModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Set reminderSent and expiredEmailSent to false for all documents where they don't exist
    const result = await Insurance.updateMany(
      {
        $or: [
          { reminderSent: { $exists: false } },
          { expiredEmailSent: { $exists: false } },
        ],
      },
      {
        $set: { reminderSent: false, expiredEmailSent: false },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} insurance records`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

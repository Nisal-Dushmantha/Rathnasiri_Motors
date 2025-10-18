require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Insurance = require("./Model/InsuranceModel");

// 1️⃣ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB for Email reminders"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// 2️⃣ Setup email transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 3️⃣ Function to check and send reminders
async function checkAndSendReminders() {
  console.log("🔍 Checking for expiring or expired insurances...");

  // Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // Find insurances expiring today or earlier and not yet emailed
    const insurances = await Insurance.find({
      $expr: {
        $lte: [
          { $dateToString: { format: "%Y-%m-%d", date: "$EndDate" } },
          todayStr,
        ],
      },
      $or: [{ reminderSent: false }, { expiredEmailSent: false }],
    });

    if (insurances.length === 0) {
      console.log("📅 No expiring or expired insurances found.");
      return;
    }

    console.log(`📋 Found ${insurances.length} insurances to notify.`);

    for (const ins of insurances) {
      const endDate = new Date(ins.EndDate);
      const expired = endDate.toISOString().split("T")[0] < todayStr;

      const subject = expired
        ? "⚠️ Insurance Expired Notice"
        : "⏰ Insurance Expiry Reminder";

      const textMessage = `
Dear ${ins.fullname},

Your vehicle insurance for registration number ${ins.RegistrationNo} ${
        expired ? "has already expired" : "will expire today"
      } on ${endDate.toDateString()}.

Please ${expired ? "renew it immediately" : "renew it soon"} to avoid any inconvenience.

Thank you,
Rathnasiri Motors
`;

      const htmlMessage = `
<p>Dear ${ins.fullname},</p>
<p>Your vehicle insurance for registration number <b>${ins.RegistrationNo}</b> ${
        expired ? "has already expired" : "will expire today"
      } on <b>${endDate.toDateString()}</b>.</p>
<p>Please <b>${expired ? "renew it immediately" : "renew it soon"}</b> to avoid any inconvenience.</p>
<p>Thank you,<br>Rathnasiri Motors</p>
`;

      await transporter.sendMail({
        from: `"Rathnasiri Motors" <${process.env.EMAIL_USER}>`,
        to: ins.Email,
        subject,
        text: textMessage,
        html: htmlMessage,
      });

      // Mark as sent
      if (expired) {
        ins.expiredEmailSent = true;
      } else {
        ins.reminderSent = true;
      }
      await ins.save();

      console.log(`✅ Email sent to ${ins.fullname} (${ins.Email})`);
    }
  } catch (err) {
    console.error("❌ Error sending email reminders:", err);
  }
}

// 4️⃣ Run first check immediately
checkAndSendReminders();

// 5️⃣ Schedule daily job at 8 AM
cron.schedule("0 8 * * *", checkAndSendReminders);

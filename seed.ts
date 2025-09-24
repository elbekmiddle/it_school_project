// seed.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1. User modeli
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "instructor"], default: "instructor" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// 2. MongoDB ulanish
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nextauth-demo";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB ulandi");

    // Eski userlarni o‘chiramiz
    await User.deleteMany({});
    console.log("🗑️ Eski userlar o‘chirildi");

    // Parollarni hash qilish
    const adminPassword = await bcrypt.hash("admin123", 10);
    const instructorPassword = await bcrypt.hash("instructor123", 10);

    // Demo userlar
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "Instructor User",
        email: "instructor@example.com",
        password: instructorPassword,
        role: "instructor",
      },
    ];

    await User.insertMany(users);
    console.log("🎉 Demo userlar qo‘shildi");
    console.log(users);

    process.exit();
  } catch (err) {
    console.error("❌ Xatolik:", err);
    process.exit(1);
  }
}

seed();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Users from "../models/userModel";
import connectDB from "../config/db";
import { IUserPermissions } from "../models/userModel";

dotenv.config();

/* ---------------- DEFAULT PERMISSIONS ---------------- */

const DEFAULT_PERMISSIONS: IUserPermissions = {
  overview: { view: true },
  projects: { view: true, create: true, update: true, delete: true },
  milestones: { view: true, create: true, update: true, delete: true },
  submilestones: { view: true, create: true, update: true, delete: true },
  delay: { view: true, create: true, update: true, delete: true },
  clients: { view: true, create: true, update: true },
  activity: { view: true },
  users: { view: true, create: true, update: true },
  admin: { view: true },
};

/* ---------------- SEED FUNCTION ---------------- */

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("DB Connected");

    /* ---------------- ADMIN (ONLY ONE) ---------------- */
    const adminExists = await Users.findOne({ role: "admin", status: "Y" });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash("Admin@123", 10);

      await Users.create({
        name: "Admin One",
        email: "admin@projecttracker.com",
        password: adminPassword,
        role: "admin",
        status: "Y",
        permissions: DEFAULT_PERMISSIONS,
      });

      console.log("Admin user created");
    } else {
      console.log("Admin already exists, skipping...");
    }

    /* ---------------- CLIENT USER ---------------- */
    const clientPassword = await bcrypt.hash("Client@123", 10);

    await Users.create({
      name: "Client Alpha",
      email: "client@projecttracker.com",
      password: clientPassword,
      role: "client",
      status: "Y",
      permissions: {
        overview: { view: true },
        projects: { view: true, create: false, update: false, delete: false },
        milestones: { view: true, create: false, update: false, delete: false },
        submilestones: { view: true, create: false, update: false, delete: false },
        delay: { view: true, create: false, update: false, delete: false },
        clients: { view: false, create: false, update: false },
        activity: { view: true },
        users: { view: false, create: false, update: false },
        admin: { view: false },
      },
    });

    console.log("Client user created");

    /* ---------------- NORMAL USER ---------------- */
    const teamPassword = await bcrypt.hash("User@123", 10);

    await Users.create({
      name: "Team Beta",
      email: "team@projecttracker.com",
      password: teamPassword,
      role: "team",
      status: "Y",
      permissions: {
        overview: { view: true },
        projects: { view: true, create: true, update: true, delete: false },
        milestones: { view: true, create: true, update: true, delete: false },
        submilestones: { view: true, create: true, update: true, delete: false },
        delay: { view: false, create: false, update: false, delete: false },
        clients: { view: false, create: false, update: false },
        activity: { view: true },
        users: { view: false, create: false, update: false },
        admin: { view: false },
      },
    });

    console.log("Normal user created");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

seedUsers();

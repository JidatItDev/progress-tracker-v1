import { MongoClient, Db } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let db: Db;

// const uri = "mongodb+srv://jidatemailtester_db_user:optipleX360@database.9ebxnkc.mongodb.net/"

export default async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGO_URI
    await mongoose.connect(uri);
    console.log("MongoDB Connected (Mongoose)");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
}
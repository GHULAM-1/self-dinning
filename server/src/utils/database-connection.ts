import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI; 
  if (!mongoURI) {
    throw new Error("⚠️ MongoDB URI not provided in .env file.");
  }

  try {
    await mongoose.connect(mongoURI);

    console.log("✅ Connected to MongoDB successfully.");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default databaseConnection;
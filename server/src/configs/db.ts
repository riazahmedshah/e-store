import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/estore",{
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:5000,
      family: 4
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
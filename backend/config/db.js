import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database connected ⚡⚡`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
  }
};

export default dbConnect;

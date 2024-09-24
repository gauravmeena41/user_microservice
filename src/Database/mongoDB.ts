import mongoose from "mongoose";

// Create a function to connect with mongoDB
export const connectToMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB connection already exists");
      return;
    }

    const { MONGO_HOST, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE } =
      process.env;

    await mongoose.connect(
      `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
};

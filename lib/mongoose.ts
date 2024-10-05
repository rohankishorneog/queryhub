import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MIssing Mongob url");
  }
  if (isConnected) {
    return console.log("MongoDb is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "DevOverflow",
    });

    isConnected = true;
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Mongodb connection failed", error);
  }
};

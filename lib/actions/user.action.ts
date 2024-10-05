"use server";

import userModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params:{userId:string}) {
  try {
    connectToDatabase();
    const { userId } = params;
    console.log(userId);

    const user = await userModel.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

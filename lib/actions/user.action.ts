"use server";

import userModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import questionModel from "@/database/question.model";
import { User } from "lucide-react";

export async function getUserById(params: { userId: string }) {
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

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await userModel.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = userData;

    const newUser = await userModel.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DeleteQuestionParamsUser(userData: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = userData;

    const user = await userModel.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    const userQuestionsIds = await questionModel
      .find({ author: clerkId })
      .distinct("_id");

    await questionModel.deleteMany({ author: user._id });
    //delete answers as welll

    const deletedUser = await userModel.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

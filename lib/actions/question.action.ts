"use server";

import questionModel from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import tagModel from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import userModel from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await questionModel
      .find({})
      .populate({ path: "tags", model: tagModel })
      .populate({ path: "author", model: userModel })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { title, explanation, tags, author, path } = params;

    // Creating the question
    const question = await questionModel.create({
      title,
      explanation,
      author,
      path,
    });

    const tagDocuments: any[] = [];

    // Loop through the tags and either find existing tags or create new ones
    for (const tag of tags) {
      // Create a regular expression for the tag name (case-insensitive)
      const regex = new RegExp(tag, "i");

      const existingTag = await tagModel.findOneAndUpdate(
        { name: regex }, // Find tag by name using regex
        { $setOnInsert: { name: tag }, $push: { question: question._id } }, // Add the question ID to the tag's `questions` field
        { new: true, upsert: true } // Create the tag if it doesn't exist (upsert: true)
      );

      // Collect the tag document
      tagDocuments.push(existingTag._id);
    }

    // Update the question with the tag references
    await questionModel.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error("Error creating question:", error);
    return {
      success: false,
      error: "Failed to create the question",
    };
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await questionModel
      .findById(questionId)
      .populate({ path: "tags", model: tagModel, select: "id name" })
      .populate({
        path: "author",
        model: userModel,
        select: "id clerkId name picture",
      });

    return  question ;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

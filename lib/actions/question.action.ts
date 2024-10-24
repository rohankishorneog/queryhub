"use server";

import questionModel, { IQuestion } from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import tagModel from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import userModel from "@/database/user.model";
import { revalidatePath } from "next/cache";
import interactionModel from "@/database/interaction.model";
import { redirect } from "next/navigation";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof questionModel> = {};
    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
          explanation: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await questionModel
      .find(query)
      .populate({ path: "tags", model: tagModel })
      .populate({ path: "author", model: userModel })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await questionModel.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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
        { $setOnInsert: { name: tag }, $push: { questions: question._id } }, // Add the question ID to the tag's `questions` field
        { new: true, upsert: true } // Create the tag if it doesn't exist (upsert: true)
      );

      // Collect the tag document
      tagDocuments.push(existingTag._id);
    }

    // Update the question with the tag references
    await questionModel.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await interactionModel.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    await userModel.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
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

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await questionModel.findByIdAndUpdate(
      questionId,
      updateQuery,
      {
        new: true,
      }
    );

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
    await userModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question
    await userModel.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await questionModel.findByIdAndUpdate(
      questionId,
      updateQuery,
      {
        new: true,
      }
    );

    if (!question) {
      throw new Error("Question not found");
    }

    // decrease author's reputation
    await userModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await userModel.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    const question = await questionModel.findById({ _id: questionId });

    if (!question) {
      throw new Error("Question not found");
    }

    await questionModel.deleteOne({ _id: questionId });

    await Answer.deleteMany({ question: questionId });

    await interactionModel.deleteMany({ question: questionId });

    await tagModel.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    await userModel.findByIdAndUpdate(question.author, {
      $inc: { reputation: -10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, explanation, path } = params;

    const question = await questionModel.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.explanation = explanation;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await questionModel
      .find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await userModel.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await interactionModel
      .find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof questionModel> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await questionModel.countDocuments(query);

    const recommendedQuestions = await questionModel
      .find(query)
      .populate({
        path: "tags",
        model: tagModel,
      })
      .populate({
        path: "author",
        model: userModel,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}

"use server";

import userModel from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    //findinteractions for the user and group by tags

    return [
      { id: "1", name: "tag1" },
      { id: "2", name: "tag2" },
      ,
      { id: "3", name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function name(params: type) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

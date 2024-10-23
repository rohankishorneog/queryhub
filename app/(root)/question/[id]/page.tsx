import { URLProps } from "@/app/types";
import Answer from "@/components/forms/answer/Answer";
import RenderTag from "@/components/shared/RenderTag/RenderTag";
import AllAnswers from "@/components/shared/allAnswers/AllAnswers";
import Matrix from "@/components/shared/matrix/Matrix";
import ParseHtml from "@/components/shared/parseHtml/ParseHtml";
import Votes from "@/components/shared/votes/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { mongo } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionById({ questionId: params.id });

  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  console.log(mongoUser, "user");

  return (
    <>
      <div className="flex-start w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="profile pic"
              width={22}
              height={22}
              className="rounded-full"
            />
            {
              <p className="paragraph-semibold text-dark300_light700">
                {result.author.name}
              </p>
            }
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result.upvotes.length}
              downvotes={result.downvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser?._id)}
              hasdownVoted={result.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>

        <div className="mt-5 mb-8 flex flex-wrap gap-4 justify-start">
          <Matrix
            alt="clock icon"
            imgUrl="/assets/icons/clock.svg"
            values={` asked ${getTimeStamp(result.createdAt)}`}
            title="Asked"
            textStyles="small-medium text-dark400_light800"
            href=""
          />
          <Matrix
            alt="message"
            imgUrl="/assets/icons/message.svg"
            values={result.answers.length}
            title="message"
            textStyles="small-medium text-dark400_light800"
            href=""
          />
          <Matrix
            alt="views"
            imgUrl="/assets/icons/eye.svg"
            values={result.views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
            href=""
          />
        </div>
      </div>

      <ParseHtml data={result.explanation} />

      <div className="flex flexd-wrap gap-3 mt-8">
        {result.tags.map((tag) => (
          <RenderTag
            key={tag.id}
            id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        questionId={result._id}
        clerkId={clerkId}
        userId={mongoUser?._id}
        totalAnswers={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
        question={result.explanation}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default page;

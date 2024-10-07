import Matrix from "@/components/shared/matrix/Matrix";
import ParseHtml from "@/components/shared/parseHtml/ParseHtml";
import { getQuestionById } from "@/lib/actions/question.action";
import { getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params, searchParams }) => {
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-fullflex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
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
          <div className="flex justify-end">Voting</div>
          <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
            {result.title}
          </h2>
        </div>

        <div className="mt-5 mb-8 flex flex-wrap gap-4">
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

      <ParseHtml data={result.content} />
    </>
  );
};

export default page;

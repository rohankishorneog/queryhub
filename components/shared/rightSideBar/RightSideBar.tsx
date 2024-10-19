import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag/RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";

const popularTags = [
  { id: 1, tag: "JavaScript", questions: 120 },
  { id: 2, tag: "React", questions: 80 },
  { id: 3, tag: "GraphQL", questions: 50 },
  { id: 4, tag: "Node.js", questions: 90 },
  { id: 5, tag: "TypeScript", questions: 70 },
];

const RightSideBar = async () => {
  const hotQuestions = await getHotQuestions();
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      {" "}
      <div>
        <h3 className="h3-bold text-dark200_light900">Hot Networks</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions?.map((q) => (
            <Link
              href={`/question/${q.id}`}
              key={q.id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{q.title}</p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                alt="chevron-right"
                width={20}
                height={20}
              ></Image>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {popularTags.map((tag) => (
            <RenderTag
              id={tag.id}
              name={tag.tag}
              key={tag.id}
              totalQuestions={tag.questions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;

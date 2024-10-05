import RenderTag from "@/components/shared/RenderTag/RenderTag";
import Matrix from "@/components/shared/matrix/Matrix";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Tag {
  id: number;
  title: string;
}

interface Author {
  id: number;
  name: string;
  imgUrl: string;
}

interface Answer {
  id: number;
  title: string;
  author: Author;
  createdAt: Date;
}

interface QuestionCardProps {
  id: number;
  title: string;
  tags: Tag[];
  author: Author;
  upvotes: number;
  views: number;
  answers: Answer[]; // Array of answers with more detailed structure
  createdAt: Date;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${id}`}>
            <h2 className="sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h2>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap mt-3.5 gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag.id} name={tag.title} id={tag.id} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Matrix
          alt="user"
          imgUrl="/assets/icons/avatar.svg"
          values={author.name}
          title={` - ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author.id}`}
          isAuthor
        />
        <Matrix
          alt="upvotes"
          imgUrl="/assets/icons/like.svg"
          values={upvotes}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
          href=""
        />
        <Matrix
          alt="message"
          imgUrl="/assets/icons/message.svg"
          values={answers.length}
          title="message"
          textStyles="small-medium text-dark400_light800"
          href=""
        />
        <Matrix
          alt="views"
          imgUrl="/assets/icons/eye.svg"
          values={views}
          title="Views"
          textStyles="small-medium text-dark400_light800"
          href=""
        />
      </div>
    </div>
  );
};

export default QuestionCard;

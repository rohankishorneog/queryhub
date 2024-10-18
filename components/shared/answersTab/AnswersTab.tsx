import { SearchParamsProps } from "@/app/types";
import AnswerCard from "@/components/cards/answerCard/AnswerCard";
import { getUserAnswers } from "@/lib/actions/user.action";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.answers.map((answer: any) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}

      <div className="mt-10"></div>
    </>
  );
};

export default AnswersTab;

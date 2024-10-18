import { getUserQuestions } from "@/lib/actions/user.action";

import QuestionCard from "@/components/cards/questionCard/QuestionCard";
import { SearchParamsProps } from "@/app/types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: 1,
  });

  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          clerkId={clerkId}
          key={question._id}
          id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}

      <div className="mt-10"></div>
    </>
  );
};

export default QuestionsTab;

"use client";

import Image from "next/image";
import React, { useState } from "react";

interface VotesProps {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes: React.FC<VotesProps> = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}) => {
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownvoteCount] = useState(downvotes);
  const [userHasUpvoted, setUserHasUpvoted] = useState(hasupVoted);
  const [userHasDownvoted, setUserHasDownvoted] = useState(hasdownVoted);
  const [userHasSaved, setUserHasSaved] = useState(hasSaved);

  const handleUpvote = () => {
    if (userHasUpvoted) {
      setUpvoteCount(upvoteCount - 1);
      setUserHasUpvoted(false);
    } else {
      setUpvoteCount(upvoteCount + 1);
      if (userHasDownvoted) {
        setDownvoteCount(downvoteCount - 1);
        setUserHasDownvoted(false);
      }
      setUserHasUpvoted(true);
    }
  };

  const handleDownvote = () => {
    if (userHasDownvoted) {
      setDownvoteCount(downvoteCount - 1);
      setUserHasDownvoted(false);
    } else {
      setDownvoteCount(downvoteCount + 1);
      if (userHasUpvoted) {
        setUpvoteCount(upvoteCount - 1);
        setUserHasUpvoted(false);
      }
      setUserHasDownvoted(true);
    }
  };

  const handleSave = () => {
    setUserHasSaved(!userHasSaved);
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{upvotes}</p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{downvotes}</p>
          </div>
        </div>
      </div>

      <Image
        src={
          hasSaved
            ? "/assets/icons/star-filled.svg"
            : "/assets/icons/star-red.svg"
        }
        width={18}
        height={18}
        alt="save"
        className="cursor-pointer"
      />
    </div>
  );
};

export default Votes;

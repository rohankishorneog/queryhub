import RenderTag from "@/components/shared/RenderTag/RenderTag";
import { Badge } from "@/components/ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}
const UserCard = async ({ user }: Props) => {
  const result = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          width={100}
          height={100}
          alt="profile"
          src={user.picture}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark-500 mt-2">@{user.username}</p>
        </div>
        <div className="mt-5">
          {result.length > 0 ? (
            <div className="flex w-full gap-2">
              {result.map((tag) => (
                <RenderTag id={tag.id} name={tag.name} key={tag.id} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;

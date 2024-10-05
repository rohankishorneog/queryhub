import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MatrixProps {
  alt: string;
  imgUrl: string;
  values: number | string;
  title: string;
  textStyles: string;
  href?: string;
  isAuthor?: boolean;
}

const Matrix: React.FC<MatrixProps> = ({
  alt,
  imgUrl,
  values,
  title,
  textStyles,
  href,
  isAuthor,
}) => {
  const matricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        className={`object-contain ${href ? `rounded-full` : ""}`}
        width={16}
        height={16}
      />
      <p className={`${textStyles} flex items-center gap-1 `}>
        <span>{values}</span>

        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {matricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{matricContent}</div>;
};

export default Matrix;

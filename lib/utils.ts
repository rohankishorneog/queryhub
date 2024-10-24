import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BadgeCounts } from "@/app/types";
import { BADGE_CRITERIA, CURRENCY_NOTATIONS } from "@/constants";
import { JobPageFilters } from "@/constants/filters";
import { GetFormattedSalaryParams } from "./actions/shared.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export function formatDate(date: Date): string {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return date.toLocaleDateString("en-US", options);
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveKeysFromQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveKeysFromQueryParams) => {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};

export const employmentTypeConverter = (type: string): string => {
  let employmentType: string = "";

  JobPageFilters.forEach((filter) => {
    if (filter.value === type) {
      employmentType = filter.name;
    }
  });

  return employmentType;
};

export const getFormattedSalary = ({
  min,
  max,
  currency,
  period,
}: GetFormattedSalaryParams) => {
  if (!min || !max) return null;

  const salaryInfo = {
    symbol: CURRENCY_NOTATIONS[currency] || "$",
    low: salaryFormatter(min, 1),
    high: salaryFormatter(max, 1),
    per: period ? `/${period.toLowerCase()}ly` : "",
  };

  const { symbol, low, high, per } = salaryInfo;

  const formattedSalary = `${symbol}${low} - ${symbol}${high}${per}`;

  return formattedSalary as string;
};

const salaryFormatter = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const lookupItem = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return lookupItem
    ? (num / lookupItem.value).toFixed(digits).replace(rx, "$1") +
        lookupItem.symbol
    : "0";
};

export function isValidImage(url: string) {
  return /\.(jpg|jpeg|png|webp||svg)$/.test(url);
}

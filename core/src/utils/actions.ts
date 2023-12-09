import { NodeHtmlMarkdown } from "node-html-markdown";

import { DEFAULT_DAY, DEFAULT_YEAR, YEARS, ARTICLE_REGEX } from "./constants";

export const validateYear = (yearString: string | undefined) => {
  if (yearString === undefined) return DEFAULT_YEAR.toString();

  if (!YEARS.includes(+yearString))
    throw new Error("The year input was not one when AoC was held.");

  return yearString;
};

export const validateTime = (dateString: string | undefined) => {
  if (dateString === undefined)
    return {
      year: DEFAULT_YEAR.toString(),
      rawDay: DEFAULT_DAY,
      day: DEFAULT_DAY.padStart(2, "0"),
    };

  const [yearString, dayString] = dateString.split("/");
  if (!YEARS.includes(+yearString))
    throw new Error("The date input does not have a year when AoC was held.");
  if (!(+dayString > 0) || !(+dayString < 26))
    throw new Error("The date input is not a valid day in December.");

  return {
    year: yearString,
    rawDay: dayString,
    day: dayString.padStart(2, "0"),
  };
};

export const getQuestion = async (
  year: string,
  rawDay: string,
  key: string
) => {
  const URL = `https://adventofcode.com/${year}/day/${rawDay}`;
  const response = await fetch(URL, { headers: { cookie: `session=${key}` } });
  const responseText = await response.text();

  if (response.status === 200) return responseText;
  if (response.status === 404 && responseText.includes("before it unlocks!"))
    throw new Error(`[ * ] | This puzzle has not unlocked yet.
        It will unlock on Dec ${rawDay}, ${year} at midnight EST (UTC-5).`);

  throw new Error("The question wasn't found - please try again.");
};

export const getInput = async (year: string, rawDay: string, key: string) => {
  const URL = `https://adventofcode.com/${year}/day/${rawDay}/input`;
  const response = await fetch(URL, { headers: { cookie: `session=${key}` } });

  if (response.status === 200) return response.text();
  throw new Error("The puzzle wasn't found - please check your session token.");
};

export const processQuestion = (contents: string) => {
  const questionInHtml = contents.match(ARTICLE_REGEX)![0];
  const converter = new NodeHtmlMarkdown({
    bulletMarker: "-",
    codeBlockStyle: "indented",
    emDelimiter: "*",
    textReplace: [[/\\-/gi, "-"]],
  });
  return converter.translate(questionInHtml);
};

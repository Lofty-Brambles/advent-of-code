export const START_YEAR = 2015;
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

export const README_FILE = "readme.md";
export const CONFIG_FILE = ".config";
export const LANGUAGE_FILE = ".language";
export const INPUT_FILE = "input.txt";
export const SOLUTION_FILE = "solution.ts";
export const QUESTION_FILE = "question.md";

export const ARTICLE_REGEX = /(?<=\<article.*\>).*(?=\<\/article\>)/mis;
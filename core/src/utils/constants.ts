export const START_YEAR = 2015;
export const DEFAULT_YEAR = new Date().getFullYear();
export const DEFAULT_DAY = new Date().getDate().toString();
export const YEARS = Array.from(
  { length: DEFAULT_YEAR - START_YEAR + 1 },
  (_, i) => DEFAULT_YEAR - i
);

export const ARTICLE_REGEX = /(?<=\<article.*\>).*(?=\<\/article\>)/ims;

export const FILENAMES = {
  PROMPT_FILE: "question.md",
  INPUT_FILE: "input.txt",
  SOLUTION_FILE: "solution.ts",
};

import { DEFAULT_DAY, DEFAULT_YEAR, YEARS } from "./constants";

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

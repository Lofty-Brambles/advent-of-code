import { readFile } from "fs/promises";

const rawTest = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

class Card {
  id: number;
  #winningNumbers: number[];
  #cardNumbers: number[];

  constructor(id: number, [winningString, cardString]: string[]) {
    this.id = id;
    this.#winningNumbers = Card.getNumbers(winningString).map(Number);
    this.#cardNumbers = Card.getNumbers(cardString).map(Number);
  }

  static getNumbers(numberString: string) {
    return numberString.split(" ").filter((element) => element !== "");
  }

  getWinCount() {
    const numberIsWinning = (number: number) =>
      this.#winningNumbers.includes(number);
    return this.#cardNumbers.filter(numberIsWinning).length;
  }

  getScore() {
    const winningCount = this.getWinCount();
    return winningCount !== 0 ? Math.pow(2, winningCount - 1) : 0;
  }
}

const processLine = (line: string, index: number) => {
  const SEPERATORS = /[:\|]/g;
  return new Card(index + 1, line.split(SEPERATORS).slice(1));
};

const problem1 = (contents: string[]) => {
  const cards = contents.map((line, index) => processLine(line, index));
  const scores = cards.map((card) => card.getScore());
  return scores.reduce((sum, score) => score + sum, 0);
};

const problem2 = (contents: string[]) => {
  const cardCounts = Array.from({ length: contents.length }, (_) => 1);
  const cards = contents.map((line, index) => processLine(line, index));
  cards.forEach((card) => {
    const newCardIndices = Array.from(
      { length: card.getWinCount() },
      (_, index) => card.id + index
    );

    const cardCount = cardCounts[card.id - 1];
    newCardIndices.forEach((index) => (cardCounts[index] += cardCount));
  });

  return cardCounts.reduce((sum, count) => count + sum, 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};

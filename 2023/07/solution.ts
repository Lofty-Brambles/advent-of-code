import { readFile } from "fs/promises";

const rawTest = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Process = (cards: Record<string, number>) => number[];
const lineToHands = (processCards: Process) => (line: string) => {
  const [hand, bid] = line.split(" ");
  const cards: Record<string, number> = {};
  hand.split("").forEach((char) => (cards[char] = (cards[char] ?? 0) + 1));
  const cardTimes = processCards(cards).sort((a, b) => b - a);
  return { hand, cardTimes, bid: Number(bid) };
};

type Hand = ReturnType<ReturnType<typeof lineToHands>>;
const sortHands = (RANKS: string[]) => (hand1: Hand, hand2: Hand) => {
  const getHandCount = (hand: Hand) => hand.cardTimes.length;
  const comparableFor = Math.min(...[hand1, hand2].map(getHandCount));
  for (const index of Object.keys(Array(comparableFor).fill(0))) {
    const difference = hand1.cardTimes[+index] - hand2.cardTimes[+index];
    if (difference !== 0) return difference;
  }

  for (const index of Object.keys(Array(hand1.hand.length).fill(0))) {
    const difference =
      RANKS.indexOf(hand2.hand[+index]) - RANKS.indexOf(hand1.hand[+index]);
    if (difference !== 0) return difference;
  }

  return 0;
};

const problem1 = (contents: string[]) => {
  const RANKS = "AKQJT98765432".split("");
  const identityFx = (cards: Record<string, number>) => Object.values(cards);
  const hands = contents.map(lineToHands(identityFx));
  hands.sort(sortHands(RANKS));
  return hands.reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);
};

const problem2 = (contents: string[]) => {
  const RANKS = "AKQT98765432J".split("");
  const tallyJToHighest = (cards: Record<string, number>) => {
    const Jcount = cards["J"];
    if (Jcount !== 5) {
      delete cards["J"];
      const maxCard = Object.keys(cards).sort((a, b) => cards[b] - cards[a])[0];
      if (Jcount && maxCard) cards[maxCard] += Jcount;
    }
    return Object.values(cards);
  };

  const hands = contents.map(lineToHands(tallyJToHighest));
  hands.sort(sortHands(RANKS));
  return hands.reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};

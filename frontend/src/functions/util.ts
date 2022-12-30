import type { GuessItemInterface } from "../interface";

// 1. 인덱스 기준 정렬
export const numberSort = (reversed: boolean, data: GuessItemInterface[]) => {
  if (reversed) {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return a.cnt - b.cnt;
    });
  } else {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return b.cnt - a.cnt;
    });
  }
};

// 2. 단어 기준 정렬
export const wordSort = (reversed: boolean, data: GuessItemInterface[]) => {
  if (reversed) {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return a.word.localeCompare(b.word);
    });
  } else {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return b.word.localeCompare(a.word);
    });
  }
};

// 3. 유사도 순위 기준 정렬
export const similaritySort = (
  reversed: boolean,
  data: GuessItemInterface[]
) => {
  if (reversed) {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return a.similarity - b.similarity;
    });
  } else {
    return [...data].sort(function (
      a: GuessItemInterface,
      b: GuessItemInterface
    ) {
      return b.similarity - a.similarity;
    });
  }
};

// GuessItemInterface 리스트에서 word를 조회
export const findGuess = (
  guess_item_list: GuessItemInterface[],
  word: string
) => {
  for (let i = 0; i < guess_item_list.length; i++) {
    if (guess_item_list[i].word === word)
      return {
        index: i,
        guess_item: guess_item_list[i],
      };
  }
  return null;
};

export const todayPuzzleNumber = () => {
  const num_puzzle = 4650;
  const initial_date = new Date("2022-04-01T00:00:00+09:00");
  const puzzle_number =
    Math.floor((new Date().getTime() - initial_date.getTime()) / 86400000) %
    num_puzzle;
  return puzzle_number;
};


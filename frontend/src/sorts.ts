// 정렬 관련 함수

import type { GuessItemInterface } from "./interface";

// 1. 인덱스 기준 정렬
export const number_sort = (reversed: boolean, data: GuessItemInterface[]) => {
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
export const word_sort = (reversed: boolean, data: GuessItemInterface[]) => {
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
export const similarity_sort = (
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

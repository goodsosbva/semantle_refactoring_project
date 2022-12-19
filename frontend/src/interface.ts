import GuessForm from "./components/GuessForm.vue";

export interface SimilarityStoryInterface {
  top: number;
  top10: number;
  rest: number;
}

export interface GuessResultInterface {
  guess: string;
  rank: number;
  sim: number;
}

export interface GuessErrorInterface {
  error: string;
}

export interface GuessCacheInterface {
  [key: string]: GuessResultInterface;
}

export type SortTargetInterface = "number" | "word" | "similarity";

export interface GuessItemInterface {
  cnt: number;
  word: string;
  similarity: number;
  rank: string;
}

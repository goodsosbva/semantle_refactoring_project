import type { GuessItemInterface } from "@/interface";

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

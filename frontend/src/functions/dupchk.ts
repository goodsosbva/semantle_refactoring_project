import type { GuessItemInterface } from "@/interface";

export const duplicateChk = (datas: GuessItemInterface[], cur_data: string) => {
  for (let i = 0; i < datas.length; i++) {
    if (datas[i].word === cur_data) return true;
  }

  return false;
};


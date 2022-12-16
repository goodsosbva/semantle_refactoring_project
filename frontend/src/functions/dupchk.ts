export const duplicateChk = (datas: any, cur_data: any) => {
  for (let i = 0; i < datas.length; i++) {
    if (datas[i].word === cur_data) return true;
  }

  return false;
};

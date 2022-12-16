// 정렬 관련 함수
// 1. 인덱스 기준 정렬
export const number_sort = (sort_toggle: any, data: any) => {
  if (sort_toggle[0] === 1) {
    sort_toggle[0] = -1;
    data.sort(function (a: any, b: any) {
      return b.cnt - a.cnt;
    });
  } else {
    sort_toggle[0] = 1;
    data.sort(function (a: any, b: any) {
      return a.cnt - b.cnt;
    });
  }
};

// 2. 단어 기준 정렬
export const word_sort = (data: any) => {
  console.log("word_sort! 시작");
  data.sort(function (a: any, b: any) {
    let x = a.word;
    let y = b.word;

    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
  });
};

// 3. 유사도 순위 기준 정렬
export const similarity_sort = (data: any) => {
  console.log("similarity_sort! start!");

  data.sort(function (a: any, b: any) {
    let x = a.similarity;
    let y = b.similarity;

    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
  });
};

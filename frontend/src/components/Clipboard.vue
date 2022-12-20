<template>
  <div>
    <!-- value="이럴 수가! 첫번째 추측에서 260번째 꼬맨틀 정답 단어를 맞췄습니다!
            https://semantle-ko.newsjel.ly/" -->
    <input
      ref="inputEl"
      type="hidden"
      :value="
        puzzle_number +
        '번째 꼬맨틀을 풀었습니다!\n' +
        result_time_sentance +
        ' https://semantle-ko.newsjel.ly/'
      "
    />
    <button @click="handleCopy" class="button">기록 복사하기</button>
  </div>
</template>

<!-- "post.title + ' by ' + post.author.name" -->

<script setup lang="ts">
import { ref } from "vue";
import type { GuessItemInterface } from "../interface";

const props = defineProps<{
  puzzle_number: number;
  guess_data: GuessItemInterface[];
}>();

const storage = window.localStorage;
const inputEl = ref<null | HTMLInputElement>(null);

const stats = storage.getItem("stats");
const stats_obj = JSON.parse(stats as string);

// 추측 횟수 표시 관련
const result_time = stats_obj["today_chel_number"];
const test_time = storage.getItem("test_time");
let result_time_sentance = ref<string>("");
if (test_time === "true") {
  result_time_sentance.value = "추측 횟수: " + result_time + "\n";
}

// 최대 유사도 관련
function get_top_similarity(data: any) {
  let maxData = -1;
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data.similarity > maxData) {
      maxData = data.similarity;
    }
  }
  return maxData;
}
const top_similarity_sort = get_top_similarity(props.guess_data);
console.log(top_similarity_sort);

// 클립보드 복사
const handleCopyForIE = () => {
  inputEl?.value?.setAttribute("type", "text");
  inputEl?.value?.select();
  document.execCommand("copy");
  inputEl?.value?.setAttribute("type", "hidden");
  alert(`execCommand를 통해 내용이 복사되었습니다 ${props.puzzle_number}`);
};

const handleCopy = () => {
  if (inputEl.value === null) {
    return;
  }
  if (!navigator.clipboard) {
    handleCopyForIE();
    return;
  }

  navigator.clipboard
    .writeText(inputEl.value.value)
    .then(() => alert("클립보드가 복사되었습니다"))
    .catch((e) => {
      console.log(e.message);
      handleCopyForIE();
    });
};
</script>

<style scoped>
.clipboard {
  padding: 1rem;
  border: 1px solid gray;
}
.button {
  padding: 9px;
  margin-bottom: -15px;
}
</style>

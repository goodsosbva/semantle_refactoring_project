<template>
  <div
    id="warning"
    v-if="display_answer_toggle === false"
    @click="display_answer()"
  >
    <div style="border: thin solid black; background-color: #ffdddd">
      조심하세요! 이 경고문을 클릭하면 <span id="spoiler"></span>의 정답이
      표시됩니다.
    </div>
  </div>
  <div id="nearest" v-if="display_answer_toggle === true">
    꼬맨틀 <b id="day">#{{ puzzle_number }}</b
    >의 정답은 <b id="word">{{ today_keyword }}</b
    >입니다. 가장 유사한 단어는 다음과 같습니다:
    <table>
      <tr>
        <th>유사도 순위</th>
        <th>단어</th>
        <th>유사도</th>
      </tr>
      <tr v-for="(word, index) in today_similarity">
        <td>{{ word.rank }}</td>
        <td>{{ word.word }}</td>
        <td>{{ word.similarity }}</td>
      </tr>
    </table>
  </div>

  <br />
  <a href="/">메인 페이지로 돌아가기</a>
  <!-- </Suspense> -->
</template>

<script setup lang="ts">
import { nearest1k_data, getYesterday } from "../api";
import { onMounted, ref } from "vue";

const today_similarity = ref<any>([]);
const today_keyword = ref<string>("");
const display_answer_toggle = ref<boolean>(false);

const num_puzzle = 4650;
const initial_date = new Date("2022-04-01T00:00:00+09:00");
const puzzle_number =
  Math.floor((new Date().getTime() - initial_date.getTime()) / 86400000) %
  num_puzzle;

function display_answer() {
  display_answer_toggle.value = !display_answer_toggle.value;
}

onMounted(async () => {
  // 오늘 정답 -> 함수 바꾸기 귀찮아서 +1 함 ㅋㅋ
  const today = await getYesterday(puzzle_number + 1);
  if (today !== null) {
    today_keyword.value = today;
  }

  // 오늘 유사도 목록들
  const today_puzzle_number = puzzle_number;
  if (today_puzzle_number !== null) {
    const yesterday_sims = await nearest1k_data(today_puzzle_number);
    if (yesterday_sims !== null) {
      today_similarity.value = yesterday_sims;
      console.log(today_similarity.value);
    }
  }
});
</script>

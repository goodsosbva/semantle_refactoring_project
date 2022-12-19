<template>
  <span>check</span>
  <!-- <div id="warning" style="display: none">
    <div style="border: thin solid black; background-color: #ffdddd">
      조심하세요! 이 경고문을 클릭하면 <span id="spoiler"></span>의 정답이
      표시됩니다.
    </div>
  </div>
  <div id="nearest" style="display: none">
    꼬맨틀 <b id="day">#{{ puzzle_number - 1 }}</b
    >의 정답은 <b id="word">{{ word }}</b
    >입니다. 가장 유사한 단어는 다음과 같습니다:
    <table>
      <tr>
        <th>유사도 순위</th>
        <th>단어</th>
        <th>유사도</th>
      </tr>
      {% for word in words %}
      <tr>
        <td>{{ word["rank"] }}</td>
        <td>{{ word["word"] }}</td>
        <td>{{ word["similarity"] }}</td>
      </tr>
      {% endfor %}
    </table>
  </div> -->

  <br />
  <a href="/">메인 페이지로 돌아가기</a>
</template>

<script setup lang="ts">
import { nearest1k_data } from "../api";
const storage = window.localStorage;

const pz = storage.getItem("stats");
const pz_obj = JSON.parse(pz as string);
const before_puzzle_number = pz_obj["puzzle_number"] - 1;

console.log(before_puzzle_number);

// const props = defineProps<{
//   puzzle_number: number;
// }>();

// console.log(props.puzzle_number);

// if (before_puzzle_number !== null) {
//   const yesterday_sims = await nearest1k_data(before_puzzle_number);
//   if (yesterday_sims !== null) {
//     console.log(yesterday_sims);
//   }
// }
</script>

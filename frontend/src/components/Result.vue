<template>
  <div id="response" class="gaveup">
    <p>
      <b
        >정답 단어를 맞추었습니다. {{ today_chal_number }}번째 추측만에 정답을
        맞췄네요!</b
      ><br />정답 단어와 비슷한,
      <a href="/nearest1k/256">상위 1000개의 단어</a>를 확인해보세요.
    </p>
    <!-- Trigger -->
    <Clip
      id="clip"
      :puzzle_number="puzzle_number"
      :guess_data="guess_data"
    ></Clip>
    <!-- <input
      type="button"
      value="기록 복사하기"
      id="result"
      @click="clipCopy()"
      class="button"
    /> -->
    <br />
    {{ puzzle_number }}번째 꼬맨틀은 오늘 밤 자정(한국 시간 기준)에 열립니다.<br />
    <br />
    <b>나의 플레이 기록</b>: <br />
    <table>
      <tbody>
        <tr>
          <th>가장 처음 풀었던 꼬맨틀 번호:</th>
          <td>{{ first_day }}</td>
        </tr>
        <tr>
          <th>도전한 게임 횟수:</th>
          <td>{{ chal_number }}</td>
        </tr>
        <tr>
          <th>정답 횟수:</th>
          <td>{{ ans_number }}</td>
        </tr>
        <tr>
          <th>연속 정답 횟수:</th>
          <td>{{ conti_ans_number }}</td>
        </tr>
        <tr>
          <th>포기 횟수:</th>
          <td>{{ giveup_number }}</td>
        </tr>
        <tr>
          <th>지금까지 추측 단어 총 갯수:</th>
          <td>{{ today_chal_number }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { createApp, ref } from "vue";
import Clip from "./Clipboard.vue";
import type { GuessItemInterface } from "../interface";

// 클립보드 관련
const props = defineProps<{
  puzzle_number: number;
  chal_number: number; // 도전한 게임 횟수
  ans_number: number; // 정답 횟수
  conti_ans_number: number; // 연속 성공 넘버
  giveup_number: number; // 포기했을 때 넘버
  today_chal_number: number; // 전체 돋전 횟수?
  first_day: string | null; // 처음한 날짜
  guess_data: GuessItemInterface[];
}>();

// 클립보드 복사
function clipCopy() {
  console.log("클립보드 복사가 완료!");
}
</script>

<style scoped>
#clip {
  padding: 9px;
  margin-bottom: -15px;
}
</style>

<template>
  <div id="response" class="gaveup">
    <p>
      <b
        >정답 단어를 맞추었습니다. {{ today_guess_count_until_ended }}번째
        추측만에 정답을 맞췄네요!</b
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
          <td>{{ stats.firstPlay }}</td>
        </tr>
        <tr>
          <th>도전한 게임 횟수:</th>
          <td>{{ stats.totalPlays }}</td>
        </tr>
        <tr>
          <th>정답 횟수:</th>
          <td>{{ stats.wins }}</td>
        </tr>
        <tr>
          <th>연속 정답 횟수:</th>
          <td>{{ stats.winStreak }}</td>
        </tr>
        <tr>
          <th>포기 횟수:</th>
          <td>{{ stats.giveups }}</td>
        </tr>
        <tr>
          <th>지금까지 추측 단어 총 갯수:</th>
          <td>{{ stats.totalGuesses }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import Clip from "./Clipboard.vue";
import type { GuessItemInterface, StatsInterface } from "../interface";

// 클립보드 관련
const props = defineProps<{
  puzzle_number: number;
  today_guess_count_until_ended: number;
  guess_data: GuessItemInterface[];
  stats: StatsInterface;
}>();
</script>

<style scoped>
#clip {
  padding: 9px;
  margin-bottom: -15px;
}
</style>


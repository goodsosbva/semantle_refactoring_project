<template>
  <div id="response" class="result-dashboard">
    <p>
      <b>{{ preface }}</b
      ><br />정답 단어와 비슷한,
      <!-- link 부분 -->
      <span id="yesterday-nearest1k"
        ><router-link :to="'/nearest1k/' + puzzle_number"
          >상위 1000개의 단어</router-link
        >를 확인해보세요.</span
      >
    </p>

    <!-- Trigger -->
    <Clipboard
      id="clip"
      :puzzle_number="puzzle_number"
      :guess_data="guess_data"
      :is_gave_up="is_gave_up"
      :is_display_count="is_display_count"
      :is_display_time="is_display_time"
      :is_display_similarity="is_display_similarity"
    ></Clipboard>

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
import Clipboard from "./Clipboard.vue";
import type { GuessItemInterface, StatsInterface } from "../interface";
import { onMounted, ref } from "vue";

// 클립보드 관련
const props = defineProps<{
  puzzle_number: number;
  today_guess_count_until_ended: number;
  guess_data: GuessItemInterface[];
  stats: StatsInterface;
  is_gave_up: boolean;
  is_display_count: boolean;
  is_display_time: boolean;
  is_display_similarity: boolean;
}>();

const preface = ref<string>("");

function prefaceCaseUpdate() {
  // 이긴 경우
  if (props.is_gave_up === false) {
    preface.value = `정답 단어를 맞추었습니다. ${props.today_guess_count_until_ended}번째
        추측만에 정답을 맞췄네요!`;

    // 단어가 1개 이상인 경우
  } else {
    preface.value = `저런… ${props.puzzle_number}번째 꼬맨틀을 포기했어요..ㅠ`;
  }
}

onMounted(() => {
  prefaceCaseUpdate();
});
</script>

<style scoped>
#clip {
  padding: 9px;
  margin-bottom: -15px;
}

.result-dashboard {
  box-shadow: rgba(0, 0, 255, 0.3) 0px 0px 0px 2px inset,
    rgb(255, 255, 255) 10px -10px 0px -3px, rgba(30, 193, 27, 0.3) 10px -10px,
    rgb(255, 255, 255) 20px -20px 0px -3px, rgba(255, 216, 19, 0.3) 20px -20px,
    rgb(255, 255, 255) 30px -30px 0px -3px, rgba(255, 156, 85, 0.3) 30px -30px,
    rgb(255, 255, 255) 40px -40px 0px -3px, rgba(255, 85, 85, 0.3) 40px -40px;

  padding-left: 20px;
}
</style>

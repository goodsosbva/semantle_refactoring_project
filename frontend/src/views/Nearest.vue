<template>
  <div v-if="!Number.isNaN(puzzle_number)">
    <div id="warning" v-if="!should_display_answer" @click="display_answer()">
      <div style="border: thin solid black; background-color: #ffdddd">
        조심하세요! 이 경고문을 클릭하면 <span id="spoiler">오늘</span>의 정답이
        표시됩니다.
      </div>
    </div>
    <BasicBarChart :nearest_items="nearest_items"></BasicBarChart>

    <div id="nearest" v-if="should_display_answer">
      꼬맨틀 <b id="day">#{{ puzzle_number }}</b
      >의 정답은 <b id="word">{{ keyword }}</b
      >입니다. 가장 유사한 단어는 다음과 같습니다:
      <table>
        <tr>
          <th>유사도 순위</th>
          <th>단어</th>
          <th>유사도</th>
        </tr>
        <tr v-for="word in nearest_items">
          <td>{{ word.rank }}</td>
          <td>{{ word.word }}</td>
          <td>{{ word.similarity }}</td>
        </tr>
      </table>
    </div>
    <br />
  </div>
  <div v-else>
    이 날의 가장 유사한 단어는 현재 사용할 수 없습니다. 그저께부터 내일까지만
    확인할 수 있습니다.
  </div>
  <router-link to="/">메인 페이지로 돌아가기</router-link>
</template>

<script setup lang="ts">
import { nearest1kData, giveUp } from "../api";
import { computed, onMounted, ref } from "vue";
import type { NearestItemInterface } from "@/interface";
import { todayPuzzleNumber } from "@/functions/util";
import BasicBarChart from "../components/BasciChart/BasicBarChart.vue";

const nearest_items = ref<NearestItemInterface[]>([]);
const keyword = ref<string>("");
const should_display_answer = ref<boolean>(false);

const props = defineProps<{
  puzzle_number_input: string;
}>();

const puzzle_number = computed(() => {
  return Number.parseInt(props.puzzle_number_input, 10);
});

function display_answer() {
  should_display_answer.value = !should_display_answer.value;
}

onMounted(async () => {
  const today_puzzle_number = todayPuzzleNumber();
  should_display_answer.value = today_puzzle_number !== puzzle_number.value;

  const give_up_result = await giveUp(puzzle_number.value);
  if (give_up_result != null) {
    keyword.value = give_up_result;
  }

  const nearest_result = await nearest1kData(puzzle_number.value);
  if (nearest_result !== null) {
    nearest_items.value = nearest_result;
  }
});
</script>

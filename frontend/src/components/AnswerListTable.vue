<template>
  <table id="guesses">
    <!-- v-if="answering" -->
    <tbody>
      <tr v-if="answering_top_row === true">
        <th id="chronoOrder" @click="updateSort('number')">#</th>
        <th id="alphaOrder" @click="updateSort('word')">추측한 단어</th>
        <th id="similarityOrder" @click="updateSort('similarity')">유사도</th>
        <th>유사도 순위</th>
        <br />
      </tr>
      <!-- 가장 최근 입력! -->
      <tr v-if="last_word !== null">
        <td>{{ last_word.cnt }}</td>
        <td class="highlight">{{ last_word.word }}</td>
        <td>{{ last_word.similarity.toFixed(2) }}</td>
        <td
          v-if="
            last_word.rank !== '1000위 이상' &&
            last_word.rank !== '정답!' &&
            last_word.rank !== '정답'
          "
        >
          <BarGraphVue :value="Number.parseFloat(last_word.rank)"></BarGraphVue>
        </td>
        <td v-if="last_word.rank === '정답!'">{{ last_word.rank }}</td>
        <td v-if="last_word.rank === '1000위 이상'">{{ last_word.rank }}</td>
        <td v-if="last_word.rank === '정답'">{{ last_word.rank }}</td>
      </tr>
      <!-- 밑 줄 -->
      <tr>
        <td colspan="4" v-if="answering_top_row === true">
          <hr class="line" />
        </td>
      </tr>
      <!-- 마지막 단어가 막 들어온 경우 -->
      <tr
        v-if="last_word !== null"
        v-for="(word, index) in sorted_guess_data.filter(
          (data) => data.cnt !== new_word_idx
        )"
        :key="index"
      >
        <td>{{ word.cnt }}</td>
        <td>{{ word.word }}</td>
        <td>{{ word.similarity.toFixed(2) }}</td>
        <td
          v-if="
            word.rank !== '1000위 이상' &&
            word.rank !== '정답!' &&
            word.rank !== '정답'
          "
        >
          <BarGraphVue :value="Number.parseFloat(word.rank)"></BarGraphVue>
        </td>
        <td v-if="word.rank === '정답!'">{{ word.rank }}</td>
        <td v-if="word.rank === '1000위 이상'">{{ word.rank }}</td>
        <td v-if="word.rank === '정답'">{{ word.rank }}</td>
      </tr>
      <!-- 막 안들어온 경우 -->
      <tr
        v-if="last_word === null"
        v-for="(word, index) in sorted_guess_data"
        :key="index"
      >
        <td>{{ word.cnt }}</td>
        <td>{{ word.word }}</td>
        <td>{{ word.similarity.toFixed(2) }}</td>
        <td
          v-if="
            word.rank !== '1000위 이상' &&
            word.rank !== '정답!' &&
            word.rank !== '정답'
          "
        >
          <BarGraphVue :value="Number.parseFloat(word.rank)"></BarGraphVue>
        </td>
        <td v-if="word.rank === '정답!'">{{ word.rank }}</td>
        <td v-if="word.rank === '1000위 이상'">{{ word.rank }}</td>
        <td v-if="word.rank === '정답'">{{ word.rank }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { GuessItemInterface, SortTargetInterface } from "../interface";

import { number_sort, word_sort, similarity_sort } from "../sorts";
import BarGraphVue from "./BarGraph.vue";

const sort_target = ref<SortTargetInterface>("similarity");
const sort_reversed = ref<boolean>(true);

const props = defineProps<{
  answering_top_row: boolean;
  last_word: GuessItemInterface | null; // 도전한 게임 횟수
  new_word_idx: number;
  guess_data: GuessItemInterface[];
}>();

function updateSort(clicked_target: SortTargetInterface) {
  if (clicked_target === sort_target.value) {
    sort_reversed.value = !sort_reversed.value;
  } else {
    sort_target.value = clicked_target;
    if (clicked_target === "similarity") {
      sort_reversed.value = true;
    } else {
      sort_reversed.value = false;
    }
  }
}

const sorted_guess_data = computed(() => {
  if (sort_target.value === "number") {
    return number_sort(sort_reversed.value, props.guess_data);
  } else if (sort_target.value === "word") {
    return word_sort(sort_reversed.value, props.guess_data);
  } else if (sort_target.value === "similarity") {
    return similarity_sort(sort_reversed.value, props.guess_data);
  }
  return props.guess_data;
});
</script>

<style scoped>
.line {
  height: 1px;
}
.highlight {
  color: rgb(19, 92, 201);
  font-weight: bold;
}
</style>

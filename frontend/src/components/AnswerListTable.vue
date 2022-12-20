<template>
  <table id="guesses">
    <tbody>
      <AnswerListTableRowHeader @update_sort="updateSort" />
      <!-- 가장 최근 입력! -->
      <AnswerListTableRowWord
        v-if="last_word !== null"
        :word="last_word"
        :is_highlighted="true"
      />
      <!-- 밑 줄 -->
      <tr>
        <td colspan="4">
          <hr class="line" />
        </td>
      </tr>
      <AnswerListTableRowWord
        v-for="(word, index) in guess_data_to_display"
        :key="index"
        :word="word"
        :is_highlighted="false"
      />
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { GuessItemInterface, SortTargetInterface } from "../interface";

import { number_sort, word_sort, similarity_sort } from "../sorts";
import AnswerListTableRowHeader from "./AnswerListTableRowHeader.vue";
import AnswerListTableRowWord from "./AnswerListTableRowWord.vue";

const sort_target = ref<SortTargetInterface>("similarity");
const sort_reversed = ref<boolean>(true);

const props = defineProps<{
  last_word: GuessItemInterface | null;
  last_word_index: number | null;
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

const guess_data_to_display = computed(() => {
  if (props.last_word === null) {
    return sorted_guess_data.value;
  } else {
    return sorted_guess_data.value.filter(
      (data) => data.cnt !== props.last_word_index
    );
  }
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


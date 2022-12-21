<template>
  <tr v-if="word !== null">
    <td>{{ word.cnt }}</td>
    <td :class="{ highlight: is_highlighted === true }">{{ word.word }}</td>
    <td>{{ word.similarity.toFixed(2) }}</td>
    <td v-if="shouldShowBarGraph(word)">
      <BarGraph :value="Number.parseFloat(word.rank)" />
    </td>
    <td v-else>{{ word.rank }}</td>
  </tr>
</template>

<script setup lang="ts">
import BarGraph from "./BarGraph.vue";
import type { GuessItemInterface } from "@/interface";
const props = defineProps<{
  word: GuessItemInterface;
  is_highlighted: boolean;
}>();
function shouldShowBarGraph(word: GuessItemInterface) {
  return (
    word.rank !== "1000위 이상" && word.rank !== "정답!" && word.rank !== "정답"
  );
}
</script>

<style setup>
.highlight {
  color: rgb(19, 92, 201);
  font-weight: bold;
}
</style>

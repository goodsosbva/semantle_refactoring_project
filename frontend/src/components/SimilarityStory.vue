<template>
  <p id="similarity-story">
    {{ puzzle_number }}번째 꼬맨틀의 정답 단어를 맞춰보세요.<br />
    정답 단어와 가장 유사한 단어의 유사도는
    <b>{{ (top * 100).toFixed(2) }}</b> 입니다. 10번째로 유사한 단어의 유사도는
    {{ (top10 * 100).toFixed(2) }}이고, 1000번째로 유사한 단어의 유사도는
    {{ (rest * 100).toFixed(2) }} 입니다.
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  puzzle_number: number;
  top: number;
  top10: number;
  rest: number;
}>();
</script>

<template>
  <p
    id="similarity-story"
    class="similarity-story-box"
    v-if="similarity_story !== null"
  >
    {{ puzzle_number }}번째 꼬맨틀의 정답 단어를 맞춰보세요.<br />
    정답 단어와 가장 유사한 단어의 유사도는
    <b>{{ (similarity_story.top * 100).toFixed(2) }}</b> 입니다. 10번째로 유사한
    단어의 유사도는 {{ (similarity_story.top10 * 100).toFixed(2) }}이고,
    1000번째로 유사한 단어의 유사도는
    {{ (similarity_story.rest * 100).toFixed(2) }} 입니다.
  </p>
</template>

<script setup lang="ts">
import { getSimilarityStory } from "@/api";
import type { SimilarityStoryInterface } from "@/interface";
import { onMounted, ref } from "vue";

const similarity_story = ref<SimilarityStoryInterface | null>(null);

const props = defineProps<{
  puzzle_number: number;
}>();

onMounted(async () => {
  const similarityStory = await getSimilarityStory(props.puzzle_number);
  if (similarityStory !== null) {
    similarity_story.value = similarityStory;
  }
});
</script>

<style scoped>
.similarity-story-box {
  color: #333;
  border-color: red rgba(170, 50, 220, 0.6) green;
  border-width: 1px;
  border-style: solid;
  /* border-top-right-radius: 0; */
  /* border-bottom-right-radius: 0; */
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  margin: 10px 10px;
}
</style>

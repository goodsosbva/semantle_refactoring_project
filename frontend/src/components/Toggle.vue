<template>
  <p id="question">
    <a
      class="btn btn-outline-dark"
      data-bs-toggle="collapse"
      href="#collapseExample"
      role="button"
      aria-expanded="false"
      aria-controls="collapseExample"
      @click="toggle_func()"
    >
      Q. 꼬맨틀은 무엇인가요?
    </a>
  </p>
  <!-- class="collapse" 
    id="collapseExample"-->
  <div v-if="toggle" id="answer">
    <div class="card card-body">
      A. 꼬맨틀은 오늘의 단어를 맞추는 게임입니다. 정답 단어를 추측하면, 추측한
      단어가 정답 단어와 얼마나 유사한지 유사도 점수로 알려줍니다. 가장 유사한
      단어의 유사도와 가까운 단어를 추측하면서, 정답 단어를 맞춰보세요.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let toggle = ref<boolean>(false);

function toggle_func() {
  console.log("toggle!!");
  toggle.value = !toggle.value;
  console.log(toggle.value);
}
</script>

<style>
#question {
  margin-top: 25px;
}
#answer {
  margin-bottom: 10px;
}
</style>

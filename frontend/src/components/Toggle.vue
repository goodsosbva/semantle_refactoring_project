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
      {{ props.question }}
    </a>
  </p>
  <!-- class="collapse" 
    id="collapseExample"-->
  <div v-if="toggle" id="answer">
    <div class="card card-body">
      {{ props.answer }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let toggle = ref<boolean>(false);

const props = defineProps<{
  question: string;
  answer: string;
}>();

console.log(props.question);

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

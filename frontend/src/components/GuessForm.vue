<template>
  <form id="form" autocorrect="off" autocapitalize="none" autocomplete="off">
    <div id="form-row">
      <div id="guess-wrapper">
        <input
          type="text"
          id="dummy"
          style="position: absolute; width: 0; height: 0; opacity: 0"
        />
        <!-- 입력 위치 -->
        <input
          placeholder="추측할 단어를 입력하세요"
          autocorrect="off"
          autocapitalize="none"
          autocomplete="off"
          type="text"
          id="guess"
          :value="input_word"
          @input="event => input_word = (event.target as HTMLInputElement).value"
          v-on:keyup.enter="clicked_input()"
        />
        <input
          type="button"
          value="추측하기"
          id="guess-btn"
          class="button"
          @click="clicked_input()"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
// @click="emit('guess', input_word)"
import { ref } from "vue";

const emit = defineEmits<{
  (e: "guess1", word: string): void;
  // (e: "guess2", is_clear: boolean): boolean;
}>();

const input_word = ref<string>("");

function clicked_input() {
  console.log("clicked_input!");
  emit("guess1", input_word.value);
  // emit("guess2", true);
  input_word.value = "";
}
</script>

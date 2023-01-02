<template>
  <form id="form" autocorrect="off" autocapitalize="none" autocomplete="off">
    <div id="form-row">
      <div id="guess-wrapper">
        <input
          type="text"
          id="dummy"
          style="position: absolute; width: 0; height: 0; opacity: 0"
        />
        <!-- TODO: guess가 두번 입력되는 문제 수정 필요 ready check -->
        <input
          placeholder="추측할 단어를 입력하세요"
          autocorrect="off"
          autocapitalize="none"
          autocomplete="off"
          type="text"
          id="guess"
          :value="input_word"
          @input="event => input_word = (event.target as HTMLInputElement).value"
          @keyup.enter="keyUpFn()"
        />
        <input
          type="button"
          value="추측하기"
          id="guess-btn"
          class="button"
          @click="keyUpFn()"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import _ from "lodash";

const emit = defineEmits<{
  (e: "guess", word: string): void;
}>();

const input_word = ref<string>("");

// 스로틀한 부분
function clicked_input() {
  if (input_word.value !== "") {
    let throttled = _.throttle(function () {
      emit("guess", input_word.value);
      input_word.value = "";
    }, 2000);

    throttled();
  }
}

let throttle: boolean = false;
function keyUpFn() {
  // normal

  // throttle
  if (!throttle) {
    guess_input();
    // console.log("throttle1", throttle, new Date().getTime());
    throttle = true;
    setTimeout(() => {
      // console.log("throttle2", throttle, new Date().getTime());
      throttle = false;
    }, 5);
  }
}

function guess_input() {
  if (input_word.value.trim() !== "") {
    emit("guess", input_word.value);
    input_word.value = "";
  }
}
</script>

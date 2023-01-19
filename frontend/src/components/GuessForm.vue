<template>
  <form id="form" autocorrect="off" autocapitalize="none" autocomplete="off">
    <div id="form-row">
      <div class="guess-wrapper">
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
          class="input-word-box"
          :value="input_word"
          @input="event => input_word = (event.target as HTMLInputElement).value"
          @keyup.enter="keyUpFn()"
        />
        <!-- <input
          type="button"
          value="추측하기"
          id="guess-btn"
          class="button"
          @click="keyUpFn()"
        /> -->
        <!-- HTML !-->
        <button class="button-55" type="button" @click="keyUpFn()">
          추측하기
        </button>
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

<style scoped>
/* CSS */
.button-55 {
  align-self: center;
  background-color: #fff;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1rem;
  line-height: 23px;
  outline: none;
  padding: 0.75rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 4px -6px;
}

.guess-wrapper {
  display: flex;
  padding: 0.5em;
  color: #333;
  width: 100%;
  /* border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) 15px 28px 25px -18px; */

  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-word-box {
  padding: 0.5em;
  color: #333;
  width: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #fff;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  margin: 10px 10px;
}
</style>

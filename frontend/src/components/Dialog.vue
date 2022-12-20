<template>
  <div>
    <div
      class="dialog"
      id="settings"
      aria-labelledby="settings-heading"
      aria-modal="true"
      role="dialog"
    >
      <button
        class="dialog-close"
        id="settings-close"
        aria-label="Schließen"
        @click="receive_closer()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="dialog-content border" id="settings-content">
        <h3 id="settings-heading">설정</h3>
        <div>
          <input
            type="checkbox"
            name="dark-mode"
            value="dark-mode"
            id="dark-mode"
            @click="dark_function()"
          />
          <label for="dark-mode"> 다크 모드</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="share-guesses"
            value="share-guesses"
            id="share-guesses"
            @click="test_time_result_render()"
          />
          <label for="share-guesses">
            결과 공유 텍스트에 추측 횟수 표시하기</label
          >
        </div>
        <div>
          <input
            type="checkbox"
            name="share-time"
            value="share-time"
            id="share-time"
          />
          <label for="share-time"> 결과 공유 텍스트에 걸린 시간 표시하기</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="share-top-guess"
            value="share-top-guess"
            id="share-top-guess"
            @click="test_similarity_render()"
          />
          <label for="share-top-guess">
            결과 공유 텍스트에 최대 유사도 표시하기</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const storage = window.localStorage;
const emit = defineEmits<{
  (e: "close_value", display_toggle: any): void;
}>();

function receive_closer() {
  console.log("close!!");
  emit("close_value", false);
}

function dark_function() {
  console.log("dark!");
  let darkMode = storage.getItem("darkMode");
  if (darkMode !== "true") {
    document.body.classList.add("dark");
    storage.setItem("darkMode", "true");
  } else {
    document.body.classList.remove("dark");
    storage.setItem("darkMode", "false");
  }
}

function test_time_result_render() {
  let test_time = storage.getItem("test_time");
  console.log(test_time);
  if (test_time === "false" || test_time === null) {
    storage.setItem("test_time", "true");
  } else {
    storage.setItem("test_time", "false");
  }
}

function test_similarity_render() {
  let test_similarity = storage.getItem("test_similarity");
  console.log(test_similarity);
  if (test_similarity === "false" || test_similarity === null) {
    storage.setItem("test_similarity", "true");
  } else {
    storage.setItem("test_similarity", "false");
  }
}

// 다크모드 유지
let darkMode = storage.getItem("darkMode");
if (darkMode === "true") {
  document.body.classList.add("dark");
}
</script>

<style scoped>
.border {
  border: 4mm ridge rgba(0, 0, 0, 0.6);
}
</style>

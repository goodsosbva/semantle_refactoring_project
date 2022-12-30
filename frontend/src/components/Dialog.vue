<template>
  <div>
    <div
      class="dialog-underlay"
      @wheel.prevent
      @touchmove.prevent
      @scroll.prevent
    ></div>
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
              v-model="dark_box"
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
              v-model="share_guesses_box"
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
              v-model="share_timer_box"
              @click="test_timer_result_render()"
            />
            <label for="share-time">
              결과 공유 텍스트에 걸린 시간 표시하기</label
            >
          </div>
          <div>
            <input
              type="checkbox"
              name="share-top-guess"
              value="share-top-guess"
              id="share-top-guess"
              v-model="share_top_guess_box"
              @click="test_similarity_render()"
            />
            <label for="share-top-guess">
              결과 공유 텍스트에 최대 유사도 표시하기</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUpdated, ref } from "vue";

const storage = window.localStorage;
const emit = defineEmits<{
  (e: "close_value", display_toggle: boolean): boolean;
  (e: "test_time_result_render", test_time_result_render: boolean): boolean;
  (e: "test_timer_result_render", test_timer_result_render: boolean): boolean;
  (e: "test_similarity_render", test_similarity_render: boolean): boolean;
}>();

const dark_value = storage.getItem("darkMode");

// 설정 관련
// const time_result_value = storage.getItem("time_result_render");
// const timer_result_value = storage.getItem("timer_result_render_toggle");
// const similarity_render_value = storage.getItem("similarity_render_toggle");

const test_time_result_render_toggle = ref<boolean>(false);
const test_similarity_render_toggle = ref<boolean>(false);
const test_timer_result_render_toggle = ref<boolean>(false);

// 토글 저장용 배열
const dark_box = ref<any>([]);
const share_guesses_box: any = []; // test_time.. 관련
const share_timer_box: any = [];
const share_top_guess_box: any = [];

// 토글 저장
if (dark_value === "true") {
  dark_box.value.push("dark-mode");
} else {
  dark_box.value.pop();
}

function onScroll() {
  console.log("zz");
}

function receive_closer() {
  emit("close_value", false);
}

function dark_function() {
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
  const time_result_value = storage.getItem("time_result_render");
  if (time_result_value === "true") {
    storage.setItem("time_result_render", "false");
  } else {
    storage.setItem("time_result_render", "true");
  }

  test_time_result_render_toggle.value = !test_time_result_render_toggle.value;
  console.log(test_time_result_render_toggle.value);
  emit("test_time_result_render", test_time_result_render_toggle.value);
}

function test_timer_result_render() {
  const timer_result_value = storage.getItem("timer_result_render_toggle");
  if (timer_result_value === "true") {
    storage.setItem("timer_result_render_toggle", "false");
  } else {
    storage.setItem("timer_result_render_toggle", "true");
  }

  test_timer_result_render_toggle.value =
    !test_timer_result_render_toggle.value;

  emit("test_timer_result_render", test_timer_result_render_toggle.value);
}

function test_similarity_render() {
  const similarity_render_value = storage.getItem("similarity_render_toggle");
  if (similarity_render_value === "true") {
    storage.setItem("similarity_render_toggle", "false");
  } else {
    storage.setItem("similarity_render_toggle", "true");
  }

  test_similarity_render_toggle.value = !test_similarity_render_toggle.value;
  emit("test_similarity_render", test_similarity_render_toggle.value);
  console.log("test_similarity_render()", test_similarity_render_toggle.value);
}

onBeforeMount(() => {
  const time_result_value = storage.getItem("time_result_render");
  const timer_result_value = storage.getItem("timer_result_render_toggle");
  const similarity_render_value = storage.getItem("similarity_render_toggle");

  let t_r_v = false;
  let tr_r_v = false;
  let s_r_v = false;
  if (time_result_value === "true") {
    t_r_v = true;
  } else {
    t_r_v = false;
  }

  if (timer_result_value === "true") {
    tr_r_v = true;
  } else {
    tr_r_v = false;
  }

  if (similarity_render_value === "true") {
    s_r_v = true;
  } else {
    s_r_v = false;
  }

  test_time_result_render_toggle.value = t_r_v;
  test_similarity_render_toggle.value = tr_r_v;
  test_timer_result_render_toggle.value = s_r_v;

  if (test_time_result_render_toggle.value) {
    share_guesses_box.push("share-guesses");
  } else {
    share_guesses_box.pop();
  }

  if (test_similarity_render_toggle.value) {
    share_timer_box.push("share-time");
  } else {
    share_timer_box.pop();
  }

  if (test_timer_result_render_toggle.value) {
    share_top_guess_box.push("share-top-guess");
  } else {
    share_top_guess_box.pop();
  }
});
</script>

<style></style>

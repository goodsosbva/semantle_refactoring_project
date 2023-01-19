<template>
  <div>
    <input
      ref="inputEl"
      type="hidden"
      :value="
        preface +
        '\n' +
        final_sentance1 +
        final_sentance2 +
        final_sentance3 +
        'https://github.com/goodsosbva/semantle_onBoarding'
      "
    />
    <!-- HTML !-->
    <button class="button-48" role="button" @click="handleCopy">
      <span class="text">기록 복사하기</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import type { GuessItemInterface } from "../interface";

const props = defineProps<{
  puzzle_number: number;
  guess_data: GuessItemInterface[];
  is_gave_up: boolean;
  is_display_count: boolean;
  is_display_time: boolean;
  is_display_similarity: boolean;
}>();

const storage = window.localStorage;
const inputEl = ref<null | HTMLInputElement>(null);
const preface = ref<string>("");

const stats = storage.getItem("stats");
const stats_obj = JSON.parse(stats as string);

// 추측 횟수 표시 관련
const test_time = stats_obj["totalGuesses"];
const result_time_sentance = ref<string>("");
if (test_time !== null) {
  result_time_sentance.value = "추측 횟수: " + test_time + "\n";
}

// 정렬용 함수
function sort_similarity(data: GuessItemInterface[]) {
  const tmp = [];
  for (let i = 0; i < data.length; i++) {
    tmp.push(data[i].similarity);
  }
  tmp.sort(function (a: any, b: any) {
    return b - a;
  });
  return tmp[1].toFixed(2);
}

// 최대 유사도 관련
function get_top_similarity(data: GuessItemInterface[]) {
  // 이기고 + 단어가 하나 더이상
  if (data.length > 1 && props.is_gave_up === false) {
    const sorted_data = sort_similarity(data);
    return sorted_data;
    // 단어가 없고, 포기하는 경우
  } else if (data.length === 1 && props.is_gave_up === true) {
    return "";
    // 단어는 넣었는데 포기하는 경우
  } else if (props.is_gave_up === true && data.length > 0) {
    const sorted_data = sort_similarity(data);
    return sorted_data;
  }
}
const top_similarity_sort = get_top_similarity(props.guess_data);
const result_similarity_sentance = ref<string>("");
if (top_similarity_sort !== undefined) {
  result_similarity_sentance.value =
    "최대 유사도: " + top_similarity_sort + "\n";
}

// 시간 관련
let endTime = storage.getItem("endTime") as string;
let startTime = storage.getItem("startTime") as string;
const time = Number(endTime) - Number(startTime);
let timeFormatted = new Date(time)
  .toISOString()
  .substr(11, 8)
  .replace(":", "시간")
  .replace(":", "분");
let timeInfo = `걸린 시간: ${timeFormatted}초\n`;
if (time > 24 * 3600000) {
  if (startTime === null) {
    timeInfo = "";
  } else {
    timeInfo = "걸린 시간: 24시간 이상\n";
  }
}

function prefaceCaseUpdate() {
  // 이긴 경우
  if (props.is_gave_up === false) {
    // 단어가 1개인 경우
    if (props.guess_data.length === 1) {
      preface.value = `이럴 수가! 첫번째 추측에서 ${props.puzzle_number}번째 꼬맨틀 정답 단어를 맞혔습니다!`;
    } else {
      preface.value = `${props.puzzle_number}번째 꼬맨틀을 풀었습니다`;
    }
    // 단어가 1개 이상인 경우
  } else {
    // 포기했는데 단어를 하나도 안친 경우
    if (props.guess_data.length === 1) {
      preface.value = `${props.puzzle_number}번째 꼬맨틀을 시도하지 않고 바로 포기했어요.`;
    }
    // 포기했지만, 단어가 여러개인 경우
    else {
      preface.value = `저런… ${props.puzzle_number}번째 꼬맨틀을 포기했어요..ㅠ`;
    }
  }
}

// 클립보드 복사
const handleCopyForIE = () => {
  inputEl?.value?.setAttribute("type", "text");
  inputEl?.value?.select();
  document.execCommand("copy");
  inputEl?.value?.setAttribute("type", "hidden");
  alert(`execCommand를 통해 내용이 복사되었습니다 ${props.puzzle_number}`);
};

const final_sentance1 = ref<string>("");
const final_sentance2 = ref<string>("");
const final_sentance3 = ref<string>("");

const handleCopy = async () => {
  if (props.is_display_count) {
    final_sentance1.value = result_time_sentance.value;
  } else {
    final_sentance1.value = "";
  }
  if (props.is_display_time) {
    final_sentance2.value = timeInfo;
  } else {
    final_sentance2.value = "";
  }
  if (props.is_display_similarity) {
    final_sentance3.value = result_similarity_sentance.value;
  } else {
    final_sentance3.value = "";
  }
  await nextTick();
  if (inputEl.value === null) {
    return;
  }
  if (!navigator.clipboard) {
    handleCopyForIE();
    return;
  }

  navigator.clipboard
    .writeText(inputEl.value.value)
    .then(() => alert("클립보드가 복사되었습니다"))
    .catch((e) => {
      handleCopyForIE();
    });
};

onMounted(async () => {
  prefaceCaseUpdate();
});
</script>

<style scoped>
.button {
  padding: 9px;
}

/* CSS */
.button-48 {
  appearance: none;
  background-color: #ffffff;
  border-width: 0;
  box-sizing: border-box;
  color: #000000;
  cursor: pointer;
  display: inline-block;
  font-family: Clarkson, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1em;
  margin: 0;
  opacity: 1;
  outline: 0;
  padding: 1.5em 2.2em;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-rendering: geometricprecision;
  text-transform: uppercase;
  transition: opacity 300ms cubic-bezier(0.694, 0, 0.335, 1),
    background-color 100ms cubic-bezier(0.694, 0, 0.335, 1),
    color 100ms cubic-bezier(0.694, 0, 0.335, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;
  border: 1px solid #000000;
}

.button-48:before {
  animation: opacityFallbackOut 0.5s step-end forwards;
  backface-visibility: hidden;
  background-color: #ebebeb;
  clip-path: polygon(-1% 0, 0 0, -25% 100%, -1% 100%);
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: translateZ(0);
  transition: clip-path 0.5s cubic-bezier(0.165, 0.84, 0.44, 1),
    -webkit-clip-path 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  width: 100%;
}

.button-48:hover:before {
  animation: opacityFallbackIn 0s step-start forwards;
  clip-path: polygon(0 0, 101% 0, 101% 101%, 0 101%);
}

.button-48:after {
  background-color: #ffffff;
}

.button-48 span {
  z-index: 1;
  position: relative;
}
</style>

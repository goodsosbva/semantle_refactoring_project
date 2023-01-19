<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <Banner></Banner>
    <div class="container">
      <div class="game-box">
        <header>
          <h2 class="title-box">꼬맨틀 - 단어 유사도 추측 게임</h2>
          <Menu
            v-model:is_display_count="is_display_count"
            v-model:is_display_time="is_display_time"
            v-model:is_display_similarity="is_display_similarity"
            v-model:is_graph_show="is_graph_show"
          ></Menu>
        </header>
        <SimilarityStory :puzzle_number="puzzle_number"></SimilarityStory>
        <Error :error_text="error_text"></Error>
        <GuessForm @guess="guessHandler"></GuessForm>
        <!-- chartjs -->
        <div v-if="is_graph_show">
          <InputBasicChartVue
            :guess_data="guess_data"
            :is_graph_show="is_graph_show"
          ></InputBasicChartVue>
        </div>
        <div class="result-box">
          <Result
            v-if="is_game_ended"
            :puzzle_number="puzzle_number"
            :guess_data="guess_data"
            :today_guess_count_until_ended="today_guess_count_until_ended"
            :stats="(stats as StatsInterface)"
            :is_gave_up="is_gave_up"
            :is_display_count="is_display_count"
            :is_display_time="is_display_time"
            :is_display_similarity="is_display_similarity"
          ></Result>
          <AnswerListTable
            v-if="guess_data.length > 0"
            :last_word="last_word"
            :last_word_index="last_word_index"
            :guess_data="guess_data"
          ></AnswerListTable>
        </div>

        <!-- HTML !-->
        <button class="button-49" type="button" @click="giveUp()">
          포기하기
        </button>
      </div>
      <Footer
        :puzzle_number="puzzle_number"
        :yesterday_keyword="yesterday_keyword"
      ></Footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import { getYesterday, giveUp as giveUpApi, submitGuess } from "../api";
import type {
  GuessResultInterface,
  GuessErrorInterface,
  GuessCacheInterface,
  GuessItemInterface,
  StatsInterface,
} from "../interface";

import Banner from "../components/Banner.vue";
import Menu from "../components/Menu.vue";
import SimilarityStory from "../components/SimilarityStory.vue";
import Error from "../components/Error.vue";
import GuessForm from "../components/GuessForm.vue";
import Footer from "../components/Footer.vue";
import Result from "../components/Result.vue";
import AnswerListTable from "../components/AnswerListTable.vue";
import { findGuess, todayPuzzleNumber } from "../functions/util";
import InputBasicChartVue from "@/components/BasciChart/InputBasicChart.vue";
import { useFlagStore } from "@/stores/lists";
import { storeToRefs } from "pinia";

const puzzle_number = todayPuzzleNumber();

const yesterday_keyword = ref<string>("");
const error_text = ref<string>("");

// 이제까지 입력했던 값들 데이터 저장용
const cache: GuessCacheInterface = {};
const storage = window.localStorage;

// 데이터 저장용
const guess_data = ref<GuessItemInterface[]>([]);

// 가장 마지막 추측 관련 변수
const last_word = ref<GuessItemInterface | null>(null);
const last_word_index = ref<number | null>(null);

const is_game_ended = ref<boolean>(false);
const is_gave_up = ref<boolean>(false);
const today_guess_count_until_ended = ref<number>(0);

// dark 관련
// const is_dark = ref<boolean>(false);
const store = useFlagStore();
const { flag, getFalgData } = storeToRefs(store);

//

const is_display_count = ref<boolean>(true);
const is_display_time = ref<boolean>(true);
const is_display_similarity = ref<boolean>(true);
const is_graph_show = ref<boolean>(true);

const stats = ref<StatsInterface | null>(null);

async function cachedSubmitGuess(
  puzzle_number: number,
  word: string
): Promise<GuessResultInterface | GuessErrorInterface | null> {
  if (cache.hasOwnProperty(word)) {
    return cache[word];
  }
  const result = await submitGuess(puzzle_number, word);
  if (result?.hasOwnProperty("guess")) {
    cache[word] = result as GuessResultInterface;
  }
  return result;
}

function loadStats() {
  const stats_json = storage.getItem("stats");
  if (stats_json === null) {
    stats.value = null;
    return;
  }
  stats.value = JSON.parse(stats_json) as StatsInterface;
}

function saveStats() {
  storage.setItem("stats", JSON.stringify(stats.value));
}

function saveStartTime() {
  storage.setItem("startTime", String(Date.now()));
}

function saveEndTime() {
  storage.setItem("endTime", String(Date.now()));
}

function initStats() {
  const loacal_storage_stats = loadStats();
  if (stats.value === null || loacal_storage_stats === null) {
    stats.value = {
      abandons: 0, // 클리어하지 않고 버린 게임
      firstPlay: puzzle_number,
      giveups: 0,
      lastEnd: puzzle_number - 1,
      lastPlay: puzzle_number,
      playStreak: 0,
      totalGuesses: 0,
      totalPlays: 0,
      winStreak: 0,
      wins: 0,
    };
    saveStats();
  } else {
    if (stats.value["lastPlay"] !== puzzle_number) {
      // 다른 날짜일때 사라져야할 변수 및 상황 정리
      is_game_ended.value = false;
      storage.removeItem("winState");
      storage.removeItem("guesses");
      storage.removeItem("today_guess_count_until_ended");

      const on_streak = stats.value["lastPlay"] === puzzle_number - 1;
      if (on_streak) {
        stats.value["playStreak"] += 1;
      } else {
        stats.value["playStreak"] = 0;
      }
      if (stats.value["lastEnd"] != puzzle_number - 1) {
        stats.value["abandons"] += 1;
      }
      stats.value["totalPlays"] += 1;
      stats.value["lastPlay"] = puzzle_number;
    }
    saveStats();
  }
}

async function guessHandler(word: string) {
  let guess = word.trim().replace("!", "").replace("*", "").replace(/\//g, "");
  const submit_word = await cachedSubmitGuess(puzzle_number, guess);

  if (submit_word === null) {
    error_text.value = "알 수 없는 오류입니다.";
    return;
  }

  if (submit_word?.hasOwnProperty("error")) {
    const error = submit_word as GuessErrorInterface;
    if (error.error === "error") {
      error_text.value = "서버가 응답하지 않습니다. 나중에 다시 시도해보세요.";
      return;
    } else if (error.error === "unknown") {
      error_text.value = `${guess}은(는) 알 수 없는 단어입니다.`;
      return;
    }
  } else {
    // 제대로된 정답 후보인 경우
    const result = submit_word as GuessResultInterface;

    // 처음 단어를 입력했을 때 시작시간 저장
    if (storage.getItem("startTime") === null) {
      saveStartTime();
    }

    error_text.value = "";

    // 중복 체크
    // guess_data : 체크해야할 데이터들 목록
    const found = findGuess(guess_data.value, result.guess);
    if (found !== null) {
      last_word.value = found.guess_item;
      last_word_index.value = found.index;
      return;
    }

    // 결과 추가 기록 용
    const game_item = {
      cnt: guess_data.value.length + 1,
      word: guess,
      similarity: result.sim * 100,
      rank: String(result.rank),
    } as GuessItemInterface;

    guess_data.value.push(game_item);

    last_word.value = game_item;
    last_word_index.value = game_item.cnt;

    if (stats.value !== null) {
      stats.value.totalGuesses += 1;
      saveStats();
      if (!is_game_ended.value) {
        today_guess_count_until_ended.value += 1;
        storage.setItem(
          "today_guess_count_until_ended",
          String(today_guess_count_until_ended.value)
        );
      }
    }

    // 정답이면?
    if (game_item.similarity === 100 && !is_game_ended.value) {
      is_game_ended.value = true;
      is_gave_up.value = false;
      // 종료 시간 저장
      saveEndTime();
      // 클리어 기록
      storage.setItem("winState", "1");

      if (stats.value !== null) {
        stats.value.winStreak += 1;
        stats.value.wins += 1;
        stats.value.lastEnd = puzzle_number;
        saveStats();
      }
    }
    storage.setItem("guesses", JSON.stringify(guess_data.value));
  }
}

// 포기하기
async function giveUp() {
  if (!is_game_ended.value) {
    if (confirm("정말로 포기하시겠습니까?")) {
      // 정답 단어 fetch
      const secret = await giveUpApi(puzzle_number);
      const guess_item = {
        cnt: guess_data.value.length + 1,
        word: secret,
        similarity: 100,
        rank: "정답",
      } as GuessItemInterface;

      // 종료 시간 저장
      saveEndTime();

      // 최신 단어 따로 표기
      last_word.value = guess_item;
      last_word_index.value = guess_item.cnt;
      guess_data.value.push(guess_item);

      storage.setItem("winState", "0");
      is_game_ended.value = true;
      is_gave_up.value = true;

      storage.setItem("guesses", JSON.stringify(guess_data.value));

      if (stats.value !== null) {
        stats.value.winStreak = 0;
        stats.value.giveups += 1;
        stats.value.lastEnd = puzzle_number;
        saveStats();
      }
    }
  }
}

// dark 관련
watch(
  () => store.flag,
  (new_value) => {
    if (new_value) {
      storage.setItem("darkMode", "true");
      document.body.classList.add("dark");
    } else {
      storage.setItem("darkMode", "false");
      document.body.classList.remove("dark");
    }
  }
);

watch(is_display_count, async (new_value) => {
  if (new_value) {
    storage.setItem("shareGuesses", "true");
  } else {
    storage.setItem("shareGuesses", "false");
  }
});
watch(is_display_time, async (new_value) => {
  if (new_value) {
    storage.setItem("shareTime", "true");
  } else {
    storage.setItem("shareTime", "false");
  }
});
watch(is_display_similarity, async (new_value) => {
  if (new_value) {
    storage.setItem("shareTopGuess", "true");
  } else {
    storage.setItem("shareTopGuess", "false");
  }
});

// chatjs 관련
const init_graph_show = ref<boolean>(true);
if (storage.getItem("showGraph") !== null) {
  if (storage.getItem("showGraph") === "true") {
    init_graph_show.value = true;
  } else {
    init_graph_show.value = false;
  }
  is_graph_show.value = init_graph_show.value;
}
watch(is_graph_show, async (new_value) => {
  if (new_value) {
    storage.setItem("showGraph", "true");
  } else {
    storage.setItem("showGraph", "false");
  }
});

async function loadBasicInfo() {
  // 설정값 불러오기
  // dark 관련
  store.flag = storage.getItem("darkMode") === "true";

  // 초기 설정값 true로 바꿔주는 코드
  if (storage.getItem("init") === null) {
    storage.setItem("init", "init_complete");

    storage.setItem("shareGuesses", "true");
    storage.setItem("shareTime", "true");
    storage.setItem("shareTopGuess", "true");
  }

  is_display_count.value = storage.getItem("shareGuesses") === "true";
  is_display_time.value = storage.getItem("shareTime") === "true";
  is_display_similarity.value = storage.getItem("shareTopGuess") === "true";

  const yesterday = await getYesterday(puzzle_number);
  if (yesterday !== null) {
    yesterday_keyword.value = yesterday;
  }

  // 처음 게임한 stats 값 초기화용
  initStats();

  // 로컬에서 데이터 꺼내오기 (초기화)
  const guesses_obj = JSON.parse(storage.getItem("guesses") as string); //
  if (guesses_obj !== null) {
    guess_data.value = guesses_obj;
  }

  const loaded_today_guess_count_until_ended = storage.getItem(
    "today_guess_count_until_ended"
  );
  if (loaded_today_guess_count_until_ended !== null) {
    today_guess_count_until_ended.value = Number.parseInt(
      loaded_today_guess_count_until_ended
    );
  } else {
    today_guess_count_until_ended.value = 0;
  }

  // 클리어 체크용
  const win_state = storage.getItem("winState");
  if (win_state === "1") {
    is_game_ended.value = true;
    is_gave_up.value = false;
  } else if (win_state === "0") {
    is_game_ended.value = true;
    is_gave_up.value = true;
  } else {
    storage.getItem("winState");
  }
}

onMounted(async () => {
  await loadBasicInfo();
});
</script>

<style scoped>
/* CSS */
.title-box {
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
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 4px -6px;
}

.result-box {
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

/* CSS - givueUp btn */
.button-49,
.button-49:after {
  width: 150px;
  height: 77px;
  line-height: 71px;
  font-size: 20px;
  font-family: "Bebas Neue", sans-serif;
  background: linear-gradient(45deg, transparent 5%, rgb(56 145 248 / 20%) 5%);
  border: 0;
  color: rgba(0, 0, 0, 0.777);
  letter-spacing: 3px;
  box-shadow: 6px 0px 0px rgb(255, 0, 0);
  outline: transparent;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-49:after {
  --slice-0: inset(50% 50% 50% 50%);
  --slice-1: inset(80% -6px 0 0);
  --slice-2: inset(50% -6px 30% 0);
  --slice-3: inset(10% -6px 85% 0);
  --slice-4: inset(40% -6px 43% 0);
  --slice-5: inset(80% -6px 5% 0);

  content: "한번 더 해보아요!";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 3%,
    rgba(0, 0, 139, 0.267) 3%,
    rgba(0, 0, 139, 0.267) 5%,
    #ff013c 5%
  );
  text-shadow: -3px -3px 0px #f8f005, 3px 3px 0px rgba(0, 0, 139, 0.267);
  clip-path: var(--slice-0);
}

.button-49:hover:after {
  animation: 1s glitch;
  animation-timing-function: steps(2, end);
}

@keyframes glitch {
  0% {
    clip-path: var(--slice-1);
    transform: translate(-20px, -10px);
  }
  10% {
    clip-path: var(--slice-3);
    transform: translate(10px, 10px);
  }
  20% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 10px);
  }
  30% {
    clip-path: var(--slice-3);
    transform: translate(0px, 5px);
  }
  40% {
    clip-path: var(--slice-2);
    transform: translate(-5px, 0px);
  }
  50% {
    clip-path: var(--slice-3);
    transform: translate(5px, 0px);
  }
  60% {
    clip-path: var(--slice-4);
    transform: translate(5px, 10px);
  }
  70% {
    clip-path: var(--slice-2);
    transform: translate(-10px, 10px);
  }
  80% {
    clip-path: var(--slice-5);
    transform: translate(20px, -10px);
  }
  90% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 0px);
  }
  100% {
    clip-path: var(--slice-1);
    transform: translate(0);
  }
}

@media (min-width: 768px) {
  .button-49,
  .button-49:after {
    width: 200px;
    height: 77px;
    line-height: 71px;
  }
}
</style>

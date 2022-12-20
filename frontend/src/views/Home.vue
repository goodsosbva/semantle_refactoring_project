<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { getSimilarityStory, getYesterday, submitGuess } from "../api";
import type {
  SimilarityStoryInterface,
  GuessResultInterface,
  GuessErrorInterface,
  GuessCacheInterface,
  SortTargetInterface,
  GuessItemInterface,
} from "../interface";

import Banner from "../components/Banner.vue";
import Menu from "../components/Menu.vue";
import Dialog from "../components/Dialog.vue";
import SimilarityStory from "../components/SimilarityStory.vue";
import Error from "../components/Error.vue";
import GuessForm from "../components/GuessForm.vue";
import Footer from "../components/Footer.vue";
import Result from "../components/Result.vue";
import FailResult from "../components/FailResult.vue";
import AnswerListTable from "../components/AnswerListTable.vue";

// 중복 체크 함수
import { duplicateChk } from "../functions/dupchk";

const num_puzzle = 4650;
const initial_date = new Date("2022-04-01T00:00:00+09:00");
const puzzle_number =
  Math.floor((new Date().getTime() - initial_date.getTime()) / 86400000) %
  num_puzzle;

const yesterday_keyword = ref<string>("");
const last_similarity_story = ref<SimilarityStoryInterface | null>(null);
// const input_word = ref<string>("");
const error_text = ref<string>("");

// 이제 까지 입력했던 값들 데이터 저장용.
const cache: GuessCacheInterface = {};
const storage = window.localStorage;
// 추측 관련
let game_over_dashboard: string = "false";
let idx: number = 1;
let new_word_idx = -1;

// 데이터 저장용
const guess_data = ref<GuessItemInterface[]>([]);

// 가장 마지막에 온놈 관련 변수.
// guess_data[guess_data.length]
let last_word = ref<GuessItemInterface | null>(null);

let answering_top_row = ref<any>(false);
let result_dashboard = ref<any>(false);

// 결과창 대쉬 보드 관련
let chal_number: number = 1; // 이제까지 도전한 횐수
let ans_number: number = 0; // 정답을 맞춘 총 횟수
let conti_ans_number: number = 0;
let giveup_number: number = 0;
const today_chel_number: number = 0;
const is_give_up = ref<boolean>(false);
const first_play = ref<number>(-1);

let game_clear: string = "-1";

// 첫날
const first_day: string | null = storage.getItem("firstday");
// const first_day: string | null = "127";

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

// 어제날짜 테스트용 함수
function test_btn() {
  const chk_stats_puzzle_number = storage.getItem("stats");
  const change_puzzle_number = JSON.parse(chk_stats_puzzle_number as string);
  change_puzzle_number["puzzle_number"] = puzzle_number - 1;
  const str_puzzle_number = JSON.stringify(change_puzzle_number);
  storage.setItem("stats", str_puzzle_number);
}

// 결과창 데이터 기록용 함수
function getStats() {
  const oldStats = storage.getItem("stats");
  if (oldStats == null) {
    const stats = {
      puzzle_number: puzzle_number,
      chal_number: chal_number, // 도전한 게임 횟수
      ans_number: ans_number,
      conti_ans_number: conti_ans_number,
      giveup_number: giveup_number,
      today_chel_number: today_chel_number,
    };
    storage.setItem("stats", JSON.stringify(stats));
    storage.setItem("firstday", String(puzzle_number));
    return stats;
  } else {
    // 이전이랑 현재의 하루가 다들때!
    const old_stats_obj = JSON.parse(oldStats);

    if (old_stats_obj["puzzle_number"] !== puzzle_number) {
      // 이전날에 포기 & 성공 결과가 사라지게 하려고
      storage.setItem("give_up", "false");
      storage.setItem("game_clear", "-1");

      old_stats_obj["puzzle_number"] = puzzle_number;
      old_stats_obj["today_chel_number"] = 0;
      // 어제의 ans가 -1이면 정답을 못맞춘 것
      old_stats_obj["conti_ans_number"] = 0;
      storage.setItem("stats", JSON.stringify(old_stats_obj));

      // 이전의 추측들 비우기 - 도전횟수도 초기화
      storage.removeItem("guesses");
      guess_data.value = [];

      // 날짜가 다르면 총 도전 횟수도 1증가!
      const chk_stats_chel = storage.getItem("stats");
      const chk_stats_chel_obj = JSON.parse(chk_stats_chel as string);
      chk_stats_chel_obj["chal_number"]++;
      chal_number = chk_stats_chel_obj["chal_number"];
      console.log(chk_stats_chel_obj);
      storage.setItem("stats", JSON.stringify(chk_stats_chel_obj));
    }
    return old_stats_obj;
  }
}

//
async function guessHandler(word: string) {
  let guess = word.trim().replace("!", "").replace("*", "").replace(/\//g, "");
  const submit_word = await cachedSubmitGuess(puzzle_number, guess);
  answering_top_row.value = true;
  sessionStorage.setItem("answering_top_row", answering_top_row.value);

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
    // 제대로된 정답 후보인 경우
  } else {
    const result = submit_word as GuessResultInterface;

    error_text.value = "";
    // 중복 체크
    // guess_data : 체크해야할 데이터들 목록
    if (duplicateChk(guess_data.value, result.guess)) {
      return;
    }

    // 결과 추가 기록 용
    let percentile = result.rank;
    let similarity = result.sim * 100;

    const tmp = {
      cnt: idx,
      word: guess,
      similarity: similarity,
      rank: String(percentile),
    };

    console.log(guess_data);

    guess_data.value.push(tmp);
    // last word for memorize
    last_word.value = tmp;
    // 가장 최신에 들어온 친구
    // table
    new_word_idx = tmp.cnt;
    console.log(last_word);
    console.log(guess_data);
    // guess_count++;
    const old_stats = storage.getItem("stats");
    const stats = JSON.parse(old_stats as string); //
    console.log(stats);
    stats["today_chel_number"]++;
    const new_stats = JSON.stringify(stats);
    storage.setItem("stats", new_stats);
    idx++;

    // 정답이면?
    if (tmp.similarity === 100 && game_clear === "-1") {
      // 포기 버튼 사라지게
      // game_over_dashboard = "true";
      result_dashboard.value = true;
      game_clear = "1";
      // 클리어 기록
      storage.setItem("game_clear", game_clear);

      // 성공 횟수 기록
      const old_stats = storage.getItem("stats");
      const stats = JSON.parse(old_stats as string); //
      stats["ans_number"]++;
      // stats["chal_number"]++;
      stats["conti_ans_number"]++;
      ans_number++;
      // chal_number++;
      conti_ans_number++;

      ans_number = stats["ans_number"];
      const new_stats = JSON.stringify(stats);
      storage.setItem("stats", new_stats);
    }

    // 로컬 저장소 저장 작업 시작!!
    // 순서, 추측한 단어, 유사도, 유사도 순위 순으로 저장
    console.log(guess_data.value);
    storage.setItem("guesses", JSON.stringify(guess_data.value));
    console.log(storage.getItem("guesses"));
  }
}

async function loadBasicInfo() {
  const yesterday = await getYesterday(puzzle_number);
  if (yesterday !== null) {
    yesterday_keyword.value = yesterday;
  }

  const similarityStory = await getSimilarityStory(puzzle_number);
  if (similarityStory !== null) {
    last_similarity_story.value = similarityStory;
  }

  // 로컬에서 데이터 꺼내오기 (초기화)
  const guesses_obj = JSON.parse(storage.getItem("guesses") as string); //
  if (guesses_obj !== null) {
    guess_data.value = guesses_obj;
  }

  // 처음 게임한 stats 값 초기화용
  getStats();

  // 인덱스 초기화
  if (guess_data.value !== null) {
    idx = guess_data.value.length + 1;
    console.log(guess_data.value);
  } else {
    idx = 1;
  }

  // 클리어 체크용
  const chk_game_clear = storage.getItem("game_clear");
  if (chk_game_clear === "1") {
    result_dashboard = true;
  }
  // 기브업 체크용
  const chk_give_up = storage.getItem("give_up");
  if (chk_give_up === "true") {
    game_over_dashboard = "true";
  }

  // 결과창 새로고침해도 안사라지게
  const str_stats = storage.getItem("stats");
  const obj_stats = JSON.parse(str_stats as string);
  console.log(obj_stats);
  chal_number = obj_stats["chal_number"]; // 이제까지 도전한 횐수
  ans_number = obj_stats["ans_number"]; // 정답을 맞춘 총 횟수
  conti_ans_number = obj_stats["conti_ans_number"];
  giveup_number = obj_stats["giveup_number"];
  if (sessionStorage.getItem("answering_top_row") !== null) {
    answering_top_row.value = Boolean(
      sessionStorage.getItem("answering_top_row")
    );
  }
}

// 포기하기
async function giveUp() {
  console.log("giveup!!!");
  if (game_over_dashboard === "false") {
    if (confirm("정말로 포기하시겠습니까?")) {
      game_over_dashboard = "true";
      const url = "/giveup/" + puzzle_number;
      // 정답 단어 fetch
      const secret = await (await fetch(url)).text();
      const tmp = {
        cnt: idx,
        word: secret, // proxy...알아두길..
        similarity: 100,
        rank: "정답",
      };

      // 최신 단어 따로 표기
      last_word.value = tmp;

      guess_data.value.push(tmp);

      // 로컬 추측 목록에 포기 답안 넣기
      const guesses = storage.getItem("guesses");

      // if - 시도도 안하고 포기 했을 때
      if (guesses === null) {
        const str_tmp = JSON.stringify([tmp]);
        storage.setItem("guesses", str_tmp);
      } else {
        const obj_guesses = JSON.parse(guesses as string);
        obj_guesses.push(tmp);
        storage.setItem("guesses", JSON.stringify(obj_guesses));
      }

      const stats = storage.getItem("stats");
      const stats_obj = JSON.parse(stats as string); //
      console.log(stats_obj);
      stats_obj["today_chel_number"]++;

      // [o]. 포기 했으니 포기 카운트 1올리고,
      // [o]. 연속 정답 횟수 0으로 만들고,
      stats_obj["giveup_number"]++;
      // stats_obj["chal_number"]++;
      stats_obj["conti_ans_number"] = 0;

      giveup_number = stats_obj["giveup_number"];
      conti_ans_number = stats_obj["conti_ans_number"];
      const stats_str = JSON.stringify(stats_obj);
      storage.setItem("stats", stats_str);
      // 로컬에 포기 표시
      storage.setItem("give_up", "true");
    }
  }
}

onMounted(async () => {
  await loadBasicInfo();
});
</script>
<template>
  <Banner></Banner>
  <div class="container">
    <header>
      <h2>꼬맨틀 - 단어 유사도 추측 게임</h2>
      <!-- 설정 -->
      <Menu></Menu>
    </header>
    <!-- 작업!TODO -->
    <SimilarityStory
      v-if="last_similarity_story !== null"
      :puzzle_number="puzzle_number"
      :top="last_similarity_story.top"
      :top10="last_similarity_story.top10"
      :rest="last_similarity_story.rest"
    ></SimilarityStory>
    <!-- 오류 위치 태그 -->
    <Error :error_text="error_text"></Error>

    <!-- 꼬멘틀 추측 -->
    <GuessForm @guess1="guessHandler"></GuessForm>
    <div id="response"></div>
    <Result
      v-if="result_dashboard"
      :puzzle_number="puzzle_number"
      :chal_number="chal_number"
      :ans_number="ans_number"
      :conti_ans_number="conti_ans_number"
      :giveup_number="giveup_number"
      :today_chal_number="guess_data.length"
      :first_day="first_day"
      :guess_data="guess_data"
    ></Result>
    <FailResult
      v-if="game_over_dashboard === 'true'"
      :puzzle_number="puzzle_number"
      :chal_number="chal_number"
      :ans_number="ans_number"
      :conti_ans_number="conti_ans_number"
      :giveup_number="giveup_number"
      :today_chal_number="guess_data.length"
      :first_day="first_day"
    ></FailResult>
    <AnswerListTable
      :new_word_idx="new_word_idx"
      :answering_top_row="answering_top_row"
      :last_word="last_word"
      :guess_data="guess_data"
    ></AnswerListTable>

    <input
      type="button"
      value="포기하기"
      id="give-up-btn"
      class="button"
      @click="giveUp()"
      v-if="game_over_dashboard !== 'true'"
    />
    <input type="button" value="testbtn" class="button" @click="test_btn()" />

    <Footer
      :puzzle_number="puzzle_number"
      :yesterday_keyword="yesterday_keyword"
    ></Footer>
  </div>
</template>

<style scoped></style>

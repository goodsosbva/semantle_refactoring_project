<script setup lang="ts">
import { onMounted, ref } from "vue";

import { getSimilarityStory, getYesterday, submitGuess } from "./api";
import type {
  SimilarityStoryInterface,
  GuessResultInterface,
  GuessErrorInterface,
  GuessCacheInterface,
} from "./interface";

import Banner from "./components/Banner.vue";
import Menu from "./components/Menu.vue";
import Dialog from "./components/Dialog.vue";
import SimilarityStory from "./components/SimilarityStory.vue";
import Error from "./components/Error.vue";
import GuessForm from "./components/GuessForm.vue";
import Footer from "./components/Footer.vue";
import Reusult from "./components/Result.vue";
import FailResult from "./components/FailResult.vue";
import BarGraphVue from "./components/BarGraph.vue";

// 정렬 관련 함수
import { number_sort, word_sort, similarity_sort } from "./sorts";
// 중복 체크 함수
import { duplicateChk } from "./functions/dupchk";

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
// let guess_count = ref<any>(0);
let game_over_dashboard: string = "false";
let idx: number = 1;
// 데이터 저장용
const guess_data = ref<any>([]);

// 가장 마지막에 온놈 관련 변수.
// guess_data[guess_data.length]
let last_word: any = [];
let last_word_toggle: number = -1;

let answering_top_row = ref<any>(true);
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

// 정렬 관련 toggle용
const sort_toggle = ref<any>([1, 1, 1]);

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

// 추측 시작 - 날짜가 다르면 초기화 해주는 함수
function dayCheck() {
  // 목표. 현재 퍼즐넘버랑 저장된 퍼즐 넘버랑 다르면 guesses 초기화
  const chk_stats_puzzle_number = storage.getItem("stats");

  const before_puzzle_number = JSON.parse(chk_stats_puzzle_number as string);
  if (before_puzzle_number.puzzle_number === null) {
    return true;
  } else {
    if (before_puzzle_number.puzzle_number !== String(puzzle_number)) {
      return false;
    }
  }
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

    // 도전 횟수 증가용 (처음 +1) Q. 이게 있어야 맞느거 같은데 없어야 맞음 왜지?
    // const chk_stats_chel = storage.getItem("stats");
    // const chk_stats_chel_obj = JSON.parse(chk_stats_chel as string);
    // chk_stats_chel_obj["chal_number"]++;
    // chal_number = chk_stats_chel_obj["chal_number"];
    // console.log(chk_stats_chel_obj);
    // storage.setItem("stats", JSON.stringify(chk_stats_chel_obj));

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
    } else {
      // 도전 횟수 증가용
      // const chk_stats_chel = storage.getItem("stats");
      // const chk_stats_chel_obj = JSON.parse(chk_stats_chel as string);
      // chk_stats_chel_obj["chal_number"]++;
      // console.log(chk_stats_chel_obj);
      // storage.setItem("stats", JSON.stringify(chk_stats_chel_obj));
    }
    return old_stats_obj;
  }
}

// guesses에 넣는 함수
function guess_store_handler(data: any) {
  // 순서, 추측한 단어, 유사도, 유사도 순위 순으로 저장
  // console.log(data);
  storage.setItem("guesses", JSON.stringify(data));
  return data;
}

//
async function guessHandler(word: string) {
  let guess = word.trim().replace("!", "").replace("*", "").replace(/\//g, "");
  const submit_word = await cachedSubmitGuess(puzzle_number, guess);
  // q. 갑자기 true/false가 왜 안먹지?
  answering_top_row.value = true;

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
    let similarity = (result.sim * 100.0).toFixed(2);

    const tmp = {
      cnt: idx,
      word: guess,
      similarity: similarity,
      rank: percentile,
    };

    console.log(guess_data);

    guess_data.value.push(tmp);
    // last word for memorize
    last_word = [idx, guess, similarity, percentile];
    console.log(last_word);
    // 마지막 단어가 있다면 다르게 출력하는 용.
    last_word_toggle = 1;
    // guess_count++;
    const old_stats = storage.getItem("stats");
    const stats = JSON.parse(old_stats as string); //
    stats["today_chel_number"]++;
    const new_stats = JSON.stringify(stats);
    storage.setItem("stats", new_stats);
    idx++;

    // 정답이면?
    if (tmp.similarity === "100.00" && game_clear === "-1") {
      // 포기 버튼 사라지게
      game_over_dashboard = "false";
      result_dashboard = true;
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

    // 1. 첫 시작인 경우 로컬 초기화 - 어제한게 겹쳐졌는지도 체크
    // const is_ok = dayCheck();

    // 2. 인풋이 들어갈때 마다 로컬 guesses[]에 내가 입력한 단어의 결과값들이 저장되게 한다.
    // 2-1. 지금이랑 저장된 puz_num이 같은 경우
    // 2-2. 다른 경우, 이전에 있던 로컬을 모두 지우는것.
    // if (is_ok) {
    guess_store_handler(guess_data.value);
    // } else {
    //   storage.removeItem("guesses");
    //   guess_store_handler(guess_data.value);
    // }
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
      // console.log(secret);

      const tmp = {
        cnt: idx,
        word: "[정답 단어가 들어가야 함]", // Q. 이상함 (정답을 줘야 하는데 html dom 트리를 줌..)
        similarity: 100,
        rank: 1,
      };

      guess_data.value.push(tmp);

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
      <Menu></Menu>
    </header>
    <!-- 설정 부분 TODO -->
    <Dialog></Dialog>
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
    <Reusult
      v-if="result_dashboard"
      :puzzle_number="puzzle_number"
      :chal_number="chal_number"
      :ans_number="ans_number"
      :conti_ans_number="conti_ans_number"
      :giveup_number="giveup_number"
      :today_chal_number="guess_data.length"
    ></Reusult>
    <FailResult
      v-if="game_over_dashboard === 'true'"
      :puzzle_number="puzzle_number"
      :chal_number="chal_number"
      :ans_number="ans_number"
      :conti_ans_number="conti_ans_number"
      :giveup_number="giveup_number"
      :today_chal_number="guess_data.length"
    ></FailResult>
    <table id="guesses">
      <!-- v-if="answering" -->
      <tbody>
        <tr v-if="answering_top_row === true">
          <th id="chronoOrder" @click="number_sort(sort_toggle, guess_data)">
            #
          </th>
          <th id="alphaOrder" @click="word_sort(guess_data)">추측한 단어</th>
          <th id="similarityOrder" @click="similarity_sort(guess_data)">
            유사도
          </th>
          <th>유사도 순위</th>
          <br />
        </tr>
        <!-- 가장 최근 입력! -->
        <tr>
          <td>{{ last_word[0] }}</td>
          <td id="heighlight">{{ last_word[1] }}</td>
          <td>{{ last_word[2] }}</td>
          <td
            v-if="
              last_word[3] !== '1000위 이상' &&
              last_word_toggle === 1 &&
              last_word[3] !== '정답!'
            "
          >
            <BarGraphVue
              v-if="last_word_toggle === 1"
              :value="last_word[3]"
            ></BarGraphVue>
          </td>
          <td v-if="last_word[3] === '정답!'">{{ last_word[3] }}</td>
          <td v-if="last_word[3] === '1000위 이상'">{{ last_word[3] }}</td>
        </tr>
        <!-- 밑 줄 -->
        <tr>
          <td colspan="4"><hr id="line" /></td>
        </tr>
        <!-- 마지막 단어가 막 들어온 경우 -->
        <tr
          v-if="last_word_toggle === 1"
          v-for="(word, index) in guess_data.slice(0, guess_data.length - 1)"
          :key="index"
        >
          <td>{{ word.cnt }}</td>
          <td>{{ word.word }}</td>
          <td>{{ word.similarity }}</td>
          <td v-if="word.rank !== '1000위 이상' && word.rank !== '정답!'">
            <BarGraphVue :value="word.rank"></BarGraphVue>
          </td>
          <td v-if="word.rank === '정답!'">{{ word.rank }}</td>
          <td v-if="word.rank === '1000위 이상'">{{ word.rank }}</td>
        </tr>
        <!-- 막 안들어온 경우 -->
        <tr
          v-if="last_word_toggle === -1"
          v-for="(word, index) in guess_data"
          :key="index"
        >
          <td>{{ word.cnt }}</td>
          <td>{{ word.word }}</td>
          <td>{{ word.similarity }}</td>
          <td v-if="word.rank !== '1000위 이상' && word.rank !== '정답!'">
            <BarGraphVue :value="word.rank"></BarGraphVue>
          </td>
          <td v-if="word.rank === '정답!'">{{ word.rank }}</td>
          <td v-if="word.rank === '1000위 이상'">{{ word.rank }}</td>
        </tr>
      </tbody>
    </table>

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

<style>
#line {
  height: 1px;
}
#heighlight {
  color: rgb(19, 92, 201);
  font-weight: bold;
}
</style>

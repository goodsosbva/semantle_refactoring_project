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

const num_puzzle = 4650;
const initial_date = new Date("2022-04-01T00:00:00+09:00");
const puzzle_number =
  Math.floor((new Date().getTime() - initial_date.getTime()) / 86400000) %
  num_puzzle;

const yesterday_keyword = ref<string>("");
const last_similarity_story = ref<SimilarityStoryInterface | null>(null);
const input_word = ref<string>("");
const error_text = ref<string>("");

// 이제 까지 입력했던 값들 데이터 저장용.
const cache: GuessCacheInterface = {};

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
      input_word.value = "";
      return;
    }
  }
  const result = submit_word as GuessResultInterface;

  guess = result.guess;
  console.log(guess);
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
    <!-- 설정 부분 =TODO -->
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
    <GuessForm @guess="guessHandler"></GuessForm>
    <div id="response"></div>
    <table id="guesses"></table>

    <input type="button" value="포기하기" id="give-up-btn" class="button" />

    <Footer
      :puzzle_number="puzzle_number"
      :yesterday_keyword="yesterday_keyword"
    ></Footer>
  </div>
</template>

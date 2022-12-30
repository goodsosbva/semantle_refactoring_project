import type {
  SimilarityStoryInterface,
  GuessResultInterface,
  GuessErrorInterface,
  NearestItemInterface,
} from "./interface";

// 어제 정답 조회
export async function getYesterday(
  puzzle_number: number
): Promise<string | null> {
  const url = "/yesterday/" + puzzle_number;
  try {
    return (await fetch(url)).text();
  } catch (e) {
    return null;
  }
}

// 상위 유사도 정보 조회
export async function getSimilarityStory(
  puzzle_number: number
): Promise<SimilarityStoryInterface | null> {
  const url = "/similarity/" + puzzle_number;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

// 단어 추측 결과 조회
export async function submitGuess(
  puzzle_number: number,
  word: string
): Promise<GuessResultInterface | GuessErrorInterface | null> {
  const url = "/guess/" + puzzle_number + "/" + word;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

// 유사도 목록 조회
export async function nearest1kData(
  puzzle_number: number
): Promise<NearestItemInterface[] | null> {
  const url = "/nearest1k-data/" + puzzle_number;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

// 포기한 단어 조회
export async function giveUp(puzzle_number: number): Promise<string | null> {
  const url = "/giveup/" + puzzle_number;
  const response = await fetch(url);
  try {
    return await response.text();
  } catch (e) {
    return null;
  }
}


import type {
  SimilarityStoryInterface,
  GuessResultInterface,
  GuessErrorInterface,
} from "./interface";

// 어제 정답
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

// 유사도 힌트
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

// 정답 보내는 로직
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

// 어제 정답 + 유사도 목록들
// /nearest1k-data/<int:day>
export async function nearest1k_data(puzzle_number: number): Promise<any> {
  const url = "/nearest1k-data/" + puzzle_number;
  console.log(url);
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

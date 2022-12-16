<template>
  <h1>클립보드 구현하기</h1>
  <div>
    <p class="clipboard">Merry X-mas</p>
    <input ref="inputEl" type="hidden" value="그만 행복하세요 ^^7" />
    <button @click="handleCopy">클립보드 복사하기</button>
  </div>
  <input type="text" placeholder="복사한 것을 붙여넣으세요" />
</template>

<script setup>
import { ref } from "vue";

// 숨겨진 요소를 직접 접근할 수 있도록 변수를 선언
const inputEl = ref(null);

const handleCopyForIE = () => {
  // hidden이었던 input의 타입을 text로 변경한다.
  inputEl.value.setAttribute("type", "text");
  // input을 선택한다.
  inputEl.value.select();
  // 복사를 수행한다.
  document.execCommand("copy");
  // text 타입을 hidden으로 변경한다.
  inputEl.value.setAttribute("type", "hidden");
  alert("execCommand를 통해 내용이 복사되었습니다");
};

const handleCopy = () => {
  if (inputEl.value === null) {
    return;
  }
  // clipboard를 지원하지 않는다면,
  // execCommand를 통해 복사할 수 있도록 한다.
  if (!navigator.clipboard) {
    handleCopyForIE();
    return;
  }
  navigator.clipboard
    .writeText(inputEl.value.value)
    .then(() => alert("clipboard API를 통해 내용이 복사되었습니다"))
    .catch(() => handleCopyForIE());
};
</script>

<template>
  <div>
    <!-- value="이럴 수가! 첫번째 추측에서 260번째 꼬맨틀 정답 단어를 맞췄습니다!
            https://semantle-ko.newsjel.ly/" -->
    <input
      ref="inputEl"
      type="hidden"
      :value="
        '이럴 수가! 첫번째 추측에서 ' +
        puzzle_number +
        '번째 꼬맨틀 정답 단어를 맞췄습니다! https://semantle-ko.newsjel.ly/'
      "
    />
    <button @click="handleCopy" class="button">기록 복사하기</button>
  </div>
</template>

<!-- "post.title + ' by ' + post.author.name" -->

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  puzzle_number: number;
}>();

const inputEl = ref<null | HTMLInputElement>(null);

const handleCopyForIE = () => {
  inputEl?.value?.setAttribute("type", "text");
  inputEl?.value?.select();
  document.execCommand("copy");
  inputEl?.value?.setAttribute("type", "hidden");
  alert(`execCommand를 통해 내용이 복사되었습니다 ${props.puzzle_number}`);
};

const handleCopy = () => {
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
      console.log(e.message);
      handleCopyForIE();
    });
};
</script>
<!-- <script>
import { ref } from "vue";

export default {
  name: "Clip",
  props: {
    puzzle_number: Number,
  },
  setup() {
    const inputEl = ref(null);

    const handleCopyForIE = () => {
      inputEl.value.setAttribute("type", "text");
      inputEl.value.select();
      document.execCommand("copy");
      inputEl.value.setAttribute("type", "hidden");
      alert(`execCommand를 통해 내용이 복사되었습니다 ${props.puzzle_number}`);
    };

    const handleCopy = () => {
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
          console.log(e.message);
          handleCopyForIE();
        });
    };

    return {
      inputEl,
      handleCopy,
    };
  },
};
</script> -->

<style scoped>
.clipboard {
  padding: 1rem;
  border: 1px solid gray;
}
.button {
  padding: 9px;
  margin-bottom: -15px;
}
</style>

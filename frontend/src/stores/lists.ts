// stores/list.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFlagStore = defineStore("flag", () => {
  const flag = ref(false);
  function toggleFlag() {
    flag.value = !flag.value;
  }
  const getFalgData = computed(() => flag.value);
  return { flag, toggleFlag, getFalgData };
});

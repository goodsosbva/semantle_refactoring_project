<template>
  <nav id="menu" class="white-bg">
    <button
      aria-label="Settings"
      class="overlay-button"
      id="settings-button"
      @click="is_show_dialog = !is_show_dialog"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
        ></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>
  </nav>
  <Dialog
    v-if="is_show_dialog"
    @clicked_close="is_show_dialog = false"
    :is_dark="is_dark"
    :is_display_count="is_display_count"
    :is_display_time="is_display_time"
    :is_display_similarity="is_display_similarity"
    @update:is_dark="(v) => emit('update:is_dark', v)"
    @update:is_display_count="(v) => emit('update:is_display_count', v)"
    @update:is_display_time="(v) => emit('update:is_display_time', v)"
    @update:is_display_similarity="
      (v) => emit('update:is_display_similarity', v)
    "
  ></Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "./Dialog.vue";

const is_show_dialog = ref<boolean>(false);

const props = defineProps<{
  is_dark: boolean;
  is_display_count: boolean;
  is_display_time: boolean;
  is_display_similarity: boolean;
}>();

const emit = defineEmits<{
  (e: "update:is_dark", is_dark: boolean): void;
  (e: "update:is_display_count", is_display_count: boolean): void;
  (e: "update:is_display_time", is_display_time: boolean): void;
  (e: "update:is_display_similarity", is_display_similarity: boolean): void;
}>();
</script>


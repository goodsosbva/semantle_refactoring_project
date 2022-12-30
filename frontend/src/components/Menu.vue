<template>
  <!-- 설정 톱니바퀴 TODO -->
  <nav id="menu" class="white-bg">
    <button
      aria-label="Settings"
      class="overlay-button"
      id="settings-button"
      @click="click_deliver()"
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
  <!-- 설정 부분 TODO -->
  <Dialog
    v-if="diplay_toggle"
    @close_value="click_close"
    @test_time_result_render="test_time_result_render_deliver"
    @test_timer_result_render="test_timer_result_render_deliver"
    @test_similarity_render="test_similarity_render_deliver"
  ></Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "./Dialog.vue";

const diplay_toggle = ref<boolean>(false);

const emit = defineEmits<{
  (e: "close_value", display_toggle: boolean): boolean;
  (e: "test_time_result_render", test_time_result_render: boolean): boolean;
  (e: "test_timer_result_render", test_timer_result_render: boolean): boolean;
  (e: "test_similarity_render", test_similarity_render: boolean): boolean;
  (e: "diplay_toggle_value", diplay_toggle: boolean): boolean;
}>();

function click_deliver() {
  diplay_toggle.value = !diplay_toggle.value;
}

function click_close(close_value: any) {
  console.log(close_value);
  diplay_toggle.value = close_value;
}

function test_time_result_render_deliver(test_time_result_render: any) {
  emit("test_time_result_render", test_time_result_render);
}

function test_timer_result_render_deliver(test_timer_result_render: any) {
  emit("test_timer_result_render", test_timer_result_render);
}

function test_similarity_render_deliver(test_similarity_render: any) {
  emit("test_similarity_render", test_similarity_render);
}
</script>

<style scoped></style>

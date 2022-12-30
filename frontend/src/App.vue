<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/words">About</router-link> |
  </div> -->
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
const storage = window.localStorage;

// 다크모드 유지
let darkMode = storage.getItem("darkMode");
if (darkMode === "true") {
  document.body.classList.add("dark");
}
</script>

<style></style>

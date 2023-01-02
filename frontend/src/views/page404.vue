<template>
  <div>
    <img src="../assets/404/2205_w046_n004_125b_p1_125.jpg" class="image404" />
    <router-link to="/" class="back-from-404"
      >메인 페이지로 돌아가기</router-link
    >
  </div>
</template>

<script setup lang="ts"></script>

<style setup>
.image404 {
  width: 50%;
  height: 50%;
  position: absolute;
  top: 25%;
  left: 25%;
}
.back-from-404 {
  width: 50%;
  height: 50%;
  position: absolute;
  top: 25%;
  left: 25%;
  text-decoration: none;
}
</style>

<template>
  <div id="error" v-if="error_text.length > 0" style="color: #ff0000">
    {{ error_text }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error_text: string;
}>();
</script>

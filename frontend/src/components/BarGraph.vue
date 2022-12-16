<template>
  <td class="close">
    <span class="percentile">{{ props.value }}</span
    >&nbsp;
    <span class="progress-container">
      <span
        class="progress-bar"
        :style="{
          width: caculated_value + 'px',
        }"
        >&nbsp;</span
      >
    </span>
  </td>
</template>

<script setup lang="ts">
import { barCaculate } from "@/functions/barCaculate";
const props = defineProps<{
  value: number;
}>();

const caculated_value = barCaculate(props.value);
</script>

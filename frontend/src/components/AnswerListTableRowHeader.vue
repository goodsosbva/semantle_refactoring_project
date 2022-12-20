<template>
  <tr>
    <th id="chronoOrder" @click="emit('update_sort', 'number')">#</th>
    <th id="alphaOrder" @click="emit('update_sort', 'word')">추측한 단어</th>
    <th id="similarityOrder" @click="emit('update_sort', 'similarity')">
      유사도
    </th>
    <th>유사도 순위</th>
    <br />
  </tr>
</template>

<script setup lang="ts">
import type { SortTargetInterface } from "@/interface";

const emit = defineEmits<{
  (e: "update_sort", sort_target: SortTargetInterface): void;
}>();
</script>


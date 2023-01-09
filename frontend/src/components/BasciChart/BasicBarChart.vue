<template>
  <div>
    <canvas ref="barChart" />
  </div>
</template>

<script setup lang="ts">
import type { NearestItemInterface } from "@/interface";
import { Chart, registerables } from "chart.js";
import { computed, onMounted, ref, watch } from "vue";
Chart.register(...registerables);

const barChart = ref<any>();

const props = defineProps<{
  nearest_items: NearestItemInterface[];
}>();

const data = ref<any>({
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
});

const options = ref<any>({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

function createChart() {
  new Chart(barChart.value, {
    type: "bar",
    data: data.value,
    options: options,
  });
}

onMounted(() => {
  console.log(props.nearest_items);
  createChart();
});

// array of multiple sources
watch(props.nearest_items, (new_nearest_item) => {
  console.log("watch!");
  console.log(new_nearest_item);
});
</script>

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

const barChart = ref<HTMLCanvasElement>();

const props = defineProps<{
  nearest_items: NearestItemInterface[];
}>();

interface ChartTypes {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }
  ];
}

interface OptionTypes {
  scales: {
    y: {
      beginAtZero: boolean;
    };
  };
}

const datas = ref<ChartTypes>({
  labels: [],
  datasets: [
    {
      label: "Top 10 유사도",
      data: [],
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

const options = ref<OptionTypes>({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

const random_rgb = function () {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  let result = `rgba(${r}, ${g}, ${b}, 0.2)`;
  return result;
};

function createChart() {
  new Chart(barChart.value as HTMLCanvasElement, {
    type: "polarArea",
    data: datas.value,
    options: options.value,
  });
}

onMounted(() => {
  createChart();
});

watch(
  () => props.nearest_items.length,
  () => {
    let new_date = [];
    for (let i = 0; i < props.nearest_items.length; i++) {
      if (i === 10) break;
      datas.value.labels.push(props.nearest_items[i].word);
      const random_color = random_rgb();
      datas.value.datasets[0].backgroundColor.push(random_color);
      new_date.push(props.nearest_items[i].similarity);
    }
    datas.value.datasets[0].data = new_date;
  }
);

const nearest_top10_push = computed(() => {});
</script>

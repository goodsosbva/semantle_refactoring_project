<template>
  <div>
    <canvas ref="barChart" />
  </div>
</template>

<script setup lang="ts">
import type { GuessItemInterface, NearestItemInterface } from "@/interface";
import { Chart, registerables } from "chart.js";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
Chart.register(...registerables);

const barChart = ref<HTMLCanvasElement | null>(null);
const init = ref<boolean>(false);
const flash = ref<boolean>(true);

const props = defineProps<{
  guess_data: GuessItemInterface[];
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

const datas = shallowRef<ChartTypes>({
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

const options = shallowRef<OptionTypes>({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

const myChart = shallowRef<Chart | null>(null);

const random_rgb = function (): string {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  let result = `rgba(${r}, ${g}, ${b}, 0.2)`;
  return result;
};

function show_graph() {
  flash.value = !flash.value;
}

// Q. 루트에 놓으면, 인식을 못하고 Failed to create chart: can't acquire context from the given item
// 온마운트에 놓으면 접근을 못함
// Watch안에 놓으면 exceed오류가 또 나옴
// 함수로 호출해도 마찬가지로 못찾음
// 어떻게 해야 할까요?

watch(
  () => props.guess_data.length,
  () => {
    console.log("watch!", props.guess_data[0]);
    if (init.value === false) {
      if (myChart.value !== null) {
        for (let i = 0; i < props.guess_data.length; i++) {
          myChart.value.data.labels?.push(props.guess_data[i].word);
          myChart.value.data.datasets[0].data.push(
            props.guess_data[i].similarity
          );
          if (myChart.value.data.datasets[0].backgroundColor) {
            const rgb = random_rgb();
            myChart.value.data.datasets[0].backgroundColor.push(rgb);
          }
        }
        // debugger;
        myChart.value.update();
        init.value = true;
      }
    } else {
      if (myChart.value !== null) {
        myChart.value.data.labels?.push(
          props.guess_data[props.guess_data.length - 1].word
        );
        myChart.value.data.datasets[0].data.push(
          props.guess_data[props.guess_data.length - 1].similarity
        );
        if (myChart.value.data.datasets[0].backgroundColor) {
          const rgb = random_rgb();
          myChart.value.data.datasets[0].backgroundColor.push(rgb);
          console.log(typeof myChart.value.data.datasets[0].backgroundColor);
        }
        myChart.value.update();
      }
    }
  }
);

onMounted(() => {
  if (barChart.value !== null) {
    myChart.value = new Chart(barChart.value, {
      type: "line",
      data: datas.value,
      options: options.value,
    });
  }
});
</script>

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
const max_value = ref<number | null>(null);

const props = defineProps<{
  guess_data: GuessItemInterface[];
  is_graph_show: boolean;
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

const datas = shallowRef<any>({
  data: {
    datasets: [
      {
        label: "현재 유사도",
        data: [],
        // this dataset is drawn below
        order: 2,
      },
      {
        label: "최대 유사도",
        data: [],
        type: "line",
        // this dataset is drawn on top
        order: 1,
      },
    ],
    labels: [],
  },
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

function max_value_caculate(total_data: GuessItemInterface[]) {
  let max_value_candidate_obj = total_data[0];
  for (let i = 0; i < total_data.length; i++) {
    if (total_data[i].similarity > max_value_candidate_obj.similarity) {
      max_value_candidate_obj = total_data[i];
    }
  }

  return max_value_candidate_obj;
}

watch(
  () => props.guess_data.length,
  () => {
    console.log("watch!", props.guess_data);
    max_value.value = props.guess_data[0].similarity;

    if (init.value === false) {
      if (myChart.value !== null) {
        for (let i = 0; i < props.guess_data.length; i++) {
          myChart.value.data.labels?.push(props.guess_data[i].word);
          myChart.value.data.datasets[0].data.push(
            props.guess_data[i].similarity
          );

          if (max_value.value > props.guess_data[i].similarity) {
            myChart.value.data.datasets[1].data.push(max_value.value);
          } else {
            max_value.value = props.guess_data[i].similarity;
            myChart.value.data.datasets[1].data.push(max_value.value);
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
        //
        max_value.value = max_value_caculate(props.guess_data).similarity;
        console.log(max_value.value);
        if (
          max_value.value >
          props.guess_data[props.guess_data.length - 1].similarity
        ) {
          myChart.value.data.datasets[1].data.push(max_value.value);
        } else {
          max_value.value =
            props.guess_data[props.guess_data.length - 1].similarity;
          myChart.value.data.datasets[1].data.push(max_value.value);
        }

        myChart.value.update();
      }
    }
  }
);

// Q. 되지만
// watch(
//   () => props.is_graph_show,
//   () => {
//     console.log("watch2!");
//   }
// );

onMounted(() => {
  if (barChart.value !== null) {
    myChart.value = new Chart(barChart.value, {
      type: "bar",
      data: datas.value.data,
      options: options.value,
    });
  }

  console.log(props.is_graph_show);
  if (props.is_graph_show && props.guess_data.length !== 0) {
    console.log(props.guess_data);
    max_value.value = props.guess_data[0].similarity;

    if (init.value === false) {
      if (myChart.value !== null) {
        for (let i = 0; i < props.guess_data.length; i++) {
          myChart.value.data.labels?.push(props.guess_data[i].word);
          myChart.value.data.datasets[0].data.push(
            props.guess_data[i].similarity
          );

          if (max_value.value > props.guess_data[i].similarity) {
            myChart.value.data.datasets[1].data.push(max_value.value);
          } else {
            max_value.value = props.guess_data[i].similarity;
            myChart.value.data.datasets[1].data.push(max_value.value);
          }
        }
        // debugger;
        myChart.value.update();
        init.value = true;
      }
    }
  }
});
</script>

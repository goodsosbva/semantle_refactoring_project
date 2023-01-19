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
const max_labels = ref<string[]>([]);

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
  plugins: {
    tooltip: {
      callbacks: {
        title: (context: []) => string | string[] | undefined;
      };
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
  plugins: {
    tooltip: {
      callbacks: {
        title: function (context: []) {
          if (context[0].length > 0 && context) {
            if (context[0].datasetIndex === 0) {
              console.log(context);
              return context[0].label;
            }
            return max_labels.value[context[0].dataIndex];
          }
        },
      },
    },
  },
});

const myChart = shallowRef<Chart | null>(null);

function max_value_caculate(total_data: GuessItemInterface[]) {
  let max_value_candidate_obj = total_data[0];
  for (let i = 0; i < total_data.length; i++) {
    if (total_data[i].similarity > max_value_candidate_obj.similarity) {
      max_value_candidate_obj = total_data[i];
    }
  }

  return max_value_candidate_obj;
}

function caculate_labels_and_value(
  max_label: string | null,
  max_value: number,
  i: number
) {
  if (myChart.value !== null) {
    myChart.value.data.labels?.push(props.guess_data[i].word);
    myChart.value.data.datasets[0].data.push(props.guess_data[i].similarity);

    if (max_label === null) {
      max_label = max_value_caculate(props.guess_data).word;
    }

    if (max_value > props.guess_data[i].similarity) {
      myChart.value.data.datasets[1].data.push(max_value);
    } else {
      max_value = props.guess_data[i].similarity;
      myChart.value.data.datasets[1].data.push(max_value);
      max_label = props.guess_data[i].word;
    }
    max_labels.value.push(max_label);
  }
  return { max_label: max_label, max_value: max_value };
}

watch(
  () => props.guess_data.length,
  () => {
    let max_value = props.guess_data[0].similarity;
    let max_label = null;

    if (init.value === false) {
      if (myChart.value !== null) {
        for (let i = 0; i < props.guess_data.length; i++) {
          // i
          const result = caculate_labels_and_value(max_label, max_value, i);
          max_label = result.max_label;
          max_value = result.max_value;
        }
        // debugger;
        myChart.value.update();
        init.value = true;
      }
    } else {
      if (myChart.value !== null) {
        max_value = max_value_caculate(props.guess_data).similarity;

        const result = caculate_labels_and_value(
          max_label,
          max_value,
          props.guess_data.length - 1
        );
        max_label = result.max_label;
        max_value = result.max_value;

        myChart.value.update();
      }
    }
  }
);

onMounted(() => {
  if (barChart.value !== null) {
    myChart.value = new Chart(barChart.value, {
      type: "bar",
      data: datas.value.data,
      options: options.value,
    });
  }

  if (props.is_graph_show && props.guess_data.length !== 0) {
    let max_value = props.guess_data[0].similarity;
    let max_label = null;

    console.log(props.guess_data);
    max_value = props.guess_data[0].similarity;

    if (init.value === false) {
      if (myChart.value !== null) {
        for (let i = 0; i < props.guess_data.length; i++) {
          const result = caculate_labels_and_value(max_label, max_value, i);
          max_label = result.max_label;
          max_value = result.max_value;
        }
        // debugger;
        myChart.value.update();
        init.value = true;
      }
    }
  }
});
</script>

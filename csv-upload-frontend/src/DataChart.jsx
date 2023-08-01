import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";

const createPoints = (sample) => {
  const pointsArray = [];

  for (const region in sample) {
    pointsArray.push({ x: region, y: sample[region]["stiffness"] });
  }

  // console.log(pointsArray);
  return pointsArray;
};

const createLabels = (dataObj) => {
  const labels = [];
  console.log(dataObj);
  for (const sample in dataObj) {
    for (const region in dataObj[sample]) {
      labels.push(region);
    }
  }
  console.log(labels);
};

const createDatasets = (dataObj) => {
  const datasets = [];
  for (const sample in dataObj) {
    const sampleObj = {
      label: sample,
      data: createPoints(dataObj[sample]),
      borderColor: "#f87979",
      backgroundColor: "rgb(255, 99, 132)",
      showLine: true,
    };
    datasets.push(sampleObj);
  }
  return datasets;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DataChart = ({ samples }) => {
  console.log(samples);
  const projName = Object.keys(samples)[0];
  const data = {
    datasets: createDatasets(samples),
  };
  const options = {
    scales: {
      x: {
        type: "category",
        labels: createLabels(samples),
        position: "bottom",
      },
    },
  };
  createDatasets(samples);
  return (
    <>
      <Scatter options={options} data={data} />
    </>
  );
};

export default DataChart;

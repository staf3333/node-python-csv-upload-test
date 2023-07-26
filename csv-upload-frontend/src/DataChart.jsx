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

const createPoints = (dataObj) => {
  const pointsArray = [];
  for (const sample in dataObj) {
    for (const region in dataObj[sample]) {
      pointsArray.push({ x: region, y: dataObj[sample][region]["stiffness"] });
    }
  }
  console.log(pointsArray);
  return pointsArray;
};

const createLabels = (dataObj) => {
  const labels = [];
  for (const sample in dataObj) {
    for (const region in dataObj[sample]) {
      labels.push(region);
    }
  }
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
    datasets: [
      {
        label: projName,
        data: createPoints(samples),
        borderColor: "#f87979",
        backgroundColor: "rgb(255, 99, 132)",
        showLine: true,
      },
    ],
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
  return (
    <>
      <Scatter options={options} data={data} />
    </>
  );
};

export default DataChart;

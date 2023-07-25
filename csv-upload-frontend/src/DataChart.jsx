import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
//   const createPoints = (x, y) => {
//     if (x.length !== y.length) {
//       return undefined;
//     }
//     const pointsArray = [];
//     for (let i = 0; i < x.length; i++) {
//       pointsArray.push({ x: x[i], y: y[i] });
//     }
//     return pointsArray;
//   };
const createPoints = (dataObj) => {
  const pointsArray = [];
  for (const sample in dataObj) {
    console.log(typeof sample);
    for (const region in dataObj[sample]) {
      // console.log(region, dataObj[sample][region]);
      pointsArray.push({ x: region, y: dataObj[sample][region] });
    }
  }
  console.log(pointsArray);
  return pointsArray;
};

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const DataChart = ({ stiffData }) => {
  // console.log(stiffData);
  const data = {
    datasets: [
      {
        label: "Scatter Dataset",
        // data: [
        //   {
        //     x: -10,
        //     y: 0,
        //   },
        //   {
        //     x: 0,
        //     y: 10,
        //   },
        //   {
        //     x: 10,
        //     y: 5,
        //   },
        //   {
        //     x: 0.5,
        //     y: 5.5,
        //   },
        // ],
        data: createPoints(stiffData),
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };
  const options = {
    scales: {
      x: {
        type: "category",
        labels: [
          "1AP",
          "1ML",
          "2AP",
          "2AP2",
          "2ML",
          "3AP",
          "3ML",
          "4AP",
          "4ML",
          "5AP",
          "5ML",
        ],
        position: "bottom",
      },
    },
  };
  // createPoints(stiffData);
  return (
    <>
      <Scatter options={options} data={data} />
    </>
  );
};

export default DataChart;

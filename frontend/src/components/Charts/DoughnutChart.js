// src/components/Charts/DoughnutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = ({ data, options }) => {
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;

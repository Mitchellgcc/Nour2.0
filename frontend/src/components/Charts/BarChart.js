// src/components/Charts/BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, options }) => {
  const defaultOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Bar Chart',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 14
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Values',
          font: {
            size: 14
          }
        }
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return <Bar data={data} options={mergedOptions} />;
};

export default BarChart;

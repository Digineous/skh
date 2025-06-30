import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = () => {
  const data = {
    labels: ['10', '20', '30', '40', '50', '60', '70'],
    datasets: [
      {
        label: false,
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: 'black' 
        },
        grid: {
          color: 'grey' 
        }
      },
      y: {
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'grey'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'black' 
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default LineChart;

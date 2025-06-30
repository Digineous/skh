

import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ data, labels, title, xAxisLabel, yAxisLabel }) => {
  const chartData = {
    series: [
      {
        name: title,
        data: data,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 250,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
        title: {
          text: xAxisLabel,
          style: {
            color: 'black', 
          },
        },
        labels: {
          style: {
            colors: 'black', 
          },
        },
      },
      yaxis: {
        title: {
          text: yAxisLabel,
          style: {
            color: 'black', 
          },
        },
        labels: {
          style: {
            colors: 'black',
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#4caf50'], 
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return <Chart options={chartData.options} series={chartData.series} type="bar" height={200} />;
};

export default BarChart;

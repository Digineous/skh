import React from "react";
import Chart from "react-apexcharts";

const RadialBarChart = ({ percentage, color }) => {
  const options = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: 'black',
            fontSize: '16px'
          },
          value: {
            color: 'black',
            fontSize: '26px',
            offsetY: -10,
          }
        }
      }
    },
    colors: [color],
    labels: [''],
  };

  const series = [percentage];

  return (
    <Chart
      options={options}
      series={series}
      type="radialBar"
      height={250}
      width={250}
    />
  );
};

export default RadialBarChart;

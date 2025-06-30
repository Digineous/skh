// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   PointElement, 
//   LineElement, 
//   Title, 
//   Tooltip, 
//   Legend 
// } from 'chart.js';
// import { Typography } from '@mui/material';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const VoltageChart = () => {
//   const voltageData = prepareVoltageData();
  
//   if (voltageData.length === 0) {
//     return <Typography color="text.secondary">No voltage data available</Typography>;
//   }

//   const labels = voltageData.map(item => item.time);
  
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: 'Voltage R',
//         data: voltageData.map(item => item.voltageR),
//         borderColor: 'red',
//         backgroundColor: 'rgba(255,0,0,0.1)',
//         pointStyle: 'triangle',
//       },
//       {
//         label: 'Voltage Y',
//         data: voltageData.map(item => item.voltageY),
//         borderColor: 'yellow',
//         backgroundColor: 'rgba(255,255,0,0.1)',
//         pointStyle: 'circle',
//       },
//       {
//         label: 'Voltage B',
//         data: voltageData.map(item => item.voltageB),
//         borderColor: 'blue',
//         backgroundColor: 'rgba(0,0,255,0.1)',
//         pointStyle: 'rect',
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Voltage Chart',
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Time'
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Voltage (V)'
//         }
//       }
//     }
//   };

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// const CurrentChart = () => {
//   const currentData = prepareCurrentData();
  
//   if (currentData.length === 0) {
//     return <Typography color="text.secondary">No current data available</Typography>;
//   }

//   const labels = currentData.map(item => item.time);
  
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: 'Current R',
//         data: currentData.map(item => item.currentR),
//         borderColor: 'red',
//         backgroundColor: 'rgba(255,0,0,0.1)',
//         pointStyle: 'triangle',
//       },
//       {
//         label: 'Current Y',
//         data: currentData.map(item => item.currentY),
//         borderColor: 'yellow',
//         backgroundColor: 'rgba(255,255,0,0.1)',
//         pointStyle: 'circle',
//       },
//       {
//         label: 'Current B',
//         data: currentData.map(item => item.currentB),
//         borderColor: 'blue',
//         backgroundColor: 'rgba(0,0,255,0.1)',
//         pointStyle: 'rect',
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Current Chart',
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Time'
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Current (A)'
//         }
//       }
//     }
//   };

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export { VoltageChart, CurrentChart };
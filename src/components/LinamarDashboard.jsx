




import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../api/baseUrl";
import LineChart from "./LineChart";
import BarChart from "./BarChart"; 
import RadialBarChart from "./RadialBarChart"; 

export default function LinamarDashboard() {
  const [graphData, setGraphData] = useState([]);
  const [kwhData, setKwhData] = useState([]);
  const [kwhLabels, setKwhLabels] = useState([]);

  const boxData = [
    { heading: 'Actual Production', value: '33', color: 'grey.200', height: 100 },
    { heading: 'Target', value: '47', color: 'grey.300', height: 100 },
    { heading: 'Gap', value: '14', color: 'grey.400', height: 100 },
    { heading: 'MTTR in Min', value: '.38', color: 'grey.500', height: 100 },
    { heading: 'MTBF in Min', value: '.25', color: 'grey.600', height: 100 },
    { heading: 'Quality Offered', value: '33', color: 'grey.700', height: 100 },
  ];

  useEffect(() => {
    fetchGraphData();
    const interval = setInterval(() => {
      fetchGraphData();
    }, 30000); 
    return () => clearInterval(interval); 
  }, []);

  const fetchGraphData = async () => {
    try {
      const url = `${baseUrl}/common/energyMeasurements/5`;
      const token = localStorage.getItem("token");

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      //console.log("Electrical measurements data:", data);

      if (Array.isArray(data)) {
        setGraphData(data);
        const last15Entries = data.slice(-15);
        const last15KwhData = last15Entries.map(entry => entry.kwh);
        const last15KwhLabels = last15Entries.map(entry => entry.dateTimeRecvd);
        setKwhData(last15KwhData);
        setKwhLabels(last15KwhLabels);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error during getting em data:", error);
      throw error;
    }
  };

  const chartData = [
    { title: 'Quality %', chart: <RadialBarChart percentage={75} color="#00acc1" /> },
    { title: 'QEE %', chart: <RadialBarChart percentage={65} color="#f44336" /> },
    { title: 'Part Produced Per Hour', chart: <BarChart data={[]} labels={[]} title="Parts Produced Per Hour" xAxisLabel="Time" yAxisLabel="Parts" /> },
    { title: 'KWH', chart: <BarChart data={kwhData} labels={kwhLabels} title="KWH" xAxisLabel="DateTime Received" yAxisLabel="KWH" /> },
    { title: 'Utilization %', chart: <RadialBarChart percentage={85} color="#4caf50" /> },
    { title: 'Up Time %', chart: <RadialBarChart percentage={95} color="#ffeb3b" /> },
    { title: 'Energy Per Production', chart: <LineChart /> },
    { title: 'Down Time in Mins', chart: <LineChart /> },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2}>
        {boxData.map((box, index) => (
          <Grid item xs={12} sm={6} md={2} key={index}>
            <Paper elevation={3}>
              <Box height={box.height} display="flex" flexDirection="column">
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgcolor="white"
                >
                  <Typography sx={{ color: 'rgba(3, 3, 62, 0.9)', fontWeight: 'bold' }}>
                    {box.heading}
                  </Typography>
                </Box>
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgcolor="rgba(3, 3, 62, 0.9)"
                >
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                    {box.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
       {chartData.map((data, index) => (
  <Grid item xs={12} sm={6} md={3} key={index}>
    <Paper
      elevation={3}
      style={{ padding: 20, backgroundColor: "rgba(3, 3, 62, 0.9)" }}
    >
      <Box height={220} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography sx={{ color: 'white', fontWeight: 'bold', marginBottom: 0 }}>{data.title}</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          {data.chart}
        </Box>
      </Box>
    </Paper>
  </Grid>
))}
      </Grid>
    </div>
  );
}


// import { Box, Grid, Paper, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../api/baseUrl";


// import LineChart from "./LineChart";
// import BarChart from "./BarChart";
// import GaugeChart from "./ArctweenChart";

// export default function LinamarDashboard() {
//   const [graphData, setGraphData] = useState([]);

//   const boxData = [
//     { heading: 'Actual Production', value: '33', color: 'grey.200', height: 100 },
//     { heading: 'Target', value: '47', color: 'grey.300', height: 100 },
//     { heading: 'Gap', value: '14', color: 'grey.400', height: 100 },
//     { heading: 'MTTR in Min', value: '.38', color: 'grey.500', height: 100 },
//     { heading: 'MTBF in Min', value: '.25', color: 'grey.600', height: 100 },
//     { heading: 'Quality Offered', value: '33', color: 'grey.700', height: 100 },
//   ];
//   const arcData1 = { percentage: 75, color: "#00acc1" };
//   const arcData2 = { percentage: 65, color: "#f44336" };
//   const arcData3 = { percentage: 85, color: "#4caf50" };
//   const arcData4 = { percentage: 95, color: "#ffeb3b" };

//   useEffect(() => {
//    fetchGraphData()
//   }, []);

//   const fetchGraphData=async()=>{
//     try {
//       const url = `${baseUrl}/common/energyMeasurements/5`;
//       const token=localStorage.getItem("token")
     
//       const data = await axios.get(url, {headers:{
//           Authorization:`Bearer ${token}`
//       }});
//       setGraphData(data.data.kwh)
//       //console.log("Electrical measurements data in linamar :",data.data.kwh)
//       return data;
//     } catch (error) {
//       console.error("Error during getting em data in linamar :", error);
//       throw error;
//   }
//   }
//   const chartData = [
//     { title: 'Quality %', chart: <GaugeChart width={200} height={200} {...arcData1} /> },
//     { title: 'QEE %', chart: <GaugeChart width={200} height={200} percentage={65} /> },
//     { title: 'Part Produced Per Hour', chart: <BarChart /> },
//     { title: 'KWH', chart: <BarChart /> },
//     { title: 'Utilization %', chart: <GaugeChart width={200} height={200} percentage={85} /> },
//     { title: 'Up Time %', chart: <GaugeChart width={200} height={200} percentage={95} /> },
//     { title: 'Energy Per Production', chart: <LineChart /> },
//     { title: 'Down Time in Mins', chart: <LineChart /> },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <Grid container spacing={2}>
//         {boxData.map((box, index) => (
//           <Grid item xs={12} sm={6} md={2} key={index}>
//             <Paper elevation={3}>
//               <Box height={box.height} display="flex" flexDirection="column">
//                 <Box
//                   flex={1}
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   bgcolor="white"
//                 >
//                   <Typography sx={{ color: 'rgba(3, 3, 62, 0.9)', fontWeight: 'bold' }}>
//                     {box.heading}
//                   </Typography>
//                 </Box>
               
//                 <Box
//                   flex={1}
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   bgcolor="rgba(3, 3, 62, 0.9)"
//                 >
//                   <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
//                     {box.value}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
        
//         {chartData.map((data, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Paper
//               elevation={3}
//               style={{ padding: 20, backgroundColor: "rgba(3, 3, 62, 0.9)" }}
//             >
//               <Box height={220}>
//                 <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{data.title}</Typography>
//                 {data.chart}
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }


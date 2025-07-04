import React, { useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  Snackbar,
  CircularProgress,
  Backdrop,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import { Loader2 } from "lucide-react";
import {
  axisBottom,
  axisLeft,
  scaleBand,
  scaleTime,
  select,
  timeFormat,
  timeMinute,
} from "d3";
import BackButton from "./backbutton";
import { useEffect } from "react";
import {apigetLines} from '../api/LineMaster/api.getline';
import {standardDashboardApi} from '../api/standardDasboardApi';
import { apiMachineStatus } from "../api/api.getMachineStatus";

const GanttChartComponent = () => {

  
  useEffect(() => {
    const getMachines = async () => {
      try {
        const result = await apigetLines()
        //console.log("Lines are:", result)
        setLinesData(result.data.data);
      } catch (error) {
        //console.log(error.message);
    
      }
    }
    getMachines();
  }, [])

  const [lineData, setLinesData] = useState([])
  const [rawData, setRawData] = useState({
    lineNo: "13",
    fromDate: new Date().toISOString().split("T")[0],
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const svgRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRawData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOkButton = async() => {
    setLoading(true);
    try {
   
      const result = await apiMachineStatus(rawData);

      const data = result.data.map(item => ({
        machineName: item.machineName,
        start: new Date(item.datetime),
        end: new Date(new Date(item.datetime).getTime() + 30 * 60000),
        status: item.alertStatus,
      
      }));
      //console.log(data.status)
      //console.log(data.machineName)
      data.forEach(item => {
        //console.log(item.status, item.machineName);
      });
      
      setChartData(data);
      drawChart(data);
    } catch (error) {
      setError("Error generating chart data");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const drawChart = (data) => {
    const svg = select(svgRef.current);
    const margin = { top: 10, right: 20, bottom: 50, left: 180 };
    const width = 1300 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
  
    svg.selectAll('*').remove();
  
    const now = new Date(); // Current time
    const minStart = new Date(Math.min(...data.map(d => d.start)));
    const maxEnd = new Date(Math.max(...data.map(d => d.end)));
  
    // Set domain: start from earliest start, end at max(current time, latest end)
    const xEnd = now > maxEnd ? now : maxEnd;
  
    const x = scaleTime()
      .domain([minStart, xEnd])
      .range([0, width]);
  
    const y = scaleBand()
      .domain(data.map(d => d.machineName))
      .range([height, 0])
      .padding(0.1);
  
    const xAxisFormat = timeFormat('%H:%M');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(axisBottom(x)
        .ticks(timeMinute.every(30)) // Still show ticks every 30 mins
        .tickFormat(xAxisFormat))
      .selectAll("text")
      .attr("transform", "rotate(-45)") 
      .style("text-anchor", "end")  
      .style("font-size", "12px");
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(axisLeft(y))
      .attr('class', 'y-axis')
      .selectAll("text")
      .style("font-size", "12px"); 
  
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.start))
      .attr('y', d => y(d.machineName))
      .attr('width', d => x(d.end) - x(d.start))
      .attr('height', y.bandwidth())
      .attr('fill', d => d.status.trim().toLowerCase() === 'red' ? 'red' : 'green')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  };  

  return (
    <Box sx={{ padding: 2, width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "5px",
          borderRadius: "8px",

          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          color: "white",
        }}
      >
        <BackButton background={"transparent"} iconColor="#fff" />
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Machine Runtime Chart
        </Typography>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "0px 0px 20px 0px",
        }}
      ></Box>

      <Grid
        container
        spacing={2}
        sx={{ width: "100%", alignItems: "center", marginBottom: "10px" }}
      >
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Line</InputLabel>
            <Select
              name="lineNo"
              value={rawData.lineNo}
              onChange={handleInputChange}
              label="Select Line"
            >
              {lineData.map((line) => (
                <MenuItem key={line.id} value={line.lineNo}>
                  {line.lineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3}>
  <FormControl sx={{ minWidth: 250 }}>
    <TextField
      label="Select Date"
      name="fromDate"
      type="date"
      value={rawData.fromDate}
      onChange={handleInputChange}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        inputProps: {
          max: new Date().toISOString().split('T')[0] 
        }
      }}
    />
  </FormControl>
</Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOkButton}
            disabled={loading}
            sx={{color:'white'}}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "OK"}
          </Button>
        </Grid>
      </Grid>

      <svg
        ref={svgRef}
        width="1330"
        height="500"
        style={{ border: "1px solid black" ,borderRadius:'10px'}}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={error || "An error occurred"}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default GanttChartComponent;

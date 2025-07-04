

import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar } from "recharts";
import BackButton from "./backbutton";
import { useNavigate } from "react-router-dom";
import { apiGetJindalGraph } from "../api/api.getjindalgraph";
import { FormControl } from "@mui/material";
import { apiGetElectricalMeasurements } from "../api/api.getjindalem";

export default function JSPLEManagement() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [refreshData, setRefreshData] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState("sensor1");

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDetailedAnalyticsClick = () => {
    window.open("https://app.eianalytic.com/#/login", "_blank");
  };

  const handleSensorChange = (event) => {
    setSelectedSensor(event.target.value);
  };

  useEffect(() => {
    const getJindalData = async () => {
      try {
        const result = await apiGetElectricalMeasurements(selectedSensor);
        //console.log("Result data em jindal:", result.data.data);
        const transformedData = transformApiData(result.data.data.slice(0, 20));
        setGraphData(transformedData);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getJindalData();
    const intervalId = setInterval(getJindalData, 30000);
  
    return () => clearInterval(intervalId);
  }, [selectedSensor]);
  const transformApiData = (apiData) => {
    return [
      {
        type: "line",
        data: apiData.map((item) => ({
          name: extractTime(item.dateTimeRecvd),
          "Vol -B": parseFloat(item.voltageB),
          "Vol -R": parseFloat(item.voltageR),
          "Vol -Y": parseFloat(item.voltageY),
        })),
        label: "Voltage (V)",
      },
      {
        type: "line",
        data: apiData.map((item) => ({
          name: extractTime(item.dateTimeRecvd),
          "Cur -B": parseFloat(item.currentB),
          "Cur -R": parseFloat(item.currentR),
          "Cur -Y": parseFloat(item.currentY),
        })),
        label: "Current (AMP)",
      },
      {
        type: "bar",
        data: apiData.map((item) => ({
          name: extractTime(item.dateTimeRecvd),
          KWH: parseFloat(item.kwh),
        })),
        label: "KWH",
      },
      {
        type: "line",
        data: apiData.map((item) => ({
          name: extractTime(item.dateTimeRecvd),
          "Power Factor": parseFloat(item.pf),
        })),
        label: "Power Factor",
      },
    ];
  };
  // const transformApiData = (apiData) => {
  //   return [
  //     {
  //       type: "line",
  //       data: apiData.map((item) => ({
  //         name: extractTime(item.dateTime),
  //         "Vol -B": parseFloat(item.voltageBPhase),
  //         "Vol -R": parseFloat(item.voltageRPhase),
  //         "Vol -Y": parseFloat(item.voltageYPhase),
  //       })),
  //       label: "Voltage (V)",
  //     },
  //     {
  //       type: "line",
  //       data: apiData.map((item) => ({
  //         name: extractTime(item.dateTime),
  //         "Cur -B": parseFloat(item.currentBPhase),
  //         "Cur -R": parseFloat(item.currentRPhase),
  //         "Cur -Y": parseFloat(item.currentYPhase),
  //       })),
  //       label: "Current (AMP)",
  //     },
  //     {
  //       type: "bar",
  //       data: apiData.map((item) => ({
  //         name: extractTime(item.dateTime),
  //         KWH: parseFloat(item.kwh),
  //       })),
  //       label: "KWH",
  //     },
  //     {
  //       type: "line",
  //       data: apiData.map((item) => ({
  //         name: extractTime(item.dateTime),
  //         "Power Factor": parseFloat(item.powerFactor),
  //       })),
  //       label: "Power Factor",
  //     },
  //   ];
  // };

  const extractTime = (dateTimeString) => {
    const [date, time] = dateTimeString.split(" ");
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  const handleCimconClick=()=>{
    window.open('https://iedge360.cimcondigital.com/', '_blank');

  }
  const handleDetailedAnalyticsClick2 = () => {
    window.open('https://www.intellithinklabs.com/prodi/login', '_blank');
  };
  const navigate = useNavigate();
  const handleVibrationClick = () => {
    navigate("/demovibration");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} display={"flex"}>
          <BackButton />
          <Typography variant="h5" gutterBottom>
            Energy Management
          </Typography>
        </Grid>
        <Grid item xs={9} container justifyContent="flex-end">
          <FormControl
            variant="outlined"
            sx={{ minWidth: 200, marginRight: 1 }}
          >
            <InputLabel id="sensor-select-label">Select Device</InputLabel>
            <Select
              labelId="sensor-select-label"
              id="sensor-select"
              value={selectedSensor}
              onChange={handleSensorChange}
              label="Select Device"
            >
              <MenuItem value="sensor1">Device 1</MenuItem>
              {/* <MenuItem value="sensor2">Device 2</MenuItem> */}
              {/* <MenuItem value="sensor2"> </MenuItem> */}

            </Select>
          </FormControl>
          {/* <Button
            variant="contained"
            sx={{ marginLeft: "5px", background: "darkgray", color: "black" }}
          >
            Machine Name:1
          </Button> */}
          <Button
            variant="contained"
            sx={{ marginLeft: "5px", color:'white',fontWeight:'600' }}
            onClick={handleVibrationClick}
          >
            CBM
          </Button>
          <Button variant="contained" sx={{ marginLeft: '5px',backgroundColor:'#1faec5',color:'white',fontWeight:'600' }} onClick={handleDetailedAnalyticsClick}>EI Analytic</Button>
          <Button variant="contained" sx={{ marginLeft: '5px',backgroundColor:'#1faec5',color:'white',fontWeight:'600' }} onClick={handleDetailedAnalyticsClick2}>Intelli Think</Button>
          <Button variant="contained" sx={{ marginLeft: '5px',backgroundColor:'#1faec5',color:'white',fontWeight:'600' }} onClick={handleCimconClick}>Cimcon</Button>

        </Grid>
        {graphData.map((chart, index) => (
          <Grid item xs={6} key={index}>
            <Paper
              elevation={3}
              style={{ padding: 20, backgroundColor: "rgba(3, 3, 62, 0.9)" }}
            >
              <Typography
                variant="h6"
                gutterBottom
                style={getChartTitleStyle(chart, index)}
              >
                {chart.label}
              </Typography>
              {renderChart(chart)}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function getChartTitleStyle(chart, index) {
  return {
    color: "white",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  };
}

function renderChart(chart) {
  const colors = ["blue", "red", "yellow"];

  if (chart.type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chart.data}>
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            strokeWidth={2}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "#FFFFFF",
            }}
          />
          <Legend wrapperStyle={{ color: "#FFFFFF" }} />
          <Bar dataKey="KWH" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            strokeWidth={3}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            strokeWidth={3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "#FFFFFF",
            }}
          />
          <Legend wrapperStyle={{ color: "#FFFFFF" }} />
          {Object.keys(chart.data[0] ||{})
            .filter((key) => key !== "name")
            .map((key, index) => (
              <Line
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                key={key}
                name={key}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

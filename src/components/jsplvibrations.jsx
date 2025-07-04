import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
  InputLabel,
  FormControl,
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
import "../assets/css/emanagement.css";
import BackButton from "./backbutton";
import { useNavigate } from "react-router-dom";
import { apiGetJindalGraph } from "../api/api.getjindalgraph";
import { apiGetElectricalMeasurements } from "../api/api.getjindalem";
import { apiGetHydraulicData } from "../api/api.getHydraulicData";
import { apiGetBlastFurnaceDetail } from "../api/api.blastFurnaceDetail";

export default function JSPLVibration() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [chartData, setChartData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleLineChange = (event) => {
    setSelectedLine(event.target.value);
    setSelectedSensor("");
  };
  const handleMachineChange = (event) => {
    setSelectedMachine(event.target.value);
    setSelectedSensor("");
  };

  useEffect(() => {
    const getJindalData = async () => {
      try {
        const [vibrationResult, currentResult, hydraulicResult,blastFurnaceResult] =
          await Promise.all([
            apiGetJindalGraph(selectedSensor),
            apiGetElectricalMeasurements("sensor1"),
            apiGetHydraulicData(),
            apiGetBlastFurnaceDetail()
          ]);

        if (!vibrationResult || !currentResult || !hydraulicResult) {
          throw new Error("Failed to fetch data from APIs");
        }
        //console.log("Vibration Data:", vibrationResult.data);
        //console.log("Current Data:", currentResult.data.data);
        //console.log("Hydraulic Data:", hydraulicResult.data);
        //console.log("blast furnace data:",blastFurnaceResult.data.data)
        const transformedData = transformApiData(
          vibrationResult.data.slice(0, 20),
          currentResult.data.data.slice(0, 20),
          hydraulicResult.data.slice(0, 20),
          blastFurnaceResult.data.data.slice(0,20)
        );

        setChartData(transformedData);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };

    getJindalData();
    const intervalId = setInterval(getJindalData, 30000);

    return () => clearInterval(intervalId);
  }, [selectedSensor, selectedLine,selectedMachine]);

  const transformApiData = (vibrationData, currentData, hydraulicData,blastFurnaceData) => {
    //console.log("vibration data:", vibrationData);
    //console.log("current data:", currentData);
    let data=[]
    if (selectedSensor === "11") {
   
      data = [{
        type: "line",
        data: hydraulicData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          "Hydraulic Pressure": item.hydraulicPressure
            ? parseFloat(item.hydraulicPressure)
            : 0,
        })),
        label: "Hydraulic Pressure (BAR)",
      }];
    } else { data = [
      {
        type: "line",
        data: vibrationData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          "Vel -X": item.xVelocity ? parseFloat(item.xVelocity) : 0,
          "Vel -Y": item.yVelocity ? parseFloat(item.yVelocity) : 0,
          "Vel -Z": item.zVelocity ? parseFloat(item.zVelocity) : 0,
        })),
        label: "Velocity (m/sec)",
      },
      {
        type: "line",
        data: vibrationData.map((item) => ({
          name: extractTime(item.dateTime),
          "Accel -X": item.xAcceleration ? parseFloat(item.xAcceleration) : 0,
          "Accel -Y": item.yAcceleration ? parseFloat(item.yAcceleration) : 0,
          "Accel -Z": item.zAcceleration ? parseFloat(item.zAcceleration) : 0,
        })),
        label: "Acceleration (m/sec2)",
      },
      {
        type: "line",
        data: currentData.map((item) => ({
          name: extractTime2(item.dateTimeRecvd),
          "Cur -B": parseFloat(item.currentB),
          "Cur -R": parseFloat(item.currentR),
          "Cur -Y": parseFloat(item.currentY),
        })),
        label: "Current (AMP)",
      },

      {
        type: "line",
        data: vibrationData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          Temperature: item.temperature ? parseFloat(item.temperature) : 0,
        })),
        label: "Temperature (°C)",
      },
      {
        type: "line",
        data: vibrationData.map((item) => ({
          name: extractTime(item.dateTime),
          Noise: item.averageNoise ? parseFloat(item.averageNoise) : 0,
        })),
        label: "Average Noise (DB)",
      },
      {
        type: "line",
        data: vibrationData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          RPM: item.rpm ? parseFloat(item.rpm) : 0,
        })),
        label: "RPM",
      },
      {
        type: "line",
        data: vibrationData.map((item) => ({
          name: extractTime(item.dateTime),
          "Mag -X": item.magRsX ? parseFloat(item.magRsX) : 0,
          "Mag -Y": item.magRsY ? parseFloat(item.magRsY) : 0,
          "Mag -Z": item.magRsZ ? parseFloat(item.magRsZ) : 0,
        })),
        label: "Magnetic Flux",
      },
      {
        type: "line",
        data: vibrationData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          Torque: item.troque ? parseFloat(item.torque) : 0,
        })),
        label: "Torque",
      },
      {
        type: "line",
        data: vibrationData.reverse().map((item) => ({
          name: extractTime(item.dateTime),
          "Ultra Sound": item.ultraSound ? parseFloat(item.ultraSound) : 0,
        })),
        label: "Ultra Sound",
      },
    ];

    if (selectedMachine === "13") {
      data.push({
        type: "line",
        data: hydraulicData.map((item) => ({
          name: extractTime(item.dateTime),
          "Hydraulic Pressure": item.hydraulicPressure
            ? parseFloat(item.hydraulicPressure)
            : 0,
        })),
        label: "Hydraulic Pressure (BAR)",
      });
    }
    if (selectedLine === "8") {
      data.push({
        type: "line",
        data: blastFurnaceData.map((item) => ({
          name: extractTime(item.dateTime),
          "Current Average (amp)": item.currentAverageInAmperes
            ? parseFloat(item.currentAverageInAmperes)
            : 0,
        })),
        label: "Average Current (amp)",
      },
      {
        type: "line",
        data: blastFurnaceData.map((item) => ({
          name: extractTime(item.dateTime),
          "Oil Temperature (C)": item.oilTempOfGearboxInC
            ? parseFloat(item.oilTempOfGearboxInC)
            : 0,
        })),
        label: "Oil Temperature (C)",
      },
    );
    }
  }
    return data;


  };

  const extractTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  const extractTime2 = (dateTimeString) => {
    const [date, time] = dateTimeString.split(" ");
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}T${time}`).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );
  };

  const handleEmanagementClick = () => {
    navigate("/demoemanagement");
  };

  const handleDetailedAnalyticsClick = () => {
    window.open("https://app.eianalytic.com/#/login", "_blank");
  };

  const handleDetailedAnalyticsClick2 = () => {
    window.open("https://www.intellithinklabs.com/prodi/login", "_blank");
  };

  const handleCimconClick = () => {
    window.open("https://iedge360.cimcondigital.com/", "_blank");
  };

  const handleSensorChange = (event) => {
    //console.log("Selected Sensor:", event.target.value); 
    setSelectedSensor(event.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={4} lg={3} display="flex" alignItems="center">
          <BackButton />
          <Typography variant="h5" gutterBottom sx={{ marginLeft: 2 }}>
            CBM
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="line-select-label">Select Line</InputLabel>
                <Select
                  labelId="line-select-label"
                  id="line-select"
                  value={selectedLine}
                  onChange={handleLineChange}
                  label="Select Line"
                >
                  <MenuItem value="7">Mill -Angul</MenuItem>
                  <MenuItem value="8">Blast Furnace</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="sensor-select-label">Select Machine</InputLabel>
                <Select
                  labelId="sensor-select-label"
                  id="sensor-select"
                  value={selectedMachine}
                  onChange={handleMachineChange}
                  label="Select Machine"
                  disabled={!selectedLine}
                >
                {selectedLine === "7" && [
                  <MenuItem key="13" value="13">
                    Stand -13 Motor
                  </MenuItem>,
                    <MenuItem key="8" value="8">
                    Stand -12 Motor
                  </MenuItem>,
                  <MenuItem key="12" value="12">
                    Stand -9 Motor
                  </MenuItem>,
                   <MenuItem key="15" value="15">
                   HT 160 Motor
                 </MenuItem>,
                ]}
                {selectedLine === "8" && [
                  <MenuItem key="14" value="14">
                    Converyor Belt
                  </MenuItem>,
                ]}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="device-select-label">Select Device</InputLabel>
                <Select
                  labelId="device-select-label"
                  id="device-select"
                  value={selectedSensor}
                  onChange={handleSensorChange}
                  label="Select Device"
                  disabled={!selectedMachine}
                >
                {selectedLine === "7" &&
                  selectedMachine === "13" && [
                    // <MenuItem key="5" value="5">
                    //   Energy-2
                    // </MenuItem>,
                    <MenuItem key="7" value="7">
                    GearBox Input DE
                    </MenuItem>,
                    <MenuItem key="10" value="10">
                      Motor DE
                    </MenuItem>,
                    <MenuItem key="13" value="13">
                     GearBox Output DE
                    </MenuItem>,
                  ]}
                   {selectedLine === "7" &&
                  selectedMachine === "15" && [
                    // <MenuItem key="5" value="5">
                    //   Energy-2
                    // </MenuItem>,
                    <MenuItem key="27" value="27">
                    MNDE
                    </MenuItem>,
                    <MenuItem key="28" value="28">
                      MDE
                    </MenuItem>,
                    <MenuItem key="29" value="29">
                     GearBox Input DE
                    </MenuItem>,
                    <MenuItem key="30" value="30">
                    GearBox Output DE
                   </MenuItem>,
                  ]}
                {selectedLine === "7" &&
                  selectedMachine === "12" && [
                    <MenuItem key="14" value="14">
                      Motor DE
                    </MenuItem>,
                    <MenuItem key="15" value="15">
                      Motor NDE
                    </MenuItem>,
                  ]}
                    {selectedLine === "7" &&
                  selectedMachine === "8" && [
                    <MenuItem key="11" value="11">
                      Pressure Sesnor
                    </MenuItem>,
                
                  ]}
                {selectedLine === "8" &&
                  selectedMachine === "14" && [
                    <MenuItem key="20" value="20">
                      MCC Motor-3 DE
                    </MenuItem>,
                    <MenuItem key="21" value="21">
                      MCC Motor-3 NDE
                    </MenuItem>,
                    <MenuItem key="22" value="22">
                      Gearbox Input DE
                    </MenuItem>,
                    <MenuItem key="23" value="23">
                     Gearbox Output DE
                    </MenuItem>,
                    <MenuItem key="24" value="24">
                     Pulley DE
                    </MenuItem>,
                    <MenuItem key="25" value="25">
                   Pulley NDE
                    </MenuItem>,
                  
                  ]}
              </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{ color:"white",fontWeight:'600'}}
                onClick={handleEmanagementClick}
              >
                Energy Management
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#1faec5",
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={handleDetailedAnalyticsClick}
              >
                EI Analytic
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#1faec5",
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={handleDetailedAnalyticsClick2}
              >
                Intelli Think
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#1faec5",
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={handleCimconClick}
              >
                Cimcon
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {chartData.length === 0 ? (
          <Grid container spacing={2} mt={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Paper
                  elevation={3}
                  style={{ padding: "20px", backgroundColor: "rgba(3, 3, 62, 0.9)", height: "200px" }}
                >
                  <Typography
                    variant="h6"
                    style={{ color: "white", textAlign: "center" }}
                  >
                    No data available
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2} mt={2}>
            {chartData.map((chart, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Paper
                  elevation={3}
                  style={{ padding: "20px", backgroundColor: "rgba(3, 3, 62, 0.9)" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{
                      color: "white",
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    {chart.label}
                  </Typography>
                  {renderChart(chart)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

function renderChart(chart) {
  const colors = ["blue", "red", "yellow"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chart.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
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
        {Object.keys(chart.data[0] || {})
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
import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { apiGetCBMDetail } from "../api/api.getCBMDetail";
import { apiGetEnergyDetail } from "../api/api.getEnergyDetail";

const VehicleTracking = () => {
  const [cbmData, setCbmData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [selectedLine, setSelectedLine] = useState(9);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [iconicData, setIconicData] = useState({
    sensor: "",
  });

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIconicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLineChange = (event) => {
    setSelectedLine(event.target.value);
  };
  useEffect(()=>{
    handleOkClick()
  },[])
  const handleOkClick = async () => {
    try {
      let result;
      
    
        result = await apiGetCBMDetail(selectedLine);
        //console.log(result.data.data);
        setCbmData(result.data.data);
        setEnergyData([]);
     
      handleSnackbarOpen("Data fetched successfully", "success");
    } catch (error) {
      console.error("Error in handleOkClick:", error);
      handleSnackbarOpen(error.message, "error");
    }
  };
  // const handleOkClick = async () => {
  //   try {
  //     let result;

  //     if (iconicData.sensor === "sensor1") {
  //       result = await apiGetCBMDetail({ lineNo: iconicData.sensor });
  //       setCbmData(result.data.data);
  //       setEnergyData([]);
  //     } else if (iconicData.sensor === "sensor2") {
  //       result = await apiGetEnergyDetail({ lineNo: iconicData.sensor });
  //       setEnergyData(result.data.data);
  //       setCbmData([]);
  //     } else {
  //       throw new Error("Invalid sensor selected");
  //     }

  //     handleSnackbarOpen("Data fetched successfully", "success");
  //   } catch (error) {
  //     console.error("Error in handleOkClick:", error);
  //     handleSnackbarOpen(error.message, "error");
  //   }
  // };

  const renderDataTable = (data, valueKey, alertKey) => {
    return (
      <TableContainer component={Paper} elevation={3} sx={{ marginBottom: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "10px !important", fontWeight: "600" }}>
                Parameter
              </TableCell>
              <TableCell sx={{ padding: "10px !important", fontWeight: "600" }}>
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: item[alertKey],
                  "& td.MuiTableCell-root": {
                    color: ["red", "green"].includes(item[alertKey])
                      ? "white"
                      : "black",
                  },
                }}
              >
                <TableCell sx={{ padding: "10px !important" }}>
                  {item.cbmParameter || item.energyParameter}
                </TableCell>
                <TableCell sx={{ padding: "10px !important" }}>
                  {item[valueKey]} {item.unitCbm || item.unitEnergy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Vehicle Tracking 
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
        {/* <Grid item>
          <FormControl
            variant="outlined"
            sx={{ minWidth: 250, marginRight: 1 }}
          >
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
        </Grid> */}
        {/* <Grid item >
          <FormControl sx={{width:'250px'}} variant="outlined">
            <InputLabel>Select Sensor</InputLabel>
            <Select
              name="sensor"
              value={iconicData.sensor}
              onChange={handleInputChange}
              label="Select Sensor"
            >
              <MenuItem value="sensor1">CBM</MenuItem>
              <MenuItem value="sensor2">Energy</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
        {/* <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOkClick}
            sx={{ height: "100%", mr: 10 }}
          >
            OK
          </Button>
        </Grid> */}
      </Grid>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: "4px",
          },
        }}
      >

        {cbmData.length > 0 && (
          <>
            {selectedLine === "8" ? (
              <>
                <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      MCC Motor-3 DE
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    ></Typography>
                    {renderDataTable(cbmData, "valueCbm1", "alertCbm1")}
                  </Box>
             <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      MCC Motor-3 NDE
                    </Typography>

                    {renderDataTable(cbmData, "valueCbm2", "alertCbm2")}
                  </Box>
             <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      Gearbox Input DE
                    </Typography>

                    {renderDataTable(cbmData, "valueCbm3", "alertCbm3")}
                  </Box>
             <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      Gearbox Output DE
                    </Typography>

                    {renderDataTable(cbmData, "valueCbm4", "alertCbm4")}
                  </Box>
             <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      Pulley DE
                    </Typography>

                    {renderDataTable(cbmData, "valueCbm5", "alertCbm5")}
                  </Box>
             <Box sx={{ minWidth: 250 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    >
                      Pulley NDE
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        color: "darkblue",
                        fontSize: "16px",
                      }}
                    ></Typography>
                    {renderDataTable(cbmData, "valueCbm6", "alertCbm6")}
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: "4px",
          },
        }}>
        <Box sx={{ display: "flex", gap: 2 }}>
      
                <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "900",
                      color: "darkblue",
                      fontSize: "18px",
                    }}
                  >
                    Vehicle 1
                   
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "600", color: "darkblue" }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm1", "alertCbm1")}
                </Box>
              {/*  <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  >
                    Motor DE Stand #13
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "600", color: "darkblue" }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm2", "alertCbm2")}
                </Box>
                <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  >
                    Gearbox Output DE Stand #13
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm3", "alertCbm3")}
                </Box>
                <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  >
                    Motor DE Stand #9
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "600", color: "darkblue" }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm4", "alertCbm4")}
                </Box>
                <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  >
                    Motor NDE Stand #9
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "600", color: "darkblue" }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm5", "alertCbm5")}
                </Box>
                <Box sx={{ minWidth: 250 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "600",
                      color: "darkblue",
                      fontSize: "16px",
                    }}
                  >
                    Bar Mill Stand #12
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "600", color: "darkblue" }}
                  ></Typography>
                  {renderDataTable(cbmData, "valueCbm6", "alertCbm6")}
                </Box>*/}
                </Box>
                </Box>

              </>
            )}
          </>
        )}
        {energyData.length > 0 && (
          <Box sx={{ width: "20%", marginBottom: 1, mr: 135 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "600", color: "darkblue" }}
            >
              Energy Values
            </Typography>
            {renderDataTable(energyData, "valueEnergy1", "alertEnergy1")}
          </Box>
        )}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VehicleTracking;

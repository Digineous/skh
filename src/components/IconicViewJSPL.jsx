import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert as MuiAlert,
  Box,
} from "@mui/material";
import BackButton from "./backbutton";
import { apiGetPlant } from "../api/PlantMaster/api.getplant";
import { apiGetDevice } from "../api/DeviceMaster/api.getdevice";
import { apigetLines } from "../api/LineMaster/api.getline";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";
import { apiGetCockPitView } from "../api/api.getCockpitView";

const ColorLegend = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          backgroundColor: "green",
          borderRadius: 1,
        }}
      />
      <Typography>OK</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          backgroundColor: "yellow",
          borderRadius: 1,
        }}
      />
      <Typography>Attention Required</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{ width: 20, height: 20, backgroundColor: "red", borderRadius: 1 }}
      />
      <Typography>Action Required</Typography>
    </Box>
  </Box>
);


const getStatusColor = (status) => {
  if (!status) return "#ffffff";  
  
  switch (status.toLowerCase()) {
    case "green":
      return "green";
    case "yellow":
      return "yellow";
    case "red":
      return "red";
    default:
      return "#ffffff";
  }
};

const MachineTable = ({ data, title }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ 
        height: "100%", 
        width: "500px", 
        margin: "10px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={2}
              sx={{
                fontWeight: "600",
                fontSize: "16px",
                background: "#1FAEC5",
                color: "white",
                textAlign: "center",
              }}
            >
              {title}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "600",
                fontSize: "16px",
                background: "#1FAEC5",
                color: "white",
                width: "100%",
              }}
            >
              Parameter
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "600",
                fontSize: "16px",
                background: "#1FAEC5",
                color: "white",
                width: "100%",
              }}
            >
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor:
                  row.status !== null ? getStatusColor(row.status) : "white",
                "& td.MuiTableCell-root": {
                  color: ["red", "green"].includes(getStatusColor(row.status))
                    ? "white"
                    : "black",
                },
              }}
            >
              <TableCell>{row.attribName}</TableCell>
              <TableCell>{row.value || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};



const getCurrentDateHour = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}T${String(
    now.getHours()
  ).padStart(2, "0")}:00`;
};
const IconicDashboard = () => {
  const [showTables, setShowTables] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [refreshData, setRefreshData] = useState(false);
  const [deviceData, setDeviceData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [error, setError] = useState(null);
  const [cockPitData,setCockPitData]=useState([])
  const [machine1Data, setMachine1Data] = useState([]);
  const [machine2Data, setMachine2Data] = useState([]);


  useEffect(() => {
   
  }, []);

  const [formData, setFormData] = useState({
    plantNo: "",
    lineNo: "",
    machineNo: "",
    deviceNo: "",
    module: "CBM",
  });
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  useEffect(() => {
    const getPlant = async () => {
      try {
        const result = await apiGetPlant();
        //console.log("Result data plant:", result.data.data);
        setPlantData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getPlant();
  }, [refreshData]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const result = await apiGetDevice();
        setDeviceData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    const getline = async () => {
      try {
        const result = await apigetLines();
        //console.log("Result data line:", result.data.data);
        setLineData(result.data.data);
        
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getline();
  }, [refreshData]);

  useEffect(() => {
    const getmachine = async () => {
      try {
        const result = await apigetMachine();
        //console.log("Result data machine:", result.data.data);
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getmachine();
  }, [refreshData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetData = async() => {
    try {
      const result= await apiGetCockPitView(formData)
      //console.log("cock pit view data:",result.data.data)
      setCockPitData(result.data.data)
      setShowTables(result.data.data.length > 0);
      const machine1Params = [
        "Velocity X", 
        "Velocity Y", 
        "Velocity Z", 
        "Temperature", 
        "Acceleration"
      ];

      const machine2Params = [
        "Velocity X 2", 
        "Velocity Y 2", 
        "Velocity Z 2", 
        "Temperature 2", 
        "Acceleration 2"
      ];
      const machine1Data = result.data.data.filter(item => 
        machine1Params.includes(item.attribName)
      );

      const machine2Data = result.data.data.filter(item => 
        machine2Params.includes(item.attribName)
      );

      setMachine1Data(machine1Data);
      setMachine2Data(machine2Data);
    } catch (error) {
      console.error("error getting cockpit data:",error)
    }
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "5px",
          borderRadius: "8px",
          marginBottom: "20px",
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
          Cockpit View
        </Typography>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Plant Name</InputLabel>
            <Select
              name="plantNo"
              value={formData.plantNo}
              onChange={handleInputChange}
            >
              {plantData.map((row) => (
                <MenuItem key={row.plantNo} value={row.plantNo}>
                  {row.plantName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Line Name</InputLabel>
            <Select
              name="lineNo"
              value={formData.lineNo}
              onChange={handleInputChange}
            >
              {lineData.map((row) => (
                <MenuItem key={row.lineNo} value={row.lineNo}>
                  {row.lineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Machine Name</InputLabel>
            <Select
              name="machineNo"
              value={formData.machineNo}
              onChange={handleInputChange}
            >
              {machineData.map((row) => (
                <MenuItem key={row.machineNo} value={row.machineNo}>
                  {row.displayMachineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Device Name</InputLabel>
            <Select
              name="deviceNo"
              value={formData.deviceNo}
              onChange={handleInputChange}
            >
              {deviceData.map((row) => (
                <MenuItem key={row.deviceNo} value={row.deviceNo}>
                  {row.deviceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={2} alignItems="center" mt={1}>
        <Button   variant="contained"
            sx={{ backgroundColor: "#1FAEC5", color: "white",alignItems:'center' }} onClick={handleGetData}>OK</Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ mt:1 ,mb:1}}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Grid item xs={12} md={4}>
          <ColorLegend />
        </Grid>
      </Grid>

      {showTables && (
  <Box
    sx={{width:'55%',
      overflowX: "auto",
      display: "flex",
      justifyContent: "center",
      pb: 2,
      "&::-webkit-scrollbar": {
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f1f1f1",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#888",
        borderRadius: "4px",
      },
    }}
  >
   <MachineTable data={machine1Data} title="Spindle" />
   <MachineTable data={machine2Data} title="Z Axis" />
  </Box>
)}


      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default IconicDashboard;

import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField,
  Button,
  Grid,
  TablePagination,
  CircularProgress,
  Tabs,
  tableCellClasses,
  styled,
  Tab,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { format, parseISO } from "date-fns";
import { apiGetCBMRawData } from "../api/api.getCbmReport";
import { apiGetEnergyRawData } from "../api/api.getEnergyRawData";
import { apiGetTotalThresHold } from "../api/api.totalEnergyLoss";
import { apiGetBlastFurnaceDetail } from "../api/api.blastFurnaceDetail";
import { apiGetRawData } from "../api/api.getMachineRawData";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";


import DownloadReport from "../utils/DownloadReport";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const cbmDevices = [
  { id: 1, deviceNo: "7", displayDeviceName: "GearBox Input DE " },
  { id: 2, deviceNo: "10", displayDeviceName: "Motor DE " },
  { id: 3, deviceNo: "13", displayDeviceName: "GearBox Output  " },
  { id: 4, deviceNo: "14", displayDeviceName: "Motor DE (Stand -9  Motor)" },
  { id: 5, deviceNo: "15", displayDeviceName: "Motor NDE (Stand -9  Motor) " },
];

const energyDevices = [{ id: 1, deviceNo: "5", displayDeviceName: "Energy 1" }];

const cbmFields = [
  { label: "Date Time", key: "dateTime" },
  { label: "RPM", key: "rpm" },
  { label: "Average Noise", key: "averageNoise" },
  { label: "X Acceleration", key: "xAcceleration" },
  { label: "Y Acceleration", key: "yAcceleration" },
  { label: "Z Acceleration", key: "zAcceleration" },
  { label: "X Velocity", key: "xVelocity" },
  { label: "Y Velocity", key: "yVelocity" },
  { label: "Z Velocity", key: "zVelocity" },
  { label: "Conversion Factor", key: "conversionFactor" },
  { label: "Total Acceleration", key: "totalAcceleration" },
  { label: "Temperature", key: "temperature" },
  { label: "Magnetic Flux X", key: "magRsX" },
  { label: "Magnetic Flux Y", key: "magRsY" },
  { label: "Magnetic Flux Z", key: "magRsZ" },
  { label: "Torque", key: "torque" },
  { label: "Ultra Sound", key: "ultraSound" },
  { label: "Hydraulic Pressure", key: "hydraulicPressure" },
];

const energyFields = [
  { label: "Date Time", key: "dateTime" },
  { label: "Current R Phase", key: "currentRPhase" },
  { label: "Current Y Phase", key: "currentYPhase" },
  { label: "Current B Phase", key: "currentBPhase" },
  { label: "Voltage R Phase", key: "voltageYPhase" },
  { label: "Voltage Y Phase", key: "voltageRPhase" },
  { label: "Voltage B Phase", key: "voltageBPhase" },
  { label: "Power Factor ", key: "powerFactor" },
  { label: "KWH", key: "kwh" },
];

const thresholdFields = [
  { label: "Total Energy Loss", key: "totalEnergyLossKwh" },
  { label: "Energy Loss R ", key: "energyLossRKwh" },
  { label: "Energy Loss Y ", key: "energyLossYKwh" },
  { label: "Energy Loss B ", key: "energyLossBKwh" },
];
const hydraulicFields = [
  { label: "Datetime",    key: "dateTime"  },
  { label: "Hydraulic Pressure", key: "hydraulicPressure" },
];

const cbmRawData = [
  { label: "Date Time ",    key: "datetimeRecvd"  },
  { label: "Velocity X",    key: "velocityX"  },
  { label: "Velocity Y",    key: "velocityY"  },
  { label: "Velocity Z",    key: "velocityZ"  },
  { label: "Temparature",    key: "temparature"  },
  { label: "Acceleration",    key: "acceleration"  },
  { label: "Velocity X 2",    key: "velocityX2"  },
  { label: "Velocity Y 2",    key: "velocityY2"  },
  { label: "Velocity Z 2",    key: "velocityZ2"  },
  { label: "Temparature 2",    key: "temparature2"  },
  { label: "Acceleration 2",    key: "acceleration2"  },
];


const powerRawData = [
  { label: "Date Time ",    key: "datetimeRecvd"  },
  { label: "Voltage R",    key: "voltageR"  },
  { label: "Voltage Y",    key: "voltageY"  },
  { label: "Voltage B",    key: "voltageB"  },
  { label: "Current R",    key: "currentR"  },
  { label: "Current Y",    key: "currentY"  },
  { label: "Current B",    key: "currentB"  },
  { label: "P F",    key: "pf"  },
  { label: "kwh",    key: "kwh"  },
];

const operationRawData = [
  { label: "Date Time ",    key: "datetimeRecvd"  },
  { label: "Actual Production",    key: "actualProduction"  },
  { label: "Cycle Time",    key: "cycleTime"  },
  { label: "Run Time (Min)",    key: "runTimeInMins"  },
  { label: "OK Quality",    key: "qualityOk"  },
  { label: "Defects",    key: "defects"  },
  { label: "Down Time",    key: "downtime"  },
  { label: "Set Up Time",    key: "setUpTime"  },
  { label: "Breakdown Time",    key: "breakdownTime"  },
  { label: "BreakDown Frequncy",    key: "breakdownFrequency"  },
  { label: "MTTR",    key: "mttr"  },
  { label: "MTBF",    key: "mtbf"  },
];

const operationRawData2 = [
  { label: "Date Time ",    key: "datetimeRecvd"  },
  { label: "Fricture 1",    key: "actualProduction"  },
  { label: "Fricture 2",    key: "actualProduction2"  },
  { label: "Cycle Time",    key: "cycleTime"  },
  { label: "Run Time (Min)",    key: "runTimeInMins"  },
  { label: "OK Quality",    key: "qualityOk"  },
  { label: "Defects",    key: "defects"  },
  { label: "Down Time",    key: "downtime"  },
  { label: "Set Up Time",    key: "setUpTime"  },
  { label: "Breakdown Time",    key: "breakdownTime"  },
  { label: "BreakDown Frequncy",    key: "breakdownFrequency"  },
  { label: "MTTR",    key: "mttr"  },
  { label: "MTBF",    key: "mtbf"  },
];

const blastFuranceFields = [
  {
    label: "Datetime",
    key: "dateTime",
  },
  {
    label: "Average Current  (amp)",
    key: "currentAverageInAmperes",
  },
  {
    label: "Oil Temperature (C)",
    key: "oilTempOfGearboxInC",
  },
];



export default function Rawpathrediope() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rawData, setRawData] = useState({
    machineNo: "18",
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedTab, setSelectedTab] = useState(0);
  const [machineData, setMachineData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalThresholdData, setTotalThresholdData] = useState([]);
  const [blastFurnaceData, setBlastFurnaceData] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRawData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLineChange = (event) => {
    setSelectedLine(event.target.value);
    setSelectedSensor("");
  };
  const handleMachineChange = (event) => {
    setSelectedMachine(event.target.value);
    setSelectedSensor("");
  };
  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    setSelectedTab(newValue);
  };
  // useEffect(() => {
  //   fetchBlastFuranceDetail();
  // }, []);


  useEffect(() => {
    const getMachines = async () => {
      try {
        const result = await apigetMachine(
        );
        console.log("result of api machine data",result);
        
        console.log(result.data.data, "machine data:");
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in machine data");
      }
    };
    getMachines();
  }, []);




  // const fetchBlastFuranceDetail = async () => {
  //   try {
  //     const response = await apiGetBlastFurnaceDetail();
  //     console.log("blast furance detail", response.data.data);
  //     setBlastFurnaceData(response.data.data);
  //     setData(response.data.data);
  //   } catch (error) {
  //     console.error("blast furnace data error", error);
  //   }
  // };
  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {

      const formattedFromDate = format(parseISO(rawData.fromDate),"dd-MMM-yyyy");
      const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
      const formattedRawData = {
        machineNo : rawData.machineNo,
        fromDate: formattedFromDate,
        endDate: formattedToDate,
      };
      console.log("formated data: ",formattedRawData);
      
      const result = await apiGetRawData(formattedRawData);

      // } else if (selectedTab === 1) {
      //   result = await apiGetEnergyRawData(
      //     formattedRawData.deviceNo,
      //     formattedRawData.fromDate,
      //     formattedRawData.toDate
      //   );
      // } else if (selectedTab === 2) {
      //   result = await apiGetTotalThresHold(
      //     formattedRawData.fromDate,
      //     formattedRawData.toDate
      //   );
      //   console.log(result.data.data);
      //   setTotalThresholdData(result.data.data);
      // } else {
      //   console.log("hydraulic data:", formattedRawData.deviceNo);
      //   result = await apiGetCBMRawData(
      //     formattedRawData.deviceNo,
      //     formattedRawData.fromDate,
      //     formattedRawData.toDate
      //   );
      // }
      console.log("result of api ",result);
      
      handleSnackbarOpen("Data fetched successfully!", "success");
      setData(result.data);
    } catch (error) {
      console.error("error raw data:", error);
      handleSnackbarOpen("Error fetching data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 25));
    setPage(0);
  };
  const handleSensorChange = (event) => {
    console.log("Selected Sensor:", event.target.value); // Debugging line
    setSelectedSensor(event.target.value);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const fields =
    selectedTab === 0
      ? (rawData.machineNo === 1 ? operationRawData : operationRawData2)
      : selectedTab === 1
      ? powerRawData 
      : selectedTab === 2
      ? cbmRawData 
      // : selectedTab === 3
      // ? thresholdFields
      // : selectedTab === 4
      // ? blastFuranceFields
      : [];

  // "Machine Id": row.machineId !== null ? row.machineId : "",
  // const handleDownloadCBM = () => {
  //   const formattedFromDate = format(parseISO(rawData.fromDate),"dd-MMM-yyyy");
  //     const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
  //     const formattedRawData = {
  //       machineNo : rawData.machineNo,
  //       fromDate: formattedFromDate,
  //       endDate: formattedToDate,
  //     };
  //   const apiCall = () =>
  //     console.log("formatted data from downloadbutton",formattedRawData)
  //     apiGetRawData(formattedRawData);
  //   const formatData = (data) => {
  //     const dataArray = Array.isArray(data) ? data : [data];
  //     return dataArray.map((row) => ({
  //       "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
  //       RPM: row.rpm != null ? row.rpm : "",
  //       "Average Noise": row.averageNoise !== null ? row.averageNoise : "",
  //       "X Acceleration": row.xAcceleration !== null ? row.xAcceleration : "",
  //       "Y Acceleration": row.yAcceleration !== null ? row.yAcceleration : "",
  //       "Z Acceleration": row.zAcceleration !== null ? row.zAcceleration : "",
  //       "X Velocity": row.xVelocity !== null ? row.xVelocity : "",
  //       "Y Velocity": row.yVelocity !== null ? row.yVelocity : "",
  //       "Z Velocity": row.zVelocity !== null ? row.zVelocity : "",
  //       "Conversion Factor":
  //         row.conversionFactor !== null ? row.conversionFactor : "",
  //       "Total Acceleration":
  //         row.totalAcceleration !== null ? row.totalAcceleration : "",
  //       Temperature: row.temperature !== null ? row.temperature : "",
  //       "Magnetic Flux X": row.magRsX !== null ? row.magRsX : "",
  //       "Magnetic Flux Y": row.magRsY !== null ? row.magRsY : "",
  //       "Magnetic Flux Z": row.magRsZ !== null ? row.magRsZ : "",
  //       Torque: row.torque !== null ? row.torque : "",
  //       "Ultra Sound": row.ultraSound !== null ? row.ultraSound : "",
  //       "Hydraulic Pressure":
  //         row.hydraulicPressure !== null ? row.hydraulicPressure : "",
  //     }));
  //   };
  //   return { apiCall, formatData, fileName: "CBM_Report.xlsx" };
  // };
  // const handleDownloadOperation = () => {
  //   const apiCall = () =>
  //     apiGetRawData(rawData.deviceNo, rawData.fromDate, rawData.toDate);
  //   const formatData = (data) => {
  //     const dataArray = Array.isArray(data) ? data : [data];
  //     return dataArray.map((row) => ({
  //       "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
       
  //       "Actual Production ": row.actualProduction !== null ? row.actualProduction : "",
  //       "Cycle Time": row.cycleTime !== null ? row.cycleTime : "",
  //       "Run Time (Min)": row.runtimeInMins !== null ? row.runtimeInMins : "",
  //       "Ok Quality": row.qualityOk !== null ? row.qualityOk : "",
  //       "Defects": row.defects !== null ? row.defects : "",
  //       "Down Time": row.downtime !== null ? row.downtime : "",
  //       "Set Up Time": row.setUpTime !== null ? row.setUpTime : "",
  //       "Breakdown Time ":
  //         row.breakdownTime !== null ? row.breakdownTime : "",
  //         "BreakDown Frequncy":
  //         row.breakdownFrequency !== null ? row.breakdownFrequency : "", 
  //         "MTTR":
  //         row.mttr !== null ? row.mttr : "",
  //         "MTBF":
  //         row.mtbf !== null ? row.mtbf : "",
     
  //     }));
  //   };
  //   return { apiCall, formatData, fileName: "Operation_Report.xlsx" };
  // };

  // const handleDownloadPowerData = () => {
  //   const apiCall = () =>
  //     apiGetRawData(rawData.fromDate, rawData.toDate);
  //   const formatData = (data) => {
  //     const dataArray = Array.isArray(data) ? data : [data];
  //     return dataArray.map((row) => ({
  //       // "Date Time": row.dateTime != null ? row.dateTime : "",
  //      "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
       
  //       "Current R Phase ": row.currentRPhase !== null ? row.currentRPhase : "",
  //       "Current Y Phase": row.currentYPhase !== null ? row.currentYPhase : "",
  //       "Current B Phase": row.currentBPhase !== null ? row.currentBPhase : "",
  //       "Voltage R Phase": row.voltageRPhase !== null ? row.voltageRPhase : "",
  //       "Voltage Y Phase": row.voltageYPhase !== null ? row.voltageYPhase : "",
  //       "Voltage B Phase": row.voltageBPhase !== null ? row.voltageBPhase : "",
  //       "Power Factor": row.powerFactor !== null ? row.powerFactor : "",
  //       "KWH ":
  //         row.kwh !== null ? row.kwh : "",
        
  //     }));
  //   };
  //   return { apiCall, formatData, fileName: "Power_Data_Report.xlsx" };
  // };

 
  const handleDownloadCBM = (rawData) => {
    const formattedFromDate = format(parseISO(rawData.fromDate), "dd-MMM-yyyy");
    const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
    const formattedRawData = {
      machineNo: rawData.machineNo,
      fromDate: formattedFromDate,
      endDate: formattedToDate,
    };
  
    const apiCall = async () => {
      if (!formattedRawData.machineNo) {
        throw new Error("Machine number is required");
      }
      return await apiGetRawData(formattedRawData);
    };
  
    const formatData = (data) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return dataArray.map((row) => ({
        "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
        "Velocity X": row.velocityX != null ? row.velocityX : "",
        "Velocity Y": row.velocityY != null ? row.velocityY : "",
        "Velocity Z": row.velocityZ != null ? row.velocityZ : "",
        "Temperature": row.temperature != null ? row.temperature : "",
        "Acceleration": row.acceleration != null ? row.acceleration : "",
        "Velocity X 2": row.velocityX2 != null ? row.velocityX2 : "",
        "Velocity Y 2": row.velocityY2 != null ? row.velocityY2 : "",
        "Velocity Z 2": row.velocityZ2 != null ? row.velocityZ2 : "",
        "Temperature 2": row.temperature2 != null ? row.temperature2 : "",
        "Acceleration 2": row.acceleration2 != null ? row.acceleration2 : ""
      }));
    };
  
    return { apiCall, formatData, fileName: "CBM_Report.xlsx" };
  };
  
  const handleDownloadOperation = (rawData) => {
    const formattedFromDate = format(parseISO(rawData.fromDate), "dd-MMM-yyyy");
    const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
    const formattedRawData = {
      machineNo: rawData.machineNo,
      fromDate: formattedFromDate,
      endDate: formattedToDate,
    };
  
    const apiCall = async () => {
      if (!formattedRawData.machineNo) {
        throw new Error("Machine number is required");
      }
      return await apiGetRawData(formattedRawData);
    };
  
    const formatData = (data) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return dataArray.map((row) => ({
        "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
        "Actual Production": row.actualProduction !== null ? row.actualProduction : "",
        "Cycle Time": row.cycleTime !== null ? row.cycleTime : "",
        "Run Time (Min)": row.runtimeInMins !== null ? row.runtimeInMins : "",
        "Ok Quality": row.qualityOk !== null ? row.qualityOk : "",
        "Defects": row.defects !== null ? row.defects : "",
        "Down Time": row.downtime !== null ? row.downtime : "",
        "Set Up Time": row.setUpTime !== null ? row.setUpTime : "",
        "Breakdown Time": row.breakdownTime !== null ? row.breakdownTime : "",
        "BreakDown Frequency": row.breakdownFrequency !== null ? row.breakdownFrequency : "",
        "MTTR": row.mttr !== null ? row.mttr : "",
        "MTBF": row.mtbf !== null ? row.mtbf : ""
      }));
    };
  
    return { apiCall, formatData, fileName: "Operation_Report.xlsx" };
  };
  
  const handleDownloadPowerData = (rawData) => {
    const formattedFromDate = format(parseISO(rawData.fromDate), "dd-MMM-yyyy");
    const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
    const formattedRawData = {
      machineNo: rawData.machineNo,
      fromDate: formattedFromDate,
      endDate: formattedToDate,
    };
  
    const apiCall = async () => {
      if (!formattedRawData.machineNo) {
        throw new Error("Machine number is required");
      }
      return await apiGetRawData(formattedRawData);
    };
  
    const formatData = (data) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return dataArray.map((row) => ({
        "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
        "Current R Phase": row.currentR !== null ? row.currentR : "",
        "Current Y Phase": row.currentY !== null ? row.currentY : "",
        "Current B Phase": row.currentB !== null ? row.currentB : "",
        "Voltage R Phase": row.voltageR !== null ? row.voltageR : "",
        "Voltage Y Phase": row.voltageY !== null ? row.voltageY : "",
        "Voltage B Phase": row.voltageB !== null ? row.voltageB : "",
        "Power Factor": row.pf !== null ? row.pf : "",
        "KWH": row.kwh !== null ? row.kwh : ""
      }));
    };
  
    return { apiCall, formatData, fileName: "Power_Data_Report.xlsx" };
  };

  return (
    <div style={{ padding: "0px 20px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          paddingTop: "5px",
          paddingBottom: "10px",
        }}
      >
        <h2>Raw Data</h2>
      </div>

      <Tabs value={selectedTab} onChange={handleTabChange}>
      <Tab
          label="Operation"
          sx={{
            bgcolor: selectedTab === 0 ? "#1FAEC5" : "grey",
            color: "white !important",
            fontWeight: "bold",
            "&:hover": { bgcolor: selectedTab === 0 ? "#1FAEC5" : "#333" },
          }}
        />
        <Tab
          label="Power Data"
          sx={{
            bgcolor: selectedTab === 1 ? "#1FAEC5" : "grey",
            color: "white !important",
            fontWeight: "bold",
            "&:hover": { bgcolor: selectedTab === 1 ? "#1FAEC5" : "#333" },
          }}
        />
        <Tab
          label="CBM Data"
          sx={{
            bgcolor: selectedTab === 2 ? "#1FAEC5" : "grey",
            color: "white !important",
            fontWeight: "bold",
            "&:hover": { bgcolor: selectedTab === 2 ? "#1FAEC5" : "#333" },
          }}
        />
      
      </Tabs>


      <div style={{ marginTop: "10px" }}>
        {selectedTab === 0 && <DownloadReport {...handleDownloadOperation(rawData)} />}
        {selectedTab === 1 && <DownloadReport {...handleDownloadPowerData(rawData)} />}
        {selectedTab === 2 && (
          <DownloadReport {...handleDownloadCBM(rawData)} />
        )}
      
      </div>
      
      
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center", marginTop: "10px" }}
      >
          <>
            <Grid item xs={3} sm={3}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, marginRight: 1 }}
              >
                <InputLabel>Select Machine</InputLabel>
                  <Select
                    value={rawData.machineNo}
                    name="machineNo"
                    label="Machine"
                    onChange={handleInputChange}
                  >
                    {
                      machineData.map((machine)=>{
                        return (
                          <MenuItem key={machine.machineNo} value={machine.machineNo}>
                            {machine.displayMachineName}
                          </MenuItem>
                        );
                      })
                    }
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3}>
              <FormControl sx={{ minWidth: 250 }}>
                <TextField
                  label="Start Date"
                  name="fromDate"
                  type="date"
                  value={rawData.fromDate}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3}>
              <FormControl sx={{ minWidth: 250 }}>
                <TextField
                  label="End Date"
                  name="toDate"
                  type="date"
                  value={rawData.toDate}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSubmit}
              >
                OK
              </Button>
            </Grid>
          </>
        </Grid>
        

      <Box sx={{ marginTop: "0px", maxHeight: "400px", overflow: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {fields.map((field) => (
                    <StyledTableCell key={field.key}>
                      {field.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.length
                  ? data.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : Array.from(Array(rowsPerPage).keys())
                ).map((row, index) => (
                  <StyledTableRow key={index}>
                    {fields.map((field) => (
                      <StyledTableCell key={field.key}>
                        {row[field.key] || "0"}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
}

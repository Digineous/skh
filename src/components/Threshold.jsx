import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import DeleteConfirmationModal from "./deletemodal";
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { apiGetThreshold } from "../api/api.getthreshold";
import { apiGetPlant } from "../api/PlantMaster/api.getplant";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";
import { apiGetDevice } from "../api/DeviceMaster/api.getdevice";
import { apigetLines } from "../api/LineMaster/api.getline";


import { format } from "date-fns";
import { thresholdApi } from "../api/threshold";
import { apiGetThresholdParameters } from "../api/api.thresholdParameters";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const machines = [
  // { lineId: "4", lineName: "Energy", machineId: "5", machineName: "Energy" },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "12",
    machineName: "Stand -9 Motor ",
  },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "13",
    machineName: "Stand -12 Motor ",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
  },
];
const devices = [
  // { lineId: "7", lineName: "Mill -Angul", machineId: "13", machineName: "Stand -12 Motor ",device_no:'5' ,device_name:'Energy -2'},
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "13",
    machineName: "Stand -12 Motor ",
    device_no: "7",
    device_name: " GearBox Input DE",
  },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "13",
    machineName: "Stand -12 Motor ",
    device_no: "10",
    device_name: "Motor De",
  },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "13",
    machineName: "Stand -12 Motor ",
    device_no: "13",
    device_name: " GearBox Output DE",
  },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "12",
    machineName: "Stand -9 Motor ",
    device_no: "14",
    device_name: "Motor DE",
  },
  {
    lineId: "7",
    lineName: "Mill -Angul",
    machineId: "12",
    machineName: "Stand -9 Motor ",
    device_no: "15",
    device_name: "Motor NDE",
  },

  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "20",
    device_name: "Motor De",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "21",
    device_name: "Motor NDE",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "22",
    device_name: "Gearbox Input DE",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "23",
    device_name: "GearBox Output DE",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "24",
    device_name: "Pulley DE",
  },
  {
    lineId: "8",
    lineName: "Blast Furnace",
    machineId: "14",
    machineName: "Conveyor Belt ",
    device_no: "25",
    device_name: "Pulley NDE",
  },
];

export default function Threshold() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [plantNO, setPlantNO] = useState("");
  const [machineData, setMachineData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [thresholds, setThreshold] = useState([]);
  const [severity, setSeverity] = useState("success");
  const [error, setError] = useState(null);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [plantData, setPlantData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMachineId, setDeleteMchineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLine, setSelectedLine] = useState("");
  const [filteredLineData, setFilteredLineData] = useState([]);
  const [page, setPage] = useState(0);
  const [parameters, setParameters] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");

  const [selectedMachine, setSelectedMachine] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [thresholdData, setThresholdData] = useState({
    plantId: "",
    lineId: "",
    machineId: "",
    deviceId: "",
    parameterValue: "",
    output: null,
    mobileNumber: "",
    emailAddress: "",
    emailAddress2: "",
    emailAddress3: "",
    emailAddress4: "",
    emailMessage: "",

    redMin: "",
    redMax: "",
    redOutput: "",

    yellowMin: "",
    yellowMax: "",
    yellowOutput: "",

    greenMin: "",
    greenMax: "",
    greenOutput: "",
  });
  const [updateRowId, setUpdateRowId] = useState(null);

  useEffect(() => {
    const getThresholdDetails = async () => {
      try {
        const result = await apiGetThreshold();
        //console.log("result of api",result);
        
        //console.log(result.data.data, "Threshold data:");
        setThreshold(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in threshold");
      }
    };
    getThresholdDetails();
  }, [refreshData]);
  
  useEffect(() => {
    const getLineDetails = async () => {
      try {
        const result = await apigetLines();
        //console.log(result.data.data, "line data:");
        setLineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in line");
      }
    };
    getLineDetails();
  }, [refreshData]);

  
  useEffect(() => {
    const getPlantDetails = async () => {
      try {
        const result = await apiGetPlant();
        //console.log(result.data.data, "plant data:");
        setPlantData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in plant");
      }
    };
    getPlantDetails();
  }, [refreshData]);

  
  useEffect(() => {
    const getMachineDetails = async () => {
      try {
        const result = await apigetMachine();
        //console.log(result.data.data, "machine data:");
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in machine");
      }
    };
    getMachineDetails();
  }, [refreshData]);

  useEffect(() => {
    const getDeviceDetails = async () => {
      try {
        const result = await apiGetDevice();
        //console.log(result.data.data, "device data:");
        setDeviceData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error in device");
      }
    };
    getDeviceDetails();
  }, [refreshData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleGetParameters = async () => {
    try {
      const response = await apiGetThresholdParameters(
        thresholdData.plantId,
        thresholdData.lineId,
        thresholdData.machineId,
        thresholdData.deviceNo
      );
      //console.log("parameter values:", response.data.data);
      if (response && response.data && Array.isArray(response.data.data)) {
        const parameterNames = response.data.data.map(
          (item) => item.parameterName
        );
        setParameters(parameterNames);
      } else {
        console.error("Unexpected response format:", response);
        setParameters([]);
      }
    } catch (error) {
      console.error("Failed to fetch parameters:", error);
      setParameters([]);
    }
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...thresholdData,
        plantId: parseInt(thresholdData.plantId),
        lineId: parseInt(thresholdData.lineId),
        machineId: parseInt(thresholdData.machineId),
        redMin: parseFloat(thresholdData.redMin),
        redMax: parseFloat(thresholdData.redMax),
        yellowMin: parseFloat(Number(thresholdData.greenMax)+0.1),
        yellowMax: parseFloat(Number(thresholdData.redMin)-0.1),
        greenMin: parseFloat(thresholdData.greenMin),
        greenMax: parseFloat(thresholdData.greenMax),
      };
      await thresholdApi.addThreshold(payload);

      handleModalClose();
      handleSnackbarOpen("Threshold added successfully!", "success");
      setRefreshData((prev) => !prev);
    } catch (error) {
      handleSnackbarOpen("Error adding threshold. Please try again.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setThresholdData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "plantId") {
      setSelectedPlant(value);
    } else if (name === "lineId") {
      setSelectedLine(value);
      const filteredMachines = machines.filter(
        (machine) => machine.lineId === value
      );
      setFilteredMachines(filteredMachines);
      setFilteredDevices([]);
    } else if (name === "machineId") {
      setSelectedMachine(value);
      const filteredDevices = devices.filter(
        (device) => device.machineId === value
      );
      setFilteredDevices(filteredDevices);
    }
  };

  const handleEditClick = (row) => {
    setThresholdData(row);
    setUpdateRowId(row.id);
    setIsUpdateMode(true);
    setUpdateOpen(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!updateRowId) {
      handleSnackbarOpen("No row selected for update.", "error");
      return;
    }

    try {
      const payload = {
        ...thresholdData,
        plantId: parseInt(thresholdData.plantId),
        lineId: parseInt(thresholdData.lineId),
        machineId: parseInt(thresholdData.machineId),
        redMin: parseFloat(thresholdData.redMin),
        redMax: parseFloat(thresholdData.redMax),
        yellowMin: parseFloat(Number(thresholdData.greenMax)+0.1),
        yellowMax: parseFloat(Number(thresholdData.redMin)-0.1),
        greenMin: parseFloat(thresholdData.greenMin),
        greenMax: parseFloat(thresholdData.greenMax),
      };
      await thresholdApi.updateThreshold(updateRowId, payload);
      setUpdateOpen(false);
      setIsUpdateMode(false);
      handleSnackbarOpen("Threshold updated successfully!", "success");
      setRefreshData((prev) => !prev);
    } catch (error) {
      handleSnackbarOpen(
        "Error updating threshold. Please try again.",
        "error"
      );
    }
  };

  const handleClose = () => {
    setUpdateOpen(false);
    setIsUpdateMode(false);
  };

  const handleDeleteClick = (row) => {
    setDeleteMchineId(row.id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await thresholdApi.deleteThreshold(deleteMachineId);
      handleSnackbarOpen("Data Deleted successfully!", "success");
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error deleting data:", error);
      handleSnackbarOpen("Error deleting data. Please try again.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };
  useEffect(() => {
    if (
      thresholdData.plantId &&
      thresholdData.lineId &&
      thresholdData.machineId
    ) {
      handleGetParameters();
    }
  }, [thresholdData.plantId, thresholdData.lineId, thresholdData.machineId]);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, machineData.length - page * rowsPerPage);
  const handleModalClose = () => {
    setThresholdData({
      machineId: "",
      plantNo: "",
      lineNo: "",
      machineName: "",
      displayMachineName: "",
      lineProductionCount: "",
      cycleTime: "",
    });
    setAddOpen(false);
    setUpdateOpen(false);
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div style={{ padding: "0px 20px" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 0px 20px 0px ",
            }}
          >
            <h2>Thresholds</h2>
            <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
              <Button
                onClick={() => setAddOpen(true)}
                style={{
                  fontWeight: "500",
                  borderRadius: "4px",
                  color: "gray",
                  border: "2px solid gray",
                  padding: "5px",
                  marginBottom: "5px",
                }}
              >
                {" "}
                Add New &nbsp;{" "}
                <FontAwesomeIcon
                  style={{ fontSize: "18px", color: "gray" }}
                  icon={faPlus}
                />
              </Button>
            </div>
          </div>
          <Box sx={{ marginTop: "20px", maxHeight: "500px", overflow: "auto" }}>
            <Table
              size="small"
              style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell className="table-cell">
                    Plant Name
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Line Name
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Machine Name
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Device Name
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Parameter Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Output
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Email Address 1
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Email Address 2
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Email Address 3
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Email Address 4
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Email Message
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Min
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Max
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Min Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Max Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Output
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Yellow Min
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Yellow Max
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Yellow Min Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Yellow Max Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Yellow Output
                  </StyledTableCell>

                  <StyledTableCell className="table-cell">
                    Green Min
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Max
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Min Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Max Value
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Output
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Created Date
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Red Device ID
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Device ID
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Green Device
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {thresholds.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell className="table-cell">
                      {row.plantName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.lineName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.machineName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.deviceName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.parameterValue}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.output}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.emailAddress}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.emailAddress2}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.emailAddress3}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.emailAddress4}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.emailMessage}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.redMinRange}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.redMaxRange}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.redMin}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.redMax}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.redOutput}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.yellowMinRange}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.yellowMaxRange}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {Number(row.greenMax)+0.1}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {Number(row.redMin)-0.1}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.yellowOutput}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.greenMinRange}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.greenMaxRange}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.greenMin}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.greenMax}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.greenOutput}
                    </StyledTableCell>{" "}
                    <StyledTableCell className="table-cell">
                      {row.createdAt}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.rDeviceId}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.yDeviceId}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.gDeviceId}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                      className="table-cell"
                    >
                      <IconButton onClick={() => handleEditClick(row)}>
                        <EditIcon />
                      </IconButton>
                      <div
                        className="divider"
                        style={{
                          height: "20px",
                          width: "2px",
                          backgroundColor: "#0003",
                        }}
                      ></div>
                      <IconButton onClick={() => handleDeleteClick(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 }}>
                    <StyledTableCell
                      colSpan={31}
                      style={{ position: "relative" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {`No further data available`}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={machineData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          <Modal open={addOpen || updateOpen} onClose={handleModalClose}>
            <div
              style={{
                borderRadius: "10px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                minWidth: "500px",
              }}
            >
              <button
                onClick={handleModalClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "30px",
                }}
              >
                &times;
              </button>
              <h2>{isUpdateMode ? "Update Threshold" : "Add New Threshold"}</h2>
              <hr />
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "12ch", marginRight: "10px" }}>
                  <InputLabel>Plant Name</InputLabel>
                  <Select
                    name="plantNo"
                    value={plantData.plantNo}
                    onChange={handleInputChange}
                  >
                   {
                      plantData.map((plant)=>{
                        return (
                          <MenuItem key={plant.plantNo} value={plant.plantNo}>
                            {plant.plantName}
                          </MenuItem>
                        );
                      })
                    }
                    {/* <MenuItem value="1" >Linamer</MenuItem> */}
                   
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "15ch", marginRight: "10px" }}>
                  <InputLabel>Line Name</InputLabel>
                  <Select
                    value={lineData.lineNo}
                    name="lineNo"
                    label="Line"
                    onChange={handleInputChange}
                  >
                    {
                      lineData.map((line)=>{
                        return (
                          <MenuItem key={line.lineNo} value={line.lineNo}>
                            {line.lineName}
                          </MenuItem>
                        );
                      })
                    }

{/* 
                    {[
                      ...new Set(machines.map((machine) => machine.lineId)),
                    ].map((lineId) => {
                      const line = machines.find(
                        (machine) => machine.lineId === lineId
                      );
                      return (
                        <MenuItem key={lineId} value={lineId}>
                          {line.lineName}
                        </MenuItem>
                      );  
                    })} */}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "15ch", marginRight: "10px" }}>
                  <InputLabel>Machine Name</InputLabel>
                  <Select
                    value={thresholdData.machineId}
                    name="machineId"
                    label="Machine"
                    onChange={handleInputChange}
                  >
                    {machineData.map((machine) => (
                      <MenuItem
                        key={machine.machineNo}
                        value={machine.machineNo}
                      >
                        {machine.machineName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "26ch", marginRight: "10px" }}>
                  <InputLabel>Device Name</InputLabel>
                  <Select
                    value={thresholdData.deviceId}
                    name="deviceId"
                    label="Device"
                    onChange={handleInputChange}
                  >
                    {deviceData.map((device) => (
                      <MenuItem
                        key={device.deviceNo}
                        value={device.deviceNo}
                      >
                        {device.deviceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "20ch" }}>
                  <InputLabel>Parameter</InputLabel>
                  <Select
                    name="parameterValue"
                    label="Parameter Value"
                    value={thresholdData.parameterValue}
                    onChange={handleInputChange}
                  >
                    {parameters.map((parameterName, index) => (
                      <MenuItem key={index} value={parameterName}>
                        {parameterName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "20ch" }}>
                  <TextField
                    name="mobileNumber"
                    label="Mobile Number"
                    value={thresholdData.mobileNumber}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl sx={{ width: "30ch" }}>
                  <TextField
                    name="emailMessage"
                    label="Email Message"
                    value={thresholdData.emailMessage}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="emailAddress"
                    label="Email Address"
                    value={thresholdData.emailAddress}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="emailAddress2"
                    label="Email Address 2"
                    value={thresholdData.emailAddress2}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="emailAddress3"
                    label="Email Address 3"
                    value={thresholdData.emailAddress3}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="emailAddress4"
                    label="Email Address 4"
                    value={thresholdData.emailAddress4}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="redMin"
                    label="Red Min"
                    value={thresholdData?.redMin}
                    onChange={handleInputChange}
                  />{" "}
                </FormControl>

                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="redMax"
                    label="Red Max"
                    value={thresholdData?.redMax}
                    onChange={handleInputChange}
                  />{" "}
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="greenMin"
                    label="Green Min"
                    value={thresholdData?.greenMin}
                    onChange={handleInputChange}
                  />{" "}
                </FormControl>

                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="greenMax"
                    label="Green Max"
                    value={thresholdData?.greenMax}
                    onChange={handleInputChange}
                  />{" "}
                </FormControl>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormControl sx={{ width: "35ch" }}>
                  <TextField
                    name="yellowMin"
                    label="Yellow Min"
                    v value={thresholdData.greenMax?Number(thresholdData.greenMax) + 0.1:""}
                    onChange={handleInputChange}
                  />{" "}
                </FormControl>

                <FormControl sx={{ width: "35ch" }}>
  <TextField
    name="yellowMax"
    label="Yellow Max"
    value={
      thresholdData?.redMin 
        ? Number(thresholdData.redMin) - 0.1 
        : ""
    }
    onChange={handleInputChange}
  />
</FormControl>
              </div>

              <Button
                onClick={isUpdateMode ? handleUpdateSubmit : handleAddSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                {isUpdateMode ? "Update" : "Add"}
              </Button>
            </div>
          </Modal>
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
          />

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <MuiAlert
              onClose={() => setOpenSnackbar(false)}
              severity={severity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </div>
      )}
    </div>
  );
}

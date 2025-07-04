import React, { useEffect, useState } from "react";
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
  TableRow,
  TextField,
  styled,
  tableCellClasses,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuthCheck } from "../../utils/Auth";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetShift } from "../../api/api.getshift";
import { apiMachineMaster } from "../../api/MachineMaster/api.addmachine";


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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ShiftMaster() {
  const [machinedata, setMachinedata] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [machineID, setMachineID] = useState("");
  const [plantNO, setPlantNO] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCOde] = useState("");
  const [lineProductionCount, setLineProductionCount] = useState("");
  const [lineName, setLineName] = useState("");
  const [severity, setSeverity] = useState("success");
  const [shiftData,setShiftData]=useState([])
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

useAuthCheck()
  useEffect(() => {
    const getmachine = async () => {
      try {
        const result = await apigetMachine();
        //console.log(result?.data.data);
        setMachinedata(result?.data.data);
        //console.log("machine", machinedata);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    return () => {
      getmachine();
    };
  }, []);
  useEffect(() => {
    const  getShift= async () => {
      try {
        const result = await apiGetShift();
        //console.log("shiftdata",result.data.data);
        setShiftData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getShift();
  }, [refreshData]);
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handlePlaneNOChange = (event) => {
    setPlantNO(event.target.value);
  };
  const handleMachineIDChange = (event) => {
    setMachineID(event.target.value);
  };
  const handleMachineNameChange = (event) => {
    setMachineName(event.target.value);
  };
  const handleMachineCodeChange = (event) => {
    setMachineCOde(event.target.value);
  };
  const handleLineNameChange = (event) => {
    setLineName(event.target.value);
  };
  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiMachineMaster(
        machineCode,
        machineID,
        machineName,
        plantNO,
        lineProductionCount,
        lineName
      );
      setAddOpen(false);
      //console.log(
      //   "mcode,mid,plantno,lpc,linen",
      //   machineCode,
      //   machineID,
      //   machineName,
      //   plantNO,
      //   lineProductionCount,
      //   lineName
      // );
      handleSnackbarOpen("Machine added successfully!", "success"); // Pass severity as "success"
      //console.log("response", result.data);
    } catch (error) {
      console.error("Error adding machine:", error);
      handleSnackbarOpen("Error adding machine. Please try again.", "error"); // Pass severity as "error"
    }
  };
  const handleEditClick = () => {
    alert("edit");
  };
  const handleDeleteClick = () => {
    alert("delete");
  };

  return (
    <div style={{ padding: "0px 20px" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          paddingBottom: "10px",
        }}
      >
        <h2>Shift Master</h2>
    
     
        {/* <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
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
        </div> */}
        </div>
        <Box>
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
                Line Name{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Machine Name
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Shift Name
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Shift Start Date
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Shift End Date{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Tea Break Start1{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Tea Break End1{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Tea Break Start2{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Tea Break End2{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Meal Break Start{" "}
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Meal Break End{" "}
              </StyledTableCell>

              {/* <StyledTableCell  className="table-cell">Line Name</StyledTableCell > */}
              {/* <StyledTableCell className="table-cell">Edit</StyledTableCell>
              <StyledTableCell className="table-cell">Delete</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {shiftData.map((row, index) => (
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
                  {row.shiftName}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.startTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.endTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.firstTeaBreakStartTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.firstTeaBreakEndTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.secondTeaBreakStartTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.secondTeaBreakEndTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.lunchBreakStartTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.lunchBreakEndTime}
                </StyledTableCell>

                {/* <StyledTableCell className="table-cell">
                  <IconButton onClick={() => handleEditClick(row)}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  <IconButton onClick={() => handleDeleteClick(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={addOpen} onClose={() => setAddOpen(false)}>
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
              onClick={() => setAddOpen(false)}
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
            <h2>Add Reason</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select value={plantNO} onChange={handlePlaneNOChange}>
                  <MenuItem value="1">SPRL</MenuItem>
                  {/* <MenuItem value={2}>Machine 2</MenuItem>
          <MenuItem value={3}>Machine 3</MenuItem>
          <MenuItem value={4}>Machine 4</MenuItem>
          <MenuItem value={5}>Machine 5</MenuItem> */}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Line Name</InputLabel>
                <Select value={lineName} onChange={handleLineNameChange}>
                  <MenuItem value="1">Pathredi</MenuItem>
                  <MenuItem value="2">Ghaziabad </MenuItem>
                  <MenuItem value="3">Head Office</MenuItem>
                  {/* <MenuItem value={4}>Machine 4</MenuItem>
          <MenuItem value={5}>Machine 5</MenuItem> */}
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
              {/* <FormControl sx={{ width: "26ch" }}>
                  <InputLabel>Line Production Count</InputLabel>
                  <Select value={lineProductionCount} onChange={handleLPCChange}>
                    <MenuItem value="N">N</MenuItem>
                    <MenuItem value="Y">Y</MenuItem>
                   
                  </Select>
                </FormControl> */}
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select value={machineCode} onChange={handleMachineCodeChange}>
                  <MenuItem value="M-1">M-1</MenuItem>
                  <MenuItem value="M-2">M-2</MenuItem>
                  <MenuItem value="M-3">M-3</MenuItem>
                  <MenuItem value="M-4">M-4</MenuItem>
                  <MenuItem value="M-5">M-5</MenuItem>
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
             
               <FormControl >
               <TextField
                 label="Start Time"
                 type="datetime-local"
                 defaultValue="2024-03-20T09:00"
                 style={{width:'225px'}}
               />
             </FormControl>
             <FormControl >
               <TextField
                 label="End Time"
                 type="datetime-local"
                 defaultValue="2024-03-20T09:00"
                 style={{width:'225px'}}
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
              <TextField
                label="Reason "
                value={machineID}
                onChange={handleMachineIDChange}
                style={{ marginRight: "10px" }}
              />
            </div>

            <Button
              onClick={handleAddSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Add
            </Button>
          </div>
        </Modal>
      </Box>
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
  );
}

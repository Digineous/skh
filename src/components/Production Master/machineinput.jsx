import {
  Box,  Button,  FormControl,  IconButton,  InputLabel,  MenuItem,  Modal,  Select,  Table,  TableBody,  TableCell,  TableHead,  TableRow,  TextField,  styled, tableCellClasses} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { apiMachineMaster } from "../../api/MachineMaster/api.addmachine";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { apiGetMachineInput } from "../../api/api.getmachineinput";
import { apiGetPart } from "../../api/PartMaster/api.getpart";
import { apiUpdateMachineInput } from "../../api/api.updatemachineinput";


const staticData = [
  {
    plantName: "Head office",
    displayMachineName: "FUN WITH GAME",
    runningPartName: "Part_B",
    cycleTime: "5",
    selectPart: "",
  },
  {
    plantName: "Ghaziabad",
    displayMachineName: "GZB PM P1 440 FBM",
    runningPartName: "13/PC20/9",
    cycleTime: "20",
    selectPart: "",
  },
  {
    plantName: "Ghaziabad",
    displayMachineName: "GZB EVM YRA 308 WS",
    runningPartName: "LINE-6A EI K12B NEW YRA (EXPORT)",
    cycleTime: "7.91",
    selectPart: "",
  },
  {
    plantName: "Ghaziabad",
    displayMachineName: "GZB PF 57 Die",
    runningPartName: "17/PC90/2",
    cycleTime: "90",
    selectPart: "",
  },
  {
    plantName: "Ghaziabad",
    displayMachineName: "GZB EVM YRA 310",
    runningPartName: "LINE-6A EI K12B NEW YRA (EXPORT)",
    cycleTime: "8.91",
    selectPart: "",
  },
  {
    plantName: "Ghaziabad",
    displayMachineName: "GZB EVM YRA 308 AS",
    runningPartName: "LINE-6A EI K12B NEW YRA (EXPORT)",
    cycleTime: "7.91",
    selectPart: "",
  },
  {
    plantName: "Pathredi",
    displayMachineName: "PTH PM L4 FBM1",
    runningPartName: "9/PC32/2",
    cycleTime: "32",
    selectPart: "",
  },
  {
    plantName: "Pathredi",
    displayMachineName: "PTH PM L3 FBM",
    runningPartName: "WABCO Ø 100 STD",
    cycleTime: "35",
    selectPart: "",
  },
  {
    plantName: "Pathredi",
    displayMachineName: "PTH EVM EX3",
    runningPartName: "EX_MSIL YED CNG",
    cycleTime: "5.8",
    selectPart: "",
  },
  {
    plantName: "Pathredi",
    displayMachineName: "PTH EVM EX1",
    runningPartName: "EX_MSIL YED CNG",
    cycleTime: "5.8",
    selectPart: "",
  },
  {
    plantName: "Pathredi",
    displayMachineName: "PTH EVM EX2",
    runningPartName: "33/PC2.4/6",
    cycleTime: "4.8",
    selectPart: "",
  },
];

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

export default function MachineInput() {
  const [machineInputData, setMachineInputData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [updateopen, setUpdateOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [partData, setPartData] = useState([]);

  const [machineID, setMachineID] = useState("");
  const [plantNO, setPlantNO] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCOde] = useState("");
  const [lineProductionCount, setLineProductionCount] = useState("");
  const [lineName, setLineName] = useState("");
  const [severity, setSeverity] = useState("success");
  const [error, setError] = useState(null);
  const [selectedPlant,setSelectedPlant]=useState("")
  const [updatedData, setUpdatedData] = useState({
    partNo: "",
    cycleTime: "",
  });
  const [machineInput, setMachineInput] = useState({
    partId: '',
    // other default fields you need
  });
  
  const [cycleTime, setCycleTime] = useState('');
  const [selectedPartData, setSelectedPartData] = useState(null);
  

  useEffect(() => {
    getMachineInput();
  }, [refreshData]);  

  useEffect(() => {
    getParts();
  }, [refreshData]);

  const getParts = async () => {
    try {
      const result = await apiGetPart();
      //console.log("part data:",result.data.data);
      setPartData(result.data.data);
    } catch (error) {
      setError(error.message);
      handleSnackbarOpen(error.message, "error");
    }
  };

  const getMachineInput = async () => {
    try {
      const result = await apiGetMachineInput();
      //console.log(result?.data.data);
      setMachineInputData(result?.data.data);
      //console.log("machine", result.data.data);
    } catch (error) {
      setError(error.message);
      handleSnackbarOpen(error.message, "error");
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handlePartChange = (e) => {
    const selectedPartId = parseInt(e.target.value);
    setMachineInput({ ...machineInput, partId: selectedPartId });
  
    const selectedPart = partData.find(part => part.partId === selectedPartId);
    if (selectedPart) {
      setCycleTime(selectedPart.cycleTime); // <-- stores the cycleTime
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddSubmit = async (event) => {
    const body = {
      id: updatedData.id,
      partId: machineInput.partId,
      cycleTime: cycleTime,
        }

        //console.log("body:", body);
    event.preventDefault(); 
    try {
      const result = await apiUpdateMachineInput(body);
      setAddOpen(false);
      getMachineInput();
      handleSnackbarOpen("Machine input updated successfully!", "success");
      //console.log("response", result.data);
      getParts();
    } catch (error) {
      console.error("Error adding machine:", error);
      handleSnackbarOpen("Error adding machine input. Please try again.", "error");
    }
  };
  const handleEditClick = (row) => {
    setAddOpen(true);
    setUpdatedData(row);
    setSelectedPlant(row.plantName); 
    //console.log("selected plant:",selectedPlant)
  };

  const handleModalClose = () => {
   setUpdatedData({
    cycleTime:"",
    partNo:""
   })
    setAddOpen(false);
  };
  const filteredParts = partData.filter((part) => part.plantName === selectedPlant);
  return (
    <div style={{ padding: "0px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >
        <h2>Machine Input</h2>
      </div>
      <Box>
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
              <FontAwesomeIcon style={{ fontSize: "18px",color:"gray" }} icon={faPlus} />
            </Button>
          </div> */}
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
                {" "}
                Display Machine Name{" "}
              </StyledTableCell>
              {/* <StyledTableCell  className="table-cell">
                  Line Production Count
                </StyledTableCell > */}
              <StyledTableCell className="table-cell">
                Running Part Name
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Cycle Time
              </StyledTableCell>
              <StyledTableCell className="table-cell">
                Select Part
              </StyledTableCell>
              {/* <StyledTableCell  className="table-cell">Line Name</StyledTableCell >
                <StyledTableCell  className="table-cell">Edit</StyledTableCell >
                <StyledTableCell  className="table-cell">Delete</StyledTableCell > */}
            </TableRow>
          </TableHead>
          <TableBody>
            {machineInputData.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell className="table-cell">
                  {row.plantName}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.displayMachineName}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.partName}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  {row.cycleTime}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  <IconButton onClick={() => handleEditClick(row)}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={addOpen} onClose={() => setAddOpen(false)}>
          <div
            style={{
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
            <h2>Machine Input</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Operation Name</InputLabel>
                <Select
                  name="partId"
                  value={machineInput?.partId}
                  onChange={handlePartChange}
                >
                  {filteredParts.map((part, index) => (
                    <MenuItem key={part.partId} value={part?.partId}>
                     {part?.partNo}-{part?.partName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

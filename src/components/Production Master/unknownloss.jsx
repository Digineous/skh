import {
  Box,
  Button,
  CircularProgress,
  FormControl,
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
  IconButton,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


import { format } from "date-fns";
import { parseISO } from "date-fns";
import { Tabs, Tab } from "@mui/material";

import { Edit, Visibility } from "@mui/icons-material";
import { useAuthCheck } from "../../utils/Auth";
import { apiGetMachineInput } from "../../api/MachineMaster/api.getmachineinput";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apiGetPart } from "../../api/PartMaster/api.getpart";
import { apiQLossData } from "../../api/UnknownLoss/api.unknownlossreport";
import { apiQLossReport } from "../../api/UnknownLoss/api.unknowlossdata";
import { apiUpdateULoss } from "../../api/UnknownLoss/api.updateuloss";
import { apiViewALoss } from "../../api/UnknownLoss/api.viewALoss";
import ALossReportModal from "./ALossReportModal";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#1FAEC5",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "black",
  backgroundColor: "grey",
  "&.Mui-selected": {
    color: "white",
    backgroundColor: "#1FAEC5",
  },
}));

export default function UnknownLoss() {
  const [tableData, setTableData] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [machineInputData, setMachineInputData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [partData, setPartData] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [machineData, setMachineData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [unknownLossReport, setUnknownLossReport] = useState({
    lineNo: "",
    machineId: "",
    shiftId: "",
  });
  const [uReports, setUReports] = useState([]);
  const [unknownLossData, setUnknownLossData] = useState({
    lineNo: "",
    machineId: "",
    cdate: "23:01:1997",
    shiftId: "",
  });
  const [data, setData] = useState([]);
  const [aLossReport, setALossReport] = useState([]);
  const [aLossModalOpen, setALossModalOpen] = useState(false);

  const [selectedLine, setSelectedLine] = useState("");
  const [error, setError] = useState(null);
  const [unknownLossReports, setUnknownLossReports] = useState([]);

  const [updatedData, setUpdatedData] = useState({
    id: "",
    machineId: "",
    dateTime: "",
    filledULoss: "",
    reason: "",
  });

 useAuthCheck()
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [machineInputResult] = await Promise.all([apiGetMachineInput()]);
        const machineInputData1 = machineInputResult.data.data;
        console.log("machine input data:", machineInputData1);
        setMachineInputData(machineInputData1);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshData]);

  useEffect(() => {
    const getmachine = async () => {
      try {
        const result = await apigetMachine();
        console.log("Result data machine:", result.data.data); 
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getmachine();
  }, [refreshData]);
  useEffect(() => {
    const getLine = async () => {
      try {
        const result = await apigetLines();
        console.log("Result data line:", result.data.data); 
        setLineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getLine();
  }, [refreshData]);

  useEffect(() => {
    const getParts = async () => {
      try {
        const result = await apiGetPart();
        console.log("part data:", result.data.data);
        setPartData(result.data.data);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      }
    };
    getParts();
  }, [refreshData]);

  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setUnknownLossData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };
  const handleOkClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...unknownLossData };
      delete dataToSend.cdate;

      // setAddOpen(false);
      console.log("formatted unknown loss data:", dataToSend);
      const result = await apiQLossData(dataToSend);

      // await getmachine();
      handleSnackbarOpen("Unkown loss Data fetched successfully!", "success"); 
      // setLoading(false);
      console.log("Unknown loss response", result.data);
      setData(result.data);
      const newData = result.data;
      setTableData(newData);
      setRefreshData((prev) => !prev);
    } catch (error) {
      // setLoading(false);
      console.error("Error getting unknown loss data:", error);
      handleSnackbarOpen(
        "Error fetching unknown loss data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
      dateTime: new Date().toISOString(),
    }));
  };

  const handleGetReport = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formattedFromDate = format(
        parseISO(unknownLossData.cdate),
        "dd-MMM-yyyy"
      );

      const formattedRawData = {
        ...unknownLossData,
        cdate: formattedFromDate,
        shiftId: parseInt(unknownLossData.shiftId, 10), 
      };

      const response = await apiQLossReport(formattedRawData);
      const newReportData = response.data;
      setUnknownLossReports(newReportData);
      handleSnackbarOpen(
        "Unknown loss report fetched successfully!",
        "success"
      );
      console.log("Unknown loss report response", response.data);
    } catch (error) {
      console.log("Unknown loss report error.", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting updated data:", updatedData);
      if (!updatedData.dateTime) {
        setUpdatedData((prevData) => ({
          ...prevData,
        }));
      }
      const dataToSubmit = {
        ...updatedData,
        filledULoss: parseInt(updatedData.filledULoss, 10),
      };

      const result = await apiUpdateULoss(dataToSubmit);
      setAddOpen(false);

      handleSnackbarOpen("Unknown loss updated successfully!", "success");
      console.log("Unknown loss update response", result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error updating unknown loss:", error);
      handleSnackbarOpen(
        "Error updating unknown loss. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleViewAloss = async (row) => {
    try {
      const response = await apiViewALoss({
        machineNo: row.machineId,
        dateTime: row.dateTime,
      });
      console.log("view a loss data:",response.data)
      setALossReport(response.data);
      setALossModalOpen(true);
    } catch (error) {
      console.error("Error fetching A Loss report:", error);
      handleSnackbarOpen(
        "Error fetching A Loss report. Please try again.",
        "error"
      );
    }
  };
  const handleEditClick = (row) => {
    setUpdatedData({
      id: row.id,
      machineId: row.machineId,
      dateTime: row.dateTime,
      filledULoss: "",
      reason: "",
    });
    setSelectedPlant(row.plantName);
    setSelectedMachine(row.displayMachineName);
    console.log(
      "selected plant:",
      row.plantName,
      "selected machine:",
      row.displayMachineName
    );
    setAddOpen(true);
  };

  const handleModalClose = () => {
    setUpdatedData({
      id: "",
      partId: "",
      cycleTime: "",
      partNo: "",
    });
    setAddOpen(false);
  };

  useEffect(() => {
    console.log(
      "selectedPlant:",
      selectedPlant,
      "selectedMachine:",
      selectedMachine
    );
    console.log("partData:", partData);
  }, [selectedPlant, selectedMachine, partData]);

  const filteredParts = partData.filter(
    (part) =>
      part.plantName === selectedPlant && part.machineName === selectedMachine
  );

  useEffect(() => {
    console.log("filteredParts:", filteredParts);
  }, [filteredParts]);

  return (
    <>
      <div style={{ padding: "0px 20px" }}>
        <h2 style={{ margin: "20px 0px 20px 0px " }}>Unknown Loss</h2>

        <StyledTabs value={currentTab} onChange={handleTabChange}>
          <StyledTab label="Unknown Loss Data" />
          <StyledTab label="View Reports" />
        </StyledTabs>
        {currentTab === 0 && (
          <>
            <Grid
              container
              spacing={2}
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              <Grid item xs={6} sm={3}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Select Plant</InputLabel>
                  <Select
                    name="lineNo"
                    value={unknownLossData?.lineNo}
                    onChange={handleInputChange}
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
                  <InputLabel>Select Machine</InputLabel>
                  <Select
                    name="machineId"
                    value={unknownLossData?.machineNo}
                    onChange={handleInputChange}
                  >
                    {filteredMachines.map((machine) => (
                      <MenuItem key={machine.id} value={machine.machineNo}>
                        {machine.displayMachineName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Select Shift</InputLabel>
                  <Select
                    name="shiftId"
                    value={unknownLossData?.value}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">Shift A</MenuItem>
                    <MenuItem value="2">Shift B</MenuItem>
                    <MenuItem value="3">Shift C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOkClick}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Table
                  size="small"
                  style={{
                    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                    marginBottom: "50px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell className="table-cell">
                        Plant Name
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        Machine Id
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        Machine Name
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        Date Time
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        Add A Loss
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell className="table-cell">
                          {row.plantName}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.machineId}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.machineName}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.dateTime}
                        </StyledTableCell>
                        {/* <StyledTableCell className="table-cell">
                          {row.unknownLoss}
                        </StyledTableCell> */}
                        <StyledTableCell className="table-cell">
                          <IconButton onClick={() => handleViewAloss(row)}>
                            <Edit />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
            <Modal open={addOpen} onClose={handleModalClose}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
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
                <h2>Unknown Loss Reason</h2>
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
                    <InputLabel>Reason</InputLabel>
                    <Select
                      name="reason"
                      value={updatedData.reason}
                      onChange={handleUpdateChange}
                    >
                      <MenuItem value="Breakdown Loss">Breakdown Loss</MenuItem>
                      <MenuItem value="Planned Maintenance Loss">
                        Planned Maintenance Loss
                      </MenuItem>
                      <MenuItem value="Setup & Adjustment Loss">
                        Setup & Adjustment Loss
                      </MenuItem>
                      <MenuItem value="Cutting Blade Change Loss">
                        Cutting Blade Change Loss
                      </MenuItem>
                      <MenuItem value="Startup Loss">Startup Loss</MenuItem>
                      <MenuItem value="Minor Stoppage Loss">
                        Minor Stoppage Loss
                      </MenuItem>
                      <MenuItem value="Speed Loss">Speed Loss</MenuItem>
                      <MenuItem value="Defecty & Rework Loss">
                        Defecty & Rework Loss
                      </MenuItem>
                      <MenuItem value="Management Loss">
                        Management Loss
                      </MenuItem>
                      <MenuItem value="Operation Motion Loss (OML)">
                        Operation Motion Loss (OML)
                      </MenuItem>
                      <MenuItem value="Line Organization Loss (LOL)">
                        Line Organization Loss (LOL)
                      </MenuItem>
                      <MenuItem value="Distribution/Logistic Loss">
                        Distribution/Logistic Loss
                      </MenuItem>
                      <MenuItem value="Measurement & Adjustment Loss">
                        Measurement & Adjustment Loss
                      </MenuItem>
                      <MenuItem value="Yield Loss">Yield Loss</MenuItem>
                      <MenuItem value="Energy Loss">Energy Loss</MenuItem>
                      <MenuItem value="Die & Tool Loss">
                        Die & Tool Loss
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    value={updatedData.filledULoss}
                    name="filledULoss"
                    onChange={handleUpdateChange}
                    label="U Loss (in sec)"
                    sx={{ width: "26ch" }}
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
          </>
        )}

        {currentTab === 1 && (
          <>
            <Grid
              container
              spacing={2}
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              <Grid item xs={6} sm={3}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Select Plant</InputLabel>
                  <Select
                    name="lineNo"
                    value={unknownLossData?.lineNo}
                    onChange={handleInputChange}
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
                  <InputLabel>Select Machine</InputLabel>
                  <Select
                    name="machineId"
                    value={unknownLossData?.machineNo}
                    onChange={handleInputChange}
                  >
                    {filteredMachines.map((machine) => (
                      <MenuItem key={machine.id} value={machine.machineNo}>
                        {machine.displayMachineName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl sx={{ minWidth: 250 }}>
                  <TextField
                    label="Select Date"
                    name="cdate"
                    type="date"
                    placeholder="Select Date"
                    value={unknownLossData?.cdate}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Select Shift</InputLabel>
                  <Select
                    name="shiftId"
                    value={unknownLossData?.value}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">Shift A</MenuItem>
                    <MenuItem value="2">Shift B</MenuItem>
                    <MenuItem value="3">Shift C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGetReport}
                >
                  View Reports
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
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
                        Machine Id
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        Machine Name
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        Date Time
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        A Loss
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        Reason
                      </StyledTableCell>
                     
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {unknownLossReports.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell className="table-cell">
                          {row.plantName}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.machineId}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.machineName}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.dateTime}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {row.availabilityLoss}
                        </StyledTableCell>
                        <StyledTableCell className="table-cell">
                          {" "}
                          {row.aLossReason}
                        </StyledTableCell>
                      
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </>
        )}
        <ALossReportModal
          open={aLossModalOpen}
          handleClose={() => setALossModalOpen(false)}
          data={aLossReport}
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
    </>
  );
}

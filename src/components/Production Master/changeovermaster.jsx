import { faL, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  TableContainer,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";


import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthCheck } from "../../utils/Auth";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetFRDC } from "../../api/ChangeOverMaster/api.getfrdc";
import { apiDeleteFrdc } from "../../api/ChangeOverMaster/api.deletefrdc";
import { apiAddFrdc } from "../../api/ChangeOverMaster/api.frdc";
import { apiUpdateFrdc } from "../../api/ChangeOverMaster/api.updatefrdc";
import DeleteConfirmationModal from "../deletemodal";

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
export default function ChangeOverMaster() {
  const [open, setOpen] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [frdcData, setFRDCData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFrdcId, setDeleteFrdcId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [filteredLineData, setFilteredLineData] = useState([]);
  const [filteredMachineData, setFilteredMachineData] = useState([]);

  const [updatedFRDCData, setUpdatedFRDCData] = useState({
    plantNo: 1,
    plantName: "",
    machineNo: "",
    lineNo: "",
    machineId: "",
    changeOverTime: "",
    modeFrequency: "",
  });
  const handleOpenModal = () => {
    setOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setOpen(false);
  };
  useAuthCheck()
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

  useEffect(() => {
    const getFrdcs = async () => {
      try {
        const result = await apiGetFRDC();
        //console.log("frdc result:", result.data.data)
        setFRDCData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getFrdcs();
  }, [refreshData]);

  const handleInputChange = (e) => {
    //console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setUpdatedFRDCData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (row) => {
    // alert("ehllo")
    //console.log("editt data", row);
    setUpdatedFRDCData(row);
    setOpen(true);
  };

  const handleDeleteClick = (row) => {
    setDeleteFrdcId(row.frdcNo);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await apiDeleteFrdc(deleteFrdcId);
      handleSnackbarOpen("FRDC Deleted successfully!", "success");
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error deleting FRDC:", error);
      handleSnackbarOpen("Error deleting FRDC. Please try again.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiAddFrdc(updatedFRDCData);
      handleSnackbarOpen("FRDC added successfully!", "success");
      setAddOpen(false);
      //console.log("response", result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error adding Frdc:", error);
      handleSnackbarOpen("Error adding FRDC. Please try again.", "error");
    }
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const getFrdcs = async () => {
      try {
        const result = await apiGetFRDC();
        //console.log("Frdc data:", result?.data.data);
        setFRDCData(result?.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };

    try {
      const result = await apiUpdateFrdc(updatedFRDCData);

      setOpen(false);
      await getFrdcs();
      handleSnackbarOpen("FRDC updated successfully!", "success");
      //console.log("response", result.data);
      setUpdatedFRDCData({
        plantNo: "",
        plantName: "",
        machineNo: "",
        lineNo: "",
        machineId: "",
        changeOverTime: "",
        modeFrequency: "",
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error updating FRDC:", error);
      handleSnackbarOpen("Error updating FRDC. Please try again.", "error");
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredLines = lineData.filter(
    (line) => line.plantNo === selectedPlant.plantNo
  );


  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, frdcData.length - page * rowsPerPage);

  useEffect(() => {
    if (updatedFRDCData.plantNo) {
      const filteredLines = lineData.filter(
        (line) => line.plantNo === updatedFRDCData.plantNo
      );
      setFilteredLineData(filteredLines);
    }
  }, [updatedFRDCData.plantNo, lineData]);
  useEffect(() => {
    if (updatedFRDCData.lineNo) {
      const filteredMachine = machineData.filter(
        (machine) => machine.lineNo === updatedFRDCData.lineNo
      );
      setFilteredMachineData(filteredMachine);
    }
  }, [updatedFRDCData.lineNo, machineData]);
  const handleModalClose = () => {

    setUpdatedFRDCData({
      plantNo: "",
      plantName: "",
      machineNo: "",
      lineNo: "",
      machineId: "",
      changeOverTime: "",
      modeFrequency: "",
    });


    setAddOpen(false);
    setOpen(false)
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
        <h2>Change Overtime Master</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        </div>
        <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
          {/* <Button
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
          </Button>*/}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => {
            setAddOpen(true);
          }}
          style={{
            background: "#1FAEC5",
            fontWeight: "600",
            borderRadius: "10px",
            color: "white",
            border: "4px solid lightblue",
            padding: "5px 8px 5px 8px",
            marginBottom: "5px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#17A2B8";
            e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#1FAEC5";
            e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
          }}
        >
          Add New &nbsp;
          <FontAwesomeIcon
            style={{ fontSize: "18px", color: "white" }}
            icon={faPlus}
          />
        </Button>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={frdcData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <Box>
        <div style={{ paddingTop: "5px", paddingBottom: "5px", }}></div>
        <TableContainer component={Paper} style={{ marginBottom: '40px' }}>
          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <TableHead>
              <TableRow>


                <StyledTableCell className="table-cell">
                  Plant Name
                </StyledTableCell>
                {/*  <StyledTableCell className="table-cell">
                  Machine Id 
                </StyledTableCell>*/}
                <StyledTableCell className="table-cell">
                  Machine Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Standard Changeover Time in secs {" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Mode Frequency
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Create Date
                </StyledTableCell>
                {/* <StyledTableCell className="table-cell">Country</StyledTableCell> */}
                <StyledTableCell className="table-cell">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {frdcData.length === 0
                ? // Render skeleton loaders when data is still loading
                Array.from(Array(5).keys()).map((index) => (
                  <StyledTableRow key={index}>

                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                    {/* <StyledTableCell>
          <Skeleton animation="wave" />
        </StyledTableCell> */}
                  </StyledTableRow>
                ))
                : frdcData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <StyledTableRow key={row.id}>

                      <StyledTableCell className="table-cell">
                        {row.lineName}
                      </StyledTableCell>
                      {/* <StyledTableCell className="table-cell">
                          {row.machineId}
                        </StyledTableCell>*/}
                      <StyledTableCell className="table-cell">
                        {row.displayMachineName}
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        {row.changeOverTime}
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        {row.modeFrequency}
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        {row.createdAt}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          /*display: "flex",
                          gap: "10px",*/
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                        className="table-cell"
                      >
                        <IconButton onClick={() => handleEditSubmit(row)}>
                          <EditIcon />
                        </IconButton>
                        {/* <div
                            className="divider"
                            style={{
                              height: "20px",
                              width: "2px",
                              backgroundColor: "#0003",
                            }}
                          ></div>

                          <IconButton
                            style={{ color: "#FF3131" }}
                            onClick={() => handleDeleteClick(row)}
                          >
                            <DeleteIcon />
                          </IconButton>*/}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={8} style={{ position: "relative" }}>
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
        </TableContainer>


        {addOpen && (
          <Modal open={addOpen} onClose={handleModalClose}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                backgroundColor: "white",
                padding: "20px",
                minWidth: "500px",
                borderRadius: "10px",

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
              <h2>Add New FRDC </h2>
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
                  <Select
                    name="lineNo"
                    value={updatedFRDCData?.lineNo}
                    onChange={handleInputChange}
                  >
                    {filteredLineData.map((line) => (
                      <MenuItem key={line.id} value={line.lineNo}>
                        {line.lineName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "26ch" }}>
                  <InputLabel>Machine Name</InputLabel>
                  <Select
                    name="machineNo"
                    value={updatedFRDCData?.machineNo}
                    onChange={handleInputChange}
                  >
                    {filteredMachineData.map((id) => (
                      <MenuItem key={id.id} value={id.machineNo}>
                        {id.displayMachineName}
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

                <TextField
                  name="changeOverTime"
                  label="Changeover Time in secs"
                  value={updatedFRDCData?.changeOverTime}
                  onChange={handleInputChange}

                />
                <TextField
                  name="modeFrequency"
                  label="Mode Frequency"
                  value={updatedFRDCData?.modeFrequency}
                  onChange={handleInputChange}
                  style={{ marginLeft: "10px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >


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
        )}

        {open && (
          <Modal open={open} onClose={handleModalClose}>
            <div
              style={{
                borderRadius: "10px",

                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
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
              <h2>Update FRDC </h2>
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
                  <Select
                    name="lineNo"
                    value={updatedFRDCData?.lineNo}
                    onChange={handleInputChange}
                  >
                    {filteredLineData.map((line) => (
                      <MenuItem key={line.id} value={line.lineNo}>
                        {line.lineName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "26ch" }}>
                  <InputLabel>Machine Name</InputLabel>
                  <Select
                    name="machineNo"
                    value={updatedFRDCData?.machineNo}
                    onChange={handleInputChange}
                  >
                    {filteredMachineData.map((id) => (
                      <MenuItem key={id.id} value={id.machineNo}>
                        {id.displayMachineName}
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

                <TextField
                  name="changeOverTime"
                  label="Std Changeover Time in secs"
                  value={updatedFRDCData?.changeOverTime}
                  onChange={handleInputChange}
                // style={{ marginRight: "10px" }}
                />
                <TextField
                  name="modeFrequency"
                  label="Mode Frequency"
                  value={updatedFRDCData?.modeFrequency}
                  onChange={handleInputChange}
                  style={{ marginLeft: "10px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >


              </div>
              <Button
                onClick={handleUpdateSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Update
              </Button>
            </div>
          </Modal>
        )}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
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

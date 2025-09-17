import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  tableCellClasses,
  styled,
  TablePagination,
  Tooltip,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/table.css";
import "../../assets/css/style.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthCheck } from "../../utils/Auth";
import { apiGetPart } from "../../api/PartMaster/api.getpart";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiViewMultipleParts } from "../../api/PartMaster/api.viewmultipleparts";
import { apiUpdatePart } from "../../api/PartMaster/api.updatepart";
import { apiAddPart } from "../../api/PartMaster/api.addpart";
import { apiUploadPart } from "../../api/PartMaster/api.uploadpart";
import { apiDeletePart } from "../../api/PartMaster/api.deletepart";
import PartNamesModal from "./PartsNameModal";
import DeleteConfirmationModal from "../deletemodal";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
    // position: "sticky",
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

const PartMaster = () => {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [lineName, setLineName] = useState("");
  const [partName, setPartName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [plantProduction, setPlantProduction] = useState("");
  const [cycleTime, setcycleTime] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [multipleFactor, setMultipleFactor] = useState("");

  const [machineName, setMachineName] = useState("");
  const [ctReduction, setCtReduction] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [lowerBound, setLowerBound] = useState("0");
  const [severity, setSeverity] = useState("success");
  const [refreshData, setRefreshData] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [partData, setPartData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePartId, setDeleteParttId] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [viewMPResultOpen, setViewMPResultOpen] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [selectedLineName, setSelectedLineName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartNames, setSelectedPartNames] = useState("");
  const [selectedMachineName, setSelectedMachineName] = useState();
  const [partsName, getPartsName] = useState({
    machineId: "",
    partId: "",
  });
  const [partsNames, setPartsNames] = useState({});
  const [mPartsData, setMPartsData] = useState({
    lineNo: "",
    machineNo: "",
    partName: "",
  });
  const [viewMPAdd, setViewMPAdd] = useState(false);



  const [updatedPartData, setUpdatedPartData] = useState({
    partNo: "",
    plantNo: 1,
    lineNo: "",
    machineNo: "",
    partName: "",
    cycleTime: "",
    plantProduction: "",
    multipleFactor: "",
    ctReduction: "",
    lowerBound: "",
    upperBound: "",
  });
  const inputRef = useRef();


  useAuthCheck()
  useEffect(() => {
    getParts();
  }, [refreshData]);

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
  const handleOpenModal = (partNames) => {
    setSelectedPartNames(partNames);
    setModalOpen(true);
  };
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

  const getParts = async () => {
    try {
      const result = await apiGetPart();
      //console.log("Get Part:", result.data.data);
      setPartData(result.data.data);
    } catch (error) {
      setError(error.message);
      handleSnackbarOpen(error.message, "error");
    }
  };

  const handleEditSubmit = async (row) => {

    setUpdatedPartData(row);
    setSelectedLine(row.lineNo);
    setOpen(true);
  };
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const parsedValue =
  //     name === "cycleTime" ||
  //       name === "multipleFactor" ||
  //       name === "ctReduction"
  //       ? parseFloat(value) || 0
  //       : value;

  //   setUpdatedPartData((prevData) => ({
  //     ...prevData,
  //     [name]: parsedValue,
  //   }));

  //   if (
  //     name === "cycleTime" ||
  //     name === "multipleFactor" ||
  //     name === "ctReduction"
  //   ) {
  //     const { cycleTime, multipleFactor, ctReduction } = {
  //       ...updatedPartData,
  //       [name]: parsedValue,
  //     };

  //     const parsedCycleTime = parseFloat(cycleTime) || 0;
  //     const parsedMultipleFactor = parseFloat(multipleFactor) || 0;
  //     const parsedCtReduction = parseFloat(ctReduction) || 0;

  //     if (
  //       !isNaN(parsedCycleTime) &&
  //       !isNaN(parsedMultipleFactor) &&
  //       !isNaN(parsedCtReduction)
  //     ) {
  //       const upperBound = (parsedCycleTime * parsedMultipleFactor).toFixed(2);
  //       const lowerBound = (
  //         parsedCycleTime -
  //         (parsedCycleTime * parsedCtReduction) / 100
  //       ).toFixed(2);

  //       setUpdatedPartData((prevData) => ({
  //         ...prevData,
  //         upperBound,
  //         lowerBound,
  //       }));
  //     }
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;


    setUpdatedPartData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  };

  const handlMultiplePartsClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await apiViewMultipleParts(mPartsData);
      //console.log("multiple parts data:", result.data);
      handleSnackbarOpen(
        "Multiple parts data fetched successfully!",
        "success"
      );

      setPartsData(result.data);
      setViewMPResultOpen(true);
    } catch (error) {
      console.error("Error fetching multiple parts data:", error);
      handleSnackbarOpen(
        "Error fetching multiple parts data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleVMPClick = () => {
    setViewMPAdd(true);
  };
  const handleUpdateSubmit = async () => {
    try {
      const { upperBound, lowerBound, cycleTime, ...data } = updatedPartData;
      const payload = {
        ...data,
        cycleTime: cycleTime.toString(),
        upperBound: parseFloat(upperBound),
        lowerBound: parseFloat(lowerBound),
      };

      const result = await apiUpdatePart(payload);
      await getParts();
      //console.log("Part updated successfully:", result.data);
      handleSnackbarOpen("Part updated successfully!", "success");
      setRefreshData((prev) => !prev);
      setOpen(false);
    } catch (error) {
      setOpen(false);
      handleSnackbarOpen("Error updating part. Please try again.", "error");
      console.error("Error updating part:", error);
    }
  };

  // const fetchPartsNameByPartId = async (machineId, partId) => {
  //   try {
  //     const response = await apiGetPartsName({ machineId, partId });
  //     //console.log("view parts name:", response.data.data);
  //     const partData = response.data.data[0];
  //     setPartData(response.data.data);
  //     return partData.partNames || "N/A";
  //   } catch (error) {
  //     console.error("error getting parts name:", error);
  //     return null;
  //   }
  // };

  // const fetchAllPartsNames = async () => {
  //   const newPartsNames = {};
  //   for (const row of partData) {
  //     const partName = await fetchPartsNameByPartId(
  //       row.machineId,
  //       row.partName
  //     );
  //     if (partName) {
  //       newPartsNames[`${row.machineNo}-${row.partNo}`] = partName;
  //     }
  //   }
  //   setPartsNames(newPartsNames);
  // };
  // useEffect(() => {
  //   fetchAllPartsNames();
  // }, [partData]);
  const handleAddSubmit = async () => {
    try {
      // const { cycleTime, multipleFactor, ctReduction, ...data } =
      //   updatedPartData;
      // const parsedCycleTime = parseFloat(cycleTime);
      // const parsedMultipleFactor = parseFloat(multipleFactor);
      // const parsedCtReduction = parseFloat(ctReduction);

      // const upperBound = (parsedCycleTime * parsedMultipleFactor).toFixed(2);
      // const lowerBound = (
      //   parsedCycleTime -
      //   (parsedCycleTime * parsedCtReduction) / 100
      // ).toFixed(2);

      // const payload = {
      //   ...data,
      //   cycleTime: cycleTime.toString(),
      //   multipleFactor: parsedMultipleFactor,
      //   ctReduction: parsedCtReduction,
      //   upperBound: upperBound,
      //   lowerBound: lowerBound,
      // };
      console.log("part DAta:", updatedPartData)
      const payload = {
        ...updatedPartData, plantProduction: Number(updatedPartData.plantProduction), // ✅ force number
      };
      console.log("part DAta:", payload)
      const result = await apiAddPart(payload);
      console.log("Part added successfully:", result.data);
      setAddOpen(false);
      //console.log("response", result.data);
      setUpdatedPartData({
        partNo: "",
        plantNo: "",
        lineNo: "",
        machineNo: "",
        partName: "",
        cycleTime: "",
        plantProduction: "",
        multipleFactor: "",
        ctReduction: "",
        lowerBound: "",
        upperBound: "",
      })
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };
  const filteredLines = lineData.filter((line) => line.plantNo === 1);

  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );

  const handleFileChange = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiUploadPart(formData);
        await getParts();

        // ✅ Clear file input (which also effectively resets formData)
        fileInput.value = "";
      } catch (err) {
        console.error("Error uploading part:", err);
        handleSnackbarOpen(err.message, "error");
      }
    }
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  const filteredParts2 = partData.filter(
    (part) =>
      part.lineNo === mPartsData.lineNo &&
      part.machineNo === mPartsData.machineNo
  );

  const handleDeleteClick = (row) => {
    setDeleteParttId(row.partId);
    setDeleteModalOpen(true);
  };
  const handleViewMPartsChange = (e) => {
    const { name, value } = e.target;
    setMPartsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleConfirmDelete = async () => {
    try {
      await apiDeletePart(deletePartId);
      handleSnackbarOpen("Part Deleted successfully!", "success");
      setRefreshData((prev) => !prev);
      setUpdatedPartData({
        partNo: "",
        plantNo: "",
        lineNo: "",
        machineNo: "",
        partName: "",
        cycleTime: "",
        plantProduction: "",
        multipleFactor: "",
        ctReduction: "",
        lowerBound: "",
        upperBound: "",
      });
    } catch (error) {
      console.error("Error deleting Part:", error);
      handleSnackbarOpen("Error deleting Part. Please try again.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const filteredMachines2 = machineData.filter(
    (machine) => machine.lineNo === mPartsData.lineNo
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleModalClose = () => {
    setUpdatedPartData({
      partNo: "",
      plantNo: "",
      lineNo: "",
      machineNo: "",
      partName: "",
      cycleTime: "",
      plantProduction: "",
      multipleFactor: "",
      ctReduction: "",
      lowerBound: "",
      upperBound: "",
    });

    setAddOpen(false);
    setOpen(false);
    setViewMPAdd(false);
    setViewMPResultOpen(false);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, partData.length - page * rowsPerPage);

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
        <h2>Part Master</h2>
        <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>

        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "right",
          flexWrap: "wrap",
          gap: "10px",
          flexDirection: 'column',
        }}

      >
        <Grid container spacing={2}>
          <Grid item>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddOpen(true)}
              style={{
                background: "#1FAEC5",
                fontWeight: "600",
                borderRadius: "10px",
                color: "white",
                padding: "5px 8px 5px 8px",
                marginBottom: "5px",
              }}>
              Add New
            </Button>
          </Grid>


          <Grid item>
            <input
              type="file"
              ref={inputRef}
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              style={{
                background: "#1FAEC5",
                fontWeight: "600",
                borderRadius: "10px",
                color: "white",
                padding: "5px 8px 5px 8px",
                marginBottom: "5px",
              }}
              onClick={triggerFileInput}
            >
              Upload Part File
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              style={{
                background: "#1FAEC5",
                fontWeight: "600",
                borderRadius: "10px",
                color: "white",
                padding: "5px 8px 5px 8px",
                marginBottom: "5px",
              }}
              component="a"
              href="/assets/skh_part_master_format.xlsx"
              download>
              Download Template
            </Button>
          </Grid>
          <Grid>
            <FormControl  sx={{minWidth: 200, margin:"0 14px" }}>
              <InputLabel >Select Machine</InputLabel>
              <Select
                value={selectedMachineName}
                onChange={(e) => setSelectedMachineName(e.target.value)}
              >
                {machineData.map((machine) => (
                  <MenuItem key={machine.id} value={machine.displayMachineName}>
                    {machine.displayMachineName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={partData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <Box sx={{ maxHeight: "500px", overflow: "auto", marginBottom: "40px" }}>
        <TableContainer component={Paper}>
          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <TableHead>
              <TableRow sx={{ position: "sticky", top: 0, zIndex: 1 }}>
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
                  Part No
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Part Operation Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Standard Cycle Time in secs
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Number Of Person
                </StyledTableCell>
                <StyledTableCell className="table-cell">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partData.length === 0
                ? Array.from(Array(5).keys()).map((index) => (
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

                  </StyledTableRow>
                ))
                : partData
                  .filter((row) =>
                    selectedMachineName
                      ? row.displayMachineName === selectedMachineName
                      : true
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (

                    <StyledTableRow key={row.id}>
                      <StyledTableCell className="table-cell">
                        {row.plantName}
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        {row.lineName}
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        {row.displayMachineName}
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        {row.partNo}
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        {row.partName}
                      </StyledTableCell>

                      <StyledTableCell className="table-cell">
                        {row.cycleTime}
                      </StyledTableCell>
                      <StyledTableCell className="table-cell">
                        {row.plantProduction}
                      </StyledTableCell>

                      <StyledTableCell
                      >
                        <IconButton onClick={() => handleEditSubmit(row)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          style={{ color: "#FF3131" }}
                          onClick={() => handleDeleteClick(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              {partData.length === 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={8} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-400px",
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
      </Box>
      <PartNamesModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        partNames={selectedPartNames}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <Modal open={open} onClose={handleModalClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            minWidth: "500px",
            borderRadius: "10px",
          }}
        >
          <button
            onClick={handleModalClose}
            style={{
              borderRadius: "10px",

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
          <h2>Update Part</h2>
          <hr />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Line Name</InputLabel>
                <Select
                  name="lineNo"
                  value={updatedPartData?.lineNo}
                  onChange={(e) => {
                    setSelectedLine(e.target.value);
                    handleInputChange(e);
                  }}
                >
                  {filteredLines.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={updatedPartData?.machineNo || ""}
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="partNo"
                label="Part Number"
                value={updatedPartData?.partNo}
                onChange={handleInputChange}
                style={{ marginRight: "10px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="partName"
                label="Part Operation Name"
                value={updatedPartData?.partName}
                onChange={handleInputChange}
                style={{ marginRight: "10px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="cycleTime"
                label="Standard Cycle Time in secs"
                value={updatedPartData?.cycleTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="plantProduction"
                label="Number Of Person"
                value={updatedPartData?.plantProduction}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleUpdateSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
      <Modal open={viewMPResultOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            // border: "2px solid",
            boxShadow: 24,
            p: 4,
            width: "800px",
            maxHeight: "80vh",
            overflow: "auto",
            borderRadius: "10px",
            // marginBottom:'10px'
          }}
        >
          <h2>Fetched Parts Data</h2>
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
          {loading ? (
            <CircularProgress />
          ) : !partsData || partsData.length === 0 ? (
            <p>No parts data available.</p>
          ) : (
            <Table style={{ marginTop: "20px" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Part Code</StyledTableCell>
                  <StyledTableCell>Machine Name</StyledTableCell>
                  <StyledTableCell>Part Name</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partsData.map((part, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{part.partName}</StyledTableCell>
                    <StyledTableCell>{part.machineName}</StyledTableCell>
                    <StyledTableCell>{part.partId}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>
      <Modal open={addOpen} onClose={handleModalClose}>
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
          <h2>Add New Part </h2>
          <hr />
          <br />
          <Grid container spacing={2}>.
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="plantNo"
                  value={updatedPartData?.plantNo}
                  onChange={(e) => {
                    setSelectedLine(e.target.value);
                    handleInputChange(e);
                  }}
                >
                  {plantData.map((plant) => (
                    <MenuItem key={plant.plantNo} value={plant.plantNo}>
                      {plant.plantName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Line Name</InputLabel>
                <Select
                  name="lineNo"
                  value={updatedPartData?.lineNo}
                  onChange={(e) => {
                    setSelectedLine(e.target.value);
                    handleInputChange(e);
                  }}
                >
                  {filteredLines.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={updatedPartData?.machineNo}
                  onChange={handleInputChange}
                >
                  {filteredMachines.map((id) => (
                    <MenuItem key={id.id} value={id.machineNo}>
                      {id.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="partNo"
                label="Part Number"
                value={updatedPartData?.partNo}
                onChange={handleInputChange}
                style={{ marginRight: "10px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="partName"
                label="Part Operaiton Name"
                value={updatedPartData?.partName}
                onChange={handleInputChange}
                style={{ marginRight: "10px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="cycleTime"
                label="Standard Cycle Time in secs"
                value={updatedPartData?.cycleTime}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="plantProduction"
                label="Number Of Person"
                value={updatedPartData?.plantProduction}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleAddSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
      <Modal open={viewMPAdd} onClose={handleModalClose}>
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
          <h2>View Multiple Parts</h2>
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
              <InputLabel>Select Plant</InputLabel>
              <Select
                name="lineNo"
                value={mPartsData.lineNo || ""}
                onChange={handleViewMPartsChange}
              >
                {lineData.map((line) => (
                  <MenuItem key={line.id} value={line.lineNo}>
                    {line.lineName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: "26ch" }}>
              <InputLabel>Select Machine</InputLabel>
              <Select
                name="machineNo"
                value={mPartsData.machineNo}
                onChange={handleViewMPartsChange}
              >
                {filteredMachines2.map((machine) => (
                  <MenuItem key={machine.id} value={machine.machineNo}>
                    {machine.displayMachineName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "26ch" }}>
              <InputLabel>Select Part</InputLabel>
              <Select
                name="partName"
                value={mPartsData.partName || ""}
                onChange={handleViewMPartsChange}
              >
                {filteredParts2.length > 0 ? (
                  filteredParts2.map((part) => (
                    <MenuItem key={part.id} value={part.partName}>
                      {part.partName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No parts available</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <Button
            onClick={handlMultiplePartsClick}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            View
          </Button>
        </div>
      </Modal>

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
};

export default PartMaster;

import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  tableCellClasses,
  styled,
  TablePagination,
  Button,
  Snackbar,
  CircularProgress,
  Grid,
  TextField,
  TableContainer,
  Typography,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import MuiAlert from "@mui/material/Alert";


import CloseIcon from "@mui/icons-material/Close";
import { apiGetPartsName } from "../../api/PartMaster/api.getPartsName";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetOpe1 } from "../../api/api.getope1";
import { useAuthCheck } from "../../utils/Auth";
import DownloadButton from "../../utils/DownloadButton";
import BackButton from "../backbutton";

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
const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); 
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
export default function GhaziabadOpe() {
  const [opeData, setOpeData] = useState([]);
  const [machineId, setMachineId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [machineData, setMachineData] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [lineNo, setLineNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partsNames, setPartsNames] = useState({});
  const [partData, setPartData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartNames, setSelectedPartNames] = useState("");
  const [partNamesData, setPartNamesData] = useState(null);
  const [openPartNamesDialog, setOpenPartNamesDialog] = useState(false);
  const [ghaziabadOpeData, setGhaziabadOpeData] = useState({
    lineNo: "",
    machineId: "",
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  });

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };

  useAuthCheck();
  const handlePartNameClick = async (partId, machineId) => {
    try {
      const result = await apiGetPartsName({ mid: machineId, partId: partId });
      if (result.data.status === "success" && result.data.data.length > 0) {
        setPartNamesData(result.data.data[0]);
        setOpenPartNamesDialog(true);
      } else {
        handleSnackbarOpen("No part names data available", "info");
      }
    } catch (error) {
      handleSnackbarOpen(
        "Error fetching part names: " + error.message,
        "error"
      );
    }
  };

  const handleClosePartNamesDialog = () => {
    setOpenPartNamesDialog(false);
  };
  useEffect(() => {
    const getMachine = async () => {
      try {
        const result = await apigetMachine();
        let lineNo = null;
        const filteredMachines = result.data.data.filter((machine) => {
          if (machine.lineName === "Ghaziabad") {
            lineNo = machine.lineNo;
          }
          return machine.lineName === "Ghaziabad";
        });

        if (lineNo !== null) {
          setLineNo(lineNo);
        }

        setMachineData(filteredMachines);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getMachine();
  }, [refreshData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGhaziabadOpeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSubmit = async () => {
    const { machineId, fromDate, toDate } = ghaziabadOpeData;
    const lineId = lineNo;

    setLoading(true);

    try {
      const result = await apiGetOpe1({ lineId, machineId, fromDate, toDate });
      setOpeData(result.data);

      handleSnackbarOpen("Ope Data fetched successfully!", "success");
    } catch (error) {
      setError(error.message);
      handleSnackbarOpen(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchPartsNameByPartId = async (mid, partId) => {
    try {
      const response = await apiGetPartsName({ mid, partId });
      console.log("view parts name:", response.data.data);
      const partData = response.data.data[0];
      return partData.partNames || "N/A";
    } catch (error) {
      console.error("error getting parts name:", error);
      return null;
    }
  };
  const fetchAllPartsNames = async () => {
    console.log("Fetching all parts names for partData:", partData);
    const newPartsNames = {};
    for (const row of partData) {
      console.log("Fetching part name for:", row.mid, row.partId);
      const partName = await fetchPartsNameByPartId(row.mid, row.partId);
      console.log("Received part name:", partName);
      if (partName) {
        newPartsNames[`${row.mid}-${row.partId}`] = partName;
      }
    }
    console.log("All parts names fetched:", newPartsNames);
    setPartsNames(newPartsNames);
  };
  useEffect(() => {
    if (partData.length > 0) {
      fetchAllPartsNames();
    }
  }, [partData]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenModal = (partNames) => {
    setSelectedPartNames(partNames);
    setModalOpen(true);
  };
  const downloadApiCall = async () => {
    const { machineId, fromDate, toDate } = ghaziabadOpeData;
    const lineId = lineNo;

    if (lineId && machineId) {
      try {
        const data = await apiGetOpe1({ lineId, machineId, fromDate, toDate });
        return data.data;
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    }
  };
  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  const formatData = (data) => {
    return data.map((row) => ({
      "M Id": row.mid ?? "",
      "Date Time": row.dateTime ?? "",
      "Ope Period For U":
        row.cycleTime != null ? parseFloat(row.cycleTime) : "",
      AD: row.adData ?? "",
      "Seq Of Time Stamp": row.adDiffData ?? "",
      "DCT%": row.dctPercent != null ? parseFloat(row.dctPercent) : "",
      "Loss Type For Ope": row.lossTypeForOpe ?? "",
      "Part A": row.partA != null ? parseFloat(row.partA) : "",
      "Part B": row.partB != null ? parseFloat(row.partB) : "",
      "Part C": row.partC ?? "",
      "Part D ": row.partD ?? "",
      "Part E": row.partE ?? "",
      "Part F ": row.partF ?? "",
      "Part G ": row.partG ?? "",
      "Part H": row.partH ?? "",
      "Part I ": row.partI ?? "",
      "Part J ": row.partJ ?? "",
      Test: row.test ?? "",
      "Frcd Cycletime ":
        row.frcdCycleTime != null ? parseFloat(row.frcdCycleTime) : "",
      "F Partname": row.fPartName ?? "",
      VAT: row.fCycleTime != null ? parseFloat(row.fCycleTime) : "",
      Category: row.category ?? "",
      "A Loss": row.aLoss != null ? parseFloat(row.aLoss) : "",
      "P Loss": row.pLoss != null ? parseFloat(row.pLoss) : "",
    }));
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, opeData.length - page * rowsPerPage);

  return (
    <div style={{ padding: "0px 20px" }}>
     <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "5px",
          borderRadius: "8px",
          marginBottom: "20px",
          marginTop:'10px',
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
         OPE
        </Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FormControl sx={{ width: "30ch" }}>
          <InputLabel>Select Machine</InputLabel>
          <Select
            name="machineId"
            value={ghaziabadOpeData.machineId}
            onChange={handleInputChange}
          >
            {machineData.map((id) => (
              <MenuItem key={id.id} value={id.machineId}>
                {id.displayMachineName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 250, marginLeft: 2 }}>
            <TextField
              label="Start Date"
              name="fromDate"
              type="date"
              value={ghaziabadOpeData.fromDate}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 250, marginLeft: 2 }}>
            <TextField
              label="End Date"
              name="toDate"
              type="date"
              value={ghaziabadOpeData.toDate}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            sx={{ marginLeft: 2, bgcolor: "#4895a1", color: "black" }}
          >
            OK
          </Button>
        </Grid>
        <div style={{ marginLeft: "30px" }}>
          <DownloadButton
            apiCall={downloadApiCall}
            formatData={formatData}
            fileName="Ghaziabad Ope 1.xlsx"
          />
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={opeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box sx={{ maxHeight: "500px", overflow: "auto", marginBottom: "40px" }}>
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
            <TableHead style={{ backgroundColor: "#0002" }}>
              <TableRow>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Current Cycle Time in secs
                </StyledTableCell>
                {/* <StyledTableCell className="table-cell">AD</StyledTableCell>*/}

                <StyledTableCell className="table-cell">
                  Sqeuence Of Time Stamp
                </StyledTableCell>
                <StyledTableCell className="table-cell">DCT%</StyledTableCell>
                {/* <StyledTableCell className="table-cell">
                  Loss Type For Ope
                </StyledTableCell>
                <StyledTableCell className="table-cell">Part A</StyledTableCell>
                <StyledTableCell className="table-cell">Part B</StyledTableCell>
                <StyledTableCell className="table-cell">Part C</StyledTableCell>
                <StyledTableCell className="table-cell">Part D</StyledTableCell>
                <StyledTableCell className="table-cell">Part E</StyledTableCell>
                <StyledTableCell className="table-cell">Part F</StyledTableCell>
                <StyledTableCell className="table-cell">Part G</StyledTableCell>
                <StyledTableCell className="table-cell">Part H</StyledTableCell>
                <StyledTableCell className="table-cell">Part I</StyledTableCell>
                <StyledTableCell className="table-cell">Part J</StyledTableCell>
                <StyledTableCell className="table-cell">Test</StyledTableCell>*/}
                <StyledTableCell className="table-cell">
                  Frcd Cycle Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Part Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">VAT</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Category
                </StyledTableCell>
                <StyledTableCell className="table-cell">A Loss</StyledTableCell>
                <StyledTableCell className="table-cell">P Loss</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opeData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell className="table-cell">{row.dateTime}</TableCell>
                    <TableCell className="table-cell">
                      {row.cycleTime}
                    </TableCell>
                    {/* <TableCell className="table-cell">{row.adData}</TableCell>*/}
                    <TableCell className="table-cell">
                      {row.adDiffData}
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.dctPercent}
                    </TableCell>
                    {/* <StyledTableCell className="table-cell">
                      {row.lossTypeForOpe}
                    </StyledTableCell>
                    <TableCell className="table-cell">{row.partA}</TableCell>
                    <TableCell className="table-cell">{row.partB}</TableCell>
                    <TableCell className="table-cell">{row.partC}</TableCell>
                    <TableCell className="table-cell">{row.partD}</TableCell>
                    <TableCell className="table-cell">{row.partE}</TableCell>
                    <TableCell className="table-cell">{row.partF}</TableCell>
                    <TableCell className="table-cell">{row.partG}</TableCell>
                    <TableCell className="table-cell">{row.partH}</TableCell>
                    <TableCell className="table-cell">{row.partI}</TableCell>
                    <TableCell className="table-cell">{row.partJ}</TableCell>
                    <TableCell className="table-cell">{row.test}</TableCell>*/}
                    <TableCell className="table-cell">
                      {row.frcdCycleTime}
                    </TableCell>
                    <StyledTableCell className="table-cell">
                      <Button
                        onClick={() =>
                          handlePartNameClick(row.fPartName, row.mid)
                        }
                        variant="text"
                        color="primary"
                        style={{
                          backgroundColor: "#1FAEC5",
                          marginBottom: "5px",
                          color: "black",
                          lineHeight: 1,
                          padding: "8px 8px",
                        }}
                      >
                        View Part Names
                        {/* {row.partNameM2} */}
                      </Button>
                    </StyledTableCell>
                    <TableCell className="table-cell">
                      {row.fCycleTime}
                    </TableCell>
                    <TableCell className="table-cell">{row.category}</TableCell>
                    <TableCell className="table-cell">{row.aLoss}</TableCell>
                    <TableCell className="table-cell">{row.pLoss}</TableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Box>
      <Modal open={openPartNamesDialog} onClose={handleClosePartNamesDialog}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 0,
    maxHeight: '80vh',
    borderRadius: "10px",
    overflow: 'hidden',
  }}>
    <IconButton
      aria-label="close"
      onClick={handleClosePartNamesDialog}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'white',
        zIndex: 1,
      }}
    >
      <CloseIcon />
    </IconButton>
    <Typography 
      id="part-names-modal-title" 
      variant="h6" 
      component="h2" 
      sx={{ 
        textAlign: 'center', 
        backgroundColor: '#1FAEC5', 
        color: 'white', 
        p: 2,
        fontWeight: 'bold',
      }}
    >
      Part Names
    </Typography>
    <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 'none', marginTop: '0' }}>
      <Table stickyHeader aria-label="part names table">
        <TableBody>
          {partNamesData && partNamesData.partNames && 
            chunk(partNamesData.partNames.split(','), 3).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((partName, cellIndex) => (
                  <TableCell 
                    key={cellIndex}
                    sx={{
                      border: '1px solid rgba(224, 224, 224, 1)',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      fontWeight: '600',
                      width: '33.33%',
                    }}
                  >
                    {partName.trim()}
                  </TableCell>
                ))}
                {row.length < 3 && [...Array(3 - row.length)].map((_, index) => (
                  <TableCell 
                    key={`empty-${index}`}
                    sx={{
                      border: '1px solid rgba(224, 224, 224, 1)',
                      padding: '12px',
                      width: '33.33%',
                    }}
                  />
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
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
}

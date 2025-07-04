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
  tableCellClasses,
  styled,
  TablePagination,
  CircularProgress,
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

import { format } from "date-fns";

import { parseISO } from "date-fns";
import { apigetMachine } from "../../../api/MachineMaster/apigetmachine";
import { useAuthCheck } from "../../../utils/Auth";
import { apigetLines } from "../../../api/LineMaster/api.getline";
import { apigetRawData } from "../../../api/ReportMaster/api.getrawdata";


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

export default function QuaterlyReportM1() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rawData, setRawData] = useState({
    lineNo: "",
    machineId: "",
    fromDate: "23:01:1997",
    toDate: "23:01:1997",
  });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedLine, setSelectedLine] = useState("");
  const [loading, setLoading] = useState(false);
  useAuthCheck();
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
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
    const getLine = async () => {
      try {
        const result = await apigetLines();
        //console.log("Result data line:", result.data.data); 
        setLineData(result.data.data); 
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getLine();
  }, [refreshData]);
  // const handleInputChange = (e) => {
  //   //console.log(e.target.name, e.target.value);
  //   const { name, value } = e.target;
  //   setRawData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const formatData = (data) => {
    return data.map((row) => ({
      "Machine Id": row.machineId,
      "Date Time": row.dateTime,
      "Cycle Time": row.cycleTime,
    }));
  };
  const handleInputChange = (e) => {
    //console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setRawData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };
  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formattedFromDate = format(
        parseISO(rawData.fromDate),
        "dd-MMM-yyyy"
      );
      const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
      //console.log(
      //   "todate,fromdate,machineid,lineid:",
      //   formattedToDate,
      //   formattedFromDate
      // );
      const formattedRawData = {
        ...rawData,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      };
      // setAddOpen(false);
      //console.log("formatted raw data:", formattedRawData);
      const result = await apigetRawData(formattedRawData);

      // await getmachine();
      handleSnackbarOpen("Raw Data fetched successfully!", "success"); // Pass severity as "success"
      // setLoading(false);
      //console.log("Raw response", result.data);
      setData(result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      // setLoading(false);
      console.error("Error getting raw data:", error);
      handleSnackbarOpen("Error fetching raw data. Please try again.", "error"); // Pass severity as "error"
    } finally {
      setLoading(false);
    }
  };
  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
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
        <h2>Quaterly Report M1 </h2>
      </div>
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center", marginBottom: "10px" }}
      >
        {" "}
        {/* Set alignItems to center items vertically */}
        <Grid item xs={6} sm={3}>
          {" "}
          {/* Adjust item size for different screen sizes */}
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Plant</InputLabel>
            <Select
              name="lineNo"
              value={rawData?.lineNo}
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
          {" "}
          {/* Adjust item size for different screen sizes */}
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Machine</InputLabel>

            <Select
              name="machineId"
              value={rawData?.machineId}
              onChange={handleInputChange}
            >
              {filteredMachines.map((machine) => (
                <MenuItem key={machine.id} value={machine.machineId}>
                  {machine.displayMachineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item>
          {" "}
          <Button variant="contained" color="primary" onClick={handleAddSubmit}>
            OK
          </Button>
        </Grid>
      </Grid>
         <Box sx={{ marginTop: "20px", maxHeight: "500px", overflow: "auto" }}>
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
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-cell">
                  MId
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Total
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  VAT
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Avg Sct
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Revised U Loss
                </StyledTableCell>{" "}
                <StyledTableCell className="table-cell">
                  U%
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  P Loss
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  P% 
                </StyledTableCell>{" "}
                <StyledTableCell className="table-cell">
                  A Loss
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Revised A Loss
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  A%
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Q Loss
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Q% 
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  OPE%
                </StyledTableCell>
            
                <StyledTableCell className="table-cell">
                  OEE% 
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.machineId}</StyledTableCell>
                    <StyledTableCell>{row.dateTime}</StyledTableCell>
                    <StyledTableCell>{row.cycleTime}</StyledTableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={17} style={{ position: "relative" }}>
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
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          nextIconButtonProps={{
            onClick: () => handleChangePage(null, page + 1),
            disabled: page === Math.ceil(data.length / rowsPerPage) - 1,
          }}
          backIconButtonProps={{
            onClick: () => handleChangePage(null, page - 1),
            disabled: page === 0,
          }}
          SelectProps={{
            native: true,
            SelectDisplayProps: { "aria-label": "Rows per page" },
          }}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
          nextIconButtonText="Next"
          backIconButtonText="Previous"
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

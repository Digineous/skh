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




import { format, startOfMonth, endOfMonth, addDays } from "date-fns";
import { useAuthCheck } from "../../../utils/Auth";
import { apigetMachine } from "../../../api/MachineMaster/apigetmachine";
import { apigetLines } from "../../../api/LineMaster/api.getline";
import { apiWeeklyReportsM1 } from "../../../api/ReportMaster/api.weeklyreports";

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


const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weeks = [
  { label: "Week 1 ", value: 1 },
  { label: "Week 2 ", value: 2 },
  { label: "Week 3 ", value: 3 },
  { label: "Week 4 ", value: 4 },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
export default function WeeklyReportM1() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [rawData, setRawData] = useState({
  //   lineNo: "",
  //   machineId: "",
  //   fromDate: getCurrentDate(),
  //   toDate: getCurrentDate(),
  // });
  const [rawData, setRawData] = useState({
    lineNo: "",
    machineId: "",
    year: currentYear,
    month: new Date().getMonth(),
    week: 1,
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
  // const handleInputChange = (e) => {
  //   console.log(e.target.name, e.target.value);
  //   const { name, value } = e.target;
  //   setRawData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  
  const getDateRangeForWeek = (year, month, week) => {
    const firstDayOfMonth = startOfMonth(new Date(year, month));
    let startDate, endDate;

    if (week === 4) {
      startDate = addDays(firstDayOfMonth, 21);
      endDate = endOfMonth(new Date(year, month));
    } else {
      startDate = addDays(firstDayOfMonth, (week - 1) * 7);
      endDate = addDays(startDate, 6);
    }

    return {
      fromDate: format(startDate, "dd-MMM-yyyy"),
      toDate: format(endDate, "dd-MMM-yyyy"),
    };
  };

  const formatData = (data) => {
    return data.map((row) => ({
      "Machine Id": row.machineId,
      "Date Time": row.dateTime,
      "Cycle Time": row.cycleTime,
    }));
  };
  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);
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
      const { fromDate, toDate } = getDateRangeForWeek(rawData.year, rawData.month, rawData.week);
      const formattedRawData = {
        ...rawData,
        fromDate,
        toDate,
      };

      console.log("formatted raw data:", formattedRawData);
      const result = await apiWeeklyReportsM1(formattedRawData);
  
      handleSnackbarOpen("Weekly report m1 fetched successfully!", "success"); 
 
      console.log("Weekly report m1", result.data);
      setData(result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
     
      console.error("Error getting Weekly report m1:", error);
      handleSnackbarOpen(
        "Error fetching Weekly report m1. Please try again.",
        "error"
      ); 
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

  const getUpcomingSaturday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const daysUntilSaturday = 6 - dayOfWeek; 
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday;
  };

  const nextSaturday = getUpcomingSaturday();
  const nextSaturdayFormatted = nextSaturday.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <h2>Weekly Report M1 </h2>
      </div>
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center", marginBottom: "10px" }}
      >
        {" "}
       
        <Grid item xs={6} sm={2}>
          {" "}
        
          <FormControl sx={{ minWidth: 200 }}>
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
        <Grid item xs={6} sm={2}>
        
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Machine</InputLabel>

            <Select
              name="machineId"
              value={rawData?.machineNo}
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
        <Grid item xs={6} sm={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Year</InputLabel>
            <Select
              name="year"
              value={rawData.year}
              onChange={handleInputChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              name="month"
              value={rawData.month}
              onChange={handleInputChange}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Week</InputLabel>
            <Select
              name="week"
              value={rawData.week}
              onChange={handleInputChange}
            >
              {weeks.map((week) => (
                <MenuItem key={week.value} value={week.value}>
                  {week.label}
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
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-cell">MId</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">Total</StyledTableCell>
                <StyledTableCell className="table-cell">VAT</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Avg Sct
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Revised U Loss
                </StyledTableCell>{" "}
                <StyledTableCell className="table-cell">U%</StyledTableCell>
                <StyledTableCell className="table-cell">P Loss</StyledTableCell>
                <StyledTableCell className="table-cell">
                  P%
                </StyledTableCell>{" "}
                <StyledTableCell className="table-cell">A Loss</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Revised A Loss
                </StyledTableCell>
                <StyledTableCell className="table-cell">A%</StyledTableCell>
                <StyledTableCell className="table-cell">Q Loss</StyledTableCell>
                <StyledTableCell className="table-cell">Q%</StyledTableCell>
                <StyledTableCell className="table-cell">OPE%</StyledTableCell>
                <StyledTableCell className="table-cell">OEE%</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.machineId}</StyledTableCell>
                    <StyledTableCell>{row.dateTime}</StyledTableCell>
                    <StyledTableCell>{row.total}</StyledTableCell>
                    <StyledTableCell>{row.vat}</StyledTableCell>
                    <StyledTableCell>{row.avgSct}</StyledTableCell>
                    <StyledTableCell>{row.revisedULoss}</StyledTableCell>
                    <StyledTableCell>{row.uPer}</StyledTableCell>
                    <StyledTableCell>{row.pLoss}</StyledTableCell>
                    <StyledTableCell>{row.pPer}</StyledTableCell>
                    <StyledTableCell>{row.aLoss}</StyledTableCell>
                    <StyledTableCell>{row.revisedALoss}</StyledTableCell>
                    <StyledTableCell>{row.aPer}</StyledTableCell>
                    <StyledTableCell>{row.qLoss}</StyledTableCell>
                    <StyledTableCell>{row.qPer}</StyledTableCell>
                    <StyledTableCell>{row.opeC1}</StyledTableCell>
                    
                    <StyledTableCell>{row.oee}</StyledTableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={17} style={{ position: "relative" }}>
                  <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                      }}
                    >
                    Next report will be on {nextSaturdayFormatted}
                    </div>
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

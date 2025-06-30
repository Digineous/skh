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


import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns";
import { useAuthCheck } from "../../../utils/Auth";
import { apigetMachine } from "../../../api/MachineMaster/apigetmachine";
import { apigetLines } from "../../../api/LineMaster/api.getline";
import { apiMonthlyReportsM1 } from "../../../api/ReportMaster/api.mothlyreportm1";



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
const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
export default function MonthlyReportM1() {
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
    startMonth: null,
    endMonth: null,
  });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedLine, setSelectedLine] = useState("");
  const [loading, setLoading] = useState(false);
 useAuthCheck()
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
      const formattedStartMonth = rawData.startMonth.format("MMM-YYYY");
      const formattedEndMonth = rawData.endMonth.format("MMM-YYYY");
      
      console.log("startMonth, endMonth:", formattedStartMonth, formattedEndMonth);
      
      const formattedRawData = {
        ...rawData,
        startMonth: formattedStartMonth,
        endMonth: formattedEndMonth,
      };
      
      const result = await apiMonthlyReportsM1(formattedRawData);
  
      handleSnackbarOpen("Monthly report m1 fetched successfully!", "success");
      console.log("Monthly report m1", result.data);
      setData(result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error getting Monthly report m1:", error);
      handleSnackbarOpen(
        "Error fetching Monthly report m1. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  // const handleAddSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   try {
  //     const formattedFromDate = format(
  //       parseISO(rawData.fromDate),
  //       "dd-MMM-yyyy"
  //     );
  //     const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
  //     console.log(
  //       "todate,fromdate,machineid,lineid:",
  //       formattedToDate,
  //       formattedFromDate
  //     );
  //     const formattedRawData = {
  //       ...rawData,
  //       fromDate: formattedFromDate,
  //       toDate: formattedToDate,
  //     };
  //     const result = await apiMonthlyReportsM1(formattedRawData);

  //     // await getmachine();
  //     handleSnackbarOpen("Monthly report m1 fetched successfully!", "success");
  //     // setLoading(false);
  //     console.log("Monthly report m1", result.data);
  //     setData(result.data);
  //     setRefreshData((prev) => !prev);
  //   } catch (error) {
  //     // setLoading(false);
  //     console.error("Error getting Monthly report m1:", error);
  //     handleSnackbarOpen(
  //       "Error fetching Monthly report m1. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getNextReportMessage = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastDayOfCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    const lastDayOfNextMonth = new Date(
      currentYear,
      currentMonth + 2,
      0
    ).getDate();

    return `Next report will be on ${lastDayOfCurrentMonth} ${
      currentMonth === 11 ? currentYear + 1 : currentYear
    } or ${lastDayOfNextMonth} ${currentMonth === 11 ? 1 : currentMonth + 2} ${
      currentMonth === 11 ? currentYear + 1 : currentYear
    }`;
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
        <h2>Monthly Report M1</h2>
      </div>
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center", marginBottom: "10px" }}
      >
        {" "}
        <Grid item xs={6} sm={3}>
          {" "}
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
          <FormControl sx={{ minWidth: 250 }}>
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
  
        <Grid item xs={6} sm={3}>
  <FormControl sx={{ minWidth: 250 }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Month"
        views={['month', 'year']}
        format="MMM-YYYY"
        value={rawData.startMonth}
        onChange={(newValue) => handleInputChange({ target: { name: 'startMonth', value: newValue } })}
      />
    </LocalizationProvider>
  </FormControl>
</Grid>
<Grid item xs={6} sm={3}>
  <FormControl sx={{ minWidth: 250 }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="End Month"
        views={['month', 'year']}
        format="MMM-YYYY"
        value={rawData.endMonth}
        onChange={(newValue) => handleInputChange({ target: { name: 'endMonth', value: newValue } })}
      />
    </LocalizationProvider>
  </FormControl>
</Grid>
        <Grid item>
          {" "}
          <Button variant="contained" color="primary" onClick={handleAddSubmit}>
            OK
          </Button>
        </Grid>
      </Grid>
      {/* <DownloadButton apiCall={apigetRawData} formatData={formatData} fileName="RawDataReport.xlsx"/> */}
      {/* <div style={{  display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "20px"}}>
      
      <FormControl sx={{ minWidth: 250 }}>

            <TextField
              label="Search"
              type="search"
              id="fullWidth"
              placeholder="Search"
              fullWidth
              InputProps={{
                startAdornment: (
                  <FontAwesomeIcon icon={faSearch} />
                ),
              }}
              variant="outlined"
         
              //   value={searchTerm}
              //   onChange={(e) => setSearchTerm(e.target.value)}
              />
            {"   "}
            </FormControl>
          <Button sx={{ marginLeft: "10px",}} variant="contained" color="primary" >
            GO
          </Button>
          </div> */}
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
                  <StyledTableCell
                    colSpan={17}
                    style={{ position: "relative" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                      }}
                    >
                      Next report will be available on 1st-AUG-2024
                      {getNextReportMessage}.
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

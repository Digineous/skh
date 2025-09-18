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
import { apiMonthlyReportsM1 } from "../../../api/ReportMaster/api.mothlyreportm1";
import { apiGetDevice } from "../../../api/DeviceMaster/api.getdevice";
import DownloadButton from "../../../utils/DownloadButton";

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
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
const weeks = [
  { label: "Week 1 ", value: 1 },
  { label: "Week 2 ", value: 2 },
  { label: "Week 3 ", value: 3 },
  { label: "Week 4 ", value: 4 },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 2 + i);
export default function WeeklyReportM1() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
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
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedLine, setSelectedLine] = useState("");
  const [loading, setLoading] = useState(false);
  useAuthCheck();
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  useEffect(() => {
    const getDevice = async () => {
      try {
        const result = await apiGetDevice();
        //console.log("Result data machine:", result.data.data);
        setDeviceData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getDevice();
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
      const body = {
        deviceNo: rawData.deviceNo,
        year: rawData.year,
        month: rawData.month,
      };

      const result = await apiMonthlyReportsM1(body);

      handleSnackbarOpen("Weekly report m1 fetched successfully!", "success");

      //console.log("Weekly report m1", result.data);
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

  const downloadApiCall = async () => {
    const body = {
      deviceNo: rawData.deviceNo,
      year: rawData.year,
      month: rawData.month,
    };

    const result = await apiMonthlyReportsM1(body);

    return result;
  };

  // const formatDataExcel = (data) => {
  //   if (!data || data.length === 0) return [];

  //   return data.map((row) => ({
  //     "Date Time": row.dateTime,
  //     "Plant Name": row.plantName,
  //     "Line Name": row.lineName,
  //     "Machine Name": row.displayMachineName,
  //     "Actual Production": Number(row.actualProduction).toFixed(2),
  //     Gap: Number(row.gap).toFixed(2),
  //     Target: Number(row.target).toFixed(2),
  //     "Cycle Time": Number(row.cycleTime).toFixed(2),
  //     Quality: Number(row.quality).toFixed(2),
  //     Availability: Number(row.availability).toFixed(2),
  //     Performance: Number(row.performance).toFixed(2),
  //     OEE: Number(row.oee).toFixed(2),
  //     Utilization: Number(row.utilization).toFixed(2),
  //     Downtime: Number(row.downtime).toFixed(2),
  //     Uptime: Number(row.uptime).toFixed(2),
  //     Defects: Number(row.defects).toFixed(2),
  //     "Runtime In Mins": Number(row.runtimeInMins).toFixed(2),
  //     "Planned Production Time": Number(row.plannedProductionTime).toFixed(2),
  //     MTBF: Number(row.mtbf).toFixed(2),
  //     MTTR: Number(row.mttr).toFixed(2),
  //     "Standard Cycletime": Number(row.standardCycletime).toFixed(2),
  //     "Setup Time": Number(row.setupTime).toFixed(2),
  //     "Breakdown Time": Number(row.breakdownTime).toFixed(2),
  //   }));
  // };


  const formatDataExcel = (data) => {
    if (!data || data.length === 0) return [];

    const formatted = data.map((row) => ({
      "Date Time": row.dateTime,
      "Plant Name": row.plantName,
      "Line Name": row.lineName,
      "Machine Name": row.displayMachineName,
      "Actual Production": Number(row.actualProduction).toFixed(2),
      Gap: Number(row.gap).toFixed(2),
      Target: Number(row.target).toFixed(2),
      "Cycle Time": Number(row.cycleTime).toFixed(2),
      Quality: Number(row.quality).toFixed(2),
      Availability: Number(row.availability).toFixed(2),
      Performance: Number(row.performance).toFixed(2),
      OEE: Number(row.oee).toFixed(2),
      Utilization: Number(row.utilization).toFixed(2),
      Downtime: Number(row.downtime).toFixed(2),
      Uptime: Number(row.uptime).toFixed(2),
      Defects: Number(row.defects).toFixed(2),
      "Runtime In Mins": Number(row.runtimeInMins).toFixed(2),
      "Planned Production Time": Number(row.plannedProductionTime).toFixed(2),
      MTBF: Number(row.mtbf).toFixed(2),
      MTTR: Number(row.mttr).toFixed(2),
      "Standard Cycletime": Number(row.standardCycletime).toFixed(2),
      "Setup Time": Number(row.setupTime).toFixed(2),
      "Breakdown Time": Number(row.breakdownTime).toFixed(2),
    }));

    // ✅ Add totals row at the end
    const totals = {
      "Date Time": "TOTAL",
      "Plant Name": "",
      "Line Name": "",
      "Machine Name": "",
      "Actual Production": data.reduce((sum, r) => sum + Number(r.actualProduction), 0).toFixed(2),
      Gap: data.reduce((sum, r) => sum + Number(r.gap), 0).toFixed(2),
      Target: data.reduce((sum, r) => sum + Number(r.target), 0).toFixed(2),
      "Cycle Time": (data.reduce((sum, r) => sum + Number(r.cycleTime), 0) / data.length).toFixed(2),
      Quality: (data.reduce((sum, r) => sum + Number(r.quality), 0) / data.length).toFixed(2),
      Availability: (data.reduce((sum, r) => sum + Number(r.availability), 0) / data.length).toFixed(2),
      Performance: (data.reduce((sum, r) => sum + Number(r.performance), 0) / data.length).toFixed(2),
      OEE: (data.reduce((sum, r) => sum + Number(r.oee), 0) / data.length).toFixed(2),
      Utilization: (data.reduce((sum, r) => sum + Number(r.utilization), 0) / data.length).toFixed(2),
      Downtime: data.reduce((sum, r) => sum + Number(r.downtime), 0).toFixed(2),
      Uptime: data.reduce((sum, r) => sum + Number(r.uptime), 0).toFixed(2),
      Defects: data.reduce((sum, r) => sum + Number(r.defects), 0).toFixed(2),
      "Runtime In Mins": data.reduce((sum, r) => sum + Number(r.runtimeInMins), 0).toFixed(2),
      "Planned Production Time": data.reduce((sum, r) => sum + Number(r.plannedProductionTime), 0).toFixed(2),
      MTBF: (data.reduce((sum, r) => sum + Number(r.mtbf), 0) / data.length).toFixed(2),
      MTTR: (data.reduce((sum, r) => sum + Number(r.mttr), 0) / data.length).toFixed(2),
      "Standard Cycletime": (data.reduce((sum, r) => sum + Number(r.standardCycletime), 0) / data.length).toFixed(2),
      "Setup Time": data.reduce((sum, r) => sum + Number(r.setupTime), 0).toFixed(2),
      "Breakdown Time": data.reduce((sum, r) => sum + Number(r.breakdownTime), 0).toFixed(2),
    };

    return [...formatted, totals];
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
        <h2>Monthly Report</h2>
      </div>
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center", marginBottom: "10px" }}
      >
        {" "}
        {/* <Grid item xs={6} sm={2}>
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
        </Grid> */}
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Device</InputLabel>

            <Select
              name="deviceNo"
              value={rawData?.deviceNo}
              onChange={handleInputChange}
            >
              {deviceData.map((device) => (
                <MenuItem key={device.deviceNo} value={device.deviceNo}>
                  {device.deviceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Year</InputLabel>
            <Select
              name="year"
              value={rawData.year || currentYear}
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
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              name="month"
              value={rawData.month}
              onChange={handleInputChange}
            >
              {months.map((month, index) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={6} sm={3}>
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
        </Grid> */}
        <Grid item>
          {" "}
          <Button variant="contained" color="primary" onClick={handleAddSubmit}>
            OK
          </Button>
        </Grid>
        <Grid item>
          <DownloadButton
            apiCall={downloadApiCall}
            formatData={formatDataExcel}
            fileName="MonthlyBucket(M1).xlsx"
          />
        </Grid>
      </Grid>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
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
                  Actual Production
                </StyledTableCell>
                <StyledTableCell className="table-cell">Gap</StyledTableCell>
                <StyledTableCell className="table-cell">Target</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Cycle Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Quality
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Availability
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Performance
                </StyledTableCell>
                <StyledTableCell className="table-cell">OEE</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Utilization
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Downtime
                </StyledTableCell>
                <StyledTableCell className="table-cell">Uptime</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Defects
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Runtime In Mins
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Planned Production Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">MTBF</StyledTableCell>
                <StyledTableCell className="table-cell">MTTR</StyledTableCell>
                <StyledTableCell className="table-cell">
                  Standard Cycletime
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Setup Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Breakdown Time
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.dateTime}</StyledTableCell>
                    <StyledTableCell>{row.plantName}</StyledTableCell>
                    <StyledTableCell>{row.lineName}</StyledTableCell>
                    <StyledTableCell>{row.displayMachineName}</StyledTableCell>
                    <StyledTableCell>
                      {Number(row.actualProduction).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.gap).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.target).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.cycleTime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.quality).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.availability).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.performance).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.oee).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.utilization).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.downtime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.uptime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.defects).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.runtimeInMins).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.plannedProductionTime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.mtbf).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.mttr).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.standardCycletime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.setupTime).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {Number(row.breakdownTime).toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}

              {/* Totals row */}
              {data.length > 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} style={{ fontWeight: "bold" }}>
                    Total
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.actualProduction), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data.reduce((sum, r) => sum + Number(r.gap), 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.target), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.cycleTime), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.quality), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.availability), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.performance), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.oee), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.utilization), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.downtime), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.uptime), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.defects), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.runtimeInMins), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce(
                        (sum, r) => sum + Number(r.plannedProductionTime),
                        0
                      )
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.mtbf), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.mttr), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, r) => sum + Number(r.standardCycletime), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.setupTime), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.breakdownTime), 0)
                      .toFixed(2)}
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

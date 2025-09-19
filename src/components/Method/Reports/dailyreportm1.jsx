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
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  TableContainer,
  Paper,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { parseISO, format } from "date-fns";

import MuiAlert from "@mui/material/Alert";

import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../../utils/Auth";
import { apigetMachine } from "../../../api/MachineMaster/apigetmachine";
import { apigetLines } from "../../../api/LineMaster/api.getline";
import { apiGetShift } from "../../../api/api.getshift";
import { apiGetDevice } from "../../../api/DeviceMaster/api.getdevice";
import {
  apiHourlyBucket1,
  apiHourlyBucketOEE,
} from "../../../api/ReportMaster/api.hourlybucket1";
import DownloadButton from "../../../utils/DownloadButton";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
    position: "sticky",
    top: 0,
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      padding: "8px 4px",
      fontSize: "0.8rem",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      padding: "8px 4px",
      fontSize: "0.75rem",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& > *": {
      whiteSpace: "nowrap",
    },
  },
}));

const ResponsiveFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",
  minWidth: "unset",
  marginBottom: theme.spacing(2),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "& > button": {
      width: "100%",
    },
  },
}));

const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function HourlyBucketM1() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [refreshData, setRefreshData] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hourlyBucket, setHourlyBucket] = useState({
    deviceNo: "",
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  });
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [severity, setSeverity] = useState("success");
  const [selectedLine, setSelectedLine] = useState("");
  const [data, setData] = useState([]);

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  useAuthCheck();
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

  useEffect(() => {
    const getDevice = async () => {
      try {
        const result = await apiGetDevice();
        //console.log("Result data device:", result.data.data);
        setDeviceData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getDevice();
  }, [refreshData]);

  useEffect(() => {
    const getShift = async () => {
      try {
        const result = await apiGetShift();
        //console.log("shiftdata", result.data.data);
        setShiftData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getShift();
  }, [refreshData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "shiftDetails") {
      try {
        const parsed = JSON.parse(value);
        setHourlyBucket((prev) => ({
          ...prev,
          shiftName: parsed.shiftName,
          deviceNo: parsed.deviceNo,
        }));
      } catch (error) {
        console.error("Error parsing shiftDetails:", error);
      }
    } else {
      setHourlyBucket((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };

  const filteredMachines = machineData.filter(
    (machine) => machine.lineNo === selectedLine
  );
  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      deviceNo: hourlyBucket.deviceNo,
      fromDate: hourlyBucket.fromDate,
      toDate: hourlyBucket.toDate,
      shiftName: hourlyBucket.shiftName,
    };
    try {
      //console.log("hourly 1 data:", body);
      const result = await apiHourlyBucketOEE(body);

      // await getmachine();
      handleSnackbarOpen("Hourly bucket data fetched successfully!", "success");
      // setLoading(false);
      //console.log("hourly1 response", result.data);
      setData(
        result.data.map((row) => ({
          ...row,
          downtime: row.actualproduction === 0 ? 0 : row.downtime,
          runtimeInMins: row.actualproduction === 0 ? 0 : row.runtimeInMins,
        }))
      );
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error getting hourly bucket 1 data:", error);
      handleSnackbarOpen(
        "Error fetching hourly bucket 1  data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWholeDay = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // take from hourlyBucket
      const fromDate = new Date(hourlyBucket.fromDate);
      fromDate.setHours(7, 0, 0, 0); // force 7 AM

      const toDate = new Date(hourlyBucket.toDate); // keep as-is

      const body = {
        deviceNo: hourlyBucket.deviceNo,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      };

      const result = await apiHourlyBucketOEE(body);

      handleSnackbarOpen(
        "Hourly bucket for whole day data fetched successfully!",
        "success"
      );

      setData(
        result.data.map((row) => ({
          ...row,
          downtime: row.actualproduction === 0 ? 0 : row.downtime,
          runtimeInMins: row.actualproduction === 0 ? 0 : row.runtimeInMins,
        }))
      );
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error getting hourly bucket 1 data:", error);
      handleSnackbarOpen(
        "Error fetching hourly bucket 1 data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const downloadApiCall = async () => {
    const fromDate = new Date(hourlyBucket.fromDate);
    fromDate.setHours(7, 0, 0, 0); // force 7 AM

    const toDate = new Date(hourlyBucket.toDate); // keep as-is

    const body = {
      deviceNo: hourlyBucket.deviceNo,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    };

    const result = await apiHourlyBucketOEE(body);

    return result;
  };

  const formatData = (data) => {
    return data.map((row) => {
      const downtime = row.actualproduction === 0 ? 0 : row.downtime;
      const runtimeInMins = row.actualproduction === 0 ? 0 : row.runtimeInMins;

      return {
        "Device Name": row.deviceName || "",
        "Part Name": row.partName || "",
        "Date Time": row.dateTime || "",
        "Actual Production":
          row.actualproduction != null
            ? Number(row.actualproduction).toFixed(2)
            : "0.00",
        Target: row.target != null ? Number(row.target).toFixed(2) : "0.00",
        Gap: row.gap != null ? Number(row.gap).toFixed(2) : "0.00",
        OEE: row.oee != null ? Number(row.oee).toFixed(2) : "0.00",
        Quality: row.quality != null ? Number(row.quality).toFixed(2) : "0.00",
        Availability:
          row.availability != null
            ? Number(row.availability).toFixed(2)
            : "0.00",
        Performance:
          row.performance != null ? Number(row.performance).toFixed(2) : "0.00",
        Utilization:
          row.utilization != null ? Number(row.utilization).toFixed(2) : "0.00",
        "Down Time": Number(downtime).toFixed(2),
        "Run Time (Min)": Number(runtimeInMins).toFixed(2),
        "Cycle Time":
          row.cycleTime != null ? Number(row.cycleTime).toFixed(2) : "0.00",
        "Breakdown Time":
          row.breakdownTime != null
            ? Number(row.breakdownTime).toFixed(2)
            : "0.00",
        Defects: row.defects != null ? Number(row.defects).toFixed(2) : "0.00",
      };
    });
  };

  // const handleNavigateWholeDayM1 = () => {
  //   const { fromDate, lineNo, machineId } = hourlyBucket;
  //   const selectedMachine = machineData.find(
  //     (machine) => machine.machineId === machineId
  //   );
  //   const machineNo = selectedMachine ? selectedMachine.machineNo : "";

  //   navigate("/reportm1/wholedayreportm1", {
  //     state: { fromDate, lineNo, machineId, machineNo },
  //   });
  // };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Box
      sx={{
        padding: { xs: "10px", sm: "20px" },
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          paddingY: { xs: 1, sm: 1 },
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
        }}
      >
        <h2>Daily Report</h2>
      </Box>

      <Grid container spacing={2} sx={{ mb: 1 }} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <ResponsiveFormControl>
            <TextField
              name="fromDate"
              label="Start Date & Time"
              type="date"
              value={hourlyBucket?.fromDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </ResponsiveFormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ResponsiveFormControl>
            <TextField
              name="toDate"
              label="End Date & Time"
              type="date"
              value={hourlyBucket?.toDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </ResponsiveFormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <ResponsiveFormControl>
            <InputLabel>Select Device</InputLabel>
            <Select
              name="deviceNo"
              value={hourlyBucket.deviceNo}
              onChange={handleInputChange}
              fullWidth
            >
              {deviceData.map((device) => (
                <MenuItem key={device.deviceNo} value={device.deviceNo}>
                  {device.deviceName}
                </MenuItem>
              ))}
            </Select>
          </ResponsiveFormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitWholeDay}
            fullWidth={isMobile}
          >
            OK
          </Button>
        </Grid>
      </Grid>

      <ButtonContainer>
        <DownloadButton
          apiCall={downloadApiCall}
          formatData={formatData}
          fileName="HourlyBucket(M1).xlsx"
        />
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitWholeDay}
        >
          Whole Day
        </Button> */}
      </ButtonContainer>

      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          mb: 0,
        }}
      >
        <TablePagination
          rowsPerPageOptions={[50, 100, 500, 1000]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: "400px", sm: "500px" },
          mb: 5,
          overflow: "auto",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table size={isMobile ? "small" : "medium"} stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Device Name</StyledTableCell>
                <StyledTableCell>Part Name</StyledTableCell>
                <StyledTableCell>Date Time</StyledTableCell>
                <StyledTableCell>Actual Production</StyledTableCell>
                <StyledTableCell>Target</StyledTableCell>
                <StyledTableCell>Gap</StyledTableCell>
                <StyledTableCell>OEE</StyledTableCell>
                <StyledTableCell>Quality</StyledTableCell>
                <StyledTableCell>Availability</StyledTableCell>
                <StyledTableCell>Performance</StyledTableCell>
                <StyledTableCell>Utilization</StyledTableCell>
                <StyledTableCell>Down Time</StyledTableCell>
                <StyledTableCell>Run Time (Min)</StyledTableCell>
                <StyledTableCell>Cycle Time</StyledTableCell>
                <StyledTableCell>Breakdown Time</StyledTableCell>
                <StyledTableCell>Defects</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.deviceName}</StyledTableCell>
                    <StyledTableCell>{row.partName}</StyledTableCell>
                    <StyledTableCell>{row.dateTime}</StyledTableCell>
                    <StyledTableCell>{row.actualproduction}</StyledTableCell>
                    <StyledTableCell>{row.target}</StyledTableCell>
                    <StyledTableCell>{row.gap}</StyledTableCell>
                    <StyledTableCell>{row.oee}</StyledTableCell>
                    <StyledTableCell>{row.quality}</StyledTableCell>
                    <StyledTableCell>{row.availability}</StyledTableCell>
                    <StyledTableCell>{row.performance}</StyledTableCell>
                    <StyledTableCell>{row.utilization}</StyledTableCell>
                    <StyledTableCell>{row.downtime}</StyledTableCell>
                    <StyledTableCell>{row.runtimeInMins}</StyledTableCell>
                    <StyledTableCell>{row.cycleTime}</StyledTableCell>
                    <StyledTableCell>{row.breakdownTime}</StyledTableCell>
                    <StyledTableCell>{row.defects}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

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
    </Box>
  );
}

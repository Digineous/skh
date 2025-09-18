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
import { postQuaterly } from "../../../api/ReportMaster/api.postQuaterly";
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
    deviceNo: "",
    year: new Date().getFullYear(),
    quarter: "",
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
  // const handleAddSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(rawData)
  //   setLoading(true);
  //   try {
  //     const formattedFromDate = format(
  //       parseISO(rawData.fromDate),
  //       "dd-MMM-yyyy"
  //     );
  //     const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
  //     //console.log(
  //     //   "todate,fromdate,machineid,lineid:",
  //     //   formattedToDate,
  //     //   formattedFromDate
  //     // );
  //     const formattedRawData = {
  //       ...rawData,
  //       fromDate: formattedFromDate,
  //       toDate: formattedToDate,
  //     };
  //     // setAddOpen(false);
  //     //console.log("formatted raw data:", formattedRawData);
  //     const result = await apigetRawData(formattedRawData);

  //     // await getmachine();
  //     handleSnackbarOpen("Raw Data fetched successfully!", "success"); // Pass severity as "success"
  //     // setLoading(false);
  //     //console.log("Raw response", result.data);
  //     setData(result.data);
  //     setRefreshData((prev) => !prev);
  //   } catch (error) {
  //     // setLoading(false);
  //     console.error("Error getting raw data:", error);
  //     handleSnackbarOpen("Error fetching raw data. Please try again.", "error"); // Pass severity as "error"
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    // console.log("✅ Data updated in state:", data);
  }, [data]);

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    const data = {
      deviceNo: Number(rawData.deviceNo),
      year: rawData.year,
      quarter: rawData.quarter,
    };
    // console.log("Request Payload:", data);
    setLoading(true);
    try {
      const result = await postQuaterly(data);
      //  console.log("Quarterly API Response:", result.data);
      setData(result?.data);

      handleSnackbarOpen("Quarterly data fetched successfully!", "success");
    } catch (error) {
      // console.error("Error fetching quarterly data:", error);
      handleSnackbarOpen(
        "Error fetching quarterly data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadApiCall = async () => {
    const data = {
      deviceNo: Number(rawData.deviceNo),
      year: rawData.year,
      quarter: rawData.quarter,
    };

    const result = await postQuaterly(data);

    return result;
  };

  // const formatDataExcel = (data) => {
  //   return data.map((row) => ({
  //     "Date Time": row.dateTime,
  //     "Plant Name": row.plantName,
  //     "Line Name": row.lineName,
  //     "Machine Name": row.displayMachineName,
  //     "Actual Production": Number(row.actualProduction || 0).toFixed(2),
  //     Gap: Number(row.gap || 0).toFixed(2),
  //     Target: Number(row.target || 0).toFixed(2),
  //     "Cycle Time": Number(row.cycleTime || 0).toFixed(2),
  //     Quality: Number(row.quality || 0).toFixed(2),
  //     Availability: Number(row.availability || 0).toFixed(2),
  //     Performance: Number(row.performance || 0).toFixed(2),
  //     OEE: Number(row.oee || 0).toFixed(2),
  //     Utilization: Number(row.utilization || 0).toFixed(2),
  //     Downtime: Number(row.downtime || 0).toFixed(2),
  //     Uptime: Number(row.uptime || 0).toFixed(2),
  //     Defects: Number(row.defects || 0).toFixed(2),
  //     "Runtime In Mins": Number(row.runtimeInMins || 0).toFixed(2),
  //     "Planned Production Time": Number(row.plannedProductionTime || 0).toFixed(
  //       2
  //     ),
  //     MTBF: Number(row.mtbf || 0).toFixed(2),
  //     MTTR: Number(row.mttr || 0).toFixed(2),
  //     "Standard Cycletime": Number(row.standardCycletime || 0).toFixed(2),
  //     "Setup Time": Number(row.setupTime || 0).toFixed(2),
  //     "Breakdown Time": Number(row.breakdownTime || 0).toFixed(2),
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
        <h2>Quaterly Report</h2>
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
            <InputLabel>Select Line</InputLabel>
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
              name="deviceNo"
              value={rawData.deviceNo || ""} // ✅ use correct field
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
        <Grid item xs={6} sm={3}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Select Quarter</InputLabel>
            <Select
              name="quarter"
              value={rawData.quarter}
              onChange={handleInputChange}
            >
              <MenuItem value={1}>Quarter 1</MenuItem>
              <MenuItem value={2}>Quarter 2</MenuItem>
              <MenuItem value={3}>Quarter 3</MenuItem>
              <MenuItem value={4}>Quarter 4</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            label="Year"
            name="year"
            type="number"
            value={rawData.year}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
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
            fileName="QuaterlyBucket(M1).xlsx"
          />
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
              {data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{row.dateTime}</StyledTableCell>
                  <StyledTableCell>{row.plantName}</StyledTableCell>
                  <StyledTableCell>{row.lineName}</StyledTableCell>
                  <StyledTableCell>{row.displayMachineName}</StyledTableCell>
                  <StyledTableCell>
                    {Number(row.actualProduction || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.gap || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.target || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.cycleTime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.quality || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.availability || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.performance || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.oee || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.utilization || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.downtime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.uptime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.defects || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.runtimeInMins || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.plannedProductionTime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.mtbf || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.mttr || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.standardCycletime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.setupTime || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Number(row.breakdownTime || 0).toFixed(2)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              {/* Totals Row */}
              {data.length > 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} style={{ fontWeight: "bold" }}>
                    Total
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce(
                        (sum, r) => sum + Number(r.actualProduction || 0),
                        0
                      )
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.gap || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.target || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                   {(
                      data.reduce((sum, row) => sum + Number(row.cycleTime), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, row) => sum + Number(row.quality), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                     {(
                      data.reduce((sum, row) => sum + Number(row.availability), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                   {(
                      data.reduce((sum, row) => sum + Number(row.performance), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, row) => sum + Number(row.oee), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, row) => sum + Number(row.utilization), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.downtime || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.uptime || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.defects || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.runtimeInMins || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce(
                        (sum, r) => sum + Number(r.plannedProductionTime || 0),
                        0
                      )
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, row) => sum + Number(row.mtbf), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(
                      data.reduce((sum, row) => sum + Number(row.mttr), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                 {(
                      data.reduce((sum, row) => sum + Number(row.standardCycletime), 0) / data.length
                    ).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.setupTime || 0), 0)
                      .toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {data
                      .reduce((sum, r) => sum + Number(r.breakdownTime || 0), 0)
                      .toFixed(2)}
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

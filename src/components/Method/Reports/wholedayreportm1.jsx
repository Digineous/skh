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


import { useLocation } from "react-router-dom";
import BackButton from "./backbutton";
import { useAuthCheck } from "../../../utils/Auth";
import { apigetLines } from "../../../api/LineMaster/api.getline";
import { apigetMachine } from "../../../api/MachineMaster/apigetmachine";
import { apiWholeDayReportM1 } from "../../../api/ReportMaster/api.wholedayreportm1";

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

export default function WholeDayReportM1() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rawData, setRawData] = useState({
    lineNo: "",
    machineNo: "",
    fromDate: "23:01:1997",
    toDate: "23:01:1997",
  });
  const location = useLocation();
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
    if (location.state) {
      const { fromDate, lineNo, machineId } = location.state;
      console.log("From Location State: ", fromDate, lineNo, machineId);  
  
      setRawData((prevData) => ({
        ...prevData,
        fromDate,
        lineNo,
      }));
  
      const filteredMachines = machineData.filter(
        (machine) => machine.lineNo === lineNo
      );
      console.log("Filtered Machines: ", filteredMachines);  
  
      const selectedMachine = filteredMachines.find(
        (machine) => parseInt(machine.machineId) === parseInt(machineId)
      );
      console.log("Selected Machine: ", selectedMachine);
  
      if (selectedMachine) {
        setRawData((prevData) => ({
          ...prevData,
          machineNo: selectedMachine.machineNo,
        }));
      } else {
        console.log("Machine not found for machineNo:", machineId);
      }
    }
  }, [location.state, machineData]);
  

  
  // const handleInputChange = (e) => {
  //   console.log(e.target.name, e.target.value);
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
      const formattedFromDate = format(
        parseISO(rawData.fromDate),
        "dd-MMM-yyyy"
      );
     
     
      const formattedRawData = {
        ...rawData,
        fromDate: formattedFromDate,
       
      };
      // setAddOpen(false);
      console.log("formatted raw data:", formattedRawData);
      const result = await apiWholeDayReportM1(formattedRawData);

      // await getmachine();
      handleSnackbarOpen(" whole day report m1 fetched successfully!", "success"); // Pass severity as "success"
      // setLoading(false);
      console.log("Daily report m1", result.data);
      setData(result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      // setLoading(false);
      console.error("Error getting whole day report m1:", error);
      handleSnackbarOpen(
        "Error fetching whole day report m1. Please try again.",
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
  console.log("Machine Data: ", machineData);
  const selectedMachine = filteredMachines.find(machine => machine.machineNo === rawData.machineNo);
console.log("Selected Machine:", selectedMachine, "MachineNo from RawData:", rawData.machineNo); 

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
          paddingBottom: "10px",
          alignItems:'center'
        }}
      >
        <div style={{marginTop:'0px'}}>
        <BackButton />
        </div>
        <h2 style={{marginBottom:'15px',marginLeft:'20px'}}>Whole Day Report M1 </h2>
      </div>
      <Grid
        container
        spacing={2}
        style={{ width: "100%", alignItems: "center",  }}
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
        
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Machine</InputLabel>

            <Select
              name="machineNo"
              value={rawData?.machineNo}
              onChange={handleInputChange}
              renderValue={(value) => {
               
              }}
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
          {" "}
          <FormControl sx={{ minWidth: 250 }}>
            <TextField
              label="Select Date"
              name="fromDate"
              type="date"
              placeholder="Start Date"
              value={rawData?.fromDate}
              onChange={handleInputChange}
            />
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
              marginBottom:'40px'
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
                    {/* <StyledTableCell>{row.opeC2}</StyledTableCell> */}
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

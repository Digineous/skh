import {
    Box,
    CircularProgress,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
    tableCellClasses,
    IconButton,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import CircleIcon from "@mui/icons-material/Circle";
  import MuiAlert from "@mui/material/Alert";
import { useAuthCheck } from "../../utils/Auth";
import { apiGetControlRoom } from "../../api/api.getcontrolroom";
 
  
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
  
  export default function COntrolRoom() {
    const [machineInputData, setMachineInputData] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState("success");
  
    useAuthCheck();
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const [machineInputResult] = await Promise.all([apiGetControlRoom()]);
        const machineInputData1 = machineInputResult.data.data;
        //console.log("control room data:", machineInputData1);
        setMachineInputData(machineInputData1);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData(); // Initial data fetch
  
      const interval = setInterval(() => {
        fetchData(); // Fetch data every 30 seconds
      }, 30000); // 30000 ms = 30 seconds
  
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, []);
  
    const handleSnackbarOpen = (message, severity) => {
      setSnackbarMessage(message);
      setSeverity(severity);
      setOpenSnackbar(true);
    };
  
    return (
      <div style={{ padding: "0px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <h2>Device Status</h2>
        </div>
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
              style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell className="table-cell">Plant Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Machine Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Date Time</StyledTableCell>
                  <StyledTableCell className="table-cell">Device Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {machineInputData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell className="table-cell">{row.plantName}</StyledTableCell>
                    <StyledTableCell className="table-cell">{row.machineName}</StyledTableCell>
                    <StyledTableCell className="table-cell">{row.dateTime}</StyledTableCell>
                    <StyledTableCell className="table-cell" style={{ alignItems: "center" }}>
                      <CircleIcon
                        style={{
                          color:
                            row.deviceStatus === "GREEN"
                              ? "green"
                              : row.deviceStatus === "RED"
                              ? "red"
                              : "gray",
                        }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
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
  
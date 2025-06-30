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
import { apiGetHolidays } from "../../api/api.getholidaylist";

  
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
  
  export default function HolidayList() {
    const [holidaysList, setHolidaysList] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState("success");
  
    useAuthCheck()
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const [machineInputResult] = await Promise.all([apiGetHolidays()]);
        const holidaysList1 = machineInputResult.data.data;
        console.log("control room data:", holidaysList1);
        setHolidaysList(holidaysList1);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData(); // Initial data fetch
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
          <h2>Holidays List
          </h2>
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
                  <StyledTableCell className="table-cell">Holiday Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Date </StyledTableCell>
                  <StyledTableCell className="table-cell">Day </StyledTableCell>
                  {/* <StyledTableCell className="table-cell">Device Status</StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {holidaysList.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell className="table-cell">{row.plantName}</StyledTableCell>
                    <StyledTableCell className="table-cell">{row.holidaysName}</StyledTableCell>
                    <StyledTableCell className="table-cell">{row.holidaysDate}</StyledTableCell>
                    <StyledTableCell className="table-cell">{row.holidaysDay}</StyledTableCell>
                    
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
  
import React, { useState } from 'react';
import {
  Modal,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Button,
  styled,
  tableCellClasses,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";


import TableCell from "@mui/material/TableCell";
import { apiAddAvailabilityLoss } from '../../api/ChangeOverMaster/api.AddAvailibityLoss';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
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

const ALossReportModal = ({ open, handleClose, data = [] }) => {
  
  const [reasons, setReasons] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");


  const reportData = Array.isArray(data) ? data : [];

  const handleChange = (rowIndex, event) => {
    setReasons((prevReasons) => ({
      ...prevReasons,
      [rowIndex]: event.target.value
    }));
  };
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleModalClose = () => {
   handleClose()
  };

  const handleEditClick = async (row, rowIndex) => {
    const reason = reasons[rowIndex] || ''; 
    console.log(`Updating row ${rowIndex}:`, {
      reportId: row.reportId,
      machineId: row.machineId,
      dateTime: row.dateTime,
      aLoss: row.unknownLoss,
      aLossReason: reason
    });

    try {
      const response = await apiAddAvailabilityLoss({
        reportId: row.reportId,
        machineId: row.machineId,
        dateTime: row.dateTime,
        aLoss: row.unknownLoss,
        aLossReason: reason
      });
      console.log("API response data:", response);
      handleSnackbarOpen("A Loss reason added successfully!", "success"); 

    } catch (error) {
      console.error("Error during adding availability loss data:", error);
      handleSnackbarOpen(
        "Error adding A Loss reason. Please try again.",
        "error"
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "80%",
        maxHeight: "80%",
        overflow: "auto"
      }}>
         <button
                  onClick={handleModalClose}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "30px",
                  }}
                >
                  &times;
                </button>
        <h2 style={{margin:'0px 0px 20px 0px'}}>A Loss Report</h2>
        <Table size="small">
          <TableHead>
            <TableRow>
              {/* <StyledTableCell>Report ID</StyledTableCell> */}
              <StyledTableCell>Plant Name</StyledTableCell>
              <StyledTableCell>Machine ID</StyledTableCell>
              <StyledTableCell>Machine Name</StyledTableCell>
              <StyledTableCell>Date Time</StyledTableCell>
              <StyledTableCell>Unknown Loss</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <StyledTableRow key={index}>
                  {/* <StyledTableCell>{row.reportId}</StyledTableCell> */}
                  <StyledTableCell>{row.plantName}</StyledTableCell>
                  <StyledTableCell>{row.machineId}</StyledTableCell>
                  <StyledTableCell>{row.machineName}</StyledTableCell>
                  <StyledTableCell>{row.dateTime}</StyledTableCell>
                  <StyledTableCell>{row.unknownLoss}</StyledTableCell>
                  <StyledTableCell
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                    className="table-cell"
                  >
                    <FormControl sx={{ width: "26ch" }}>
                      <InputLabel>Reason</InputLabel>
                      <Select
                        name="reason"
                        value={reasons[index] || ''}
                        onChange={(event) => handleChange(index, event)}
                      >
                        <MenuItem value="Breakdown Loss">Breakdown Loss</MenuItem>
                        <MenuItem value="Planned Maintenance Loss">Planned Maintenance Loss</MenuItem>
                        <MenuItem value="Setup & Adjustment Loss">Setup & Adjustment Loss</MenuItem>
                        <MenuItem value="Cutting Blade Change Loss">Cutting Blade Change Loss</MenuItem>
                        <MenuItem value="Startup Loss">Startup Loss</MenuItem>
                        <MenuItem value="Minor Stoppage Loss">Minor Stoppage Loss</MenuItem>
                        <MenuItem value="Speed Loss">Speed Loss</MenuItem>
                        <MenuItem value="Defecty & Rework Loss">Defecty & Rework Loss</MenuItem>
                        <MenuItem value="Management Loss">Management Loss</MenuItem>
                        <MenuItem value="Operation Motion Loss (OML)">Operation Motion Loss (OML)</MenuItem>
                        <MenuItem value="Line Organization Loss (LOL)">Line Organization Loss (LOL)</MenuItem>
                        <MenuItem value="Distribution/Logistic Loss">Distribution/Logistic Loss</MenuItem>
                        <MenuItem value="Measurement & Adjustment Loss">Measurement & Adjustment Loss</MenuItem>
                        <MenuItem value="Yield Loss">Yield Loss</MenuItem>
                        <MenuItem value="Energy Loss">Energy Loss</MenuItem>
                        <MenuItem value="Die & Tool Loss">Die & Tool Loss</MenuItem>
                      </Select>
                    </FormControl>
                    <div
                      className="divider"
                      style={{
                        height: "20px",
                        width: "2px",
                        backgroundColor: "#0003",
                      }}
                    ></div>
                    <Button variant="contained" onClick={() => handleEditClick(row, index)}>
                     Save
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">No data available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
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
    </Modal>
  );
};

export default ALossReportModal;

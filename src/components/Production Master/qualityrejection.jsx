import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
  TablePagination,
  tabClasses,
  Tab,
  Tabs,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { parseISO, format, parse } from "date-fns";
import { useAuthCheck } from "../../utils/Auth";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apiGetShift } from "../../api/api.getshift";
import { apiGetQualityRejection } from "../../api/QualityRejection/api.getqualityrejection";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apiQLossHourly } from "../../api/QualityRejection/api.qlosshourly";
import { apiQualityRejection } from "../../api/QualityRejection/api.addqualityrejection";
import { apiUpdateQualityRejection } from "../../api/QualityRejection/api.updateqrejection";
import { apiUpdateHourly } from "../../api/QualityRejection/api.updateHourly";
import { apiRejectionDetail } from "../../api/QualityRejection/api.rejectionDetail";
import { apiDeleteQualityRejection } from "../../api/QualityRejection/api.deleteqrejection";
import DeleteConfirmationModal from "../deletemodal";


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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function QualityRejection() {
  const [machinedata, setMachinedata] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [add2Open, setAdd2Open] = useState(false);
  const [add3Open, setAdd3Open] = useState(false);

  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateHourly, setUpdateHourly] = useState(false);

  const [machineID, setMachineID] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCOde] = useState("");
  const [lineProductionCount, setLineProductionCount] = useState("");
  const [lineName, setLineName] = useState([]);
  const [severity, setSeverity] = useState("success");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [shiftData, setShiftData] = useState([]);
  const [qRejectionData, setQRejectionData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [lineData, setLineData] = useState([]);
  const [deleteQRejectionId, setDeleteQRejectionId] = useState(null);
  const [deleteHourlyID, setDeleteHourlyID] = useState(null);

  const [filteredLineData, setFilteredLineData] = useState([]);
  const [filteredMachineData, setFilteredMachineData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [rejectReport, setRejectionReport] = useState([]);

  const [hourlyLossData, setHourlyLossData] = useState({
    lineNo: "",
    machineId: "",
    cdate: "23:01:1997",
    shiftNo: "",
    rejectionNoHourly: "",
  });

  const [updateHourlyLossData, setUpdateHourlyLossData] = useState({
    machineId: "",
    rejectionNoHourly: "",
  });
  const [rejectionDetail, setRejectionDetail] = useState({
    lineNo: "",
    machineNo: "",
    rdate: format(new Date(), "dd-MM-yyyy"),
    shiftNo: "",
  });

  const [updatedQRejection, setUpdatedQRejection] = useState({
    plantNo: "",
    machineNo: "",
    shiftNo: "",
    lineNo: "",
    rejectionNo: "",
    date: "23:01:1997",
  });
  useAuthCheck();

  const handleInputChange = (e) => {
    //console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setUpdatedQRejection((prevData) => ({
      ...prevData,
      [name]: value,
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    }));
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };
  const handleHourlyUpdate = (e) => {
    //console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setUpdateHourlyLossData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          machineResult,
          plantResult,
          shiftResult,
          qualityResult,
          lineResult,
        ] = await Promise.all([
          apigetMachine(),
          apiGetPlant(),
          apiGetShift(),
          apiGetQualityRejection(),
          apigetLines(),
        ]);

        setMachinedata(machineResult.data.data);
        setPlantData(plantResult.data.data);
        setShiftData(shiftResult.data.data);
        setQRejectionData(qualityResult.data.data);
        setLineData(lineResult.data.data);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshData]);

  useEffect(() => {
    if (
      hourlyLossData.lineNo &&
      lineData.length > 0 &&
      machinedata.length > 0
    ) {
      const selectedLine = lineData.find(
        (line) => line.lineNo === hourlyLossData.lineNo
      );
      if (selectedLine) {
        setHourlyLossData((prevData) => ({
          ...prevData,
          plantNo: selectedLine.plantNo,
        }));
      }

      const filteredMachines = machinedata.filter(
        (machine) => machine.lineNo === hourlyLossData.lineNo
      );
      setFilteredMachineData(filteredMachines);
    }
  }, [hourlyLossData.lineNo, lineData, machinedata]);

  useEffect(() => {
    if (
      updatedQRejection.lineNo &&
      lineData.length > 0 &&
      machinedata.length > 0
    ) {
      const selectedLine = lineData.find(
        (line) => line.lineNo === updatedQRejection.lineNo
      );
      if (selectedLine) {
        setUpdatedQRejection((prevData) => ({
          ...prevData,
          plantNo: selectedLine.plantNo,
        }));
      }

      const filteredMachines = machinedata.filter(
        (machine) => machine.lineNo === updatedQRejection.lineNo
      );
      setFilteredMachineData(filteredMachines);
    }
  }, [updatedQRejection.lineNo, lineData, machinedata]);
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleHourlyLossChange = (e) => {
    const { name, value } = e.target;
    setHourlyLossData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };
  const handleRejectionDetailChange = (e) => {
    const { name, value } = e.target;
    setRejectionDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    //console.log("rdate", rejectionDetail.rdate);
    if (name === "lineNo") {
      setSelectedLine(value);
    }
  };
  const handleOkClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formattedHourlyData = {
        ...hourlyLossData,

        shiftId: parseInt(hourlyLossData.shiftId, 10),
      };
      // setAddOpen(false);
      //console.log("formatted  data:", formattedHourlyData);
      const result = await apiQLossHourly(formattedHourlyData);

      setAdd2Open(false);
      handleSnackbarOpen(" Data fetched successfully!", "success");
      // setLoading(false);
      //console.log(" response get hourly", result.data);
      setData(result.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      // setLoading(false);
      console.error("Error getting  data:", error);
      handleSnackbarOpen("Error fetching data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    try {
      const formattedDate = format(
        parseISO(updatedQRejection.date),
        "dd-MMM-yyyy"
      );
      const formattedQRData = {
        ...updatedQRejection,
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      const result = await apiQualityRejection(formattedQRData);
      setAddOpen(false);
      setRefreshData((prev) => !prev);

      handleSnackbarOpen("Quality rejection added successfully!", "success");
      //console.log("response", result.data);
    } catch (error) {
      console.error("Error adding machine:", error);
      handleSnackbarOpen("Error quality rejection. Please try again.", "error");
    }
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      const formattedFromDate = format(
        parseISO(hourlyLossData.cdate),
        "dd-MMM-yyyy"
      );

      const formattedRawData = {
        ...hourlyLossData,
        cdate: formattedFromDate,
        shiftId: parseInt(hourlyLossData.shiftId, 10), // Convert shiftId to an integer
      };
      //console.log("updated hourly data,", formattedRawData);
      const result = await apiUpdateQualityRejection(formattedRawData);
      setUpdateOpen(false);
      setRefreshData((prev) => !prev);

      handleSnackbarOpen("Quality reason updated successfully!", "success"); 
      //console.log("response", result.data);
    } catch (error) {
      console.error("Error updating :", error);
      handleSnackbarOpen(
        "Error updating quality rejection. Please try again.",
        "error"
      ); 
    }
  };

  const handleHourlyEditClick = (row) => {
    //console.log("selected hourly row", row);
    setUpdateHourlyLossData(row);
    //console.log("selected hourly loss data", hourlyLossData);
    setUpdateHourly(true);
  };

  const handleUpdateHourly = async (event) => {
    event.preventDefault();
    try {
      const result = await apiUpdateHourly(updateHourlyLossData);
      setUpdateHourly(false);
      setRefreshData((prev) => !prev);
      handleSnackbarOpen("Data updated successfully!", "success");
      //console.log("Response from PUT request:", result.data);
    } catch (error) {
      console.error("Error updating data:", error);
      handleSnackbarOpen("Error updating data. Please try again.", "error");
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();

    try {
      const parsedDate = parse(rejectionDetail.rdate, "yyyy-MM-dd", new Date());
      const formattedDate = format(parsedDate, "dd-MMM-yyyy");
      const formattedQRData = {
        ...rejectionDetail,
        date: formattedDate,
      };
      const result = await apiRejectionDetail(formattedQRData);
      setRejectionReport(result.data);
      //console.log("rejection detail data", result.data);
      setAdd3Open(false);
      setRefreshData((prev) => !prev);

      handleSnackbarOpen(" rejection detail fetched successfully!", "success"); 
      //console.log("response", result.data);
    } catch (error) {
      console.error("Error getting rejection detail:", error);
      handleSnackbarOpen(
        "Error getting rejection detail. Please try again.",
        "error"
      );
    }
  };
  const handleEditClick = (row) => {
    //console.log("selected row", row);
    setUpdatedQRejection(row);
    setUpdateOpen(true);
  };

  const handleDeleteClick = (row) => {
    //console.log("deleting quality rejection:", row.id);
    setDeleteQRejectionId(row.id);
    setDeleteModalOpen(true);
  };
  const handleHourlyDeleteClick = (row) => {
    //console.log("deleting qr:", row.id);
    setDeleteHourlyID(row.id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiDeleteQualityRejection(deleteQRejectionId);
      handleSnackbarOpen("Quality rejection deleted successfully!", "success");
      setUpdatedQRejection({
        plantNo: "",
        machineNo: "",
        shiftNo: "",
        rejectionNo: "",
        date: "23:01:1997",
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error deleting Plant:", error);
      handleSnackbarOpen(
        "Error deleting quality rejection. Please try again.",
        "error"
      );
    } finally {
      setDeleteModalOpen(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const filteredMachines = machinedata.filter(
    (machine) => machine.lineNo === selectedLine
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModalClose = () => {
    setUpdatedQRejection({
      plantNo: "",
      machineNo: "",
      shiftNo: "",
      rejectionNo: "",
      date: "23:01:1997",
    });
    setRejectionDetail({
      lineNo: "",
      machineNo: "",
      rdate: format(new Date(), "dd-MM-yyyy"),
      shiftNo: "",
    });
    setUpdateHourlyLossData({ machineId: "", rejectionNoHourly: "" });
    setAddOpen(false);
    setAdd2Open(false);
    setAdd3Open(false);
    setUpdateHourly(false);
    setUpdateOpen(false);
  };
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, qRejectionData.length - page * rowsPerPage);
  return (
    <div style={{ padding: "0px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >
        <h2>Quality Rejection</h2>
        <div style={{ display: "flex" }}>
          {tabIndex === 0 && (
            <div
              style={{
                paddingTop: "5px",
                paddingBottom: "5px",
                display: "flex",
                justifyContent: "space-around",
                marginLeft: "10px",
              }}
            >
              <Button
                onClick={() => setAddOpen(true)}
                style={{
                  fontWeight: "500",
                  borderRadius: "4px",
                  color: "gray",
                  border: "2px solid gray",
                  padding: "5px",
                  marginBottom: "5px",
                }}
              >
                Get Shift Wise &nbsp;
              </Button>
            </div>
          )}

          {tabIndex === 1 && (
            <div
              style={{
                paddingTop:'10px',
                paddingBottom: "10px",
                display: "flex",
                marginRight: "10px",
              }}
            >
              <Button
                onClick={() => setAdd2Open(true)}
                style={{
                  fontWeight: "500",
                  borderRadius: "4px",
                  color: "gray",
                  border: "2px solid gray",
                  padding: "5px",
                  marginBottom: "5px",
                  marginLeft: "5px",
                }}
              >
                Get Hourly
              </Button>
            </div>
          )}

          {tabIndex === 2 && (
            <div
              style={{
                paddingTop: "5px",
                paddingBottom: "5px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                onClick={() => setAdd3Open(true)}
                style={{
                  fontWeight: "500",
                  borderRadius: "4px",
                  color: "gray",
                  border: "2px solid gray",
                  padding: "5px",
                  marginBottom: "5px",
                }}
              >
                Report &nbsp;
              </Button>
            </div>
          )}
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={qRejectionData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="tabs"
          sx={{
            // Styling for the tabs container
            ".MuiTabs-indicator": {
              backgroundColor: "#1FAEC5", // Keeps the indicator same color as active tab
            },
          }}
        >
          <Tab
            label="Shift Wise"
            sx={{
              backgroundColor: tabIndex === 0 ? "#1FAEC5" : "lightgrey",
              color: tabIndex === 0 ? "white !important" : "black",
              "&:hover": {
                backgroundColor: tabIndex === 0 ? "#1FAEC5" : "grey",
                color: tabIndex === 0 ? "white !important" : "black",
              },
            }}
          />
          <Tab
            label="Hourly"
            sx={{
              backgroundColor: tabIndex === 1 ? "#1FAEC5" : "lightgrey",
              color: tabIndex === 1 ? "white !important" : "black",
              "&:hover": {
                backgroundColor: tabIndex === 1 ? "#1FAEC5" : "grey",
                color: tabIndex === 1 ? "white !important" : "black",
              },
            }}
          />

          <Tab
            label="Reports"
            sx={{
              backgroundColor: tabIndex === 2 ? "#1FAEC5" : "lightgrey",
              color: tabIndex === 2 ? "white !important" : "black",
              "&:hover": {
                backgroundColor: tabIndex === 2 ? "#1FAEC5" : "grey",
                color: tabIndex === 2 ? "white !important" : "black",
              },
            }}
          />
        </Tabs>
        {tabIndex === 0 && (
          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-cell">
                  Plant Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Machine Name{" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Rejection Number
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Create Date{" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Shift Name{" "}
                </StyledTableCell>
                {/* <StyledTableCell  className="table-cell">Line Name</StyledTableCell > */}
                <StyledTableCell className="table-cell">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qRejectionData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell className="table-cell">
                    {row.lineName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.displayMachineName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.rejectionNo}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.createdAt}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.processDate}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.shiftName}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                    className="table-cell"
                  >
                    <IconButton onClick={() => handleEditClick(row)}>
                      <EditIcon />
                    </IconButton>
                    <div
                      className="divider"
                      style={{
                        height: "20px",
                        width: "2px",
                        backgroundColor: "#0003",
                      }}
                    ></div>
                    <IconButton
                      style={{ color: "#FF3131" }}
                      onClick={() => handleDeleteClick(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={8} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-400px",
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
        {tabIndex === 1 && (
          // Hourly tab content (placeholder)
          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-cell">
                  Plant Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Machine Name{" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Shift Name{" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Rejection Number
                </StyledTableCell>

                {/* <StyledTableCell  className="table-cell">Line Name</StyledTableCell > */}
                <StyledTableCell className="table-cell">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell className="table-cell">
                    {row.plantName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.dateTime}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.machineName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.shiftName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.rejectionNo}
                  </StyledTableCell>

                  <StyledTableCell
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                    className="table-cell"
                  >
                    <IconButton onClick={() => handleHourlyEditClick(row)}>
                      <EditIcon />
                    </IconButton>
                    {/* <div
                      className="divider"
                      style={{
                        height: "20px",
                        width: "2px",
                        backgroundColor: "#0003",
                      }}
                    ></div>
                    <IconButton
                      style={{ color: "#FF3131" }}
                      onClick={() => handleHourlyDeleteClick(row)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={8} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-400px",
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
        {tabIndex === 2 && (
          // Hourly tab content (placeholder)
          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-cell">
                  Plant Name
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Date Time
                </StyledTableCell>

                <StyledTableCell className="table-cell">
                  Machine Name{" "}
                </StyledTableCell>
                <StyledTableCell className="table-cell">
                  Rejection Number
                </StyledTableCell>

                {/* <StyledTableCell  className="table-cell">Line Name</StyledTableCell > */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rejectReport.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell className="table-cell">
                    {row.plantName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.dateTime}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.machineName}
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    {row.rejectionNo}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 }}>
                  <StyledTableCell colSpan={8} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-400px",
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

        <Modal open={updateHourly} onClose={handleModalClose}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              minWidth: "500px",
              borderRadius: "10px",
            }}
          >
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
            <h2>Update Hourly</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="lineNo"
                  // value={hourlyLossData?.lineNo}
                  onChange={handleHourlyUpdate}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineId"
                  value={updateHourlyLossData?.machineId}
                  onChange={handleHourlyUpdate}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.machineId}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftNo"
                  // value={hourlyLossData?.shiftNo}
                  onChange={handleHourlyUpdate}
                >
                  <MenuItem value="1">Shift A</MenuItem>
                  <MenuItem value="2">Shift B</MenuItem>
                  <MenuItem value="3">Shift C</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="rejectionNoHourly"
                label="Rejection Number "
                value={updateHourlyLossData?.rejectionNoHourly}
                onChange={handleHourlyUpdate}
                // style={{ marginRight: "10px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {/* <FormControl sx={{ minWidth: 225 }}>
                <TextField
                  name="date"
                  label="Start Date"
                  type="datetime-local"
                  // defaultValue="2024-03-20T09:00"
                  value={updatedQRejection?.date}
                  onChange={handleInputChange}
                />
              </FormControl> */}
            </div>

            <Button
              onClick={handleUpdateHourly}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Update
            </Button>
          </div>
        </Modal>

        <Modal open={updateOpen} onClose={handleModalClose}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              minWidth: "500px",
              borderRadius: "10px",
            }}
          >
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
            <h2>Update Reason</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="lineNo"
                  value={updatedQRejection?.lineNo}
                  onChange={handleInputChange}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={updatedQRejection?.machineNo}
                  onChange={handleInputChange}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.machineNo}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftNo"
                  value={updatedQRejection?.shiftNo}
                  onChange={handleInputChange}
                >
                  <MenuItem value="1">Shift A</MenuItem>
                  <MenuItem value="2">Shift B</MenuItem>
                  <MenuItem value="3">Shift C</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="rejectionNo"
                label="Rejection Number "
                value={updatedQRejection?.rejectionNo}
                onChange={handleInputChange}
                // style={{ marginRight: "10px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {/* <FormControl sx={{ minWidth: 225 }}>
                <TextField
                  name="date"
                  label="Start Date"
                  type="datetime-local"
                  // defaultValue="2024-03-20T09:00"
                  value={updatedQRejection?.date}
                  onChange={handleInputChange}
                />
              </FormControl> */}
            </div>

            <Button
              onClick={handleUpdateSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Update
            </Button>
          </div>
        </Modal>
        <Modal open={addOpen} onClose={handleModalClose}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              minWidth: "500px",
              borderRadius: "10px",
            }}
          >
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
            <h2>Add Reason</h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="lineNo"
                  value={updatedQRejection?.lineNo}
                  onChange={handleInputChange}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={updatedQRejection?.machineNo}
                  onChange={handleInputChange}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.machineNo}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftNo"
                  value={updatedQRejection?.shiftNo}
                  onChange={handleInputChange}
                >
                  <MenuItem value="1">Shift A</MenuItem>
                  <MenuItem value="2">Shift B</MenuItem>
                  <MenuItem value="3">Shift C</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="rejectionNo"
                label="Rejection Number "
                value={updatedQRejection.rejectionNo}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            ></div>

            <Button
              onClick={handleAddSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Add
            </Button>
          </div>
        </Modal>
        <Modal open={add3Open} onClose={handleModalClose}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              minWidth: "500px",
              borderRadius: "10px",
            }}
          >
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
            <h2>Get Rejection Detail </h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="lineNo"
                  value={rejectionDetail?.lineNo}
                  onChange={handleRejectionDetailChange}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={rejectionDetail?.machineNo}
                  onChange={handleRejectionDetailChange}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.machineNo}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftNo"
                  value={rejectionDetail?.shiftNo}
                  onChange={handleRejectionDetailChange}
                >
                  <MenuItem value="1">Shift A</MenuItem>
                  <MenuItem value="2">Shift B</MenuItem>
                  <MenuItem value="3">Shift C</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 225 }}>
                <TextField
                  name="rdate"
                  label="Select Date"
                  type="date"
                  value={rejectionDetail.rdate}
                  onChange={handleRejectionDetailChange}
                />
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {/* <TextField
                name="rejectionNo"
                label="Rejection Number "
                value={hourlyLossData.rejectionNo}
                onChange={handleHourlyLossChange}
                style={{ marginRight: "10px" }}
              /> */}
            </div>

            <Button
              onClick={handleReport}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Get
            </Button>
          </div>
        </Modal>
        <Modal open={add2Open} onClose={handleModalClose}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              minWidth: "500px",
              borderRadius: "10px",
            }}
          >
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
            <h2>Get Hourly </h2>
            <hr />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="lineNo"
                  value={hourlyLossData?.lineNo}
                  onChange={handleHourlyLossChange}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.id} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={hourlyLossData?.machineNo}
                  onChange={handleHourlyLossChange}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.machineNo}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <FormControl sx={{ width: "26ch" }}>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftNo"
                  value={hourlyLossData?.shiftNo}
                  onChange={handleHourlyLossChange}
                >
                  <MenuItem value="1">Shift A</MenuItem>
                  <MenuItem value="2">Shift B</MenuItem>
                  <MenuItem value="3">Shift C</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {/* <TextField
                name="rejectionNo"
                label="Rejection Number "
                value={hourlyLossData.rejectionNo}
                onChange={handleHourlyLossChange}
                style={{ marginRight: "10px" }}
              /> */}
            </div>

            <Button
              onClick={handleOkClick}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Get
            </Button>
          </div>
        </Modal>
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
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

import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import Modal from './Modal'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Typography, TextField, IconButton, Box, FormControl, InputLabel, Select, MenuItem, tableCellClasses, styled, TablePagination, Tooltip } from "@mui/material";
import { Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import AddMachineDownTimeModal from "./Modals/AddMachineDownTimeModal";
import AddReasonModal from "./Modals/AddReasonModal";
// import { deleteDownTimeEntry, editDownTimeEntry } from "./store/downTimeSlice";
import EditDownTimeModal from "./Modals/EditDownTimeModal";
import { apiGetDownTime } from "../api/api.getdowntime";
import { apiGetQualityRejection } from "../api/api.getqualityrejection";

import { apiDeleteDownTime } from "../api/api.deleteddowntime";
import { Await } from "react-router-dom";
import DefectivePartsReport from "./DefectivePartReport";
import AddNewDefectivePartEntryModal from "./Modals/AddNewDefectivePartEntryModal";
import EditDefectivePartEntryModal from "./Modals/EditDefectivePartEntryModal";
import AddDefectReasonModal from "./Modals/AddDefectReasonModal";
import { apiDeleteQualityRejection } from "../api/QualityRejection/api.deleteqrejection";
import { getDefectivePartReason} from "../api/DefectivePartMaster/getDefectReason";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
    // position: "sticky",
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

function DefectivePartEntry() {


  const getDefctiveApiCaller = async () => {
    try {
      //console.log("get defective caller run");

      const response = await apiGetQualityRejection();
      //console.log("array ", response.data.data);
      if (response.data.data.length > 0) {
        setTableData(response.data.data);
        //console.log(response.data.data);
      }
      else {
        setTableData([])
      }
    } catch (error) {
      setTableData([])
      //console.log(error.message);
    }
  }

  // State variables remain the same
  const [downTimeReasons, setDownTimeReasons] = useState([])
  const [addOpen, setAddOpen] = useState(false);
  const [addDefectReasonModalOpen, setAddDefectReasonModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [downtimeToDelete, setDowntimeToDelete] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [refresh, setRefresh] = useState(false)

  const [defectivePartEditModal, setDefectivePartEditModal] = useState({
    flag: false,
    id: 0,
  });
  const [defectReasons, setDefectReasons] = useState([{}])

  const getDefectReason = async () => {
    try {
      const response = await getDefectivePartReason()
      console.log("defective reason", response.data.data)
      setDefectReasons(response.data.data);
    } catch (error) {
      console.error("error:",error)
    }

  }

  useEffect(() => {
    
  getDefectReason()
   
  }, [])
  

  // Helper function to filter data by shift
  const getShiftData = (shiftName) => {
    return tableData.filter(row => row.shiftName === shiftName);
  }

  // Render shift table function
  const renderShiftTable = (shiftName) => {
    const shiftData = getShiftData(shiftName);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, shiftData.length - page * rowsPerPage);

    return (
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px"
        }}>
          <h2>{shiftName}</h2>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={shiftData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <Box
          sx={{
            maxHeight: "500px",
            overflow: "auto",
            marginBottom: "40px",
          }}
        >
          <TableContainer component={Paper} style={{
            maxHeight: "250px",
          }}>
            <Table
              size="small"
              style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
            >
              <TableHead>
                <TableRow sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <StyledTableCell className="table-cell">Plant Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Line Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Machine Name</StyledTableCell>
                  <StyledTableCell className="table-cell">Defect Count</StyledTableCell>
                  <StyledTableCell className="table-cell">Reason</StyledTableCell>
                  <StyledTableCell className="table-cell">Process Date</StyledTableCell>
                  <StyledTableCell className="table-cell">Created Date</StyledTableCell>
                  <StyledTableCell className="table-cell">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shiftData.length === 0
                  ? Array.from(Array(5).keys()).map((index) => (
                    <StyledTableRow key={index}>
                      {[...Array(8)].map((_, cellIndex) => (
                        <StyledTableCell key={cellIndex}>
                          <Skeleton animation="wave" />
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))
                  : shiftData
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell className="table-cell">{row.plantName}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.lineName}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.displayMachineName}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.rejectionNo}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.reason}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.processDate}</StyledTableCell>
                        <StyledTableCell className="table-cell">{row.createdAt}</StyledTableCell>
                        <StyledTableCell
                          style={{
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                          className="table-cell"
                        >
                          <IconButton
                            onClick={() => {
                              handleEditDowntime(row.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteDowntime(row.id)}
                            style={{ color: "#FF3131" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 }}>
                    <StyledTableCell
                      colSpan={8}
                      style={{ position: "relative" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "-400px",
                          transform: "translateY(-50%)",
                        }}
                      ></div>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    );
  }

  // Existing handler methods remain the same
  const handleDeleteDowntime = (id) => {
    setDowntimeToDelete(id);
  };

  const handleEditDowntime = (id) => {
    setDefectivePartEditModal({
      flag: true,
      id: id,
    });
  };

  const handleCancelDelete = () => {
    setDowntimeToDelete(null);
  };

  const deleteEntryApiCaller = async (id) => {
    try {
      const result = await apiDeleteQualityRejection(id)
      if (result.status === "success") {
        //console.log("deleted successfully")
      }
    } catch (error) {
      //console.log("error deleting ",error)
    }
  }

  const handleConfirmDelete = () => {
    if (downtimeToDelete !== null) {
      setTableData(tableData.filter((item) => item.id !== downtimeToDelete))
      deleteEntryApiCaller(downtimeToDelete)
    }
    setDowntimeToDelete(null)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    getDefctiveApiCaller()
  }, [refresh])
  return (
    <>
      <div style={{ padding: "0px 20px" }}>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px"
          }}
        >
          <Button
            onClick={() => setAddOpen(true)}
            style={{
              background: "#1FAEC5",
              fontWeight: "600",
              borderRadius: "10px",
              color: "white",
              border: "4px solid lightblue",
              padding: "5px 8px 5px 8px",
              marginBottom: "5px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#17A2B8";
              e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#1FAEC5";
              e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
            }}
          >
            Add New &nbsp;
            <FontAwesomeIcon
              style={{ fontSize: "18px", color: "white" }}
              icon={faPlus}
            />
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#1FAEC5", marginBottom: "5px" }}
            onClick={() => {
              setAddDefectReasonModalOpen(true);
            }}
          >
            Add reason
          </Button>
        </div>

        {/* Shift Tables */}
        {renderShiftTable("Morning Shift")}
        <hr />
        {renderShiftTable("Evening Shift")}
        <hr />
        {renderShiftTable("Night Shift")}

        {/* Delete Confirmation Modal */}
        <Modal open={downtimeToDelete !== null} onClose={handleCancelDelete}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" style={{ marginBottom: "20px" }}>
              Are you sure you want to delete this item?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmDelete}
              style={{ marginRight: "10px" }}
            >
              Yes, Delete
            </Button>
            <Button variant="outlined" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </div>
        </Modal>

        {addOpen && <AddNewDefectivePartEntryModal
          addOpen={addOpen}
          setAddOpen={setAddOpen}
          setTableData={setTableData}
          tableData={tableData}
          defectReasons={defectReasons}
          setTableRefresh={setRefresh}
          
          />}

        {addDefectReasonModalOpen && <AddDefectReasonModal
          setAddDefectReasonModalOpen={setAddDefectReasonModalOpen}
          addDefectReasonModalOpen={addDefectReasonModalOpen}
          setDownTimeReasons={setDownTimeReasons}
          defectReasons={defectReasons}
          setDefectReasons={setDefectReasons}
          />}

        {defectivePartEditModal.flag && <EditDefectivePartEntryModal
          defectivePartEditModal={defectivePartEditModal}
          setDefectivePartEditModal={setDefectivePartEditModal}
          defectiveParts={tableData}
          updateDownTime={setTableData}
          setTableRefresh={setRefresh}
          defectReasons={defectReasons}
        />}
      </div>
    </>
  );
}

export default DefectivePartEntry;

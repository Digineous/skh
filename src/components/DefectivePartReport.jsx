import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import Modal from './Modal'
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Typography,  TextField ,IconButton, Box, FormControl, InputLabel, Select, MenuItem, tableCellClasses, styled, TablePagination, Tooltip } from "@mui/material";
import { Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import AddMachineDownTimeModal from "./Modals/AddMachineDownTimeModal";
import AddReasonModal from "./Modals/AddReasonModal";
// import { deleteDefectivePartsEntry, editDefectivePartsEntry } from "./store/downTimeSlice";
import EditDownTimeModal from "./Modals/EditDownTimeModal";
import { apiGetQualityRejection } from "../api/api.getqualityrejection";
import { apiUpdateDTime } from "../api/api.updatedowntime";
import { apiDeleteDownTime } from "../api/api.deleteddowntime";


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

function DefectivePartsReport() {

  useEffect(()=>{
    getDefectiveApiCaller()
  },[])

  const getDefectiveApiCaller = async ()=>{
    try {
      const response = await apiGetQualityRejection();
      console.log("array ",response.data.data);
      if(response.data.data.length > 0)
      {
        setTableData(response.data.data)
      }
      else{
        setTableData([])
      }
    } catch (error) {
      setTableData([]) 
      console.log(error.message);
    }
  }
//   const [addOpen, setAddOpen] = useState(false);
//   const [addReasonModalOpen, setAddReasonModalOpen] = useState(false);
//   const [downtimeData, setDowntimeData] = useState([]);
  const [page, setPage] = useState(0);
//   const [downTimeEditModal, setDownTimeEditModal] = useState({
//     flag: false,
//     id: 0,
//   });
  const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [downtimeToDelete, setDowntimeToDelete] = useState(null);
  const [tableData, setTableData] = useState([]);
    // {
    //   id: 1,
    //   plant_name: "Linamar",
    //   line_name: "line-1",
    //   machine_name: "Machine 1",
    //   employee_name: "E1",
    //   part_no: "KCM99",
    //   part_name: "part-1",
    //   downtime_reason: "test reason",
    //   start_time: "24/12/2024 00:00:00",
    //   end_time: "26/12/2024:00:00",
    //   others: "test",
    //   created_date: "26/12/2024"
    // }
  // ])
//   const handleDeleteDowntime = (id) => {
//     setDowntimeToDelete(id);
//   };
//   const handleEditDowntime = (id) => {
//     setDownTimeEditModal({
//       flag: true,
//       id: id,
//     });
//   };
//   const handleCancelDelete = () => {
//     setDowntimeToDelete(null);
//   };
//   const handleConfirmDelete = () => {
//     if (downtimeToDelete !== null) {
//       setTableData(tableData.filter((item) => item.id !== downtimeToDelete))
//     }
//     setDowntimeToDelete(null)
//   };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

  return (
    <>
      <div style={{ padding: "0px 20px" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20px",
            paddingBottom: "10px",
          }}
        >
          <h2>Defective Part Report</h2>
          <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
            {/* <Button
              variant="contained"
              style={{ backgroundColor: "#1FAEC5", marginBottom: "5px" }}
              onClick={() => {
                setAddReasonModalOpen(true);
              }}
            >
              Add reason
            </Button> */}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Button
            onClick={() => {
              setAddOpen(true);
            }}
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
          </Button> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
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
          <TableContainer component={Paper}>
            <Table
              size="small"
              style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
            >
              <TableHead>
                <TableRow sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <StyledTableCell className="table-cell">
                    Plant Name
                  </StyledTableCell>

                  <StyledTableCell className="table-cell">
                    Line Name
                  </StyledTableCell>

                  <StyledTableCell className="table-cell">
                    Machine Name
                  </StyledTableCell>

                  {/* <StyledTableCell className="table-cell">
                    Part No
                  </StyledTableCell> */}

                  <StyledTableCell className="table-cell">
                    Defect Count
                  </StyledTableCell>

                  <StyledTableCell className="table-cell">
                    Reason
                  </StyledTableCell>

                  <StyledTableCell className="table-cell">
                    Process Date
                  </StyledTableCell>
                  <StyledTableCell className="table-cell">
                    Shift Name
                  </StyledTableCell>
{/*           
                  <StyledTableCell className="table-cell">
                    End Time
                  </StyledTableCell> */}
{/* 
                  <StyledTableCell className="table-cell">
                    Others
                  </StyledTableCell> */}
{/* 
                  <StyledTableCell className="table-cell">
                    Created Date
                  </StyledTableCell> */}
                  {/* <StyledTableCell className="table-cell">
                    Actions
                  </StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length === 0
                  ? Array.from(Array(5).keys()).map((index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                  : tableData
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell className="table-cell">
                          {row.plantName}
                        </StyledTableCell>

                        <StyledTableCell className="table-cell">
                          {row.lineName}
                        </StyledTableCell>

                        <StyledTableCell className="table-cell">
                          {row.machineName}
                        </StyledTableCell>
{/* 
                        <StyledTableCell className="table-cell">
                          {row.partNo}
                        </StyledTableCell> */}

                        <StyledTableCell className="table-cell">
                          {row.sct} {/* Display End Time */}
                        </StyledTableCell>

                        <StyledTableCell className="table-cell">
                          {row.reason} {/* Display Start Time */}
                        </StyledTableCell>

                        <StyledTableCell className="table-cell">
                          {row.processDate}
                        </StyledTableCell>

                        <StyledTableCell className="table-cell">
                          {row.shiftName}
                        </StyledTableCell>

                        
                        {/* <StyledTableCell className="table-cell">
                          {row.rejectionNo}
                          {/* Display tableData Reason *
                        </StyledTableCell> */}
                        

                        
{/* 
                        <StyledTableCell className="table-cell">
                          {row.others} {/* Display Other Information 
                        </StyledTableCell> */}

                        {/* <StyledTableCell className="table-cell">
                          {row.createdAt} {/* Display Created Date *
                        </StyledTableCell> */}

                          {/* <StyledTableCell
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
                            {/* Uncomment to add Delete functionality *
                            <IconButton
                              onClick={() => handleDeleteDowntime(row.id)}
                              style={{ color: "#FF3131" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </StyledTableCell> */}
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
        {/* Delete Confirmation Modal
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
        {addOpen && <AddMachineDownTimeModal setAddOpen={setAddOpen} addOpen={addOpen} setTableData={setTableData} tableData={tableData} />}
        {addReasonModalOpen && <AddReasonModal setAddReasonModalOpen={setAddReasonModalOpen} addReasonModalOpen={addReasonModalOpen} />}

        {downTimeEditModal.flag && <EditDownTimeModal setDownTimeEditModal={setDownTimeEditModal} downTimeEditModal={downTimeEditModal} downTimes={tableData} updateDownTime={setTableData} />} */}

      </div>
    </>
  );
}

export default DefectivePartsReport;

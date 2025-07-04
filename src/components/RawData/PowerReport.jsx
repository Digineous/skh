import React, { useState, useEffect } from "react";
import {
  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Paper,  Button,  Modal,  Typography,TextField,  IconButton,  Box,  FormControl,  InputLabel,  Select,  MenuItem,  tableCellClasses,  styled,  TablePagination,  Tooltip,} from "@mui/material";import { Skeleton } from "@mui/material";
  import { apiGetQualityRejection } from "../../api/api.getqualityrejection";
  import { apiGetCBMRawData } from "../../api/api.getCbmReport";


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

function PowerReport() {
  useEffect(() => {
    getDefectiveApiCaller();
  }, []);

  const getDefectiveApiCaller = async () => {
    try {
      const response = await apiGetCBMRawData();
      //console.log("cbm api responce ",response);
      
      //console.log("array ", response.data.data);
      if (response.data.data.length > 0) {
        setTableData(response.data.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      setTableData([]);
      //console.log(error.message);
    }
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState([]);
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
          <div style={{ paddingTop: "5px", paddingBottom: "5px" }}></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
    </>
  );
}

export default PowerReport;

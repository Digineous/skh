import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Button,
    Modal,
    TextField,
    IconButton,
    FormControl,
    tableCellClasses,
    styled,
    TablePagination,
    Grid,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Styled TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1FAEC5",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        wordWrap: "break-word",
        whiteSpace: "normal",
    },
}));

function AddDefectReasonModal({ addDefectReasonModalOpen, setAddDefectReasonModalOpen, setDownTimeReasons, defectReasons, setDefectReasons }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [reason, setReason] = useState("");
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [reasonToDelete, setReasonToDelete] = useState(null); // Store the reason to be deleted

    setDownTimeReasons(defectReasons)
    const handleInputChange = (e) => {
        setReason(e.target.value);
    };

    const handleAddReason = () => {
        if (reason.trim() !== "") {

            setDefectReasons((prevData) => {
                return [...prevData, { id: prevData.length + 1, reason: reason }]
            })
        }
        setReason("");
    };

    const handleEditReason = (id) => {
        const reasonToEdit = defectReasons.find((r) => r.id === id);
        setReason(reasonToEdit.reason);
        setEditId(id);
    };

    const handleUpdateReason = () => {
        const reasonToUpdate = defectReasons.find((r) => r.id === editId);
        reasonToUpdate.reason = reason;
        resetForm()
    };

    const resetForm = () => {
        setReason("");
        setEditId(null);
    };

    const handleDeleteReason = (id) => {
        setReasonToDelete(id);
    };
    const handleCancelDelete = () => {
        setReasonToDelete(null);
    };
    // Confirm delete action
    const handleConfirmDelete = () => {
        if (reasonToDelete !== null) {
            setDefectReasons(defectReasons.filter((reason) => reason.id !== reasonToDelete))
        }
        setReasonToDelete(null)
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedReasons = defectReasons.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (<>
        <Modal open={addDefectReasonModalOpen} onClose={() => setAddDefectReasonModalOpen(false)}>
            <div
                style={{
                    borderRadius: "10px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    width: isMobile ? "90%" : "500px",
                }}
            >
                <button
                    onClick={() => setAddDefectReasonModalOpen(false)}
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
                <h2>{editId ? "Edit Defect Reason" : "Add Defect Reason"}</h2>
                <hr />
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth >
                            <TextField
                                name="reason"
                                label="Reason"
                                value={reason}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {editId ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateReason}
                            >
                                Update
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddReason}
                            >
                                Add
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TableContainer
                            component={Paper}
                            style={{
                                marginTop: "20px",
                                maxHeight: "200px",
                                overflowY: "auto",
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Reason</StyledTableCell>
                                        <StyledTableCell>Actions</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedReasons.length === 0 ?
                                        <TableRow>
                                            <TableCell colSpan={10} style={{ textAlign: "center" }}>
                                                No Data Available
                                            </TableCell>
                                        </TableRow>
                                        : (
                                            paginatedReasons.map((reason) => (
                                                <TableRow key={reason.id}>
                                                    <TableCell>{reason.reason}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleEditReason(reason.id)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleDeleteReason(reason.id)}
                                                            style={{ color: "#FF3131" }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        <TablePagination
                            component="div"
                            count={defectReasons.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 15]}
                        />
                    </Grid>
                </Grid>
            </div>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal open={reasonToDelete !== null} onClose={handleCancelDelete}>
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
                    Are you sure you want to delete this reason?
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
    </>
    );
}

export default AddDefectReasonModal;

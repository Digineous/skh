import React, { useEffect, useState } from "react";
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
    useTheme
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiGetDownTimeReasons } from "../../api/MachineDownTimeReason/api.getDowntTimeReason";
import { apiAddDownTimeReason } from "../../api/MachineDownTimeReason/api.addDownTimeReason";
import { apiDeleteDownTimeReason } from "../../api/MachineDownTimeReason/api.deleteDownTimeReason";
import { apiUpdateDownTimeReason } from "../../api/MachineDownTimeReason/api.updateDownTimeReason";

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

function AddReasonModal({ addReasonModalOpen, setAddReasonModalOpen, setDownTimeReasons }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [reason, setReason] = useState("");
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [refresh, setRefresh] = useState(false)
    const [reasonToDelete, setReasonToDelete] = useState(null); // Store the reason to be deleted
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [reasons, setReasons] = useState([])
    const [formData, setFormData] = useState({
        reason: "",
        master: "DownTime"
    })
    setDownTimeReasons(reasons)
    const handleInputChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddReason = async () => {
        if (formData.reason.trim() !== "") {
            setReasons((prevReasons) => [...prevReasons, formData]);
            const result = await apiAddDownTimeReason(formData)
            if (result.status === 200) {
                setFormData({
                    reason: "",
                    master: "DownTime"
                })
                setSnackbarMessage("Reason added successfully");
                setSeverity("success");
                setOpenSnackbar(true);

            } else {
                setError("Failed to add reason");
                setSeverity("error");
                setOpenSnackbar(true);
            }
        }
    };

    const handleEditReason = (id) => {
        const reasonToEdit = reasons.find((r) => r.id === id);
        setFormData({ reason: reasonToEdit.reason });
        setEditId(id);
    };

    const handleUpdateReason = async () => {
        const reasonToUpdate = reasons.find((r) => r.id === editId);
        reasonToUpdate.reason = formData.reason;
        const result = await apiUpdateDownTimeReason(reasonToUpdate)
        if (result.status === 200) {
            setFormData({
                reason: "",
                master: "DownTime"
            })
            setSnackbarMessage("Reason updated successfully");
            setSeverity("success");
            setOpenSnackbar(true);
        } else {
            setError("Failed to Update reason");
            setSeverity("error");
            setOpenSnackbar(true);
        }
        resetForm()
    }


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
  const handleConfirmDelete = async () => {
  if (reasonToDelete !== null) {
    // close modal immediately
    const idToDelete = reasonToDelete;
    setReasonToDelete(null);

    // update UI optimistically
    setReasons(reasons.filter((reason) => reason.id !== idToDelete));

    // call API
    const result = await apiDeleteDownTimeReason(idToDelete);

    if (result.status === 200) {
      setSnackbarMessage("Reason deleted successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      setRefresh(true);
    } else {
      setError("Failed to delete reason");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  }
};
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    const paginatedReasons = reasons.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    useEffect(() => {
        const getReasons = async () => {
            try {
                const result = await apiGetDownTimeReasons();
                setReasons(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getReasons();
    }, [refresh]);
    return (<>
        <Modal open={addReasonModalOpen} onClose={() => setAddReasonModalOpen(false)}>
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
                    onClick={() => setAddReasonModalOpen(false)}
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
                <h2>{editId ? "Edit Downtime Reason" : "Add Downtime Reason"}</h2>
                <hr />
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth >
                            <TextField
                                name="reason"
                                label="Reason"
                                value={formData.reason}
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
                            count={reasons.length}
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
    </>
    );
}

export default AddReasonModal;

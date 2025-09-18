import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiAddDownTimeReason } from "../../api/MachineDownTimeReason/api.addDownTimeReason";
import { apiUpdateDownTimeReason } from "../../api/MachineDownTimeReason/api.updateDownTimeReason";
import { apiDeleteDownTimeReason } from "../../api/MachineDownTimeReason/api.deleteDownTimeReason";

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

function AddDefectReasonModal({
  addDefectReasonModalOpen,
  setAddDefectReasonModalOpen,
  setDownTimeReasons,
  defectReasons = [],
  setDefectReasons,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reason, setReason] = useState("");
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reasonToDelete, setReasonToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync local reasons to parent whenever defectReasons changes
  useEffect(() => {
    if (typeof setDownTimeReasons === "function") {
      setDownTimeReasons(defectReasons);
    }
  }, [defectReasons, setDownTimeReasons]);

  const handleInputChange = (e) => {
    setReason(e.target.value);
  };

  // ADD
  const handleAddReason = async () => {
    const trimmed = reason?.trim();
    if (!trimmed) return;

    setLoading(true);
    const body = { reason: trimmed, master: "Defect" };

    try {
      const response = await apiAddDownTimeReason(body);
      // API may return created object in response.data.data — fall back to a generated id
      const created = response?.data?.data ?? { id: Date.now(), reason: trimmed, master: "Defect" };

      setDefectReasons((prev) => [...prev, created]);
      setReason("");
      // Close modal after successful add (you can remove this if you want to keep it open)
      setAddDefectReasonModalOpen(false);
    } catch (err) {
      console.error("Add reason error:", err);
      // optionally show a snackbar here
    } finally {
      setLoading(false);
    }
  };

  // EDIT (prefills input)
  const handleEditReason = (id) => {
    const item = defectReasons.find((r) => r.id === id);
    if (!item) return;
    setReason(item.reason || "");
    setEditId(id);
  };

  // UPDATE
  const handleUpdateReason = async () => {
    if (!editId) return;
    const trimmed = reason?.trim();
    if (!trimmed) return;

    setLoading(true);
    const original = defectReasons.find((r) => r.id === editId);
    if (!original) {
      setLoading(false);
      return;
    }

    const payload = { ...original, reason: trimmed };

    try {
      const response = await apiUpdateDownTimeReason(payload);
      // assume success if no error thrown (or check response.status)
      setDefectReasons((prev) => prev.map((r) => (r.id === editId ? payload : r)));
      resetForm();
      // Close modal after successful update
      setAddDefectReasonModalOpen(false);
    } catch (err) {
      console.error("Update reason error:", err);
      // optionally show a snackbar here
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setReason("");
    setEditId(null);
  };

  // DELETE flow
  const handleDeleteReason = (id) => {
    setReasonToDelete(id);
  };

  const handleCancelDelete = () => {
    setReasonToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (reasonToDelete === null) return;
    setLoading(true);
    const id = reasonToDelete;

    try {
      await apiDeleteDownTimeReason(id);
      // update UI immutably
      setDefectReasons((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete reason error:", err);
      // optionally show a snackbar here
    } finally {
      setLoading(false);
      setReasonToDelete(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedReasons = (defectReasons || []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
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
              <FormControl fullWidth>
                <TextField name="reason" label="Reason" value={reason} onChange={handleInputChange} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              {editId ? (
                <Button variant="contained" color="primary" onClick={handleUpdateReason} disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleAddReason} disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              )}
            </Grid>

            <Grid item xs={12} sm={12}>
              <TableContainer component={Paper} style={{ marginTop: "20px", maxHeight: "200px", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Reason</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedReasons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} style={{ textAlign: "center" }}>
                          No Data Available
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedReasons.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.reason}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEditReason(r.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteReason(r.id)} style={{ color: "#FF3131" }}>
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
          <Button variant="contained" color="primary" onClick={handleConfirmDelete} style={{ marginRight: "10px" }} disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
          <Button variant="outlined" onClick={handleCancelDelete} disabled={loading}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddDefectReasonModal;

// ./Modals/EditDefectivePartEntryModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiUpdateQualityRejection } from "../../api/api.updateqrejection";

function EditDefectivePartEntryModal({
  defectivePartEditModal,
  setDefectivePartEditModal,
  defectiveParts,
  updateDownTime,
  setTableRefresh,
  defectReasons,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    id: "",
    plantNo: "",
    lineNo: "",
    machineNo: "",
    shiftId: "",
    reason: "",
    processDate: "",
    plantName: "",
    lineName: "",
    displayMachineName: "",
    rejectionNo: "",
    partNo: "",
    sct: 0,
  });

  const [plantData, setPlantData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, severity: "info", message: "" });

  const shifts = [
    { id: 1, name: "Morning Shift" },
    { id: 2, name: "Evening Shift" },
    { id: 3, name: "Night Shift" },
  ];

  const filteredMachines = machineData.filter((m) => m.lineNo === formData.lineNo);

  useEffect(() => {
    (async () => {
      try {
        const plants = await apiGetPlant();
        setPlantData(plants?.data?.data || []);
        const lines = await apigetLines();
        setLineData(lines?.data?.data || []);
        const machines = await apigetMachine();
        setMachineData(machines?.data?.data || []);
      } catch (err) {
        console.error("Error fetching master data:", err);
        setSnackbar({ open: true, severity: "error", message: "Failed to load master data" });
      }
    })();
  }, []);

  // populate formData when modal opens or defectiveParts changes
  useEffect(() => {
    if (!defectivePartEditModal?.flag) return;

    const row = defectiveParts.find((item) => item.id === defectivePartEditModal.id);
    if (!row) return;

    // normalize processDate to ISO if possible (supports DD/MM/YYYY or ISO)
    let processDateISO = "";
    if (row.processDate) {
      const ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (typeof row.processDate === "string" && ddmmyyyy.test(row.processDate)) {
        processDateISO = dayjs(row.processDate, "DD/MM/YYYY").isValid()
          ? dayjs(row.processDate, "DD/MM/YYYY").toISOString()
          : "";
      } else {
        processDateISO = dayjs(row.processDate).isValid() ? dayjs(row.processDate).toISOString() : "";
      }
    }

    setFormData({
      id: row.id ?? "",
      plantNo: row.plantNo ?? "",
      lineNo: row.lineNo ?? "",
      machineNo: row.machineNo ?? "",
      shiftId: row.shiftId ?? "",
      reason: row.reason ?? "",
      processDate: processDateISO,
      plantName: row.plantName ?? "",
      lineName: row.lineName ?? "",
      displayMachineName: row.displayMachineName ?? "",
      rejectionNo: row.rejectionNo ?? row.rejectionId ?? "",
      partNo: row.partNo ?? "",
      sct: row.sct ?? 0,
    });
  }, [defectivePartEditModal, defectiveParts]);

  const handleClose = () => {
    setDefectivePartEditModal({ flag: false, id: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, processDate: newValue ? newValue.toISOString() : "" }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        id: formData.id,
        machineNo: formData.machineNo ? Number(formData.machineNo) : null,
        plantNo: formData.plantNo ? Number(formData.plantNo) : null,
        lineNo: formData.lineNo ? Number(formData.lineNo) : null,
        reason: formData.reason ?? "rejected",
        rejectionNo: formData.rejectionNo ?? "",
        processDate: formData.processDate ? dayjs(formData.processDate).format("YYYY-MM-DD") : null,
        shiftId: formData.shiftId ? Number(formData.shiftId) : null,
        partNo: formData.partNo ?? "part1",
        sct: formData.sct ?? 0,
      };

      // Debug: show what we send
      console.log("Updating quality rejection - payload:", payload);

      const res = await apiUpdateQualityRejection(payload);
      console.log("Update API response:", res?.data);

      // Show success if server returns success-ish response
      setSnackbar({ open: true, severity: "success", message: "Updated successfully" });

      if (typeof setTableRefresh === "function") setTableRefresh((prev) => !prev);

      handleClose();
    } catch (err) {
      console.error("Update failed:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Update failed",
      });
    }
  };

  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  if (!defectivePartEditModal?.flag) return null;

  return (
    <>
      <Modal open={defectivePartEditModal.flag} onClose={handleClose} aria-labelledby="edit-modal">
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
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <button
            onClick={handleClose}
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

          <h2>Edit Defective Part</h2>
          <hr />
          <br />

          <Grid container spacing={2}>
            {/* Plant */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plant</InputLabel>
                <Select
                  name="plantNo"
                  value={formData.plantNo ?? ""}
                  label="Plant"
                  onChange={(e) => {
                    const selected = plantData.find((p) => p.plantNo === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      plantNo: selected?.plantNo ?? e.target.value,
                      plantName: selected?.plantName ?? "",
                    }));
                  }}
                >
                  {plantData.map((p) => (
                    <MenuItem key={p.plantNo} value={p.plantNo}>
                      {p.plantName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Line */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Line</InputLabel>
                <Select
                  name="lineNo"
                  value={formData.lineNo ?? ""}
                  label="Line"
                  onChange={(e) => {
                    const selected = lineData.find((l) => l.lineNo === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      lineNo: selected?.lineNo ?? e.target.value,
                      lineName: selected?.lineName ?? "",
                      machineNo: "",
                      displayMachineName: "",
                    }));
                  }}
                >
                  {lineData.map((l) => (
                    <MenuItem key={l.lineNo} value={l.lineNo}>
                      {l.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Machine */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Machine</InputLabel>
                <Select
                  name="machineNo"
                  value={formData.machineNo ?? ""}
                  onChange={(e) => {
                    const selected = filteredMachines.find((m) => m.machineNo === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      machineNo: selected?.machineNo ?? e.target.value,
                      displayMachineName: selected?.displayMachineName ?? "",
                    }));
                  }}
                >
                  {filteredMachines.map((m) => (
                    <MenuItem key={m.machineNo} value={m.machineNo}>
                      {m.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Shift */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Shift</InputLabel>
                <Select
                  name="shiftId"
                  value={formData.shiftId ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shiftId: e.target.value }))}
                >
                  {shifts.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Rejection No (NEW) */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rejection No"
                fullWidth
                name="rejectionNo"
                value={formData.rejectionNo ?? ""}
                onChange={handleInputChange}
                helperText="Edit rejection number if needed"
              />
            </Grid>

            {/* Reason */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reason</InputLabel>
                <Select name="reason" value={formData.reason ?? ""} onChange={handleInputChange}>
                  {(defectReasons || []).map((r, idx) => (
                    <MenuItem key={idx} value={r.reason}>
                      {r.reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Process Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Process Date"
                  value={formData.processDate ? dayjs(formData.processDate) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Update button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleUpdate} style={{ marginTop: "20px" }}>
                Update
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EditDefectivePartEntryModal;

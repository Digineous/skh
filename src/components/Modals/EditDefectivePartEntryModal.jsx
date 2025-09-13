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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiUpdateDTime } from "../../api/api.updatedowntime";

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

  // find row to edit
  const rowData = defectiveParts.find(
    (item) => item.id === defectivePartEditModal.id
  );

  // form state (pre-filled with row data)
  const [formData, setFormData] = useState(
    rowData || {
      id: "",
      plantNo: "",
      lineNo: "",
      machineNo: "",
      shiftId: "",
      defectCount: "",
      reason: "",
      processDate: "",
    }
  );

  const [plantData, setPlantData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);

  const shifts = [
    { id: 1, name: "Morning Shift" },
    { id: 2, name: "Evening Shift" },
    { id: 3, name: "Night Shift" },
  ];

  const filteredMachines = machineData.filter(
    (m) => m.lineNo === formData.lineNo
  );

  useEffect(() => {
    (async () => {
      try {
        const plants = await apiGetPlant();
        setPlantData(plants.data.data);
        const lines = await apigetLines();
        setLineData(lines.data.data);
        const machines = await apigetMachine();
        setMachineData(machines.data.data);
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    })();
  }, []);

  const handleClose = () => {
    setDefectivePartEditModal({ flag: false, id: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      processDate: newValue ? newValue.format("DD/MM/YYYY") : "",
    }));
  };

  const handleUpdate = async () => {
  try {
    await apiUpdateDTime(formData);

    setTableRefresh((prev) => !prev);
    handleClose();
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  if (!rowData) return null;

  return (
    <Modal
      open={defectivePartEditModal.flag}
      onClose={handleClose}
      aria-labelledby="edit-modal"
    >
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
                value={formData.plantNo}
                onChange={(e) => {
                  const selected = plantData.find(
                    (p) => p.plantNo === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    plantNo: selected.plantNo,
                    plantName: selected.plantName,
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
                value={formData.lineNo}
                onChange={(e) => {
                  const selected = lineData.find(
                    (l) => l.lineNo === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    lineNo: selected.lineNo,
                    lineName: selected.lineName,
                    machineNo: "",
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
                value={formData.machineNo}
                onChange={(e) => {
                  const selected = filteredMachines.find(
                    (m) => m.machineNo === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    machineNo: selected.machineNo,
                    displayMachineName: selected.displayMachineName,
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
                value={Number(formData.shiftId) || ""}   // normalize to number
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    shiftId: e.target.value,   // only store id
                  }));
                }}
              >
                {shifts.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
          </Grid>

          {/* Defect Count */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Defect Count"
              fullWidth
              value={formData.defectCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defectCount: e.target.value,
                }))
              }
            />
          </Grid>

          {/* Reason */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Reason</InputLabel>
              <Select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
              >
                {defectReasons.map((r, idx) => (
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
                value={
                  formData.processDate
                    ? dayjs(formData.processDate, "DD/MM/YYYY")
                    : null
                }
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>

          </Grid>

          {/* Update button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpdate}
              style={{ marginTop: "20px" }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}

export default EditDefectivePartEntryModal;

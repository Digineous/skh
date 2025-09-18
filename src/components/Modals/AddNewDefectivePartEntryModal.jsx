import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Grid,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

import { apiAddDownTime } from "../../api/api.adddowntime";
import { apigetMachine } from '../../api/MachineMaster/apigetmachine';
import { apigetLines } from '../../api/LineMaster/api.getline';
import { apiGetPlant } from '../../api/PlantMaster/api.getplant';
import apiQualityRejection from '../../api/QualityRejection/api.addqualityrejection';
import { apiGetQualityRejection } from '../../api/api.getqualityrejection';

function AddNewDefectPartsEntry({ addOpen, setAddOpen, setTableData, tableData, defectReasons, setTableRefresh }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // prefer ISO createdAt
  const currentDateISO = new Date().toISOString();

  const [formData, setFormData] = useState({
    id: tableData.length + 1,
    machineNo: "",
    plantNo: "",
    lineNo: "",
    shiftId: "",
    plantName: "",
    lineName: "",
    displayMachineName: "",
    shiftName: "",
    defectCount: "",
    reason: "",
    processDate: "",        // will store ISO string if selected
    createdAt: currentDateISO,
  });

  const [shifts] = useState([
    { id: 1, name: "Morning Shift" },
    { id: 2, name: "Evening Shift" },
    { id: 3, name: "Night Shift" },
  ]);

  const [plantData, setPlantData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // filtered machines belong to selected line
  const filteredMachines = machineData.filter((m) => m.lineNo === formData.lineNo);

  // Basic snackbar placeholder — replace with your app's snackbar if needed
  const handleSnackbarOpen = (message, severity = "info") => {
    // If you have a global snackbar, call it here. For now we log.
    // Example: enqueueSnackbar(message, { variant: severity })
    // For debugging:
    // console.log(`[${severity}] ${message}`);
  };

  // call quality rejection list whenever refresh toggles (you had this earlier)
  useEffect(() => {
    const fetchRejections = async () => {
      try {
        await apiGetQualityRejection(); // you can use result if needed
      } catch (err) {
        // ignore or show
        handleSnackbarOpen(err?.message || "Error fetching quality rejections", "error");
      }
    };
    fetchRejections();
  }, [refresh]);

  // fetch plant, lines, machines on mount
  useEffect(() => {
    const getPlant = async () => {
      try {
        const result = await apiGetPlant();
        if (result?.data?.data) setPlantData(result.data.data);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      }
    };
    getPlant();
  }, []);

  useEffect(() => {
    const getline = async () => {
      try {
        const result = await apigetLines();
        if (result?.data?.data) setLineData(result.data.data);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      }
    };
    getline();
  }, []);

  useEffect(() => {
    const getmachine = async () => {
      try {
        const result = await apigetMachine();
        if (result?.data?.data) setMachineData(result.data.data);
      } catch (error) {
        handleSnackbarOpen(error.message, "error");
      }
    };
    getmachine();
  }, []);

  const handleModalClose = () => {
    setAddOpen(false);
    // optionally reset formData here if you want fresh state on next open
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // DatePicker provides a Dayjs object — convert to ISO for unambiguous storage
  const handleDateTimeChange = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.toISOString() : '', // ISO string or empty
    }));
  };

  // addMachineDefect -> call your quality rejection API
  const addMachineDefect = async (data) => {
    try {
      const response = await apiQualityRejection(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleAddSubmit = async () => {
    try {
      // build payload with proper types and ISO dates
      const payload = {
        ...formData,
        plantNo: formData.plantNo ? Number(formData.plantNo) : null,
        lineNo: formData.lineNo ? Number(formData.lineNo) : null,
        machineNo: formData.machineNo ? Number(formData.machineNo) : null,
        shiftId: formData.shiftId ? Number(formData.shiftId) : null,
        defectCount: formData.defectCount ? Number(formData.defectCount) : 0,
        createdAt: formData.createdAt || new Date().toISOString(),
        processDate: formData.processDate || null,
      };

      // debug payload before sending
      // console.log("Submitting payload:", payload);

      await addMachineDefect(payload);

      // tell parent to refresh table
      if (typeof setTableRefresh === "function") {
        setTableRefresh(prev => !prev);
      }

      // close modal
      setAddOpen(false);
    } catch (error) {
      handleSnackbarOpen(error?.message || "Failed to add defect", "error");
      console.error("Error on add defect:", error);
    }
  };

  return (
    <>
      <Modal open={addOpen} onClose={handleModalClose}>
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
          <h2>Add Machine Defect</h2>
          <hr />
          <br />

          <Grid container spacing={2}>
            {/* Plant Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plant Name</InputLabel>
                <Select
                  name="plantNo"
                  value={formData.plantNo}
                  label="Plant Name"
                  onChange={(e) => {
                    const selectedPlant = plantData.find((p) => p.plantNo === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      plantNo: selectedPlant ? selectedPlant.plantNo : e.target.value,
                      plantName: selectedPlant ? selectedPlant.plantName : "",
                    }));
                  }}
                >
                  {plantData.map((plant) => (
                    <MenuItem key={plant.plantNo} value={plant.plantNo}>
                      {plant.plantName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Line Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Line Name</InputLabel>
                <Select
                  name="lineNo"
                  value={formData.lineNo}
                  label="Line Name"
                  onChange={(e) => {
                    const selectedLine = lineData.find((l) => l.lineNo === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      lineNo: selectedLine ? selectedLine.lineNo : e.target.value,
                      lineName: selectedLine ? selectedLine.lineName : "",
                      machineNo: "", // reset machine when line changes
                      displayMachineName: "",
                    }));
                  }}
                >
                  {lineData.map((line) => (
                    <MenuItem key={line.lineNo} value={line.lineNo}>
                      {line.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Machine Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Machine Name</InputLabel>
                <Select
                  name="machineNo"
                  value={formData.machineNo}
                  label="Machine Name"
                  onChange={(e) => {
                    const selectedMachine = filteredMachines.find((m) => m.machineNo === e.target.value);
                    if (selectedMachine) {
                      setFormData((prev) => ({
                        ...prev,
                        machineNo: selectedMachine.machineNo,
                        displayMachineName: selectedMachine.displayMachineName,
                      }));
                    } else {
                      setFormData((prev) => ({ ...prev, machineNo: e.target.value, displayMachineName: "" }));
                    }
                  }}
                >
                  {filteredMachines.map((machine) => (
                    <MenuItem key={machine.machineNo} value={machine.machineNo}>
                      {machine.displayMachineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Shift Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Shift Name</InputLabel>
                <Select
                  name="shiftId"
                  value={formData.shiftId}
                  label="Shift Name"
                  onChange={(e) => {
                    const selectedShift = shifts.find((s) => s.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      shiftId: selectedShift ? selectedShift.id : e.target.value,
                      shiftName: selectedShift ? selectedShift.name : "",
                    }));
                  }}
                >
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Defect Count */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Defect Count"
                name="defectCount"
                value={formData.defectCount}
                onChange={(e) => setFormData((prev) => ({ ...prev, defectCount: e.target.value }))}
              />
            </Grid>

            {/* Defect Reason */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Defect Reason</InputLabel>
                <Select
                  name="reason"
                  value={formData.reason}
                  label="Defect Reason"
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                >
                  {defectReasons && defectReasons.map((reasonObj, id) => (
                    <MenuItem key={id} value={reasonObj.reason}>
                      {reasonObj.reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Process Time (Date Picker) */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Process Time"
                  value={formData.processDate || null}
                  onChange={(newValue) => handleDateTimeChange(newValue, 'processDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                onClick={handleAddSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </>
  );
}

export default AddNewDefectPartsEntry;

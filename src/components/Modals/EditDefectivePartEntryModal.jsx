import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Button,
    Modal,
    TextField,
    IconButton,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    tableCellClasses,
    styled,
    TablePagination,
    Tooltip,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { apiUpdateDTime } from '../../api/api.updatedowntime'
import { DatePicker } from '@mui/x-date-pickers';


function EditDefectivePartEntryModal({ defectivePartEditModal, setDefectivePartEditModal, defectiveParts, defectReasons }) {

    const defectivePartToEdit = defectiveParts.find(defectivepart => defectivepart.id === defectivePartEditModal.id);
    const [formData, setFormData] = useState({
        plantName: defectivePartToEdit?.plantName || "",
        lineName: defectivePartToEdit?.lineName || "",
        displayMachineName: defectivePartToEdit?.displayMachineName || "",
        shiftName: defectivePartToEdit?.shiftName || "",
        defectCount: defectivePartToEdit?.defectCount || "",
        reason: defectivePartToEdit?.reason || "",
        processDate: defectivePartToEdit?.processDate || "",
    });

    const [shifts, setShifts] = useState([
        { id: 1, name: "Morning Shift" },
        { id: 2, name: "Evening Shift" },
        { id: 3, name: "Night Shift" },
    ])
    const handleModalClose = () => {
        setDefectivePartEditModal({ flag: false });
        setFormData({
            plantName: "",
            lineName: "",
            displayMachineName: "",
            shiftName: "",
            plantNo: "",
            reason: "",
            startDownDate: "",
            endDownDate: "",
        });
    };

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, // Spread previous state
            [name]: value, // Dynamically update the field based on `name`
        }));
    }

    const updateDownTimeApiCaller = async (reqData) => {
        try {
            const response = await apiUpdateDTime(reqData);
            //console.log(response.data);

        } catch (error) {
            //console.log(error.message);

        }
    }

    const date = new Date()
    const currentDate = date.toLocaleDateString()
    const handleEditDefectivePart = () => {
        defectivePartToEdit.plantName = formData.plantName
        defectivePartToEdit.lineName = formData.lineName
        defectivePartToEdit.displayMachineName = formData.displayMachineName
        defectivePartToEdit.shiftName = formData.shiftName
        defectivePartToEdit.defectCount = formData.defectCount
        defectivePartToEdit.plantNo = formData.plantNo
        defectivePartToEdit.reason = formData.reason
        defectivePartToEdit.processDate = formData.processDate
        // //console.log("defectivepart for edit body....", defectivePartToEdit);
        // defectivePartToEdit.startTime = formData.startDownDate;
        // defectivePartToEdit.endTime = formData.endDownDate;
        // defectivePartToEdit.totalDownTime = "00:30:00";
        // defectivePartToEdit.machineDownDate = formData.startDownDate;

        // const callerRes = updateDownTimeApiCaller(defectivePartToEdit)

        setDefectivePartEditModal({ flag: false })
    }


    const handleDateTimeChange = (newValue, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: newValue?.format('DD/MM/YYYY') || '', // Ensure proper format
        }));
    };
    return (
        <>
            <Modal open={defectivePartEditModal.flag} onClose={handleModalClose}>
                <div
                    style={{
                        borderRadius: "10px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        width: "90%", // Responsive width
                        maxWidth: "600px", // Maximum width for larger screens
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
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
                    <h2>Edit Machine Defect</h2>
                    <hr />
                    <br />

                    <Grid container spacing={2}>
                        {/* Plant Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Plant Name</InputLabel>
                                <Select
                                    name="plantName"
                                    value={formData.plantName}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.plantName}>
                                        {formData.plantName}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Line Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Line Name</InputLabel>
                                <Select
                                    name="lineName"
                                    value={formData.lineName}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.lineName}>
                                        {formData.lineName}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Machine Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Machine Name</InputLabel>
                                <Select
                                    name="displayMachineName"
                                    value={formData.displayMachineName}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.displayMachineName}>
                                        {formData.displayMachineName}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Shift Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Shift Name</InputLabel>
                                <Select
                                    name="shiftName"
                                    value={formData.shiftName}
                                    onChange={handleInputChange}
                                >
                                    {shifts.map((row) => (
                                        <MenuItem key={row.name} value={row.name}>
                                            {row.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Defect Count */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Defect Count"
                                    name="defectCount"
                                    value={formData.defectCount}
                                    onChange={handleInputChange}

                                />
                                {/* <Select
                                    name="defectCount"
                                    value={formData.defectCount}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.defectCount}>
                                        {formData.defectCount}
                                    </MenuItem>
                                </Select> */}
                            </FormControl>
                        </Grid>

                        {/* Downtime Reason */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Downtime Reason</InputLabel>
                                <Select
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                >
                                    {defectReasons.map((reason, id) => (
                                        <MenuItem key={id} value={reason.reason}>
                                            {reason.reason}
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
                                    onChange={(newValue) =>
                                        handleDateTimeChange(newValue, "processDate")
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Update Button */}
                        <Grid item xs={12}>
                            <Button
                                onClick={handleEditDefectivePart}
                                variant="contained"
                                color="primary"
                                style={{ marginTop: "20px" }}
                                fullWidth
                            >
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </>
    )
}

export default EditDefectivePartEntryModal
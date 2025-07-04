import React, { useState } from 'react'
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
    Box,
    FormControl,
    InputLabel,
    Grid,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    tableCellClasses,
    styled,
    TablePagination,
    Tooltip,
} from "@mui/material";
// import { useDispatch, useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { current } from '@reduxjs/toolkit';
import { apiAddDownTime } from "../../api/api.adddowntime";
import { DatePicker } from '@mui/x-date-pickers';


function AddNewDefectPartsEntry({ addOpen, setAddOpen, setTableData, tableData, defectReasons }) {
    const addDownTimeApiCaller = async (newEntry) => {
        try {
            newEntry.plantNo = 2
            newEntry.lineNo = 1
            newEntry.machineNo = 1
            newEntry.endTime = newEntry.endDownDate
            newEntry.startTime = newEntry.startDownDate
            newEntry.machineDownDate = newEntry.startDownDate
            //console.log(newEntry);

            const responce = await apiAddDownTime(newEntry);
        } catch (error) {
            //console.log(error.message);
        }
    }
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // const { reasons } = useSelector(state => state.reason)
    const date = new Date()
    const currentDate = date.toLocaleDateString()
    const [formData, setFormData] = useState({
        id: tableData.length + 1,
        plantName: "Plant-1",
        lineName: "Line-1",
        displayMachineName: "Machine-1",
        shiftName: "",
        defectCount: 1,
        reason: "maintenance",
        processDate: "",
        createdAt: currentDate,
    });
    const [shifts, setShifts] = useState([
        { id: 1, name: "Morning Shift" },
        { id: 2, name: "Evening Shift" },
        { id: 3, name: "Night Shift" },
    ])

    const handleModalClose = () => {
        setAddOpen(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateTimeChange = (newValue, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: newValue?.format('DD/MM/YYYY') || '', // Ensure proper format
        }));
    };
    const handleAddSubmit = () => {
        setTableData((prevData) => [
            ...prevData,
            formData
        ])
        addDownTimeApiCaller(formData)
        setAddOpen(false);
    }
    return (
        <>

            <Modal open={addOpen} onClose={handleModalClose} >
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
                    <h2>Add Machine Defect </h2>
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
                                    <MenuItem value={formData.plantName}>{formData.plantName}</MenuItem>
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
                                    <MenuItem value={formData.lineName}>{formData.lineName}</MenuItem>
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
                                    <MenuItem value={formData.displayMachineName}>{formData.displayMachineName}</MenuItem>
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
                                        <MenuItem key={row.id} value={row.name}>{row.name}</MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Plant No */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Defect Count</InputLabel>
                                <Select
                                    name="defectCount"
                                    value={formData.defectCount}
                                    type='number'
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.defectCount}>
                                        {formData.defectCount}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Downtime Reason */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Defect Reason</InputLabel>
                                <Select
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                >
                                    {/* <MenuItem key="test" value="test">
                                        test
                                    </MenuItem> */}
                                    {defectReasons.map((reason, id) => (
                                        <MenuItem key={id} value={reason.reason}>
                                            {reason.reason}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start DateTime */}
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Process Time"
                                    name="processDate"
                                    onChange={(newValue) => handleDateTimeChange(newValue, 'processDate')}
                                    renderInput={(params) => <TextField {...params} fullWidth
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Add Button */}
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
    )
}
export default AddNewDefectPartsEntry;
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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
import { apiGetPlant } from '../../api/PlantMaster/api.getplant';
import { apigetMachine } from '../../api/MachineMaster/apigetmachine';
import { apigetLines } from '../../api/LineMaster/api.getline';
import { apiGetDownTimeReasons } from '../../api/MachineDownTimeReason/api.getDowntTimeReason';


function EditDownTimeModal({ editOpen, downTimeToEdit, setEditModal, downTimes }) {
    //console.log("hi", editOpen)
    const [plants, setPlants] = useState([])
    const [lines, setLines] = useState([])
    const [machines, setMachines] = useState([])
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [downTimeReasons, setDownTimeReasons] = useState([])
    const [formData, setFormData] = useState({
        plantName: "",
        lineName: "",
        displayMachineName: "",
        shiftName: "",
        plantNo: "",
        reason: "",
        startDownDate: "",
        endDownDate: "",
    });
    useEffect(() => {
        if (downTimeToEdit) {
            setFormData({
                plantName: downTimeToEdit.plantName || "",
                lineName: downTimeToEdit.lineName || "",
                displayMachineName: downTimeToEdit.displayMachineName || "",
                shiftName: downTimeToEdit.shiftName || "",
                plantNo: downTimeToEdit.plantNo || "",
                reason: downTimeToEdit.reason || "",
                startDownDate: downTimeToEdit.startDownDate || "",
                endDownDate: downTimeToEdit.endDownDate || "",
            });
        }
    }, [downTimeToEdit, downTimes]);  // Add `editOpen` and `downTimes` as dependencies to run when these change

    const handleModalClose = () => {
        setEditModal(false);
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
    const handleEditDowntime = () => {
        downTimeToEdit.plantName = formData.plantName
        downTimeToEdit.lineName = formData.lineName
        downTimeToEdit.displayMachineName = formData.displayMachineName
        downTimeToEdit.shiftName = formData.shiftName
        downTimeToEdit.plantNo = formData.plantNo
        downTimeToEdit.reason = formData.reason
        downTimeToEdit.startDownDate = formData.startDownDate
        downTimeToEdit.endDownDate = formData.endDownDate
        //console.log("downtime for edit body....", downTimeToEdit);
        downTimeToEdit.startTime = formData.startDownDate;
        downTimeToEdit.endTime = formData.endDownDate;
        downTimeToEdit.totalDownTime = "00:30:00";
        downTimeToEdit.machineDownDate = formData.startDownDate;

        const callerRes = updateDownTimeApiCaller(downTimeToEdit)

        setEditModal({ flag: false })
    }


    const handleDateTimeChange = (newValue, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: newValue?.format('DD/MM/YYYY HH:mm') || '', // Ensure proper format
        }));
    };
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };
    // Get Plants
    useEffect(() => {
        const getPlants = async () => {
            try {
                const result = await apiGetPlant()
                //console.log("Plants:", result)
                setPlants(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        }
        getPlants()
    }, [])
    // Get Machines
    useEffect(() => {
        const getMachines = async () => {
            try {
                const result = await apigetMachine()
                //console.log("Machines:", result)
                setMachines(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        }
        getMachines()
    }, [])
    // Get Lines
    useEffect(() => {
        const getLines = async () => {
            try {
                const result = await apigetLines();
                //console.log("Lines:", result.data.data);
                setLines(result.data.data);
                // setUpdatedLineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getLines();
    }, []);
    // Get Reasons
    useEffect(() => {
        const getReasons = async () => {
            try {
                const result = await apiGetDownTimeReasons();
                setDownTimeReasons(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getReasons();
    }, []);


    useEffect(() => {
        if (downTimeToEdit) {
            // Try both possible formats
            const startDate = dayjs(downTimeToEdit.startDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);
            const endDate = dayjs(downTimeToEdit.endDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);

            setFormData({
                plantName: downTimeToEdit.plantName || "",
                lineName: downTimeToEdit.lineName || "",
                displayMachineName: downTimeToEdit.displayMachineName || "",
                shiftName: downTimeToEdit.shiftName || "",
                plantNo: downTimeToEdit.plantNo || "",
                reason: downTimeToEdit.reason || "",
                startDownDate: startDate.isValid() ? startDate : null,
                endDownDate: endDate.isValid() ? endDate : null,
            });
        }
    }, [downTimeToEdit, downTimes]);


    return (
        <>
            <Modal open={editOpen} onClose={handleModalClose}>
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
                    <h2>Edit Machine Downtime</h2>
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
                                    {plants.map((row) => (
                                        <MenuItem key={row.plantName} value={row.plantName}>
                                            {row.plantName}
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
                                    name="lineName"
                                    value={formData.lineName}
                                    onChange={handleInputChange}
                                >
                                    {lines.map((row) => (
                                        <MenuItem key={row.lineName} value={row.lineName}>
                                            {row.lineName}
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
                                    name="displayMachineName"
                                    value={formData.displayMachineName}
                                    onChange={handleInputChange}
                                >
                                    {machines.map((row) => (
                                        <MenuItem key={row.displayMachineName} value={row.displayMachineName}>
                                            {row.displayMachineName}
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
                                    name="shiftName"
                                    value={formData.shiftName}
                                    onChange={handleInputChange}
                                >
                                    {["Morning Shift", "Evening Shift", "Night Shift"].map((shift) => (
                                        <MenuItem key={shift} value={shift}>
                                            {shift}
                                        </MenuItem>
                                    ))}

                                </Select>
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
                                    {downTimeReasons.map(({ reason, id }) => (
                                        <MenuItem key={id} value={reason}>
                                            {reason}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start DateTime */}
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {/* <DateTimePicker
                                    label="Start Time"
                                    onChange={(newValue) =>
                                        handleDateTimeChange(newValue, "startDownDate")
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                /> */}
                                <DateTimePicker
                                    label="Start Time"
                                    value={formData.startDownDate} // now Dayjs
                                    onChange={(newValue) => handleDateTimeChange(newValue, "startDownDate")}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* End DateTime */}
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {/* <DateTimePicker
                                    label="End Time"
                                    onChange={(newValue) =>
                                        handleDateTimeChange(newValue, "endDownDate")
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                /> */}

                                <DateTimePicker
                                    label="End Time"
                                    value={formData.endDownDate} // now Dayjs
                                    onChange={(newValue) => handleDateTimeChange(newValue, "endDownDate")}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />

                            </LocalizationProvider>
                        </Grid>

                        {/* Update Button */}
                        <Grid item xs={12}>
                            <Button
                                onClick={handleEditDowntime}
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

export default EditDownTimeModal
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


function EditDownTimeModal({ editOpen, downTimeToEdit, setEditModal, downTimes, setRefreshData }) {
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
        plantNo: "",
        lineNo: "",
        machineNo: "",
        displayMachineName: "",
        shiftName: "",
        reason: "",
        startDownDate: null,
        endDownDate: null,
    });


    useEffect(() => {
        if (downTimeToEdit) {
            const startDate = dayjs(downTimeToEdit.startDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);
            const endDate = dayjs(downTimeToEdit.endDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);

            setFormData({
                lineNo: downTimeToEdit.lineNo || "",
                machineNo: downTimeToEdit.machineNo || "",
                displayMachineName: downTimeToEdit.displayMachineName || "",
                shiftName: downTimeToEdit.shiftName || "",
                plantNo: downTimeToEdit.plantNo || "",
                reason: downTimeToEdit.reason || "",
                startDownDate: startDate.isValid() ? startDate : null,
                endDownDate: endDate.isValid() ? endDate : null,
            });
        }
    }, [downTimeToEdit, downTimes]);

    const handleModalClose = () => {
        setEditModal(false);
        setFormData({
            plantName: "",
            plantNo: "",
            lineNo: "",
            machineNo: "",
            displayMachineName: "",
            shiftName: "",
            reason: "",
            startDownDate: null,
            endDownDate: null,
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


    const getTimeDifference = (start, end) => {
        if (!start || !end) return "00:00:00";

        const startDate = dayjs(start, "DD/MM/YYYY HH:mm");
        const endDate = dayjs(end, "DD/MM/YYYY HH:mm");

        if (!startDate.isValid() || !endDate.isValid()) return "00:00:00";

        const diffInMinutes = endDate.diff(startDate, "minute");
        if (diffInMinutes < 0) return "00:00:00"; // handle invalid

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    };


    const date = new Date()
    const currentDate = date.toLocaleDateString()
    const handleEditDowntime = async () => {
        try {
            const formattedData = {
                ...downTimeToEdit,
                ...formData,
                plantName: formData.plantName,
                lineName: formData.lineName,
                displayMachineName: formData.displayMachineName,
                shiftName: formData.shiftName,
                plantNo: formData.plantNo,
                reason: formData.reason,
                startDownDate: formData.startDownDate ? formData.startDownDate.format("DD/MM/YYYY HH:mm") : "",
                endDownDate: formData.endDownDate ? formData.endDownDate.format("DD/MM/YYYY HH:mm") : "",
                startTime: formData.startDownDate ? formData.startDownDate.format("DD/MM/YYYY HH:mm") : "",
                endTime: formData.endDownDate ? formData.endDownDate.format("DD/MM/YYYY HH:mm") : "",
            };

            const timediff = getTimeDifference(formattedData.startDownDate, formattedData.endDownDate);
            formattedData.totalDownTime = timediff;
            formattedData.machineDownDate = formattedData.startDownDate;

            console.log("Edit payload:", formattedData);

            await updateDownTimeApiCaller(formattedData);
            setRefreshData((prev) => !prev);
            setEditModal(false);
        } catch (error) {
            console.error("Edit failed:", error);
        }
    };



    const handleDateTimeChange = (newValue, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: newValue, // store dayjs directly
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

    const [tempData, setTempdata] = useState({});
    useEffect(() => {
        if (downTimeToEdit) {
            // Try both possible formats
            const startDate = dayjs(downTimeToEdit.startDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);
            const endDate = dayjs(downTimeToEdit.endDownDate, ["DD/MM/YYYY HH:mm", "DD-MMM-YYYY hh:mm A"], true);

            setFormData({
                plantNo: downTimeToEdit.plantNo || "",
                lineNo: downTimeToEdit.lineNo || "",
                machineNo: downTimeToEdit.machineNo || "",   // ✅ here
                shiftName: downTimeToEdit.shiftName || "",
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
                                    name="plantNo"
                                    value={formData.plantNo}
                                    onChange={handleInputChange}
                                >
                                    {plants.map((row) => (
                                        <MenuItem key={row.plantNo} value={row.plantNo}>
                                            {row.plantName}
                                        </MenuItem>
                                    ))}
                                </Select>

                            </FormControl>
                        </Grid>

                        {/* Line Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Line</InputLabel>
                                <Select
                                    name="lineNo"
                                    value={formData.lineNo}
                                    onChange={handleInputChange}
                                >
                                    {lines.map((row) => (
                                        <MenuItem key={row.lineNo} value={row.lineNo}>
                                            {row.lineName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>

                        {/* Machine Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Machine</InputLabel>
                                <Select
                                    name="machineNo"
                                    value={formData.machineNo}
                                    onChange={handleInputChange}
                                >
                                    {machines
                                        .filter((m) => m.lineNo === formData.lineNo)
                                        .map((row) => (
                                            <MenuItem key={row.machineNo} value={row.machineNo}>
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
                                    value={formData.startDownDate}
                                    onChange={(newValue) => handleDateTimeChange(newValue, "startDownDate")}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
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
                                    value={formData.endDownDate}
                                    onChange={(newValue) => handleDateTimeChange(newValue, "endDownDate")}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
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

export default EditDownTimeModal;
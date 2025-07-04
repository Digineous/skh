import React, { useEffect, useState } from 'react'
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
import { apiGetPlant } from '../../api/PlantMaster/api.getplant';
import { apigetLines } from '../../api/LineMaster/api.getline';
import { apigetMachine } from '../../api/MachineMaster/apigetmachine';
import { apiGetDownTimeReasons } from '../../api/MachineDownTimeReason/api.getDowntTimeReason';


function AddMachineDownTimeModal({ addOpen, setAddOpen, setTableData, tableData, setRefreshData }) {
    const [plants, setPlants] = useState([])
    const [lines, setLines] = useState([])
    const [machines, setMachines] = useState([])
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [downTimeReasons, setDownTimeReasons] = useState([])
    const [shifts, setShifts] = useState([
        { id: 1, name: "Morning" },
        { id: 2, name: "Evening" },
        { id: 3, name: "Night" },
    ])
    function parseCustomDateTime(dateTimeString) {
        //console.log(dateTimeString)
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        // Create a Date object using the parsed values
        return new Date(year, month - 1, day, hours, minutes); // Month is 0-based
    }

    const getTimeDifference = async (startDatetime, endDatetime) => {
        // Parse the input date-time strings
        const start = parseCustomDateTime(startDatetime);
        const end = parseCustomDateTime(endDatetime);

        // Validate the parsed Date objects
        if (isNaN(start) || isNaN(end)) {
            throw new Error("Invalid date format. Use 'DD/MM/YYYY HH:mm'.");
        }

        // Calculate the difference in milliseconds
        const diffMs = Math.abs(end - start);

        // Convert milliseconds into hours, minutes, and seconds
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        // Format the result as HH:mm:ss
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Example usage
    const startDatetime = "25/12/2024 07:00";
    const endDatetime = "25/12/2024 08:30";
    //console.log(getTimeDifference(startDatetime, endDatetime)); // Output: "01:30:00"

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
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };
    const addDownTimeApiCaller = async (formData) => {
        try {

            const timediff = await getTimeDifference(formData.startDownDate, formData.endDownDate)

            // newEntry.plantNo = 2
            // newEntry.lineNo = 1
            // newEntry.machineNo = 1
            // newEntry.endTime = newEntry.endDownDate
            // newEntry.startTime = newEntry.startDownDate
            formData.machineDownDate = formData.startTime
            // newEntry.totalDownTime = timediff
            // //console.log(newEntry);
            //console.log("api called")
            const responce = await apiAddDownTime({
                ...formData,
                totalDownTime: timediff

            }
            );
            //console.log(responce)
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
        plantName: "",
        lineNo: null,
        machineNo: null,
        shiftName: "",
        plantNo: 1,
        reason: "",
        startDownDate: "",
        endDownDate: "",
        createdAt: currentDate,
    });

    const handleModalClose = () => {
        setAddOpen(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        //console.log(name, value)

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateTimeChange = (newValue, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: newValue?.format('DD/MM/YYYY HH:mm') || '', // Ensure proper format
        }));
    };
    const handleAddSubmit = () => {
        // setTableData((prevData) => [
        //     ...prevData,
        //     formData
        // ])
        addDownTimeApiCaller(formData)
        setAddOpen(false);
        setRefreshData(true)
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
                    <h2>Machine Downtime </h2>
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
                                        <MenuItem key={row.plantNo} value={row.plantName}>{row.plantName}</MenuItem>
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
                                    onChange={handleInputChange}
                                >
                                    {lines.map((row) => (
                                        <MenuItem key={row.lineNo} value={row.lineNo}>{row.lineName}</MenuItem>
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
                                    onChange={handleInputChange}
                                >
                                    {machines.map((row) => (
                                        <MenuItem key={row.machineNo} value={row.machineNo}>{row.machineName}</MenuItem>
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
                                    {shifts.map((row) => (
                                        <MenuItem key={row.id} value={row.name}>{row.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Plant No */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Plant No</InputLabel>
                                <Select
                                    name="plantNo"
                                    value={formData.plantNo}
                                    type='number'
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={formData.plantNo}>
                                        {formData.plantNo}
                                    </MenuItem>
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
                                    {downTimeReasons.map((reason, id) => (
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
                                <DateTimePicker
                                    label="Start Time"
                                    name="startDownDate"
                                    onChange={(newValue) => handleDateTimeChange(newValue, 'startDownDate')}
                                    renderInput={(params) => <TextField {...params} fullWidth
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* End DateTime */}
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="End Time"
                                    name="endDownDate"
                                    onChange={(newValue) => handleDateTimeChange(newValue, 'endDownDate')}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
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
export default AddMachineDownTimeModal;
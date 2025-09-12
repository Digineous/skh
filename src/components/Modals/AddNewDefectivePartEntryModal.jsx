import React, { useState, useEffect } from 'react';
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
import { apigetMachine } from '../../api/MachineMaster/apigetmachine';
import { apigetLines } from '../../api/LineMaster/api.getline';
import { apiGetPlant } from '../../api/PlantMaster/api.getplant';
import apiQualityRejection from '../../api/QualityRejection/api.addqualityrejection';
import { apiGetQualityRejection } from '../../api/api.getqualityrejection';


function AddNewDefectPartsEntry({ addOpen, setAddOpen, setTableData, tableData, defectReasons,setTableRefresh }) {


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
        processDate: "",
        createdAt: currentDate,
    });
    const [shifts, setShifts] = useState([
        { id: 1, name: "Morning Shift" },
        { id: 2, name: "Evening Shift" },
        { id: 3, name: "Night Shift" },
    ])
    const [refresh, setRefresh] = useState(false);
    const [plantData, setPlantData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [machineData, setMachineData] = useState([]);
    const [error, setError] = useState(null);
    const filteredMachines = machineData.filter(
        (m) => m.lineNo === formData.lineNo
    );

    useEffect(() => {
       apiGetQualityRejection();
    }, [refresh]); // runs every time refresh changes

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
    const addMachineDefect = async (data) => {
        try {
            const response = await apiQualityRejection(data);
            console.log("save in api ", response.data);
        } catch (error) {
            console.error("error :", error)
        }

    }
    const handleAddSubmit = async () => {
        try {
             
        await addMachineDefect(formData);


         // Trigger refresh in parent
        setTableRefresh(prev => !prev); // <-- use the function from parent

        // Close the modal
        setAddOpen(false);
        } catch (error) {
            console.error("Error:",error)
        }
       
    }

    useEffect(() => {
        const getPlant = async () => {
            try {
                const result = await apiGetPlant();
                // console.log("Result data plant:", result.data.data);
                setPlantData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getPlant();
    }, []);
    useEffect(() => {
        const getline = async () => {
            try {
                const result = await apigetLines();
                // console.log("Result data line:", result.data.data);
                setLineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getline();
    }, []);
    useEffect(() => {
        const getmachine = async () => {
            try {
                // const result = await apigetMachine();
                const result = await apigetMachine()
                // console.log("Result data machine:", result.data.data);
                setMachineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getmachine();
    }, []);
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
                                    name="plantNo"
                                    value={formData.plantNo}
                                    onChange={(e) => {
                                        const selectedPlant = plantData.find(
                                            (p) => p.plantNo === e.target.value
                                        );
                                        setFormData((prev) => ({
                                            ...prev,
                                            plantNo: selectedPlant.plantNo,
                                            plantName: selectedPlant.plantName,
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
                        {/* Line Name */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Line Name</InputLabel>
                                <Select
                                    name="lineNo"
                                    value={formData.lineNo}
                                    onChange={(e) => {
                                        const selectedLine = lineData.find(
                                            (l) => l.lineNo === e.target.value
                                        );
                                        setFormData((prev) => ({
                                            ...prev,
                                            lineNo: selectedLine.lineNo,
                                            lineName: selectedLine.lineName,
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
                                    onChange={(e) => {
                                        const selectedMachine = filteredMachines.find(
                                            (m) => m.machineNo === e.target.value
                                        );
                                        if (selectedMachine) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                machineNo: selectedMachine.machineNo,
                                                displayMachineName: selectedMachine.displayMachineName,
                                            }));
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
                                    onChange={(e) => {
                                        const selectedShift = shifts.find((s) => s.id === e.target.value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            shiftId: selectedShift.id,
                                            shiftName: selectedShift.name,
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


                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Defect Count"
                                value={formData.defectCount}
                                onChange={(e) => (setFormData((prev) => ({
                                    ...prev, defectCount: e.target.value
                                })))}

                            />
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
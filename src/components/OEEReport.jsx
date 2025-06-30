import React, { useEffect, useState } from "react";
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    TextField,
    Button,
    Grid,
    TablePagination,
    CircularProgress,
    Tabs,
    tableCellClasses,
    styled,
    Tab,
    Typography,
} from "@mui/material";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { format, parseISO } from "date-fns";
import { apiGetRawData } from "../api/api.getMachineRawData";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";
import { standardDashboardApi } from "../api/standardDasboardApi";
import BackButton from "./backbutton";
import DownloadReport from "../utils/DownloadReport";
import { Key } from "lucide-react";
import DownloadIcon from '@mui/icons-material/Download';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1FAEC5",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
const getCurrentDateTime = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};


const cbmRawData = [
    { label: "Date Time ", key: "datetimeRecvd" },
    { label: "Velocity X", key: "velocityX" },
    { label: "Velocity Y", key: "velocityY" },
    { label: "Velocity Z", key: "velocityZ" },
    { label: "Temparature", key: "temperature" },
    { label: "Acceleration X", key: "accelerationX" },
    { label: "Acceleration Y", key: "accelerationY" },
    { label: "Acceleration Z", key: "accelerationZ" },
    { label: "Noise", key: "noise" },
    { label: "RPM", key: "rpm" },

];

const powerRawDataType1 = [
    { label: "Date Time ", key: "datetimeRecvd" },
    { label: "Current R", key: "currentR" },
    { label: "Current Y", key: "currentY" },
    { label: "Current B", key: "currentB" },
    // { label: "Current ThdB", key: "currentThdB" },
    // { label: "Current ThdR", key: "currentThdR" },
    // { label: "Current ThdY", key: "currentThdY" },
    { label: "Voltage R", key: "voltageR" },
    { label: "Voltage Y", key: "voltageY" },
    { label: "Voltage B", key: "voltageB" },
    { label: "Frequency", key: "frequency" },
    // { label: "Voltage ThdB", key: "voltageThdB" },
    // { label: "Voltage ThdR", key: "voltageThdR" },
    // { label: "Voltage ThdY", key: "voltageThdY" },
    { label: "Active Energy", key: "kwh" },
    // { label: "Active Power", key: "activePower" },
    // { label: "Demand Active Power", key: "demandActivePower" },
    // { label: "Export Energy", key: "exportEnergy" },
    // { label: "Import Energy", key: "importEnergy" },
    // { label: "Reactive Lag", key: "reactiveLag" },
    // { label: "Reactive Lead", key: "reactiveLead" },
    { label: "P F", key: "powerFactor" },
];

const powerRawDataType2 = [
    { label: "Date Time ", key: "dateTime" },
    { label: "Current Y", key: "currentY" },
    { label: "Voltage R", key: "voltageR" },
    { label: "Voltage Y", key: "voltageY" },
    { label: "Voltage B", key: "voltageB" },
    { label: "Active Energy", key: "activeEnergy" },
    { label: "Active Power", key: "activePower" },
    { label: "Demand Active Power", key: "demandActivePower" },
    { label: "Projected Energy Consumption", key: "projectedEnergyConsumption" },
    { label: "Reactive Lag", key: "reactiveLag" },
    { label: "Reactive Lead", key: "reactiveLead" },
    { label: "P F", key: "powerFactor" },
];

const operationRawData = [
    { label: "Device", key: "deviceName" },
    { label: "Part Name", key: "partName" },
    { label: "Date Time ", key: "dateTime" },
    { label: "Actual Production", key: "actualProduction" },
    { label: "Target", key: "target" },
    { label: "Gap", key: "gap" },
    { label: "OEE", key: "oee" },
    { label: "Quality", key: "quality" },
    { label: "Availability", key: "availability" },
    { label: "Performance", key: "performance" },
    { label: "Utilization", key: "utilization" },
    { label: "Down Time", key: "downtime" },
    { label: "Run Time (Min)", key: "runtimeInMins" },
    { label: "Cycle Time", key: "cycleTime" },
    { label: "Breakdown Time", key: "breakdownTime" },
    { label: "Defects", key: "defects" },
];

const dieselGenset = [
    { label: "Date Time ", key: "dateTime" },
    { label: "Generator", key: "deviceName" },
    { label: "Engine Speed (RPM)", key: "engineSpeed" },
    { label: "Run Time (Min)", key: "runningHours" },
    { label: "Line Current (A)", key: "loadCurrent" },
    { label: "Active Power", key: "activePower" },
    { label: "Total KVA", key: "apparentPower" },
    { label: "Energy Gen. (KWH)", key: "hourlyMetrics.powerGeneratedPerHour" },
    { label: "Battery Voltage (V)", key: "batteryVoltage" },
    { label: "Coolant Temparature (°C)", key: "coolantTemperature" },
    { label: "Oil Pressure (Bar)", key: "oilPressure" },
    { label: "Line Voltage (V)", key: "loadVoltage" },
    { label: "Alternator Temperature (°C)", Key: "velocityMetrics.temperature" },
    { label: "Alternator Viberations DE (mm/sec)", Key: "velocityMetrics.velocityX" }
];

export default function OEEReport() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [rawData, setRawData] = useState({
        machineNo: "18",
        fromDate: getCurrentDateTime(),
        toDate: getCurrentDateTime(),
    });
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedTab, setSelectedTab] = useState(0);
    const [machineData, setMachineData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [totalThresholdData, setTotalThresholdData] = useState([]);
    const [blastFurnaceData, setBlastFurnaceData] = useState([]);
    const [selectedLine, setSelectedLine] = useState("");
    const [selectedSensor, setSelectedSensor] = useState("");
    const [selectedMachine, setSelectedMachine] = useState("");
    const [machineId, setMachineId] = useState("");
    const [id, setId] = useState("");
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRawData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleLineChange = (event) => {
        setSelectedLine(event.target.value);
        setSelectedSensor("");
    };
    const handleMachineChange = (event) => {
        setSelectedMachine(event.target.value);
        setSelectedSensor("");
    };
    const handleTabChange = (event, newValue) => {
        event.preventDefault();
        setSelectedTab(newValue);
    };

    useEffect(() => {
        const getMachines = async () => {
            try {
                const result = await apigetMachine();
                console.log("result of api machine data", result.data.data);
                setMachineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error in machine data");
            }
        };
        getMachines();
    }, []);


    const handleAddSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {

            const formattedFromDate = format(parseISO(rawData.fromDate), "dd-MMM-yyyy HH:mm:ss");
            const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy HH:mm:ss");
            const formattedRawData = {
                deviceNo: rawData.machineNo,
                fromDate: formattedFromDate,
                toDate: formattedToDate,
            };
            let result;
            // console.log("formated data: ",formattedRawData);
            if (selectedTab === 0) {
                console.log("Formatted Data: ", formattedRawData);
                result = await standardDashboardApi.getOeeReport(formattedRawData);
                console.log("result of api: ", result.data.data);
                handleSnackbarOpen("Data fetched successfully!", "success");
                setData(result.data.data);
            }
        } catch (error) {
            console.error("error raw data:", error);
            handleSnackbarOpen("Error fetching data. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 25));
        setPage(0);
    };
    const handleSensorChange = (event) => {
        console.log("Selected Sensor:", event.target.value);
        setSelectedSensor(event.target.value);
    };
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const formattedFromDate = format(parseISO(rawData.fromDate), "dd-MMM-yyyy");
    const formattedToDate = format(parseISO(rawData.toDate), "dd-MMM-yyyy");
    const formattedRawData = {
        deviceNo: "44",
        fromDate: formattedFromDate,
        endDate: formattedToDate,
    };
    const fields = operationRawData;
    const handleDownloadOperation = () => {
        const dataArray = Array.isArray(data) ? data : [data];

        const formattedData = dataArray.map((row) => ({
            "Date Time": row.dateTime ?? "",
            "Part Name": row.partName ?? "",
            "Device": row.deviceName ?? "",
            "Actual Production": row.actualProduction ?? "",
            "Target": row.target ?? "",
            "Gap": row.gap ?? "",
            "OEE": row.oee ?? "",
            "Quality": row.quality ?? "",
            "Availability": row.availability ?? "",
            "Performance": row.performance ?? "",
            "Utilization": row.utilization ?? "",
            "Down Time": row.downtime ?? "",
            "Run Time (Min)": row.runtimeInMins ?? "",
            "Cycle Time": row.cycleTime ?? "",
            "Defects": row.defects ?? "",
            "Breakdown Time": row.breakdownTime ?? "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "OEE Report");
        XLSX.writeFile(workbook, "OEE_Report.xlsx");
    };

    const handleDownloadPowerData = () => {
        const apiCall = () =>
            apiGetRawData(formattedRawData);
        const formatData = (data) => {
            const dataArray = Array.isArray(data) ? data : [data];
            return dataArray.map((row) => ({
                "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "0",
                "Voltage R ": row.voltageR != null ? row.voltageR : "0",
                "Voltage Y": row.voltageY != null ? row.voltageY : "0",
                "Voltage B": row.voltageB != null ? row.voltageB : "0",
                "Current R": row.currentR != null ? row.currentR : "0",
                "Current Y": row.currentY != null ? row.currentY : "0",
                "Current B": row.currentB != null ? row.currentB : "0",
                "Frequency": row.frequency != null ? row.frequency : "0",
                "P F": row.pf != null ? row.pf : "0",
                "Active Energy": row.kwh != null ? row.kwh : "0",
            }));
        };
        return { apiCall, formatData, fileName: "Power_Data_Report.xlsx" };
    };


    const handleDownloadDG = () => {
        const apiCall = () =>
            apiGetRawData(formattedRawData);
        const formatData = (data) => {
            const dataArray = Array.isArray(data) ? data : [data];
            return dataArray.map((row) => ({
                "Date Time": row.datetimeRecvd != null ? row.datetimeRecvd : "",
                "Velocity X": row.velocityX != null ? row.velocityX : "",
                "Velocity Y": row.velocityY != null ? row.velocityY : "",
                "Velocity Z": row.velocityZ != null ? row.velocityZ : "",
                "Temparature": row.temparature != null ? row.temparature : "",
                "Acceleration X": row.accelerationX != null ? row.accelerationX : "",
                "Acceleration Y": row.accelerationY != null ? row.accelerationY : "",
                "Acceleration Z": row.accelerationZ != null ? row.accelerationZ : "",
                "Noise": row.noise != null ? row.noise : "",
                "RPM": row.rpm != null ? row.rpm : "",
            }));
        };
        return { apiCall, formatData, fileName: "Operation_Report.xlsx" };
    };

    return (
        <div style={{ padding: "0px 20px", width: "100%", marginTop: "20px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background:
                        "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
                    padding: "5px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    color: "white",
                }}
            >
                <BackButton background={"transparent"} iconColor="#fff" />
                <Typography
                    variant="h5"
                    style={{
                        fontWeight: "bold",
                        color: "#fff",
                    }}
                >
                    OEE Report
                </Typography>
            </div>

            <Grid
                container
                spacing={2}
                style={{ width: "100%", alignItems: "center", marginTop: "10px" }}
            >
                <>
                    <Grid item xs={3} sm={3}>
                        <FormControl sx={{ minWidth: 250 }}>
                            <TextField
                                label="Start Date & Time"
                                name="fromDate"
                                type="datetime-local"
                                value={rawData.fromDate}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <FormControl sx={{ minWidth: 250 }}>
                            <TextField
                                label="End Date & Time"
                                name="toDate"
                                type="datetime-local"
                                value={rawData.toDate}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={3}>
                        <FormControl
                            variant="outlined"
                            sx={{ minWidth: 200, marginRight: 1 }}
                        >
                            <InputLabel>Select Machine</InputLabel>
                            <Select
                                value={rawData.machineNo}
                                name="machineNo"
                                label="Machine"
                                onChange={handleInputChange}
                            >
                                {
                                    machineData.map((machine) => {
                                        return (
                                            <MenuItem key={machine.machineId} value={machine.machineId}>
                                                {machine.displayMachineName}
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid style={{ textAlign: "center", marginTop: "10px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddSubmit}
                        >
                            OK
                        </Button>
                    </Grid>
                </>
            </Grid>
            <Grid
                container
                spacing={2}
                alignItems="end"
                justifyContent="flex-end" // aligns content to the right
                style={{ width: "100%", marginTop: "10px" }}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadOperation}
                        startIcon={<DownloadIcon />}
                        sx={{ color: '#fff' }} // white text
                    >
                        Download Report
                    </Button>
                </Grid>
            </Grid>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Box sx={{ marginTop: "0px", maxHeight: "400px", overflow: "auto" }}>
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            marginTop: "0px",
                            marginBottom: '30px'
                        }}
                    >
                        <Table>
                            <TableHead style={{ position: 'sticky', zIndex: '1000', top: 0, }}>
                                <TableRow>
                                    {fields.map((field) => (
                                        <StyledTableCell key={field.key}>
                                            {field.label}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(data.length
                                    ? data.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    : Array.from(Array(rowsPerPage).keys())
                                ).map((row, index) => (
                                    <StyledTableRow key={index}>
                                        {fields.map((field) => (
                                            <StyledTableCell key={field.key}>
                                                {row[field.key] || "0"}
                                            </StyledTableCell>
                                        ))}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setOpenSnackbar(false)}
                    severity={severity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

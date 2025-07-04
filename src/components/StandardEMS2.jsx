import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Modal,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { Maximize2 } from "lucide-react";
import {
  ComposedChart,
  LineChart,
  AreaChart,
  BarChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { standardDashboardApi } from "../api/standardDasboardApi";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";
import { Link } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CachedIcon from '@mui/icons-material/Cached';

dayjs.extend(customParseFormat); // moved after all import statements

const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload, dataKey } = props;

  // Different point styles for R, Y, B lines
  const getPointStyle = (dataKey) => {
    switch (true) {
      case dataKey === 'currentR' || dataKey === 'voltageR':
        return (
          <path
            d="M12 2L2 7l10 5 10-5-10-5z"
            transform={`translate(${cx - 6},${cy - 6}) scale(0.5)`}
            fill={stroke}
          />
        );
      case dataKey === 'currentY' || dataKey === 'voltageY':
        return (
          <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={stroke}
          />
        );
      case dataKey === 'currentB' || dataKey === 'voltageB':
        return (
          <polygon
            points={`${cx},${cy - 5} ${cx - 5},${cy + 5} ${cx + 5},${cy + 5}`}
            fill={stroke}
          />
        );
      default:
        return <circle cx={cx} cy={cy} r={4} fill={stroke} />;
    }
  };

  return getPointStyle(dataKey);
};

// ChartPaper component with maximize button
const ChartPaper = ({ title, children, onMaximize }) => (
  <Paper
    elevation={3}
    sx={{
      p: 0.5,
      height: 400,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
        bgcolor: "#24bbd3",
        borderRadius: "5px",
      }}
    >
      <Typography sx={{ color: "black", fontWeight: "bold" }}>
        {title}
      </Typography>
      <IconButton
        onClick={onMaximize}
        size="small"
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Maximize2 size={20} />
      </IconButton>
    </Box>
    <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
  </Paper>
);

const ChartModal = ({ open, handleClose, title, children }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="chart-modal-title"
    aria-describedby="chart-modal-description"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "80%",
        bgcolor: "rgba(255, 255, 255, 0.9)",
        border: "2px solid #000",
        boxShadow: 24,
        borderRadius: "20px",
        p: 4,
      }}
    >
      <Typography
        id="chart-modal-title"
        variant="h5"
        component="h2"
        color="#171756"
      >
        {title}
      </Typography>
      <Box sx={{ mt: 2, height: "calc(100% - 60px)" }}>{children}</Box>
    </Box>
  </Modal>
);

export default function StandardEMS2() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalContent1, setModalContent1] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    consumption: [],
    hourlyConsumption: [],
    graphDetail: []
  });
  const [energyData, setEnergyData] = useState({});
  const [energyDataNR, setEnergyDataNR] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [emsData, setEMSData] = useState([]);
  const [emsDataNR, setEMSDataNR] = useState([]);
  const [machineNo, setMachineNo] = useState(0);
  const [monthlyEnergyData, setMonthlyEnergyData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [box, setBox] = useState([]);

  // useEffect(() => {
  //   getUserId();
  // }, []);

  // useEffect(() => {
  //   if (deviceNo !== 0) {
  //     handleRefresh();
  //   }
  // }, [deviceNo]);

  // useEffect(() => {
  //   if (deviceNo !== 0) {
  //     const timer = setTimeout(() => {
  //       handleRefresh();
  //     }, 5 * 60 * 1000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [deviceNo]);

  // const getUserId = () => {
  //   const userID = localStorage.getItem("userID");
  //   //console.log(userID);
  //   if (userID === "aura_laser") {
  //     setDeviceNo(43);
  //   }
  //   else if (userID === "gayatree_polymers") {
  //     setDeviceNo(2);
  //   }
  //   else if (userID === "jyoti_solutions") {
  //     setDeviceNo(44);
  //   }
  // };

  useEffect(() => {
    getMachine();
  }, [])

  const getMachine = async () => {
    try {
      const result = await apigetMachine();
      //console.log("Machine Result:", result.data.data);
      setMachineData(result.data.data);
    }
    catch (error) {
      setError(error.message || "An error occurred while fetching data");
      console.error("Error getting EMS data:", error);
    }
  };

  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined || isNaN(number)) return "0.00";

    const parts = parseFloat(number).toFixed(2).split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  };

  const handleSubmit = () => {
    const data = {
      deviceNo: "",
      lineNo: "",
      machineNo: machineNo,
      plantNo: "",
    }
    getStandardEMSData(data, machineNo);
    //console.log("Data:", data);
  };

  const handleRefresh = () => {
    setFromDate();
    setToDate();
    const data = {
      deviceNo: "",
      lineNo: "",
      machineNo: machineNo,
      plantNo: "",
    }
    getStandardEMSData(data, machineNo);
    //console.log("Data:", data);
  };

  const handleDailyView = () => {
    // navigate("/dailyreportview")
  };

  const getStandardEMSData = async (data, id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await standardDashboardApi.getStandardEMS(data);
      const response2 = await standardDashboardApi.getMonthlyEnergyData(id)
      //console.log("Full Api:", response.data.data);
      const emsData = response.data.data[0].emsDashboard.hourlyConsumption;
      const energyData = response.data.data[0].emsDashboard.graphDetail;
      const box = response.data.data[0].emsDashboard.consumption;
      //console.log("EMS Data:", emsData);
      setEMSData(emsData);
      setEnergyData(energyData);
      setBox(box);
      //console.log("Monthly Api:", response2.data.data)
      setMonthlyEnergyData(response2.data.data)
      // const reverseApiData = emsData.slice().reverse();
      // setEMSDataNR(reverseApiData);
    } catch (error) {
      setError(error.message || "An error occurred while fetching data");
      console.error("Error getting EMS data:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const prepareHourlyConsumptionData = () => {
    const dataArray = Array.isArray(emsData)
      ? emsData
      : emsData && Array.isArray(emsData)
        ? energyData
        : [];
    return dataArray.map(item => ({
      hour: formatXAxis(item.date),
      consumption: parseFloat(item.hourlyKwh),
      powerFactor: parseFloat(item.hourlyPf)
    }));
  };

  const prepareVoltageData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData.data)
        ? energyData.data
        : [];
    return dataArray
      .filter(item => {
        const minutes = new Date(item.dateTime).getMinutes();
        return minutes % 10 === 0;
      })
      .map(item => ({
        time: formatXAxis(item.dateTime),
        voltageR: parseFloat(item.voltageR),
        voltageY: parseFloat(item.voltageY),
        voltageB: parseFloat(item.voltageB)
      }));
  };

  const prepareFilteredVoltageData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData.data)
        ? energyData.data
        : [];

    const filteredData = dataArray
      .filter(item => {
        const minutes = new Date(item.dateTime).getMinutes();
        return minutes % 5 === 0;
      })
      .map(item => ({
        time: formatXAxis(item.dateTime),
        voltageR: parseFloat(item.voltageR),
        voltageY: parseFloat(item.voltageY),
        voltageB: parseFloat(item.voltageB)
      }));

    return filteredData.slice(-12);
  };

  const prepareCurrentData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData)
        ? energyData
        : [];
    return dataArray.filter(item => {
      const minutes = new Date(item.dateTime).getMinutes();
      return minutes % 10 === 0;
    }).map(item => ({
      time: formatXAxis(item.dateTime),
      currentR: parseFloat(item.currentR),
      currentY: parseFloat(item.currentY),
      currentB: parseFloat(item.currentB)
    }));
  };

  const prepareFilteredCurrentData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData)
        ? energyData
        : [];
    const filteredData = dataArray.filter(item => {
      const minutes = new Date(item.dateTime).getMinutes();
      return minutes % 5 === 0;
    }).map(item => ({
      time: formatXAxis(item.dateTime),
      currentR: parseFloat(item.currentR),
      currentY: parseFloat(item.currentY),
      currentB: parseFloat(item.currentB)
    }));

    return filteredData.slice(-12);
  };

  const prepareLeadLagData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData)
        ? energyData
        : [];
    return dataArray.map(item => ({
      time: formatXAxis(item.dateTime),
      reactiveLag: parseFloat(item.reactiveLag),
      reactiveLead: parseFloat(item.reactiveLead)
    }));
  };

  const prepareImportExportData = () => {
    const dataArray = Array.isArray(energyData)
      ? energyData
      : energyData && Array.isArray(energyData)
        ? energyData
        : [];
    return dataArray.map(item => ({
      time: formatXAxis(item.dateTime),
      import: parseFloat(item.importEnergy),
      export: parseFloat(item.exportEnergy)
    }));
  };

  const prepareHarmonicCurrentData = () => {
    // const dataArray = Array.isArray(energyData)
    //   ? energyData
    //   : energyData && Array.isArray(energyData)
    //     ? energyData
    //     : [];
    // return dataArray.filter(item => {
    //   const minutes = new Date(item.dateTime).getMinutes();
    //   return minutes % 10 === 0;
    // }).map(item => ({
    //   time: formatXAxis(item.dateTime),
    //   currentThdR: parseFloat(item.currentThdR),
    //   currentThdY: parseFloat(item.currentThdY),
    //   currentThdB: parseFloat(item.currentThdB),
    // }));

    return 0;
  };

  const prepareHarmonicFilteredCurrentData = () => {
    // const dataArray = Array.isArray(energyData)
    //   ? energyData
    //   : energyData && Array.isArray(energyData)
    //     ? energyData
    //     : [];
    // const filteredData = dataArray.filter(item => {
    //   const minutes = new Date(item.dateTime).getMinutes();
    //   return minutes % 5 === 0;
    // }).map(item => ({
    //   time: formatXAxis(item.dateTime),
    //   currentThdR: parseFloat(item.currentThdR),
    //   currentThdY: parseFloat(item.currentThdY),
    //   currentThdB: parseFloat(item.currentThdB),
    // }));

    return 0;
  };

  const prepareHarmonicVoltageData = () => {
    // const dataArray = Array.isArray(energyData)
    //   ? energyData
    //   : energyData && Array.isArray(energyData)
    //     ? energyData
    //     : [];
    // return dataArray.filter(item => {
    //   const minutes = new Date(item.dateTime).getMinutes();
    //   return minutes % 10 === 0;
    // }).map(item => ({
    //   time: formatXAxis(item.dateTime),
    //   voltageThdR: parseFloat(item.voltageThdR),
    //   voltageThdY: parseFloat(item.voltageThdY),
    //   voltageThdB: parseFloat(item.voltageThdB),
    // }));
    return 0;
  };

  const prepareFilteredHarmonicVoltageData = () => {
    // const dataArray = Array.isArray(energyData)
    //   ? energyData
    //   : energyData && Array.isArray(energyData)
    //     ? energyData
    //     : [];
    // const filteredData = dataArray.filter(item => {
    //   const minutes = new Date(item.dateTime).getMinutes();
    //   return minutes % 5 === 0;
    // }).map(item => ({
    //   time: formatXAxis(item.dateTime),
    //   voltageThdR: parseFloat(item.voltageThdR),
    //   voltageThdY: parseFloat(item.voltageThdY),
    //   voltageThdB: parseFloat(item.voltageThdB),
    // }));

    return 0;
  };

  const prepareReactiveEnergy = () => {
    const dataArray = Array.isArray(monthlyEnergyData)
      ? monthlyEnergyData
      : monthlyEnergyData && Array.isArray(monthlyEnergyData.data)
        ? monthlyEnergyData.data
        : [];
    return dataArray.map(item => ({
      time: item.months,
      monthlyKvarhLag: item.monthlyKvarhLag,
      monthlyKvarhLead: item.monthlyKvarhLead,
      truePowerFactor: item.truePowerFactor,
      disPowerFactor: item.disPowerFactor,
    }));
  };

  const prepareMonthlyKWH = () => {
    const dataArray = Array.isArray(monthlyEnergyData)
      ? monthlyEnergyData
      : monthlyEnergyData && Array.isArray(monthlyEnergyData.data)
        ? monthlyEnergyData.data
        : [];
    return dataArray.map(item => ({
      time: item.months,
      monthlyKWH: item.monthlyKwh,
    }));
  };

  const handleOpenModal = useCallback((title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
    setModalContent1(null);
  }, []);

  const formatXAxis = (dateTimeStr) => {
    if (!dateTimeStr) return "";

    try {
      const [datePart, timePart] = dateTimeStr.split(" ");
      return timePart || "";
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

  const renderChart = (data, dataKeys, colors, title, chartType) => {
    // Changed condition to check the passed data array
    if (!data || data.length === 0) {
      return <Typography color="text.secondary">No data available</Typography>;
    }

    const commonProps = {
      width: "100%",
      height: "100%",
      data: data,
    };

    const CommonChildren = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -10,
            style: { fontWeight: "bold" },
          }}
        />
        <YAxis
          label={{
            value: title,
            angle: -90,
            position: "insideLeft",
            style: { fontWeight: "bold" },
          }}
        />
        <Tooltip />
        <Legend />
      </>
    );

    if (chartType === "bar") {
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart>
            {CommonChildren}
            <Bar dataKey={dataKeys[0]} fill="#000080" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
          {CommonChildren}
          {dataKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[index]} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const sortDataByTimeDesc = (data, timeKey) => {
    return [...data].sort((a, b) => {
      const timeA = new Date(
        a[timeKey].replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
      );
      const timeB = new Date(
        b[timeKey].replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
      );
      return timeB - timeA;
    });
  };

  const getTotalActiveEnergy = (emsData) => {
    if (!emsData || !Array.isArray(emsData) || emsData.length === 0) {
      return "0.00";
    }
    return (emsData.reduce((sum, item) => sum + Number(item.activeEnergy || 0), 0)).toFixed(2);
  };

  const getLatestValue = (key) => {
    if (data.length > 0) {
      return formatNumberWithCommas(parseFloat(data[0][key]) || 0);
    }
    return 0;
  };
  const handleMaximize = (title, ChartComponent) => {
    setModalOpen(true)
    setModalContent1({ title, ChartComponent });
  };

  const boxData = [
    {
      heading: "Live Voltage (V)",
      value: energyData && energyData && energyData.length > 0
        ? Math.round(energyData[0].voltageY)
        : "0",
      color: "grey.200",
      height: 100,
    },
    {
      heading: "Live Current (A)",
      value: energyData && energyData && energyData.length > 0
        ?Math.round( energyData[0].currentR)
        : "0",
      color: "grey.200",
      height: 100,
    },
    {
      heading: "Total Energy Consumed (kWh)",
      value: box && box && box.length > 0
        ? box[0].totalEnergyConsumed
        : "0",
      color: "grey.500",
      height: 100,
    },
    {
      heading: "Energy Loss (kWh)",
      value: energyData && energyData && energyData.length > 0
        ? energyData[0].energyLoss
        : "0",
      color: "grey.500",
      height: 100,
    },
    {
      heading: "Power Factor ",
      value: box && box && box.length > 0
        ? box[0].powerFactor
        : "0",
      color: "grey.300",
      height: 100,
    },
    {
      heading: "Today's Consumption (kWh)",
      value: box && box && box.length > 0
      ? box[0].todayConsumption : "0",
      color: "grey.600",
      height: 100,
    },
  ];


  // const chartsR2 = [
  //   {
  //     title: "Harmonic Current",
  //     dataKeys: ["currentThdR", "currentThdY", "currentThdB"],
  //     colors: ["red", "FFBF00", "blue"],
  //     chartType: "line",
  //   },
  //   {
  //     title: "Harmonic Voltage",
  //     dataKeys: ["voltageThdR", "voltageThdY", "voltageThdB"],
  //     colors: ["red", "FFBF00", "blue"],
  //     chartType: "line",
  //   },
  //   {
  //     title: "Import Vs Export",
  //     dataKeys: ["importEnergy", "exportEnergy"],
  //     color: "#795548",
  //     chartType: "line",
  //   },
  // ];
  const ConsumptionChart = () => {
    const hourlyData = prepareHourlyConsumptionData();

    if (hourlyData.length === 0) {
      return <Typography color="text.secondary">No hourly consumption data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={hourlyData}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "Consumption (kWh)",
              angle: -90,
              position: "insideLeft",
              dy: 60,
              dx: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Power Factor",
              angle: -90,
              dy: -50,
              dx: 5,
              position: "insideRight",
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Bar
            yAxisId="left"
            dataKey="consumption"
            fill="#1FAEC5"
            name="Consumption (kWh)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="powerFactor"
            stroke="#801580"
            name="Power Factor"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const VoltageChart = ({ fullscreen }) => {
    const voltageData = fullscreen ? prepareVoltageData() : prepareFilteredVoltageData();

    if (voltageData.length === 0) {
      return <Typography color="text.secondary">No voltage data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={voltageData}
          margin={{ top: 5, right: 20, bottom: 90, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideTop",
              offset: 25,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Voltage (V)",
              angle: -90,
              position: "insideLeft",
              style: { fontWeight: "bold" },
              dy: 40,
              dx: -10,
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Line type="monotone" dataKey="voltageR" stroke="red" name="Voltage R" strokeWidth={3} dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="voltageY" stroke="#9d9d05" name="Voltage Y" strokeWidth={3} strokeDasharray="5 5" dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="voltageB" stroke="blue" name="Voltage B" strokeWidth={2} dot={<CustomizedDot />} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const CurrentChart = ({ fullscreen }) => {
    const currentData = fullscreen ? prepareCurrentData() : prepareFilteredCurrentData();

    if (currentData.length === 0) {
      return <Typography color="text.secondary">No current data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={currentData}
          margin={{ top: 5, right: 20, bottom: 90, left: 25 }}

        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Current (A)",
              angle: -90,
              position: "insideLeft",
              style: { fontWeight: "bold" },
              dy: 40,
              dx: -10,
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Line type="monotone" dataKey="currentR" stroke="red" name="Current R" strokeWidth={3} strokeDasharray="3 3" dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="currentY" stroke="#9d9d05" name="Current Y" strokeWidth={3} dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="currentB" stroke="blue" name="Current B" dot={<CustomizedDot />} strokeWidth={3} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const LeadLagChart = () => {
    const leadLagData = prepareLeadLagData();

    if (leadLagData.length === 0) {
      return <Typography color="text.secondary">No Lead Lag data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={leadLagData}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Lead & Lag",
              angle: -90,
              position: "insideLeft",
              dy: 40,
              dx: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Area
            type="monotone"
            dataKey="reactiveLead"
            stackId="1"
            stroke="#1FAEC5"
            fill="#1FAEC5"
            fillOpacity={0.3}
            name="Leading"
          />
          <Area
            type="monotone"
            dataKey="reactiveLag"
            stackId="2"
            stroke="#801580"
            fill="#801580"
            fillOpacity={0.3}
            name="Lagging"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const HarmonicCurrnetChart = ({ fullscreen }) => {
    const harmonicCurrent = fullscreen ? prepareHarmonicCurrentData() : prepareHarmonicFilteredCurrentData();

    if (harmonicCurrent.length === 0) {
      return <Typography color="text.secondary">No harmonic current data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={harmonicCurrent}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Harmonic Current",
              angle: -90,
              position: "insideLeft",
              dy: 40,
              dx: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Line type="monotone" dataKey="currentThdR" stroke="red" name="Current ThdR" strokeWidth={3} strokeDasharray="3 3" dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="currentThdY" stroke="#9d9d05" name="Current ThdY" strokeWidth={3} dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="currentThdB" stroke="blue" name="Current ThdB" dot={<CustomizedDot />} strokeWidth={3} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const HarmonicVoltageChart = ({ fullscreen }) => {
    const harmonicVoltage = fullscreen ? prepareHarmonicVoltageData() : prepareFilteredHarmonicVoltageData();

    if (harmonicVoltage.length === 0) {
      return <Typography color="text.secondary">No harmonic voltage data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={harmonicVoltage}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Harmonic Voltage",
              angle: -90,
              position: "insideLeft",
              dy: 40,
              dx: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Line type="monotone" dataKey="voltageThdR" stroke="red" name="Voltage ThdR" strokeWidth={3} strokeDasharray="3 3" dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="voltageThdY" stroke="#9d9d05" name="Voltage ThdY" strokeWidth={3} dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="voltageThdB" stroke="blue" name="Voltage ThdB" dot={<CustomizedDot />} strokeWidth={3} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const ImportExportChart = () => {
    const leadLagData = prepareImportExportData();

    if (leadLagData.length === 0) {
      return <Typography color="text.secondary">No import v export data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={leadLagData}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: "Import V Export",
              angle: -90,
              position: "insideLeft",
              dy: 40,
              dx: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Area
            type="monotone"
            dataKey="import"
            stackId="1"
            stroke="#1FAEC5"
            fill="#1FAEC5"
            fillOpacity={0.3}
            name="Import"
          />
          <Area
            type="monotone"
            dataKey="export"
            stackId="2"
            stroke="#801580"
            fill="#801580"
            fillOpacity={0.3}
            name="Export"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const ReactiveEnergyChart = () => {
    const reactiveEenrgyData = prepareReactiveEnergy();

    if (reactiveEenrgyData.length === 0) {
      return <Typography color="text.secondary">No Reactive energy data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={reactiveEenrgyData}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Bar
            yAxisId="left"
            type="monotone"
            dataKey="monthlyKvarhLag"
            stackId="1"
            stroke="#1FAEC5"
            fill="#1FAEC5"
            fillOpacity={0.3}
            name="Monthly Kvarh Lag"
          />
          <Bar
            yAxisId="left"
            type="monotone"
            dataKey="monthlyKvarhLead"
            stackId="2"
            stroke="#801580"
            fill="#801580"
            fillOpacity={0.3}
            name="Monthly Kvarh Lead"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="truePowerFactor"
            stroke="#801580"
            name="True Power Factor"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="disPowerFactor"
            stroke="#1FAEC5"
            name="Disp Power Factor"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const MonthlyKWHChart = () => {
    const leadLagData = prepareMonthlyKWH();

    if (leadLagData.length === 0) {
      return <Typography color="text.secondary">No Monthly Kwh data available</Typography>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical" // Swaps X and Y axis
          data={leadLagData}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            dataKey="time" // Y-axis now represents time
            type="category"
            label={{
              value: "Time",
              position: "insideLeft",
              angle: -90,
              dy: 40,
              dx: -25,
              style: { fontWeight: "bold" },
            }}
          />
          <XAxis
            type="number" // X-axis now represents KWH
            label={{
              value: "KWH",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Bar
            dataKey="monthlyKWH"
            stackId="1"
            stroke="#1FAEC5"
            fill="#1FAEC5"
            fillOpacity={0.3}
            name="Monthly KWH"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{ padding: "20px", background: "white" }}>
      <Grid
        container
        sx={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3} sx={{ marginLeft: "1em", mt: 0.5 }}>
            <FormControl fullWidth>
              <InputLabel id="machine-no-label">Machine No</InputLabel>
              <Select
                labelId="machine-no-label"
                id="machineNo"
                value={machineNo}
                label="Machine No"
                onChange={(e) => setMachineNo(e.target.value)}
              >
              {machineData.map((row) => (
                <MenuItem key={row.machineNo} value={row.machineNo}>
                  {row.displayMachineName}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1} sx={{ marginLeft: "1em", mt: 0.5 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!machineNo}
              sx={{ backgroundColor: "#1FAEC5", color: "white" }}
            >
              OK
            </Button>
          </Grid>
          <Grid item xs={1} sx={{ marginLeft: "1em", mt: 0.5 }}>
            <Button
              variant="contained"
              onClick={handleRefresh}
              sx={{ backgroundColor: "#1FAEC5", color: "white" }}
            >
              <CachedIcon />
            </Button>
          </Grid>
          <Grid item xs={2} sx={{ marginLeft: "1em", mt: 0.5 }}>
            <Button
              variant="contained"
              onClick={handleDailyView}
              sx={{ backgroundColor: "#1FAEC5", color: "white" }}
            >
              Daily View
            </Button>
          </Grid>
          <Grid item xs={1} sx={{ marginRight: "1em", mt: 0.5 }}>
            {isLoading &&
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "5px" }}>
                <CircularProgress />
              </div>}
          </Grid>
        </Grid>
      </Grid>
      <div>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {boxData.map((box, index) => (
            <Grid item xs={12} sm={5} md={2} key={index}>
              <Box
                height={box.height}
                display="flex"
                flexDirection="column"
                borderRadius={4}
                sx={{
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgcolor="white"
                  borderRadius="10px 10px 0 0"
                >
                  <Typography
                    sx={{ color: "#171756", fontWeight: "800", fontSize: "15px" }}
                  >
                    {box.heading}
                  </Typography>
                </Box>
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgcolor="#8555c1"
                  borderRadius="0 0 10px 10px"
                  sx={{
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Typography
                    sx={{ color: "white", fontWeight: "800", fontSize: "28px" }}
                  >
                    {box.value || getLatestValue(box.dataKey)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Hourly Consumption & Power Factor"
                onMaximize={() =>
                  handleMaximize(
                    "Hourly Consumption & Power Factor",
                    ConsumptionChart
                  )
                }
              >
                <ConsumptionChart />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box height={350}>
              <ChartPaper
                title="Voltage (V)"
                onMaximize={() => handleMaximize("Voltage (V)", VoltageChart, true)}
              >
                <VoltageChart fullscreen={false} />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box height={350}>
              <ChartPaper
                title="Current (A)"
                onMaximize={() => handleMaximize("Current (A)", CurrentChart, true)}
              >
                <CurrentChart fullscreen={false} />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Lead-Lag Analysis"
                onMaximize={() =>
                  handleMaximize("Lead-Lag Analysis", LeadLagChart)
                }
              >
                <LeadLagChart />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Harmonic Currnet"
                onMaximize={() =>
                  handleMaximize("Harmonic Currnet", HarmonicCurrnetChart, true)
                }
              >
                <HarmonicCurrnetChart fullscreen={false} />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Harmonic Voltage"
                onMaximize={() =>
                  handleMaximize("Harmonic Voltage", HarmonicVoltageChart, true)
                }
              >
                <HarmonicVoltageChart fullscreen={false} />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Import Vs Export"
                onMaximize={() =>
                  handleMaximize("Import Vs Export", ImportExportChart)
                }
              >
                <ImportExportChart />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Reactive Energy"
                onMaximize={() =>
                  handleMaximize("Reactive Energy", ReactiveEnergyChart)
                }
              >
                <ReactiveEnergyChart />
              </ChartPaper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              height={350}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <ChartPaper
                title="Monthly Energy"
                onMaximize={() =>
                  handleMaximize("Monthly Energy", MonthlyKWHChart)
                }
              >
                <MonthlyKWHChart />
              </ChartPaper>
            </Box>
          </Grid>
        </Grid>
      </div>

      <ChartModal
        open={modalOpen}
        handleClose={handleCloseModal}
        title={modalContent1?.title}
      >
        {modalContent1?.ChartComponent && <modalContent1.ChartComponent fullscreen />}
      </ChartModal>
    </div>
  );
}

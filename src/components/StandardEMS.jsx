import React, { useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import { Maximize2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { standardDashboardApi } from "../api/standardDasboardApi";
import { Link } from "react-router-dom";

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
export default function StandardEMS() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emsData, setEmsData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [energyLossData, setEnergyLossData] = useState([]);

  const getEnergyLoss = async () => {
    try {
      const response = await standardDashboardApi.getStandardEMSEnergyLoss();
      setEnergyLossData(response.data.data);
    } catch (error) {
      console.error("energy loss error:", error);
    }
  };
  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined || isNaN(number)) return "0.00";

    const parts = parseFloat(number).toFixed(2).split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  };
  const getStandardEMSData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await standardDashboardApi.getStandardEMS();
      const data = response.data.data;

      const sortedData = sortDataByTimeDesc(data.slice(0, 20), "dateTimeRecvd");
      setEmsData(sortedData);
    } catch (error) {
      setError(error.message || "An error occurred while fetching data");
      console.error("Error getting EMS data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConsumptionPerDay = async () => {
    try {
      const response =
        await standardDashboardApi.getStandardEMSConsumptionPerDay();
      //console.log("Raw consumption data:", response.data.data);

      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.error("Invalid data format received");
        return;
      }

      const validData = response.data.data
        .map((item) => ({
          ...item,
          activeEnergy: parseFloat(item.activeEnergy),
        }))
        .filter((item) => item.dateTime && !isNaN(item.activeEnergy));

      const sortedData = sortDataByTimeDesc(validData, "dateTime");

      //console.log("Processed consumption data:", sortedData);
      setConsumptionData(sortedData);
    } catch (error) {
      console.error("consumption error:", error);
    }
  };

  useEffect(() => {
    getStandardEMSData();
    getEnergyLoss();
    getConsumptionPerDay();
  }, [getStandardEMSData]);

  const handleOpenModal = useCallback((title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
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
    if (!data || data.length === 0) {
      return <Typography color="text.secondary">No data available</Typography>;
    }

    const phaseColors = {
      R: "red",
      Y: "#FFBF00",
      B: "blue",
    };

    const isVoltageOrCurrent =
      title.toLowerCase().includes("voltage") ||
      title.toLowerCase().includes("current");
    const isConsumption = title.toLowerCase().includes("consumption");
    const consumptionDataKey = isConsumption ? "activeEnergy" : null;

    const commonProps = {
      width: "100%",
      height: "100%",
      data: isConsumption ? consumptionData : emsData,
    };
    const CommonChildren = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={isConsumption ? "dateTime" : "dateTimeRecvd"}
          tickFormatter={formatXAxis}
          interval="preserveStartEnd"
          angle={-10}
          textAnchor="end"
          reversed={true}
          style={{
            fontSize: "14px",
            fontFamily: "Arial",
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={formatXAxis}
          formatter={(value) => [parseFloat(value).toFixed(2), ""]}
        />
        <Legend />
      </>
    );

    if (chartType === "bar") {
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart
            data={consumptionData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {CommonChildren}
            <Bar
              dataKey="activeEnergy"
              fill="#000080"
              name="Energy Consumption"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={isConsumption ? consumptionData : emsData}>
          {CommonChildren}
          {(isConsumption ? [consumptionDataKey] : dataKeys).map(
            (key, index) => {
              let lineColor = colors[index];
              if (isVoltageOrCurrent) {
                const phase = key.slice(-1);
                lineColor = phaseColors[phase] || colors[index];
              }
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={true}
                />
              );
            }
          )}
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

  const renderLineChart = useCallback(
    (data, dataKeys, colors, title) => {
      if (!data || data.length === 0) {
        return (
          <Typography color="text.secondary">No data available</Typography>
        );
      }

      const phaseColors = {
        R: "red",
        Y: "#FFBF00",
        B: "blue",
      };

      const isVoltageOrCurrent =
        title.toLowerCase().includes("voltage") ||
        title.toLowerCase().includes("current");
      const isConsumption = title.toLowerCase().includes("consumption");
      const consumptionDataKey = isConsumption ? "activeEnergy" : null;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={isConsumption ? consumptionData : emsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={isConsumption ? "dateTime" : "dateTimeRecvd"}
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              // minTickGap={10}
              angle={-10}
              textAnchor="end"
              // height={60}
              reversed={true}
              dot={false}
              style={{
                fontSize: "14px",
                fontFamily: "Arial",
              }}
              // height={80}
              // tick={{ dy: 10 }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatXAxis}
              formatter={(value) => [parseFloat(value).toFixed(2), ""]}
              dot={{ r: 3 }}
            />
            <Legend />
            {(isConsumption ? [consumptionDataKey] : dataKeys).map(
              (key, index) => {
                let lineColor = colors[index];
                if (isVoltageOrCurrent) {
                  const phase = key.slice(-1);
                  lineColor = phaseColors[phase] || colors[index];
                }
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls={true}
                  />
                );
              }
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    },
    [consumptionData, emsData]
  );

  const getLatestValue = (key) => {
    if (emsData.length > 0) {
      return formatNumberWithCommas(parseFloat(emsData[0][key]) || 0);
    }
    return 0;
  };

  const calculateTotalEnergyLoss = () => {
    if (energyLossData.length > 0) {
      const totalLoss =
        energyLossData[0].outTotalEnergyLossBKwh +
        energyLossData[0].outTotalEnergyLossKwh +
        energyLossData[0].outTotalEnergyLossRKwh +
        energyLossData[0].outTotalEnergyLossYKwh;
      return formatNumberWithCommas(totalLoss);
    }
    return "0.00";
  };

  const calculateTodaysConsumption = () => {
    const total = consumptionData.reduce(
      (total, item) => total + parseFloat(item.activeEnergy),
      0
    );
    return formatNumberWithCommas(total);
  };

  const boxData = [
    {
      heading: "Max Demand (kWh)",
      dataKey: "maxDemandOfDay",
      color: "grey.200",
      height: 100,
    },
    {
      heading: "Power Factor (kWh)",
      dataKey: "pf",
      color: "grey.300",
      height: 100,
    },
    {
      heading: "Est. Energy Loss",
      value: calculateTotalEnergyLoss(),
      color: "grey.400",
      height: 100,
    },
    {
      heading: "Total Energy Consumed (kWh)",
      dataKey: "importEnergy",
      color: "grey.500",
      height: 100,
    },
    {
      heading: "Today's Consumption (kWh)",
      value: calculateTodaysConsumption(),
      color: "grey.600",
      height: 100,
    },
  ];

  const chartsR1 = [
    {
      title: "Per Hour Consumption (kWh)",
      dataKey: "activeEnergy",
      color: "#000080",
      chartType: "bar",
    },
    {
      title: "Voltage (V)",
      dataKeys: ["voltageR", "voltageY", "voltageB"],
      colors: ["red", "FFBF00", "blue"],
      chartType: "line",
    },
    {
      title: "Current (A)",
      dataKeys: ["currentR", "currentY", "currentB"],
      colors: ["red", "FFBF00", "blue"],
      chartType: "line",
    },
  ];
  const chartsR2 = [
    {
      title: "Import Vs Export",
      dataKeys: ["importEnergy", "exportEnergy"],
      color: "#795548",
      chartType: "line",
    },
    {
      title: "Harmonic Current",
      dataKeys: ["currentThdR", "currentThdY", "currentThdB"],
      colors: ["red", "FFBF00", "blue"],
      chartType: "line",
    },
    {
      title: "Harmonic Voltage",
      dataKeys: ["voltageThdR", "voltageThdY", "voltageThdB"],
      colors: ["red", "FFBF00", "blue"],
      chartType: "line",
    },
  ];

  return (
    <div style={{ padding: "20px", background: "white" }}>
      {isLoading && <CircularProgress />}
      <Grid
        container
        sx={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
      >
        {["plantNo", "lineNo", "machineNo", "deviceNo"].map((field) => (
          <Grid item xs={2} key={field}>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, marginRight: 1 }}
            >
              <InputLabel id={`${field}-select-label`}>{`Select ${
                field.charAt(0).toUpperCase() + field.slice(1)
              }`}</InputLabel>
              <Select
                labelId={`${field}-select-label`}
                id={`${field}-select`}
                name={field}
                // value={cbmData[field]}
                // onChange={handleInputChange}
                label={`Select ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
              >
                <MenuItem value="">{`Select ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1FAEC5", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Ok"}
          </Button>
        </Grid>
        {/* <Grid sx={{marginLeft:'1em'}} >
          <Button variant="contained" onClick={handleGetOEEData} sx={{backgroundColor:'#1FAEC5',}}>
          <Link to="/iconicdashboard"> Cockpit View</Link>
         
          </Button>
        </Grid> */}
      </Grid>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {boxData.map((box, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Box
              height={box.height}
              display="flex"
              flexDirection="column"
              borderRadius={10}
            >
              <Box
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor="white"
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
                bgcolor="#801580"
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
        {[...chartsR1, ...chartsR2].map((data, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              height={250}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                marginBottom={1}
                bgcolor={"#24bbd3"}
                borderRadius={"5px"}
                p={0.5}
              >
                <Typography sx={{ color: "black", fontWeight: "bold" }}>
                  {data.title}
                </Typography>
                <Maximize2
                  color="black"
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleOpenModal(
                      data.title,
                      renderChart(
                        data.title.toLowerCase().includes("consumption")
                          ? consumptionData
                          : emsData,
                        data.dataKeys || [data.dataKey],
                        data.colors || [data.color],
                        data.title,
                        data.chartType
                      )
                    )
                  }
                />
              </Box>
              <Box flex={1}>
                {renderChart(
                  data.title.toLowerCase().includes("consumption")
                    ? consumptionData
                    : emsData,
                  data.dataKeys || [data.dataKey],
                  data.colors || [data.color],
                  data.title,
                  data.chartType
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <ChartModal
        open={modalOpen}
        handleClose={handleCloseModal}
        title={modalContent?.title}
      >
        {modalContent?.content}
      </ChartModal>
    </div>
  );
}

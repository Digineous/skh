import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Modal,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { Maximize2 } from "lucide-react";
import {
  LineChart,
  LabelList,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
} from "recharts";
import Chart from "react-apexcharts";
import { standardDashboardApi } from "../api/standardDasboardApi";
import { Link } from "react-router-dom";
import ProductionQualityChart from "./ProductionQualityChart";
import { apigetMachine } from "../api/MachineMaster/apigetmachine";
import { apiGetMachineInput } from "../api/api.getmachineinput";

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

const RadialBarChart = ({ percentage, color }) => {
  const hexToRgba = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${0.1})`;
  };

  const backgroundColor = hexToRgba(color);

  const options = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "50%" },
        track: {
          background: backgroundColor,
          strokeWidth: "97%",
          margin: 2,
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 2,
            fontSize: "24px",
            color: "black",
            fontWeight: 600,
          },
        },
      },
    },
    colors: [color],
    stroke: { lineCap: "round" },
  };

  return (
    <Chart
      options={options}
      series={[percentage]}
      type="radialBar"
      height={220}
      width={220}
    />
  );
};

export default function StandardOEE() {
  const [machineInputData, setMachineInputData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [chartData, setChartData] = useState({
    partsProduced: [],
    cycleTime: [],
    downtime: [],
    energyPerProduction: [],
    availability: 0,
    productivity: 0,
    quality: 0,
    utilization: 0,
    downtimeDistribution: [],
    strokesPerShift: [],
    strokesPerMins: [],
  });

  const [oeeData, setOeeData] = useState({
    Plant: "",
    Line: "",
    Machine: "",
    Device: "",
  });
  const [machineData, setMachineData] = useState([]);
  const [cardData, setCardData] = useState({
    actualProduction: 0,
    target: 0,
    gap: 0,
    downtime: 0,
    runtime: 0,
    oeePercentage: 0,
  });
  const [selectedPartName, setSelectedPartName] = useState("");
  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined || isNaN(number)) return "0.00";

    const parts = parseFloat(number).toFixed(2).split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  };

  useEffect(() => {
    const getmachine = async () => {
      try {
        const result = await apigetMachine();
        //console.log("Result data machine:", result.data.data);
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getmachine();
    getMachineInput();
  }, []);

  const getMachineInput = async () => {
    try {
      const result = await apiGetMachineInput();
      //console.log(result?.data.data);
      setMachineInputData(result?.data.data);
      //console.log("machine", result.data.data);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleMachineChange = (event) => {
    const newSelectedMachine = event.target.value;
    setSelectedMachine(newSelectedMachine);
    //console.log("new selected machine:", newSelectedMachine);

    const matchingPart = machineInputData.find(
      (input) => input.machineNo === newSelectedMachine
    );
    //console.log("Part Name:", matchingPart);
    setSelectedPartName(matchingPart?.partName || "");

  };
  const handleGetOEEData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    //console.log("selected machine:", selectedMachine)
    try {
      const response = await standardDashboardApi.getStandardOEE({
        plantNo: "",
        lineNo: "",
        machineNo: selectedMachine,
        deviceNo: "",
      });
      if (response.data?.data?.[0]?.oeeDashboard) {
        const responseData = response.data.data[0].oeeDashboard;
        //console.log("oee data:", responseData);
        setCardData({
          actualProduction: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "Actual Production")
          ).slice(0, -3),
          target: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "Target")
          ).slice(0, -3),
          gap: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "Gap")
          ).slice(0, -3),
          downtime: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "Downtime in Mins")
          ),
          runtime: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "Runtime in Min")
          ),
          oeePercentage: formatNumberWithCommas(
            findValue(responseData.oeeLatestData, "OEE %")
          ),
        });
        const partsProducedPerHour = Array.isArray(responseData.partsPerHour)
          ? [...responseData?.partsPerHour].reverse()
          : [];
        const cycleTimeReverse = Array.isArray(responseData.cycleTime)
          ? [...responseData?.cycleTime].reverse()
          : [];
        setChartData({
          partsProduced: partsProducedPerHour,
          cycleTime: cycleTimeReverse,
          downtime: responseData.downtime || [],
          energyPerProduction:
            responseData.energyPerHourProduction?.reverse() || [],
          availability: findValue(responseData.oeeLatestData, "Availability %"),
          productivity: findValue(responseData.oeeLatestData, "Performance %"),
          quality: findValue(responseData.oeeLatestData, "Quality %"),
          utilization: findValue(responseData.oeeLatestData, "Utilization %"),
          downtimeDistribution: responseData.downtime || [],
          strokesPerShift: responseData.strokesPerShift || [],
          strokesPerMins: (responseData?.strokesPerMins || []).slice(80).reverse(),
        });
        //console.log("strokes per min:", (responseData?.strokesPerMins || []).slice(80).reverse())
        //console.log(
        //   "energy per hr production:",
        //   responseData.energyPerHourProduction
        // );
        setDataFetched(true);
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
      console.error("Error getting OEE data:", err);
    } finally {
      setIsLoading(false);
    }
  });
  const findValue = useCallback((data, attributeName) => {
    if (!data || !Array.isArray(data)) return 0;
    const item = data.find((item) => item.attributeName === attributeName);
    return item ? parseFloat(item.value) || 0 : 0;
  }, []);

  const handleOpenModal = useCallback((title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);


  const renderLineChart = useCallback(
    (data, dataKey, color) => (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            stroke="#000000"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              style: { fontWeight: "bold" },
              fill: "#000000",
            }}
          />
          <YAxis
            stroke="#000000"
            label={{
              value: "Cycle Time ",
              angle: -90,
              position: "insideLeft",
              dy: 20,
              dx: 10,
              fontWeight: "bold",
              fill: "#000000",
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
            dataKey="cycleTime"
            name=" Cycle Time"
            barSize={20}
            fill="#cc6600"
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target "
            strokeWidth={2.5}
            stroke="black"
            dot={false}
          // strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    ),
    []
  );

  const energyChart = useCallback((data, dataKey, color) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            stroke="#000000"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              fill: "#000000",
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            stroke="#000000"
            label={{
              value: "Energy Consumed",
              dy: 65,
              dx: 5,
              angle: -90,
              fill: "#000000",
              position: "insideLeft",
              fontWeight: "bold",
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Bar dataKey="energy" name="Energy Consumption" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    );
  }, []);

  const renderBarChart = useCallback(
    (data, dataKey, color) => (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hourBucket"
            stroke="#000000"
            fontSize="14px"
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -10,
              fontWeight: "bold",
              fill: "#000000",
            }}
          />
          <YAxis
            stroke="#000000"
            label={{
              value: "Part Produce",
              dy: 40,
              dx: 17,
              angle: -90,
              fill: "#000000",
              position: "insideLeft",
              fontWeight: "bold",
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
            dataKey="actualProduction"
            name="Time (In Hour)"
            fill={"#0099ff"}
          >
            <LabelList
              dataKey="actualProduction"
              position="top"
              fontSize={12}
              fill="#000000"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ),
    []
  );

  const renderBarChart1 = useCallback((data, dataKey, color) => {
    const downtimeData = [
      { lossType: "Management", Losses: 5, color: "#FF6B6B" },
      { lossType: "Stoppage", Losses: 4, color: "#4ECDC4" },
      { lossType: "Startup", Losses: 2, color: "#45B7D1" },
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="reason" stroke="#000000" />
          <YAxis
            stroke="#000000"
            label={{
              value: "Time (mins)",
              dy: 40,
              dx: 17,
              angle: -90,
              fill: "#000000",
              position: "insideLeft",
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
            dataKey="total_downtime_in_mins"
            fill={color}
            name={"Types of Losses"}
            fontWeight={"600"}
          >
            {downtimeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="" position="top" fill="#000000" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }, []);
  const boxData = [
    {
      heading: "Actual Production",
      dataKey: "actualProduction",
      color: "grey.200",
      height: 100,
    },
    { heading: "Target", dataKey: "target", color: "grey.300", height: 100 },
    { heading: "Gap", dataKey: "gap", color: "grey.400", height: 100 },
    {
      heading: "Downtime (mins)",
      dataKey: "downtime",
      color: "grey.600",
      height: 100,
    },
    {
      heading: "Runtime (mins)",
      dataKey: "runtime",
      color: "grey.600",
      height: 100,
    },
    {
      heading: "OEE %",
      dataKey: "oeePercentage",
      color: "grey.700",
      height: 100,
    },
  ];

  const radialChartsR1 = [
    { title: "Availability ", dataKey: "availability", color: "#0E2566" },
    { title: "Productivity ", dataKey: "productivity", color: "#00423C" },
  ];

  const radialChartsR2 = [
    { title: "Quality", dataKey: "quality", color: "#421b00" },
    { title: "Utilization", dataKey: "utilization", color: "#9c27b0" },
  ];
  const chartsR1 = [
    {
      title: "Part Produced Per Hour",
      dataKey: "partsProduced",
      color: "#000080",
      chartType: "composed",
    },
    {
      title: "Average Cycle Time per Hour",
      dataKey: "cycleTime",
      color: "#ff9800",
      chartType: "line",
    },
  ];

  const chartsR2 = [
    {
      title: "Daily Downtime Distribution",
      dataKey: "downtime",
      color: "#795548",
      chartType: "bar",
    },
    {
      title: "Energy Consumed Per Part",
      dataKey: "energyPerProduction",
      color: "#e60099",
      chartType: "bar",
    },
  ];
  const chartsR3 = [
    {
      title: "Strokes Per Shift",
      dataKey: "strokesPerShift",
      color: "#2196f3",
      chartType: "bar",
    },
    {
      title: "Strokes Per Minute",
      dataKey: "strokesPerMins",
      color: "#ff5722",
      chartType: "bar",
    },
  ];

  const renderStrokesPerShiftChart = useCallback(
    (data, dataKey, color) => (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="shiftName"
            stroke="#000000"
            label={{
              value: "Shift",
              position: "insideBottom",
              offset: -10,
              fontWeight: "bold",
              fill: "#000000",
            }}
          />
          <YAxis
            stroke="#000000"
            label={{
              value: "Production",
              dy: 40,
              dx: 17,
              angle: -90,
              fill: "#000000",
              position: "insideLeft",
              fontWeight: "bold",
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 5 }}
          />
          <Bar dataKey="production" name="Production" fill={color}>
            <LabelList
              dataKey="production"
              position="top"
              fontSize={12}
              fill="#000000"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ),
    []
  );

  const renderStrokesPerMinuteChart = useCallback((data, dataKey, color) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          stroke="#000000"
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -10,
            fontWeight: "bold",
            fill: "#000000",
          }}
        />
        <YAxis
          stroke="#000000"
          label={{
            value: "Strokes",
            dy: 30,
            dx: 17,
            angle: -90,
            fill: "#000000",
            position: "insideLeft",
            fontWeight: "bold",
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
          dataKey="noOfStrokes"
          name="Strokes"
          fill={color}
        >
          <LabelList
            dataKey="noOfStrokes"
            position={({ payload }) =>
              payload.noOfStrokes < 0 ? 'bottom' : 'top'
            }
            fontSize={12}
            fill="#000000"
            formatter={(value) => Math.abs(value)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ), []);
  return (
    <div style={{ padding: "20px", background: "white" }}>
      <Grid
        container
        spacing={2}
        sx={{
          marginBottom: "10px",
          display: "flex",
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: "center",
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 2
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#2c3e50",
            textAlign: "left",
            mt: 2,
            mb: 2,
          }}
        >
          Current Part Name: {selectedPartName}
        </Typography>

        <Grid item xs={12} sm="auto" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Machine</InputLabel>
            <Select
              name="machineId"
              value={selectedMachine}
              onChange={handleMachineChange}
            >
              {machineData.map((machine) => (
                <MenuItem key={machine.id} value={machine.machineNo}>
                  {machine.displayMachineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" style={{ color: 'white' }} onClick={handleGetOEEData}>
            Ok
          </Button>
        </Grid>

        <Grid item xs={12} sm="auto" sx={{ display: 'flex', gap: 2 }}>
          <Link to="/machinestatus">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1FAEC5",
                color: "white",
                width: '100%'
              }}
            >
              Machine Chart
            </Button>
          </Link>

          <Link to="/cockpitview">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1FAEC5",
                color: "white",
                width: '100%'
              }}
            >
              Cockpit View
            </Button>
          </Link>
        </Grid>
      </Grid>

      {/* {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )} */}
      {dataFetched && (
        <Grid container spacing={2}>
          {boxData.map((box, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Paper elevation={3}>
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
                      sx={{
                        color: "#171756",
                        fontWeight: "800",
                        fontSize: "18px",
                      }}
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
                      sx={{
                        color: "white",
                        fontWeight: "800",
                        fontSize: "28px",
                      }}
                    >
                      {cardData[box.dataKey]}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}

          {[...radialChartsR1].map((data, index) => (
            <Grid item xs={12} sm={6} md={2} key={index} marginTop={2}>
              <Box
                height={250}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch"
                sx={{
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    background: "#24bbd3",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "600",
                      textAlign: "left",
                    }}
                  >
                    {data.title}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="calc(100% - 30px)"
                >
                  <RadialBarChart
                    percentage={chartData[data.dataKey]}
                    color={
                      chartData[data.dataKey] <= 50
                        ? "#f44336"
                        : chartData[data.dataKey] <= 75
                          ? "#ff9b00"
                          : "#4caf50"
                    }
                  />
                </Box>
              </Box>
            </Grid>
          ))}

          {[...chartsR1].map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} marginTop={2}>
              <Box
                height={250}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  bgcolor={"#24bbd3"}
                  borderRadius={"5px"}
                  p={0.5}
                >
                  <Typography sx={{ color: "black", fontWeight: "600" }}>
                    {data.title}
                  </Typography>
                  <Maximize2
                    color="black"
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(
                        data.title,
                        data.chartType === "composed" ? (
                          <ProductionQualityChart
                            data={chartData[data.dataKey]}
                            oeeLatestData={chartData.oeeLatestData}
                          />
                        ) : data.chartType === "line" ? (
                          renderLineChart(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                        ) : (
                          renderBarChart(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                        )
                      )
                    }
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="calc(100% - 30px)"
                >
                  {data.chartType === "composed" ? (
                    <ProductionQualityChart
                      data={chartData[data.dataKey]}
                      oeeLatestData={chartData.oeeLatestData}
                    />
                  ) : data.chartType === "line" ? (
                    renderLineChart(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )
                  ) : (
                    renderBarChart(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )
                  )}
                </Box>
              </Box>
            </Grid>
          ))}

          {[...radialChartsR2].map((data, index) => (
            <Grid item xs={12} sm={6} md={2} key={index} marginTop={2}>
              <Box
                height={250}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch"
                sx={{
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    background: "#24bbd3",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "600",
                      textAlign: "left",
                    }}
                  >
                    {data.title}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  flexGrow={1}
                >
                  <RadialBarChart
                    percentage={chartData[data.dataKey]}
                    color={
                      chartData[data.dataKey] <= 50
                        ? "#f44336"
                        : chartData[data.dataKey] <= 75
                          ? "#ff9b00"
                          : "#4caf50"
                    }
                  //color={data.color}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
          {[...chartsR2].map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} marginTop={2}>
              <Box
                height={250}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  bgcolor={"#24bbd3"}
                  borderRadius={"5px"}
                  p={0.5}
                >
                  <Typography sx={{ color: "black", fontWeight: "600" }}>
                    {data.title}
                  </Typography>
                  <Maximize2
                    color="black"
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(
                        data.title,
                        data.title === "Energy Consumed Per Part"
                          ? energyChart(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                          : renderBarChart1(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                      )
                    }
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="calc(100% - 30px)"
                >
                  {data.title === "Energy Consumed Per Part"
                    ? energyChart(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )
                    : renderBarChart1(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )}
                </Box>
              </Box>
            </Grid>
          ))}
          {[...chartsR3].map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} marginTop={2}>
              <Box
                height={250}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  bgcolor={"#24bbd3"}
                  borderRadius={"5px"}
                  p={0.5}
                >
                  <Typography sx={{ color: "black", fontWeight: "600" }}>
                    {data.title}
                  </Typography>
                  <Maximize2
                    color="black"
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(
                        data.title,
                        data.title === "Strokes Per Shift"
                          ? renderStrokesPerShiftChart(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                          : renderStrokesPerMinuteChart(
                            chartData[data.dataKey],
                            data.dataKey,
                            data.color
                          )
                      )
                    }
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="calc(100% - 30px)"
                >
                  {data.title === "Strokes Per Shift"
                    ? renderStrokesPerShiftChart(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )
                    : renderStrokesPerMinuteChart(
                      chartData[data.dataKey],
                      data.dataKey,
                      data.color
                    )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

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

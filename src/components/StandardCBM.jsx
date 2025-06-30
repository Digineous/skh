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
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
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
} from "recharts";
import { standardDashboardApi } from "../api/standardDasboardApi";
import { Link } from "react-router-dom";
import { apiGetCockPitView } from "../api/api.getCockpitView";

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

export default function StandardCBM() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chartData, setChartData] = useState({
    velocity: [],
    acceleration: [],
    noise: [],
    current: [],
    temperature: [],
    hydraulicPressure: [],
    rpm: [],
    ultraSonic: [],
  });

  const [cbmData, setCbmData] = useState({
    Plant: "",
    Line: "",
    Machine: "",
    Device: "",
  });

  const [cardData, setCardData] = useState({
    mttr: "",
    mtbf: "",
    parametersInRed: "",
    parametersInGreen: "",
    parametersInYellow: "",
    totalAssetsBeingMonitored: "",
    totalParametersBeingMonitored: "",
  });
  const [parameterTableData, setParameterTableData] = useState([
   
  ]);

  const handleGetOEEData = useCallback(async () => {
    console.log("ok btn click for cbm data");

    setIsLoading(true);
    setError(null);
    console.log(cbmData);
    const { Plant, Machine, Device, Line } = cbmData;
    try {
      const response = await standardDashboardApi.getStandardCBM({
        plantNo: Plant,
        machineNo: Machine,
        deviceNo: Device,
        lineNo: Line,
      });
      console.log("api cbm data responce ", response);

      if (response.data?.data) {
        const responseData = response.data.data[0].cbmDashboard;
        console.log("CBM dashborad data by client", response.data.data[0]);

        setCardData({
          mttr: responseData?.mttrMtbf?.mttr,
          mtbf: responseData?.mttrMtbf?.mtbf,
          parametersInRed: responseData.parameterAnalysis.redParameters,
          parametersInGreen: responseData.parameterAnalysis.greenParameters,
          parametersInYellow: responseData.parameterAnalysis.yellowParameters,
          totalAssetsBeingMonitored: responseData.parameterAnalysis.assets,
          totalParametersBeingMonitored:
            responseData.parameterAnalysis.yellowParameters,
          activeParameter: responseData.parameterAnalysis.activeParameters,
          deactiveParameter: responseData.parameterAnalysis.deactiveParameters,

          // totalAssetsBeingMonitored: responseData[0].totalAssetsBeingMonitored,
          // totalParametersBeingMonitored: responseData[0].totalParameterBeingMonitored
        });

        const processedChartData = {
          velocity: [],
          acceleration: [],
          noise: [],
          current: [],
          temperature: [],
          hydraulicPressure: [],
          rpm: [],
          ultraSonic: [],
        };

        responseData.Spindle?.slice(0, 20).forEach((item) => {
          const time = new Date(item.datetimeRecvd).toLocaleTimeString();
          console.log("time:", time);
          processedChartData.velocity.push({
            time,
            horizontal: parseFloat(item.velocityX),
            vertical: parseFloat(item.velocityY),
            axial: parseFloat(item.velocityZ),
          });

          processedChartData.acceleration.push({
            time,
            horizontal: parseFloat(item.acceleration),
            // vertical: parseFloat(item.accelerationVertical),
            // axial: parseFloat(item.accelerationAxial)
          });

          processedChartData.noise.push({ time, value: item.noise });
          processedChartData.current.push({
            time,
            R: parseFloat(item.currentR),
            Y: parseFloat(item.currentY),
            B: parseFloat(item.currentB),
          });
          processedChartData.temperature.push({
            time,
            value: parseFloat(item.temperature),
          });
          processedChartData.hydraulicPressure.push({
            time,
            value: parseFloat(item.hydrolicpressure),
          });
          processedChartData.rpm.push({ time, value: parseFloat(item.rpm) });
          processedChartData.ultraSonic.push({
            time,
            value: parseFloat(item.ultrasonic),
          });
        });

        Object.keys(processedChartData).forEach((key) => {
          processedChartData[key].reverse();
        });

        setChartData(processedChartData);
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
  }, [cbmData]);

  const handleOpenModal = useCallback((title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);
useEffect(()=>{
  fetchAlertStatus()
},[])

  const fetchAlertStatus=async()=>{
    const cockpitViewData={
      "plantNo":null,
      "lineNo":null,
      "machineNo":null,
      "deviceNo":null,
      "module":null
  }
    try {
      const response =await apiGetCockPitView(cockpitViewData)
      console.log("cockpitview data",response.data.data)
      setParameterTableData(response.data.data)
    } catch (error) {
    console.error("error getting cockpit view data:",error)
    }
  }
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setCbmData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const renderLineChart = useCallback(
    (data, title, dataKeys) => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 14 }}
            interval="preserveStartEnd"
            tickFormatter={(value) =>
              value.split(":")[0] + ":" + value.split(":")[1]
            }
            label={{
              value: "Time",
              position: "bottom",
              offset: 0,
              style: { fontWeight: "bold" },
            }}
          />
          <YAxis
            label={{
              value: title,
              angle: -90,
              position: "insideleft",
              offset: 0,
              dy: 0,
              dx: -20,
              style: { fontWeight: "bold", fontSize: "14px" },
            }}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 20 }}
          />
          {dataKeys.map((key, index) => {
            let lineColor;
            if (key === "R") {
              lineColor = "#FF0000";
            } else if (key === "Y") {
              lineColor = "#FFFF00"; // Yellow
            } else if (key === "B") {
              lineColor = "#0000FF"; // Blue
            } else {
              lineColor = ["#0e04cf", "#cf3e04", "#c104cf"][index % 3]; // Default color cycle
            }

            let dotStyle;
            if (key === "R") {
              dotStyle = { shape: "cross", stroke: "#FF0000", strokeWidth: 2 }; // Cross for R
            } else if (key === "Y") {
              dotStyle = { shape: "circle", stroke: "#FFFF00", strokeWidth: 2 }; // Circle for Y
            } else if (key === "B") {
              dotStyle = {
                shape: "diamond",
                stroke: "#0000FF",
                strokeWidth: 2,
              }; // Diamond for B
            } else {
              dotStyle = { shape: "square", stroke: lineColor, strokeWidth: 2 }; // Default square
            }

            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColor}
                activeDot={{ r: 8 }}
                dot={dotStyle} // Applying dot style
                strokeWidth={2}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    ),
    []
  );

  const boxData = [
    [
      {
        heading: "Total Assets being monitored ",
        dataKey: "totalAssetsBeingMonitored",
      },
      { heading: "Parameters in Green", dataKey: "parametersInGreen" },
      { heading: "MTTR (Mins)", dataKey: "mttr" },
    ],
    [
      {
        heading: "Total Parameters being monitored for below assets",
        dataKey: "totalParametersBeingMonitored",
      },
      { heading: "Parameters in RED", dataKey: "parametersInRed" },
      { heading: "MTBF (Mins)", dataKey: "mtbf" },
    ],
    [
      { heading: "Active Parameter", dataKey: "activeParameter" },
      { heading: "Parameters in Yellow", dataKey: "parametersInYellow" },
      { heading: " De-Active Paramter", dataKey: "deactiveParameter" },
    ],
  ];
  const charts = [
    {
      title: "Velocity (m/sec)",
      dataKey: "velocity",
      dataKeys: ["horizontal", "vertical", "axial"],
    },
    {
      title: "Acceleration (m/sec2)",
      dataKey: "acceleration",
      dataKeys: ["horizontal", "vertical", "axial"],
    },
    { type: "table", title: "Active Alert Status" },
    { title: "Current (A)", dataKey: "current", dataKeys: ["R", "Y", "B"] },
    { title: "Temperature (°C)", dataKey: "temperature", dataKeys: ["value"] },
    {
      title: "Hydraulic Pressure (BAR)",
      dataKey: "hydraulicPressure",
      dataKeys: ["value"],
    },
    { title: "RPM", dataKey: "rpm", dataKeys: ["value"] },
    { title: "Ultrasonic", dataKey: "ultraSonic", dataKeys: ["value"] },
    { title: "Noise (DB)", dataKey: "noise", dataKeys: ["value"] },
  ];
  const ParameterTable = ({ height = "calc(100% - 30px)" }) => (
    <TableContainer component={Paper} sx={{ height, overflow: "auto" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#801580",
                color: "white",
              }}
            >
              Machine Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#801580",
                color: "white",
              }}
            >
              Parameter Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#801580",
                color: "white",
              }}
            >
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {parameterTableData
  .filter(row => row.status === "red") 
  .map((row, index) => (
    <TableRow key={index}>
      <TableCell>{row.machineName}</TableCell>
      <TableCell>{row.attribName}</TableCell>
      <TableCell style={{ background: `${row.status}`, color: 'white' }}>
        {row.value}
      </TableCell>
    </TableRow>
  ))}

        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleTableModal = () => {
    handleOpenModal("Parameter Status", <ParameterTable height="100%" />);
  };
  return (
    <div style={{ padding: "20px", background: "white" }}>
      <Grid
        container
        sx={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
      >
        {/* {["Device"].map((field) => (
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
                value={cbmData[field]}
                onChange={handleInputChange}
                label={`Select ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
              >
                {/* <MenuItem value="">{`Select ${field.charAt(0).toUpperCase() + field.slice(1)}`}</MenuItem> */}
                {/* <MenuItem value="1">Spindle</MenuItem>
                <MenuItem value="2">zAxis</MenuItem>
              </Select>
            </FormControl> */}
          {/* </Grid> */}
        {/* ))}  */}
        <Grid item>
          <Button
            variant="contained"
            onClick={handleGetOEEData}
            sx={{ backgroundColor: "#1FAEC5", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Ok"}
          </Button>
        </Grid>
        <Grid sx={{ marginLeft: "1em" }}>
          <Button
            variant="contained"
            onClick={handleGetOEEData}
            sx={{ backgroundColor: "#1FAEC5", color: "white" }}
          >
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/iconicdashboard"
            >
              {" "}
              Cockpit View
            </Link>
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {dataFetched && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ mb: 0, backgroundColor: "#f5f5f5" }}
            >
              <Table size="small">
                <TableBody>
                  {boxData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          sx={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            background: "#801580",
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: "white",
                                marginRight: "4px",
                                fontSize: "18px",
                              }}
                            >
                              {cell.heading}
                            </Typography>
                            {cell.dataKey && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                  color: "white",
                                }}
                              >
                                : {cardData[cell.dataKey]}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {charts.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} marginTop={1}>
              <Box
                height={300}
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
                      data.type === "table"
                        ? handleTableModal()
                        : handleOpenModal(
                            data.title,
                            renderLineChart(
                              chartData[data.dataKey],
                              data.title,
                              data.dataKeys
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
                  {data.type === "table" ? (
                    <ParameterTable />
                  ) : (
                    renderLineChart(
                      chartData[data.dataKey],
                      data.title,
                      data.dataKeys
                    )
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

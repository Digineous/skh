import { Slider } from "@mui/material";
import { useState } from "react";
import { BarChart, LineChart } from "@mui/x-charts";

export default function ChartWithSlider({ chart }) {
  const [sliderValue, setSliderValue] = useState([0, chart.data.length - 1]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const slicedData = chart.data.slice(sliderValue[0], sliderValue[1] + 1);
  const slicedXAxis = chart.xAxis.slice(sliderValue[0], sliderValue[1] + 1);

  return (
    <div>
      {chart.type === "bar" ? (
        <BarChart
          xAxis={[{ scaleType: 'band', data: slicedXAxis }]}
          series={[{ data: slicedData }]}
          width={450}
          height={200}
        />
      ) : (
        <LineChart
          xAxis={[{ scaleType: 'time', data: slicedXAxis }]}
          series={[{ data: slicedData }]}
          width={450}
          height={200}
        />
      )}
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={chart.data.length - 1}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
}

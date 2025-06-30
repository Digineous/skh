

import * as React from "react";
import Stack from "@mui/material/Stack";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import '../assets/css/guagechart.css';

export default function GaugeChart() {
  return (
    <Stack 
      direction={{ xs: "column", md: "row" }} 
      spacing={{ xs: 1, md: 3 }}  
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 30,
          fill: '#ffffff',
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#52b202',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    >
      <Gauge 
        width={200} 
        height={200} 
        value={50} 
        valueLabelFormat={(value) => `${value}%`} 
      />
    </Stack>
  );
}


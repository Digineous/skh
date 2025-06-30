import React from 'react';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc,useGaugeState } from '@mui/x-charts/Gauge';

const GaugeWithPointer = ({ width, height, value ,start}) => {
  const { outerRadius, cx, cy, valueAngle } = useGaugeState();

  if (valueAngle === null) {
    return <div>Error: Invalid gauge state</div>;
  }
  

  const pointerX = cx + outerRadius * Math.sin(valueAngle);
  const pointerY = cy - outerRadius * Math.cos(valueAngle);

  return (
    <GaugeContainer
    width={width}
    height={height}
    startAngle={start || -110} // Use `start` prop if provided, otherwise default to -110
    endAngle={110}
    value={value}
  >
    <GaugeValueArc />
    <GaugeReferenceArc />
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      {/* Gauge pointer path */}
      <path
        d={`M ${cx} ${cy} L ${pointerX} ${pointerY}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  </GaugeContainer>
  
  );
};

export default GaugeWithPointer;

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  LabelList
} from 'recharts';

const ProductionQualityChart = ({ data, oeeLatestData }) => {
  
    


  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}    margin={{ top: 5, right: 20, bottom: 20, left: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hourBucket" 
          stroke="#000000"
          fontSize="14px"
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -5,
            style: { fontWeight: "bold" },
            fill: "#000000"
          }}
        />
        <YAxis 
          stroke="#000000"
          label={{ 
            value: "Nos", 
            angle: -90, 
            position: 'insideLeft',
            dy: 10,
            dx: 10,
            fill: "#000000",  style: { fontWeight: "bold" },
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
          name="Actual Production" 
          fill="#0099ff"
          barSize={20}>
          <LabelList dataKey="actualProduction" position="top" fontSize={12} fill="#000000" />

          </Bar>
       
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke="black" 
          name="Target"
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ProductionQualityChart;
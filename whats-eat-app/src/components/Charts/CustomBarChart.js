import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CustomBarChart = ({ data, dataKeyX, labelX, color}) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 32,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey={dataKeyX}
        label={{
          value: labelX,
          position: "insideBottom",
          offset: -15,
          textAnchor: "bottom",
        }}
      />
      <YAxis
        label={{
          value: "Số lượng (sản phẩm)",
          angle: -90,
          position: "insideLeft",
          textAnchor: "bottom",
        }}
      />
      <Tooltip />
      <Legend verticalAlign="top" />
      <Bar dataKey="Số lượng bán" fill={color} />
    </BarChart>
  );
};

export default CustomBarChart;

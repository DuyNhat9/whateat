import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#dc4f43"];
const CustomPieChart = ({ data }) => {
  return (
    <PieChart width={800} height={300}>
      <Tooltip />
      <Pie
        data={data}
        cx={120}
        cy={120}
        innerRadius={80}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CustomPieChart;

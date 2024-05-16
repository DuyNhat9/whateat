import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CustomLineChart = ({ data }) => {
  return (
    <LineChart
      width={700}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 50,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="Ngày"
        label={{
          value: "Thống kê doanh thu từng ngày trong tháng",
          position: "bottom",
          textAnchor: "bottom",
        }}
      />
      <YAxis
        label={{
          value: "Doanh thu (triệu đồng)",
          angle: -90,
          position: "insideBottomLeft",
          textAnchor: "bottom",
        }}
      />
      <Tooltip />
      <Legend verticalAlign="right" />
      <Line type="monotone" dataKey="Doanh thu" stroke="#dc4f43" />
    </LineChart>
  );
};

export default CustomLineChart;

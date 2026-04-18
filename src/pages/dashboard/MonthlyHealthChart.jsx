import React from "react";
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis
} from "recharts";
import "./salomatlik-indeksi.css";

// Rasmga asoslanib taxminiy ma'lumotlar
const data = [
  { name: "Jan", value: 28 },
  { name: "Feb", value: 18 },
  { name: "Mar", value: 55 },
  { name: "Apr", value: 10 },
  { name: "May", value: 42 },
  { name: "Jun", value: 25 },
  { name: "Jul", value: 88 },
  { name: "Aug", value: 60 },
  { name: "Sep", value: 48 },
  { name: "Oct", value: 95 },
  { name: "Nov", value: 78 },
  { name: "Dec", value: 5 },
];

// Ustunlarning yuqori qismini yumaloq qilish uchun maxsus komponent
const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  const radius = height < 10 ? 0 : 8;

  return (
    <g>
      <path
        d={`M${x},${y + height}
           L${x},${y + radius}
           A${radius},${radius},0,0,1,${x + radius},${y}
           L${x + width - radius},${y}
           A${radius},${radius},0,0,1,${x + width},${y + radius}
           L${x + width},${y + height}
           Z`}
        fill={fill}
      />
    </g>
  );
};

export default function SalomatlikIndeksiChart() {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return (
    <div className="siCard">
      <h2 className="siTitle">SALOMATLIK INDEKSI</h2>

      <div className="siMain">
        {/* Chap tomondagi oylar */}
        <div className="siMonths">
          {months.map((m) => (
            <div key={m} className="siMonth">
              {m}
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="siChartWrap">
          {/* Arrowlar */}
          <div className="siArrowUp" aria-hidden="true" />
          <div className="siArrowRight" aria-hidden="true" />

          <ResponsiveContainer width="100%" >
            <BarChart data={data} margin={{ top: 10, right: 0, left: -30, bottom: 10 }} barCategoryGap="20%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#82C7FF" />
                  <stop offset="100%" stopColor="#60AFFF" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="white" strokeWidth={2} />
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={false} />

              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                formatter={(value) => [value, "Bemorlar"]}
                  labelFormatter={(label) => `Oy: ${label}`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#0056b3",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ fontWeight: "bold" }}
              />

              <Bar key={'name'}  dataKey="value" fill="url(#barGradient)" shape={<RoundedBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

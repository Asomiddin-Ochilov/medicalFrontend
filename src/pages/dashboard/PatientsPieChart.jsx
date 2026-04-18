import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./pie.css";


const RADIAN = Math.PI / 180;

const COLORS = ["#0b4fb6", "#3f7fe0", "#79b6ff"];


export default function PieCircle({
  title = "BE’MORLAR",
  data = [
    { label: "MEN", value: 62, color: "#0E4EA9" },
    { label: "WOMEN", value: 26, color: "#3D84DE" },
    { label: "CHILDREN", value: 10, color: "#79B8FF" },
  ],
  size = 200,
  showLabels = false, // rasmdagidek label shart bo'lmasa false qoldiring
}) {
  const chartData = useMemo(
    () => data.map((d) => ({ name: d.label, value: Number(d.value) || 0, color: d.color })),
    [data]
  );

  const total = useMemo(
    () => chartData.reduce((s, x) => s + x.value, 0) || 1,
    [chartData]
  );

 const fmt = (v) => `${Math.round(v)}%`;

  return (
    <div className="pieCard">
      <div className="pieTitle">{title}</div>

      <div className="pieBody">
       
        <div className="pieWrap" style={{ width: size, height: size }}>
          <ResponsiveContainer width="100%" >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="0%"   
                outerRadius="90%"
                paddingAngle={2}
                labelLine={false}
                label={showLabels ? renderLabel : false}
                isAnimationActive={false}
              >
              {chartData.map((d, i) => (
  <Cell
    key={i}
    fill={COLORS[i % COLORS.length]}
  />
))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND */}
        <div className="pieLegend">
           
          {data.map((d) => (
            <div className="pieRow" key={d.label}>
              <div className="pieLeft">
                <span className="pieDot" style={{ background: d.color }} />
                <span style={{ color: d.color }}  className="pieLabel"> {d.label}</span>
              </div>
              <div className="pieVal">{fmt(((Number(d.value) || 0) / total) * 100)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

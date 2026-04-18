import React from "react";
import "./disease-chart.css";

const DiseaseChart = () => {
  const data = [
    { label: "YURAK-QON TOMIR", percentage: 57.6 },
    { label: "BOSHQA KASALLIKLAR", percentage: 15.7 },
    { label: "RAK", percentage: 9.4 },
    { label: "NAFAS OLISH YO'LLARI", percentage: 6.3 },
    { label: "TRAVMALAR", percentage: 5.8 },
    { label: "HAZM QILISH TIZIM", percentage: 4.1 },
    { label: "INFEKSIYALAR", percentage: 1.1 },
    { label: "BUYRAK", percentage: 0.9 },
  ];

  return (
    <div className="dcCard">
      <h2 className="dcTitle">Kasallik Turi</h2>

      <div className="dcList">
        {data.map((item, index) => {
          // zinapoya effekt (rasmdagidek)
          const width = `${100 - index * 6}%`;

          return (
            <div
              key={index}
              className={`dcRow ${index !== data.length - 1 ? "dcRowBorder" : ""}`}
              style={{ width }}
              title={`${item.label} — ${item.percentage}%`}
            >
              <span className="dcPct">{item.percentage}%</span>
              <span className="dcLabel">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiseaseChart;

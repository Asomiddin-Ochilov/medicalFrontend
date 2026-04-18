import React,{useState} from "react";

import PatientsPieChart from "./PatientsPieChart";
import MonthlyHealthChart from "./MonthlyHealthChart";
import DiseaseChart from "./DiseaseChart";

import img1 from './img/1.svg'
import img2 from './img/2.svg'
import img3 from './img/3.svg'
import doctor from './img/doctor.svg'
import gold from './img/gold.svg'
import calendar from './img/calendar.svg'




import "./dashboard.css";
import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";



// --- Ma'lumotlar ---
const mockData = [
  { id: 1, name: "Laylo Ergasheva", date: "12.03.23", amount: "200$", status: "tolangan" },
  { id: 2, name: "Shahzod Toirov", date: "01.05.21", amount: "150$", status: "tolanmagan" },
  { id: 3, name: "Malika Komilova", date: "07.08.21", amount: "3.000$", status: "tolangan" },
  { id: 4, name: "Diyor Karimov", date: "01.05.21", amount: "180$", status: "tolanmagan" },
  { id: 5, name: "Islom Abdug'afforov", date: "01.05.21", amount: "50$", status: "tolangan" },
  { id: 6, name: "Javohir Qodirov", date: "29.10.23", amount: "50$", status: "tolangan" },
  { id: 7, name: "Nodira Sattorova", date: "01.05.21", amount: "200$", status: "tolanmagan" },
];


export default function Dashboard() {

  

 const [q, setQ] = useState("");

  const monthData = [
    { month: "Yan", count: 40 },
    { month: "Fev", count: 32 },
    { month: "Mar", count: 55 },
    { month: "Apr", count: 29 },
    { month: "May", count: 48 },
    { month: "Iyn", count: 35 },
    { month: "Iyl", count: 63 },
    { month: "Avg", count: 52 },
    { month: "Sen", count: 58 },
    { month: "Okt", count: 44 },
    { month: "Noy", count: 39 },
    { month: "Dek", count: 50 },
  ];

  const diseaseData = [
    { name: "Yurak", value: 57.8 },
    { name: "Boshqa", value: 15.7 },
    { name: "Rak", value: 9.4 },
    { name: "Nafas", value: 6.3 },
    { name: "Travma", value: 5.1 },
    { name: "Hazm", value: 4.1 },
    { name: "Infeksiya", value: 1.9 },
    { name: "Buyrak", value: 0.9 },
  ];

  return (
    <div>
      <div
      style={{
        display: "flex",
        gap: "16px",
        marginTop:'30px'
      }}
    >
       
      <PatientsPieChart  />
     
      <MonthlyHealthChart  />
      <DiseaseChart  />

    </div>
     <div className="db">
      {/* Top Cards */}
      <div className="dbTopCards">
        <div className="dbCard">
          <div className="dbCardLeft">
            <div className="dbCardValueRow">
              <img src={gold} alt="" />
              <span className="dbCardValue dbRevenueValue">98.026$</span>
            </div>
            <div className="dbCardLabel">REVENUE</div>
          </div>
          <div className="dbCardRight">
             <img src={img1} alt="" />
            </div>
        </div>

        <div className="dbCard">
          <div className="dbCardLeft">
            <div className="dbCardValueRow">
               <img src={calendar} alt="" />
              <span className="dbCardValue dbAppointmentsValue">624</span>
            </div>
            <div className="dbCardLabel">APPOINTMENTS</div>
          </div>
          <div className="dbCardRight">
             <img src={img2} alt="" />
          </div>
        </div>

        <div className="dbCard">
          <div className="dbCardLeft">
            <div className="dbCardValueRow">
               <img src={doctor} alt="" />
              <span className="dbCardValue dbDoctorsValue">340</span>
            </div>
            <div className="dbCardLabel">DOCTORS</div>
          </div>
          <div className="dbCardRight">
             <img src={img3} alt="" />
            </div>
        </div>
      </div>

      {/* Header */}
      <div className="dbHeader">
        <h2 className="dbHeaderTitle">Qarzdorlar</h2>
      </div>

      {/* Controls */}
      <div className="dbControls">
        <SearchInput value={q} onChange={setQ} />

        <PrimaryButton
                    // onClick={() => navigate("/users/add")}
                    className="users-addBtn"
                  >
                    Bemor qo‘shish
                  </PrimaryButton>
      </div>

      {/* Table */}
      <div className="dbTableBox">
        <div className="dbTableTop">
          <span className="dbTableTitle">Qarzdorlar royxati</span>
          <div className="dbTabs">
            <span>| Hammasi</span>
            <span>| Tolaganlar</span>
            <span>| Tolamaganlar</span>
            <span>| Qisman Tolaganlar</span>
          </div>
        </div>

        <table className="dbTable">
          <thead>
            <tr>
              <th className="dbTh dbThAvatar"></th>
              <th className="dbTh">ism/familiya</th>
              <th className="dbTh">sana</th>
              <th className="dbTh">umumiy summa</th>
              <th className="dbTh dbThCenter">status</th>
            </tr>
          </thead>

          <tbody>
            {mockData.map((row) => (
              <tr className="dbTr" key={row.id}>
                <td className="dbTd">
                  <img
                    className="dbAvatar"
                    src={`https://randomuser.me/api/portraits/women/${row.id + 10}.jpg`}
                    alt="user"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </td>
                <td className="dbTd">{row.name}</td>
                <td className="dbTd">{row.date}</td>
                <td className="dbTd">{row.amount}</td>
                <td className="dbTd dbTdCenter">
                  <span className={`dbBadge ${row.status === "tolangan" ? "isPaid" : "isUnpaid"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    
  );
}

import React,{useState,useEffect} from "react";

import PatientsPieChart from "./PatientsPieChart";
import MonthlyHealthChart from "./MonthlyHealthChart";
import DiseaseChart from "./DiseaseChart";

import img1 from './img/1.svg'
import img2 from './img/2.svg'
import img3 from './img/3.svg'
import doctor from './img/doctor.svg'
import gold from './img/gold.svg'
import calendar from './img/calendar.svg'
import api from '../../apibaseURL'



import "./dashboard.css";
import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";
import { useNavigate } from "react-router-dom";





export default function Dashboard() {

  
  const navigate = useNavigate()
  const [patients, setPatients] = useState([]);
const [tab, setTab] = useState("all");
const [loading, setLoading] = useState(false);
 const [q, setQ] = useState("");

 const changeSearch=(e)=>{
 
 setQ(e.target.value)
 
 }
const loadPatients = async (selectedTab = "all", searchText = "") => {
  try {
    setLoading(true);

    const params = new URLSearchParams();

    if (selectedTab !== "all") {
      params.append("status", selectedTab);
    }

    if (searchText.trim()) {
      params.append("search", searchText);
    }

    const res = await api.get(`/patients/payments?${params.toString()}`);
    setPatients(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const timer = setTimeout(() => {
    loadPatients(tab, q);
  }, 400);

  return () => clearTimeout(timer);
}, [tab, q]);


const maleCount = patients?.filter(p => p.gender === "male").length;
const femaleCount = patients?.filter(p => p.gender === "female").length;

const genderChartData = [
  {
    label: "ERKAK",
    value: maleCount,
    color: "#0E4EA9"
  },
  {
    label: "AYOL",
    value: femaleCount,
    color: "#3D84DE"
  }
];



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
       
      <PatientsPieChart
  title="BEMORLAR"
  data={genderChartData}
/>
     
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
        <SearchInput value={q} onChange={changeSearch} />

        <PrimaryButton
                    onClick={() => navigate("/bemor-qoshish")}
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
  <span style={{cursor:'pointer'}} onClick={() => setTab("all")}>| Hammasi</span>
  <span style={{cursor:'pointer'}} onClick={() => setTab("paid")}>| Tolaganlar</span>
  <span style={{cursor:'pointer'}} onClick={() => setTab("debt")}>| Qarzdorlar</span>
  <span style={{cursor:'pointer'}} onClick={() => setTab("partial")}>| Qisman Tolaganlar</span>
</div>
        </div>

        <table className="dbTable">
          <thead>
            <tr>
              <th className="dbTh dbThAvatar"></th>
              <th className="dbTh">ism/familiya</th>
              <th className="dbTh">sana</th>
              <th className="dbTh">umumiy summa</th>
              <th className="dbTh">to'langan summa</th>
              <th className="dbTh">qarz summa</th>
              <th className="dbTh dbThCenter">status</th>
            </tr>
          </thead>

    <tbody>
  {loading ? (
    <tr>
      <td colSpan="7" className="dbLoading">
        Yuklanmoqda...
      </td>
    </tr>
  ) : (
    patients.map((row) => {
      const total = row.payment?.total || 0;
      const paid = row.payment?.paid || 0;
      const debt = row.payment?.debt || 0;

      const status =
        debt === 0
          ? "Tolangan"
          : paid > 0
          ? "Qisman"
          : "Qarzdor";

      return (
        <tr className="dbTr" key={row._id}>
          <td className="dbTd">
            <img
              className="dbAvatar"
              src={`https://ui-avatars.com/api/?name=${row.userName}`}
              alt=""
            />
          </td>

          <td className="dbTd">{row.userName}</td>
          <td className="dbTd">{row.appointment?.date}</td>
          <td className="dbTd">{total.toLocaleString()} so'm</td>
          <td className="dbTd">{paid.toLocaleString()} so'm</td>
          <td className="dbTd">{debt.toLocaleString()} so'm</td>

          <td className="dbTd dbTdCenter">
            <span className={`dbBadge ${
              status === "Tolangan"
                ? "isPaid"
                : status === "Qisman"
                ? "isPartial"
                : "isUnpaid"
            }`}>
              {status}
            </span>
          </td>
        </tr>
      );
    })
  )}
</tbody>
        </table>
      </div>
    </div>
    </div>
    
  );
}

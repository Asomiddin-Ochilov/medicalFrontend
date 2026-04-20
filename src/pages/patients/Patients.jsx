import React, { useEffect, useRef, useState } from "react";
import { Table, message } from "antd";
import api from "../../apibaseURL";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import SearchInput from "../../app/SearchInput";
import FilterPopupButton from "../../app/FilterPopupButton";
import PrimaryButton from "../../app/PrimaryButton";
import "../../styles/patients.css";
export default function Patients() {
  const [patients, setPatients] = useState([]);
const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState(""); // search input
  
  const filterWrapRef = useRef(null);

const [openFilter, setOpenFilter] = useState(false);
const [f, setF] = useState({
  day: "",
  month: "",
  year: "",
  regDate: "",
  passport: ""
});

const handleFilterSave = (filters) => {
  console.log("FILTER:", filters);
  fetchPatients(filters); // API ga yuborish
};
  
  const navigate = useNavigate();
 

  const fetchPatients = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("med_auth_token");

    const res = await api.get("/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPatients(res.data);
    console.log(res.data);
    
    setAllPatients(res.data); // 🔥 originalni saqlab qo‘yamiz
  } catch (err) {
    console.error(err);
    message.error("Bemorlarni yuklashda xatolik");
  } finally {
    setLoading(false);
  }
};

  // 🔹 Page ochilganda barcha bemorlarni olish
  useEffect(() => {
    fetchPatients();
  }, []);


  useEffect(()=>{
    
  },[setQ])

  
  const searchFunc = (value) => {
  if (!value.trim()) {
    setPatients(allPatients);
    return;
  }

  const filtered = allPatients.filter((item) =>
    item.userName.toLowerCase().includes(value.toLowerCase())
  );

  setPatients(filtered);
};


  const searchChange=(event)=>{
   
    setQ(event.target.value)
   
    
  }
    

  const columns = [
    {
      title: "Ism/familiya",
      render: (_, record) => `${record.userName}`,
    },
    { title: "Passport id", dataIndex: "passport" },
    {
  title: "Tug‘ilgan sana",
  render: (_, record) =>
    record.birth ? dayjs(record.birth).format("DD.MM.YYYY") : "-",
},
    {
  title: "Jinsi",
  render: (_, record) => {
    if (record.gender === "male" || record.gender === "erkak") return "Erkak";
    if (record.gender === "female" || record.gender === "ayol") return "Ayol";
    return "-";
  },
},
    { title: "Mobil Raqami", dataIndex: "phone" },
    {
  title: "Ro‘yxatga olingan sana",
  render: (_, record) =>
    dayjs(record.createdAt).format("DD.MM.YYYY"),
},
    { title: "Ko'rik", dataIndex: "" },
  ];


useEffect(() => {
  let filtered = [...allPatients];

  // 🔹 Username search
  if (q.trim()) {
    filtered = filtered.filter((item) =>
      item.userName.toLowerCase().includes(q.toLowerCase())
    );
  }

  // 🔹 Birth filter
  if (f.day || f.month || f.year) {
    filtered = filtered.filter((item) => {
      if (!item.birth) return false;

      const date = dayjs(item.birth);

      const matchDay = f.day ? date.format("D") === f.day : true;
      const matchMonth = f.month ? date.format("M") === f.month : true;
      const matchYear = f.year ? date.format("YYYY") === f.year : true;

      return matchDay && matchMonth && matchYear;
    });
  }

  // 🔹 Ro‘yxatdan o‘tgan sana
  if (f.regDate) {
    filtered = filtered.filter((item) =>
      dayjs(item.createdAt).format("DD.MM.YYYY") === f.regDate
    );
  }

  // 🔥 PASSPORT FILTER
  if (f.passport) {
    filtered = filtered.filter((item) =>
      item.passport
        ?.toLowerCase()
        .includes(f.passport.toLowerCase())
    );
  }

  setPatients(filtered);
}, [q, f, allPatients]);

  return (
     <div className="page page-patients">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="left">
          <SearchInput value={q} searchFunc={searchFunc} onChange={searchChange} />
          <div className="filterWrap">
           <FilterPopupButton
  open={openFilter}
  setOpen={setOpenFilter}
  wrapRef={filterWrapRef}
  f={f}
  setF={setF}
  onSave={handleFilterSave}
/>
          </div>
        </div>

        <PrimaryButton onClick={() => navigate("/bemor-qoshish")}>
          Bemor qo‘shish
        </PrimaryButton>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <Table
          columns={columns}
          dataSource={patients}
          rowKey="_id"
          loading={loading}
          pagination={false}
          size="middle"
          className="patients-table"
          onRow={(record) => ({
            onClick: () =>
              navigate(`/bemorlar/${record._id}`, { state: record }),
          })}
        />
      </div>
    </div>
  );
}

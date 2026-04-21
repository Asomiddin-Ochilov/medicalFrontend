import React, { useMemo, useState,useEffect } from "react";
import { Table,message, Modal } from "antd";
import "./main.css";
import { useNavigate } from "react-router-dom";
import api from '../../apibaseURL'
import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";
import { EditOutlined } from "@ant-design/icons";



export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
const [loading, setLoading] = useState(true);
const [hrOpen, setHrOpen] = useState(false);
const [hrData, setHrData] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
const currentUser = JSON.parse(localStorage.getItem("med_user"));
  const pageSize = 10;

const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();
  if (!s) return users;

  return users.filter((r) => {
    const name = r.username?.toLowerCase() || ""; // backendda username bor
    console.log(name);
    
    const phone = r.phone || "";
    const email = r.email?.toLowerCase() || "";
    return name.includes(s) || phone.includes(s) || email.includes(s);
  });
}, [q, users]);

  const total = filtered.length;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);


  const fetchUsers = async () => {
  try {
    
    const token = localStorage.getItem("med_auth_token");

    const res = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Backenddan kelgan ma'lumot
    setUsers(res.data);
    setUsersAll(res.data);
    console.log(res.data);
    setLoading(false);
  } catch (err) {
    console.error(err);
    message.error("Foydalanuvchilarni yuklashda xatolik");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchUsers();
}, []);


 const searchFunc = (value) => {
  if (!value.trim()) {
    setUsersAll(usersAll);
    return;
  }

  const filtered = usersAll.filter((item) =>
    item.username.toLowerCase().includes(value.toLowerCase())
  );

  usersAll(filtered);
};


 const searchChange=(event)=>{
    console.log(event.target.value);
    setQ(event.target.value)
    
  }


  useEffect(() => {
    let filtered = [...usersAll];
  
    // 🔹 Username search
    if (q.trim()) {
      console.log(usersAll);
      console.log(q);
      
      filtered = filtered.filter((item) =>
        item.username.toLowerCase().includes(q.toLowerCase())
      );
    }
  
    // 🔹 Birth date filter (day / month / year)
    // if (f.day || f.month || f.year) {
    //   filtered = filtered.filter((item) => {
    //     if (!item.birth) return false;
  
    //     const date = new Date(item.birth);
  
    //     const day = date.getDate().toString();
    //     const month = (date.getMonth() + 1).toString();
    //     const year = date.getFullYear().toString();
  
    //     const matchDay = f.day ? day === f.day : true;
    //     const matchMonth = f.month ? month === f.month : true;
    //     const matchYear = f.year ? year === f.year : true;
  
    //     return matchDay && matchMonth && matchYear;
    //   });
    // }
  
    setUsers(filtered);
  }, [q,  ]);

 const columns = [
  { title: "Ism/Familiya", dataIndex: "name" },
  { title: "Telefon Raqami", dataIndex: "phone" },
  { title: "Pochta", dataIndex: "email" },
  { title: "Login", dataIndex: "login" },
  {
    title: "Parol",
    dataIndex: "password",
    render: (val) => (val ? "********" : "********"), // backenddan kelmaydi, faqat ko‘rsatish
  },
  {
    title: "Taxrirlash",
    key: "edit",
    align: "right",
    render: (_, record) => (
      
      <button
        className="users-editCellBtn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/users/${record.key}/edit`, { state: record });
        }}
      >
    
        <EditOutlined />
      </button>
    ),
  },
];

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => (p * pageSize >= total ? p : p + 1));

  return (
    <div className="users-page">
      <div className="users-toolbar">
        <div className="users-leftTools">
          <div className="users-searchWrap">
            <SearchInput value={q} searchFunc={searchFunc} onChange={searchChange} />
          </div>

     {currentUser?.position === "Manager" && (
  <button
    className="users-hrBtn"
    type="button"
    onClick={() => navigate("/users/hr")}
  >
    HR
  </button>
)}
        </div>

        <div className="users-rightTools">
          <div className="users-pager">
            <span className="users-range">
              {from}-{to} &nbsp;of&nbsp; <b>{total}</b>
            </span>

            <button className="users-navBtn" onClick={prev} type="button">
              ‹
            </button>
            <button className="users-navBtn" onClick={next} type="button">
              ›
            </button>
          </div>

          <PrimaryButton
            onClick={() => navigate("/users/add")}
            className="users-addBtn"
          >
            Hodim qo‘shish
          </PrimaryButton>
        </div>
      </div>

      <div className="users-tableFrame">
        <div className="users-tableInner">
      <Table
      loading={loading}
  columns={columns}
  dataSource={users.map((u) => ({
    key: u._id,
    name: u.username,      // agar firstName/lastName bo'lsa `${u.firstName} ${u.lastName}` qilsa bo'ladi
    phone: u.phone,
    email: u.email,
    login: u.login,
    password: "",           // backendda password kelmaydi, shuning uchun bo'sh
  }))}
  rowKey="key"
  pagination={false}
  size="middle"
  className="users-table"
  onRow={(record) => ({ onClick: () => navigate(`/users/${record.key}`), })}
/>
        </div>

        {/* <button className="users-editBtn" type="button">
          O‘zgartirish
        </button> */}
      </div>
    </div>
  );
}

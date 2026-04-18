import React, { useMemo, useState,useEffect } from "react";
import { Avatar, Dropdown,Modal, Drawer ,Badge} from "antd";
import { useNavigate } from "react-router-dom";
import api from '../apibaseURL'
import {SettingOutlined,
  LogoutOutlined,  BellOutlined, MoonOutlined, GlobalOutlined,SunOutlined  } from "@ant-design/icons";
import "../styles/navbar.css";
import img from '../pages/avatar.webp'
export default function Navbar({ title = "",toggleTheme,themeMode }) {
  const [lang, setLang] = useState(localStorage.getItem("med_lang") || "uzb");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [openNotif, setOpenNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
const userId = userData?._id;

  const onLangClick = ({ key }) => {
    setLang(key);
    localStorage.setItem("med_lang", key);
  };
  const navigate = useNavigate();


  const getNotifications = async (userId) => {
  const res = await api.get(`/notifications/${userId}`);
  return res.data;
};



const fetchData = async () => {
    if (!userId) return;

    try {
      const data = await getNotifications(userId);
      console.log(data);
      
      setNotifications(data);
    } catch (err) {
      console.log("Notification error:", err.message);
    }
  };

useEffect(() => {
  

  fetchData();
}, [userId]);

const unreadCount = notifications.filter(n => !n.isRead).length;


const handleUserMenuClick = ({ key }) => {
  if (key === "settings") {
    navigate("/settings");
  }

  if (key === "logout") {
    Modal.confirm({
      title: "Chiqmoqchimisiz?",
      okText: "Ha, chiqaman",
      cancelText: "Bekor qilish",
      okType: "danger", // qizil button
      onOk: () => {
        localStorage.removeItem("med_auth_token");
      localStorage.removeItem("userData");
      localStorage.removeItem('admin_id')
        navigate("/login");
      },
    });
  }
};


const handleNotificationClick = async (item) => {
  console.log(item);
  
  try {
    // 1. read qilish (optional)
    await api.put(`/notifications/read/${item._id}`);

    // 2. state update
    setNotifications(prev =>
      prev.map(n =>
        n._id === item._id ? { ...n, isRead: true } : n
      )
    );

    // 3. redirect
    if (item.targetType === "PATIENT") {
      navigate(`/bemorlar/${item.targetId}`);
    }

    setOpenNotif(false);

  } catch (err) {
    console.log(err);
  }
};

const handleDeleteNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`);

    setNotifications(prev =>
      prev.filter(n => n._id !== id)
    );

  } catch (err) {
    console.log(err);
  }
};

 const Dropitems = [
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Sozlamalar",
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    danger: true,
    label: "Chiqish",
  },
];

  const items = useMemo(() => {
    const langs = [
      { key: "uzb", text: "O‘zbek" },
      { key: "ru", text: "Русский" },
      { key: "en", text: "English" },
    ];

    return langs.map((l) => ({
      key: l.key,
      label: (
        <div className="lang-item">
          <span className={`lang-check ${lang === l.key ? "on" : ""}`}>✓</span>
          <span className="lang-label">{l.text}</span>
        </div>
      ),
    }));
  }, [lang]);

  return (
    <div className="topbar">
      <div className="topbar-title-pill">
        <span className="topbar-title">{title || " "}</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-icons">
          <button  onClick={toggleTheme} className="topbar-ico-btn" type="button" title="Rejim">
            {themeMode === "dark" ? <SunOutlined /> : <MoonOutlined />}
          </button>

       <Badge count={unreadCount} size="small">
  <button
    className="topbar-ico-btn"
    type="button"
    title="Bildirishnoma"
    onClick={() => setOpenNotif(true)}
  >
    <BellOutlined />
  </button>
</Badge>

          <Dropdown
            menu={{ items, onClick: onLangClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="topbar-lang-btn" type="button" title="Til">
              <GlobalOutlined />
              <span className="topbar-lang-text">{lang}</span>
            </button>
          </Dropdown>
        </div>

      <div className="topbar-user">
<Dropdown
  menu={{
    items: Dropitems,
    onClick: handleUserMenuClick,
  }}
  trigger={["click"]}
  placement="bottomRight"
>
  <div className="topbar-user-box">
    <Avatar size={48} src={img} />
    <div className="topbar-user-text">
      <div className="topbar-user-name">{userData?.username}</div>
      <div className="topbar-user-role">{userData?.position}</div>
    </div>
  </div>
</Dropdown>

<Drawer
  title="Bildirishnomalar"
  placement="right"
  onClose={() => setOpenNotif(false)}
  open={openNotif}
  width={350}
  className="drawer_content"
>
  <div className="notif-list">
  {notifications.length === 0 ? (
    <div style={{ textAlign: "center", color: "#999" }}>
      Hech qanday bildirishnoma yo‘q
    </div>
  ) : (
    notifications.map((item) => (
     <div
  key={item._id}
  className="notif-item"
  style={{ cursor: "pointer", position: "relative" }}
>
  {/* DELETE BUTTON */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // click → profile ketmasin
      handleDeleteNotification(item._id);
    }}
    style={{
      position: "absolute",
      right: 10,
      top: 10,
      border: "none",
      background: "transparent",
      color: "red",
      fontSize: 16,
      cursor: "pointer"
    }}
  >
    ✕
  </button>

  <div onClick={() => handleNotificationClick(item)}>
    <div className="notif-title">{item.title}</div>
    <div className="notif-message">{item.message}</div>
    <div className="notif-time">
      {new Date(item.createdAt).toLocaleString()}
    </div>
  </div>
</div>
    ))
  )}
</div>
</Drawer>

</div>

      </div>
    </div>
  );
}

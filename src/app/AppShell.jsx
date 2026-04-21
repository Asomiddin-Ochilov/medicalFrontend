import React, { useEffect, useMemo, useState } from "react";
import { Layout, Tooltip } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";

import menu1 from "../assets/sidebar/menu1.svg";
import menu2 from "../assets/sidebar/menu2.svg";
import menu3 from "../assets/sidebar/menu3.svg";
import menu4 from "../assets/sidebar/menu4.svg";
import menu5 from "../assets/sidebar/menu5.svg";
import menu6 from "../assets/sidebar/menu6.svg";
import menu7 from "../assets/sidebar/menu7.svg";
import menu8 from "../assets/sidebar/menu8.svg";

import "../styles/appshell.css";
import Navbar from "./Navbar";

const { Sider, Content } = Layout;

export default function AppShell({toggleTheme,themeMode}) {
  const [collapsed, setCollapsed] = useState(false);
   const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
    console.log(userData);
  const location = useLocation();

const items = [
    { to: "/bemorlar", label: "Be‘morlar", icon: menu1, permission: "patients" },
    { to: "/kalendar", label: "Kalendar", icon: menu2, permission: "calendar" },
    { to: "/users", label: "Users", icon: menu3, permission: "users" },
    { to: "/price", label: "Price", icon: menu4, permission: "price" },
    { to: "/message", label: "Sms-xabar", icon: menu5, permission: "sms" },
    { to: "/dashboard", label: "Hisobot", icon: menu6, permission: "report" },
    { to: "/debtors", label: "Qarzdorlar", icon: menu7, permission: "debtors" },
    { to: "/settings", label: "Sozlamalar", icon: menu8, permission: "settings" },
  ];

 
const currentTitle = useMemo(() => {
  const path = location.pathname;

  // Patients
  if (path === "/bemor-qoshish") return "Be‘morlar";
  if (path === "/message") return "Pochta";
  if (/^\/bemorlar\/[^/]+$/.test(path)) return "Bemor profili";
  
  // ✅ Price
if (path === "/price/add") return "Maxsus Price";
if (/^\/price\/[^/]+$/.test(path)) return "Narx profili";
if (/^\/price\/[^/]+\/edit$/.test(path)) return "Narx tahrirlash";
 
  if (path === "/users/add") return "Users qo‘shish";
  if (/^\/users\/[^/]+$/.test(path)) return "Users profili";
  if (/^\/users\/[^/]+\/edit$/.test(path)) return "Users tahrirlash";

  // exact
  const exact = items.find((i) => i.to === path);
  if (exact) return exact.label;

  // nested
  const starts = items.find((i) => path.startsWith(i.to + "/"));
  if (starts) return starts.label;

  if (path === "/" || path === "") return "Bemorlar";
  return "";
}, [location.pathname]);



  useEffect(() => {
    const saved = localStorage.getItem("med_sider_collapsed");
    if (saved !== null) setCollapsed(saved === "1");
  }, []);

  const toggleSider = () => {
    setCollapsed((p) => {
      const next = !p;
      localStorage.setItem("med_sider_collapsed", next ? "1" : "0");
      return next;
    });
  };

  const isPatientsGroup = useMemo(() => {
    const p = location.pathname;
    return p === "/bemor-qoshish" || p.startsWith("/bemorlar");
  }, [location.pathname]);


    const filteredItems = items.filter((item) => item.permission === "settings" || userData?.permissions?.[item.permission]);

  const linkClass = (item) => ({ isActive }) => {
    const groupActive = item.to === "/bemorlar" && isPatientsGroup;
    return `menu-item ${isActive || groupActive ? "active" : ""}`;
  };

  return (
    <Layout className="shell">
      <Sider
        width={250}
        collapsedWidth={72}
        collapsed={collapsed}
        trigger={null}
        className={`sider ${collapsed ? "is-collapsed" : ""}`}
      >
        <div className="brand">
          <img className="brand-img" src={logo1} alt="logo" />
          <div className="brand-text">
            <div className="brand-title">MEDICAL</div>
            <div className="brand-sub">CLINIC</div>
          </div>
        </div>

        <nav className="menu">
           {filteredItems.map((item) => (
              <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass(item)}
            >
              {collapsed ? (
                <img className="menu-svg" src={item.icon} alt={item.label} />
              ) : (
                <>
                  <RightOutlined className="chev" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          
        </nav>

        <div className="sider-footer">
          <Tooltip title={collapsed ? "Ochish" : "Yopish"} placement="top">
            <button className="collapse-btn" onClick={toggleSider} type="button">
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </button>
          </Tooltip>
        </div>
      </Sider>

      <Content className="content">
        <Navbar themeMode={themeMode} toggleTheme={toggleTheme} title={currentTitle} />
        <Outlet />
      </Content>
    </Layout>
  );
}

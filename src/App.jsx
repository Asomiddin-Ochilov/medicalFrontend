import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate,Navigate } from "react-router-dom";

import api from '../src/apibaseURL'
import {  message,Spin } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Patients from "./pages/patients/Patients.jsx";
import OnePage from "./pages/patients/onepage.jsx";
import AddPatient from "./pages/patients/add.jsx";
import AppShell from "./app/AppShell.jsx";
import "./styles/base.css";
import SchedulePage from "./pages/calendar/schedulePage.jsx";
import EmployeePage from "./pages/employee/employee.jsx";
import PricePage from "./pages/price/price.jsx";
import AddHR from "./pages/employee/adduser.jsx";
import OneUser from "./pages/employee/oneuser.jsx";
import EditUser from "./pages/employee/edituser.jsx";
import PriceAdd from "./pages/price/addPrice.jsx";
import MessagePage from "./pages/message/message.jsx";
import DebtorsPage from "./pages/debtors/debtors.jsx";
import OnePageDebtors from "./pages/debtors/onepagedebtors.jsx";
import SettingsPage from "./pages/settings/settings.jsx";

const theme = {
  token: {
    colorPrimary: "#415FA1",
    borderRadius: 10,
  },
};


function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("med_auth_token");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await api.get(
          "/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
        localStorage.setItem("userData", JSON.stringify(res.data));
      } catch (err) {
        localStorage.removeItem("med_auth_token");
      localStorage.removeItem("userData");
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    fetchMe();
 
  }, [navigate]);

  if (checking) return <div className="loadingApp">
    <Spin size="large" />
  </div>;

  return user ? React.cloneElement(children, { user }) : <Navigate to="/login" replace />;
}

export default function App() {
  

   const [themeMode, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);


const { defaultAlgorithm, darkAlgorithm } = antdTheme;




const toggleTheme = () => {
  const newTheme = themeMode === "light" ? "dark" : "light";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);

  document.body.classList.remove("light", "dark");
  document.body.classList.add(newTheme);
};

useEffect(() => {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(themeMode);
}, [themeMode]);

  return (
    <ConfigProvider theme={{
    algorithm:
      themeMode === "dark" ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: "#415FA1",
      borderRadius: 10,
    },
  }}>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/" 
            element={
              <PrivateRoute>
                <AppShell themeMode={themeMode} toggleTheme={toggleTheme}  />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="bemorlar" replace />} />

            
            <Route path="users" element={<EmployeePage />} />
            <Route path="users/add" element={<AddHR />} />
            <Route path="users/:id" element={<OneUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="bemorlar" element={<Patients />} />
            <Route path="kalendar" element={<SchedulePage />} />

            <Route path="message" element={<MessagePage />} />


            <Route path="price" element={<PricePage />} />
            <Route path="price/add" element={<PriceAdd />} />
            
            <Route path="bemorlar/:id" element={<OnePage />} />

            <Route path="bemor-qoshish" element={<AddPatient />} />

            <Route path="dashboard" element={<Dashboard />} />

            <Route path="debtors" element={<DebtorsPage />} />

            <Route path="settings" element={<SettingsPage />} />
            
            <Route path="debtors/:id" element={<OnePageDebtors />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

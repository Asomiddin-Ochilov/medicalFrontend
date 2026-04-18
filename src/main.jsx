import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "antd/dist/reset.css";
 // import "./styles/base.css";
// import "./styles/appshell.css";
// import "./styles/login.css";
// import "./styles/login.css";
// import "./styles/dashboard.css";
import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <App />
  </BrowserRouter>
   
);

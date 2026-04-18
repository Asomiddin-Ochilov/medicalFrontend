import React, { useState,useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from '../apibaseURL'

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [emailVal, setEmailVal] = useState("");
  const [passVal, setPassVal] = useState("");
 const [loading, setLoading] = useState(false);

 const onFinish = async (values) => {
  setLoading(true);

  try {
    const res = await api.post(
      "/admin/login",
      {
        login: values.email,
        password: values.password,
      }
    );

    if (res.data?.token) {
      console.log(res.data.token);
      
      localStorage.setItem("med_auth_token", res?.data?.token);
      localStorage.setItem("admin_id", JSON.stringify(res?.data?.admin?.id));
      console.log(res.data);
      
      message.success("Kirish muvaffaqiyatli!");
      navigate("/bemorlar");
    } else {
      message.error("Login muvaffaqiyatsiz");
    }

  } catch (err) {
    message.error(err.response?.data?.message || "Login xato!");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }, []);


 

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-head">
          <div className="login-title">Log-in</div>
        </div>
        <div className="login-body">
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Login kiriting!" },
                { type: "text" },
              ]}
            >
              <div className={`float-input ${emailVal ? "has-value" : ""}`}>
                <input
                  className="login-input"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                />
                <label className="float-label">Login</label>
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Parolni kiriting!" }]}
            >
              <div className={`float-input ${passVal ? "has-value" : ""}`}>
                <input
  type="password"
  className="login-input"
  value={passVal}
  onChange={(e) => setPassVal(e.target.value)}
/>
                <label className="float-label">Password</label>
              </div>
            </Form.Item>

            <Button loading={loading} className="login-btn" type="primary" htmlType="submit">
              Kirish
            </Button>
          </Form>
        </div>

        <div className="login-foot" />
      </div>
    </div>
  );
}

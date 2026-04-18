import React, { useMemo, useState } from "react";
import "./adduser.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from '../../apibaseURL'
import { message } from "antd";
import img from './Vector.svg'
const PERMISSIONS = [
  { label: "Hisobot", key: "report" },
  { label: "HR", key: "hr" },
  { label: "Price", key: "price" },
  { label: "Sms-xabar", key: "sms" },
  { label: "Users", key: "users" },
  { label: "Be‘morlar", key: "patients" },
  { label: "Kalendar", key: "calendar" },
  { label: "Qarzdorlar", key: "debtors" },
];

const POSITIONS = [
  { label: "Boshliq", value: "Manager" },
  { label: "Doctor", value: "Doctor" },
  { label: "Xamshira", value: "Nurse" },
  { label: "Boshqa", value: "Other" },
];

export default function AddHR() {
  const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  login: "",
  password: "",
  position: "Other",
  permissions: {
    report: false,
    hr: false,
    price: false,
    sms: false,
    users: false,
    patients: false,
    calendar: false,
    debtors: false,
  },
});

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setField = (key) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, [key]: v }));
    // yozayotgan paytda errorni tozalash
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const togglePerm = (name) => (e) =>
    setForm((p) => ({
      ...p,
      permissions: { ...p.permissions, [name]: e.target.checked },
    }));

  const setPosition = (pos) => (e) => {
    if (!e.target.checked) return;
    setForm((p) => ({ ...p, position: pos }));
  };

  const selectedCount = useMemo(() => {
    return Object.values(form.permissions).filter(Boolean).length;
  }, [form.permissions]);

  const validate = () => {
  const e = {};
  const phone = form.phone?.trim() || "";
  const email = form.email?.trim() || "";

  if (!form.firstName?.trim()) e.firstName = "Ism majburiy";
  if (!form.lastName?.trim()) e.lastName = "Familiya majburiy";
  if (!phone) e.phone = "Telefon majburiy";
  if (!form.login?.trim()) e.login = "Login majburiy";
  if (!form.password?.trim()) e.password = "Parol majburiy";

  if (phone && phone.replace(/\D/g, "").length < 9) {
    e.phone = "Telefon raqam noto‘g‘ri";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = "Pochta noto‘g‘ri";
  }

  return e;
};

const generatePassword = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

  const focusFirstError = (eObj) => {
    const firstKey = Object.keys(eObj)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"]`);
    if (el) el.focus();
  };

  const onCancel = () => {
    setForm((p) => ({
      ...p,
      ism: "",
      familiya: "",
      telefon: "",
      pochta: "",
      login: "",
      parol: "",
      position: "Boshqa",
      permissions: Object.fromEntries(PERMISSIONS.map((k) => [k, false])),
    }));
    setErrors({});
    setShowPass(false);
    navigate("/users");
  };

  const onSave = async (e) => {
  e.preventDefault();

  const eObj = validate();
  setErrors(eObj);

  if (Object.keys(eObj).length) {
    focusFirstError(eObj);
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("med_auth_token");

    const data = {
      phone: form.phone,
      email: form.email,
      username: `${form.firstName} ${form.lastName}`,
      password: form.password, 
      login: form.login, 
      position: form.position,
      permissions: form.permissions,
    };

    const res = await api.post(
      "/users",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("NEW USER:", res.data);
    setSuccess(true);
    setLoading(false);
    message.success("Foydalanuvchi muvaffaqiyatli qo‘shildi");

    navigate("/users");
  } catch (err) {
    console.error(err);
    message.error("Foydalanuvchini saqlashda xatolik");
  }
};

  return (
    <div className="hrPage">
      <h2 className="hrTitle">HR qo‘shish:</h2>
       
       {success && (
  <div className="successOverlay">
    <div className="successBox">
      
      <h2>Saqlandi</h2>
      <div className="checkIcon">✓</div>
    </div>
  </div>
)} 

      <div className="hrCard">
        <form className="hrGrid" onSubmit={onSave}>
  {/* LEFT */}
  <div className="hrLeft">
    <div className="hrRow">
      <label>Ism:</label>
      <div className="field">
        <input
          name="firstName"
          value={form.firstName}
          onChange={setField("firstName")}
          className={errors.firstName ? "inp err" : "inp"}
        />
        {errors.firstName && (
          <div className="errText">{errors.firstName}</div>
        )}
      </div>
    </div>

    <div className="hrRow">
      <label>Familiya:</label>
      <div className="field">
        <input
          name="lastName"
          value={form.lastName}
          onChange={setField("lastName")}
          className={errors.lastName ? "inp err" : "inp"}
        />
        {errors.lastName && (
          <div className="errText">{errors.lastName}</div>
        )}
      </div>
    </div>

    <div className="hrRow">
      <label>Telefon raqami:</label>
      <div className="field">
        <input
          name="phone"
          value={form.phone}
          onChange={setField("phone")}
          className={errors.phone ? "inp err" : "inp"}
          placeholder="+998..."
          type="number"
        />
        {errors.phone && (
          <div className="errText">{errors.phone}</div>
        )}
      </div>
    </div>

    <div className="hrRow">
      <label>Pochta:</label>
      <div className="field">
        <input
          name="email"
          value={form.email}
          onChange={setField("email")}
          className={errors.email ? "inp err" : "inp"}
          placeholder="example@mail.com"
          type="email"
        />
        {errors.email && (
          <div className="errText">{errors.email}</div>
        )}
      </div>
    </div>

    <div className="hrRow">
      <label>Login:</label>
      <div className="field">
        <input
          name="username"
          value={form.login}
          onChange={setField("login")}
          className={errors.login ? "inp err" : "inp"}
        />
        {errors.login && (
          <div className="errText">{errors.login}</div>
        )}
      </div>
    </div>

    <div className="hrRow">
      <label>Parol:</label>

      <div className="field">
        <div className="passWrap">
          <input
            name="password"
            className={errors.password ? "passInput err" : "passInput"}
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={setField("password")}
          />
          <button
            className="passBtn"
            type="button"
            onClick={() => setShowPass((s) => !s)}
            title={showPass ? "Yashirish" : "Ko‘rsatish"}
          >
            {showPass ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
          <button
  type="button"
  className="generationbtn"
  onClick={() => setForm(p => ({ ...p, password: generatePassword() }))}
>
  <img src={img} alt="" />
</button>
        </div>

        {errors.password && (
          <div className="errText">{errors.password}</div>
        )}
      </div>
    </div>

    <div className="hrRow hrRowTop">
      <label>Pozitsiya:</label>

      <div className="posList">
        {POSITIONS.map((pos) => (
          <label key={pos.value} className="posItem">
            <input
              type="checkbox"
              checked={form.position === pos.value}
              onChange={() =>
                setForm((p) => ({ ...p, position: pos.value }))
              }
            />
            <span>{pos.label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>

  {/* RIGHT */}
  <div className="hrRight">
    <div className="permTitle">
      Ruxsatlar <span className="permBadge">{selectedCount}</span>
    </div>

    <div className="permList">
      {PERMISSIONS.map((perm) => (
        <div className="permRow" key={perm.key}>
          <input
            type="checkbox"
            checked={form.permissions[perm.key]}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                permissions: {
                  ...p.permissions,
                  [perm.key]: e.target.checked,
                },
              }))
            }
          />
          <div className="permPill">{perm.label}</div>
        </div>
      ))}
    </div>

    <div className="hrActions">
      <button className="btnCancel" type="button" onClick={onCancel}>
        Bekor qilish
      </button>
      <button className="btnSave" type="submit" disabled={loading}>
        {loading ? (
    <span className="btnLoading">
      <span className="spinner" /> Saqlanmoqda...
    </span>
  ) : (
    "Saqlash"
  )}
      </button>
    </div>
  </div>
</form>
      </div>
    </div>
  );
}

import React, { useMemo, useState, useEffect } from "react";
import "./adduser.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import img from './Vector.svg'
import api from '../../apibaseURL'
import { message } from "antd";
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

const POSITIONS = ["Boshliq", "Doctor", "Xamshira", "Boshqa"];

export default function EditHR() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data,setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);


  const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  login: "",
  password: "",
  position: "Boshqa",
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







const fetchUser = async () => {
  try {
    setPageLoading(true);

    const token = localStorage.getItem("med_auth_token");

    const res = await api.get(
      `/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = res.data;
    setData(res.data)
    const fullName = (user?.username || "").trim();
    const parts = fullName.split(" ");

    setForm({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      phone: user.phone || "",
      email: user.email || "",
      login: user.login || "",
      password: "",
      position: user.position || "Boshqa",
      permissions: user.permissions || {
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

  } catch (err) {
    message.error("Foydalanuvchini olishda xatolik");
  } finally {
    setPageLoading(false);
  }
};


  useEffect(() => {
    console.log('as');
    fetchUser()
 
  
}, [id]);


 const setField = (key) => (e) => {
  const v = e.target.value;
  setForm((p) => ({ ...p, [key]: v }));

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


  const generatePassword = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

  const setPosition = (pos) => (e) => {
    if (!e.target.checked) return;
    setForm((p) => ({ ...p, position: pos }));
  };

  const selectedCount = useMemo(() => {
    return Object.values(form.permissions).filter(Boolean).length;
  }, [form.permissions]);

  const validate = () => {
    const e = {};
    const phone = String(form.phone || "").trim();
    const email = String(form.email || "").trim();

    if (!form.lastName.trim()) e.lastName = "Ism majburiy";
    if (!form.firstName.trim()) e.firstName = "Familiya majburiy";
    if (!phone) e.phone = "Telefon majburiy";
    if (!form.login.trim()) e.login = "Login majburiy";

    if (phone && phone.replace(/\D/g, "").length < 9) {
      e.phone = "Telefon raqam noto‘g‘ri";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Pochta noto‘g‘ri";
    }

    return e;
  };

  const focusFirstError = (eObj) => {
    const firstKey = Object.keys(eObj)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"]`);
    if (el) el.focus();
  };

  const onCancel = () => {
    
    navigate("/users");
  };

const onSave = async (e) => {
  e.preventDefault();

  // Validatsiya
  const eObj = validate();
  setErrors(eObj);

  if (Object.keys(eObj).length) {
    focusFirstError(eObj);
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("med_auth_token");

    // PUT request uchun data
    const data = {
      phone: form.phone,
      email: form.email,
      username: `${form.firstName} ${form.lastName}`,
      password: form.password,
      login: form.login,
      position: form.position,
      permissions: form.permissions,
    };

    // id orqali foydalanuvchini tahrirlash
    const res = await api.put(
      `/users/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("UPDATED USER:", res.data);
    setLoading(false);
    message.success("Foydalanuvchi muvaffaqiyatli tahrirlandi");

    navigate("/users");
  } catch (err) {
    console.error(err);
    setLoading(false);
    message.error("Foydalanuvchini tahrirlashda xatolik");
  }
};

  return (
    <div className="hrPage">
      <h2 className="hrTitle">HR tahrirlash: <span style={{ fontWeight: 700 }}>#{data && data.username}</span></h2>

      <div className="hrCard">
        {
          pageLoading ? <div className="pageLoader">
      <div className="spinnerLarge" />
    </div> : <React.Fragment>
 <form className="hrGrid" onSubmit={onSave}>
          {/* LEFT */}
          <div className="hrLeft">
            <div className="hrRow">
              <label>Ism:</label>
              <div className="field">
                <input
                  name="ism"
                  value={form.firstName}
                  onChange={setField("firstName")}
                  className={errors.firstName ? "inp err" : "inp"}
                />
                {errors.firstName && <div className="errText">{errors.firstName}</div>}
              </div>
            </div>

            <div className="hrRow">
              <label>Familiya:</label>
              <div className="field">
                <input
                  name="familiya"
                  value={form.lastName}
                  onChange={setField("lastName")}
                  className={errors.lastName ? "inp err" : "inp"}
                />
                {errors.lastName && <div className="errText">{errors.lastName}</div>}
              </div>
            </div>

            <div className="hrRow">
              <label>Telefon raqami:</label>
              <div className="field">
                <input
                  name="telefon"
                  value={form.phone}
                  onChange={setField("phone")}
                  className={errors.phone ? "inp err" : "inp"}
                  placeholder="+998..."
                />
                {errors.phone && <div className="errText">{errors.phone}</div>}
              </div>
            </div>

            <div className="hrRow">
              <label>Pochta:</label>
              <div className="field">
                <input
                  name="pochta"
                  value={form.email}
                  onChange={setField("email")}
                  className={errors.email ? "inp err" : "inp"}
                  placeholder="example@mail.com"
                  type="email"
                />
                {errors.email && <div className="errText">{errors.email}</div>}
              </div>
            </div>

            <div className="hrRow">
              <label>Login:</label>
              <div className="field">
                <input
                  name="login"
                  value={form.login}
                  onChange={setField("login")}
                  className={errors.login ? "inp err" : "inp"}
                />
                {errors.login && <div className="errText">{errors.login}</div>}
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
        onClick={() =>
          setForm((p) => ({ ...p, password: generatePassword() }))
        }
      >
        <img src={img} alt="Generate" />
      </button>
    </div>
    {errors.password && <div className="errText">{errors.password}</div>}
  </div>
</div>

            <div className="hrRow hrRowTop">
              <label>Pozitsiya:</label>
              <div className="posList">
  {POSITIONS.map((pos) => (
    <label key={pos} className="posItem">
      <input
        type="checkbox"
        checked={form.position === pos}
        onChange={setPosition(pos)}
      />
      <span>{pos}</span>
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
        checked={!!form.permissions[perm.key]}
        onChange={togglePerm(perm.key)}
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
    </React.Fragment>
        }
       
      </div>

     
    
    </div>
  );
}

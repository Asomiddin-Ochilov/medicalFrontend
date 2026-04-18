import React, { useState,useEffect } from "react";
import InputMask from "react-input-mask";
import "../../styles/add-patient.css";
import man from "./man.png";
import lady from "./ledy.png";
import { useNavigate } from "react-router-dom";
import api from '../../apibaseURL'
const initial = {
  firstName: "",
  lastName: "",
  doctorId: "",
  birth: "",
  phone: "",
  passport: "",
  gender: "female",
  appointmentDate: "",
  appointmentTime: "",
  appointmentFrom: "",
  appointmentTo: ""
};
import { DatePicker, message, TimePicker, Input } from "antd";
import dayjs from "dayjs";
export default function AddPatient() {
  const [form, setForm] = useState(initial);
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [doctors, setDoctors] = useState([]);
const navigate = useNavigate()
  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const setGender = (g) => {
    setForm((p) => ({ ...p, gender: g }));
  };

  const toggleGender = () => {
    setForm((p) => ({ ...p, gender: p.gender === "female" ? "male" : "female" }));
  };

  const onCancel = () => {
    setForm(initial);
    navigate('/bemorlar')
  };

 const onSubmit = async (e) => {
  e.preventDefault();

  const ok = e.currentTarget.checkValidity();
  if (!ok) {
    e.currentTarget.reportValidity();
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("med_auth_token");
     
     const data = {
       userName:`${form.firstName} ${form.lastName}`,
       doctorId: form.doctorId,
  birth: form.birth,
  phone: form.phone,
  passport: form.passport,
  gender: form.gender,
  appointmentDate: form.appointmentDate,
  appointmentFrom: form.appointmentFrom,
  appointmentTo: form.appointmentTo
     }
     console.log(data);
     
    const res = await api.post(
      "/patients",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("NEW PATIENT:", res.data);

    setSuccess(true); // overlay chiqadi

    setTimeout(() => {
      navigate("/patients");
    }, 1000);

  } catch (err) {
    console.error(err);
    message.error("Bemorni saqlashda xatolik");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchDoctors();
}, []);

const fetchDoctors = async () => {
  try {
    const token = localStorage.getItem("med_auth_token");

    const res = await api.get("/calendar/doctors", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    

    setDoctors(res.data);

  } catch (err) {
    console.error(err);
  }
};




  return (
    <div className="add-page">
        {success && (
  <div className="successOverlay">
    <div className="successBox">
      
      <h2>Saqlandi</h2>
      <div className="checkIcon">✓</div>
    </div>
  </div>
)} 
      <div className="add-card">
        <h2 className="add-title">Be‘mor Qo'shish</h2>
         
     

        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
           <div className="gInput">
    <input
      placeholder="First Name *"
      required
      value={form.firstName}
      onChange={setField("firstName")}
    />
  </div>

  <div className="gInput">
    <input
      placeholder="Last Name *"
      required
      value={form.lastName}
      onChange={setField("lastName")}
    />
  </div>

  <div className="gInput">
    <select
      required
      value={form.doctorId}
      onChange={(e) =>
        setForm({ ...form, doctorId: e.target.value })
      }
    >
      <option disabled value="">Primary Doctor tanlang *</option>
      {doctors.map((doc) => (
        <option key={doc._id} value={doc._id}>
          {doc.username}
        </option>
      ))}
    </select>
  </div>

  {/* 🔥 Tug‘ilgan sana */}
  <div className="gInput">
    <DatePicker
   
      placeholder="Tug'ilgan sana *"
      style={{ width: "100%" }}
      value={form.birth ? dayjs(form.birth) : null}
      onChange={(date, dateString) =>
        setForm({ ...form, birth: dateString })
      } 
    />
  </div>

  <div className="gInput">
    <Input
    type={'number'}
    placeholder="+998 90 123 45 67"
    value={form.phone}
    onChange={(e) =>
      setForm({ ...form, phone: e.target.value })
    }
    maxLength={17}
  />
  </div>

  <div className="gInput">
   <input
  placeholder="Pasport raqami *"
  required
  value={form.passport}
  maxLength={9}
  onChange={(e) =>
    setForm({
      ...form,
      passport: e.target.value.toUpperCase().slice(0, 9),
    })

  }
/>
  </div>

  {/* 🔥 Qabul kuni */}
  <div className="gInput">
    <DatePicker
      placeholder="Qabul kuni *"
      style={{ width: "100%" }}
      value={form.appointmentDate ? dayjs(form.appointmentDate) : null}
      onChange={(date, dateString) =>
        setForm({ ...form, appointmentDate: dateString })
      }
    />
  </div>

  {/* 🔥 Qabul vaqti */}
 <div className="gInput" style={{display: "flex", gap: "10px"}}>
  
  {/* 🔥 BOSHLANISH */}
 {/* 🔥 BOSHLANISH */}
<TimePicker
  format="HH:mm"
  placeholder="ko'rik vaqti"
  style={{ width: "50%" }}
  value={
    form.appointmentFrom
      ? dayjs(form.appointmentFrom, "HH:mm")
      : null
  }
  onChange={(time) => {
    if (!time) return;
    setForm({
      ...form,
      appointmentFrom: time.format("HH:mm"),
    });
  }}
/>

{/* 🔥 TUGASH */}
<TimePicker
  format="HH:mm"
  placeholder="9:00-10:00"
  style={{ width: "50%" }}
  value={
    form.appointmentTo   // ✅ to‘g‘ri state
      ? dayjs(form.appointmentTo, "HH:mm")
      : null
  }
  onChange={(time) => {
    if (!time) return;
    setForm({
      ...form,
      appointmentTo: time.format("HH:mm"), // ✅ to‘g‘ri yozilyapti
    });
  }}
/>

</div>


          </div>

          {/* ✅ GENDER SWITCH */}
          <div className="gender-row">
            <button
              type="button"
              className={`gender-img ${form.gender === "female" ? "active" : ""}`}
              onClick={() => setGender("female")}
            >
              <img src={lady} alt="female" />
            </button>

            <button
              type="button"
              className="gender-switch pink"
              onClick={toggleGender}
              aria-label="Gender switch"
            >
              <span className={`knob ${form.gender}`} />
            </button>

            <button
              type="button"
              className={`gender-img ${form.gender === "male" ? "active" : ""}`}
              onClick={() => setGender("male")}
            >
              <img src={man} alt="male" />
            </button>
          </div>

          <div className="actions">
            <button className="btn primary" type="button" onClick={onCancel}>
              Bekor Qilish
            </button>

            <button className="btn outline" type="submit" disabled={loading}>
  {loading ? (
    <span className="btnLoading">
      <span className="spinner" /> Saqlanmoqda...
    </span>
  ) : (
    "Saqlash"
  )}
</button>

          </div>
        </form>
      </div>
    </div>
  );
}

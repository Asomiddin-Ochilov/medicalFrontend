import React, { useEffect, useState ,useRef} from "react";
import api from "../../apibaseURL";
import { useParams } from "react-router-dom";
import "../../styles/add-patient.css";
import man from "./man.png";
import lady from "./ledy.png";
import { DeleteOutlined , DownOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PatientAnalytics from "./PatientAnalytics";
import PhotoControlPage from "./PhotoControlPage";
const OnePage = () => {
  const { id } = useParams();
const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data,setData] = useState(null)
  
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birth: "",
    phone: "",
    passport: "",
    gender: "female",
  });

  const navigate = useNavigate();

  const scrollToForm = () => {
  setShowAnalytics(true);

  setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100); 
};

 
  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const token = localStorage.getItem("med_auth_token");

        const res = await api.get(
          `/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        setData(data)
        console.log(data);
        
        const nameParts = data.userName?.split(" ") || [];

        setForm({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          birth: data.birth || "",
          phone: data.phone || "",
          passport: data.passport || "",
          gender: data.gender || "female",
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // 🔥 Input change
  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const setGender = (g) => {
    setForm((prev) => ({ ...prev, gender: g }));
  };

  const toggleGender = () => {
    setForm((prev) => ({
      ...prev,
      gender: prev.gender === "female" ? "male" : "female",
    }));
  };

  // 🔥 UPDATE
  const onSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("med_auth_token");

      await api.put(
        `/patients/${id}`,
        {
          userName: form.firstName + " " + form.lastName,
          birth: form.birth,
          phone: form.phone,
          passport: form.passport,
          gender: form.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true); 

    setTimeout(() => {
      setSuccess(false); 
    }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      alert("Xatolik yuz berdi ❌");
    } finally {
      setLoading(false);
    }
  };


  const onDelete = async () => {
  const ok = window.confirm("Rostdan ham bemorni o‘chirmoqchimisiz?");
  if (!ok) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("med_auth_token");

    await api.delete(
      `/patients/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/bemorlar");

  } catch (err) {
    console.error("Delete error:", err);
    alert("O‘chirishda xatolik ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="add-page">
      <div className="add-card">
        <h2 className="add-title">Be’morning Ma’lumotlari</h2>
        
        {success && (
  <div className="successOverlay">
    <div className="successBox">
      
      <h2>Saqlandi</h2>
      <div className="checkIcon">✓</div>
    </div>
  </div>
)} 

        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : (
          <>
            <div className="form-grid">
              <div className="gInput">
                <input
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={setField("firstName")}
                />
              </div>

              <div className="gInput">
                <input
                  placeholder="Last Name *"
                  value={form.lastName}
                  onChange={setField("lastName")}
                />
              </div>

              <div className="gInput">
                <input
                  placeholder="kun.oy.yil *"
                  value={form.birth}
                  onChange={setField("birth")}
                />
              </div>

              <div className="gInput">
                <input
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={setField("phone")}
                />
              </div>

              <div className="gInput">
                <input
                  placeholder="Pasport raqami *"
                  value={form.passport}
                  onChange={setField("passport")}
                />
              </div>
            </div>

            <div className="gender-row">
              <button
                type="button"
                className={`gender-img ${
                  form.gender === "female" ? "active" : ""
                }`}
                onClick={() => setGender("female")}
              >
                <img src={lady} alt="female" />
              </button>

              <button
                type="button"
                className="gender-switch pink"
                onClick={toggleGender}
              >
                <span className={`knob ${form.gender}`} />
              </button>

              <button
                type="button"
                className={`gender-img ${
                  form.gender === "male" ? "active" : ""
                }`}
                onClick={() => setGender("male")}
              >
                <img src={man} alt="male" />
              </button>
            </div>

           <div className="actions">

          <button className="btnaction" onClick={scrollToForm}>
  <DownOutlined />
</button>

  <button
    className="btn danger"
    type="button"
    onClick={onDelete}
  >
    <DeleteOutlined /> 
  </button>

  <button
    className="btn outline"
    type="button"
    onClick={onSave}
    disabled={loading}
  >
    {loading ? "Saqlanmoqda..." : "Saqlash"}
  </button>

</div>

          </>
        )}
      </div>
     {showAnalytics && (
  <>
    <div ref={formRef} className="analytics-section">
      <h2 className="add-title">Be’mor Anketasi</h2>
      <PatientAnalytics data={data} />
    </div>

    <div className="analytics-section">
      <h2 className="add-title">Foto Kontrol</h2>
      <PhotoControlPage data={data} />
    </div>
  </>
)}
    </div>
  );
};

export default OnePage;
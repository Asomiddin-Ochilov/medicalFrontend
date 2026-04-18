import { Modal, Input, Select, Button, message } from "antd";
import api from '../../apibaseURL'
import { useState, useEffect } from "react";
import './main.css'
const { Option } = Select;

export default function AddCalendarModal({ open, onClose, visitTime }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    tooth: "",
    disease: "Tish davolash",
    price: 0,
    note: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("med_auth_token");
        const [docRes, patRes, serRes] = await Promise.all([
          api.get("/calendar/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/calendar/service", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(docRes.data);
        setPatients(patRes.data);
        setServices(serRes.data);
      } catch (err) {
        message.error("Doctor yoki bemorlarni olishda xatolik");
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const requiredFields = ["patientId", "doctorId", "disease", "price"];
      for (let field of requiredFields) {
        console.log(field);
        
        if (!form[field]) {
          return message.warning("Iltimos barcha majburiy maydonlarni to‘ldiring");
        }
      }

      const token = localStorage.getItem("med_auth_token");
      await api.post(
        "/calendar",
        {
          patientId: form.patientId,
          patientName: form.patientName,
          doctorId: form.doctorId,
          doctorName: form.doctorName,
          disease: form.disease,
          price: Number(form.price),
          visitTime,
          note: form.note || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      message.success("Bemor yozildi");
      onClose();
      // formni reset qilish
      setForm({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        tooth: "",
        disease: "Tish davolash",
        price: 0,
        note: "",
      });
    } catch (err) {
      console.error(err);
      message.error("Saqlashda xatolik");
    }
  };

  return (
    <Modal
      title="Bemor yozish"
      open={open}
      onCancel={onClose}
      footer={false}
      width={700}
    >
      <div className="modal-form">

        {/* Bemor */}
        <div className="modal-input">
          <label>Bemor</label>
          <Select
            showSearch
            placeholder="Bemorni tanlang"
            optionFilterProp="children"
            value={form.patientId || undefined}
            onChange={(v, opt) => {
              handleChange("patientId", v);
              handleChange("patientName", opt.children);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%", height: 40 }}
          >
            {patients.map(p => (
              <Option key={p._id} value={p._id}>{p.userName}</Option>
            ))}
          </Select>
        </div>

        {/* Doctor */}
        <div className="modal-input">
          <label>Doctor</label>
          <Select
            showSearch
            placeholder="Doctor tanlang"
            optionFilterProp="children"
            value={form.doctorId || undefined}
            onChange={(v, opt) => {
              handleChange("doctorId", v);
              handleChange("doctorName", opt.children);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%", height: 40 }}
          >
            {doctors.map(d => (
              <Option key={d._id} value={d._id}>{d.username}</Option>
            ))}
          </Select>
        </div>

        {/* Muolaja turi */}
        <div className="modal-input">
          <label>Muolaja Turi</label>
          <Select
            showSearch
            placeholder="Muolaja turini tanlang"
            optionFilterProp="children"
            value={form.disease}
            onChange={(v, opt) => {
              handleChange("disease", v);
              handleChange("price", opt.price);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%", height: 40 }}
          >
            <Option key="default" value="Tish davolash" price={0}>Tish davolash</Option>
            {services.map(s => (
              <Option key={s._id} value={s.title} price={s.price}>{s.title}</Option>
            ))}
          </Select>
        </div>

        {/* Narx */}
        <div className="modal-input">
          <label>Narx</label>
          <Input
            type="number"
            value={form.price}
            onChange={e => handleChange("price", e.target.value)}
            style={{ height: 40 }}
          />
        </div>

        

        {/* Izoh (majburiy emas) */}
        <div className="modal-input">
          <label>Izoh</label>
          <Input
            value={form.note}
            onChange={e => handleChange("note", e.target.value)}
            style={{ height: 40 }}
          />
        </div>

        {/* Footer */}
        <div className="footer-btn" style={{ display: "flex", justifyContent: "flex-end", marginTop: 27 }}>
          <Button onClick={onClose} style={{ marginRight: 20, width: 130 }}>Bekor qilish</Button>
          <Button type="primary" style={{ width: 130 }} onClick={handleSave}>Saqlash</Button>
        </div>

      </div>
    </Modal>
  );
}
import React, { useState, useEffect, useMemo } from "react";
import "../../styles/schedule.css";
import api from '../../apibaseURL'
import AddCalendarModal from "./add";
import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { Spin , Modal, TimePicker, message,Button } from "antd";
import dayjs from "dayjs";
export default function SchedulePage() {

  const navigate = useNavigate();
  const days = ["DUSH", "SESH", "CHOR", "PAY", "JUM", "SHAM", "YAK"];
  const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];
   const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [openId, setOpenId] = useState(null);
const [editItem, setEditItem] = useState(null);
  // ✅ Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisitTime, setSelectedVisitTime] = useState(new Date());

  const toggle = (id) => setOpenId((p) => (p === id ? null : id));

  // API dan calendar olish
  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("med_auth_token");

      const res = await api.get("/calendar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       console.log(res.data);
       
      setAppointments(res.data);
     setLoading(false)
     
    } catch (err) {
       setLoading(false)
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // doctorlarni unique qilish
 const doctors = useMemo(() => {
  const map = {};

  appointments.forEach((a) => {
    if (!map[a.doctorId]) {
      map[a.doctorId] = {
        id: a.doctorId,
        name: a.doctorName,
        appointments: []
      };
    }

    const date = dayjs(a.appointment?.date);
    const day = date.day() === 0 ? 6 : date.day() - 1;

    map[a.doctorId].appointments.push({
      id: a._id,
      day,
      from: a.appointment?.from,
      to: a.appointment?.to,
      name: a.patientName,
      patientId: a.patientId
    });
  });

  return Object.values(map);
}, [appointments]);

  return (
    <div className="sched-page">

      {
        loading ? <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div> : <React.Fragment>
      <div className="sched-toolbar">
        <SearchInput
  value={q}
  onChange={(val) => setQ(typeof val === "string" ? val : val?.target?.value || "")}
/>

        <PrimaryButton onClick={()=>setModalOpen(true)}>
          Bemor qo‘shish
        </PrimaryButton>
      </div>

      <h2 className="sched-title">Vrachlarning kun tartibi</h2>

     
  <div className="doc-accordion">
    {doctors.map((doctor) => (
     <DoctorItem
  key={doctor.id}
  doctor={doctor}
  days={days}
  times={times}
  q={q}
  isOpen={openId === doctor.id}
  onToggle={toggle}
  refresh={fetchCalendar}
/>
    ))}

    {modalOpen && (
      <AddCalendarModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchCalendar();
        }}
        visitTime={selectedVisitTime}
      />
    )}
  </div>
    </React.Fragment>
      }

      

    </div>
  );
}

function DoctorItem({ doctor, days, times, q, isOpen, onToggle, refresh }) {

  return (
    <div className={`doc-item ${isOpen ? "open" : ""}`}>

      <button
        className="doc-headBtn"
        type="button"
        onClick={() => onToggle(doctor.id)}
      >
        <div className="doc-left">
          <div className="doc-meta">
            <div className="doc-name">{doctor.name}</div>
          </div>
        </div>

        <div className={`chev ${isOpen ? "rot" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      <div className="doc-body" style={{ display: isOpen ? "block" : "none" }}>
       <DoctorSchedule
  doctor={doctor}
  days={days}
  times={times}
  q={q}
  refresh={refresh}
/>
      </div>

    </div>
  );
}

function DoctorSchedule({ doctor, days, times, q, refresh }) {
  const navigate = useNavigate();
  const [editItem, setEditItem] = useState(null);

 const appts = useMemo(() => {
  const list = doctor.appointments || [];

  const safeQ = typeof q === "string" ? q : "";

  if (!safeQ.trim()) return list;

  return list.filter(a =>
    a.name.toLowerCase().includes(safeQ.toLowerCase())
  );
}, [doctor.appointments, q]);

  const getCellAppts = (dayIndex, timeLabel) => {
  return appts.filter(a => {
    if (a.day !== dayIndex) return false;
    return a.from === timeLabel; // 🔥 faqat boshlanishida chiqadi
  });
};

const getDuration = (from, to) => {
  const start = dayjs(from, "HH:mm");
  const end = dayjs(to, "HH:mm");
  return end.diff(start, "hour");
};

  return (
    <>
      <div className="sched-board">
        <div className="sched-grid">
          <div className="cell head left">SOAT</div>

          {days.map(day => (
            <div className="cell head" key={day}>{day}</div>
          ))}

          {times.map(time => (
            <React.Fragment key={time}>
              <div className="cell time left">{time}</div>

              {days.map((_, d) => {
                const items = getCellAppts(d, time);

                return (
                  <div className="cell slot" key={`${d}-${time}`}>
                    {items.map(item => (
                      <div
  className="chip"
  style={{
    gridRowEnd: `span ${getDuration(item.from, item.to)}`
  }}
  onClick={() => setEditItem(item)}
>
  {item.name}
  <br />
  <small>{item.from} - {item.to}</small>
</div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {editItem && (
        <EditCalendarModal
          open={true}
          item={editItem}
          onClose={() => setEditItem(null)}
          reload={refresh}
          onView={() => navigate(`/bemorlar/${editItem.patientId}`)}
        />
      )}
    </>
  );
}


function EditCalendarModal({ open, item, onClose, reload, onView }) {
  const [from, setFrom] = useState(dayjs(item?.from, "HH:mm"));
  const [to, setTo] = useState(dayjs(item?.to, "HH:mm"));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("med_auth_token");

      await api.put(`/calendar/${item._id}`, {
        appointmentFrom: from.format("HH:mm"),
        appointmentTo: to.format("HH:mm"),
      });

      message.success("Yangilandi");
      reload();
      onClose();

    } catch (err) {
      console.log(err);
      message.error("Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Qabul ma'lumoti"
    >
      <Button block onClick={onView} style={{ marginBottom: 15 }}>
        Bemor profiliga o‘tish
      </Button>

      <TimePicker
        format="HH:mm"
        value={from}
        onChange={setFrom}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <TimePicker
        format="HH:mm"
        value={to}
        onChange={setTo}
        style={{ width: "100%", marginBottom: 15 }}
      />

      <Button
        type="primary"
        block
        loading={loading}
        onClick={handleUpdate}
      >
        Saqlash
      </Button>
    </Modal>
  );
}
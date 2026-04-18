import React, { useState, useEffect, useMemo } from "react";
import "../../styles/schedule.css";
import api from '../../apibaseURL'
import AddCalendarModal from "./add";
import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
export default function SchedulePage() {

  const navigate = useNavigate();
  const days = ["DUSH", "SESH", "CHOR", "PAY", "JUM", "SHAM", "YAK"];
  const times = ["9.00", "11.00", "13.00", "15.00", "17.00"];
   const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [openId, setOpenId] = useState(null);

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
          appointments: [],
        };
      }

      const date = new Date(a.visitTime);

      const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const hour = date.getHours();

      let timeIndex = times.findIndex((t) => parseInt(t) === hour);

      if (timeIndex === -1) timeIndex = 0;

     map[a.doctorId].appointments.push({
  day,
  time: timeIndex,
  name: a.patientName,
  patientId: a.patientId,
  status: a.status,
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
        <SearchInput value={q} onChange={setQ} />

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

function DoctorItem({ doctor, days, times, q, isOpen, onToggle }) {

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
        <DoctorSchedule doctor={doctor} days={days} times={times} q={q} />
      </div>

    </div>
  );
}

function DoctorSchedule({ doctor, days, times, q }) {
    const navigate = useNavigate();

  const appts = useMemo(() => {

    const list = doctor.appointments || [];

    if (!q.trim()) return list;

    const s = q.trim().toLowerCase();

    return list.filter((a) => a.name.toLowerCase().includes(s));

  }, [doctor.appointments, q]);

  const getCellAppts = (d, t) => appts.filter((a) => a.day === d && a.time === t);

  return (
    <div className="sched-board">
      <div className="sched-grid">

        <div className="cell head left">SOAT</div>

        {days.map((d) => (
          <div className="cell head" key={d}>
            {d}
          </div>
        ))}

        {times.map((tLabel, t) => (
          <React.Fragment key={tLabel}>

            <div className="cell time left">{tLabel}</div>

            {days.map((_, d) => {

              const items = getCellAppts(d, t);

              return (
                <div className="cell slot" key={`${d}-${t}`}>
                  <div className="slot-inner">
                       
                    {items.slice(0, 2).map((it, idx) => (
                      <div onClick={() => navigate(`/bemorlar/${it.patientId}`)} className="chip" key={idx} style={{cursor:'pointer'}}>
                        {it.name}  
                        {console.log(items)
                       }
                      </div>
                    ))}

                  </div>
                </div>
              );
            })}

          </React.Fragment>
        ))}

      </div>
    </div>
  );
}





import React, { useMemo, useEffect, useState } from "react";
import "./user-page.css";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../apibaseURL'
import { message } from "antd";
import img from '../avatar.webp'
const money = (n) => `${Number(n || 0).toLocaleString("en-US")}$`;

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("med_user"));
  const navigate = useNavigate();
const [deleteLoading, setDeleteLoading] = useState(false);
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("med_auth_token");

      const res = await api.get(
        `/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
    } catch (err) {
      message.error("Foydalanuvchini olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);


const handleDelete = async (id) => {
  try {
    setDeleteLoading(true);

    const token = localStorage.getItem("med_auth_token");

    await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    message.success("Foydalanuvchi o‘chirildi");

    setTimeout(() => {
      navigate("/users");
    }, 800);

  } catch (err) {
    message.error("O‘chirishda xatolik");
  } finally {
    setDeleteLoading(false);
  }
};

  const stats = useMemo(
    () => [
      {
        title: "Olgan puli:",
        value: user?.income || 0,
        barLabel: "Ishlagan foizi:",
        percent: 20,
      },
      {
        title: "Ishlagan:",
        value: user?.worked || 0,
        barLabel: "Markazning foizi:",
        percent: 15,
      },
      {
        title: "Qarz:",
        value: user?.debt || 0,
        barLabel: "Tolangan foizi:",
        percent: 35,
      },
    ],
    [user]
  );


  const tableRows = [
    {
      key: "1",
      name: user && user.username,
      passport: user && user.passport,
      birth:user && user.birth,
      gender:user && user.gender,
      phone:user && user.phone,
    },
  ];

  return (
    <div className="up-page">
      {/* TOP CARD */}
      <section className="up-top">
        <div className="up-profile">
          <div className="up-avatar">
            <img src={user && img} alt="avatar" />
          </div>

          <div className="up-profileText">
            <div className="up-name">{user && user?.username}</div>
            <div className="up-role">{user && user?.position}</div>
          </div>
        </div>

        <div className="up-stats">
          {stats.map((s, idx) => (
            <div className="up-stat" key={idx}>
              <div className="up-statHead">
                <div className="up-statTitle">{s.title}</div>
                <div className="up-money">{money(s.value)}</div>
              </div>

              <div className="up-statBarRow">
                <div className="up-barLabel">{s.barLabel}</div>
                <div className="up-barWrap">
                  <div className="up-bar">
                    <div
                      className="up-barFill"
                      style={{ width: `${Math.max(0, Math.min(100, s.percent))}%` }}
                    />
                  </div>
                  <div className="up-barPct">{s.percent}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
    {currentUser?.position === "Manager" && (
  <button
    className="up-deleteBtn"
    onClick={() => handleDelete(user._id)}
    disabled={deleteLoading}
  >
    {deleteLoading ? "O‘chirilmoqda..." : "O‘chirish"}
  </button>
)}
      </section>

      {/* TABLE CARD */}
      <section className="up-tableCard">
        <div className="up-tableOuter">
          <table className="up-table">
            <thead>
              <tr>
                <th>Ism/Familiya</th>
                <th>Passport Id</th>
                <th>Tug'ilgan sana</th>
                <th>Jinsi</th>
                <th>Mobil Raqami</th>
              </tr>
            </thead>

            <tbody>
              {tableRows.map((r) => (
                <tr key={r.key}>
                  <td className="up-strong">{r.name}</td>
                  <td className="up-link">{r.passport}</td>
                  <td className="up-link">{r.birth}</td>
                  <td className="up-link">{r.gender}</td>
                  <td className="up-link">{r.phone}</td>
                </tr>
              ))}

              {/* bo‘sh qatorlar (rasmdagidek katta jadval ko‘rinsin) */}
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td>&nbsp;</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

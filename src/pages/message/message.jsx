import React, { useMemo, useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import "./message.css";

import SearchInput from "../../app/SearchInput";
import PrimaryButton from "../../app/PrimaryButton";

const mock = Array.from({ length: 20 }).map((_, i) => ({
  key: String(i + 1),
  checked: i < 2, // rasmda 2 ta tanlangan
  starred: i < 10,
  name: i === 0 ? "Bekruz Rajabov" : "Laylo Ergasheva",
  phone: "+998-95-250-20-61",
  lastMessage: "Frontend kurslari bormi?",
  time: "12:40",
}));

export default function Messages() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mock;
    return mock.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.phone.includes(s) ||
        r.lastMessage.toLowerCase().includes(s)
    );
  }, [q]);

  const searchFunc = (value) => {
  if (!value.trim()) {
    setRows(rowsAll);
    return;
  }

  const filtered = rowsAll.filter((item) =>
    item.title?.toLowerCase().includes(value.toLowerCase())
  );

  setRows(filtered);
};


const searchChange = (event) => {
  setQ(event.target.value);
};


  const columns = [
    {
      title: "",
      dataIndex: "checked",
      width: 44,
      render: (_, r) => (
        <input
          type="checkbox"
          checked={r.checked}
          onChange={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "",
      dataIndex: "starred",
      width: 44,
      render: (_, r) => (
        <span className={r.starred ? "m-star on" : "m-star"}>★</span>
      ),
    },
    { title: "Ism/familiya", dataIndex: "name" },
    { title: "Telefon", dataIndex: "phone", width: 180 },
    { title: "Xabar", dataIndex: "lastMessage" },
    { title: "Vaqt", dataIndex: "time", width: 90 },
    {
      title: "",
      dataIndex: "actions",
      width: 170,
      render: () => (
        <div className="m-actions" onClick={(e) => e.stopPropagation()}>
          <button className="m-ic" title="Yuklash">⬇️</button>
          <button className="m-ic" title="Vaqt">🕒</button>
          <button className="m-ic" title="Chat">💬</button>
          <button className="m-ic danger" title="O‘chirish">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="toolbar">
        <div className="left">
          <SearchInput value={q}  searchFunc={searchFunc} onChange={searchChange} />
        </div>

        <PrimaryButton className="" onClick={() => alert("Qo‘ng‘iroq qilish")}>
          Qo‘ng‘iroq qilish
        </PrimaryButton>
      </div>

      <div className="table-wrap m-tableWrap">
        <Table
          columns={columns}
          dataSource={''}
          rowKey="key"
          pagination={false}
          size="middle"
          className="messages-table"
          rowClassName={(r) => (r.checked ? "m-row-active" : "")}
        //   onRow={(record) => ({
        //     onClick: () => navigate(`/xabarlar/${record.key}`, { state: record }),
        //   })}
        />
      </div>
    </div>
  );
}

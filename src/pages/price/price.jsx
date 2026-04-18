import React, { useMemo, useState, useEffect } from "react";
import api from "../../apibaseURL";
import { Table, Checkbox, Input,message } from "antd";
import { EditOutlined, LeftOutlined, RightOutlined, StarFilled } from "@ant-design/icons";
import "./price.css";

import { useNavigate } from "react-router-dom";
import SearchInput from "../../app/SearchInput";



const fmt = (n) => new Intl.NumberFormat("ru-RU").format(n);

export default function Prices() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsAll, setRowsAll] = useState([]);
const [loading, setLoading] = useState(false);
const [editingKey, setEditingKey] = useState(null);
const [newTitle, setNewTitle] = useState("");
const [newPrice, setNewPrice] = useState("");
const [adding, setAdding] = useState(false);
  const navigate = useNavigate()

  const [page, setPage] = useState(1);
  const pageSize = 10;

const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();
  if (!s) return rows;

  return rows.filter((r) =>
    String(r.title || "")
      .toLowerCase()
      .includes(s)
  );
}, [q, rows]);


useEffect(() => {
  setPage(1);
}, [q]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  const toggleCheck = (key, v) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, checked: v } : r)));
  };

  

  useEffect(() => {
  const fetchPrices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("med_auth_token");

      const res = await api.get(
        "/prices",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mapped = res.data.map((x) => ({
        key: x._id,
        ...x,
        checked: false,
      }));

      setRows(mapped);
      setRowsAll(mapped);
    } catch (err) {
      message.error("Narxlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  fetchPrices();
}, []);


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


useEffect(() => {
  let filtered = [...rowsAll];

  if (q.trim()) {
    filtered = filtered.filter((item) =>
      item.title?.toLowerCase().includes(q.toLowerCase())
    );
  }

  setRows(filtered);
}, [q]);

const addPrice = async () => {
  if (!newTitle.trim()) {
    message.warning("Muolaja nomini kiriting");
    return;
  }

  const num = Number(String(newPrice).replace(/[^\d]/g, "")) || 0;

  try {
    setAdding(true);

    const token = localStorage.getItem("med_auth_token");

    const res = await api.post(
      "/prices",
      {
        title: newTitle.trim(),
        price: num,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // tablega qo‘shamiz
    setRows((prev) => [
      {
        key: res.data._id,
        ...res.data,
        checked: false,
      },
      ...prev,
    ]);

    setNewTitle("");
    setNewPrice("");

    message.success("Muolaja qo‘shildi");
  } catch (err) {
    message.error("Qo‘shishda xatolik");
  } finally {
    setAdding(false);
  }
};

const savePrice = async (key, value) => {
  const num = Number(String(value || "").replace(/[^\d]/g, "")) || 0;

  try {
    const token = localStorage.getItem("med_auth_token");

    await api.put(
      `/prices/${key}`,
      { price: num },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRows((prev) =>
      prev.map((r) =>
        r.key === key ? { ...r, price: num } : r
      )
    );

    message.success("Narx yangilandi");
  } catch (err) {
    message.error("Yangilashda xatolik");
  } finally {
    setEditingKey(null);
  }
};

  const columns = [
    {
      title: "",
      dataIndex: "checked",
      width: 52,
      render: (_, r) => (
        <Checkbox
          checked={!!r.checked}
          onChange={(e) => toggleCheck(r.key, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "MUOLAJA",
      dataIndex: "title",
      render: (t) => <span className="p-title">{t}</span>,
    },
   {
  title: "NARXI",
  dataIndex: "price",
  width: 210,
  align: "center",
  render: (_, r) => (
    <div className="priceCell" onClick={(e) => e.stopPropagation()}>
      {editingKey === r.key ? (
        <Input
          autoFocus
          defaultValue={r.price}
          onPressEnter={(e) => savePrice(r.key, e.target.value)}
          onBlur={(e) => savePrice(r.key, e.target.value)}
        />
      ) : (
        <>
          <p>{fmt(r.price)}</p>
          <button
            className="editBtn"
            type="button"
            onClick={() => setEditingKey(r.key)}
          >
            <EditOutlined />
          </button>
        </>
      )}
    </div>
  ),
}
  ];

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="page">
      <div className="priceToolbar">
        <div className="ptLeft">
           <SearchInput value={q}  searchFunc={searchFunc} onChange={searchChange} />
          <div className="ptMid">
          <span className="ptRange">
            {from}-{to} of {total}
          </span>
          <button className="navBtn" onClick={goPrev} disabled={safePage <= 1}>
            <LeftOutlined />
          </button>
          <button className="navBtn" onClick={goNext} disabled={safePage >= totalPages}>
            <RightOutlined />
          </button>
        </div>
        </div>

        

        <div className="ptRight">
          <button onClick={()=>navigate('/price/add')} className="specialBtn" type="button">
            Maxsus price <StarFilled className="star" />
          </button>
        </div>
      </div>

      <div className="priceTableWrap">
        <Table
          columns={columns}
          dataSource={pageRows}
          rowKey="key"
          pagination={false}
          size="middle"
          className="priceTable"
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              // xohlasangiz: row click event
              // console.log("row:", record);
            },
          })}
          rowClassName={(r) => (r.checked ? "rowActive" : "")}
        />
  <div className="addRow">
  <input
    type="text"
    placeholder="Muolaja nomi"
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    className="simpleInput"
  />

  <input
    type="text"
    placeholder="Narxi"
    value={newPrice}
    onChange={(e) =>
      setNewPrice(e.target.value.replace(/[^\d]/g, ""))
    }
    className="simpleInput priceInput"
  />

  <button
    className="addBtn2"
    onClick={addPrice}
    disabled={adding}
  >
    {adding ? "Saqlanmoqda..." : "Qo‘shish"}
  </button>
</div>
      </div>
    </div>
  );
}

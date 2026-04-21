import React, { useEffect, useState } from "react";
import { Table, Modal, InputNumber, message } from "antd";
import api from "../../apibaseURL";
import "./main.css";

export default function Hr() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [salary, setSalary] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [percent, setPercent] = useState(0);
  const [hrOpen, setHrOpen] = useState(false);

  const token = localStorage.getItem("med_auth_token");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/salary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      
      setUsers(res.data.filter(item => item.position !== "Manager"));
    } catch {
      message.error("Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setSalary(user?.salary?.amount || 0);
    setBonus(user?.salary?.bonus || 0);
    setPercent(user?.salary?.percent || 0);
    setOpen(true);
  };

  const saveSalary = async () => {
    try {
      await api.put(
        `/users/${selectedUser._id}`,
        {
          salary: {
            amount: salary,
            bonus,
            percent,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Oylik saqlandi");
      setOpen(false);
      fetchUsers();
    } catch {
      message.error("Saqlashda xatolik");
    }
  };

  const columns = [
    {
      title: "Hodim",
      dataIndex: "username",
    },
    {
      title: "Lavozim",
      dataIndex: "position",
    },
    {
      title: "Ishlagan",
      render: (_, record) =>
        `${Number(record?.stats?.monthlyIncome || 0).toLocaleString()} so'm`,
    },
    {
      title: "Foiz",
      render: (_, record) => `${record?.salary?.percent || 0}%`,
    },
    {
      title: "Oylik",
      render: (_, record) =>
        `${Number(record?.salary?.amount || 0).toLocaleString()} so'm`,
    },
    {
      title: "Bonus",
      render: (_, record) =>
        `${Number(record?.salary?.bonus || 0).toLocaleString()} so'm`,
    },
    {
      title: "Amal",
      render: (_, record) => (
        <button
          className="users-hrBtn"
          onClick={() => openModal(record)}
        >
          Tahrirlash
        </button>
      ),
    },
  ];

  return (
    <div className="users-page">
      <div className="users-tableFrame">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />
      </div>

      <Modal
        title="Oylik sozlash"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={saveSalary}
        okText="Saqlash"
      >
        <p>Asosiy oylik</p>
        <InputNumber
          style={{ width: "100%" }}
          value={salary}
          onChange={setSalary}
        />

        <p style={{ marginTop: 15 }}>Foiz (%)</p>
        <InputNumber
          style={{ width: "100%" }}
          value={percent}
          onChange={setPercent}
        />

        <p style={{ marginTop: 15 }}>Bonus</p>
        <InputNumber
          style={{ width: "100%" }}
          value={bonus}
          onChange={setBonus}
        />
      </Modal>
    </div>
  );
}
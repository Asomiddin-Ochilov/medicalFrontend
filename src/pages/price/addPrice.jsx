import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message } from "antd";
import api from "../../apibaseURL";
import "./addprice.css";

const UPPER_LEFT = ["18", "16", "15", "14", "13", "17", "12", "11"];
const UPPER_RIGHT = ["21", "22", "23", "24", "25", "26", "27", "28"];
const LOWER_LEFT = ["48", "47", "46", "45", "44", "43", "42", "41"];
const LOWER_RIGHT = ["31", "32", "33", "34", "35", "36", "37", "38"];

const MARKS = {
  "47": "oldirish",
  "43": "koronka",
  "22": "plomba",
  "33": "plomba",
};

export default function PriceCatalog() {
  const [rows, setRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    oldirish: "",
    plomba: "",
    koronka01: "",
    koronka02: "",
  });

  const [selectedType, setSelectedType] = useState(1);
const fetchPrices = async () => {
      try {
        const token = localStorage.getItem("med_auth_token");
        const res = await api.get("/tooth-prices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRows(res.data);
        console.log(res.data);
        
      } catch (err) {
        message.error("Narxlarni olishda xatolik");
      }
    };
  // Backenddan barcha tish narxlarini olish
 useEffect(() => {
    
    fetchPrices();
  }, []);

  // Modalga tish bosilganda qiymatlarni yuklash
  const clickAdd = (tooth) => {
    const t = rows.find((r) => r.tooth === tooth) || {};
    setSelectedTooth(tooth);
    setInputs({
      oldirish: t.oldirish || "",
      plomba: t.plomba || "",
      koronka01: t.koronka01 || "",
      koronka02: t.koronka02 || "",
    });
    setModalVisible(true);
  };

  // Inputlarni o‘zgartirish
  const handleChange = (field, value) => {
    setInputs((p) => ({ ...p, [field]: value }));
  };

  // Saqlash tugmasi backendga POST/PUT qiladi
const handleSave = async () => {
  if (!selectedTooth) return;

  setLoading(true); // 🔥 boshlanishi

  try {
    const token = localStorage.getItem("med_auth_token");
    const existing = rows.find((r) => r.tooth === selectedTooth);

    if (existing && existing._id) {
      await api.put(
        `/tooth-prices/${existing._id}`,
        {
          oldirish: Number(inputs.oldirish),
          plomba: Number(inputs.plomba),
          koronka01: Number(inputs.koronka01),
          koronka02: Number(inputs.koronka02),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await api.post(
        "/tooth-prices",
        {
          tooth: selectedTooth,
          oldirish: Number(inputs.oldirish),
          plomba: Number(inputs.plomba),
          koronka01: Number(inputs.koronka01),
          koronka02: Number(inputs.koronka02),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    await fetchPrices();
    setModalVisible(false);
    message.success("Narx saqlandi");

  } catch (err) {
    console.error(err);
    message.error("Saqlashda xatolik");
  } finally {
    setLoading(false); // 🔥 tugaganda
  }
};

 const Tooth = ({ id }) => {
  const t = rows.find((r) => r.tooth === id);

  let status = "";

  if (t) {
    if (t.oldirish) status = "oldirish";
    else if (t.plomba) status = "plomba";
    else if (t.koronka01 || t.koronka02) status = "koronka";
  }

  return (
    <div
      className={`pc-tooth ${status ? `is-${status}` : ""}`}
      onClick={() => clickAdd(id)}
    >
      {id}
    </div>
  );
};

  return (
    <div className="pc-page">
      <div className="pc-titleBox">
        <div className="pc-title">TISH DAVOLANISHI</div>
      </div>

      <div className="pc-chartCard">
        <div className="pc-chart">
          <div className="pc-row">
            <div className="pc-side">{UPPER_LEFT.map((id) => <Tooth key={id} id={id} />)}</div>
            <div className="pc-midLine" />
            <div className="pc-side">{UPPER_RIGHT.map((id) => <Tooth key={id} id={id} />)}</div>
          </div>

          <div className="pc-row">
            <div className="pc-side">{LOWER_LEFT.map((id) => <Tooth key={id} id={id} />)}</div>
            <div className="pc-midLine" />
            <div className="pc-side">{LOWER_RIGHT.map((id) => <Tooth key={id} id={id} />)}</div>
          </div>

          <div className="pc-legend">
            <div className="pc-legItem">
               Tish Oldirish <span className="pc-dot red" />
            </div>
            <div className="pc-legItem">
               Plomba <span className="pc-dot blue" />
            </div>
            <div className="pc-legItem">
               Koronka <span className="pc-dot green" />
            </div>
          </div>
        </div>
      </div>

     <Modal
  title={`Narxlarni kiriting: Tish ${selectedTooth}`}
  open={modalVisible}
  onCancel={() => !loading && setModalVisible(false)}
  footer={false} // default footer tugmalari yo'q
>
  <div className="modal-input">
    <label>Oldirish:</label>
    <Input
      type="number"
      value={inputs.oldirish}
      onChange={(e) => handleChange("oldirish", e.target.value)}
    />
  </div>
  <div className="modal-input">
    <label>Plomba:</label>
    <Input
      type="number"
      value={inputs.plomba}
      onChange={(e) => handleChange("plomba", e.target.value)}
    />
  </div>
  <div className="modal-input">
    <label>Koronka 01:</label>
    <Input
      type="number"
      value={inputs.koronka01}
      onChange={(e) => handleChange("koronka01", e.target.value)}
    />
  </div>
  <div className="modal-input">
    <label>Koronka 02:</label>
    <Input
      type="number"
      value={inputs.koronka02}
      onChange={(e) => handleChange("koronka02", e.target.value)}
    />
  </div>

  {/* Footer buttons */}
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
    <Button
      style={{ marginRight: 10 }}
      onClick={() => setModalVisible(false)}
      className="cancelbtn"
    >
      Orqaga
    </Button>
    <Button type="primary" className="addbtn" 
    onClick={handleSave}
  loading={loading}>
      Saqlash
    </Button>
  </div>
</Modal>

      <div className="pc-tableCard">
        <table className="pc-table">
          <thead>
            <tr>
              <th rowSpan={2} className="w-tooth">Tish Raqami</th>
              <th rowSpan={2}>Tish Oldirish</th>
              <th rowSpan={2}>Plomba</th>
               <th colSpan={1}>
              Koronka Type
              <div className="karonka" style={{ display: "flex", gap: 10, marginTop: 5 }}>
                <label>
                  Type: 1
                  <input
                    type="radio"
                    name="koronkaType"
                    checked={selectedType === 1}
                    onChange={() => setSelectedType(1)}
                  />{" "}
                  
                </label>
                <label>
                  <input
                    type="radio"
                    name="koronkaType"
                    checked={selectedType === 2}
                    onChange={() => setSelectedType(2)}
                  />{" "}
                  2
                </label>
              </div>
            </th>
            </tr>
           
          </thead>
          <tbody>
  {rows.map((r, idx) => {
   

    return (
      <tr key={r.tooth} className={idx % 2 === 0 ? "alt" : ""}>
        <td className="pc-toothCell">{r.tooth}</td>

        <td>
          {Number(r.oldirish).toLocaleString()}
        </td>

        <td>
         {Number(r.plomba).toLocaleString()} 
        </td>

        <td>
         {selectedType === 1
          ? Number(r.koronka01).toLocaleString()
          : Number(r.koronka02).toLocaleString()}
        </td>

       
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  );
}
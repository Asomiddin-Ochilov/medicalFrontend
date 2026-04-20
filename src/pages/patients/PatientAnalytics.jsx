
import "./patient-analytics.css";
import api from "../../apibaseURL";
import { useEffect, useState } from "react";
import { EditOutlined} from '@ant-design/icons'
import { message , Modal } from "antd";
const DentalPage = ({ data }) => {

  const [selectedTeeth, setSelectedTeeth] = useState({
    extraction: [],
    filling: [],
    crown: []
  });
const [isModalOpen, setIsModalOpen] = useState(false);
const [paidAmount, setPaidAmount] = useState("");
const [payment, setPayment] = useState({
  total: '',
  paid: '',
 
});

const [temporary, setTemporary] = useState({ type: "", price: '' });
const [cleaning, setCleaning] = useState({ type: "", price: '' });
const [fillingType, setFillingType] = useState("");
 const [crownType, setCrownType] = useState("");
 const [prosthesis, setProsthesis] = useState({
  type: "",
  price: ''
});
const [loading, setLoading] = useState(false);
const prosthesisOptions = ["bio", "termo", "oddiy", "prof"];
const temporaryOptions = ["silikon", "metal"];
const cleaningOptions = ["air-flow", "skeller"];
const [customPrices, setCustomPrices] = useState({
  extraction: "",
  filling: "",
  crown: ""
});

const [editing, setEditing] = useState({
  extraction: false,
  filling: false,
  crown: false
});


const parseArray = (data) => {
  if (typeof data === "string") {
    try {
      const fixed = data.replace(/'/g, '"'); // ' → "
      return JSON.parse(fixed);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
};


const fixArray = (data) => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
};

useEffect(() => {
  if (data?.dental) {

    const extractionArr = parseArray(data.dental.extraction);
    const fillingArr = parseArray(data.dental.filling);
    const crownArr = parseArray(data.dental.crown); // ✅ SHU YO‘Q EDI

    setSelectedTeeth({
      extraction: extractionArr,
      filling: fillingArr,
      crown: crownArr
    });

    // 🔥 crown default type
    if (crownArr.length > 0) {
      setCrownType(crownArr[0].type || "sirkon");
    }

    // 🔥 filling inputga value
    if (fillingArr.length > 0) {
      setFillingType(fillingArr[0].type || "");
    }

    setProsthesis({
      type: data.dental.prosthesis?.type || "",
      price: data.dental.prosthesis?.price || ""
    });

    setTemporary({
      type: data.dental.temporary?.type || "",
      price: data.dental.temporary?.price || ""
    });

    setCleaning({
      type: data.dental.cleaning?.type || "",
      price: data.dental.cleaning?.price || ""
    });
  }
   if (data?.payment) {
    setPayment({
      total: data.payment.total || 0,
      paid: data.payment.paid || 0,
      debt: data.payment.debt || 0
    });
  }
}, [data]);


const handlePaymentChange = (value) => {
  const paid = Number(value);

  setPayment({
    total: getTotal(),
    paid,
    debt: getTotal() - paid
  });
};

// ✅ FUNKSIYA AVVAL
const calculatePrice = (category) => {
  return (selectedTeeth[category] || []).reduce(
    (sum, item) => sum + item.price,
    0
  );
};

const formatPrice = (value) => {
  if (value === null || value === undefined) return "";
  return Number(String(value).replace(/\D/g, "")).toLocaleString("ru-RU");
};



const formatMoney = (value) => {
  if (value === null || value === undefined) return "";
  return Number(String(value).replace(/\D/g, "")).toLocaleString("ru-RU");
};

const getTotal = () => {
  return (
    calculatePrice('extraction') +
    calculatePrice('filling') +
    calculatePrice('crown')
  );
};



const handleSave = async () => {
  try {
    setLoading(true);

    const newPaid = Number(payment.paid || 0) + Number(paidAmount || 0);
    const total = getTotal();
    const debt = total - newPaid;

    const payload = {
      userName: data.userName,
      birth: data.birth,
      phone: data.phone,
      passport: data.passport,
      gender: data.gender,

      dental: {
        extraction: selectedTeeth.extraction,
        filling: selectedTeeth.filling,
        crown: selectedTeeth.crown,
        prosthesis,
        temporary,
        cleaning,
        total
      },

      payment: {
        total,
        paid: newPaid,
        debt: debt < 0 ? 0 : debt
      }
    };

    await api.put(`/patients/${data._id}`, payload);

    setPayment({
      total,
      paid: newPaid,
      debt: debt < 0 ? 0 : debt
    });

    setPaidAmount("");
    setIsModalOpen(false);

    message.success("✅ Saqlandi");
  } catch (err) {
    console.log(err);
    message.error("❌ Xatolik");
  } finally {
    setLoading(false);
  }
};
  const toothNumbers = {
    topLeft: [18, 17, 16, 15, 14, 13, 12, 11],
    bottomLeft: [48, 47, 46, 45, 44, 43, 42, 41],
    topRight: [21, 22, 23, 24, 25, 26, 27, 28],
    bottomRight: [31, 32, 33, 34, 35, 36, 37, 38]
  };

const toggleTooth = (category, num) => {
  setSelectedTeeth(prev => {
    const current = prev[category] || [];
    const exists = current.find(t => t.tooth === num);

    if (exists) {
      return {
        ...prev,
        [category]: current.filter(t => t.tooth !== num)
      };
    } else {
      return {
        ...prev,
        [category]: [
          ...current,
          {
            tooth: num,
            price: customPrices[category],
            ...(category === "filling" && { type: fillingType }),
            ...(category === "crown" && { type: crownType })
          }
        ]
      };
    }
  });
};
const currentDebt = getTotal() - Number(payment.paid || 0);



const renderJawHalf = (topNums, bottomNums, category, activeClass) => (
  <div className="jaw-half">
    <div className="tooth-row">
      {topNums.map(num => (
        <div key={num} className="tooth-item">
          <button 
            className={`tooth-btn ${
              selectedTeeth[category]?.some(t => t.tooth === num) ? activeClass : ''
            }`}
            onClick={() => toggleTooth(category, num)}
          >
            {num}
          </button>
        </div>
      ))}
    </div>

    <div className="tooth-row">
      {bottomNums.map(num => (
        <div key={num} className="tooth-item">
          <button 
            className={`tooth-btn ${
              selectedTeeth[category]?.some(t => t.tooth === num) ? activeClass : ''
            }`}
            onClick={() => toggleTooth(category, num)}
          >
            {num}
          </button>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="dental-container">

      <Modal
      footer={false}
  title="💳 To‘lov qilish"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onOk={handleSave}
  className="paymentModal"
>
  <div className="paymentBox">

    <div className="paymentRow">
      <b>Umumiy summa:</b>
      <span className="amount">{getTotal().toLocaleString()} SUM</span>
    </div>

    <div className="paymentRow">
      <b>To‘lanadigan:</b>
      <span className="amount">{getTotal().toLocaleString()} SUM</span>
    </div>

    <div>
      <b>To‘langan summa:</b>
    <input
  className="paymentInput"
  type="text"
  inputMode="numeric"
  value={formatMoney(paidAmount)}
 onChange={(e) => {
  const raw = Number(e.target.value.replace(/\D/g, ""));
  const maxDebt = getTotal() - Number(payment.paid || 0);

  if (raw > maxDebt) {
    setPaidAmount(String(maxDebt));
  } else {
    setPaidAmount(String(raw));
  }
}}
  placeholder="Summani kiriting"
/>
    </div>

    <div className="paymentRow">
      <b>Qarz:</b>
      <span>{currentDebt.toLocaleString()} SUM</span>
    </div>
    <div className="modalFooter">
  
  <button
    className="btnDanger"
    onClick={() => setIsModalOpen(false)}
  >
     Yopish
  </button>

  <button
  className="btnPrimary"
  onClick={handleSave}
  disabled={loading}
>
  {loading ? "Yuklanmoqda..." : "⬇ Yuklash"}
</button>

</div>

  </div>
  
</Modal>
      
      <div className="service-row">
        <div className="service-label">
          <h3>Tish Oldirish</h3>
        </div>
        <div className="tooth-section">
          <div className="tooth-grid">
            {renderJawHalf(toothNumbers.topLeft, toothNumbers.bottomLeft, 'extraction', 'red-active')}
            {renderJawHalf(toothNumbers.topRight, toothNumbers.bottomRight, 'extraction', 'red-active')}
          </div>
          <div className="footer_">
               <input className="price-box"  value={calculatePrice('extraction').toLocaleString() + " SUM"}  readOnly />

          <div className="price-edit-box">
  {editing.extraction ? (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <input
        type="number"
        className="price-box"
        value={customPrices.extraction}
        onChange={(e) =>
          
          setCustomPrices(prev => ({
            ...prev,
            extraction: Number(e.target.value)
          }))
        }
        onBlur={() =>
          setEditing(prev => ({ ...prev, extraction: false }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(prev => ({ ...prev, extraction: false }));
          }
        }}
      />
      <span>SUM</span>
    </div>
  ) : (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* <span>{customPrices.extraction.toLocaleString()} SUM</span> */}
      <button
        
        onClick={() =>
          setEditing(prev => ({ ...prev, extraction: true }))
        }
        className="btnedit"
      >
        <EditOutlined />
      </button>
    </div>
  )}
</div>
          </div>
       
          
        </div>
      </div>

      {/* 2. Plomba */}
      <div className="service-row">
        <div className="service-label">
          <h3>Plomba</h3>
          <div className="input_plomba">
  <label>Turi:</label>
  <input
    type="text"
    value={fillingType}
    onChange={(e) => setFillingType(e.target.value)}
    placeholder="..."
  />
</div>
          
        </div>
        <div className="tooth-section">
          <div className="tooth-grid">
            {renderJawHalf(toothNumbers.topLeft, toothNumbers.bottomLeft, 'filling', 'blue-active')}
            {renderJawHalf(toothNumbers.topRight, toothNumbers.bottomRight, 'filling', 'blue-active')}
          </div>
        
  <div className="footer_">
               <input className="price-box"  value={calculatePrice('filling').toLocaleString() + " SUM"}  readOnly />

          <div className="price-edit-box">
  {editing.filling ? (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <input
        type="number"
        className="price-box"
        value={customPrices.filling}
        onChange={(e) =>
          setCustomPrices(prev => ({
            ...prev,
            filling: Number(e.target.value)
          }))
        }
        onBlur={() =>
          setEditing(prev => ({ ...prev, filling: false }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(prev => ({ ...prev, filling: false }));
          }
        }}
      />
      <span>SUM</span>
    </div>
  ) : (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* <span>{customPrices.extraction.toLocaleString()} SUM</span> */}
      <button
        
        onClick={() =>
          setEditing(prev => ({ ...prev, filling: true }))
        }
        className="btnedit"
      >
        <EditOutlined />
      </button>
    </div>
  )}
</div>
          </div>
        </div>
      </div>

      {/* 3. Koronka */}
      <div className="service-row">
        <div className="service-label">
          <h3>Koronka</h3>
          <div className="select_karonka1">
            <div className="item">
                <label htmlFor="">Sirkon</label>
            <input 
  type="radio"
  name="typekoronka"
  value="sirkon"
  checked={crownType === "sirkon"}
  onChange={(e) => setCrownType(e.target.value)}
/>


            </div>
             <div className="item">
                <label htmlFor="">Full Sirkon </label>
      <input 
  type="radio"
  name="typekoronka"
  value="full_sirkon"
  checked={crownType === "full_sirkon"}
  onChange={(e) => setCrownType(e.target.value)}
/>
            </div>
          </div>
        </div>
        <div className="tooth-section">
          <div className="tooth-grid">
            {renderJawHalf(toothNumbers.topLeft, toothNumbers.bottomLeft, 'crown', 'green-active')}
            {renderJawHalf(toothNumbers.topRight, toothNumbers.bottomRight, 'crown', 'green-active')}
          </div>
            <div className="footer_">
               <input className="price-box"  value={calculatePrice('crown').toLocaleString() + " SUM"}  readOnly />

          <div className="price-edit-box">
  {editing.crown ? (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <input
        type="number"
        className="price-box"
        value={customPrices.crown}
        onChange={(e) =>
          setCustomPrices(prev => ({
            ...prev,
            crown: Number(e.target.value)
          }))
        }
        onBlur={() =>
          setEditing(prev => ({ ...prev, crown: false }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(prev => ({ ...prev, crown: false }));
          }
        }}
      />
      <span>SUM</span>
    </div>
  ) : (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* <span>{customPrices.extraction.toLocaleString()} SUM</span> */}
      <button
        
        onClick={() =>
          setEditing(prev => ({ ...prev, crown: true }))
        }
        className="btnedit"
      >
        <EditOutlined />
      </button>
    </div>
  )}
</div>
          </div>
   
        </div>
      </div>

      <div className="service-row">
        <div className="service-label">
          <h3>Protez</h3>
          <div className="input_plomba">
            <label htmlFor="">narxi:</label>
            <input 
  type="number"
  value={prosthesis.price}
  onChange={(e) =>
    setProsthesis(prev => ({
      ...prev,
      price: Number(e.target.value)
    }))
  }
/>
          </div>
          </div>
          <div className="select_protez">
  <h3>Turi:</h3>

  {prosthesisOptions.map((item) => (
    <div className="item" key={item}>
      <label>{item}</label>
      <input
        type="radio"
        name="proteztype"
        value={item}
        checked={prosthesis.type === item}
        onChange={(e) =>
          setProsthesis((prev) => ({
            ...prev,
            type: e.target.value
          }))
        }
      />
    </div>
  ))}
</div>
          </div>

          <div className="service-row2">
        <div className="service-label2">
          <h3>Vremennaya plastmassa</h3>
          <div className="input_plastmassa">
            <label htmlFor="">narxi:</label>
            <input 
  type="number"
  value={temporary.price}
  onChange={(e)=>
    setTemporary(prev=>({
      ...prev,
      price:Number(e.target.value)
    }))
  }
/>
          </div>
          </div>
          <div className="select_plastmassa">
  <h3>Turi:</h3>

  {temporaryOptions.map((item) => (
    <div className="item" key={item}>
      <label>{item}</label>
      <input
        type="radio"
        name="plastmassatype"
        value={item}
        checked={temporary.type === item}
        onChange={(e) =>
          setTemporary((prev) => ({
            ...prev,
            type: e.target.value
          }))
        }
      />
    </div>
  ))}
</div>
          </div>

          <div className="service-row2">
        <div className="service-label2">
          <h3>Chistka</h3>
          <div className="input_plastmassa">
            <label htmlFor="">narxi:</label>
            <input 
  type="number"
  value={cleaning.price}
  onChange={(e)=>
    setCleaning(prev=>({
      ...prev,
      price:Number(e.target.value)
    }))
  }
/>
          </div>
          </div>
         <div className="select_plastmassa">
  <h3>Turi:</h3>

  {cleaningOptions.map((item) => (
    <div className="item" key={item}>
      <label>{item}</label>
      <input
        type="radio"
        name="chistkatype"
        value={item}
        checked={cleaning.type === item}
        onChange={(e) =>
          setCleaning((prev) => ({
            ...prev,
            type: e.target.value
          }))
        }
      />
    </div>
  ))}
</div>
          </div>

      <button 
  className="save-btn" 
  onClick={() => setIsModalOpen(true)}
  // disabled={loading}
>
  Saqlash
</button>


<div className="payment-footer">
  <div className="payment-item">
    <span>Umumiy:</span>
    <b>{getTotal().toLocaleString()} SUM</b>
  </div>

  <div className="payment-item">
    <span>To‘langan:</span>
    <b>{Number(payment.paid || 0).toLocaleString()} SUM</b>
  </div>

  <div className="payment-item">
    <span>Qarz:</span>
    <b>{Number(payment.debt || 0).toLocaleString()} SUM</b>
  </div>

  {Number(payment.debt) > 0 && (
    <button
      className="pay-btn"
      onClick={() => setIsModalOpen(true)}
    >
      To‘lash
    </button>
  )}
</div>

    </div>
  );
};

export default DentalPage;
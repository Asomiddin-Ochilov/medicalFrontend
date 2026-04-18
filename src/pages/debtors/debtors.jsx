import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 
import SearchInput from '../../app/SearchInput';
import PrimaryButton from '../../app/PrimaryButton';
import img1 from '../dashboard/img/1.svg'
import img2 from '../dashboard/img/2.svg'

const initialData = [
  { id: 1, name: 'Laylo Ergasheva', date: '12.03.23', amount: '200$', status: 'tolangan' },
  { id: 2, name: 'Shahzod Toirov', date: '01.05.21', amount: '150$', status: 'tolanmagan' },
  { id: 3, name: 'Malika Komilova', date: '07.08.21', amount: '3.000$', status: 'tolangan' },
  { id: 4, name: 'Diyor Karimov', date: '01.05.21', amount: '180$', status: 'tolanmagan' },
  { id: 5, name: 'Islom Abdug\'afforov', date: '01.05.21', amount: '50$', status: 'tolangan' },
  { id: 6, name: 'Javohir Qodirov', date: '29.10.23', amount: '50$', status: 'tolangan' },
  { id: 7, name: 'Nodira Sattorova', date: '01.05.21', amount: '200$', status: 'tolanmagan' },
  { id: 8, name: 'Javohir Qodirov', date: '03.03.19', amount: '150$', status: 'tolanmagan' },
  { id: 9, name: 'Sardor Inoyatov', date: '06.07.17', amount: '3.000$', status: 'tolangan' },
  { id: 10, name: 'Bobur Yusupov', date: '17.11.20', amount: '180$', status: 'tolangan' },
  { id: 11, name: 'Javohir Qodirov', date: '09.01.22', amount: '50$', status: 'tolangan' },
  { id: 12, name: 'Dilrabo Usmonova', date: '18.01.20', amount: '200$', status: 'tolangan' },
  { id: 13, name: 'Test User (Yangi)', date: '25.05.24', amount: '100$', status: 'tolangan' }, // Test uchun yangi sana
];

const DebtorsPage = () => {

  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState('Hammasi');
  const navigate = useNavigate()
  
  // Sana filtrlari uchun state
  const [oy, setOy] = useState('');
  const [hafta, setHafta] = useState('');
  const [kun, setKun] = useState('');

  // 1. String sanani (dd.mm.yy) Date formatiga o'tkazish funksiyasi
  const parseRowDate = (dateStr) => {
    if (!dateStr) return new Date(0); // Sana yo'q bo'lsa, juda eski sana qaytaradi
    const parts = dateStr.split('.'); // ['12', '03', '23']
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS da oylar 0 dan boshlanadi
    const year = 2000 + parseInt(parts[2], 10); // '23' ni '2023' qilish
    return new Date(year, month, day);
  };

  // Asosiy Filter Funksiyasi
  const filteredData = initialData.filter(user => {
    // A. Qidiruv (Ism bo'yicha)
    const matchesSearch = user.name.toLowerCase().includes(q.toLowerCase());

    // B. Tab (Status bo'yicha)
    const matchesTab = 
      activeTab === 'Hammasi' ? true :
      activeTab === 'Tolanganlar' ? user.status === 'tolangan' :
      activeTab === 'Tolamaganlar' ? user.status === 'tolanmagan' : true;

    // C. SANA BO'YICHA FILTRLASH (DATE LOGIC)
    let matchesDate = true;

    // Agar hech qanday raqam kiritilmagan bo'lsa, hammasini ko'rsat
    if (oy || hafta || kun) {
      const bugun = new Date();
      
      // Kiritilgan qiymatlarni kunlarga aylantiramiz
      const oyKunlari = (parseInt(oy) || 0) * 30;   // 1 oy = 30 kun deb olindi
      const haftaKunlari = (parseInt(hafta) || 0) * 7;
      const kunlar = parseInt(kun) || 0;

      const jamiKunlarOrqaga = oyKunlari + haftaKunlari + kunlar;

      // Chegara sanani hisoblash (Bugun - jami kunlar)
      const chegaraSana = new Date();
      chegaraSana.setDate(bugun.getDate() - jamiKunlarOrqaga);
      
      // Qatordagi sanani o'qish
      const userSanasi = parseRowDate(user.date);

      // MANTIQ: Foydalanuvchi sanasi Chegara sanadan katta yoki teng bo'lishi kerak
      // Masalan: Agar 1 oy deb kiritilsa, oxirgi 1 oydagi ma'lumotlar chiqadi
      matchesDate = userSanasi >= chegaraSana;
    }

    return matchesSearch && matchesTab && matchesDate;
  });


  const Onepage=(id)=>{

    navigate(`/debtors/${id}`)

  }

  return (
    <div className="container">
      {/* Yuqori qism (Header) */}
      <div className="top-bar">
         {/* Qidiruv inputi */}
         <SearchInput value={q} onChange={setQ} />

        <div className="top-right-controls">
          <div className="date-filter">
            
            <div className="filter-item">
              <span className="filter-label">oy</span>
              <div className="filter-input-wrapper">
                <input 
                  type="number" 
                  className="filter-input"
                  value={oy}
                  onChange={(e) => setOy(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="filter-item">
              <span className="filter-label">hafta</span>
              <div className="filter-input-wrapper">
                <input 
                  type="number" 
                  className="filter-input"
                  value={hafta}
                  onChange={(e) => setHafta(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="filter-item">
              <span className="filter-label">kun</span>
              <div className="filter-input-wrapper">
                <input 
                  type="number" 
                  className="filter-input"
                  value={kun}
                  onChange={(e) => setKun(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

          </div>
           <PrimaryButton
                    //    onClick={() => navigate("/users/add")}
                       className="users-addBtn"
                     >
                       Bemor qo‘shish
                     </PrimaryButton>
        </div>
      </div>

  
      <div className="main-card">
        <div className="card-header">
          <h2 className="card-title">Qarzdorlar royxati</h2>
          <div className="tabs">
            {['Hammasi', 'Tolanganlar', 'Tolamaganlar', 'Qisman Tolaganlar'].map(tab => (
              <span 
                key={tab} 
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                | {tab} 
              </span>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="th-left">ism/familiya</th>
                <th>sana</th>
                <th>umumiy summa</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <tr onClick={()=>Onepage(user.id)}  key={user.id}>
                    <td className="td-name">
                      <div className="avatar">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} 
                          alt="avatar" 
                        />
                      </div>
                      {user.name}
                    </td>
                    <td>{user.date}</td>
                    <td>{user.amount}</td>
                    <td>
                      <button className={`status-btn ${user.status}`}>
                        {user.status}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '30px', opacity: 0.7}}>
                    So'rov bo'yicha ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
      <footer>
            <div className="item">
                <div className="left1">
                    <h1>60.000$</h1>
                    <p>Bu oy tolandi</p>
                </div>
                <img src={img2} alt="" />
            </div>
            <div className="item">
                <div className="left1">
                    <h1 className='blue'>120.000$</h1>
                    <p>Bu oy qarzga o’lindi</p>
                </div>
                <img src={img1} alt="" />
            </div>
        </footer>
    </div>
  );
};

export default DebtorsPage;

import React, { useState } from "react";
import { Modal, Upload, Input, Button,Image,message } from "antd";
import { UploadOutlined, FileImageOutlined } from "@ant-design/icons";
import "./patient-analytics.css";
import api from "../../apibaseURL";
import filephoto from './file.svg'
const PhotoControlPage = ({data}) => {
    console.log(data);
    






  const [notes, setNotes] = useState(data?.photoAnalysis?.note || "");
  const [openModal, setOpenModal] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [desc, setDesc] = useState("");
 const [isChanged, setIsChanged] = useState(false);
 const [uploading, setUploading] = useState(false);
const [photoType, setPhotoType] = useState("before");
const [saving, setSaving] = useState(false);
const [photoData, setPhotoData] = useState(() => ({
  beforePhotos: data?.photoAnalysis?.beforePhotos ?? [],
  afterPhotos: data?.photoAnalysis?.afterPhotos ?? [],
  note: data?.photoAnalysis?.note ?? ""
}));


const handleUploadChange = ({ fileList }) => {
  setFileList(fileList);
};

const handleUploadPhoto = async () => {
  if (!fileList.length) return;

  setUploading(true);

  const formData = new FormData();
  formData.append("image", fileList[0].originFileObj);
  formData.append("message", desc);

  try {
    const res = await api.post("/photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = res.data;

    const newPhoto = {
      imgUrl: result.imgUrl,
      date: new Date().toISOString(),
      message: desc,
    };
    console.log(newPhoto);
    message.success("Rasm muvaffaqiyatli yuklandi 📸");
    const key = photoType === "before" ? "beforePhotos" : "afterPhotos";

    setPhotoData((prev) => ({
      ...prev,
      [key]: [...prev[key], newPhoto],
    }));

    setOpenModal(false);
    setFileList([]);
    setDesc("");
    setIsChanged(true);
  } catch (err) {
    console.log(err);
  } finally {
    setUploading(false);
  }
};

const handleSavePatient = async () => {
  try {
    setSaving(true);

    await api.put(`/patients/${data._id}`, {
      ...data,
      photoAnalysis: {
        ...photoData,
        note: notes,
      },
    });

    setIsChanged(false);

    message.success("Ma'lumotlar saqlandi ✅");
  } catch (error) {
    console.log(error);
    message.error("Xatolik yuz berdi ❌");
  } finally {
    setSaving(false);
  }
};

const formatDate = (date) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const renderPhotos = (list = []) => {
  return list.map((img, index) => (
    <div key={index} className="photo-item">
      
      <div className="photo-meta">
        <span className="photo-date">{formatDate(img.date)}</span>
      </div>

      <Image
        width={70}
        height={80}
        src={img.imgUrl || filephoto}
        style={{ borderRadius: 8 }}
        preview={{
          mask: "Ko‘rish",
        }}
      />
      <br />
      <span className="photo-name">{img.message}</span>
    </div>
  ));
};
  return (
    <div className="photo-control-container">
      <div className="photo-top-wrapper">
        {/* OLDIN */}
        <div className="photo-column">
          <h3>Muolajadan oldin</h3>

          <div className="photo-list">
            {renderPhotos(photoData.beforePhotos)}
            <button className="upload-btn" onClick={() => {
  setPhotoType("before");
  setOpenModal(true);
}}>
              Qo'shish
            </button>
          </div>
        </div>

        {/* KEYIN */}
        <div className="photo-column">
          <h3>Muolajadan keyin</h3>

          <div className="photo-list">
            {renderPhotos(photoData.afterPhotos)}
            <button className="upload-btn" 
            onClick={() => {
  setPhotoType("after");
  setOpenModal(true);
}}
>
              Qo'shish
            </button>
          </div>
        </div>
      </div>

      {/* IZOH */}
      <div className="notes-section">
        <h3>Izohlar</h3>
        <textarea
          value={notes}
          onChange={(e) => {
  setNotes(e.target.value);
  setIsChanged(true);
}}
          placeholder="Izoh yozing..."
        />
      </div>
      <div>
         {isChanged && (
 <Button
  loading={saving}
  type="primary"
  block
  onClick={handleSavePatient}
>
  Saqlash
</Button>
)}
      </div>
    

      {/* MODAL */}
      <Modal
        title="Rasm yuklash"
  open={openModal}
  onCancel={() => setOpenModal(false)}
  onOk={handleUploadPhoto}
  confirmLoading={uploading}
  okText="Yuklash"
  cancelText="Bekor qilish"
  centered
    footer={[
    <Button
      key="cancel"
      onClick={() => setOpenModal(false)}
      style={{ height: 40,marginRight:'10px' }}
    >
      Bekor qilish
    </Button>,

    <Button
      key="upload"
      type="primary"
      loading={uploading}
      onClick={handleUploadPhoto}
      style={{ height: 40 }}
    >
      Yuklash
    </Button>,
  ]}
      >
       <Upload
  multiple
  fileList={fileList}
  onChange={handleUploadChange}
  beforeUpload={() => false}
  listType="picture"
  style={{ width: "100%" }}
>
  <Button
    icon={<UploadOutlined />}
    style={{
      width: "100%",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Rasm tanlash
  </Button>
</Upload>

        <Input.TextArea
  style={{
    marginTop: 15,
    borderRadius: 8,
  }}
  placeholder="Qisqa izoh..."
  value={desc}
  onChange={(e) => {
    setDesc(e.target.value);
    setIsChanged(true);
  }}
/>
      </Modal>
    </div>
  );
};

export default PhotoControlPage;
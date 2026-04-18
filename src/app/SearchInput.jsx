import React from "react";
import IconButton from "./IconButton";
import './custem.css'
export default function SearchInput({ value, onChange, placeholder = "Qidiruv...",searchFunc }) {
  return (
    <div className="searchBox">
      <input
        value={value}
        onChange={(e) => onChange(e)}
        type="text"
        placeholder={placeholder}
        onKeyPress={(e) => {
    if (e.key === "Enter") searchFunc(value); 
  }}
      />

      <IconButton onClick={()=>searchFunc(value)} className="iconBtn" ariaLabel="Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </IconButton>
    </div>
  );
}

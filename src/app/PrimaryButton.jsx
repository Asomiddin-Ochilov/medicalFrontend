import React from "react";
import './custem.css'
export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`addBtn ${className}`}
    >
      {children}
    </button>
  );
}

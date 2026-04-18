import React from "react";

export default function IconButton({ children, onClick, ariaLabel, className = "" }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

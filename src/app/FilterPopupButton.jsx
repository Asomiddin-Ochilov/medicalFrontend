import React, { useEffect } from "react";
import IconButton from "./IconButton";
import "./custem.css";

export default function FilterPopupButton({
  open,
  setOpen,
  wrapRef,
  f,
  setF,
  onSave = () => {},
}) {
  // 🔥 Outside click yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef?.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapRef, setOpen]);

  const handleSave = () => {
    onSave(f);
    setOpen(false);
  };

  const handleReset = () => {
    setF({
    day: "",
    month: "",
    year: "",
    regDate: "",
    passport: "", 
  });
  };

  return (
    <div className="filterWrap" ref={wrapRef}>
      <IconButton
        className="filterBtn"
        ariaLabel="Filter"
        onClick={() => setOpen((p) => !p)}
      >
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 6h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="2" />

          <path d="M4 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="12" r="2" stroke="currentColor" strokeWidth="2" />

          <path d="M4 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      </IconButton>

      {open && (
        <div className="filterPopup" role="dialog">
          <div className="filterTitle">Filter</div>

          <div className="filterGrid">
            <div className="filterCol">
              <label className="fRow">
                <span>Kun:</span>
                <input
                  type="number"
                  max="31"
                  value={f.day}
                  onChange={(e) =>
                    setF((p) => ({ ...p, day: e.target.value }))
                  }
                />
              </label>

              <label className="fRow">
                <span>Oy:</span>
                <input
                  type="number"
                  max="12"
                  value={f.month}
                  onChange={(e) =>
                    setF((p) => ({ ...p, month: e.target.value }))
                  }
                />
              </label>

              <label className="fRow">
                <span>Yil:</span>
                <input
                  type="number"
                  max="9999"
                  value={f.year}
                  onChange={(e) =>
                    setF((p) => ({ ...p, year: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="filterCol">
              <label className="fRow wide">
                <span>Registrasiya sanasi:</span>
                <input
                  type="text"
                  value={f.regDate}
                  onChange={(e) =>
                    setF((p) => ({ ...p, regDate: e.target.value }))
                  }
                />
              </label>

              <label className="fRow wide">
                <span>Pasport Id:</span>
               <input
  type="text"
  value={f.passport}
  onChange={(e) =>
    setF((p) => ({ ...p, passport: e.target.value }))
  }
/>
              </label>

              <div className="filterActions">
                <button
                  className="resetBtn"
                  type="button"
                  onClick={handleReset}
                >
                  Tozalash
                </button>

                <button
                  className="saveBtn"
                  type="button"
                  onClick={handleSave}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
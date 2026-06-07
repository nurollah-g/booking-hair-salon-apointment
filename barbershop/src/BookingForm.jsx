import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function BookingForm() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(true);
  const [fullName, setFullName] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [dateValid, setDateValid] = useState(false);
  const [time, setTime] = useState("");
  const [timeValid, setTimeValid] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const timeContainerRef = useRef(null);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  const selectedBarber = JSON.parse(
    localStorage.getItem("selectedBarber") || "null",
  );
  const selectedServices = JSON.parse(
    localStorage.getItem("selectedServices") || "[]",
  );

  const timeSlots = [];
  for (let i = 11; i <= 19; i++)
    timeSlots.push(`${i.toString().padStart(2, "0")}:00`);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const isFriday = (d) => d.getDay() === 5;
  const getMinDate = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return formatDate(t);
  };
  const getMaxDate = () => {
    const t = new Date();
    t.setDate(t.getDate() + 7);
    t.setHours(0, 0, 0, 0);
    return formatDate(t);
  };
  const isValidDate = (val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = new Date();
    max.setDate(max.getDate() + 7);
    max.setHours(0, 0, 0, 0);
    const d = new Date(val);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= max && !isFriday(d);
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    setFullName(v);
    setNameValid(
      /^[a-zA-Z\u0600-\u06FF]{2,}\s+[a-zA-Z\u0600-\u06FF]{2,}$/.test(v.trim()),
    );
  };
  const handlePhoneChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(v);
    setPhoneValid(v.length >= 9 && v.length <= 10 && /^[1-9]/.test(v));
  };

  const handleDateChange = (e) => {
    const v = e.target.value;
    setDate(v);
    setDateError("");
    if (!v) {
      setDateValid(false);
      return;
    }
    if (isValidDate(v)) {
      setDateValid(true);
    } else {
      setDateValid(false);
      const d = new Date(v);
      setDateError(isFriday(d) ? t.fridayError : t.dateRangeError);
    }
  };

  const handleTimeSelect = (time) => {
    setTime(time);
    setTimeValid(true);
    setShowTimeDropdown(false);
  };
  const isFormValid = nameValid && phoneValid && dateValid && timeValid;

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API_URL}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: `+43${phone}`,
          date,
          time,
          barber: selectedBarber?.name || null,
          services: selectedServices,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || t.serverError);
        return;
      }
      localStorage.setItem("bookingId", data.bookingId);
      localStorage.setItem("userPhone", `+43${phone}`);
      setSubmitted(true);
      setTimeout(() => navigate("/Auth"), 1500);
    } catch {
      setApiError(t.serverError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalContentRef.current)
      modalContentRef.current.style.overflow = showTimeDropdown
        ? "hidden"
        : "auto";
  }, [showTimeDropdown]);
  useEffect(() => {
    const handler = (e) => {
      if (
        timeContainerRef.current &&
        !timeContainerRef.current.contains(e.target)
      )
        setShowTimeDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div
            ref={modalContentRef}
            className="bg-black/40 border border-white/20 px-6 sm:px-8 py-8 sm:py-10 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="flex justify-end mb-2">
              <LangSwitcher />
            </div>
            <h2 className="text-white text-xl sm:text-2xl text-center mb-6 tracking-widest">
              {t.bookingForm}
            </h2>

            {(selectedBarber || selectedServices.length > 0) && (
              <div className="mb-5 p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                {selectedBarber && (
                  <p className="text-white/60 text-xs">
                    <span className="text-white/30">{t.barberLabel} </span>
                    <span className="text-white">{selectedBarber.name}</span>
                  </p>
                )}
                {selectedServices.length > 0 && (
                  <p className="text-white/60 text-xs">
                    <span className="text-white/30">{t.servicesLabel} </span>
                    <span className="text-white">
                      {selectedServices.join(", ")}
                    </span>
                  </p>
                )}
              </div>
            )}

            {apiError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm text-center">{apiError}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.fullNamePlaceholder}
                  value={fullName}
                  onChange={handleNameChange}
                  maxLength={100}
                  className="w-full bg-transparent border-b border-white/40 text-white py-3 pr-8 focus:border-white focus:outline-none placeholder-white/40 text-base sm:text-lg"
                />
                {nameValid && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400">
                    ✓
                  </span>
                )}
                {!nameValid && fullName.length > 0 && (
                  <>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400">
                      ✗
                    </span>
                    <p className="text-red-400 text-xs mt-1">
                      {t.fullNameError}
                    </p>
                  </>
                )}
              </div>
              <div className="relative">
                <div className="flex items-end border-b border-white/40 focus-within:border-white transition">
                  <span className="text-white text-base sm:text-lg py-3 pr-2 select-none whitespace-nowrap">
                    +43
                  </span>
                  <input
                    type="tel"
                    placeholder="664 1234567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 bg-transparent text-white py-3 pr-8 focus:outline-none placeholder-white/40 text-base sm:text-lg"
                  />
                </div>
                {phoneValid && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400">
                    ✓
                  </span>
                )}
                {!phoneValid && phone.length > 0 && (
                  <>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400">
                      ✗
                    </span>
                    <p className="text-red-400 text-xs mt-1">{t.phoneError}</p>
                  </>
                )}
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full bg-transparent border-b border-white/40 text-white py-3 pr-8 focus:border-white focus:outline-none cursor-pointer text-base"
                  style={{ colorScheme: "dark" }}
                />
                {dateValid && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400">
                    ✓
                  </span>
                )}
                {!dateValid && date.length > 0 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400">
                    ✗
                  </span>
                )}
                {dateValid && date && (
                  <p className="text-green-400 text-xs mt-1">
                    {formatDateForDisplay(date)}
                  </p>
                )}
                {dateError && (
                  <p className="text-red-400 text-xs mt-1">{dateError}</p>
                )}
                <p className="text-white/30 text-xs mt-1">{t.dateNote}</p>
              </div>
              <div
                ref={timeContainerRef}
                className="relative"
                style={{ overflow: "visible" }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.timePlaceholder}
                    value={time}
                    readOnly
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="w-full bg-transparent border-b border-white/40 text-white py-3 pr-8 focus:border-white focus:outline-none placeholder-white/40 text-base cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {timeValid && (
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none">
                      ✓
                    </span>
                  )}
                </div>
                {showTimeDropdown && (
                  <div
                    className="absolute z-50 w-full mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl"
                    style={{
                      top: "100%",
                      maxHeight: "160px",
                      overflowY: "auto",
                    }}
                  >
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTimeSelect(slot);
                          }}
                          className={`py-2 px-2 rounded-md text-center transition-all text-xs sm:text-sm ${time === slot ? "bg-white text-black font-bold" : "text-white hover:bg-white/20"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`w-full mt-2 py-3 border tracking-widest text-sm transition ${isFormValid && !loading ? "border-white text-white hover:bg-white hover:text-black" : "border-white/30 text-white/40 cursor-not-allowed"}`}
              >
                {loading ? t.sending : submitted ? t.submitted : t.submit}
              </button>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              type="button"
              className="w-full mt-4 text-white/50 text-sm hover:text-white transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

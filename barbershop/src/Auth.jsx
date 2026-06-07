import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function OTPModal({ onVerify, onClose }) {
  const { t } = useLang();
  const phoneNumber = localStorage.getItem("userPhone") || "Unknown number";
  const bookingId = localStorage.getItem("bookingId");
  const [open, setOpen] = useState(true);
  const [otp, setOtp] = useState(["","","","","",""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0 && !canResend) { const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000); return () => clearTimeout(timer); }
    else if (resendTimer === 0) setCanResend(true);
  }, [resendTimer, canResend]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => { if (!/^\d*$/.test(value)) return; const newOtp = [...otp]; newOtp[index] = value.slice(-1); setOtp(newOtp); setError(""); if (value && index < 5) inputRefs.current[index+1].focus(); };
  const handleKeyDown = (index, e) => { if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index-1].focus(); };
  const handlePaste = (e) => { e.preventDefault(); const pasted = e.clipboardData.getData("text").slice(0,6); if (!/^\d+$/.test(pasted)) return; const digits = pasted.split(""); const newOtp = [...otp]; digits.forEach((d,i) => { if (i<6) newOtp[i]=d; }); setOtp(newOtp); const last = Math.min(digits.length,6)-1; if (last<5) inputRefs.current[last+1]?.focus(); else inputRefs.current[5]?.blur(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) { setError(t.enterFullCode); return; }
    setIsVerifying(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phoneNumber, code: otpCode, bookingId }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || t.enterFullCode); setOtp(["","","","","",""]); inputRefs.current[0]?.focus(); return; }
      localStorage.setItem("bookingToken", data.token); localStorage.setItem("userFormData", JSON.stringify(data.booking));
      if (onVerify) onVerify(otpCode); navigate(`/booking/${data.token}`);
    } catch { setError(t.serverError); } finally { setIsVerifying(false); }
  };

  const handleResendCode = async () => {
    if (!canResend) return; setCanResend(false); setResendTimer(30); setError("");
    try { await fetch(`${API_URL}/api/auth/resend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phoneNumber, bookingId }) }); } catch {}
  };

  if (!open) return null;
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 border border-white/20 px-6 sm:px-8 py-8 sm:py-10 rounded-xl shadow-xl w-full max-w-md">
          <div className="flex justify-end mb-2"><LangSwitcher /></div>
          <h2 className="text-white text-xl sm:text-2xl text-center mb-2 tracking-widest">{t.verification}</h2>
          <p className="text-white/50 text-center text-sm mb-2">{t.codeSentTo}</p>
          <p className="text-white text-center text-base sm:text-lg mb-8 font-mono">{phoneNumber}</p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent border-b-2 text-white text-center text-xl sm:text-2xl font-mono focus:border-white focus:outline-none transition-all duration-200"
                  style={{ borderBottomColor: error ? "#ef4444" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button type="submit" disabled={isVerifying || otp.join("").length !== 6}
              className={`w-full py-3 border tracking-widest text-sm transition ${otp.join("").length === 6 && !isVerifying ? "border-white text-white hover:bg-white hover:text-black" : "border-white/30 text-white/40 cursor-not-allowed"}`}>
              {isVerifying ? t.verifying : t.verify}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-white/40 text-sm">{t.didntReceive}{" "}
              <button onClick={handleResendCode} disabled={!canResend} className={`transition ${canResend ? "text-white hover:text-white/80 cursor-pointer" : "text-white/40 cursor-not-allowed"}`}>
                {canResend ? t.resendCode : t.resendIn(resendTimer)}
              </button>
            </p>
          </div>
          <button onClick={() => { setOpen(false); navigate("/BookingForm"); if (onClose) onClose(); }} type="button" className="w-full mt-6 text-white/50 text-sm hover:text-white transition">{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

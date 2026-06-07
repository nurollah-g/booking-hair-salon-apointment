import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SERVICE_ICONS = { "Haircut":"✂️","Hair Perm":"〰️","Hair Color":"🎨","Groom Package":"🤵","Facial":"✨" };

export default function ReservationDashboard() {
  const { t, lang } = useLang();
  const { token } = useParams();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooking = async () => {
      if (!token) { setNotFound(true); setLoading(false); return; }
      try {
        const res = await fetch(`${API_URL}/api/auth/booking/${token}`);
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const data = await res.json(); setReservationData(data.booking);
      } catch {
        const stored = localStorage.getItem("userFormData");
        if (stored) { try { setReservationData(JSON.parse(stored)); } catch { setNotFound(true); } }
        else setNotFound(true);
      } finally { setLoading(false); }
    };
    loadBooking();
  }, [token]);

  const handleCancelReservation = async () => {
    try { await fetch(`${API_URL}/api/auth/booking/${token}`, { method: "DELETE" }); } catch {}
    ["userFormData","userPhone","bookingId","bookingToken","selectedBarber","selectedServices"].forEach((k) => localStorage.removeItem(k));
    setCancelMessage(t.cancelSuccess); setReservationData(null);
    setTimeout(() => { setShowCancelConfirm(false); setCancelMessage(""); }, 2500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const generateCode = (id) => id ? id.toString().padStart(8, "0").toUpperCase() : "N/A";

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4"><div className="text-white/50 text-sm tracking-widest">{t.loading}</div></div>;

  if (notFound || !reservationData) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
        <div className="flex justify-end mb-2"><LangSwitcher /></div>
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-white text-xl font-bold mb-3">{t.noActiveReservation}</h2>
        <p className="text-white/60 mb-6 text-sm">{t.invalidLink}</p>
        {cancelMessage && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg"><p className="text-green-400 text-sm">{cancelMessage}</p></div>}
        <button onClick={() => navigate("/")} className="w-full py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition text-sm tracking-widest">{t.backToHome}</button>
      </div>
    </div>
  );

  const services = Array.isArray(reservationData.services) ? reservationData.services : (reservationData.services ? reservationData.services.split(",").filter(Boolean) : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-8 w-full max-w-md">
        <div className="flex justify-end mb-2"><LangSwitcher /></div>
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-2xl sm:text-3xl">✅</span>
          <h2 className="text-white text-lg sm:text-xl font-serif tracking-widest mt-2">{t.reservationConfirmed}</h2>
          <div className="w-16 h-px bg-white/30 mx-auto mt-3" />
        </div>
        <div className="space-y-4 mb-6 sm:mb-8">
          {[
            { label: t.reservationCode, value: `#${generateCode(reservationData.id)}`, mono: true },
            { label: t.fullName, value: reservationData.fullName },
            { label: t.phoneNumber, value: reservationData.phone, mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="border-b border-white/20 pb-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-white text-base sm:text-lg font-medium ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
            </div>
          ))}
          <div className="border-b border-white/20 pb-3 grid grid-cols-2 gap-4">
            <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.date}</p><p className="text-white text-sm font-medium">{formatDate(reservationData.date)}</p></div>
            <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.time}</p><p className="text-white text-base sm:text-lg font-medium font-mono">{reservationData.time || "—"}</p></div>
          </div>
          {reservationData.barber && <div className="border-b border-white/20 pb-3"><p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.barber}</p><p className="text-white text-base sm:text-lg font-medium">💈 {reservationData.barber}</p></div>}
          {services.length > 0 && (
            <div className="border-b border-white/20 pb-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{t.services}</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => <span key={s} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-white text-xs sm:text-sm">{SERVICE_ICONS[s] || "•"} {s}</span>)}
              </div>
            </div>
          )}
          {reservationData.submittedAt && <p className="text-white/25 text-xs text-center pt-1">{t.bookedOn} {new Date(reservationData.submittedAt).toLocaleString(lang === "de" ? "de-DE" : "en-US")}</p>}
        </div>
        <div className="space-y-3">
          <button onClick={() => setShowCancelConfirm(true)} className="w-full py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition text-sm font-medium">{t.cancelReservation}</button>
          <button onClick={() => navigate("/")} className="w-full py-3 border border-white/30 text-white/70 rounded-lg hover:bg-white hover:text-black transition text-sm tracking-widest">{t.backToHome}</button>
        </div>
      </div>
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-5 sm:p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-white text-lg font-bold mb-3">{t.cancelQuestion}</h3>
            <p className="text-white/60 mb-6 text-sm">{t.cannotUndo}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2 border border-white/30 text-white/70 rounded-lg hover:bg-white/10 transition text-sm">{t.keepIt}</button>
              <button onClick={handleCancelReservation} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">{t.yesCancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

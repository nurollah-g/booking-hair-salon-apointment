import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

export default function SelectionPage() {
  const { t } = useLang();
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const barbers = [
    { id: 1, name: "Arman Rezaei", role: t.seniorBarber, exp: t.yrsExp(8), avatar: "AR", gradient: "from-amber-400 to-orange-500" },
    { id: 2, name: "Sina Moradi", role: t.hairSpecialist, exp: t.yrsExp(5), avatar: "SM", gradient: "from-sky-400 to-blue-600" },
    { id: 3, name: "Daniyal Karimi", role: t.colorExpert, exp: t.yrsExp(6), avatar: "DK", gradient: "from-emerald-400 to-teal-600" },
  ];

  const services = [
    { id: "Haircut", label: t.haircutLabel, icon: "✂️", desc: t.haircutDesc },
    { id: "Hair Perm", label: t.permLabel, icon: "〰️", desc: t.permDesc },
    { id: "Hair Color", label: t.colorLabel, icon: "🎨", desc: t.colorDesc },
    { id: "Groom Package", label: t.groomLabel, icon: "🤵", desc: t.groomDesc },
    { id: "Facial", label: t.facialLabel, icon: "✨", desc: t.facialDesc },
  ];

  const toggleService = (id) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleContinue = () => {
    if (!selectedBarber || selectedServices.length === 0) return;
    localStorage.setItem("selectedBarber", JSON.stringify(selectedBarber));
    localStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    navigate("/BookingForm");
  };

  const canContinue = selectedBarber && selectedServices.length > 0;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black/40 border border-white/20 px-6 sm:px-8 py-8 sm:py-10 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
        <div className="flex justify-end mb-2"><LangSwitcher /></div>
        <h2 className="text-white text-xl sm:text-2xl text-center mb-1 tracking-widest">{t.yourExperience}</h2>
        <p className="text-white/30 text-center text-xs tracking-widest mb-6 sm:mb-8">{t.personalizeVisit}</p>

        {/* SELECT BARBER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/50 text-xs tracking-[0.2em] uppercase whitespace-nowrap">{t.selectBarber}</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {barbers.map((barber) => {
              const isSelected = selectedBarber?.id === barber.id;
              return (
                <button key={barber.id} type="button" onClick={() => setSelectedBarber(barber)}
                  className="relative flex flex-col items-center p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer"
                  style={{ borderColor: isSelected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)", background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", boxShadow: isSelected ? "0 0 24px rgba(255,255,255,0.15), 0 0 48px rgba(255,255,255,0.06)" : "none" }}>
                  {isSelected && <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)" }} />}
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${barber.gradient} flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300`}
                    style={{ boxShadow: isSelected ? "0 0 20px rgba(255,255,255,0.2)" : "none", transform: isSelected ? "scale(1.05)" : "scale(1)" }}>
                    <span className="text-white font-bold text-xs sm:text-sm">{barber.avatar}</span>
                  </div>
                  <span className="text-white text-[10px] sm:text-xs font-medium text-center leading-tight mb-1">{barber.name}</span>
                  <span className="text-white/40 text-[9px] sm:text-[10px] text-center">{barber.role}</span>
                  <span className="text-white/25 text-[9px] sm:text-[10px] mt-1">{barber.exp}</span>
                  {isSelected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center"><span className="text-black text-[10px] font-bold">✓</span></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECT SERVICES */}
        <div className="transition-all duration-500" style={{ opacity: selectedBarber ? 1 : 0, transform: selectedBarber ? "translateY(0)" : "translateY(10px)", pointerEvents: selectedBarber ? "auto" : "none", maxHeight: selectedBarber ? "600px" : "0", overflow: "hidden" }}>
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/50 text-xs tracking-[0.2em] uppercase whitespace-nowrap">{t.selectServices}</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="space-y-2">
            {services.map((service) => {
              const isChecked = selectedServices.includes(service.id);
              return (
                <button key={service.id} type="button" onClick={() => toggleService(service.id)}
                  className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer text-left"
                  style={{ borderColor: isChecked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)", background: isChecked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.01)" }}>
                  <div className="w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={{ borderColor: isChecked ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)", background: isChecked ? "rgba(255,255,255,0.9)" : "transparent" }}>
                    {isChecked && <span className="text-black text-[11px] font-bold">✓</span>}
                  </div>
                  <span className="text-lg sm:text-xl">{service.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: isChecked ? "white" : "rgba(255,255,255,0.7)" }}>{service.label}</p>
                    <p className="text-white/30 text-xs">{service.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedServices.length > 0 && <p className="text-white/30 text-xs text-center mt-4">{t.servicesSelected(selectedServices.length)}</p>}
        </div>

        <button type="button" onClick={handleContinue} disabled={!canContinue}
          className="w-full mt-6 sm:mt-8 py-3 border tracking-widest text-sm transition-all duration-300"
          style={{ borderColor: canContinue ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)", color: canContinue ? "white" : "rgba(255,255,255,0.3)", cursor: canContinue ? "pointer" : "not-allowed" }}
          onMouseEnter={(e) => { if (canContinue) { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = canContinue ? "white" : "rgba(255,255,255,0.3)"; }}>
          {t.continue}
        </button>
        <button onClick={() => navigate("/")} type="button" className="w-full mt-3 text-white/50 text-sm hover:text-white transition">{t.close}</button>
      </div>
    </div>
  );
}

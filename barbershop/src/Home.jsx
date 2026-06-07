import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

export default function Home() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <video
        src="/videos/barbershop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/70 z-[1]" />

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white p-2"
        >
          <FaTimes size={24} />
        </button>
        <p className="text-white/30 tracking-[0.5em] text-xs uppercase mb-2">
          DS BARBERS
        </p>
        {[
          { label: t.home, to: "/" },
          { label: t.portfolio, to: "/Portfolio" },
          { label: t.about, to: "/About" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMenuOpen(false)}
            className="text-white text-3xl tracking-[0.2em] uppercase hover:text-gray-400 transition font-light"
          >
            {item.label}
          </Link>
        ))}
        <div className="h-px w-16 bg-white/30 my-2" />
        <Link
          to="/Selectservices"
          onClick={() => setMenuOpen(false)}
          className="border border-white px-8 py-3 text-sm tracking-[0.3em] uppercase hover:bg-white hover:text-black transition"
        >
          {t.bookNow}
        </Link>
        <div className="mt-2">
          <LangSwitcher />
        </div>
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-20 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-widest">DS</div>
        <ul className="hidden md:flex gap-10 ml-10 text-sm tracking-widest uppercase">
          <li className="hover:text-gray-400 cursor-pointer">
            <Link to="/">{t.home}</Link>
          </li>
          <li className="hover:text-gray-400 cursor-pointer">
            <Link to="/Portfolio">{t.portfolio}</Link>
          </li>
          <li className="hover:text-gray-400 cursor-pointer">
            <Link to="/About">{t.about}</Link>
          </li>
        </ul>
        <div className="hidden md:flex items-center gap-4">
          <LangSwitcher />
        </div>
        <button
          className="md:hidden z-20 p-2 text-white"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars size={22} />
        </button>
      </nav>

      {/* Social Sidebar */}
      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20">
        <FaTwitter className="cursor-pointer hover:text-gray-400 transition" />
        <FaInstagram className="cursor-pointer hover:text-gray-400 transition" />
        <FaFacebookF className="cursor-pointer hover:text-gray-400 transition" />
        <span className="text-xs tracking-widest rotate-180 [writing-mode:vertical-rl] mt-4 text-gray-400">
          {t.ourSocials}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
        <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-4">
          {t.premiumGrooming}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider mb-6 md:mb-8 font-light font-serif">
          DS BARBERS
        </h1>
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-8 rounded-full border border-white/60 flex items-center justify-center overflow-hidden">
          <img
            src="/images.png"
            alt="DS Barbers"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <Link to="/Selectservices">
          <button className="border border-white px-8 sm:px-10 py-3 text-xs sm:text-sm tracking-[0.3em] hover:bg-white hover:text-black transition uppercase">
            {t.bookNow}
          </button>
        </Link>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');`}</style>
    </div>
  );
}

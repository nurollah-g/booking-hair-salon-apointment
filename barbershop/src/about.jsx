import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

export default function About() {
  const { t } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='white' stroke-width='1'%3E%3Crect x='4' y='8' width='40' height='32' rx='3'/%3E%3Ccircle cx='16' cy='24' r='3'/%3E%3Ccircle cx='32' cy='24' r='3'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "48px" }} />

      <nav className="absolute top-0 left-0 w-full z-20 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-widest"><Link to="/">DS</Link></div>
        <ul className="hidden md:flex gap-10 text-sm tracking-widest uppercase">
          <li className="hover:text-gray-400"><Link to="/">{t.home}</Link></li>
          <li className="hover:text-gray-400"><Link to="/Portfolio">{t.portfolio}</Link></li>
          <li className="hover:text-gray-400"><Link to="/About">{t.about}</Link></li>
        </ul>
        <div className="hidden md:block"><LangSwitcher /></div>
        <div className="md:hidden"><FaBars size={20} className="cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} /></div>
      </nav>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-lg z-30 py-6 px-6 border-b border-white/20 md:hidden">
          <ul className="flex flex-col gap-5 text-sm tracking-widest uppercase mb-4">
            <li><Link to="/" className="hover:text-gray-400" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link></li>
            <li><Link to="/Portfolio" className="hover:text-gray-400" onClick={() => setMobileMenuOpen(false)}>{t.portfolio}</Link></li>
            <li><Link to="/About" className="hover:text-gray-400" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link></li>
          </ul>
          <LangSwitcher />
        </div>
      )}

      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20">
        <FaTwitter className="cursor-pointer hover:text-gray-400" />
        <FaInstagram className="cursor-pointer hover:text-gray-400" />
        <FaFacebookF className="cursor-pointer hover:text-gray-400" />
        <span className="text-xs tracking-widest rotate-180 [writing-mode:vertical-rl] mt-4 text-gray-400">{t.ourSocials}</span>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-24">
        <div className="max-w-5xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-auto bg-gray-900">
              <iframe title="DS Barbers Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2593.512!2d51.3890!3d35.7635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491d6c7d5b%3A0x4f2c5e3a8b9d6c7f!2sVanak%20Square%2C%20Tehran!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" className="w-full h-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center gap-6">
              <h2 className="text-2xl sm:text-3xl font-serif tracking-wide border-b border-white/30 pb-3">{t.contactUs}</h2>
              <div className="space-y-4 text-gray-200">
                <div><p className="text-xs uppercase tracking-wider text-gray-400">{t.phone}</p><p className="text-lg sm:text-xl font-medium">+98 21 1234 5678</p></div>
                <div><p className="text-xs uppercase tracking-wider text-gray-400">{t.email}</p><p className="text-lg sm:text-xl font-medium break-all">info@dsbarbers.com</p></div>
                <div><p className="text-xs uppercase tracking-wider text-gray-400">{t.address}</p><p className="text-lg sm:text-xl font-medium">No. 12, Vanak Sq., Tehran, Iran</p></div>
                <div><p className="text-xs uppercase tracking-wider text-gray-400">{t.workingHours}</p><p className="text-lg sm:text-xl font-medium">{t.workingHoursValue}</p></div>
              </div>
              <Link to="/Selectservices"><button className="border border-white/60 px-6 py-2 text-sm tracking-widest hover:bg-white hover:text-black transition">{t.bookNow}</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

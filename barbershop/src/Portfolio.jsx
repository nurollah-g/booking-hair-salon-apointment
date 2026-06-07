import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaFacebookF, FaBars, FaPlay, FaTimes } from "react-icons/fa";
import { useLang } from "./LanguageContext";
import LangSwitcher from "./LangSwitcher";

const VideoPortfolio = () => {
  const { t } = useLang();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef(null);

  const videos = [
    { id:1, title:"SKIN FADE MASTERCLASS", category:t.tutorial, duration:"4:32", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail:"https://images.unsplash.com/photo-1585747860714-2ba616e700b6?w=600&h=400&fit=crop", description:"Professional skin fade technique from zero to hero" },
    { id:2, title:"FULL BEARD TRANSFORMATION", category:t.beforeAfter, duration:"3:48", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", description:"Complete beard grooming and shaping transformation" },
    { id:3, title:"HOT TOWEL SHAVE EXPERIENCE", category:t.service, duration:"5:15", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFunflies.mp4", thumbnail:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", description:"Traditional hot towel shave ritual with straight razor" },
    { id:4, title:"CLIENT MAKEOVER STORY", category:t.testimonial, duration:"6:20", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", thumbnail:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop", description:"Real client transformation before and after" },
    { id:5, title:"SCISSOR OVER COMB TECHNIQUE", category:t.technique, duration:"7:05", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", thumbnail:"https://images.unsplash.com/photo-1585747860714-2ba616e700b6?w=600&h=400&fit=crop", description:"Advanced scissor work and texturizing methods" },
    { id:6, title:"BEHIND THE CHAIR", category:t.behindScenes, duration:"8:45", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", thumbnail:"https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&h=400&fit=crop", description:"A real day in our barbershop from opening to closing" },
    { id:7, title:"MID FADE WITH DESIGN", category:t.tutorial, duration:"5:30", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCar.mp4", thumbnail:"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop", description:"Creative mid fade with custom hair design pattern" },
    { id:8, title:"LUXURY HAIR WASH SERVICE", category:t.service, duration:"3:15", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail:"https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop", description:"Relaxing premium hair wash and scalp massage" },
    { id:9, title:"RAZOR LINE UP PERFECTION", category:t.technique, duration:"4:22", videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail:"https://images.unsplash.com/photo-1622286343623-9ba22787d96b?w=600&h=400&fit=crop", description:"Precision razor edge up and line work mastery" },
  ];

  const openVideoModal = (video) => { setSelectedVideo(video); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedVideo(null); };

  useEffect(() => { const handleEsc = (e) => { if (e.key === "Escape" && isModalOpen) closeModal(); }; window.addEventListener("keydown", handleEsc); return () => window.removeEventListener("keydown", handleEsc); }, [isModalOpen]);
  useEffect(() => { document.body.style.overflow = isModalOpen ? "hidden" : "unset"; return () => { document.body.style.overflow = "unset"; }; }, [isModalOpen]);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='white' stroke-width='1'%3E%3Crect x='4' y='8' width='40' height='32' rx='3'/%3E%3Ccircle cx='16' cy='24' r='3'/%3E%3Ccircle cx='32' cy='24' r='3'/%3E%3Cpath d='M4 16 L44 16' stroke-width='0.5'/%3E%3Cpath d='M4 32 L44 32' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "48px" }} />

      <nav className="absolute top-0 left-0 w-full z-20 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-widest"><Link to="/">DS</Link></div>
        <ul className="hidden md:flex gap-10 text-sm tracking-widest uppercase">
          <li className="hover:text-gray-400 cursor-pointer"><Link to="/">{t.home}</Link></li>
          <li className="hover:text-gray-400 cursor-pointer"><Link to="/Portfolio">{t.portfolio}</Link></li>
          <li className="hover:text-gray-400 cursor-pointer"><Link to="/About">{t.about}</Link></li>
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

      <div className="relative pt-32 pb-20 w-full overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-wider mb-4">{t.videoPortfolio} <span className="text-white/40">{t.videoPortfolioSub}</span></h1>
          <p className="text-white/50 text-sm sm:text-base tracking-wide max-w-2xl mx-auto">{t.portfolioDesc}</p>
          <div className="w-16 h-px bg-white/20 my-6 mx-auto" />
          <div className="flex gap-4 justify-center text-xs tracking-widest text-white/30">
            <span>{t.videos(videos.length)}</span><span>✦</span><span>{t.cinematic}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[t.all, t.tutorial, t.beforeAfter, t.service, t.technique, t.behindScenes, t.testimonial].map((filter) => (
            <button key={filter} className="px-5 py-2 text-xs tracking-widest border border-white/20 hover:border-white/60 hover:text-white transition-all duration-300 text-white/60">{filter}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video) => (
            <div key={video.id} className="group relative bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500" onClick={() => openVideoModal(video)}>
              <div className="relative aspect-video overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300"><FaPlay className="text-white text-lg ml-1" /></div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono">{video.duration}</div>
                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-[10px] tracking-wider">{video.category}</div>
              </div>
              <div className="p-5"><h3 className="text-base font-semibold tracking-wide mb-1">{video.title}</h3><p className="text-white/40 text-xs tracking-wider">{video.description}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center border-t border-white/10 pt-12">
          <p className="text-white/40 text-sm tracking-widest mb-6">{t.readyTransformation}</p>
          <Link to="/Selectservices"><button className="border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300">{t.bookAppointment}</button></Link>
        </div>
      </div>

      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} onClick={closeModal}>
          <div className="relative w-full bg-black/60 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxWidth: "min(860px, 90vw)", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex-shrink-0">
              <div><h3 className="text-base sm:text-lg font-semibold tracking-wider">{selectedVideo.title}</h3><p className="text-white/40 text-xs tracking-widest mt-0.5">{selectedVideo.category}</p></div>
              <button onClick={closeModal} className="text-white/60 hover:text-white transition p-1 ml-4 flex-shrink-0"><FaTimes size={20} /></button>
            </div>
            <div className="relative bg-black flex-shrink-0" style={{ maxHeight: "55vh" }}>
              <video ref={videoRef} src={selectedVideo.videoUrl} className="w-full h-full object-contain" style={{ maxHeight: "55vh", display: "block" }} controls autoPlay playsInline />
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
              <p className="text-white/50 text-xs sm:text-sm flex-1 pr-4 line-clamp-2">{selectedVideo.description}</p>
              <button onClick={closeModal} className="flex-shrink-0 px-4 py-2 border border-white/20 text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-200">{t.close.toUpperCase()}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPortfolio;

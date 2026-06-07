import React from "react";

export default function BarberNav() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="flex justify-center space-x-12 border-b border-gray-700 py-4">
          <li className="relative group cursor-pointer">
            <a
              href="#services"
              className="text-lg font-semibold transition-colors duration-300 hover:text-yellow-500"
            >
              Services
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-500 transition-all group-hover:w-full"></span>
          </li>
          <li className="relative group cursor-pointer">
            <a
              href="#contact"
              className="text-lg font-semibold transition-colors duration-300 hover:text-yellow-500"
            >
              Contact
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-500 transition-all group-hover:w-full"></span>
          </li>
          <li className="relative group cursor-pointer">
            <a
              href="#about"
              className="text-lg font-semibold transition-colors duration-300 hover:text-yellow-500"
            >
              About
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-500 transition-all group-hover:w-full"></span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

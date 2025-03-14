"use client";

import { useState } from "react";
import { LayoutGrid, Users, Image, FileText, Globe, MapPin, GraduationCap, BookOpen } from "lucide-react";

const sections = [
  { key: "about", label: "About", icon: <FileText className="w-5 h-5" /> },
  { key: "contact", label: "Contact Info", icon: <Globe className="w-5 h-5" /> },
  { key: "branches", label: "Branches", icon: <MapPin className="w-5 h-5" /> },
  { key: "gallery", label: "Gallery", icon: <Image className="w-5 h-5" /> },
  { key: "study_dest", label: "Study Destinations", icon: <GraduationCap className="w-5 h-5" /> },
  { key: "test_prep", label: "Test Preparation", icon: <BookOpen className="w-5 h-5" /> },
  { key: "universities", label: "Partner Universities", icon: <Users className="w-5 h-5" /> },
];

const ConsultancySidebar = ({ activeSection, setActiveSection }) => {

  const handleNavigation = (key) => {
    setActiveSection(key);
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">Consultancy Dashboard</h2>
      <ul className="space-y-4">
        {sections.map(({ key, label, icon }) => (
          <li
            key={key}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
              activeSection === key ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
            onClick={() => handleNavigation(key)}
          >
            {icon}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsultancySidebar;

import { useState, useEffect } from "react";
import ConsultancySidebar from "./ConsultancySidebar";
import ConsultancyAbout from "./profile/ConsultancyAbout";
import ConsultancyContact from "./profile/ConsultancyContact";
import ConsultancyBranches from "./profile/ConsultancyBranches";
import ConsultancyGallery from "./profile/ConsultancyGallery";
import ConsultancyStudyDest from "./profile/ConsultancyStudyDest";
import ConsultancyTestPrep from "./profile/ConsultancyTestPrep";
import ConsultancyUniversities from "./profile/ConsultancyUniversities";
import ConsultancyInquiries from "./profile/ConsultancyInquiries"; // Your Inquiries Component

const ConsultancyDashboard = () => {
  const [activeSection, setActiveSection] = useState("about"); // Default section
  const [formData, setFormData] = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);

  // You can add your useEffect or logic here as needed, e.g., fetching data for formData or allDistricts

  return (
    <div className="flex">
      {/* Sidebar */}
      <ConsultancySidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeSection === "about" && <ConsultancyAbout formData={formData} setFormData={setFormData} />}
        {activeSection === "contact" && <ConsultancyContact formData={formData} setFormData={setFormData} allDistricts={allDistricts} />}
        {activeSection === "branches" && <ConsultancyBranches formData={formData} setFormData={setFormData} />}
        {activeSection === "gallery" && <ConsultancyGallery formData={formData} setFormData={setFormData} />}
        {activeSection === "study_dest" && <ConsultancyStudyDest formData={formData} setFormData={setFormData} />}
        {activeSection === "test_prep" && <ConsultancyTestPrep formData={formData} setFormData={setFormData} />}
        {activeSection === "universities" && <ConsultancyUniversities formData={formData} setFormData={setFormData} />}
        {activeSection === "inquiries" && <ConsultancyInquiries />} {/* Inquiries section */}
      </div>
    </div>
  );
};

export default ConsultancyDashboard;

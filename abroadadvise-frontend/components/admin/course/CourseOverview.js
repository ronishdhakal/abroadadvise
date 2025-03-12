// "use client";

// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { fetchUniversities, fetchDisciplines } from "@/utils/api"; // ✅ Import API functions

// const CourseOverview = ({ formData, setFormData, allUniversities = [], allDisciplines = [] }) => {
//   const [loading, setLoading] = useState({ universities: false, disciplines: false });
//   const [universities, setUniversities] = useState([]);
//   const [disciplines, setDisciplines] = useState([]);

//   // ✅ Load Universities
//   useEffect(() => {
//     if (allUniversities.length > 0) {
//       setUniversities(allUniversities);
//     } else {
//       setLoading((prev) => ({ ...prev, universities: true }));
//       fetchUniversities()
//         .then((data) => setUniversities(data.results || []))
//         .catch((error) => console.error("❌ Error fetching universities:", error))
//         .finally(() => setLoading((prev) => ({ ...prev, universities: false })));
//     }
//   }, [allUniversities]);

//   // ✅ Load Disciplines
//   useEffect(() => {
//     if (allDisciplines.length > 0) {
//       setDisciplines(allDisciplines);
//     } else {
//       setLoading((prev) => ({ ...prev, disciplines: true }));
//       fetchDisciplines()
//         .then((data) => setDisciplines(data.results || []))
//         .catch((error) => console.error("❌ Error fetching disciplines:", error))
//         .finally(() => setLoading((prev) => ({ ...prev, disciplines: false })));
//     }
//   }, [allDisciplines]);

//   // ✅ Handle University Selection (Single)
//   const handleUniversityChange = (selectedOption) => {
//     console.log("✅ Selected University:", selectedOption); // Debugging log
//     setFormData((prev) => ({
//       ...prev,
//       university: selectedOption ? selectedOption.value : null, // ✅ Store only the ID
//     }));
//   };

//   // ✅ Handle Discipline Selection (Multiple)
//   const handleDisciplineChange = (selectedOptions) => {
//     setFormData((prev) => ({
//       ...prev,
//       disciplines: selectedOptions ? selectedOptions.map((opt) => opt.value) : [], // ✅ Store list of IDs
//     }));
//   };

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-xl font-bold text-gray-800 mb-4">Course Overview</h2>

//       {/* ✅ University Selection (Single) */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-medium mb-1">University *</label>
//         <Select
//           isLoading={loading.universities}
//           options={universities.map((university) => ({
//             value: university.id,
//             label: university.name,
//           }))}
//           value={
//             universities.find((u) => u.id === formData.university) || null // ✅ Ensure proper selection
//           }
//           onChange={handleUniversityChange}
//           className="w-full"
//           placeholder="Select university..."
//         />
//       </div>

//       {/* ✅ Discipline Selection (Multiple) */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-medium mb-1">Disciplines *</label>
//         <Select
//           isMulti
//           isLoading={loading.disciplines}
//           options={disciplines.map((discipline) => ({
//             value: discipline.id,
//             label: discipline.name,
//           }))}
//           value={formData.disciplines
//             ?.map((id) => {
//               const discipline = disciplines.find((d) => d.id === id);
//               return discipline ? { value: discipline.id, label: discipline.name } : null;
//             })
//             .filter(Boolean)}
//           onChange={handleDisciplineChange}
//           className="w-full"
//           placeholder="Select disciplines..."
//         />
//       </div>
//     </div>
//   );
// };

// export default CourseOverview;

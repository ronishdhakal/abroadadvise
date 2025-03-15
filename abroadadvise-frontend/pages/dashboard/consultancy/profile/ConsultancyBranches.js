"use client";

import { useState, useEffect } from "react";
import { Trash, Plus } from "lucide-react";

const ConsultancyBranches = ({ formData, setFormData, onUpdate }) => {
  const [branches, setBranches] = useState([]);

  // ✅ Load branches from formData when available
  useEffect(() => {
    setBranches(formData.branches || []);
  }, [formData]);

  // ✅ Add a new branch
  const handleAddBranch = () => {
    const newBranch = { id: Date.now(), branch_name: "", location: "", phone: "", email: "" };
    const updatedBranches = [...branches, newBranch];

    setBranches(updatedBranches);
    onUpdate({ branches: updatedBranches }); // Pass changes to parent
  };

  // ✅ Update a specific branch field
  const handleBranchChange = (index, field, value) => {
    const updatedBranches = branches.map((branch, i) =>
      i === index ? { ...branch, [field]: value } : branch
    );

    setBranches(updatedBranches);
    onUpdate({ branches: updatedBranches }); // Pass changes to parent
  };

  // ✅ Delete a branch
  const handleDeleteBranch = (index) => {
    const updatedBranches = branches.filter((_, i) => i !== index);

    setBranches(updatedBranches);
    onUpdate({ branches: updatedBranches }); // Pass changes to parent
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Branches</h2>

      <div className="space-y-4">
        {branches.length === 0 && (
          <p className="text-gray-500">No branches added yet. Click "Add Branch" to add one.</p>
        )}

        {branches.map((branch, index) => (
          <div key={branch.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Branch Name</label>
              <input
                type="text"
                value={branch.branch_name || ""}
                onChange={(e) => handleBranchChange(index, "branch_name", e.target.value)}
                className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                type="text"
                value={branch.location || ""}
                onChange={(e) => handleBranchChange(index, "location", e.target.value)}
                className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Phone</label>
              <input
                type="text"
                value={branch.phone || ""}
                onChange={(e) => handleBranchChange(index, "phone", e.target.value)}
                className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={branch.email || ""}
                onChange={(e) => handleBranchChange(index, "email", e.target.value)}
                className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="button"
              onClick={() => handleDeleteBranch(index)}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-md transition duration-200 w-full flex items-center justify-center"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Branch
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddBranch}
        className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Branch
      </button>
    </div>
  );
};

export default ConsultancyBranches;

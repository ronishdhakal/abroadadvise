"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ExamForm from "@/components/admin/ExamForm";
import {
  fetchExams,
  deleteExam,
  fetchExamDetails,
} from "@/utils/api";

const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch exams
  const loadExams = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchExams(page, search);
      setExams(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Failed to load exams:", err);
      setError("Failed to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    const originalExams = [...exams];
    setExams((prev) => prev.filter((e) => e.slug !== slug));

    try {
      await deleteExam(slug);
      setSuccessMessage("Exam deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete exam:", err);
      setError("Failed to delete exam.");
      setExams(originalExams); // Revert on failure
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const examData = await fetchExamDetails(slug);
      setEditingData(examData);
    } catch (err) {
      console.error("❌ Failed to load exam details for editing:", err);
      setError("Failed to load exam details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Exam saved successfully!");
    loadExams();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Exams</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Field */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset page when new search is triggered
          }}
          className="border rounded-lg p-2 w-full"
        />
        <button
          onClick={loadExams}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ✅ Toggle Form */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingSlug(null);
          setEditingData(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add New Exam"}
      </button>

      {showForm && (
        <ExamForm
          examSlug={editingSlug}
          examData={editingData}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingSlug(null);
            setEditingData(null);
          }}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Icon</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={exam.id}>
                  <td className="border p-2">{index + 1 + (page - 1) * 10}</td>
                  <td className="border p-2">{exam.name}</td>
                  <td className="border p-2">{exam.type.replace("_", " ")}</td>
                  <td className="border p-2">
                    {exam.icon ? (
                      <img
                        src={exam.icon}
                        alt="Exam Icon"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      "No Icon"
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(exam.slug)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.slug)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default ExamPage;

"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import ExamForm from "@/components/admin/ExamForm";
import {
  fetchExams,
  deleteExam,
  fetchExamDetails,
} from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination";

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
      setExams(originalExams);
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
      <Head>
        <title>Manage Exams | Admin Panel</title>
        <meta
          name="description"
          content="Manage exams in Abroad Advise admin panel. Add, edit, and delete exam records seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Exams</h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search exams..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadExams}
              className="bg-[#4c9bd5] text-white px-4 py-3 rounded-lg hover:bg-[#3a8cc4] transition-all"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSlug(null);
              setEditingData(null);
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              showForm
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
            }`}
          >
            {showForm ? "Cancel" : "Add New Exam"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
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
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading exams...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Name</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Type</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Icon</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.length > 0 ? (
                    exams.map((exam, index) => (
                      <tr
                        key={exam.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                        <td className="p-4 text-gray-800">{exam.name}</td>
                        <td className="p-4 text-gray-600">{exam.type.replace("_", " ")}</td>
                        <td className="p-4">
                          {exam.icon ? (
                            <img
                              src={exam.icon}
                              alt="Exam Icon"
                              className="w-12 h-12 object-contain rounded"
                            />
                          ) : (
                            <span className="text-gray-500">No Icon</span>
                          )}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(exam.slug)}
                            className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exam.slug)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-600">
                        No exams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExamPage;
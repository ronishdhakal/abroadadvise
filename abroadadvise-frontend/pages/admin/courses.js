"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import CourseForm from "@/components/admin/CourseForm";
import {
  fetchCourses,
  deleteCourse,
  fetchDestinations,
  fetchUniversities,
  fetchDisciplines,
  fetchCourseDetails,
} from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination";

const CoursesPage = ({ initialCourses }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [allDestinations, setAllDestinations] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allDisciplines, setAllDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Load paginated courses
  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchCourses(page, search);
      setCourses(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, search]);

  // ✅ Dropdown data (only once)
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const destinationsData = await fetchDestinations();
        setAllDestinations(destinationsData.results || []);

        const universitiesData = await fetchUniversities();
        setAllUniversities(universitiesData.results || []);

        const disciplinesData = await fetchDisciplines();
        setAllDisciplines(disciplinesData.results || []);
      } catch (err) {
        console.error("❌ Failed to load dropdowns:", err);
        setError("Failed to load dropdown options.");
      }
    };
    loadOptions();
  }, []);

  // ✅ Handle Delete
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const originalCourses = [...courses];
    setCourses((prev) => prev.filter((c) => c.slug !== slug));

    try {
      await deleteCourse(slug);
      setSuccessMessage("Course deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete course:", err);
      setError("Failed to delete course.");
      setCourses(originalCourses);
    }
  };

  // ✅ Edit: fetch course by slug
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);
    try {
      const courseData = await fetchCourseDetails(slug);
      setEditingData(courseData);
    } catch (err) {
      console.error("❌ Failed to load course:", err);
      setError("Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ After successful create/update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Course saved successfully!");
    loadCourses();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Courses | Admin Panel</title>
        <meta
          name="description"
          content="Manage courses in Abroad Advise admin panel. Add, edit, and delete course records seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Courses</h1>

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
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadCourses}
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
            {showForm ? "Cancel" : "Add New Course"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <CourseForm
              courseSlug={editingSlug}
              courseData={editingData}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingSlug(null);
                setEditingData(null);
              }}
              allDestinations={allDestinations}
              allUniversities={allUniversities}
              allDisciplines={allDisciplines}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading courses...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Name</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">University</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Duration</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr
                      key={course.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                      <td className="p-4 text-gray-800">{course.name}</td>
                      <td className="p-4 text-gray-600">{course.university_details?.name || "N/A"}</td>
                      <td className="p-4 text-gray-600">{course.duration || "N/A"}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(course.slug)}
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.slug)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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

// ✅ Server-Side Initial Fetch
export async function getServerSideProps() {
  try {
    const courses = await fetchCourses(1);
    return { props: { initialCourses: courses.results || [] } };
  } catch (error) {
    return { props: { initialCourses: [] } };
  }
}

export default CoursesPage;
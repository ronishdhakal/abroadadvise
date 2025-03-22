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
  fetchCourseDetails, // ✅ You need this separate API for one course
} from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination"; // ✅ Reuse your pagination component

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
      const data = await fetchCourses(page, search); // ⬅ page + search
      setCourses(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // ✅ server-side pagination
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

  // ✅ Edit: fetch course by slug (corrected)
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);
    try {
      const courseData = await fetchCourseDetails(slug); // ✅ FIXED here
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
        <meta name="description" content="Manage courses in Abroad Advise admin panel. Add, edit, and delete course records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button onClick={loadCourses} className="bg-blue-500 text-white px-4 py-2 rounded">
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
        {showForm ? "Cancel" : "Add New Course"}
      </button>

      {/* ✅ Course Form */}
      {showForm && (
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
      )}

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">University</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id}>
                  <td className="border p-2">{index + 1 + (page - 1) * 10}</td>
                  <td className="border p-2">{course.name}</td>
                  <td className="border p-2">{course.university_details?.name || "N/A"}</td>
                  <td className="border p-2">{course.duration || "N/A"}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(course.slug)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(course.slug)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
};

// ✅ Server-Side Initial Fetch
export async function getServerSideProps() {
  try {
    const courses = await fetchCourses(1); // First page only
    return { props: { initialCourses: courses.results || [] } };
  } catch (error) {
    return { props: { initialCourses: [] } };
  }
}

export default CoursesPage;

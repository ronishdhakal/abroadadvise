"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ SEO optimization
import AdminLayout from "@/components/admin/AdminLayout";
import CourseForm from "@/components/admin/CourseForm";



import {
  fetchCourses,
  deleteCourse,
  fetchDestinations,
  fetchUniversities,
  fetchDisciplines,
} from "@/utils/api";

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
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch courses dynamically when page or search query changes
  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchCourses(page, search);
      console.log("✅ Fetched Courses Data:", data.results);
      setCourses(data.results);
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

  // ✅ Fetch Study Destinations, Universities, and Disciplines for Dropdowns
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
        console.error("❌ Failed to load options:", err);
        setError("Failed to load study destinations, universities, or disciplines.");
      }
    };

    loadOptions();
  }, []);

  // ✅ Handle Delete Course
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    // Optimistic UI update
    const originalCourses = [...courses];
    setCourses((prev) => prev.filter((c) => c.slug !== slug));

    try {
      await deleteCourse(slug);
      setSuccessMessage("Course deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete course:", err);
      setError("Failed to delete course.");
      setCourses(originalCourses); // Revert UI on failure
    }
  };

  // ✅ Handle Edit Course (Pre-fill Form)
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const courseData = await fetchCourses(slug);
      console.log("✅ Editing Course:", courseData);
      setEditingData(courseData);
    } catch (err) {
      console.error("❌ Failed to load course details:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Successful Create/Update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Course saved successfully!");
    loadCourses();
  };

  return (
    <AdminLayout>
      {/* ✅ SEO Optimization */}
      <Head>
        <title>Manage Courses | Admin Panel</title>
        <meta name="description" content="Manage courses in Abroad Advise admin panel. Add, edit, and delete course records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>

      {/* ✅ Success Message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Functionality */}
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

      {/* ✅ Toggle Form for Create/Edit */}
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

      {/* ✅ Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Loading State */}
      {loading ? (
        <p>Loading courses...</p>
      ) : (
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
                <td className="border p-2">{index + 1}</td>
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
      )}
    </AdminLayout>
  );
};

// ✅ Server-Side Rendering
export async function getServerSideProps() {
  try {
    const courses = await fetchCourses();
    return { props: { initialCourses: courses.results || [] } };
  } catch (error) {
    return { props: { initialCourses: [] } };
  }
}

export default CoursesPage;

"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

// Importing course components
import CourseHeader from "./CourseHeader";
import CourseSummary from "./CourseSummary";
import CourseOverview from "./CourseOverview";
import CourseDiscipline from "./CourseDiscipline";
import CourseEligibility from "./CourseEligibility";
import CourseStructure from "./CourseStructure";
import CourseCareer from "./CourseCareer";
import CourseScholarship from "./CourseScholarship";
import CourseFeatures from "./CourseFeatures";
import CourseAbout from "./CourseAbout";
import CourseConsultancies from "./CourseConsultancies"; // ✅ New Component

// Importing 404 page
import Custom404 from "../404"; // ✅ Import 404 Page

export default function CourseDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState(null);
  const [consultancies, setConsultancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/${slug}/`);

        if (!response.ok) {
          setIsNotFound(true); // ✅ Instead of throwing an error, mark as 404
          return;
        }

        const data = await response.json();
        setCourse(data);
        console.log("Fetched Course Data:", data);

        // ✅ Fetch Consultancies (only if university exists)
        if (data.university) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultancy/?university=${data.university.slug}`)
            .then(res => res.json())
            .then(result => {
              setConsultancies(result.results || []);
              console.log("Fetched Consultancies:", result.results);
            })
            .catch(err => console.error("Error fetching consultancies:", err));
        }
      } catch (error) {
        console.error("Course Fetch Error:", error);
        setIsNotFound(true); // ✅ Mark as 404 if API call fails
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  // ✅ Show loading while fetching
  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  }

  // ✅ Show 404 page if the course is not found
  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{course ? `${course.name} - Abroad Advise` : "Course Details"}</title>
      </Head>
      <Header />

      {/* ✅ Main Layout */}
      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {course && (
          <>
            {/* ✅ Course Header */}
            <CourseHeader course={course} />

            {/* ✅ Course Summary */}
            <CourseSummary course={course} />

            {/* ✅ Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ✅ Left Sidebar */}
              <div className="space-y-6 md:col-span-1">
                {/* ✅ Course Overview */}
                <CourseOverview course={course} />

                {/* ✅ Disciplines */}
                {course.disciplines?.length > 0 && (
                  <CourseDiscipline disciplines={course.disciplines.map(d => d.name)} />
                )}

                {/* ✅ University Information */}
                {course.university && (
                  <div className="bg-white shadow-md rounded-lg p-5 border">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">University</h2>
                    <p className="text-gray-700">
                      <strong>{course.university.name}</strong>
                    </p>
                    <p className="text-gray-500 text-sm">{course.university.country || "Location not available"}</p>
                    <a
                      href={`/university/${course.university.slug}`}
                      className="mt-4 block px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition"
                    >
                      View University
                    </a>
                  </div>
                )}

                {/* ✅ Consultancies (appears below university in Desktop) */}
                {consultancies.length > 0 && (
                  <div className="hidden md:block">
                    <CourseConsultancies consultancies={consultancies} course={course} />
                  </div>
                )}
              </div>

              {/* ✅ Right Content Section */}
              <div className="md:col-span-2 space-y-6">
                {/* ✅ Consultancies (appears above eligibility in Mobile) */}
                {consultancies.length > 0 && (
                  <div className="md:hidden">
                    <CourseConsultancies consultancies={consultancies} course={course} />
                  </div>
                )}

                {/* ✅ Eligibility */}
                <CourseEligibility eligibility={course.eligibility} />

                {/* ✅ Scholarship */}
                <CourseScholarship scholarship={course.scholarship} />

                {/* ✅ Course Career */}
                <CourseCareer jobProspects={course.job_prospects} />

                {/* ✅ Course Structure */}
                <CourseStructure structure={course.course_structure} />

                {/* ✅ Course Features */}
                <CourseFeatures features={course.features} />

                {/* ✅ About Section */}
                <CourseAbout about={course.short_description} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

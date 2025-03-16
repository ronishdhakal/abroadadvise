import Head from "next/head";
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
import CourseConsultancies from "./CourseConsultancies";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Custom404 from "../404";
import { useState } from "react";

export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    // ✅ Use `expand=university` to fetch full university data
    const res = await fetch(`${API_URL}/course/${params.slug}/?expand=university`);

    if (!res.ok) {
      return { notFound: true };
    }

    const course = await res.json();

    return {
      props: { course }, // ✅ Only pass course data
    };
  } catch (error) {
    console.error("❌ Error fetching course data:", error);
    return { notFound: true };
  }
}

const CourseDetailPage = ({ course }) => {
  if (!course) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>Study {course.name} – Fee, Career & Course Structure</title>
        <meta
          name="description"
          content={`Discover everything about ${course.name}, including career prospects, top universities, and study abroad options. Get expert guidance to choose the right path for your future!`}
        />

        {/* ✅ Open Graph (For Facebook, LinkedIn, etc.) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Study ${course.name} – Career, Fees & Opportunities`} />
        <meta property="og:description" content={`Learn about ${course.name}, career paths, top universities, and study abroad options.`} />
        <meta property="og:image" content={course.cover_image || "/default-course.jpg"} />
        <meta property="og:url" content={`https://abroadadvise.com/course/${course.slug}`} />

        {/* ✅ Twitter Card (For Twitter/X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Study ${course.name} – Career, Fees & Universities`} />
        <meta name="twitter:description" content={`Explore ${course.name}, career opportunities, course structure, and university options.`} />
        <meta name="twitter:image" content={course.cover_image || "/default-course.jpg"} />

        {/* ✅ Schema Markup (Google Rich Snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": course.name,
              "description": course.short_description || "A top study abroad course with excellent career prospects.",
              "provider": {
                "@type": "EducationalOrganization",
                "name": course.university?.name || "Multiple Universities",
                "url": course.university ? `https://abroadadvise.com/university/${course.university.slug}` : null,
              },
            }),
          }}
        />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* ✅ Course Header */}
        <CourseHeader course={course} />

        {/* ✅ Course Summary */}
        <CourseSummary course={course} />

        {/* ✅ Main Content Layout */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ✅ Left Sidebar */}
          <div className="space-y-6 md:col-span-1">
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
             <CourseConsultancies course={course} />
          </div>

          {/* ✅ Right Content Section */}
          <div className="md:col-span-2 space-y-6">
            {/* ✅ Eligibility */}
            <CourseEligibility eligibility={course.eligibility} />

            {/* ✅ Scholarship */}
            <CourseScholarship scholarship={course.scholarship} />

            {/* ✅ Career Prospects */}
            <CourseCareer jobProspects={course.job_prospects} />

            {/* ✅ Course Structure */}
            <CourseStructure structure={course.course_structure} />

            {/* ✅ Course Features */}
            <CourseFeatures features={course.features} />

            {/* ✅ About Section */}
            <CourseAbout about={course.short_description} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CourseDetailPage;

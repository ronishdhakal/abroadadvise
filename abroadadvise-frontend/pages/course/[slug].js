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

export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${API_URL}/course/${params.slug}/`);

    if (!res.ok) {
      return { notFound: true };
    }

    const course = await res.json();

    return {
      props: { course },
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

  // ✅ Normalize field names to avoid breaking existing usage
  const normalizedCourse = {
    ...course,
    university: course.university_details || null,
    destination: course.destination_details || null,
    disciplines: course.disciplines_details || [],
  };

  return (
    <>
      <Head>
        <title>Study {normalizedCourse.name} – Fee, Career & Course Structure</title>
        <meta
          name="description"
          content={`Discover everything about ${normalizedCourse.name}, including career prospects, top universities, and study abroad options. Get expert guidance to choose the right path for your future!`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Study ${normalizedCourse.name} – Career, Fees & Opportunities`} />
        <meta property="og:description" content={`Learn about ${normalizedCourse.name}, career paths, top universities, and study abroad options.`} />
        <meta property="og:image" content={normalizedCourse.cover_image || "/default-course.jpg"} />
        <meta property="og:url" content={`https://abroadadvise.com/course/${normalizedCourse.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Study ${normalizedCourse.name} – Career, Fees & Universities`} />
        <meta name="twitter:description" content={`Explore ${normalizedCourse.name}, career opportunities, course structure, and university options.`} />
        <meta name="twitter:image" content={normalizedCourse.cover_image || "/default-course.jpg"} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": normalizedCourse.name,
              "description": normalizedCourse.short_description || "A top study abroad course with excellent career prospects.",
              "provider": {
                "@type": "EducationalOrganization",
                "name": normalizedCourse.university?.name || "Multiple Universities",
                "url": normalizedCourse.university ? `https://abroadadvise.com/university/${normalizedCourse.university.slug}` : null,
              },
            }),
          }}
        />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        <CourseHeader course={normalizedCourse} />
        <CourseSummary course={normalizedCourse} />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <CourseOverview course={normalizedCourse} />

            {normalizedCourse.disciplines.length > 0 && (
              <CourseDiscipline disciplines={normalizedCourse.disciplines} />
            )}

            {normalizedCourse.university && (
              <div className="bg-white shadow-md rounded-lg p-5 border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">University</h2>
                <p className="text-gray-700">
                  <strong>{normalizedCourse.university.name}</strong>
                </p>
                <p className="text-gray-500 text-sm">{normalizedCourse.university.country || "Location not available"}</p>
                <a
                  href={`/university/${normalizedCourse.university.slug}`}
                  className="mt-4 block px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition"
                >
                  View University
                </a>
              </div>
            )}

            <CourseConsultancies course={normalizedCourse} />
          </div>

          <div className="md:col-span-2 space-y-6">
            <CourseEligibility eligibility={normalizedCourse.eligibility} />
            <CourseScholarship scholarship={normalizedCourse.scholarship} />
            <CourseCareer jobProspects={normalizedCourse.job_prospects} />
            <CourseStructure structure={normalizedCourse.course_structure} />
            <CourseFeatures features={normalizedCourse.features} />
            <CourseAbout about={normalizedCourse.short_description} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CourseDetailPage;

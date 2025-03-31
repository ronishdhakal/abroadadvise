import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UniversityHeader from "./UniversityHeader";
import UniversityOverview from "./UniversityOverview";
import UniversityContact from "./UniversityContact";
import UniversityConsultancies from "./UniversityConsultancies";
import UniversityAbout from "./UniversityAbout";
import UniversityCourses from "./UniversityCourses";
import UniversityFAQs from "./UniversityFAQs";
import UniversityFacilities from "./UniversityFacilities";
import UniversityScholarship from "./UniversityScholarship";
import UniversityEligibility from "./UniversityEligibility";
import Custom404 from "../404"; // ✅ Import 404 Page

// ✅ Server-side data fetching
export async function getServerSideProps({ params }) {
  try {
    const universityRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/university/${params.slug}/`
    );
    if (!universityRes.ok) return { notFound: true };
    const university = await universityRes.json();

    const coursesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/course/?university=${params.slug}`
    );
    if (!coursesRes.ok) throw new Error("Failed to fetch courses data");
    const courses = await coursesRes.json();

    return {
      props: {
        university,
        courses: courses.results || [],
      },
    };
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return { notFound: true };
  }
}

export default function UniversityDetail({ university, courses }) {
  const router = useRouter();
  if (!university) return <Custom404 />;

  return (
    <>
      <Head>
        <title>{university.name} - Fee, Scholarships, Eligibility, Facilities</title>
        <meta
          name="description"
          content={`Explore ${university.name}, its courses, scholarships, admission eligibility, and facilities. Find top consultancies to assist with your application.`}
        />
        <meta
          property="og:title"
          content={`${university.name} - Study Details & Scholarships`}
        />
        <meta
          property="og:description"
          content={`Explore ${university.name}, its fee structure, scholarships, eligibility criteria, and available courses. Find top consultancies to assist with admissions.`}
        />
        <meta
          property="og:image"
          content={university.logo || "/default-university.jpg"}
        />
        <meta
          property="og:url"
          content={`https://abroadadvise.com/university/${university.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta
          name="twitter:title"
          content={`${university.name} - Admission Details & Scholarships`}
        />
        <meta
          name="twitter:description"
          content={`Get complete details about ${university.name}, including tuition fees, scholarships, and top programs.`}
        />
        <meta
          name="twitter:image"
          content={university.logo || "/default-university.jpg"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            "name": university.name,
            "url": `https://abroadadvise.com/university/${university.slug}`,
            "logo": university.logo || "/default-university.jpg",
            "description":
              university.about ||
              `Study at ${university.name}, offering top programs, scholarships, and global opportunities.`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": university.country || "N/A",
              "addressRegion": university.city || "N/A",
              "addressCountry": university.country || "N/A",
            },
            "offers": {
              "@type": "EducationalOccupationalCredential",
              "name": "Degree Programs",
              "educationalProgramMode": "Full-time",
              "provider": {
                "@type": "CollegeOrUniversity",
                "name": university.name,
              },
            },
          })}
        </script>
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* University Header Section */}
        <UniversityHeader university={university} />

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <UniversityContact university={university} />
            <UniversityConsultancies university={university} />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <UniversityOverview university={university} />
            <UniversityAbout university={university} />
            <UniversityFacilities university={university} />
            <UniversityScholarship university={university} />
            <UniversityEligibility university={university} />
            <UniversityCourses courses={courses} />
            <UniversityFAQs university={university} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

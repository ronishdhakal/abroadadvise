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
    // ✅ Fetch University Details
    const universityRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/${params.slug}/`);
    if (!universityRes.ok) {
      return { notFound: true };
    }
    const university = await universityRes.json();

    // ✅ Fetch only courses for this university using ?university=slug
    const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/?university=${params.slug}`);
    if (!coursesRes.ok) {
      throw new Error("Failed to fetch courses data");
    }
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
        <meta name="description" content={`Explore ${university.name}, its courses, scholarships, admission eligibility, and facilities. Find top consultancies to assist with your application.`} />
        <meta property="og:title" content={`${university.name} - Study Details & Scholarships`} />
        <meta property="og:description" content={`Explore ${university.name}, its fee structure, scholarships, eligibility criteria, and available courses. Find top consultancies to assist with admissions.`} />
        <meta property="og:image" content={university.logo || "/default-university.jpg"} />
        <meta property="og:url" content={`https://abroadadvise.com/university/${university.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={`${university.name} - Admission Details & Scholarships`} />
        <meta name="twitter:description" content={`Get complete details about ${university.name}, including tuition fees, scholarships, and top programs.`} />
        <meta name="twitter:image" content={university.logo || "/default-university.jpg"} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            "name": university.name,
            "url": `https://abroadadvise.com/university/${university.slug}`,
            "logo": university.logo || "/default-university.jpg",
            "description": university.about || `Study at ${university.name}, offering top programs, scholarships, and global opportunities.`,
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

      <div className="w-full p-0 m-0">
        <UniversityHeader university={university} />
      </div>

      <div className="container mx-auto p-4 space-y-6 md:px-10 lg:px-16 py-0 xl:px-24">
        <div className="w-full">
          <UniversityOverview university={university} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <UniversityContact university={university} />
            <UniversityConsultancies university={university} />
          </div>

          <div className="md:col-span-2 space-y-6">
            <UniversityAbout university={university} />
            <UniversityFacilities university={university} />
            <UniversityScholarship university={university} />
            <UniversityEligibility university={university} />
            <UniversityCourses courses={courses} />
            <UniversityFAQs university={university} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

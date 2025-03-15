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

// Importing custom 404 page
import Custom404 from "../404"; // ✅ Import 404 Page

export async function getServerSideProps({ params }) {
  try {
    // ✅ Fetch University Details
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/${params.slug}/`);
    if (!res.ok) {
      return { notFound: true }; // ✅ Return 404 page
    }
    const university = await res.json();

    // ✅ Fetch Consultancies (using university slug)
    const consultanciesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultancy/?university=${params.slug}`);
    const consultancies = consultanciesRes.ok ? await consultanciesRes.json() : { results: [] };

    // ✅ Fetch Courses (using university slug)
    const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/?university=${params.slug}`);
    const courses = coursesRes.ok ? await coursesRes.json() : { results: [] };

    return {
      props: {
        university,
        consultancies: consultancies.results || [],
        courses: courses.results || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { notFound: true }; // ✅ Return 404 page on failure
  }
}

export default function UniversityDetail({ university, consultancies, courses }) {
  const router = useRouter();

  // ✅ Redirect to 404 page if university is not found
  if (!university) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{university.name} - Abroad Advise</title>
      </Head>

      <Header />

      {/* ✅ University Header (Edge-to-Edge, No Extra Margins) */}
      <div className="w-full p-0 m-0">
        <UniversityHeader university={university} />
      </div>

      {/* ✅ Content Sections (Keep Normal Margins & Spacing) */}
      <div className="container mx-auto p-4 space-y-6 md:px-10 lg:px-16 py-0 xl:px-24">
        {/* University Overview */}
        <div className="w-full">
          <UniversityOverview university={university} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Contact & Consultancies */}
          <div className="space-y-6 md:col-span-1">
            <UniversityContact university={university} />
            <UniversityConsultancies consultancies={consultancies} />
          </div>

          {/* Right Section - Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="w-full">
              <UniversityAbout university={university} />
            </div>
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

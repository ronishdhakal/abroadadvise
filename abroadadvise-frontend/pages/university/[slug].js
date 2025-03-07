import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/header";  // Import Header
import Footer from "@/components/footer";  // Import Footer
import UniversityHeader from "./UniversityHeader";  // University Header Section
import UniversityOverview from "./UniversityOverview";  // University Overview Section
import UniversityContact from "./UniversityContact";  // University Contact Section
import UniversityConsultancies from "./UniversityConsultancies";  // University Consultancies Section
import UniversityAbout from "./UniversityAbout";  // University About Section
import UniversityCourses from "./UniversityCourses";  // University Courses Section
import UniversityFAQs from "./UniversityFAQs";  // University FAQs Section
import UniversityFacilities from "./UniversityFacilities";  // University Facilities Section
import UniversityScholarship from "./UniversityScholarship";  // University Scholarship Section
import UniversityEligibility from "./UniversityEligibility";  // University Eligibility Section

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/${params.slug}/`);
  const university = await res.json();

  // Fetch related data (consultancies, courses, etc.)
  const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/?university=${university.id}`);
  const courses = await coursesRes.json();

  return {
    props: { university, courses: courses.results || [] },
  };
}

export default function UniversityDetail({ university, courses }) {
  const router = useRouter();

  if (!university) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header /> {/* Include Header */}

      <div className="container mx-auto p-6">
        {/* University Header */}
        <UniversityHeader university={university} />

        {/* University Overview */}
        <UniversityOverview university={university} />

        {/* University Contact Information */}
        <UniversityContact university={university} />

        {/* University Consultancies */}
        <UniversityConsultancies consultancies={university.consultancies_to_apply} />

        {/* University About */}
        <UniversityAbout university={university} />

        {/* University Courses */}
        <UniversityCourses courses={courses} />

        {/* University Facilities */}
        <UniversityFacilities university={university} />

        {/* University Scholarships */}
        <UniversityScholarship university={university} />

        {/* University Eligibility */}
        <UniversityEligibility university={university} />

        {/* University FAQs */}
        <UniversityFAQs university={university} />
      </div>

      <Footer /> {/* Include Footer */}
    </div>
  );
}

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection";
import CourseFilters from "./CourseFilters";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages dynamically

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState(null);
  const [universityQuery, setUniversityQuery] = useState(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);

  // Fetch Courses from API
  const fetchCourses = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (searchQuery) queryParams.append("name", searchQuery);
      if (universityQuery) queryParams.append("university", universityQuery);
      if (countryQuery) queryParams.append("country", countryQuery);
      if (selectedDisciplines.length > 0) {
        selectedDisciplines.forEach((discipline) =>
          queryParams.append("disciplines", discipline.value)
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/course/?${queryParams.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.results);
      setFilteredCourses(data.results);
      setTotalPages(data.total_pages || 1); // Dynamically set total pages
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, universityQuery, countryQuery, selectedDisciplines, currentPage]);

  // Extract unique disciplines from courses
  const disciplines = Array.from(
    new Map(
      courses
        .flatMap((course) => course.disciplines)
        .map((discipline) => [discipline.id, discipline])
    ).values()
  );

  // Extract unique universities from courses
  const universities = Array.from(
    new Map(
      courses
        .filter((course) => course.university)
        .map((course) => [
          course.university.slug,
          { slug: course.university.slug, name: course.university.name },
        ])
    ).values()
  );

  // Extract unique countries from universities
  const countries = Array.from(
    new Map(
      courses
        .filter((course) => course.university && course.university.country)
        .map((course) => [
          course.university.country,
          { name: course.university.country },
        ])
    ).values()
  );

  return (
    <>
      <Head>
        <title>Courses - Abroad Advise</title>
      </Head>
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* Use CourseFilters component directly */}
        <CourseFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          universityQuery={universityQuery}
          setUniversityQuery={setUniversityQuery}
          countryQuery={countryQuery}
          setCountryQuery={setCountryQuery}
          selectedDisciplines={selectedDisciplines}
          setSelectedDisciplines={setSelectedDisciplines}
          disciplines={disciplines}
          countries={countries}
          universities={universities}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => <CourseCard key={course.slug} course={course} />)
          ) : (
            <p className="text-center col-span-full text-gray-500">No courses found.</p>
          )}
        </div>

        {/* Pagination only appears when there are multiple pages */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
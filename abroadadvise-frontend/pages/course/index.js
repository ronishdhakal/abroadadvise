"use client";

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
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState(null);
  const [universityQuery, setUniversityQuery] = useState(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);

  // ✅ Fetch Courses from API
  const fetchCourses = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      // ✅ Fixed: DRF expects "search" for SearchFilter
      if (searchQuery) queryParams.append("search", searchQuery);
      if (universityQuery) queryParams.append("university", universityQuery);
      if (countryQuery) queryParams.append("country", countryQuery);
      if (selectedDisciplines.length > 0) {
        selectedDisciplines.forEach((d) =>
          queryParams.append("disciplines", d.value)
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/course/?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.results || []);
      setFilteredCourses(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // ✅ works with DRF pagination
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, universityQuery, countryQuery, selectedDisciplines, currentPage]);

  // ✅ Extract unique disciplines
  const disciplines = Array.from(
    new Map(
      courses
        .flatMap((course) =>
          Array.isArray(course.disciplines_details || course.disciplines)
            ? course.disciplines_details || course.disciplines
            : []
        )
        .map((discipline) => [discipline.id, discipline])
    ).values()
  );

  // ✅ Extract universities
  const universities = Array.from(
    new Map(
      courses
        .map((course) => course.university_details || course.university)
        .filter((uni) => uni && uni.slug)
        .map((uni) => [uni.slug, { slug: uni.slug, name: uni.name }])
    ).values()
  );

  // ✅ Extract countries
  const countries = Array.from(
    new Map(
      courses
        .map((course) => course.university_details || course.university)
        .filter((uni) => uni && uni.country)
        .map((uni) => [uni.country, { name: uni.country }])
    ).values()
  );

  return (
    <>
      <Head>
        <title>Top Courses for Nepalese Students to Study Abroad - Abroad Advise</title>
        <meta
          name="description"
          content="Explore top study abroad courses for Nepalese students and plan your international education journey."
        />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* ✅ Filters */}
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

        {/* ✅ Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {error && (
            <p className="text-center col-span-full text-red-500">{error}</p>
          )}
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No courses found.
            </p>
          )}
        </div>

        {/* ✅ Pagination */}
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

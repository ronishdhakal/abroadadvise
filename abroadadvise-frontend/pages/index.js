import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/pages/home/HeroSection";
import FeaturedConsultancies from "@/pages/home/FeaturedConsultancies";
import FeaturedUniversities from "@/pages/home/FeaturedUniversities";
import FeaturedCourses from "@/pages/home/FeaturedCourses";
import FeaturedEvents from "@/pages/home/FeaturedEvents";
import ZeroSection from "@/pages/home/ZeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ✅ Header */}
      <Header />

      {/* ✅ Hero Section */}
      <HeroSection />

      {/* ✅ Main Content */}
      <main className="flex-1 bg-white py-6"> {/* ⬅️ reduced padding from py-12 to py-6 */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Featured Consultancies */}
          <FeaturedConsultancies />

          {/* Featured Universities */}
          <FeaturedUniversities />

          {/* Featured Courses */}
          <FeaturedCourses />

          {/* Featured Events */}
          <div className="mb-0">
            <FeaturedEvents />
          </div>
        </div>
      </main>

      {/* ✅ Zero Section */}
      <ZeroSection />

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}

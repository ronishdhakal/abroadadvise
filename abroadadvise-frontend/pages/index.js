import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white h-[400px] flex items-center justify-center" style={{ backgroundImage: "url('/media/hero-bg.jpg')" }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center max-w-2xl">
          <h1 className="text-4xl font-bold">Your Study Abroad Journey Starts Here</h1>
          <p className="mt-3 text-lg">Find the best universities, consultancies, and courses for your future.</p>
          <div className="mt-5">
            <Link href="/consultancy" className="bg-blue-600 px-5 py-3 rounded-md text-white font-medium hover:bg-blue-500 transition">
              Find a Consultancy
            </Link>
            <Link href="/university" className="ml-4 bg-gray-700 px-5 py-3 rounded-md text-white font-medium hover:bg-gray-600 transition">
              Explore Universities
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <main className="flex-1 bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Featured Consultancies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800">Top Consultancies</h2>
            <p className="text-center text-gray-600 mt-2">Get expert guidance for studying abroad.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <Link href="/consultancy/aecc" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/consultancy.jpg" alt="Consultancy" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">AECC Global</h3>
                <p className="text-gray-600 text-sm mt-1">Helping students study in Australia, Canada, and the UK.</p>
              </Link>
              <Link href="/consultancy/idp" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/consultancy.jpg" alt="Consultancy" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">IDP Education</h3>
                <p className="text-gray-600 text-sm mt-1">Trusted by students for over 50 years.</p>
              </Link>
            </div>
          </section>

          {/* Featured Universities */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800">Top Universities</h2>
            <p className="text-center text-gray-600 mt-2">Discover globally recognized universities.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <Link href="/university/harvard" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/university.jpg" alt="Harvard" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">Harvard University</h3>
                <p className="text-gray-600 text-sm mt-1">Top-ranked university for global education.</p>
              </Link>
              <Link href="/university/oxford" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/university.jpg" alt="Oxford" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">Oxford University</h3>
                <p className="text-gray-600 text-sm mt-1">World-class education for ambitious students.</p>
              </Link>
            </div>
          </section>

          {/* Featured Destinations */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800">Study Destinations</h2>
            <p className="text-center text-gray-600 mt-2">Find the perfect country for your education.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <Link href="/destination/australia" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/australia.jpg" alt="Australia" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">Australia</h3>
                <p className="text-gray-600 text-sm mt-1">Top universities and student-friendly policies.</p>
              </Link>
              <Link href="/destination/canada" className="block bg-white shadow-md p-4 rounded-md hover:shadow-lg transition">
                <img src="/media/canada.jpg" alt="Canada" className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-3">Canada</h3>
                <p className="text-gray-600 text-sm mt-1">Affordable education and great career prospects.</p>
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FeaturedIndex = () => {
  return (
    <>
      <Head>
        <title>Featured Study Abroad Guides - Abroad Advise</title>
        <meta name="description" content="Explore curated lists of top consultancies for popular destinations like Canada, USA, UK and more." />
      </Head>

      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            Featured Study Abroad Guides
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Discover expertly curated lists of the best education consultancies in Nepal for your study abroad journey.
          </p>
        </section>

        <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1">
            <Link href="/featured/best-consultancy-nepal-canada" className="flex items-center gap-3">
              <span className="text-2xl">🇨🇦</span>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[#4c9bd5] transition-colors duration-200">
                Best Consultancy in Nepal for Canada
              </h3>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1">
            <Link href="/featured/best-consultancy-nepal-usa" className="flex items-center gap-3">
              <span className="text-2xl">🇺🇸</span>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[#4c9bd5] transition-colors duration-200">
                Best Consultancy in Nepal for USA
              </h3>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1">
            <Link href="/featured/best-consultancy-nepal-uk" className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[#4c9bd5] transition-colors duration-200">
                Best Consultancy in Nepal for UK
              </h3>
            </Link>
          </div>
          {/* Add more links as you build more pages */}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 font-light">
            More destinations coming soon — stay tuned for updates!
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FeaturedIndex;
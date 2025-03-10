import Link from "next/link";

export default function ZeroSection() {
  return (
    <section className="bg-[#529dd4] text-white py-16 mt-0 mb-0 text-center"> {/* ✅ Updated background color */}
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg md:text-xl mb-6">
          Get personalized guidance from our experts and take the first step towards your global education goals.
        </p>
        <div className="flex justify-center gap-4">
        <Link
          href="/consultancy" className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition"
>
        Find a Consultancy →
      </Link>

          <Link
            href="/university"
            className="border border-white text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-white hover:text-blue-600 transition"
          >
            Explore Universities
          </Link>
        </div>
      </div>
    </section>
  );
}

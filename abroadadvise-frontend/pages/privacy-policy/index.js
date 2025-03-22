"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

          <p className="text-gray-700 mb-6">
            At Abroad Advise, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or use our services.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">1. What We Collect</h2>
          <p className="text-gray-700 mb-4">
            When you interact with our site — whether you're exploring courses, contacting a consultancy, or signing up — we may collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Your name and email when submitting inquiries</li>
            <li>Basic contact details for consultancies and universities</li>
            <li>Search and browsing behavior to help improve the site</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">2. How We Use Your Info</h2>
          <p className="text-gray-700 mb-6">
            We use your information to help connect students with the right educational institutions, respond to inquiries, improve our services, and display relevant content.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">3. Who We Share It With</h2>
          <p className="text-gray-700 mb-6">
            We don’t sell your personal data. We only share your info with trusted institutions (like verified consultancies or universities) when you reach out to them directly through our platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">4. Your Choices</h2>
          <p className="text-gray-700 mb-6">
            You can always choose not to provide certain information, and you can contact us anytime to update or delete your data.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">5. Cookies</h2>
          <p className="text-gray-700 mb-6">
            We use cookies to understand how people use our site and to make your experience better. You can control cookies through your browser settings.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">6. Updates</h2>
          <p className="text-gray-700 mb-6">
            This Privacy Policy may change as we grow. When we update it, we’ll post the latest version here.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions or concerns, feel free to reach out to us at <strong>info@abroadadvise.com</strong>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

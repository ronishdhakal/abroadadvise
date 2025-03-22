"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>

          <p className="text-gray-700 mb-6">
            Welcome to Abroad Advise! These terms and conditions outline the rules and guidelines for using our website and services.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">1. Using Our Platform</h2>
          <p className="text-gray-700 mb-6">
            Abroad Advise is designed to help students explore consultancies, universities, courses, destinations, and exams related to studying abroad. By using our site, you agree to use the information responsibly and only for personal or academic planning purposes.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">2. Account Responsibilities</h2>
          <p className="text-gray-700 mb-6">
            If you are a consultancy or university with login access, you are responsible for keeping your account secure. Please don’t share your credentials. Any activity under your account is your responsibility.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">3. Content Accuracy</h2>
          <p className="text-gray-700 mb-6">
            We work hard to keep all information accurate and up to date. However, Abroad Advise does not guarantee the absolute accuracy or availability of every course, university, or event listed. We recommend users verify critical details directly with the respective institutions.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">4. Intellectual Property</h2>
          <p className="text-gray-700 mb-6">
            All content on this website, including logos, text, graphics, and data, is the property of Abroad Advise or its content contributors. You may not reuse or redistribute it without written permission.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">5. User-Submitted Information</h2>
          <p className="text-gray-700 mb-6">
            Any data or inquiries submitted by users (like form submissions or leads) may be shared with trusted education partners to help fulfill the inquiry. We do not sell your personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">6. Suspension & Termination</h2>
          <p className="text-gray-700 mb-6">
            We reserve the right to suspend or terminate access to our platform if we detect abuse, misinformation, or activity that violates our terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">7. Changes to Terms</h2>
          <p className="text-gray-700 mb-6">
            These terms may be updated from time to time. If we make major changes, we’ll let users know via the platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">8. Contact Us</h2>
          <p className="text-gray-700">
            Have questions about these terms? Email us at <strong>info@abroadadvise.com</strong>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

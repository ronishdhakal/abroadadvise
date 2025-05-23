"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { API_BASE_URL } from "@/utils/api";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [siteLogo, setSiteLogo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedCode = localStorage.getItem("resetCode");

    if (!storedEmail || !storedCode) {
      router.push("/passreset/request");
    } else {
      setEmail(storedEmail);
      setCode(storedCode);
    }

    const fetchSiteLogo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/site-settings/`);
        const data = await res.json();
        if (data.site_logo_url) setSiteLogo(data.site_logo_url);
      } catch (error) {
        console.error("Error fetching site logo:", error);
      }
    };

    fetchSiteLogo();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/password-reset/set/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setStatus("Password reset successfully. Redirecting to login...");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");

      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 sm:p-10"
        >
          <div className="text-center mb-10">
            {siteLogo ? (
              <Image
                src={siteLogo}
                alt="Site Logo"
                width={180}
                height={50}
                className="mx-auto object-contain transition-all duration-300 hover:opacity-90"
              />
            ) : (
              <span className="text-[#4c9bd5] font-light text-2xl tracking-wide">Abroad Advise</span>
            )}
            <h1 className="mt-6 text-3xl font-light text-gray-800 tracking-wide">Set New Password</h1>
            <p className="mt-2 text-gray-600 text-sm font-light tracking-wide">
              Enter your new password to complete reset
            </p>
          </div>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 mb-6 rounded-r-lg"
            >
              {status}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mb-6 rounded-r-lg"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-light text-gray-700 tracking-wide mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-light text-gray-700 tracking-wide mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:border-transparent transition-all duration-200"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#4c9bd5] text-white rounded-lg text-sm font-light tracking-wide shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c9bd5] transition-all duration-300"
            >
              Reset Password
            </motion.button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SetNewPassword;

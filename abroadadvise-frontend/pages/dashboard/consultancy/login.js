"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const ConsultancyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [siteLogo, setSiteLogo] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Fetch Site Logo
  useEffect(() => {
    const fetchSiteLogo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/site-settings/`);
        const data = await res.json();
        if (data.site_logo_url) {
          setSiteLogo(data.site_logo_url);
        }
      } catch (error) {
        console.error("Error fetching site logo:", error);
      }
    };
    fetchSiteLogo();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      console.log("✅ Login Response:", data);

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      if (data.consultancy_id) {
        localStorage.setItem("consultancy_id", data.consultancy_id);
        console.log("✅ Stored consultancy_id:", data.consultancy_id);
      } else {
        console.error("❌ Consultancy ID is missing in response!");
      }

      router.push("/dashboard/consultancy");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          {/* Logo and Header */}
          <div className="text-center mb-10">
            {siteLogo ? (
              <Image
                src={siteLogo}
                alt="Abroad Advise Logo"
                width={180}
                height={50}
                className="object-contain mx-auto transition-all duration-300 hover:opacity-90"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-[#4c9bd5] font-light text-2xl tracking-wide">Abroad Advise</span>
              </motion.div>
            )}
            <h1 className="mt-6 text-3xl font-light text-gray-800 tracking-wide">
              Consultancy Login
            </h1>
            <p className="mt-2 text-gray-600 text-sm font-light tracking-wide">
              Access your dashboard with ease
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mb-6 rounded-r-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-light text-gray-700 tracking-wide mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-light text-gray-700 tracking-wide mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#4c9bd5] border-gray-300 rounded focus:ring-[#4c9bd5] transition-colors duration-200"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600 font-light tracking-wide"
                >
                  Remember Me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-[#4c9bd5] font-light hover:underline transition-colors duration-200"
              >
                Forgot Password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#4c9bd5] to-[#3a89c3] text-white rounded-lg text-sm font-light tracking-wide shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c9bd5] transition-all duration-300"
            >
              Log In
            </motion.button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsultancyLogin;
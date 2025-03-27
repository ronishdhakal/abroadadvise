import { useRouter } from "next/router";
import { removeAuthToken } from "@/utils/auth";
import { LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

const AdminHeader = () => {
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Update the current date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime(); // Initial call
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLogout = () => {
    removeAuthToken(); // Clear JWT
    router.push("/admin/login"); // Redirect to login
  };

  return (
    <header className="bg-gray-50 shadow-sm p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
      {/* Left Section: Title and Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[#4c9bd5]" />
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>Welcome, Admin!</p>
          <p>{currentDateTime}</p>
        </div>
      </div>

      {/* Right Section: Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 hover:text-[#4c9bd5] transition-all duration-300 sm:w-auto w-full"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
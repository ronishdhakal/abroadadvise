import { useRouter } from "next/router";
import { removeAuthToken } from "@/utils/auth";

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken(); // Clear JWT
    router.push("/admin/login"); // Redirect to login
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;

"use client"; // Ensures it runs only on the client-side

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // ✅ Clear authentication token
    localStorage.removeItem("token");

    // ✅ Redirect to login after logout
    router.push("/login");
  }, []);

  return <p>Logging out...</p>; // Show a message while redirecting
};

export default Logout;

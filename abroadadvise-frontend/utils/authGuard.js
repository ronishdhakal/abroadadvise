import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuthToken, getUserRole } from "@/utils/auth";

/**
 * ✅ Protects dashboard routes based on user authentication and role.
 */
const AuthGuard = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();
    const token = getAuthToken();
    const userRole = getUserRole();

    useEffect(() => {
      if (!token) {
        console.warn("🚨 No access token found. Redirecting to login...");
        router.push("/"); // Redirect to homepage/login
      } else if (!allowedRoles.includes(userRole)) {
        console.warn("⛔ Unauthorized access! Redirecting to login...");
        router.push("/"); // Redirect unauthorized users
      }
    }, [token, userRole, router]);

    return token && allowedRoles.includes(userRole) ? <WrappedComponent {...props} /> : null;
  };
};

export default AuthGuard;

import { useState } from "react";
import { useRouter } from "next/router";
import { setAuthToken } from "@/utils/auth";

const UniversityLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

      // ✅ Store tokens and university info
      setAuthToken(data.access, data.refresh, "university", null, data.university_id);

      // ✅ Debug: Check stored values
      console.log("✅ Stored university_id:", localStorage.getItem("university_id"));
      console.log("✅ Stored user_role:", localStorage.getItem("user_role"));

      // ✅ Redirect to University Dashboard
      router.push("/dashboard/university/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>University Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UniversityLogin;

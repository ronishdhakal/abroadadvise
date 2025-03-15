import { useState } from "react";
import { useRouter } from "next/router";
import { setAuthToken } from "@/utils/auth";

const ConsultancyLogin = () => {
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

        // ✅ Store tokens
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // ✅ Store consultancy_id
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


  return (
    <div className="login-container">
      <h2>Consultancy Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ConsultancyLogin;

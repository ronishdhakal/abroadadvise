import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/signup", { email, password });
      router.push("/login");  // Redirect to login after successful signup
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-500 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-yellow-500 p-2 rounded-md">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setToken } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ optional UX improvement

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Sending:", { email: trimmedEmail, password: trimmedPassword });

      const res = await axios.post(
        "https://swapskill-com.onrender.com/api/auth/login",
        {
          email: trimmedEmail,
          password: trimmedPassword,
        },
        {
          withCredentials: true, // ✅ for cookies or session-based CORS
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = res.data;

      dispatch(setToken(token));
      dispatch(setUserData(user));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded-lg transition`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

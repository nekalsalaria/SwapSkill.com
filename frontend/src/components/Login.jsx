import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setToken } from "../redux/userSlice";
import { FaExchangeAlt } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in both fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(
        "https://swapskill-com-p5du.onrender.com/api/auth/login",
        { email: email.trim(), password: password.trim() },
        { withCredentials: true }
      );
      dispatch(setToken(res.data.token));
      dispatch(setUserData(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(233,30,140,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(156,39,176,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <FaExchangeAlt style={{ color: "var(--accent)", fontSize: 18 }} />
            <span className="grad-text" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>SwapSkill</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", margin: "6px 0 4px" }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Sign in to your account</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, padding: "28px", boxShadow: "0 4px 32px rgba(233,30,140,0.06)" }}>
          {error && (
            <div style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 9, padding: "9px 13px", marginBottom: 18, fontSize: 13, color: "var(--red)" }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="you@example.com" className="ss-input" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••" className="ss-input" />
            </div>
            <button onClick={handleLogin} disabled={loading} className="btn-primary"
              style={{ width: "100%", padding: "11px", fontSize: 14, borderRadius: 10, marginTop: 4 }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--text-muted)" }}>
            No account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

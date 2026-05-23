import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../redux/userSlice";
import { FaExchangeAlt } from "react-icons/fa";

/* ---------------- VALIDATION HELPERS ---------------- */
const validateName = (name) => {
  const clean = name.trim();
  const regex = /^[A-Za-z\s]+$/;
  if (clean.length < 3) return "Name too short";
  if (!regex.test(clean)) return "Only letters allowed";
  return "";
};

const validatePassword = (password) => {
  if (password.length < 8) return "At least 8 characters required";
  if (!/[A-Z]/.test(password)) return "Add one uppercase letter";
  if (!/[a-z]/.test(password)) return "Add one lowercase letter";
  if (!/\d/.test(password)) return "Add one number";
  if (!/[@$!%*?&]/.test(password)) return "Add one special character";
  return "";
};

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  if (score <= 2) return { text: "Weak", color: "red" };
  if (score === 3 || score === 4) return { text: "Medium", color: "orange" };
  return { text: "Strong", color: "green" };
};

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW STATE
  const [fieldError, setFieldError] = useState({
    name: "",
    password: "",
  });

  /* ---------------- UPDATED HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "name") {
      setFieldError((prev) => ({
        ...prev,
        name: validateName(value),
      }));
    }

    if (name === "password") {
      setFieldError((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  /* ---------------- UPDATED HANDLE SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(form.name);
    const passErr = validatePassword(form.password);

    if (nameErr || passErr) {
      setFieldError({ name: nameErr, password: passErr });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://swapskill-com-p5du.onrender.com/api/auth/signup",
        form,
        //  "http://localhost:5000/api/auth/signup"
      );
      dispatch(setToken(res.data.token));
      dispatch(setUserData(res.data.user));
      navigate("/edit-profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(233,30,140,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <FaExchangeAlt style={{ color: "var(--accent)", fontSize: 18 }} />
            <span
              className="grad-text"
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              SwapSkill
            </span>
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "6px 0 4px",
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Free forever. Start exchanging skills today.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "28px",
            boxShadow: "0 4px 32px rgba(233,30,140,0.06)",
          }}
        >
          {error && (
            <div
              style={{
                background: "var(--red-dim)",
                border: "1px solid var(--red-border)",
                borderRadius: 9,
                padding: "9px 13px",
                marginBottom: 18,
                fontSize: 13,
                color: "var(--red)",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {[
              {
                name: "name",
                label: "Full name",
                type: "text",
                placeholder: "Nimish Berwal",
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "you@example.com",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "Choose a password",
              },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </label>

                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className="ss-input"
                  required
                />

                {/* ERROR */}
                {fieldError[name] && (
                  <p style={{ color: "red", fontSize: 11, marginTop: 4 }}>
                    {fieldError[name]}
                  </p>
                )}

                {/* PASSWORD STRENGTH */}
                {name === "password" && form.password && (
                  <p
                    style={{
                      fontSize: 11,
                      marginTop: 4,
                      color: getPasswordStrength(form.password).color,
                    }}
                  >
                    Strength: {getPasswordStrength(form.password).text}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "11px",
                fontSize: 14,
                borderRadius: 10,
                marginTop: 4,
              }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

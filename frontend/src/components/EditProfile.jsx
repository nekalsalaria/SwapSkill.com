import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserData } from "../redux/userSlice";
import axios from "axios";
import profileImg from "../assets/profile.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import {
  FaExchangeAlt,
  FaSignOutAlt,
  FaArrowLeft,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
  FaUserFriends,
  FaEdit,
  FaCheck,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaLightbulb,
  FaRupeeSign,
} from "react-icons/fa";

// const API = "http://localhost:5000";
const API = "https://swapskill-com-p5du.onrender.com";

const skillOptions = [
  { value: "DSA", label: "DSA" },
  { value: "React", label: "React" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "Node.js", label: "Node.js" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Figma", label: "Figma" },
  { value: "C++", label: "C++" },
];
/* parse comma/newline separated skills into array */
const parseSkills = (str) => [
  ...new Set(
    (str || "")
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  ),
];

/* single stat card */
const StatCard = ({ icon, value, label, color }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        flexShrink: 0,
        background: `${color}14`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color, fontSize: 18 }}>{icon}</span>
    </div>
    <div>
      <p
        style={{
          fontSize: 22,
          fontWeight: 800,
          margin: 0,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          margin: 0,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </p>
    </div>
  </div>
);

/* skill pill */
const Pill = ({ text, variant }) => {
  const styles = {
    teach: {
      bg: "var(--green-dim)",
      color: "var(--green)",
      border: "1px solid #2d9e6b28",
    },
    learn: {
      bg: "var(--blue-dim)",
      color: "var(--blue)",
      border: "1px solid #3b7dd828",
    },
  };
  const s = styles[variant];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: s.border,
      }}
    >
      {text}
    </span>
  );
};

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.userData);
  const token = useSelector((s) => s.user.token);

  const [name, setName] = useState("");
  const [canTeach, setCanTeach] = useState([]);
  const [wantToLearn, setWantToLearn] = useState([]);
  const [about, setAbout] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [editing, setEditing] = useState(false);

  // ONLY 2 places updated: useEffect + handleSubmit

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");

    // ✅ FIX: support both array + string
    const teachArr = Array.isArray(user.canTeach)
      ? user.canTeach
      : parseSkills(user.canTeach);

    const learnArr = Array.isArray(user.wantToLearn)
      ? user.wantToLearn
      : parseSkills(user.wantToLearn);

    setCanTeach(teachArr.map((s) => ({ label: s, value: s })));
    setWantToLearn(learnArr.map((s) => ({ label: s, value: s })));

    setAbout(user.about || "");
    setLinkedin(user.linkedin || "");
    setGithub(user.github || "");
    setWebsite(user.website || "");
    setPricePerHour(user.pricePerHour != null ? String(user.pricePerHour) : "");

    // --- rest unchanged ---
  }, [user, token, dispatch, editing]);

  // ================= FIXED API =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API}/api/auth/update`,
        {
          name,

          // 🔥 FIX BACK to string (backend expects this)
          canTeach: canTeach.map((s) => s.value).join(","),
          wantToLearn: wantToLearn.map((s) => s.value).join(","),

          about,
          linkedin,
          github,
          website,
          pricePerHour: pricePerHour ? Number(pricePerHour) : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      dispatch(setUserData(res.data.user));

      setCanTeach(
        parseSkills(res.data.user.canTeach).map((s) => ({
          label: s,
          value: s,
        })),
      );

      setWantToLearn(
        parseSkills(res.data.user.wantToLearn).map((s) => ({
          label: s,
          value: s,
        })),
      );

      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error("Update failed");
    }
  };
  const teachSkills = parseSkills(user?.canTeach);
  const learnSkills = parseSkills(user?.wantToLearn);

  const memberSince = user?._id
    ? new Date(
        parseInt(user._id.substring(0, 8), 16) * 1000,
      ).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <ToastContainer />

      {/* ── Navbar ── */}
      <nav
        className="ss-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          flexWrap: "wrap",
          height: "auto",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <FaExchangeAlt style={{ color: "var(--accent)", fontSize: 16 }} />
        <span
          className="grad-text"
          style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em" }}
        >
          SwapSkill
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-outline"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            fontSize: 11,
            whiteSpace: "nowrap",
          }}
        >
          <FaArrowLeft size={10} /> Dashboard
        </button>
        <button
          onClick={() => {
            dispatch(logout());
            window.location.href = "/";
          }}
          className="btn-danger"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            fontSize: 11,
            whiteSpace: "nowrap",
          }}
        >
          <FaSignOutAlt size={10} /> Logout
        </button>
      </nav>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 16px",
        }}
      >
        {/* ── HERO BANNER ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "32px 32px 28px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(244,63,142,0.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 80,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(244,63,142,0.03)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={profileImg}
                alt="profile"
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  border: "3px solid var(--accent)",
                  objectFit: "cover",
                  boxShadow: "0 4px 20px var(--accent-glow)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "var(--green)",
                  border: "2.5px solid #fffef9",
                }}
              />
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 200, width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  {user?.name || "Your Name"}
                </h1>
                <span
                  style={{
                    background: "var(--green-dim)",
                    color: "var(--green)",
                    border: "1px solid #2d9e6b28",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                  }}
                >
                  ● Active
                </span>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  margin: "4px 0 12px",
                }}
              >
                {user?.email}
              </p>

              {/* Quick skill preview */}
            </div>

            {/* Edit toggle */}
            <button
              onClick={() => setEditing((e) => !e)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              className={editing ? "btn-outline" : "btn-primary"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 20px",
                fontSize: 13,
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {editing ? (
                <>
                  <FaCheck size={11} /> Cancel
                </>
              ) : (
                <>
                  <FaEdit size={11} /> Edit Profile
                </>
              )}
            </button>
          </div>

          {/* About blurb */}
          {about && !editing && (
            <p
              style={{
                marginTop: 16,
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              {about}
            </p>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        ></div>

        {/* ── TWO COLUMN ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {/* LEFT col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Edit form OR skill display */}
            {editing ? (
              <div
                className="ss-card"
                style={{ padding: "24px", borderRadius: 18 }}
              >
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>
                  ✏️ Edit Details
                </p>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="ss-input"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Skills I Can Teach
                    </label>
                    <CreatableSelect
                      options={skillOptions}
                      isMulti
                      value={canTeach}
                      onChange={setCanTeach}
                      placeholder="Type or select skills..."
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Skills I Want to Learn
                    </label>
                    <CreatableSelect
                      options={skillOptions}
                      isMulti
                      value={wantToLearn}
                      onChange={setWantToLearn}
                      placeholder="Type or select skills..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "11px", fontSize: 14, borderRadius: 10 }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Teaches card */}
                <div
                  className="ss-card"
                  style={{ padding: "20px 22px", borderRadius: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <FaChalkboardTeacher
                      style={{ color: "var(--green)", fontSize: 15 }}
                    />
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                      I Can Teach
                    </p>
                  </div>
                  {teachSkills.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      No teaching skills added yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {teachSkills.map((s) => (
                        <Pill key={s} text={s} variant="teach" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Wants to learn card */}
                <div
                  className="ss-card"
                  style={{ padding: "20px 22px", borderRadius: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <FaGraduationCap
                      style={{ color: "var(--blue)", fontSize: 15 }}
                    />
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                      I Want to Learn
                    </p>
                  </div>
                  {learnSkills.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      No learning goals added yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {learnSkills.map((s) => (
                        <Pill key={s} text={s} variant="learn" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Account info */}
            <div
              className="ss-card"
              style={{ padding: "20px 22px", borderRadius: 16 }}
            >
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                Account Info
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  { label: "Email", value: user?.email },
                  { label: "Member since", value: memberSince },
                  {
                    label: "User ID",
                    value: user?._id?.slice(-8).toUpperCase(),
                    mono: true,
                  },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        fontFamily: mono
                          ? "var(--font-mono, monospace)"
                          : "inherit",
                        background: mono ? "var(--bg-surface)" : "transparent",
                        padding: mono ? "2px 8px" : 0,
                        borderRadius: mono ? 6 : 0,
                      }}
                    >
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div
              className="ss-card"
              style={{ padding: "20px 22px", borderRadius: 16 }}
            >
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                Social Links
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  {
                    icon: <FaLinkedin style={{ color: "#0077b5" }} />,
                    label: "LinkedIn",
                    value: linkedin,
                    set: setLinkedin,
                    placeholder: "https://linkedin.com/in/yourname",
                  },
                  {
                    icon: <FaGithub style={{ color: "var(--text-primary)" }} />,
                    label: "GitHub",
                    value: github,
                    set: setGithub,
                    placeholder: "https://github.com/yourname",
                  },
                  {
                    icon: <FaGlobe style={{ color: "var(--accent)" }} />,
                    label: "Website",
                    value: website,
                    set: setWebsite,
                    placeholder: "https://yourwebsite.com",
                  },
                ].map(({ icon, label, value, set, placeholder }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>

                    {editing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        placeholder={placeholder}
                        className="ss-input"
                        style={{ flex: 1 }}
                      />
                    ) : value ? (
                      <a
                        href={
                          value.startsWith("http") ? value : `https://${value}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 13,
                          color: "var(--accent)",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </a>
                    ) : (
                      <span
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        Not added
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div
              style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <FaLightbulb
                style={{
                  color: "var(--accent)",
                  fontSize: 18,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    margin: "0 0 5px",
                    color: "var(--text-primary)",
                  }}
                >
                  Pro tip
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  The more specific your skills are, the more likely someone
                  will find and connect with you. Try "React + Firebase" instead
                  of just "Web Dev".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

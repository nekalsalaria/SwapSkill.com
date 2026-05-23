import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaExchangeAlt,
  FaSearch,
  FaLinkedin,
  FaTimes,
  FaPaperPlane,
  FaComments,
  FaStar,
  FaRegStar,
  FaUserFriends,
  FaClock,
  FaChalkboard,
  FaBell,
  FaCheck,
  FaTimesCircle,
  FaUser,
  FaHome,
  FaCheckCircle,
  FaArrowRight,
  FaUsers,
  FaCopy,
  FaPlay,
  FaDoorOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/profile.jpg";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  addNotification,
  markNotificationsRead,
  clearNotifications,
} from "../redux/userSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://swapskill-com-p5du.onrender.com";

/* ─── Avatar initials ─────────────────────────────────── */
const Avatar = ({ name, size = 38, border = "var(--accent)" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: "var(--accent-bg)",
      border: `2px solid ${border}40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.36,
      fontWeight: 700,
      color: "var(--accent)",
    }}
  >
    {(name || "?")[0].toUpperCase()}
  </div>
);

/* ─── Skeleton card ───────────────────────────────────── */
const SkeletonCard = () => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--bg-deep)",
          flexShrink: 0,
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
      >
        <div
          style={{
            height: 13,
            borderRadius: 6,
            background: "var(--bg-deep)",
            width: "60%",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 11,
            borderRadius: 6,
            background: "var(--bg-deep)",
            width: "80%",
            animation: "pulse 1.4s ease-in-out infinite 0.1s",
          }}
        />
      </div>
    </div>
    <div
      style={{
        height: 11,
        borderRadius: 6,
        background: "var(--bg-deep)",
        width: "45%",
        animation: "pulse 1.4s ease-in-out infinite 0.15s",
      }}
    />
    <div
      style={{
        height: 11,
        borderRadius: 6,
        background: "var(--bg-deep)",
        width: "55%",
        animation: "pulse 1.4s ease-in-out infinite 0.2s",
      }}
    />
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <div
        style={{
          flex: 1,
          height: 32,
          borderRadius: 8,
          background: "var(--bg-deep)",
          animation: "pulse 1.4s ease-in-out infinite 0.25s",
        }}
      />
      <div
        style={{
          flex: 1,
          height: 32,
          borderRadius: 8,
          background: "var(--bg-deep)",
          animation: "pulse 1.4s ease-in-out infinite 0.3s",
        }}
      />
    </div>
  </div>
);

/* ─── Onboarding banner ───────────────────────────────── */
const OnboardingBanner = ({ user, connections, navigate }) => {
  const hasSkills = user?.canTeach || user?.wantToLearn;
  const steps = [
    { done: !!user?.name, label: "Create account" },
    {
      done: hasSkills,
      label: "Add your skills",
      action: () => navigate("/edit-profile"),
    },
    { done: connections > 0, label: "Make first connection" },
  ];
  const nextStep = steps.find((s) => !s.done);
  if (!nextStep) return null;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--accent-bg) 0%, #fff8f0 100%)",
        border: "1px solid #e07b2a22",
        borderRadius: 16,
        padding: "18px 22px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: 14,
            margin: "0 0 6px",
            color: "var(--accent)",
          }}
        >
          👋 Welcome, {user?.name?.split(" ")[0]}! Let's get you started
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
              }}
            >
              {s.done ? (
                <FaCheckCircle
                  style={{ color: "var(--green)", fontSize: 12 }}
                />
              ) : (
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid var(--border)",
                  }}
                />
              )}
              <span
                style={{
                  color: s.done ? "var(--text-muted)" : "var(--text-primary)",
                  fontWeight: s.done ? 400 : 600,
                  textDecoration: s.done ? "line-through" : "none",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {nextStep.action && (
        <button
          onClick={nextStep.action}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {nextStep.label} <FaArrowRight size={11} />
        </button>
      )}
    </div>
  );
};

/* ─── Notification dropdown ───────────────────────────── */
const NotifDropdown = ({ notifs, onRead, onClear }) => (
  <div
    style={{
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: 300,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      boxShadow: "0 8px 32px rgba(180,140,80,0.12)",
      zIndex: 200,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>Notifications</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onRead}
          style={{
            fontSize: 11,
            color: "var(--accent)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Mark all read
        </button>
        <button
          onClick={onClear}
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    </div>
    <div style={{ maxHeight: 320, overflowY: "auto" }}>
      {notifs.length === 0 ? (
        <div style={{ padding: "28px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 24, marginBottom: 6 }}>🔔</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            No notifications yet
          </p>
        </div>
      ) : (
        notifs.map((n, i) => (
          <div
            key={i}
            style={{
              padding: "11px 16px",
              borderBottom: "1px solid var(--border)",
              background: n.read ? "transparent" : "var(--accent-bg)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                  n.type === "accepted" ? "var(--green-dim)" : "var(--red-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {n.type === "accepted" ? (
                <FaCheck style={{ color: "var(--green)", fontSize: 11 }} />
              ) : (
                <FaTimes style={{ color: "var(--red)", fontSize: 11 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  margin: "0 0 2px",
                  color: "var(--text-primary)",
                }}
              >
                {n.type === "accepted"
                  ? "Request accepted"
                  : "Request declined"}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  margin: "0 0 2px",
                  lineHeight: 1.4,
                }}
              >
                <strong>{n.name}</strong>{" "}
                {n.type === "accepted" ? "accepted" : "declined"} your request
                to {n.reqType} <strong>{n.skill}</strong>
              </p>
              <p
                style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}
              >
                {n.time}
              </p>
            </div>
            {!n.read && (
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

/* ─── Mobile bottom nav ───────────────────────────────── */
const MobileNav = ({
  active,
  onDiscover,
  onFriends,
  onPending,
  onChat,
  pendingCount,
}) => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}
  >
    {[
      {
        key: "discover",
        icon: <FaHome size={17} />,
        label: "Discover",
        action: onDiscover,
      },
      {
        key: "friends",
        icon: <FaUserFriends size={17} />,
        label: "Friends",
        action: onFriends,
      },
      {
        key: "pending",
        icon: <FaClock size={17} />,
        label: "Pending",
        action: onPending,
        badge: pendingCount,
      },
      {
        key: "chat",
        icon: <FaComments size={17} />,
        label: "Community",
        action: onChat,
      },
      {
        key: "profile",
        icon: <FaUser size={17} />,
        label: "Profile",
        action: null,
      },
    ].map(({ key, icon, label, action, badge }) => (
      <button
        key={key}
        onClick={action}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          padding: "10px 4px",
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: active === key ? "var(--accent)" : "var(--text-muted)",
          position: "relative",
          transition: "color 0.15s",
        }}
      >
        {badge > 0 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: "calc(50% - 16px)",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 9,
              fontWeight: 700,
              padding: "1px 4px",
              lineHeight: 1.4,
            }}
          >
            {badge}
          </span>
        )}
        {icon}
        <span style={{ fontSize: 10, fontWeight: active === key ? 600 : 400 }}>
          {label}
        </span>
        {active === key && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 2,
              background: "var(--accent)",
              borderRadius: "0 0 2px 2px",
            }}
          />
        )}
      </button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((s) => s.user.userData);
  const token = useSelector((s) => s.user.token);
  const notifications = useSelector((s) => s.user.notifications || []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [pendingReqs, setPendingReqs] = useState([]);
  const [acceptedReqs, setAcceptedReqs] = useState([]);
  const [prevPending, setPrevPending] = useState(null); // for diff → notifications
  const [sideTab, setSideTab] = useState("friends");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileTab, setMobileTab] = useState("discover");
  const [mobileSide, setMobileSide] = useState(null); // null | "friends" | "pending"

  // ── Group Session modals ──
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [groupSkillInput, setGroupSkillInput] = useState("");
  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [groupCreating, setGroupCreating] = useState(false);
  const [groupJoinPreview, setGroupJoinPreview] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const notifRef = useRef(null);

  // close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── fetch users ──
  useEffect(() => {
    if (!loggedInUser) return;
    axios
      .get(`${API}/api/user/all`)
      .then((res) => {
        const sorted = res.data.sort((a, b) =>
          a._id === loggedInUser._id ? -1 : b._id === loggedInUser._id ? 1 : 0,
        );
        setUsers(sorted);
        setFilteredUsers(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loggedInUser]);

  // ── fetch requests + generate notifications on diff ──
  const fetchRequests = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/user/myrequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = res.data.requests || [];
      const accepted = res.data.acceptedRequests || [];
      setPendingReqs(pending);
      setAcceptedReqs(accepted);

      // diff: detect newly accepted or declined since last poll
      if (prevPending !== null) {
        prevPending.forEach((old) => {
          const stillPending = pending.find((p) => p._id === old._id);
          const nowAccepted = accepted.find((a) => a._id === old._id);
          if (!stillPending && !nowAccepted) {
            // was removed from pending and NOT in accepted → declined
            dispatch(
              addNotification({
                id: old._id,
                type: "declined",
                name: old.from?.name || "Someone",
                skill: old.skill,
                reqType: old.type,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                read: false,
              }),
            );
          }
        });
      }
      setPrevPending(pending);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // poll every 10s for request changes
    return () => clearInterval(interval);
  }, [fetchRequests]);

  // ── community chat ──
  useEffect(() => {
    if (!isChatOpen) return;
    fetchCommunityMsgs();
    const t = setInterval(fetchCommunityMsgs, 5000);
    return () => clearInterval(t);
  }, [isChatOpen]);

  const fetchCommunityMsgs = async () => {
    try {
      const res = await axios.get(`${API}/api/discussion`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load community messages:", err);
    }
  };

  const sendCommunityMsg = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(`${API}/api/discussion`, {
        user: loggedInUser.name,
        message: newMessage,
      });
      setMessages((p) => [...p, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send community message:", err);
      toast.error("Unable to send message. Try again.");
    }
  };

  // ── search ──
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          (u.canTeach && u.canTeach.toLowerCase().includes(term)) ||
          (u.wantToLearn && u.wantToLearn.toLowerCase().includes(term)),
      ),
    );
  };

  // ── send request ──
  const sendRequest = async (toUserId, skill, type) => {
    try {
      await axios.post(
        `${API}/api/user/request`,
        { toUserId, skill, type },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Request sent!");
      const upd = (p) =>
        p.map((u) =>
          u._id === toUserId
            ? {
                ...u,
                requests: [
                  ...(u.requests || []),
                  { from: loggedInUser._id, skill, type },
                ],
              }
            : u,
        );
      setUsers(upd);
      setFilteredUsers(upd);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send request.");
    }
  };

  // ── accept / decline ──
  const handleAccept = async (id) => {
    try {
      await axios.post(
        `${API}/api/user/accept`,
        { requestId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const accepted = pendingReqs.find((r) => r._id === id);
      setPendingReqs((p) => p.filter((r) => r._id !== id));
      setAcceptedReqs((p) => [...p, accepted]);
      toast.success("Request accepted!");
      if (pendingReqs.length <= 1) setSideTab("friends");
    } catch {
      toast.error("Failed to accept");
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.post(
        `${API}/api/user/decline`,
        { requestId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingReqs((p) => p.filter((r) => r._id !== id));
      toast.success("Declined.");
    } catch {
      toast.error("Failed to decline");
    }
  };

  const handleDeleteAccepted = async (id) => {
    try {
      await axios.post(
        `${API}/api/user/delete-accepted`,
        { requestId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAcceptedReqs((p) => p.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to remove accepted request:", err);
      toast.error("Unable to remove connection.");
    }
  };

  // ── open 1-to-1 chat session ──
  const openSession = (user) => {
    const sessionInfo = {
      toUserId: user._id || user.from?._id,
      toUserName: user.name || user.from?.name,
      toUserEmail: user.email || user.from?.email,
      startedAt: new Date().toISOString(),
    };
    navigate("/chat", { state: sessionInfo });
  };

  // ── Create a group session room ──
  const handleCreateGroup = async () => {
    if (!groupSkillInput.trim()) return;
    setGroupCreating(true);
    try {
      const res = await axios.post(`${API}/api/group/create`, {
        hostId: loggedInUser._id,
        hostName: loggedInUser.name,
        skill: groupSkillInput.trim(),
      });
      setGeneratedCode(res.data.code);
    } catch {
      toast.error("Failed to create room");
    }
    setGroupCreating(false);
  };

  const handleLaunchGroup = () => {
    navigate("/group-session", {
      state: {
        code: generatedCode,
        skill: groupSkillInput.trim(),
        hostName: loggedInUser.name,
        isHost: true,
      },
    });
    setShowCreateGroup(false);
    setGeneratedCode(null);
    setGroupSkillInput("");
  };

  const copyGroupCode = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  // ── Join a group session by code ──
  const handleLookupGroup = async () => {
    const code = groupCodeInput.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await axios.get(`${API}/api/group/${code}`);
      setGroupJoinPreview(res.data);
    } catch {
      toast.error("Room not found. Check the code and try again.");
    }
  };

  const handleJoinGroup = () => {
    const preview = groupJoinPreview;
    navigate("/group-session", {
      state: {
        code: preview.code,
        skill: preview.skill,
        hostName: preview.hostName,
        isHost: false,
      },
    });
    setShowJoinGroup(false);
    setGroupCodeInput("");
    setGroupJoinPreview(null);
  };

  // ── rating helpers ──
  const getRating = (user) => {
    const r = Array.isArray(user.ratings) ? user.ratings : [];
    if (!r.length) return { avg: 0, total: 0 };
    return {
      avg: Number(
        (r.reduce((a, x) => a + (x.stars || 0), 0) / r.length).toFixed(1),
      ),
      total: r.length,
    };
  };

  // ── sidebar content (shared between desktop + mobile) ──
  const SidebarContent = () => (
    <>
      {/* Me card */}
      <div style={{ padding: "14px 14px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "var(--bg-surface)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            marginBottom: 14,
          }}
        >
          <Avatar name={loggedInUser?.name} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loggedInUser?.name}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loggedInUser?.email}
            </p>
          </div>
          <button
            onClick={() => navigate("/edit-profile")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 4,
            }}
          >
            <FaUser size={12} />
          </button>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-surface)",
            borderRadius: 10,
            padding: 3,
            marginBottom: 12,
          }}
        >
          {[
            {
              key: "friends",
              label: "Friends",
              icon: <FaUserFriends size={11} />,
              count: acceptedReqs.length,
            },
            {
              key: "pending",
              label: "Pending",
              icon: <FaClock size={11} />,
              count: pendingReqs.length,
            },
          ].map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setSideTab(key)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "7px 0",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.15s",
                background: sideTab === key ? "var(--accent)" : "transparent",
                color: sideTab === key ? "#fff" : "var(--text-secondary)",
              }}
            >
              {icon} {label}
              {count > 0 && (
                <span
                  style={{
                    background:
                      sideTab === key
                        ? "rgba(255,255,255,0.28)"
                        : "var(--accent)",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 5px",
                    lineHeight: 1.4,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Group session action buttons */}
      {/* <div style={{ padding: "0 14px 12px", display: "flex", gap: 6 }}>
        <button
          onClick={() => {
            setShowCreateGroup(true);
            setGeneratedCode(null);
            setGroupSkillInput("");
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "7px 0",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <FaPlay size={8} /> Start Group
        </button>
        <button
          onClick={() => {
            setShowJoinGroup(true);
            setGroupCodeInput("");
            setGroupJoinPreview(null);
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "7px 0",
            borderRadius: 8,
            border: "1px solid var(--border)",
            cursor: "pointer",
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <FaDoorOpen size={10} /> Join Room
        </button>
      </div> */}

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px" }}>
        {/* Friends */}
        {sideTab === "friends" &&
          (acceptedReqs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 12px" }}>
              <p style={{ fontSize: 26, marginBottom: 8 }}>🤝</p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                No connections yet. Send requests to start!
              </p>
            </div>
          ) : (
            acceptedReqs.map((req) => (
              <div
                key={req._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 10px",
                  borderRadius: 10,
                  marginBottom: 4,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface)",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <Avatar name={req.from?.name} size={32} border="var(--green)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {req.from?.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      margin: 0,
                      marginTop: 1,
                    }}
                  >
                    {req.type === "learn" ? "📖" : "🎓"} {req.skill}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() =>
                      openSession({
                        _id: req.from._id,
                        name: req.from.name,
                        email: req.from.email,
                      })
                    }
                    title="Open session"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      background: "var(--accent)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaChalkboard size={11} />
                  </button>
                  <button
                    onClick={() => handleDeleteAccepted(req._id)}
                    title="Remove"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "1px solid #d94f3d22",
                      cursor: "pointer",
                      background: "var(--red-dim)",
                      color: "var(--red)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              </div>
            ))
          ))}

        {/* Pending */}
        {sideTab === "pending" &&
          (pendingReqs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 12px" }}>
              <p style={{ fontSize: 26, marginBottom: 8 }}>📭</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                No pending requests
              </p>
            </div>
          ) : (
            pendingReqs.map((req) => (
              <div
                key={req._id}
                style={{
                  padding: "11px 12px",
                  borderRadius: 10,
                  marginBottom: 6,
                  border: "1px solid #e07b2a22",
                  background: "var(--accent-bg)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Avatar
                    name={req.from?.name}
                    size={28}
                    border="var(--accent)"
                  />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {req.from?.name}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--text-secondary)",
                        margin: "2px 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      {req.type === "learn" ? (
                        <>
                          wants to learn <strong>{req.skill}</strong>
                        </>
                      ) : (
                        <>
                          wants to teach <strong>{req.skill}</strong>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleAccept(req._id)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      background: "var(--green)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <FaCheck size={9} /> Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req._id)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 7,
                      border: "1px solid #d94f3d22",
                      cursor: "pointer",
                      background: "var(--red-dim)",
                      color: "var(--red)",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <FaTimesCircle size={9} /> Decline
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>

      {/* Logout */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => {
            dispatch(logout());
            window.location.href = "/";
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: 9,
            border: "1px solid #d94f3d22",
            background: "var(--red-dim)",
            color: "var(--red)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      <ToastContainer />

      {/* ══ CREATE GROUP SESSION MODAL ══ */}
      {showCreateGroup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,29,46,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
          }}
        >
          <div
            className="ss-card"
            style={{ width: 380, padding: 28, borderRadius: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>
                  🎓 Start Group Session
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    margin: "4px 0 0",
                  }}
                >
                  Teach multiple learners at once
                </p>
              </div>
              <button
                onClick={() => setShowCreateGroup(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {!generatedCode ? (
              <>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  What skill will you teach?
                </label>
                <input
                  value={groupSkillInput}
                  onChange={(e) => setGroupSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                  placeholder="e.g. DSA, React, Python..."
                  className="ss-input"
                  style={{ marginBottom: 16 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="btn-primary"
                    style={{ flex: 1 }}
                    disabled={groupCreating || !groupSkillInput.trim()}
                  >
                    {groupCreating ? "Creating..." : "Create Room"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: 14,
                    padding: 18,
                    textAlign: "center",
                    marginBottom: 18,
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      margin: "0 0 6px",
                    }}
                  >
                    Room Code — share this with learners
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        letterSpacing: "0.15em",
                        color: "var(--accent)",
                        fontFamily: "monospace",
                      }}
                    >
                      {generatedCode}
                    </span>
                    <button
                      onClick={copyGroupCode}
                      title="Copy"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: codeCopied
                          ? "var(--green)"
                          : "var(--text-muted)",
                        display: "flex",
                      }}
                    >
                      {codeCopied ? (
                        <FaCheck size={14} />
                      ) : (
                        <FaCopy size={14} />
                      )}
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 8,
                    }}
                  >
                    Topic:{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {groupSkillInput}
                    </strong>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      setGeneratedCode(null);
                      setGroupSkillInput("");
                    }}
                    className="btn-outline"
                    style={{ flex: 1 }}
                  >
                    ← Change
                  </button>
                  <button
                    onClick={handleLaunchGroup}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <FaUsers size={11} /> Open Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ JOIN GROUP SESSION MODAL ══ */}
      {showJoinGroup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,29,46,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
          }}
        >
          <div
            className="ss-card"
            style={{ width: 360, padding: 28, borderRadius: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>
                  🚪 Join a Group Session
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    margin: "4px 0 0",
                  }}
                >
                  Enter the room code shared by the teacher
                </p>
              </div>
              <button
                onClick={() => setShowJoinGroup(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Room Code
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                value={groupCodeInput}
                onChange={(e) =>
                  setGroupCodeInput(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => e.key === "Enter" && handleLookupGroup()}
                placeholder="e.g. DSA-4F2K"
                className="ss-input"
                style={{
                  flex: 1,
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
              <button
                onClick={handleLookupGroup}
                className="btn-primary"
                style={{ padding: "0 16px", flexShrink: 0 }}
              >
                Look up
              </button>
            </div>

            {groupJoinPreview && (
              <div
                style={{
                  background: "var(--accent-dim)",
                  border: "1px solid var(--accent-border)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    margin: "0 0 4px",
                    color: "var(--text-primary)",
                  }}
                >
                  📚 {groupJoinPreview.skill}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Hosted by <strong>{groupJoinPreview.hostName}</strong> ·{" "}
                  {groupJoinPreview.memberCount} already joined
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setShowJoinGroup(false);
                  setGroupJoinPreview(null);
                  setGroupCodeInput("");
                }}
                className="btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleJoinGroup}
                className="btn-primary"
                style={{ flex: 1 }}
                disabled={!groupJoinPreview}
              >
                Join Session →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ NAVBAR ══ */}
      <nav
        className="ss-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 20px",
          height: 60,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* ── Logo ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            marginRight: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px var(--accent-glow)",
            }}
          >
            <FaExchangeAlt style={{ color: "#fff", fontSize: 14 }} />
          </div>
          <span
            className="grad-text"
            style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.04em" }}
          >
            SwapSkill
          </span>
        </div>

        {/* ── Search ── */}
        <div style={{ flex: 1, maxWidth: "100vw" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 14px",
              height: 38,
              background: "var(--bg-surface)",
              borderRadius: 99,
              border: "1.5px solid var(--border)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={() => {}} // handled by input focus
          >
            <FaSearch
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              placeholder="Search skills or people..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                width: "100%",
                fontFamily: "inherit",
              }}
              onFocus={(e) =>
                (e.currentTarget.parentElement.style.borderColor =
                  "var(--accent)")
              }
              onBlur={(e) =>
                (e.currentTarget.parentElement.style.borderColor =
                  "var(--border)")
              }
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilteredUsers(users);
                }}
                style={{
                  background: "var(--bg-deep)",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FaTimes size={9} />
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* ── Right actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Pending requests pill */}
          {pendingReqs.length > 0 && (
            <button
              onClick={() => {
                setSideTab("pending");
                setSidebarOpen(true);
              }}
              className="hidden-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 99,
                background: "var(--accent-dim)",
                border: "1.5px solid var(--accent-border)",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent-dim)")
              }
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                  animation: "pulse 2s infinite",
                }}
              />
              {pendingReqs.length} pending
            </button>
          )}

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowNotifs((o) => !o);
                if (!showNotifs) dispatch(markNotificationsRead());
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                border: "1.5px solid var(--border)",
                background: showNotifs ? "var(--accent-dim)" : "var(--bg-card)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: showNotifs ? "var(--accent)" : "var(--text-secondary)",
                position: "relative",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = showNotifs
                  ? "var(--accent)"
                  : "var(--text-secondary)";
              }}
            >
              <FaBell size={14} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    border: "2px solid var(--bg-card)",
                  }}
                />
              )}
            </button>
            {showNotifs && (
              <NotifDropdown
                notifs={notifications}
                onRead={() => dispatch(markNotificationsRead())}
                onClear={() => dispatch(clearNotifications())}
                onClose={() => setShowNotifs(false)}
              />
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: "var(--border)" }} />

          {/* Profile avatar chip */}
          <button
            onClick={() => navigate("/edit-profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px 4px 4px",
              borderRadius: 99,
              border: "1.5px solid var(--border)",
              background: "var(--bg-card)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--bg-card)";
            }}
          >
            <img
              src={profileImg}
              alt="Profile"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--accent)",
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                maxWidth: 90,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="hidden-mobile"
            >
              {loggedInUser?.name?.split(" ")[0]}
            </span>
          </button>
        </div>
      </nav>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Desktop sidebar ── */}
        <aside
          style={{
            width: sidebarOpen ? 272 : 0,
            minWidth: sidebarOpen ? 272 : 0,
            transition: "width 0.22s, min-width 0.22s",
            overflow: "hidden",
            borderRight: "1px solid var(--border)",
            background: "var(--bg-card)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
          className="desktop-only"
        >
          <div
            style={{
              width: 272,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <SidebarContent />
          </div>
        </aside>

        {/* ── Mobile slide-over sidebar ── */}
        {mobileSide && (
          <div style={{ position: "fixed", inset: 0, zIndex: 90 }}>
            <div
              onClick={() => setMobileSide(null)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(28,24,19,0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 280,
                background: "var(--bg-card)",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid var(--border)",
              }}
            >
              <SidebarContent />
            </div>
          </div>
        )}

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 20px 80px" }}>
          {/* Onboarding banner */}
          <OnboardingBanner
            user={loggedInUser}
            connections={acceptedReqs.length}
            navigate={navigate}
          />

          {/* Heading row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              title="Toggle sidebar"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              className="desktop-only"
            >
              <FaUserFriends size={12} />
            </button>
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Discover
              </h2>
              <p
                style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}
              >
                {searchTerm
                  ? `${filteredUsers.length} result${filteredUsers.length !== 1 ? "s" : ""} for "${searchTerm}"`
                  : `${filteredUsers.length} people on SwapSkill`}
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {["All", "React", "Python", "DSA", "UI/UX", "Java", "ML"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === "All") {
                      setSearchTerm("");
                      setFilteredUsers(users);
                    } else {
                      setSearchTerm(tag);
                      setFilteredUsers(
                        users.filter(
                          (u) =>
                            (u.canTeach || "")
                              .toLowerCase()
                              .includes(tag.toLowerCase()) ||
                            (u.wantToLearn || "")
                              .toLowerCase()
                              .includes(tag.toLowerCase()),
                        ),
                      );
                    }
                  }}
                  style={{
                    padding: "5px 13px",
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background:
                      searchTerm === tag ? "var(--accent)" : "var(--bg-card)",
                    color:
                      searchTerm === tag ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                >
                  {tag}
                </button>
              ),
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 14,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 32 }}>🔍</p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 14,
                  marginTop: 8,
                }}
              >
                No users match your search.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 14,
              }}
            >
              {filteredUsers.map((user) => {
                const { avg, total } = getRating(user);
                const isMe = user._id === loggedInUser._id;
                const isConnected = acceptedReqs.some(
                  (r) => r.from?._id === user._id || r.from === user._id,
                );
                const fullStars = Math.floor(avg);
                const emptyStars = 5 - fullStars;

                return (
                  <div
                    key={user._id}
                    className="ss-card"
                    style={{
                      padding: 22,
                      borderRadius: 20,
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.04)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 50px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(0,0,0,0.06)";
                    }}
                  >
                    {/* Gradient top line */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background:
                          "linear-gradient(90deg, #e91e8c, #6366f1, #06b6d4)",
                      }}
                    />

                    {/* Status badges */}
                    {isConnected && !isMe && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "rgba(34,197,94,0.1)",
                          color: "#22c55e",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 999,
                        }}
                      >
                        ✓ Connected
                      </div>
                    )}

                    {isMe && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "rgba(233,30,140,0.1)",
                          color: "#e91e8c",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 999,
                        }}
                      >
                        You
                      </div>
                    )}

                    {/* Header */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=e91e8c&fontColor=ffffff`}
                        alt={user.name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                        }}
                      />
                      <div>
                        <p style={{ fontWeight: 700, margin: 0 }}>
                          {user.name}
                        </p>

                        <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div
                      style={{
                        background: "#f9fafb",
                        padding: 12,
                        borderRadius: 12,
                        marginBottom: 14,
                      }}
                    >
                      <p
                        style={{ fontSize: 10, fontWeight: 700, color: "#999" }}
                      >
                        CAN TEACH
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {(user.canTeach || "").split(", ").map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: 11,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "rgba(233,30,140,0.1)",
                              color: "#e91e8c",
                              fontWeight: 600,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#999",
                          marginTop: 10,
                        }}
                      >
                        WANTS TO LEARN
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {(user.wantToLearn || "").split(", ").map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: 11,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "rgba(99,102,241,0.1)",
                              color: "#6366f1",
                              fontWeight: 600,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        marginBottom: 10,
                      }}
                    >
                      {[...Array(fullStars)].map((_, i) => (
                        <FaStar
                          key={i}
                          style={{ color: "#f59e0b", fontSize: 11 }}
                        />
                      ))}
                      {[...Array(emptyStars)].map((_, i) => (
                        <FaRegStar
                          key={i}
                          style={{ color: "#ddd", fontSize: 11 }}
                        />
                      ))}
                      <span
                        style={{ fontSize: 11, color: "#888", marginLeft: 4 }}
                      >
                        {avg} ({total})
                      </span>
                    </div>

                    {/* Buttons */}
                    {isMe ? (
                      <button
                        onClick={() => navigate("/edit-profile")}
                        className="btn-outline"
                        style={{ width: "100%" }}
                      >
                        Edit Profile
                      </button>
                    ) : isConnected ? (
                      <button
                        onClick={() => openSession(user)}
                        className="btn-primary"
                        style={{ width: "100%" }}
                      >
                        Open Session
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <button
                          onClick={() =>
                            sendRequest(
                              user._id,
                              user.canTeach || "Skill",
                              "learn",
                            )
                          }
                          className="btn-primary"
                        >
                          Learn from {user.name.split(" ")[0]}
                        </button>

                        <button
                          onClick={() =>
                            sendRequest(
                              user._id,
                              user.wantToLearn || "Skill",
                              "teach",
                            )
                          }
                          className="btn-outline"
                        >
                          Teach {user.name.split(" ")[0]}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ══ COMMUNITY CHAT FAB ══ */}
      <button
        onClick={() => setIsChatOpen(true)}
        style={{
          position: "fixed",
          bottom: 80,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px var(--accent-glow)",
          transition: "transform 0.15s",
          zIndex: 50,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        className="desktop-only"
      >
        <FaComments size={17} />
      </button>

      {/* ══ COMMUNITY CHAT MODAL ══ */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,24,19,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 150,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              width: 400,
              height: 500,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "13px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                  Community Chat
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Open to all users
                </p>
              </div>
              <FaTimes
                style={{ cursor: "pointer", color: "var(--text-muted)" }}
                onClick={() => setIsChatOpen(false)}
              />
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {messages.map((msg, i) => {
                const isOwn = msg.user === loggedInUser.name;
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isOwn ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                    }}
                  >
                    {!isOwn && (
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          marginBottom: 2,
                          fontWeight: 600,
                        }}
                      >
                        {msg.user}
                      </p>
                    )}
                    <div
                      style={{
                        padding: "8px 12px",
                        fontSize: 13,
                        lineHeight: 1.5,
                        borderRadius: isOwn
                          ? "14px 14px 2px 14px"
                          : "14px 14px 14px 2px",
                        background: isOwn
                          ? "var(--accent)"
                          : "var(--bg-surface)",
                        border: isOwn ? "none" : "1px solid var(--border)",
                        color: isOwn ? "#fff" : "var(--text-primary)",
                      }}
                    >
                      {msg.message}
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        marginTop: 2,
                        textAlign: isOwn ? "right" : "left",
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: 8,
              }}
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendCommunityMsg()}
                placeholder="Message the community..."
                className="ss-input"
                style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
              />
              <button
                onClick={sendCommunityMsg}
                className="btn-primary"
                style={{ padding: "8px 12px", borderRadius: 8 }}
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <div className="mobile-only">
        <MobileNav
          active={mobileTab}
          onDiscover={() => setMobileTab("discover")}
          onFriends={() => {
            setMobileTab("friends");
            setSideTab("friends");
            setMobileSide("open");
          }}
          onPending={() => {
            setMobileTab("pending");
            setSideTab("pending");
            setMobileSide("open");
          }}
          onChat={() => {
            setMobileTab("chat");
            setIsChatOpen(true);
          }}
          pendingCount={pendingReqs.length}
        />
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
        className="desktop-only"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaLinkedin style={{ color: "#60a5fa", fontSize: 12 }} />
          <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/nekalsingh/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#60a5fa" }}
            >
              Nekal Singh
            </a>
          </span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
          © {new Date().getFullYear()} SwapSkill
        </span>
      </footer>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }
        .hidden-mobile { display: flex; }
        @media (max-width: 640px) {
          .desktop-only  { display: none !important; }
          .mobile-only   { display: block !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

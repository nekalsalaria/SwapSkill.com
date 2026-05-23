import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  FaArrowLeft, FaStar, FaCalendarAlt, FaPaperPlane,
  FaPen, FaEraser, FaFont, FaTrash, FaDownload,
  FaCommentAlt, FaChalkboard,
} from "react-icons/fa";

// ── Socket singleton ──────────────────────────────────────
const SOCKET_URL = "https://swapskill-com.onrender.com";
let socket = null;
const getSocket = () => {
  if (!socket) socket = io(SOCKET_URL, { transports: ["websocket"] });
  return socket;
};

// ── Constants ─────────────────────────────────────────────
const COLORS      = ["#ffffffff","#e07b2a","#d94f3d","#2d9e6b","#3b7dd8","#9b59b6","#f5c842"];
const BRUSH_SIZES = [2, 5, 10, 20];
const STICKY_BG   = ["#fef08a","#bbf7d0","#bfdbfe","#fecaca","#e9d5ff","#fed7aa"];

const makeRoomId = (a, b) => "wb-" + [a, b].sort().join("-");

/* ═══════════════════════════════════════════════════════════
   WHITEBOARD
═══════════════════════════════════════════════════════════ */
const Whiteboard = ({ roomId, currentUserId }) => {
  const canvasRef   = useRef(null);
  const lastPt      = useRef(null);
  const drawing     = useRef(false);
  const historyRef  = useRef([]);

  const [tool,      setTool]      = useState("pen");
  const [color,     setColor]     = useState("#1c1813");
  const [brushSize, setBrushSize] = useState(5);
  const [stickies,  setStickies]  = useState([]);
  const [dragId,    setDragId]    = useState(null);
  const [dragOff,   setDragOff]   = useState({ x:0, y:0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    resize(canvas);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    snapshot();

    const onResize = () => {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resize(canvas);
      ctx.putImageData(img, 0, 0);
      drawGrid(ctx, canvas.width, canvas.height);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const clearLocal = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawGrid(ctx,canvas.width,canvas.height);
    setStickies([]);
  }, []);

  const resize = (canvas) => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const drawGrid = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth   = 0.8;
    const step = 28;
    for (let x=0; x<=w; x+=step) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y=0; y<=h; y+=step) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
  };

  const snapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    historyRef.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    if (historyRef.current.length > 50) historyRef.current.shift();
  };

  const renderStroke = (x0,y0,x1,y1,c,bs,t) => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.save();
    ctx.lineCap   = "round";
    ctx.lineJoin  = "round";
    ctx.globalCompositeOperation = t==="eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = t==="eraser" ? "rgba(0,0,0,1)" : c;
    ctx.lineWidth   = t==="eraser" ? bs*4 : bs;
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.restore();
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onPointerDown = (e) => {
    if (tool === "sticky") { addSticky(getPos(e)); return; }
    snapshot();
    drawing.current = true;
    lastPt.current  = getPos(e);
  };

  const onPointerMove = (e) => {
    if (!drawing.current) return;
    const pos = getPos(e);
    const { x:x0, y:y0 } = lastPt.current;
    const { x:x1, y:y1 } = pos;
    renderStroke(x0,y0,x1,y1,color,brushSize,tool);
    getSocket().emit("draw-stroke", { roomId, x0,y0,x1,y1, color, brushSize, tool });
    drawGrid(canvasRef.current.getContext("2d"), canvasRef.current.width, canvasRef.current.height);
    lastPt.current = pos;
  };

  const onPointerUp = () => { drawing.current = false; lastPt.current = null; };

  function clearBoard() {
    clearLocal();
    getSocket().emit("clear-board", { roomId });
  }

  useEffect(() => {
    const socket = getSocket();
    socket.on("draw-stroke", (data) => {
      renderStroke(data.x0, data.y0, data.x1, data.y1, data.color, data.brushSize, data.tool);
    });
    socket.on("clear-board", () => { clearLocal(); });
    socket.on("sticky-add", ({ sticky }) => { setStickies(prev => [...prev, sticky]); });
    socket.on("sticky-update", ({ id, text }) => {
      setStickies(prev => prev.map(s => s.id === id ? { ...s, text } : s));
    });
    socket.on("sticky-remove", ({ id }) => {
      setStickies(prev => prev.filter(s => s.id !== id));
    });
    socket.on("sticky-move", ({ id, x, y }) => {
      setStickies(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
    });
    return () => socket.off();
  }, [clearLocal]);

  const downloadBoard = () => {
    const link = document.createElement("a");
    link.download = `swapskill-board-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const addSticky = (pos) => {
    const sticky = {
      id: `${currentUserId}-${Date.now()}`,
      x: pos.x - 80, y: pos.y - 60,
      text: "",
      bg: STICKY_BG[Math.floor(Math.random() * STICKY_BG.length)],
    };
    setStickies(p => [...p, sticky]);
    getSocket().emit("sticky-add", { roomId, sticky });
  };

  const updateSticky = (id, text) => {
    setStickies(p => p.map(s => s.id===id ? {...s,text} : s));
    getSocket().emit("sticky-update", { roomId, id, text });
  };

  const removeSticky = (id) => {
    setStickies(p => p.filter(s => s.id!==id));
    getSocket().emit("sticky-remove", { roomId, id });
  };

  const startDrag = (e, id) => {
    e.stopPropagation();
    const sticky = stickies.find(s => s.id===id);
    const src = e.touches ? e.touches[0] : e;
    setDragId(id);
    setDragOff({ x: src.clientX - sticky.x, y: src.clientY - sticky.y });
  };

  const onDrag = useCallback((e) => {
    if (!dragId) return;
    const src = e.touches ? e.touches[0] : e;
    const x = src.clientX - dragOff.x;
    const y = src.clientY - dragOff.y;
    setStickies(p => p.map(s => s.id===dragId ? {...s,x,y} : s));
    getSocket().emit("sticky-move", { roomId, id: dragId, x, y });
  }, [dragId, dragOff, roomId]);

  const stopDrag = () => setDragId(null);

  const cursorMap = { pen:"crosshair", eraser:"cell", sticky:"copy" };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--wb-bg)", borderRadius:0, overflow:"hidden" }}>

      {/* ── Toolbar ── */}
      <div className="wb-toolbar">

        {/* Tools */}
        <div style={{ display:"flex", gap:3, background:"var(--bg-surface)", borderRadius:10, padding:3 }}>
          {[
            { key:"pen",    icon:<FaPen size={12}/>,    label:"Pen" },
            { key:"eraser", icon:<FaEraser size={12}/>, label:"Eraser" },
            { key:"sticky", icon:<FaFont size={12}/>,   label:"Sticky" },
          ].map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTool(key)} title={label} style={{
              display:"flex", alignItems:"center", gap:5, padding:"6px 10px",
              borderRadius:7, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
              background: tool===key ? "var(--accent)" : "transparent",
              color:      tool===key ? "#fff" : "var(--text-secondary)",
              transition:"all 0.15s",
            }}>
              {icon} <span className="wb-tool-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="wb-divider" />

        {/* Colors */}
        <div style={{ display:"flex", gap:4, alignItems:"center", flexWrap:"wrap" }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => { setColor(c); setTool("pen"); }} style={{
              width:18, height:18, borderRadius:"50%", background:c, border:"none",
              cursor:"pointer",
              outline: color===c ? `3px solid ${c}66` : "none",
              transform: color===c ? "scale(1.25)" : "scale(1)",
              transition:"transform 0.1s",
              flexShrink: 0,
            }} />
          ))}
        </div>

        <div className="wb-divider" />

        {/* Brush sizes */}
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          {BRUSH_SIZES.map(s => (
            <button key={s} onClick={() => setBrushSize(s)} style={{
              width:26, height:26, borderRadius:"50%", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              background: brushSize===s ? "var(--accent-bg)" : "var(--bg-surface)",
              border: brushSize===s ? "1.5px solid var(--accent)" : "1px solid var(--border)",
              transition:"all 0.1s",
              flexShrink: 0,
            }}>
              <div style={{ width:Math.max(3, s/1.8), height:Math.max(3, s/1.8), borderRadius:"50%", background:color }} />
            </button>
          ))}
        </div>

        <div style={{ flex:1 }} />

        {/* Save / Clear */}
        <button onClick={downloadBoard} className="wb-action-btn wb-save-btn" title="Save">
          <FaDownload size={11}/> <span className="wb-btn-label">Save</span>
        </button>
        <button onClick={clearBoard} className="wb-action-btn wb-clear-btn" title="Clear">
          <FaTrash size={11}/> <span className="wb-btn-label">Clear</span>
        </button>
      </div>

      {/* ── Session strip ── */}
      <div style={{ padding:"5px 14px", background:"var(--accent-bg)", borderBottom:"1px solid #e07b2a18", flexShrink:0 }}>
        <span style={{ fontSize:11, color:"var(--accent)", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>
          📚 Whiteboard —
        </span>
        <span style={{ fontSize:11, color:"var(--text-muted)", marginLeft:6 }}>
          {tool==="pen" ? "Drawing" : tool==="eraser" ? "Eraser" : "Click to place sticky"} · Syncing live
        </span>
      </div>

      {/* ── Canvas + stickies ── */}
      <div
        style={{ flex:1, position:"relative", overflow:"hidden" }}
        onMouseMove={onDrag} onMouseUp={stopDrag}
        onTouchMove={onDrag} onTouchEnd={stopDrag}
      >
        <canvas
          ref={canvasRef}
          style={{ width:"100%", height:"100%", display:"block", cursor:cursorMap[tool], touchAction:"none" }}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        />

        {stickies.map(sticky => (
          <div
            key={sticky.id}
            style={{
              position:"absolute", left:sticky.x, top:sticky.y,
              width:150, minHeight:110, background:sticky.bg,
              borderRadius:10, padding:"8px 10px",
              boxShadow:"0 4px 16px rgba(0,0,0,0.13)",
              cursor: dragId===sticky.id ? "grabbing" : "grab",
              zIndex:10,
            }}
            onMouseDown={e => { if (e.target.tagName!=="TEXTAREA" && e.target.tagName!=="BUTTON") startDrag(e,sticky.id); }}
            onTouchStart={e => { if (e.target.tagName!=="TEXTAREA" && e.target.tagName!=="BUTTON") startDrag(e,sticky.id); }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <div style={{ display:"flex", gap:3 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"rgba(0,0,0,0.18)" }}/>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"rgba(0,0,0,0.18)" }}/>
              </div>
              <button onClick={() => removeSticky(sticky.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,0,0,0.35)", fontSize:12, padding:2, lineHeight:1 }}>✕</button>
            </div>
            <textarea
              value={sticky.text}
              onChange={e => updateSticky(sticky.id, e.target.value)}
              placeholder="Type here..."
              style={{
                width:"100%", border:"none", background:"transparent", resize:"none",
                fontSize:12, color:"#1c1813", outline:"none", fontFamily:"inherit",
                minHeight:68, lineHeight:1.5, userSelect:"text",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CHAT PANEL
═══════════════════════════════════════════════════════════ */
const ChatPanel = ({ toUserId, toUserName, token, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const bottomRef               = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://swapskill-com-p5du.onrender.com/api/user/get-messages/${toUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.messages || []);
      } catch {
        console.error("Failed to fetch messages");
      }
    })();
  }, [toUserId, token]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("receive-message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off("receive-message");
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        "https://swapskill-com-p5du.onrender.com/api/user/send-message",
        { toUserId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msg = { sender: currentUser._id, receiver: toUserId, content: text };
      setMessages(prev => [...prev, msg]);
      const socket = getSocket();
      socket.emit("send-message", msg);
      setText("");
    } catch {
      console.error("Failed to send message");
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--bg-card)" }}>

      <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
        <p style={{ fontWeight:700, fontSize:14, margin:0 }}>💬 Chat with {toUserName}</p>
        <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2, margin:0 }}>Ask questions while learning</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign:"center", margin:"auto", opacity:0.5 }}>
            <p style={{ fontSize:28, margin:0 }}>✍️</p>
            <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:6 }}>Ask your question below</p>
          </div>
        ) : messages.map((msg, i) => {
          const isOwn = msg.sender === currentUser._id;
          return (
            <div key={i} style={{ display:"flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth:"82%", padding:"8px 12px",
                borderRadius: isOwn ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                background: isOwn ? "var(--accent)" : "var(--bg-surface)",
                border: isOwn ? "none" : "1px solid var(--border)",
                color: isOwn ? "#fff" : "var(--text-primary)",
                fontSize:13, lineHeight:1.5,
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding:"10px 12px", borderTop:"1px solid var(--border)", display:"flex", gap:8, flexShrink:0 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==="Enter" && handleSend()}
          placeholder="Type a question…"
          className="ss-input"
          style={{ flex:1, padding:"9px 12px", fontSize:13 }}
        />
        <button onClick={handleSend} className="btn-primary" style={{ padding:"9px 14px", borderRadius:9, display:"flex", alignItems:"center" }}>
          <FaPaperPlane size={12}/>
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN ChatPage
═══════════════════════════════════════════════════════════ */
const ChatPage = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const token       = useSelector(s => s.user.token);
  const currentUser = useSelector(s => s.user.userData);
  const { toUserId, toUserName, toUserEmail, startedAt } = location.state || {};

  const sessionLabel = startedAt
    ? `Session started ${new Date(startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Session";

  const [showRating,   setShowRating]   = useState(false);
  const [rating,       setRating]       = useState(0);
  const [hover,        setHover]        = useState(0);
  // Mobile tab: "board" | "chat"
  const [mobileTab,    setMobileTab]    = useState("board");

  const roomId = currentUser && toUserId ? makeRoomId(currentUser._id, toUserId) : null;

  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket();
    socket.emit("join-room", { roomId });
    return () => { socket.emit("leave-room", { roomId }); };
  }, [roomId]);

  const submitRating = async () => {
    if (!rating) return;
    try {
      await axios.post(
        "https://swapskill-com-p5du.onrender.com/api/user/rate-user",
        { mentorId: toUserId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowRating(false); setRating(0);
    } catch {
      console.error("Failed to submit rating");
    }
  };

  const scheduleMeeting = () => {
    const title = encodeURIComponent(`Meeting with ${toUserName}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&add=${toUserEmail}&details=Skill%20session%20via%20SwapSkill`, "_blank");
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--bg-primary)", color:"var(--text-primary)", overflow:"hidden" }}>

      {/* ── Responsive Styles ── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* ── Whiteboard toolbar ── */
        .wb-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          flex-shrink: 0;
          min-height: 48px;
        }
        .wb-divider {
          width: 1px;
          height: 24px;
          background: var(--border);
          flex-shrink: 0;
        }
        .wb-action-btn {
          padding: 6px 11px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          flex-shrink: 0;
        }
        .wb-save-btn {
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
        }
        .wb-clear-btn {
          border: 1px solid #d94f3d22;
          background: var(--red-dim);
          color: var(--red);
        }

        /* ── Nav ── */
        .cp-nav-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 56px;
          max-width: 100%;
        }
        .cp-user-meta { display: flex; flex-direction: column; min-width: 0; }
        .cp-user-name {
          font-weight: 700;
          font-size: 14px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .cp-user-email {
          font-size: 11px;
          color: var(--text-muted);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .cp-live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: var(--green-dim);
          border-radius: 20px;
          border: 1px solid #2d9e6b28;
          flex-shrink: 0;
        }
        .cp-rate-btn {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #d9770628;
          background: var(--accent-bg);
          color: var(--amber);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .cp-meet-btn {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #3b7dd828;
          background: var(--blue-dim);
          color: var(--blue);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .cp-btn-label { display: inline; }

        /* ── Split layout ── */
        .cp-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .cp-board-pane {
          flex: 0 0 65%;
          border-right: 1px solid var(--border);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .cp-chat-pane {
          flex: 0 0 35%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Mobile tab bar ── */
        .cp-tab-bar {
          display: none;
          flex-shrink: 0;
          border-top: 1px solid var(--border);
          background: var(--bg-surface);
        }
        .cp-tab-btn {
          flex: 1;
          padding: 10px 0;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          border-top: 2px solid transparent;
          transition: all 0.15s;
        }
        .cp-tab-btn.active {
          color: var(--accent);
          border-top-color: var(--accent);
          background: var(--accent-bg);
        }

        /* ── Tablet: 768px–1024px ── */
        @media (max-width: 1024px) {
          .cp-board-pane { flex: 0 0 60%; }
          .cp-chat-pane  { flex: 0 0 40%; }
          .cp-user-name  { max-width: 120px; }
          .cp-user-email { max-width: 120px; }
          .wb-btn-label  { display: none; }
          .wb-action-btn { padding: 6px 9px; }
        }

        /* ── Mobile: <768px ── */
        @media (max-width: 767px) {
          /* Nav tweaks */
          .cp-nav-inner  { gap: 7px; height: 50px; }
          .cp-user-name  { max-width: 90px; font-size: 13px; }
          .cp-user-email { display: none; }
          .cp-live-badge { padding: 3px 7px; }
          .cp-live-badge span:last-child { display: none; }
          .cp-btn-label  { display: none; }
          .cp-rate-btn   { padding: 6px 9px; }
          .cp-meet-btn   { padding: 6px 9px; }

          /* Stack board + chat vertically, tabs switch */
          .cp-body {
            flex-direction: column;
          }
          .cp-board-pane {
            flex: 1 1 auto;
            border-right: none;
            border-bottom: 1px solid var(--border);
            display: none;
          }
          .cp-board-pane.mobile-active { display: flex; }
          .cp-chat-pane {
            flex: 1 1 auto;
            display: none;
          }
          .cp-chat-pane.mobile-active { display: flex; }

          /* Show tab bar on mobile */
          .cp-tab-bar { display: flex; }

          /* Toolbar wraps nicely */
          .wb-toolbar { gap: 6px; padding: 6px 10px; }
          .wb-divider { height: 18px; }
          .wb-tool-label { display: none; }
        }

        /* ── Very small phones: <400px ── */
        @media (max-width: 400px) {
          .cp-nav-inner { gap: 5px; }
          .cp-rate-btn, .cp-meet-btn { padding: 5px 7px; }
        }
      `}</style>

      {/* ── Rating modal ── */}
      {showRating && (
        <div style={{ position:"fixed", inset:0, background:"rgba(28,24,19,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"0 16px" }}>
          <div className="ss-card" style={{ padding:32, width:"100%", maxWidth:320, textAlign:"center", borderRadius:20 }}>
            <p style={{ fontSize:22, marginBottom:6 }}>⭐</p>
            <p style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>Rate {toUserName}</p>
            <p style={{ color:"var(--text-muted)", fontSize:13, marginBottom:24 }}>How was your session?</p>
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28 }}>
              {[1,2,3,4,5].map(star => (
                <span key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    fontSize:32, cursor:"pointer", display:"inline-block", lineHeight:1,
                    color: (hover||rating)>=star ? "var(--amber)" : "var(--border)",
                    transform: (hover||rating)>=star ? "scale(1.2)" : "scale(1)",
                    transition:"all 0.1s",
                  }}
                >★</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowRating(false)} className="btn-outline" style={{ flex:1 }}>Cancel</button>
              <button onClick={submitRating} className="btn-primary" style={{ flex:1 }} disabled={!rating}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top navbar ── */}
      <div className="ss-nav" style={{ padding:"0 16px", flexShrink:0, zIndex:50 }}>
        <div className="cp-nav-inner">

          <button onClick={() => navigate("/dashboard")} className="btn-outline"
            style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", fontSize:12, flexShrink:0 }}>
            <FaArrowLeft size={10}/> <span className="cp-btn-label">Dashboard</span>
          </button>

          {/* Avatar + name */}
          <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0, flex:"0 0 auto" }}>
            <div style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              background:"var(--accent-bg)", border:"2px solid var(--accent)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, color:"var(--accent)",
            }}>
              {(toUserName||"?")[0].toUpperCase()}
            </div>
            <div className="cp-user-meta">
              <p className="cp-user-name">{toUserName}</p>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <p className="cp-user-email">{toUserEmail}</p>
                {startedAt && (
                  <span style={{ fontSize:10, color:"var(--green)", fontWeight:600, whiteSpace:"nowrap" }}>
                    🟢 {sessionLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="cp-live-badge">
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)", display:"inline-block", animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>Live</span>
          </div>

          <div style={{ flex:1 }}/>

          {/* Rate + Meet */}
          <button onClick={() => setShowRating(true)} className="cp-rate-btn">
            <FaStar size={11}/> <span className="cp-btn-label">Rate</span>
          </button>
          <button onClick={scheduleMeeting} className="cp-meet-btn">
            <FaCalendarAlt size={11}/> <span className="cp-btn-label">Meet</span>
          </button>
        </div>
      </div>

      {/* ── Split body ── */}
      <div className="cp-body">

        {/* LEFT — Whiteboard */}
        <div className={`cp-board-pane${mobileTab === "board" ? " mobile-active" : ""}`}>
          {roomId && <Whiteboard roomId={roomId} currentUserId={currentUser._id} />}
        </div>

        {/* RIGHT — Chat */}
        <div className={`cp-chat-pane${mobileTab === "chat" ? " mobile-active" : ""}`}>
          <ChatPanel toUserId={toUserId} toUserName={toUserName} token={token} currentUser={currentUser} />
        </div>

      </div>

      {/* ── Mobile Tab Bar ── */}
      <div className="cp-tab-bar">
        <button
          className={`cp-tab-btn${mobileTab === "board" ? " active" : ""}`}
          onClick={() => setMobileTab("board")}
        >
          <FaChalkboard size={14}/> Whiteboard
        </button>
        <button
          className={`cp-tab-btn${mobileTab === "chat" ? " active" : ""}`}
          onClick={() => setMobileTab("chat")}
        >
          <FaCommentAlt size={14}/> Chat
        </button>
      </div>

    </div>
  );
};

export default ChatPage;

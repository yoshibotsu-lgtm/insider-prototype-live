// Assistant.jsx ‚Äî Copilot AI Assistant view
const { useState: useAsstState, useEffect: useAsstEffect, useRef: useAsstRef } = React;

const CHIPS = [
  { icon: "üîî", label: "Create a push campaign" },
  { icon: "üìà", label: "Revenue insights" },
  { icon: "üë•", label: "Segment audience" },
  { icon: "‚úâÔ∏è", label: "Draft email copy" },
];

const SYSTEM_PROMPT = `You are Insider Copilot, an AI marketing assistant embedded in the Insider platform. Help marketing professionals with tasks like building audience segments, analyzing campaign performance, drafting email or push notification copy, and extracting revenue insights. Be concise, professional, and actionable. Use bullet points or numbered steps when helpful. Keep responses under 180 words. Reference Insider platform features when relevant (e.g., segments, journeys, A/B tests, web push, email, onsite campaigns).`;

function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#5B4CF5",
          animation: `asstBounce 0.9s ${i * 0.18}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

function MsgBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      gap: 8,
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #5B4CF5, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 11, flexShrink: 0, marginTop: 2,
        }}>‚ú¶</div>
      )}
      <div style={{
        maxWidth: 560,
        padding: "10px 14px",
        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        background: isUser ? "#111" : "white",
        color: isUser ? "white" : "#111",
        fontSize: 13.5,
        lineHeight: 1.65,
        border: !isUser ? "1px solid #ebebef" : "none",
        whiteSpace: "pre-wrap",
        boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        {msg.content}
      </div>
      {isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "#e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, flexShrink: 0, marginTop: 2,
        }}>Y</div>
      )}
    </div>
  );
}

function AssistantView({ tweaks = {} }) {
  const assistantBg  = tweaks.assistantBg  || "#ffffff";
  const accentColor  = tweaks.accentColor  || "#5B4CF5";
  const userName     = tweaks.userName     || "Yosun";
  const [messages, setMessages] = useAsstState([]);
  const [input, setInput] = useAsstState("");
  const [loading, setLoading] = useAsstState(false);
  const bottomRef = useAsstRef(null);
  const textareaRef = useAsstRef(null);

  useAsstEffect(() => {
    if (bottomRef.current) {
      const el = bottomRef.current.parentElement;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");
    const userMsg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await window.claude.complete({
        system: SYSTEM_PROMPT,
        messages: next.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const canSend = input.trim().length > 0 && !loading;
  const isWelcome = messages.length === 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: assistantBg, overflow: "hidden" }}>
      {isWelcome ? (
        /* ‚îÄ‚îÄ Welcome state ‚îÄ‚îÄ */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 40px" }}>
          <h1 style={{ fontSize: 42, fontWeight: 350, color: "#0f0f10", marginBottom: 6, letterSpacing: "-0.8px", textAlign: "center" }}>
            Good Evening, {userName}.
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
            What marketing goal can{" "}
            <span style={{ color: "#f59e0b", fontWeight: 500 }}>I help</span>
            {" "}you achieve{" "}
            <span style={{ color: accentColor, fontWeight: 500 }}>today</span>?
          </p>

          {/* Input card */}
          <div style={{ width: "100%", maxWidth: 580, marginBottom: 10 }}>
            <div style={{
              background: "white", border: "1px solid #d1d5db", borderRadius: 8,
              padding: "12px 14px 10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Copilot anything about your campaigns, segments, or revenue‚Ä¶"
                style={{
                  width: "100%", minHeight: 68, border: "none", outline: "none",
                  resize: "none", fontSize: 14, color: "#111", background: "transparent",
                  lineHeight: 1.55, fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, paddingTop: 8, borderTop: "1px solid #f0f0f3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button style={asst.ctrlBtn}>+</button>
                  <button style={{ ...asst.ctrlBtn, padding: "4px 10px", fontSize: 11.5, gap: 5, display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 12 }}>‚ú¶</span> COPILOT <span style={{ fontSize: 10 }}>‚ñæ</span>
                  </button>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  style={{
                    background: canSend ? accentColor : "#e5e7eb",
                    color: canSend ? "white" : "#9ca3af",
                    border: "none", borderRadius: 6,
                    padding: "8px 16px", fontSize: 12, fontWeight: 700,
                    cursor: canSend ? "pointer" : "default",
                    display: "flex", alignItems: "center", gap: 6,
                    letterSpacing: "0.04em", transition: "background 0.15s",
                    fontFamily: "inherit",
                  }}>
                  SEND REQUEST <span style={{ fontSize: 13 }}>‚å≤</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "#b0b0b8", marginBottom: 22, textTransform: "uppercase" }}>
            System Status: Ready for Insights Extraction
          </div>

          {/* Chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 580 }}>
            {CHIPS.map(chip => (
              <button
                key={chip.label}
                onClick={() => sendMessage(chip.label)}
                style={asst.chip}
                onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <span style={{ fontSize: 13 }}>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ‚îÄ‚îÄ Chat state ‚îÄ‚îÄ */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Messages */}
          <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 860, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
            {messages.map((msg, i) => <MsgBubble key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #5B4CF5, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 11, flexShrink: 0,
                }}>‚ú¶</div>
                <div style={{ background: "white", border: "1px solid #ebebef", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ThinkingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Bottom input */}
          <div style={{ borderTop: "1px solid #ebebef", background: "white", padding: "12px 20px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px",
                background: "white",
              }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Continue the conversation‚Ä¶"
                  rows={1}
                  style={{
                    flex: 1, border: "none", outline: "none", resize: "none",
                    fontSize: 13.5, fontFamily: "inherit", background: "transparent",
                    lineHeight: 1.5, color: "#111",
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  style={{
                    background: canSend ? "#111" : "#e5e7eb",
                    color: canSend ? "white" : "#9ca3af",
                    border: "none", borderRadius: 6, padding: "7px 14px",
                    fontSize: 11.5, fontWeight: 700, cursor: canSend ? "pointer" : "default",
                    display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit",
                    transition: "background 0.15s", letterSpacing: "0.03em",
                  }}>
                  SEND <span style={{ fontSize: 13 }}>‚å≤</span>
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(chip.label)}
                    style={{ ...asst.chip, fontSize: 11, padding: "5px 11px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const asst = {
  ctrlBtn: {
    background: "none", border: "1px solid #e5e7eb",
    borderRadius: 5, padding: "4px 8px",
    fontSize: 14, cursor: "pointer", color: "#6b7280",
    fontFamily: "inherit",
  },
  chip: {
    background: "white", border: "1px solid #e5e7eb", borderRadius: 20,
    padding: "7px 14px", fontSize: 12.5, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
    color: "#374151", transition: "background 0.12s",
    fontFamily: "inherit",
  },
};

Object.assign(window, { AssistantView });

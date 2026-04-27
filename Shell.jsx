// Shell.jsx — TopNav, Sidebar, NotificationBanner
const { useState } = React;

const Ic = ({ d, size = 16, fill = "none", sw = 1.8 }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
style={{ display: "block", flexShrink: 0 }}>
    <path d={d} />
  </svg>;


const icons = {
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  layout: "M12 3h9v9h-9zM3 12h9v9H3zM3 3h9v9H3z",
  chevDown: "M6 9l6 6 6-6",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  bar: "M18 20V10M12 20V4M6 20v-6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
  mega: "M21 13V5l-10 7H5a2 2 0 00-2 2v2a2 2 0 002 2h2l2 4h2l-1-4h2l10 7V13z",
  phone: "M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  sparkle: "M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
};

function TopNav({ currentView, onViewChange }) {
  return (
    <div style={{
      height: 46,
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      padding: "0 14px", gap: 2, flexShrink: 0, zIndex: 20, background: "rgb(255, 255, 255)"
    }}>
      {/* Copilot button */}
      <button
        onClick={() => onViewChange(currentView === "assistant" ? "dashboard" : "assistant")}
        title={currentView === "assistant" ? "Back to Dashboard" : "Open Copilot"}
        style={{
          width: 26, height: 26, borderRadius: "50%",
          background: currentView === "assistant" ? "#22c55e" : "#2a2a2a",
          border: currentView === "assistant" ? "none" : "1px solid #3a3a3a",
          cursor: "pointer", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 10, transition: "background 0.2s, box-shadow 0.2s",
          boxShadow: currentView === "assistant" ? "0 0 8px rgba(34,197,94,0.4)" : "none"
        }}>
        <Ic d={icons.sparkle} size={13} />
      </button>

      {/* Bell */}
      <button style={navBtnStyle} title="Notifications">
        <div style={{ position: "relative" }}>
          <Ic d={icons.bell} size={15} />
          <span style={{
            position: "absolute", top: -6, right: -7,
            background: "#ef4444", color: "white",
            fontSize: 8.5, fontWeight: 700, borderRadius: 8, padding: "1px 3.5px"
          }}>8</span>
        </div>
      </button>
      <button style={navBtnStyle} title="Messages"><Ic d={icons.chat} size={15} /></button>
      <button style={navBtnStyle} title="Layout"><Ic d={icons.layout} size={15} /></button>

      <div style={{ width: 1, height: 18, background: "#2e2e2e", margin: "0 6px" }} />

      <button style={navDropStyle}>
        <span>salesdemo</span>
        <Ic d={icons.chevDown} size={11} />
      </button>
      <button style={navDropStyle}>
        <span>ycsun@useinsider.com</span>
        <Ic d={icons.chevDown} size={11} />
      </button>
      <button style={{
        background: "#1e1e1e", border: "1px solid #3a3a3a",
        color: "#d1d5db", fontSize: 11.5, fontWeight: 500,
        padding: "5px 11px", borderRadius: 5, cursor: "pointer",
        marginLeft: 4
      }}>Get Support</button>
    </div>);

}

function Sidebar({ currentView, onViewChange }) {
  const navItems = [
  { icon: icons.grid, view: "dashboard", label: "Home" },
  { icon: icons.star, label: "Favorites" },
  { icon: icons.bar, label: "Analytics" },
  { icon: icons.mega, label: "Campaigns" },
  { icon: icons.phone, label: "Mobile" },
  { icon: icons.users, label: "Segments" },
  { icon: icons.clock, label: "Journeys" },
  null,
  { icon: icons.lock, label: "Privacy" }];


  return (
    <div style={{
      width: 44, flexShrink: 0,
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 10, gap: 2, background: "rgb(0, 0, 0)"
    }}>
      {/* Logo */}
      <div style={{
        width: 26, height: 26, background: "#5B4CF5", borderRadius: 5,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 700, fontSize: 12, marginBottom: 8
      }}>I</div>

      {navItems.map((item, i) => {
        if (!item) return (
          <div key={i} style={{ width: 22, height: 1, background: "#252525", margin: "3px 0" }} />);

        const active = item.view === currentView;
        return (
          <button
            key={i}
            title={item.label}
            onClick={() => item.view && onViewChange(item.view)}
            style={{
              width: 34, height: 34,
              background: active ? "#1f1f1f" : "transparent",
              border: "none", borderRadius: 5,
              color: active ? "#a78bfa" : "#606878",
              cursor: item.view ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.12s, color 0.12s",
              borderLeft: active ? "2px solid #5B4CF5" : "2px solid transparent"
            }}
            onMouseEnter={(e) => {if (!active) {e.currentTarget.style.background = "#1a1a1a";e.currentTarget.style.color = "#9ca3af";}}}
            onMouseLeave={(e) => {if (!active) {e.currentTarget.style.background = "transparent";e.currentTarget.style.color = "#606878";}}}>
            
            <Ic d={item.icon} size={16} />
          </button>);

      })}
    </div>);

}

function NotificationBanner({ onDismiss }) {
  return (
    <div style={{
      background: "#3b5bdb", color: "white",
      padding: "7px 16px", fontSize: 12.5, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, flexShrink: 0 }}>ⓘ</span>
        <span>
          Some of your account assets have exceeded 80% usage and this may affect your monthly bill. You can visit the{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>Usage Analytics</span>
          {" "}page for further information.
        </span>
      </div>
      <button onClick={onDismiss} style={{
        background: "none", border: "none", color: "rgba(255,255,255,0.8)",
        cursor: "pointer", fontSize: 15, padding: "0 0 0 12px", flexShrink: 0
      }}>✕</button>
    </div>);

}

const navBtnStyle = {
  background: "none", border: "none", color: "#7a8292",
  cursor: "pointer", padding: 7, borderRadius: 4,
  display: "flex", alignItems: "center", justifyContent: "center"
};
const navDropStyle = {
  background: "none", border: "none", color: "#7a8292",
  cursor: "pointer", padding: "4px 7px", borderRadius: 4,
  display: "flex", alignItems: "center", gap: 4,
  fontSize: 11.5, fontWeight: 500
};

Object.assign(window, { TopNav, Sidebar, NotificationBanner });
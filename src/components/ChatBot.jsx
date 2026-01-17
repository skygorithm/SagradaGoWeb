import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../Constants";
import Cookies from "js-cookie";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const uid = Cookies.get("uid");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/ai/response`, {
        userId: uid,
        message: userMessage.text,
      });

      const aiMessage = { role: "ai", text: res.data.message };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm having trouble connecting. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // dito nalang baka magoverlap pa sa iba
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "550px",
      backgroundColor: "#fff",
      overflow: "hidden",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    header: {
      padding: "16px 24px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    statusDot: {
      width: "10px",
      height: "10px",
      backgroundColor: "#22c55e",
      borderRadius: "50%",
    },
    chatArea: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    messageRow: (role) => ({
      display: "flex",
      justifyContent: role === "user" ? "flex-end" : "flex-start",
      width: "100%",
      textAlign: 'justify'
    }),
    bubble: (role) => ({
      maxWidth: "85%",
      padding: "10px 16px",
      fontSize: "13px",
      lineHeight: "1.5",
      borderRadius: "18px",
      backgroundColor: role === "user" ? "#000" : "#f1f1f1",
      color: role === "user" ? "#fff" : "#333",
      borderTopRightRadius: role === "user" ? "2px" : "18px",
      borderTopLeftRadius: role === "ai" ? "2px" : "18px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }),
    inputContainer: {
      padding: "20px",
      borderTop: "1px solid #eee",
      backgroundColor: "#fff",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    inputField: {
      width: "100%",
      padding: "12px 50px 12px 20px",
      backgroundColor: "#f4f4f4",
      border: "none",
      borderRadius: "25px",
      fontSize: "14px",
      outline: "none",
    },
    sendButton: {
      position: "absolute",
      right: "6px",
      padding: "8px",
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: loading || !input.trim() ? 0.3 : 1,
      transition: "opacity 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.statusDot}></div>
        <div>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>SagradaBot</h3>
          <p style={{ margin: 0, fontSize: "10px", color: "#999", textTransform: "uppercase" }}>
            Always Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} style={styles.chatArea}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "100px", color: "#ccc" }}>
            <div style={{ fontSize: "24px" }}>👋</div>
            <p style={{ fontSize: "12px", fontStyle: "italic" }}>How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} style={styles.messageRow(msg.role)}>
            <div style={styles.bubble(msg.role)}>{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div style={styles.messageRow("ai")}>
            <div style={{ ...styles.bubble("ai"), fontStyle: "italic", color: "#999" }}>
              AI is typing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            style={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write a message..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={styles.sendButton}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
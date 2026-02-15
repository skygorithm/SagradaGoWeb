import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../Constants";
import Cookies from "js-cookie";
import { message } from "antd";

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputBot, setInputBot] = useState("");

  const [adminMessages, setAdminMessages] = useState([]);
  const [inputAdmin, setInputAdmin] = useState("");

  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [chatBotMode, setChatBotMode] = useState(true);

  const [chatAdminHistory, setChatAdminHistory] = useState([]);

  const chatbotContainerRef = useRef(null);

  const uid = Cookies.get("uid");
  const fullname = Cookies.get("fullname");

  async function fetchAdminChatHistory() {
    try {
      const res = await axios.get(`${API_URL}/chat/getChatByUserId/${uid}`);
      console.log(res.data.chat.messages);
      setChatAdminHistory(res.data.chat.messages);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  }

  useEffect(() => {
    fetchAdminChatHistory();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        chatbotContainerRef.current &&
        !chatbotContainerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const getMessageRole = (msg) => {
    if (msg.senderType === "admin") return "ai";
    if (msg.senderType === "user") return "user";
    return msg.role || "user";
  };

  const sendMessage = async () => {
    if (!inputBot.trim() || loading) return;
    if (!uid) {
      message.warning("Please sign in to use the AI chat.");
      return;
    }
    if (!API_URL) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Chat service is not configured. Please try again later.",
        },
      ]);
      return;
    }
    const userMessage = { role: "user", text: inputBot.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputBot("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/ai/response`, {
        userId: uid,
        message: userMessage.text,
      });
      const aiMessage = { role: "ai", text: res.data?.message ?? "No response." };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const is404 = error.response?.status === 404;
      const isNetwork = error.code === "ERR_NETWORK";
      const friendlyMsg =
        is404 || isNetwork
          ? "Chat service is temporarily unavailable. Please try again in a few moments."
          : "I'm having trouble connecting. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: friendlyMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  async function sendAdminMessage() {
    if (!inputAdmin.trim() || loading) return;

    if (!uid) {
      message.error("Admin not authenticated");
      return;
    }

    const adminMessage = {
      role: "user",
      senderId: uid,
      senderType: "user",
      senderName: fullname,
      message: inputAdmin.trim(),
      text: inputAdmin.trim(),
    };

    setAdminMessages((prev) => [...prev, adminMessage]);

    setInputAdmin("");

    try {
      const res = await axios.post(`${API_URL}/chat/addMessageWeb`, {
        userId: uid,
        senderId: uid,
        senderType: "user",
        senderName: fullname,
        message: inputAdmin.trim(),
      });

      console.log("Updated chat:", res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      message.error("Failed to send message");
    }
  }

  const styles = {
    floatingWrapper: {
      position: "fixed",
      bottom: "90px",
      right: "24px",
      width: "360px",
      zIndex: 2000,
      boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
      borderRadius: "16px",
      overflow: "hidden",
      backgroundColor: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      border: "1px solid #eaeaea",
    },
    header: {
      padding: "16px 20px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fff",
    },
    headerInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    statusDot: {
      width: "8px",
      height: "8px",
      backgroundColor: "#22c55e",
      borderRadius: "50%",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      color: "#999",
      padding: "4px",
    },
    chatArea: {
      height: "400px",
      overflowY: "auto",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    messageRow: (role) => ({
      display: "flex",
      justifyContent: role === "user" ? "flex-end" : "flex-start",
      width: "100%",
      textAlign: "justify",
    }),
    bubble: (role) => ({
      maxWidth: "80%",
      padding: "10px 14px",
      fontSize: "13px",
      lineHeight: "1.4",
      borderRadius: "15px",
      backgroundColor: role === "user" ? "#000" : "#fff",
      color: role === "user" ? "#fff" : "#333",
      borderBottomRightRadius: role === "user" ? "2px" : "15px",
      borderBottomLeftRadius: role === "ai" ? "2px" : "15px",
      border: role === "ai" ? "1px solid #eee" : "none",
    }),
    inputContainer: {
      padding: "15px",
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
      padding: "10px 45px 10px 15px",
      backgroundColor: "#f0f0f0",
      border: "none",
      borderRadius: "20px",
      fontSize: "13px",
      outline: "none",
    },
    sendButton: {
      position: "absolute",
      right: "5px",
      padding: "6px",
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: loading || !inputBot.trim() ? 0.3 : 1,
    },
  };

  return (
    /* 3. Attach the ref to the wrapper */
    <div ref={chatbotContainerRef} style={styles.floatingWrapper}>
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <div style={styles.statusDot}></div>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
              SagradaBot
            </h3>
            <p style={{ margin: 0, fontSize: "10px", color: "#22c55e" }}>
              Online
            </p>
          </div>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="w-full h-10 bg-gray-200 rounded-full flex p-1">
        <button
          className={`w-1/2 h-full rounded-full text-sm font-medium transition-all duration-300
            ${chatBotMode ? "bg-amber-400 text-black" : "text-gray-600"}
            ${chatBotMode ? "" : "cursor-pointer"}
          `}
          onClick={() => setChatBotMode(true)}
        >
          Chat Bot
        </button>

        <button
          className={`w-1/2 h-full rounded-full text-sm font-medium transition-all duration-300
            ${!chatBotMode ? "bg-amber-400 text-black" : "text-gray-600"}
            ${!chatBotMode ? "" : "cursor-pointer"}
          `}
          onClick={() => setChatBotMode(false)}
        >
          Chat Admin
        </button>
      </div>

      <div ref={scrollRef} style={styles.chatArea}>
        {(chatBotMode ? messages : [...chatAdminHistory, ...adminMessages])
          .length === 0 && (
          <div
            style={{ textAlign: "center", marginTop: "40px", color: "#aaa" }}
          >
            <p style={{ fontSize: "12px" }}>Hello! How can I help you today?</p>
          </div>
        )}

        {(chatBotMode ? messages : [...chatAdminHistory, ...adminMessages]).map(
          (msg, index) => {
            const role = getMessageRole(msg);

            return (
              <div key={index} style={styles.messageRow(role)}>
                <div style={styles.bubble(role)}>{msg.text || msg.message}</div>
              </div>
            );
          },
        )}

        {loading && (
          <div style={styles.messageRow("ai")}>
            <span
              style={{ color: "#999", fontSize: "11px", marginLeft: "10px" }}
            >
              Typing...
            </span>
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            style={styles.inputField}
            value={chatBotMode ? inputBot : inputAdmin}
            onChange={(e) =>
              chatBotMode
                ? setInputBot(e.target.value)
                : setInputAdmin(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                chatBotMode ? sendMessage() : sendAdminMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <button
            onClick={chatBotMode ? sendMessage : sendAdminMessage}
            disabled={
              loading || (chatBotMode ? !inputBot.trim() : !inputAdmin.trim())
            }
            style={styles.sendButton}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

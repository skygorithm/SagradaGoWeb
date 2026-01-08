import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { API_URL } from "../Constants";
import axios from "axios";

export default function ForgotPasswordModal({ visible, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Checking if email exists:", email.trim());
      const checkResponse = await axios.post(`${API_URL}/checkEmail`, {
        email: email.trim(),
      });

      const checkData = checkResponse.data;

      if (!checkData.exists) {
        setError(
          "No account found with this email address. Please check your email and try again."
        );
        setLoading(false);
        return;
      }

      console.log("Email exists, sending password reset email...");
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess(true);
      setEmail("");
      
    } catch (error) {
      console.error("Forgot password error:", error);

      let errorMessage = "Failed to send password reset email. Please try again.";

      if (error.message && error.message.includes("Network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";

      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";

      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";

      } else if (error.message) {
        errorMessage = error.message;

      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close">
          <button onClick={handleClose} disabled={loading}>
            ✕
          </button>
        </div>

        <h1 className="modal-title">Forgot Password</h1>
        {success ? (
          <>
            <p className="modal-subtitle" style={{ color: "#28a745" }}>
              Password reset email has been sent! Please check your inbox and
              spam folder for instructions to reset your password.
            </p>
            <button
              className="filled-btn"
              style={{ padding: "8px", fontSize: "14px", marginTop: "10px" }}
              onClick={handleClose}
            >
              OK
            </button>
          </>
        ) : (
          <>
            <p className="modal-subtitle">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>

            <label>Email</label>
            <input
              type="email"
              className="modal-input"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            {error && <p className="modal-error">{error}</p>}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                className="modal-link"
                onClick={handleClose}
                disabled={loading}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#f5f5f5",
                }}
              >
                Cancel
              </button>
              <button
                className="filled-btn"
                style={{ padding: "8px", fontSize: "14px", flex: 1 }}
                onClick={handleForgotPassword}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


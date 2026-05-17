import { useState } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { API_URL } from "../Constants";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function getPasswordRules(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character";
  return "";
}

export default function ChangePasswordModal({
  visible,
  email,
  uid,
  currentPassword,
  firebaseUser,
  onSuccess,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordRules, setPasswordRules] = useState(getPasswordRules(""));

  if (!visible) return null;

  const handleSubmit = async () => {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from your temporary password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const firebaseToken = await firebaseUser.getIdToken();

      await axios.post(`${API_URL}/changePassword`, {
        uid,
        currentPassword,
        newPassword,
        firebaseToken,
      });

      // Backend updates Firebase via Admin SDK, which invalidates the current token.
      // Re-sign in with the new password instead of updatePassword().
      await signInWithEmailAndPassword(auth, email.trim(), newPassword);

      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch (err) {
      console.error("Change password error:", err);

      if (err.code === "auth/user-token-expired") {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), newPassword);
          setNewPassword("");
          setConfirmPassword("");
          onSuccess();
          return;
        } catch (signInErr) {
          console.error("Re-sign in after password change failed:", signInErr);
        }
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay change-password-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Set Your New Password</h1>
        <p className="modal-subtitle">
          This is your first login. Please create a new password to continue.
        </p>

        <label>New Password</label>
        <div className="modal-password-wrapper">
          <input
            type={showNewPass ? "text" : "password"}
            className="modal-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordRules(getPasswordRules(e.target.value));
              if (error) setError("");
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowNewPass(!showNewPass)}
            className="password-toggle"
          >
            {showNewPass ? (
              <EyeTwoTone twoToneColor="#555" />
            ) : (
              <EyeInvisibleOutlined />
            )}
          </button>
        </div>

        <div style={{ marginTop: 8, marginBottom: 12, fontSize: 12 }}>
          <div style={{ color: passwordRules.length ? "green" : "#888" }}>
            • At least 8 characters
          </div>
          <div style={{ color: passwordRules.uppercase ? "green" : "#888" }}>
            • At least 1 uppercase letter
          </div>
          <div style={{ color: passwordRules.lowercase ? "green" : "#888" }}>
            • At least 1 lowercase letter
          </div>
          <div style={{ color: passwordRules.number ? "green" : "#888" }}>
            • At least 1 number
          </div>
          <div style={{ color: passwordRules.specialChar ? "green" : "#888" }}>
            • At least 1 special character
          </div>
        </div>

        <label>Confirm New Password</label>
        <div className="modal-password-wrapper">
          <input
            type={showConfirmPass ? "text" : "password"}
            className="modal-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="password-toggle"
          >
            {showConfirmPass ? (
              <EyeTwoTone twoToneColor="#555" />
            ) : (
              <EyeInvisibleOutlined />
            )}
          </button>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <button
          className="filled-btn"
          style={{ padding: "8px", fontSize: "14px", marginTop: 10, width: "100%" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password & Continue"}
        </button>
      </div>
    </div>
  );
}

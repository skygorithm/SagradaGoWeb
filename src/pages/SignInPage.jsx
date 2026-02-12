import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Button from "../components/Button";
import { NavbarContext } from "../context/AllContext";
import SignUpPage from "./SignUpPage";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../Constants";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function SignInPage() {
  const navigate = useNavigate();
  const { setShowSignin, showSignup, setShowSignup, setCurrentUser } =
    useContext(NavbarContext);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // async function SignIn() {
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       inputEmail,
  //       inputPassword
  //     );

  //     const user = userCredential.user;

  //     // if (!user.emailVerified) {
  //     //   setError(
  //     //     "Please verify your email address before logging in. Check your inbox for the verification link."
  //     //   );
  //     //   setLoading(false);
  //     //   return;
  //     // }

  //     const uid = user.uid;
  //     console.log("uid:", uid);

  //     try {
  //       console.log("napasok sa admin");

  //       const adminResponse = await axios.post(`${API_URL}/findAdmin`, { uid });

  //       if (adminResponse.data?.user) {
  //         const adminUser = adminResponse.data.user;
  //         adminUser.is_admin = true;
  //         setCurrentUser(adminUser);
  //         localStorage.setItem("currentUser", JSON.stringify(adminUser));
  //         Cookies.set("email", inputEmail, { expires: 7 });

  //         const sessionTimeout = Date.now() + (5 * 60 * 1000);
  //         localStorage.setItem("sessionTimeout", sessionTimeout.toString());

  //         navigate("/admin/dashboard");
  //         setShowSignin(false);
  //         setLoading(false);
  //         return;
  //       }

  //     } catch (err) {

  //       console.error("Admin check failed:", err);
  //     }

  //     try {
  //       const firebaseToken = await user.getIdToken();

  //       const loginResponse = await axios.post(`${API_URL}/login`, {
  //         email: inputEmail,
  //         password: inputPassword,
  //         firebaseToken: firebaseToken,
  //       });
  //       console.log("user", loginResponse);

  //       setCurrentUser(loginResponse.data.user);
  //       localStorage.setItem("currentUser", JSON.stringify(loginResponse.data.user));

  //       Cookies.set("email", inputEmail, { expires: 7 });
  //       Cookies.set("uid", loginResponse.data.user.uid, { expires: 7 });
  //       Cookies.set("fullname", `${loginResponse.data.user.first_name} ${loginResponse.data.user.middle_name} ${loginResponse.data.user.last_name}`, { expires: 7 });
  //       Cookies.set("contact", loginResponse.data.user.contact_number, { expires: 7 });

  //       const sessionTimeout = Date.now() + (5 * 60 * 1000);
  //       localStorage.setItem("sessionTimeout", sessionTimeout.toString());

  //       navigate("/");
  //       setShowSignin(false);
  //       return;

  //     } catch (err) {
  //       console.error("Backend login failed:", err);

  //       if (err.response?.status === 401) {
  //         setError("Invalid email or password. If you recently changed your password, please try again in a few moments.");

  //       } else if (err.response?.status === 404) {
  //         setError("No account found with this email.");
  //       } else {
  //         setError("Login failed. Please try again.");
  //       }

  //     }

  //   // } catch (err) {
  //   //   console.error("Firebase login failed:", err);

  //   //   if (err.code === "auth/user-not-found") {
  //   //     setError("No account found with this email.");

  //   //   } else if (err.code === "auth/wrong-password") {
  //   //     setError("Incorrect password.");

  //   //   } else {
  //   //     setError("Login failed. Please try again.");
  //   //   }

  //   // } finally {
  //   //   setLoading(false);
  //   // }

  //   } catch (err) {
  //     console.error("Firebase login failed:", err);

  //     switch (err.code) {
  //       case "auth/user-not-found":
  //         setError("No account found with this email.");
  //         break;

  //       case "auth/wrong-password":
  //         setError("Incorrect password.");
  //         break;

  //       case "auth/invalid-email":
  //         setError("Please enter a valid email address.");
  //         break;

  //       case "auth/missing-password":
  //         setError("Please enter your password.");
  //         break;

  //       case "auth/too-many-requests":
  //         setError(
  //           "Too many failed login attempts. Please wait a few minutes and try again."
  //         );
  //         break;

  //       case "auth/user-disabled":
  //         setError(
  //           "This account has been disabled. Please contact the administrator."
  //         );
  //         break;

  //       default:
  //         setError("Unable to sign in. Please check your credentials and try again.");
  //     }
  //   }
  // }

  // async function SignIn() {
  //   setError("");
  //   setLoading(true);

  //   let user;

  //   try {
  //     // --- Step 1: Firebase login ---
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       inputEmail,
  //       inputPassword
  //     );
  //     user = userCredential.user;
  //     const uid = user.uid;
  //     console.log("uid:", uid);

  //   } catch (err) {
  //     console.error("Firebase login failed:", err);

  //     // --- Firebase-specific errors ---
  //     switch (err.code) {
  //       case "auth/user-not-found":
  //         setError("No account found with this email.");
  //         break;

  //       case "auth/wrong-password":
  //         setError("Incorrect password.");
  //         break;

  //       case "auth/invalid-email":
  //         setError("Please enter a valid email address.");
  //         break;

  //       case "auth/missing-password":
  //         setError("Please enter your password.");
  //         break;

  //       case "auth/too-many-requests":
  //         setError(
  //           "Too many failed login attempts. Please wait a few minutes and try again."
  //         );
  //         break;

  //       case "auth/user-disabled":
  //         setError(
  //           "This account has been disabled. Please contact the administrator."
  //         );
  //         break;

  //       case "auth/invalid-credential":
  //         setError("Incorrect email or password."); // <- your mobile-style handling
  //         break;

  //       default:
  //         setError(
  //           `Login failed: ${err.message || "Please check your credentials and try again."}`
  //         );
  //     }

  //     setLoading(false);
  //     return; // STOP execution here if Firebase login failed
  //   }

  //   // --- Step 2: Admin check ---
  //   try {
  //     const adminResponse = await axios.post(`${API_URL}/findAdmin`, { uid: user.uid });

  //     if (adminResponse.data?.user) {
  //       const adminUser = adminResponse.data.user;
  //       adminUser.is_admin = true;
  //       setCurrentUser(adminUser);
  //       localStorage.setItem("currentUser", JSON.stringify(adminUser));
  //       Cookies.set("email", inputEmail, { expires: 7 });

  //       const sessionTimeout = Date.now() + 5 * 60 * 1000;
  //       localStorage.setItem("sessionTimeout", sessionTimeout.toString());

  //       navigate("/admin/dashboard");
  //       setShowSignin(false);
  //       setLoading(false);
  //       return;
  //     }

  //   } catch (err) {
  //     console.error("Admin check failed:", err);
  //   }

  //   // --- Step 3: Backend login ---
  //   try {
  //     const firebaseToken = await user.getIdToken();

  //     const loginResponse = await axios.post(`${API_URL}/login`, {
  //       email: inputEmail,
  //       password: inputPassword,
  //       firebaseToken,
  //     });

  //     const backendUser = loginResponse.data.user;
  //     setCurrentUser(backendUser);
  //     localStorage.setItem("currentUser", JSON.stringify(backendUser));

  //     Cookies.set("email", inputEmail, { expires: 7 });
  //     Cookies.set("uid", backendUser.uid, { expires: 7 });
  //     Cookies.set(
  //       "fullname",
  //       `${backendUser.first_name} ${backendUser.middle_name} ${backendUser.last_name}`,
  //       { expires: 7 }
  //     );

  //     Cookies.set("contact", backendUser.contact_number, { expires: 7 });

  //     const sessionTimeout = Date.now() + 5 * 60 * 1000;
  //     localStorage.setItem("sessionTimeout", sessionTimeout.toString());

  //     navigate("/");
  //     setShowSignin(false);

  //   } catch (err) {
  //     console.error("Backend login failed:", err);

  //     if (err.response?.status === 401) {
  //       setError(
  //         "Invalid email or password. If you recently changed your password, please try again in a few moments."
  //       );

  //     } else if (err.response?.status === 404) {
  //       setError("No account found with this email.");

  //     } else {
  //       setError(err.response?.data?.message || "Login failed. Please try again.");
  //     }

  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function SignIn() {
    setError("");
    setLoading(true);

    let firebaseUser;

    // --- Helper: normalize user object to ensure consistent fields ---
    const normalizeUser = (u) => ({
      ...u,
      uid: u.uid || u.user_id || u.id,
      first_name: u.first_name || "",
      middle_name: u.middle_name || "",
      last_name: u.last_name || "",
      contact_number: u.contact_number || "",
      is_admin: u.is_admin || false,
    });

    try {
      // --- Step 1: Firebase Authentication ---
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      firebaseUser = userCredential.user;
    } catch (err) {
      console.error("Firebase login failed:", err);
      // Handle Firebase-specific errors
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please check your credentials.");
      }
      setLoading(false);
      return;
    }

    try {
      // --- Step 2: Check for Admin Privileges ---
      const adminResponse = await axios.post(`${API_URL}/findAdmin`, {
        uid: firebaseUser.uid,
      });

      if (adminResponse.data?.user) {
        const adminData = adminResponse.data.user;

        // Check if Admin account is disabled
        if (adminData.is_active === false) {
          setError("This admin account has been disabled.");
          setLoading(false);
          return;
        }

        const adminUser = normalizeUser(adminData);
        adminUser.is_admin = true; // Force true for admin route

        // Set State & Storage
        setCurrentUser(adminUser);

        console.log("subadmin",adminUser.isSubAdmin);
        
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        Cookies.set("email", inputEmail, { expires: 7 });
        Cookies.set("subAdmin", adminUser.isSubAdmin, { expires: 7 });
        

        // Set Session Timeout (5 mins)
        const sessionTimeout = Date.now() + 5 * 60 * 1000;
        localStorage.setItem("sessionTimeout", sessionTimeout.toString());

        navigate("/admin/dashboard");
        setShowSignin(false);
        setLoading(false);
        return; // Exit here if admin
      }

      // --- Step 3: Regular User Backend Login ---
      // If code reaches here, it means the UID was not found in the Admin table
      const firebaseToken = await firebaseUser.getIdToken();
      const loginResponse = await axios.post(`${API_URL}/login`, {
        email: inputEmail,
        password: inputPassword,
        firebaseToken,
      });

      const userData = loginResponse.data.user;

      // Check if Regular User account is disabled
      if (userData.is_active === false) {
        setError("Your account has been disabled. Please contact support.");
        setLoading(false);
        return;
      }

      const backendUser = normalizeUser(userData);

      // Set State & Storage
      setCurrentUser(backendUser);
      localStorage.setItem("currentUser", JSON.stringify(backendUser));

      // Set Cookies
      Cookies.set("email", inputEmail, { expires: 7 });
      Cookies.set("uid", backendUser.uid, { expires: 7 });
      Cookies.set("isAdmin", "false", { expires: 7 });
      Cookies.set(
        "fullname",
        `${backendUser.first_name} ${backendUser.middle_name} ${backendUser.last_name}`.trim(),
        { expires: 7 },
      );
      Cookies.set("contact", backendUser.contact_number, { expires: 7 });

      const sessionTimeout = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("sessionTimeout", sessionTimeout.toString());

      navigate("/");
      setShowSignin(false);
    } catch (err) {
      console.error("Backend validation failed:", err);
      if (err.response?.status === 401) {
        setError("Invalid credentials or session expired.");
      } else if (err.response?.status === 403) {
        setError(err.response.data?.message || "Access denied.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  //   if (loginResponse.data.user) {
  //   const regularUser = loginResponse.data.user;

  //   if (regularUser.is_active === false) {
  //     setError("Your account has been disabled. Please contact the administrator for assistance.");
  //     setLoading(false);
  //     return;
  //   }

  //   setCurrentUser(regularUser);
  //   localStorage.setItem("currentUser", JSON.stringify(regularUser));
  //   Cookies.set("email", inputEmail, { expires: 7 });
  //   setShowSignin(false);
  //   navigate("/");
  //   setLoading(false);
  //   return;
  // }

  // try {

  // } catch (loginError) {
  //   if (loginError.response && (loginError.response.status === 401 || loginError.response.status === 404)) {
  //     let adminUserCredential = firebaseUserCredential;

  //     if (!adminUserCredential) {
  //       try {
  //         adminUserCredential = await signInWithEmailAndPassword(
  //           auth,
  //           inputEmail,
  //           inputPassword
  //         );

  //       } catch (adminFirebaseError) {
  //         // Firebase auth failed for admin too, show error from original login attempt
  //         if (loginError.response.status === 401) {
  //           setError("Invalid email or password.");

  //         } else if (loginError.response.status === 404) {
  //           setError("No account found with this email.");

  //         } else {
  //           setError("Failed to sign in. Please try again.");
  //         }

  //         setLoading(false);
  //         return;
  //       }
  //     }

  //     const uid = adminUserCredential.user.uid;

  //       try {
  //         const adminResponse = await axios.post(`${API_URL}/findAdmin`, { uid });
  //         if (adminResponse.data.user) {
  //           const adminUser = adminResponse.data.user;

  //           if (adminUser.is_active === false) {
  //             setError("Your account has been disabled. Please contact the administrator for assistance.");
  //             setLoading(false);
  //             return;
  //           }

  //           setCurrentUser(adminUser);
  //           localStorage.setItem("currentUser", JSON.stringify(adminUser));
  //           Cookies.set("email", inputEmail, { expires: 7 });
  //           setShowSignin(false);
  //           navigate("/admin/dashboard");
  //           setLoading(false);
  //           return;
  //         }

  //       } catch (adminError) {
  //         if (loginError.response.status === 401) {
  //           setError("Invalid email or password.");

  //         } else if (loginError.response.status === 404) {
  //           setError("No account found with this email.");

  //         } else {
  //           setError("Failed to sign in. Please try again.");
  //         }

  //         setLoading(false);
  //         return;
  //       }

  //   } else {
  //     console.error("Login error:", loginError);

  //     if (loginError.response) {
  //       if (loginError.response.status === 403) {
  //         setError(loginError.response.data?.message || "Your account has been disabled. Please contact the administrator for assistance.");

  //       } else {
  //         setError(loginError.response.data?.message || "Failed to sign in. Please try again.");
  //       }

  //     } else {
  //       setError("Failed to sign in. Please check your connection and try again.");
  //     }
  //     setLoading(false);
  //     return;
  //   }
  // }

  return (
    <>
      {showSignup ? (
        <SignUpPage />
      ) : (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-close">
              <button
                onClick={() => {
                  setShowSignin(false);
                  setShowSignup(false);
                }}
              >
                ✕
              </button>
            </div>

            <h1 className="modal-title">Sign In</h1>
            <p className="modal-subtitle">
              Enter your registered email and password.
            </p>

            <label>Email</label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="modal-input"
              placeholder="youremail@example.com"
            />

            <label>Password</label>
            <div className="modal-password-wrapper">
              <input
                type={showPass ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="modal-input"
                placeholder="**********"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="password-toggle"
              >
                {showPass ? (
                  <EyeTwoTone twoToneColor="#555" />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </button>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <button
              onClick={() => setShowForgotPassword(true)}
              className="modal-link"
              style={{ marginTop: -10, marginBottom: 10, textAlign: "right" }}
              disabled={loading}
            >
              Forgot Password?
            </button>

            <button
              className="filled-btn"
              style={{ padding: "8px", fontSize: "14px" }}
              onClick={SignIn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button onClick={() => setShowSignup(true)} className="modal-link">
              No account yet? Sign up
            </button>

            <ForgotPasswordModal
              visible={showForgotPassword}
              onClose={() => setShowForgotPassword(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

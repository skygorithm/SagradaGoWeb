/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import NavButton from "./NavButton";
import { NavbarContext } from "../context/AllContext";
import "../styles/header.css";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/sagrada.png";

export default function Header() {
  const { setSelectedNavbar, setShowSignin, setShowSignup, currentUser, setActiveDropdown, setBookingSelected } =
    useContext(NavbarContext);
  const navigate = useNavigate();
  const email = Cookies.get("email");
  const location = useLocation();

  const navbar = [
    { id: "home", text: "Home", path: "/" },
    { id: "book", text: "Book A Service", path: "/book-service" },
    { id: "event", text: "Events", path: "/events" },
    { id: "volunteer", text: "Be a Volunteer", path: "/be-volunteer" },
    { id: "donate", text: "Donate", path: "/donate" },
  ];

  useEffect(() => {
    const currentNavItem = navbar.find(
      (elem) =>
        elem.path === location.pathname ||
        (elem.id === "book" && location.pathname.startsWith("/book"))
    );
    if (currentNavItem) {
      setSelectedNavbar(currentNavItem.id);
    }
  }, [location.pathname, setSelectedNavbar, navbar]);

  function handleMouseEnter(id) {
    if (id === "book") setActiveDropdown(true);
  }

  function handleMouseLeave(id) {
    if (id === "book") setActiveDropdown(false);
  }

  return (
    <div className="header-main-container">
      <img
        src={Logo}
        alt="Logo"
        className="header-logo"
        onClick={() => navigate("/")}
      />

      <div className="navbar-container">
        {navbar.map((elem) => (
          <NavButton
            id={elem.id}
            key={elem.text}
            text={elem.text}
            onClick={() => {
              setSelectedNavbar(elem.id);
              navigate(elem.path);
              setShowSignin(false);
              if (elem.id === "book") setBookingSelected(null);
            }}
            onMouseEnter={() => handleMouseEnter(elem.id)}
            onMouseLeave={() => handleMouseLeave(elem.id)}
          />
        ))}
      </div>

      <div className="signin-container">
        {email ? (
          <button
            className="border-btn"
            style={{ padding: "8px 15px" }}
            title="Logout"
            onClick={() => {
              Cookies.remove("email");
              navigate("/");
              window.location.reload();
            }}
          >
            <FaSignOutAlt size={18} color="#b87d3e" />
          </button>
        ) : (
          <button
            className="border-btn"
            style={{ padding: "8px 15px", fontSize: "14px " }}
            onClick={() => {
              setShowSignin(true)
              setShowSignup(false)
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

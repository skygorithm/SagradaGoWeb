import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { DashboardOutlined, UserOutlined, LogoutOutlined, BookOutlined, DollarOutlined, TeamOutlined, CalendarOutlined, NotificationOutlined } from "@ant-design/icons";
import { NavbarContext } from "../context/AllContext";
import Cookies from "js-cookie";
import Logo from "../assets/sagrada.png";
import "../styles/adminSidebar.css";

const { Sider } = Layout;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useContext(NavbarContext);

  const menuItems = [
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/account-management",
      icon: <UserOutlined />,
      label: "Account Management",
    },
    {
      key: "/admin/bookings",
      icon: <BookOutlined />,
      label: "Bookings",
    },
    {
      key: "/admin/donations",
      icon: <DollarOutlined />,
      label: "Donations",
    },
    {
      key: "/admin/volunteers",
      icon: <TeamOutlined />,
      label: "Volunteers",
    },
    {
      key: "/admin/events",
      icon: <CalendarOutlined />,
      label: "Events",
    },
    {
      key: "/admin/announcements",     
      icon: <NotificationOutlined />,  
      label: "Announcements",           
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    Cookies.remove("email");
    setCurrentUser({});
    navigate("/");
    window.location.reload();
  };

  return (
    <Sider
      width={256}
      theme="dark"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#b87d3e",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            transition: "opacity 0.3s",
          }}
          onClick={() => navigate("/admin/dashboard")}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <img
            src={Logo}
            alt="Sagrada Familia Logo"
            style={{ height: "48px", width: "48px", objectFit: "contain" }}
          />
          <div>
            <div
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.2",
              }}
            >
              Sagrada Familia
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                lineHeight: "1.2",
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div style={{ padding: "16px 8px", flex: 1 }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: "transparent",
            border: "none",
          }}
          className="custom-admin-menu"
        />
      </div>

      {/* Logout Section */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          style={{
            color: "white",
            textAlign: "left",
            height: "48px",
            padding: "12px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "white";
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}

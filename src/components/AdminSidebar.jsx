import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { DashboardOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
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
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/account-management",
      icon: <UserOutlined />,
      label: "Account Management",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    Cookies.remove("email");
    setCurrentUser({});
    navigate("/admin/login");
    window.location.reload();
  };

  return (
    <Sider
      width={256}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#b87d3e",
      }}
    >
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ height: "48px", cursor: "pointer" }}
          onClick={() => navigate("/admin/dashboard")}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: "#b87d3e",
          border: "none",
          marginTop: "16px",
        }}
        className="custom-admin-menu"
      />

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
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
            height: "auto",
            padding: "12px 16px",
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}


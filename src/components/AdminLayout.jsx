import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import AdminSidebar from "./AdminSidebar";

const { Content } = Layout;

export default function AdminLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <Layout style={{ marginLeft: 256 }}>
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: "100vh",
            background: "#f0f2f5",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}


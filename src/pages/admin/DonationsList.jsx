import { Card, Typography } from "antd";

const { Title } = Typography;

export default function DonationsList() {
  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card>
        <Title level={2}>Donations List</Title>
        <p>This page will display all donations.</p>
      </Card>
    </div>
  );
}


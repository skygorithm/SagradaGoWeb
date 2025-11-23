import { Card, Typography } from "antd";

const { Title } = Typography;

export default function VolunteersList() {
  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card>
        <Title level={2}>Volunteers List</Title>
        <p>This page will display all volunteers.</p>
      </Card>
    </div>
  );
}


import { Card, Typography } from "antd";

const { Title } = Typography;

export default function BookingPendingRequests() {
  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card>
        <Title level={2}>Booking Pending Requests</Title>
        <p>This page will display pending booking requests.</p>
      </Card>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Card, List, Badge, Typography, Button, Empty, Spin, Tag, Space } from "antd";
import {
  NotificationOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../Constants";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser")) || null;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!user?.uid) {
        console.warn("Notifications: No user UID found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Notifications: Fetching for admin UID:", user.uid);

      const response = await axios.post(`${API_URL}/getNotifications`, {
        recipient_id: user.uid,
        recipient_type: "admin",
        limit: 100,
      });

      console.log("Notifications: Response received:", response.data);

      if (response.data) {
        const transformedNotifications = (response.data.notifications || []).map((notification) => ({
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          time: dayjs(notification.createdAt),
          read: notification.read || false,
          action: notification.action || null,
        }));

        console.log("Notifications: Transformed notifications:", transformedNotifications);
        console.log("Notifications: Unread count:", response.data.unreadCount || 0);

        setNotifications(transformedNotifications);
        setUnreadCount(response.data.unreadCount || 0);
      }

    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(true);
      await axios.post(`${API_URL}/markAsRead`, {
        notification_id: notificationId,
      });

      setNotifications(
        notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(Math.max(0, unreadCount - 1));

    } catch (error) {
      console.error("Error marking notification as read:", error);

    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!user?.uid) return;

      setMarkingAsRead(true);
      await axios.post(`${API_URL}/markAllAsRead`, {
        recipient_id: user.uid,
        recipient_type: "admin",
      });

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

    } catch (error) {
      console.error("Error marking all as read:", error);

    } finally {
      setMarkingAsRead(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <BookOutlined style={{ fontSize: 20 }} />;

      case "donation":
      case "donation_status":
        return <DollarOutlined style={{ fontSize: 20 }} />;

      case "volunteer":
        return <UserOutlined style={{ fontSize: 20 }} />;

      case "event":
        return <CalendarOutlined style={{ fontSize: 20 }} />;

      case "user":
        return <UserOutlined style={{ fontSize: 20 }} />;

      default:
        return <NotificationOutlined style={{ fontSize: 20 }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "booking":
        return "#1890ff";

      case "donation":
      case "donation_status":
        return "#52c41a";

      case "volunteer":
        return "#fa8c16";

      case "event":
        return "#722ed1";

      case "user":
        return "#fa8c16";

      default:
        return "#b87d3e";
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1550px", margin: "20px auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0, color: "#262626", fontFamily: "Poppins" }}>
                Notifications
              </Title>
              <Text type="secondary" style={{ fontSize: 16, fontFamily: "Poppins" }}>
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </Text>
            </div>
            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleMarkAllAsRead}
                loading={markingAsRead}
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <Empty
              description="No notifications yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "50px 0" }}
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  style={{
                    backgroundColor: notification.read ? "#fff" : "#fffbf0",
                    borderLeft: notification.read ? "none" : "3px solid #b87d3e",
                    padding: "16px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: `${getNotificationColor(notification.type)}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: getNotificationColor(notification.type),
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    }
                    title={
                      <Space>
                        <Text strong={!notification.read} style={{ fontSize: 16 }}>
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <Badge status="processing" color="#b87d3e" />
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Text
                          style={{
                            color: "#666",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          {notification.message}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12 }}
                        >
                          {notification.time.format("MMM DD, YYYY [at] h:mm A")}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

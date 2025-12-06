import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Statistic, Button, Space, Table, Tag, Typography, Spin, Empty, Calendar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserAddOutlined,
  BookOutlined,
  HeartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "../../Constants";
import "../../styles/dashboard.css";
import CustomCalendar from "../../components/CustomCalendar";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPriests: 0,
    pendingBookings: 0,
    totalDonations: 0,
    monthlyDonations: 0,
    totalVolunteers: 0,
    recentUsers: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersResponse, allDonationsRes, monthlyDonationRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/getAllUsers`),
        axios.get(`${API_URL}/admin/getDonationStatistics`),
        axios.get(`${API_URL}/admin/getMonthlyDonations`),
        axios.all([
          axios.get(`${API_URL}/admin/getAllWeddings`).catch(() => ({ data: { weddings: [] } })),
          axios.get(`${API_URL}/admin/getAllBaptisms`).catch(() => ({ data: { baptisms: [] } })),
          axios.get(`${API_URL}/admin/getAllBurials`).catch(() => ({ data: { burials: [] } })),
          axios.get(`${API_URL}/admin/getAllCommunions`).catch(() => ({ data: { communions: [] } })),
          axios.get(`${API_URL}/admin/getAllConfirmations`).catch(() => ({ data: { confirmations: [] } })),
          axios.get(`${API_URL}/admin/getAllAnointings`).catch(() => ({ data: { anointings: [] } })),
          axios.get(`${API_URL}/admin/getAllConfessions`).catch(() => ({ data: { bookings: [] } })),
        ]),
      ]);

      const users = usersResponse.data || [];
      const priests = users.filter((user) => user.is_priest === true);

      const [weddings, baptisms, burials, communions, confirmations, anointings, confessions] = bookingsRes;
      
      // Normalize confessions data
      const normalizedConfessions = (confessions.data.bookings || []).map((b) => ({
        ...b,
        bookingType: "Confession",
        date: b.date ? new Date(b.date).toISOString() : null,
        status: b.status || "pending",
        full_name: b.full_name || "N/A",
      }));

      const allBookings = [
        ...(weddings.data.weddings || []).map((b) => ({ ...b, bookingType: "Wedding" })),
        ...(baptisms.data.baptisms || []).map((b) => ({ ...b, bookingType: "Baptism" })),
        ...(burials.data.burials || []).map((b) => ({ ...b, bookingType: "Burial" })),
        ...(communions.data.communions || []).map((b) => ({ ...b, bookingType: "Communion" })),
        ...(confirmations.data.confirmations || []).map((b) => ({ ...b, bookingType: "Confirmation" })),
        ...(anointings.data.anointings || []).map((b) => ({ ...b, bookingType: "Anointing" })),
        ...normalizedConfessions,
      ];

      // Filter confirmed bookings
      const confirmedBookings = allBookings.filter((b) => {
        const status = (b.status || "").toLowerCase();
        return status === "confirmed";
      });

      if (confirmedBookings.length > 0) {
        console.log(`Found ${confirmedBookings.length} confirmed booking(s) for calendar`);
      }

      // Helper function to get booking name
      const getBookingName = (booking) => {
        if (booking.bookingType === "Wedding") {
          const groom = `${booking.groom_first_name || ''} ${booking.groom_last_name || ''}`.trim();
          const bride = `${booking.bride_first_name || ''} ${booking.bride_last_name || ''}`.trim();
          return groom && bride ? `${groom} & ${bride}` : (groom || bride || booking.full_name || "Wedding");
        } else if (booking.bookingType === "Burial") {
          return booking.deceased_name || booking.full_name || "Burial Service";
        } else {
          return booking.full_name || booking.user?.name || booking.name || booking.bookingType || "Event";
        }
      };

      // Normalize date to local timezone for calendar
      const eventsForCalendar = confirmedBookings.map((b) => {
        if (!b.date) {
          console.warn("Booking missing date:", b);
          return null;
        }

        // Handle both string and Date objects
        let bookingDate;
        if (typeof b.date === 'string') {
          bookingDate = dayjs(b.date);
        } else if (b.date instanceof Date) {
          bookingDate = dayjs(b.date);
        } else {
          bookingDate = dayjs(b.date);
        }

        if (!bookingDate.isValid()) {
          console.warn("Invalid date for booking:", b.date, b);
          return null;
        }
        
        const dateStr = bookingDate.format("YYYY-MM-DD");
        return {
          date: dateStr,
          type: b.bookingType || "Other",
          name: getBookingName(b),
        };
      }).filter(Boolean); // Remove null entries

      setCalendarEvents(eventsForCalendar);

      const pendingBookingsCount = allBookings.filter((b) => b.status === "pending").length;

      const recentUsers = users.slice().reverse().slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalPriests: priests.length,
        pendingBookings: pendingBookingsCount,
        totalDonations: allDonationsRes.data.stats.amounts.total || 0,
        monthlyDonations: monthlyDonationRes.data.totalAmount || 0,
        totalVolunteers: 0,
        recentUsers: recentUsers,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);

    } finally {
      setLoading(false);
    }
  };


  const quickActions = [
    {
      title: "Account Management",
      description: "Manage users and priests",
      icon: <UserAddOutlined style={{ fontSize: 32, color: "#b87d3e" }} />,
      path: "/admin/account-management",
      color: "#b87d3e",
    },
    {
      title: "View Bookings",
      description: "Manage service bookings",
      icon: <BookOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      path: "/admin/bookings",
      color: "#1890ff",
    },
    {
      title: "View Donations",
      description: "Track donations",
      icon: <DollarOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      path: "/admin/donations",
      color: "#52c41a",
    },
    {
      title: "View Volunteers",
      description: "Manage volunteers",
      icon: <HeartOutlined style={{ fontSize: 32, color: "#f5222d" }} />,
      path: "/admin/volunteers",
      color: "#f5222d",
    },
  ];

  const recentUsersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Text strong>
          {record.first_name} {record.middle_name} {record.last_name}
        </Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "is_priest",
      key: "role",
      render: (isPriest) => (
        <Tag color={isPriest ? "purple" : "blue"}>
          {isPriest ? "Priest" : "User"}
        </Tag>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact_number",
      key: "contact",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div>
              <Title level={2} className="dashboard-title">
                Admin Dashboard
              </Title>
              <Text type="secondary" className="dashboard-subtitle">
                Welcome back! Here's what's happening today.
              </Text>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDashboardData}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="dashboard-stats-grid">
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-stat-card">
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="dashboard-stat-title">
                <Text type="secondary" className="dashboard-stat-text">
                  Regular users
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-stat-card">
              <Statistic
                title="Total Priests"
                value={stats.totalPriests}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <div className="dashboard-stat-title">
                <Text type="secondary" className="dashboard-stat-text">
                  Active priests
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="dashboard-stat-card"
              hoverable
              onClick={() => navigate("/admin/bookings?status=pending")}
              style={{ cursor: "pointer" }}
            >
              <Statistic
                title="Pending Bookings"
                value={stats.pendingBookings}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
              <div className="dashboard-stat-title">
                <Text type="secondary" className="dashboard-stat-text">
                  Awaiting approval (click to view)
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-stat-card">
              <Statistic
                title="Total Donations"
                value={stats.totalDonations}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: "#52c41a" }}
              />
              <div className="dashboard-stat-title">
                <Text type="secondary" className="dashboard-stat-text">
                  All-time donations
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-stat-card">
              <Statistic
                title="Donations This Month"
                value={stats.monthlyDonations}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: "#13c2c2" }}
              />
              <div className="dashboard-stat-title">
                <Text type="secondary" className="dashboard-stat-text">
                  Current month
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card
          title={<Title level={4} className="dashboard-quick-actions-title">Quick Actions</Title>}
          className="dashboard-quick-actions-card"
        >
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => {
              const cardClass =
                action.path.includes("account") ? "dashboard-quick-action-card-users" :
                action.path.includes("bookings") ? "dashboard-quick-action-card-bookings" :
                action.path.includes("donations") ? "dashboard-quick-action-card-donations" :
                "dashboard-quick-action-card-volunteers";

              return (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    hoverable
                    onClick={() => navigate(action.path)}
                    className={`dashboard-quick-action-card ${cardClass}`}
                    bodyStyle={{
                      padding: "24px",
                    }}
                  >
                    <div className="dashboard-quick-action-icon">{action.icon}</div>
                    <Title level={5} className="dashboard-quick-action-title">
                      {action.title}
                    </Title>
                    <Text type="secondary" className="dashboard-quick-action-description">
                      {action.description}
                    </Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>

        {/* Recent Users and Activity */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={<Title level={4} className="dashboard-recent-users-title">Recent Users</Title>}
              className="dashboard-recent-users-card"
              extra={
                <Button
                  type="link"
                  onClick={() => navigate("/admin/account-management")}
                >
                  View All
                </Button>
              }
            >
              {stats.recentUsers.length > 0 ? (
                <Table
                  dataSource={stats.recentUsers}
                  columns={recentUsersColumns}
                  pagination={false}
                  size="small"
                  rowKey="uid"
                />
              ) : (
                <Empty description="No recent users" />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card 
              title={<Title level={4} className="dashboard-system-overview-title">System Overview</Title>}
              className="dashboard-system-overview-card"
            >
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <div>
                  <div className="dashboard-system-overview-item">
                    <Text>System Status</Text>
                    <Tag color="success">Operational</Tag>
                  </div>
                  <div className="dashboard-system-overview-item">
                    <Text>Total Accounts</Text>
                    <Text strong>{stats.totalUsers + stats.totalPriests}</Text>
                  </div>
                  <div className="dashboard-system-overview-item">
                    <Text>User Ratio</Text>
                    <Text strong>
                      {stats.totalUsers > 0
                        ? ((stats.totalUsers / (stats.totalUsers + stats.totalPriests)) * 100).toFixed(1)
                        : 0}%
                    </Text>
                  </div>
                  <div className="dashboard-system-overview-item">
                    <Text>Priest Ratio</Text>
                    <Text strong>
                      {stats.totalPriests > 0
                        ? ((stats.totalPriests / (stats.totalUsers + stats.totalPriests)) * 100).toFixed(1)
                        : 0}%
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card
          title={<Title level={4}>Calendar</Title>}
        >
          <CustomCalendar events={calendarEvents} />
        </Card>
      </div>
    </div>
  );
}

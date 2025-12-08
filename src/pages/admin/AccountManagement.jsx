import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Constants";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Modal,
  message,
  Spin,
  Empty,
  Checkbox,
  Form,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AccountManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_number: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
    is_priest: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/getAllUsers`);
      setUsers(response.data);

    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (filterType === "priests") {
      filtered = filtered.filter((user) => user.is_priest === true);

    } else if (filterType === "users") {
      filtered = filtered.filter((user) => user.is_priest === false);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.contact_number?.includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact_number) newErrors.contact_number = "Contact number is required";
    if (!formData.birthday) newErrors.birthday = "Birthday is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const uid = user.uid;

      await sendEmailVerification(user);

      await axios.post(`${API_URL}/createUser`, {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        contact_number: formData.contact_number,
        birthday: formData.birthday,
        email: formData.email,
        password: formData.password,
        uid: uid,
        is_priest: formData.is_priest,
      });

      message.success("User created successfully!");
      setShowAddModal(false);
      resetForm();
      fetchUsers();

    } catch (error) {
      console.error("Error creating user:", error);

      if (error.response) {
        message.error(error.response.data.message || "Failed to create user.");

      } else if (error.code === "auth/email-already-in-use") {
        message.error("Email is already in use.");

      } else {
        message.error("Failed to create user. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (uid, newRole) => {
    Modal.confirm({
      title: "Confirm Role Change",
      content: `Are you sure you want to ${newRole ? 'make this user a priest' : 'remove priest role from this user'}?`,
      onOk: async () => {
        try {
          setLoading(true);
          await axios.put(`${API_URL}/updateUserRole`, {
            uid: uid,
            is_priest: newRole,
          });

          message.success("User role updated successfully!");
          fetchUsers();

        } catch (error) {
          console.error("Error updating user role:", error);
          message.error(error.response?.data?.message || "Failed to update user role.");

        } finally {
          setLoading(false);
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      contact_number: "",
      birthday: "",
      email: "",
      password: "",
      confirmPassword: "",
      is_priest: false,
    });

    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    {
      title: "Name",
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
      title: "Contact",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => formatDate(date),
    },
    {
      title: "Role",
      dataIndex: "is_priest",
      key: "role",
      render: (isPriest) => (
        <Tag color={isPriest ? "purple" : "blue"} icon={isPriest ? <TeamOutlined /> : <UserOutlined />}>
          {isPriest ? "Priest" : "User"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type={record.is_priest ? "default" : "primary"}
          onClick={() => handleUpdateRole(record.uid, !record.is_priest)}
          loading={loading}
        >
          {record.is_priest ? "Remove Priest" : "Make Priest"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Title level={2} style={{ margin: 0, color: "#262626" }}>
                Account Management
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Manage users and priests
              </Text>
            </div>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")}>
                Back to Dashboard
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                style={{ backgroundColor: "#b87d3e", borderColor: "#b87d3e" }}
              >
                Add User/Priest
              </Button>
            </Space>
          </div>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12}>
              <Input
                placeholder="Search by name, email, or contact number..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Select
                style={{ width: "100%" }}
                value={filterType}
                onChange={setFilterType}
                placeholder="Filter by type"
              >
                <Option value="all">All</Option>
                <Option value="users">Users</Option>
                <Option value="priests">Priests</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="uid"
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 1000 }}
            locale={{
              emptyText: <Empty description="No users found" />,
            }}
          />
        </Card>

        {/* Add User Modal */}
        <Modal
          title="Add New User/Priest"
          open={showAddModal}
          onCancel={() => {
            setShowAddModal(false);
            resetForm();
          }}
          footer={null}
          width={800}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      First Name <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.first_name ? "error" : ""}
                  help={errors.first_name}
                >
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Middle Name">
                  <Input
                    value={formData.middle_name}
                    onChange={(e) =>
                      setFormData({ ...formData, middle_name: e.target.value })
                    }
                    placeholder="Enter middle name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Last Name <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.last_name ? "error" : ""}
                  help={errors.last_name}
                >
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Contact Number <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.contact_number ? "error" : ""}
                  help={errors.contact_number}
                >
                  <Input
                    value={formData.contact_number}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_number: e.target.value })
                    }
                    placeholder="Enter contact number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Birthday <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.birthday ? "error" : ""}
                  help={errors.birthday}
                >
                  <Input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) =>
                      setFormData({ ...formData, birthday: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Email <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email}
                >
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Password <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.password ? "error" : ""}
                  help={errors.password}
                >
                  <Input.Password
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <>
                      Confirm Password <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  validateStatus={errors.confirmPassword ? "error" : ""}
                  help={errors.confirmPassword}
                >
                  <Input.Password
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm password"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Checkbox
                    checked={formData.is_priest}
                    onChange={(e) =>
                      setFormData({ ...formData, is_priest: e.target.checked })
                    }
                  >
                    This user is a priest
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleAddUser}
                loading={loading}
                style={{ backgroundColor: "#b87d3e", borderColor: "#b87d3e" }}
              >
                Create User
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}


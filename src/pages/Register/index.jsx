import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { register } from "../../services/userService";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            SocialApp
          </Title>
          <Text type="secondary">Tạo tài khoản mới</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="on"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="firstName"
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Tên không được quá 50 ký tự!" },
              { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: "Tên chỉ được chứa chữ cái và khoảng trắng!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên (*)"
              autoComplete="given-name"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[
              { required: true, message: "Vui lòng nhập họ!" },
              { min: 2, message: "Họ phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Họ không được quá 50 ký tự!" },
              { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: "Họ chỉ được chứa chữ cái và khoảng trắng!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ (*)"
              autoComplete="family-name"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email (*)"
              autoComplete="email"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: false }]}
          >
            <Select
              placeholder="Giới tính"
              style={{ borderRadius: "8px" }}
            >
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            rules={[{ required: false }]}
          >
            <DatePicker
              placeholder="Ngày sinh"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current > dayjs().endOf("day");
              }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              {
                pattern: /^[0-9+\-\s()]*$/,
                message: "Số điện thoại không hợp lệ!",
              },
              { max: 15, message: "Số điện thoại không được quá 15 ký tự!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              autoComplete="tel"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[
              { max: 200, message: "Địa chỉ không được quá 200 ký tự!" },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Địa chỉ"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>



          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              { max: 20, message: "Mật khẩu không được quá 20 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu (*)"
              autoComplete="new-password"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu (*)"
              autoComplete="new-password"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login" style={{ color: "#1890ff", fontWeight: "600" }}>
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Checkbox,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../services/authService";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      message.success("Đăng nhập thành công!");

      // Redirect về trang trước đó hoặc trang chủ
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    message.info("Đăng nhập bằng Google");
    // Xử lý đăng nhập Google ở đây
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
          maxWidth: "400px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            SocialApp
          </Title>
          <Text type="secondary">Đăng nhập vào tài khoản của bạn</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="on"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              autoComplete="email"
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
              placeholder="Mật khẩu"
              autoComplete="current-password"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                Quên mật khẩu?
              </Link>
            </div>
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
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">hoặc</Text>
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "8px",
            fontSize: "16px",
            border: "1px solid #d9d9d9",
            background: "#fff",
          }}
        >
          Đăng nhập bằng Google
        </Button>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/register" style={{ color: "#1890ff", fontWeight: "600" }}>
            Đăng ký ngay
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

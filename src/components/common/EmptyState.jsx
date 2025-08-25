import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const EmptyState = ({ 
  icon, 
  title = "Không có dữ liệu", 
  description,
  style = {} 
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: "#666",
        ...style,
      }}
    >
      {icon && (
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {icon}
        </div>
      )}
      <div style={{ marginBottom: "8px" }}>
        <Text strong>{title}</Text>
      </div>
      {description && (
        <div>
          <Text type="secondary">{description}</Text>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

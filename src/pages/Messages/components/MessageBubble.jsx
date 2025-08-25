import React from "react";

const MessageBubble = ({ message }) => {
  const isOwnMessage = message.sender === "me";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "60%",
          padding: "12px 16px",
          borderRadius: "18px",
          background: isOwnMessage ? "#1890ff" : "#fff",
          color: isOwnMessage ? "#fff" : "#000",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div>{message.content}</div>
        <div
          style={{
            fontSize: "11px",
            opacity: 0.7,
            marginTop: "4px",
            textAlign: "right",
          }}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

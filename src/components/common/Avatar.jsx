import React from "react";
import { Avatar as AntAvatar, Badge } from "antd";

const Avatar = ({ 
  children, 
  size = "large", 
  isOnline = false, 
  ...props 
}) => {
  return (
    <Badge
      dot={isOnline}
      offset={[-5, 5]}
      color="#52c41a"
    >
      <AntAvatar size={size} {...props}>
        {children}
      </AntAvatar>
    </Badge>
  );
};

export default Avatar;

import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const SearchInput = ({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  style = {},
  ...props
}) => {
  return (
    <Search
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ marginBottom: "16px", ...style }}
      {...props}
    />
  );
};

export default SearchInput;

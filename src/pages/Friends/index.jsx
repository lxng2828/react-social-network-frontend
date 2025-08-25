import React, { useState } from "react";
import { List, Typography, Badge, Tabs } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { SearchInput, EmptyState } from "../../components/common";
import {
  FriendItem,
  FriendRequestItem,
  FriendSuggestionItem,
} from "./components";

const { Text, Title } = Typography;

const Friends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const friends = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "A",
      status: "online",
      mutualFriends: 15,
      lastSeen: "2 phút trước",
      type: "friend",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "B",
      status: "offline",
      mutualFriends: 8,
      lastSeen: "1 giờ trước",
      type: "friend",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "C",
      status: "online",
      mutualFriends: 12,
      lastSeen: "5 phút trước",
      type: "friend",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "D",
      status: "offline",
      mutualFriends: 20,
      lastSeen: "1 ngày trước",
      type: "friend",
    },
  ];

  const friendRequests = [
    {
      id: 5,
      name: "Hoàng Văn E",
      avatar: "E",
      mutualFriends: 5,
      requestTime: "2 giờ trước",
      type: "request",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      avatar: "F",
      mutualFriends: 10,
      requestTime: "1 ngày trước",
      type: "request",
    },
  ];

  const suggestions = [
    {
      id: 7,
      name: "Đặng Văn G",
      avatar: "G",
      mutualFriends: 8,
      type: "suggestion",
    },
    {
      id: 8,
      name: "Bùi Thị H",
      avatar: "H",
      mutualFriends: 12,
      type: "suggestion",
    },
    {
      id: 9,
      name: "Ngô Văn I",
      avatar: "I",
      mutualFriends: 6,
      type: "suggestion",
    },
  ];

  const handleAcceptRequest = (id) => {
    console.log("Chấp nhận lời mời:", id);
  };

  const handleRejectRequest = (id) => {
    console.log("Từ chối lời mời:", id);
  };

  const handleAddFriend = (id) => {
    console.log("Gửi lời mời kết bạn:", id);
  };

  const handleMessage = (id) => {
    console.log("Nhắn tin với:", id);
  };

  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case "friends":
        data = friends;
        break;
      case "requests":
        data = friendRequests;
        break;
      case "suggestions":
        data = suggestions;
        break;
      default:
        data = [...friends, ...friendRequests, ...suggestions];
    }

    if (searchText) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  };

  const renderItem = (item) => {
    switch (item.type) {
      case "friend":
        return (
          <FriendItem key={item.id} friend={item} onMessage={handleMessage} />
        );
      case "request":
        return (
          <FriendRequestItem
            key={item.id}
            request={item}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        );
      case "suggestion":
        return (
          <FriendSuggestionItem
            key={item.id}
            suggestion={item}
            onAddFriend={handleAddFriend}
          />
        );
      default:
        return null;
    }
  };

  const items = [
    {
      key: "all",
      label: (
        <span>
          Tất cả
          <Badge
            count={friends.length + friendRequests.length + suggestions.length}
            style={{ marginLeft: 8 }}
          />
        </span>
      ),
    },
    {
      key: "friends",
      label: (
        <span>
          Bạn bè
          <Badge count={friends.length} style={{ marginLeft: 8 }} />
        </span>
      ),
    },
    {
      key: "requests",
      label: (
        <span>
          Lời mời kết bạn
          <Badge count={friendRequests.length} style={{ marginLeft: 8 }} />
        </span>
      ),
    },
    {
      key: "suggestions",
      label: (
        <span>
          Gợi ý
          <Badge count={suggestions.length} style={{ marginLeft: 8 }} />
        </span>
      ),
    },
  ];

  const filteredData = getFilteredData();

  return (
    <div
      style={{
        maxWidth: "60%",
        width: "100%",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ margin: 0 }}>
          Bạn bè
        </Title>
        <Text type="secondary">
          Quản lý danh sách bạn bè và lời mời kết bạn
        </Text>
      </div>

      <SearchInput
        placeholder="Tìm kiếm bạn bè..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ marginBottom: "16px" }}
      />

      <List dataSource={filteredData} renderItem={renderItem} />

      {filteredData.length === 0 && (
        <EmptyState
          icon={<UserAddOutlined />}
          title={searchText ? "Không tìm thấy bạn bè nào" : "Không có dữ liệu"}
        />
      )}
    </div>
  );
};

export default Friends;

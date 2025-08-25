import React from "react";
import { PostCard } from "../../components/common";
import { CreatePostForm } from "./components";

const Home = () => {
  const posts = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "A",
      content:
        "Hôm nay là một ngày tuyệt vời! Vừa hoàn thành xong dự án React mới. Cảm thấy thật sự hài lòng với kết quả. #ReactJS #WebDevelopment #Coding",
      time: "2 giờ trước",
      likes: 24,
      comments: 8,
      shares: 3,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      author: "Trần Thị B",
      avatar: "B",
      content:
        "Chia sẻ một số tips về JavaScript mà mình đã học được trong quá trình làm việc. Hy vọng sẽ hữu ích cho các bạn!",
      time: "4 giờ trước",
      likes: 15,
      comments: 12,
      shares: 5,
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      author: "Lê Văn C",
      avatar: "C",
      content:
        "Vừa tham gia workshop về AI/ML. Thật sự thú vị và mở mang tầm mắt về tương lai của công nghệ! #AI #MachineLearning #Tech",
      time: "6 giờ trước",
      likes: 31,
      comments: 15,
      shares: 7,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      author: "Phạm Thị D",
      avatar: "D",
      content:
        "Cuối tuần này đi du lịch cùng gia đình. Cảnh đẹp quá! #Travel #Weekend #Family",
      time: "8 giờ trước",
      likes: 42,
      comments: 18,
      shares: 9,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    },
    {
      id: 5,
      author: "Hoàng Văn E",
      avatar: "E",
      content:
        "Vừa hoàn thành khóa học về UI/UX Design. Thiết kế đẹp thật sự rất quan trọng! #Design #UI #UX",
      time: "10 giờ trước",
      likes: 28,
      comments: 14,
      shares: 6,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    },
  ];

  const handleCreatePost = (content) => {
    console.log("Tạo bài viết mới:", content);
    // Xử lý tạo bài viết ở đây
  };

  return (
    <div style={{ maxWidth: "60%", width: "100%", margin: "0 auto" }}>
      {/* Create Post Form */}
      <CreatePostForm onSubmit={handleCreatePost} />

      {/* Posts Feed */}
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;

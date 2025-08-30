import React from 'react';
import { Card, Space, Typography, Button, Divider, Alert } from 'antd';
import { MediaGrid } from './index';

const { Title, Text } = Typography;

const MediaGridDemo = () => {
  // Demo data với mixed media
  const demoPosts = [
    {
      id: 1,
      title: 'Chỉ 1 Ảnh',
      description: 'Layout: Full width với maxHeight cố định - Click để xem full size',
      imageUrls: ['/uploads/images/demo1.jpg'],
      videoUrls: []
    },
    {
      id: 2,
      title: 'Chỉ 1 Video',
      description: 'Layout: Full width với controls và maxHeight cố định - Click để xem full size',
      imageUrls: [],
      videoUrls: ['/uploads/videos/demo1.mp4']
    },
    {
      id: 3,
      title: '2 Ảnh',
      description: 'Layout: 2 cột bằng nhau, height cố định - Click từng ảnh để xem full size',
      imageUrls: ['/uploads/images/demo1.jpg', '/uploads/images/demo2.jpg'],
      videoUrls: []
    },
    {
      id: 4,
      title: '1 Video + 1 Ảnh',
      description: 'Layout: 2 cột bằng nhau, video có play button - Click để xem full size',
      imageUrls: ['/uploads/images/demo1.jpg'],
      videoUrls: ['/uploads/videos/demo1.mp4']
    },
    {
      id: 5,
      title: '2 Video + 2 Ảnh',
      description: 'Layout: Grid 2x2, tất cả đều có play button - Click để xem full size',
      imageUrls: ['/uploads/images/demo1.jpg', '/uploads/images/demo2.jpg'],
      videoUrls: ['/uploads/videos/demo1.mp4', '/uploads/videos/demo2.mp4']
    },
    {
      id: 6,
      title: '3 Media (Facebook Style)',
      description: 'Layout: 1 lớn bên trái (2/3 width), 2 nhỏ bên phải (1/3 width) - Click để xem full size',
      imageUrls: ['/uploads/images/demo1.jpg', '/uploads/images/demo2.jpg'],
      videoUrls: ['/uploads/videos/demo1.mp4']
    },
    {
      id: 7,
      title: 'Nhiều Ảnh (6 ảnh)',
      description: 'Layout: Grid 2x2 với overlay "+2" - Click để xem tất cả ảnh full size',
      imageUrls: [
        '/uploads/images/demo1.jpg',
        '/uploads/images/demo2.jpg',
        '/uploads/images/demo3.jpg',
        '/uploads/images/demo4.jpg',
        '/uploads/images/demo5.jpg',
        '/uploads/images/demo6.jpg'
      ],
      videoUrls: []
    },
    {
      id: 8,
      title: 'Mixed: 3 Video + 4 Ảnh',
      description: 'Layout: Grid 2x2 với overlay "+5" - Click để xem tất cả media full size',
      imageUrls: [
        '/uploads/images/demo1.jpg',
        '/uploads/images/demo2.jpg',
        '/uploads/images/demo3.jpg',
        '/uploads/images/demo4.jpg'
      ],
      videoUrls: [
        '/uploads/videos/demo1.mp4',
        '/uploads/videos/demo2.mp4',
        '/uploads/videos/demo3.mp4'
      ]
    }
  ];

  const [currentDemo, setCurrentDemo] = React.useState(0);

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demoPosts.length);
  };

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + demoPosts.length) % demoPosts.length);
  };

  const currentPost = demoPosts[currentDemo];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2}>MediaGrid Demo - Click to Expand + Modal</Title>
      <Text type="secondary">
        Test Facebook-style layout với tính năng click để xem full size
      </Text>

      <Alert
        message="Tính năng mới: Click to Expand + Modal"
        description="Bây giờ bạn có thể click vào bất kỳ ảnh/video nào để xem full size trong modal với navigation!"
        type="success"
        showIcon
        style={{ marginTop: '20px', marginBottom: '20px' }}
      />

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Space>
          <Button onClick={prevDemo}>← Trước</Button>
          <Text strong>
            {currentDemo + 1} / {demoPosts.length}: {currentPost.title}
          </Text>
          <Button onClick={nextDemo}>Tiếp →</Button>
        </Space>
      </div>

      <Card
        title={currentPost.title}
        style={{ width: '100%', marginBottom: '20px' }}
        extra={
          <Space>
            <Text type="secondary">Ảnh: {currentPost.imageUrls.length}</Text>
            <Text type="secondary">Video: {currentPost.videoUrls.length}</Text>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          {currentPost.description}
        </Text>

        <Divider />

        <MediaGrid
          imageUrls={currentPost.imageUrls}
          videoUrls={currentPost.videoUrls}
        />

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          <div><strong>Ảnh URLs:</strong> {currentPost.imageUrls.join(', ') || 'Không có'}</div>
          <div><strong>Video URLs:</strong> {currentPost.videoUrls.join(', ') || 'Không có'}</div>
        </div>
      </Card>

      <div style={{
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <Title level={4}>Tính năng Click to Expand + Modal:</Title>
        <ul>
          <li><strong>Click vào media:</strong> Mở modal full size</li>
          <li><strong>Navigation arrows:</strong> Chuyển qua lại giữa các media</li>
          <li><strong>Keyboard support:</strong> Arrow keys, Escape để đóng</li>
          <li><strong>Video controls:</strong> Video có controls đầy đủ trong modal</li>
          <li><strong>Counter:</strong> Hiển thị vị trí hiện tại (1/6)</li>
          <li><strong>Responsive:</strong> Modal tự động điều chỉnh theo màn hình</li>
          <li><strong>Touch support:</strong> Hoạt động tốt trên mobile</li>
        </ul>
      </div>

      <div style={{
        padding: '16px',
        background: '#e6f7ff',
        borderRadius: '8px',
        fontSize: '14px',
        marginTop: '16px'
      }}>
        <Title level={4}>Layout Rules:</Title>
        <ul>
          <li><strong>1 media:</strong> Full width, height tự động</li>
          <li><strong>2 media:</strong> 2 cột bằng nhau, height 200px</li>
          <li><strong>3 media:</strong> 1 lớn (2/3) + 2 nhỏ (1/3), height 250px</li>
          <li><strong>4 media:</strong> Grid 2x2, height 200px</li>
          <li><strong>5+ media:</strong> Grid 2x2 + overlay "+X", height 200px</li>
        </ul>
      </div>

      <div style={{
        padding: '16px',
        background: '#fff7e6',
        borderRadius: '8px',
        fontSize: '14px',
        marginTop: '16px'
      }}>
        <Title level={4}>Hướng dẫn sử dụng:</Title>
        <ol>
          <li><strong>Click vào bất kỳ ảnh/video nào</strong> để mở modal full size</li>
          <li><strong>Sử dụng navigation arrows</strong> để chuyển qua lại giữa các media</li>
          <li><strong>Dùng keyboard:</strong> ← → để navigate, Esc để đóng</li>
          <li><strong>Video controls:</strong> Play/pause, volume, fullscreen trong modal</li>
          <li><strong>Counter hiển thị:</strong> Vị trí hiện tại và tổng số media</li>
        </ol>
      </div>
    </div>
  );
};

export default MediaGridDemo;

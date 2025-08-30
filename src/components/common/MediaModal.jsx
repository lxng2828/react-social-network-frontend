import React, { useEffect, useState } from 'react';
import { Modal, Button, Space } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  CloseOutlined,
  PlayCircleOutlined 
} from '@ant-design/icons';
import { getMediaUrl } from '../../utils/mediaUtils';

const MediaModal = ({ 
  visible, 
  media, 
  mediaItems = [], 
  onClose, 
  onNavigate 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Reset current index khi modal mở
  useEffect(() => {
    if (visible && media) {
      setCurrentIndex(media.index || 0);
      setIsVideoPlaying(false);
    }
  }, [visible, media]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsVideoPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsVideoPlaying(false);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const currentMedia = mediaItems[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === mediaItems.length - 1;

  if (!currentMedia) return null;

  const renderMedia = () => {
    const mediaUrl = getMediaUrl(currentMedia.url);
    
    if (currentMedia.type === 'video') {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video
            src={mediaUrl}
            controls
            autoPlay={isVideoPlaying}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
          {!isVideoPlaying && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '64px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              pointerEvents: 'none'
            }}>
              <PlayCircleOutlined />
            </div>
          )}
        </div>
      );
    }

    return (
      <img
        src={mediaUrl}
        alt={`Media ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: 8
        }}
      />
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 20 }}
      bodyStyle={{ 
        padding: 0, 
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000'
      }}
      closeIcon={
        <Button
          type="text"
          icon={<CloseOutlined />}
          style={{
            color: 'white',
            fontSize: '18px',
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            border: 'none'
          }}
        />
      }
    >
      {/* Navigation Controls */}
      {mediaItems.length > 1 && (
        <>
          {/* Left Arrow */}
          {!isFirst && (
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                color: 'white',
                fontSize: '24px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '48px',
                height: '48px'
              }}
            />
          )}

          {/* Right Arrow */}
          {!isLast && (
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                color: 'white',
                fontSize: '24px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '48px',
                height: '48px'
              }}
            />
          )}

          {/* Counter */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            color: 'white',
            fontSize: '16px',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}>
            {currentIndex + 1} / {mediaItems.length}
          </div>
        </>
      )}

      {/* Media Content */}
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {renderMedia()}
      </div>

      {/* Bottom Info */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        color: 'white',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.5)',
        padding: '8px 16px',
        borderRadius: '20px'
      }}>
        {currentMedia.type === 'video' ? 'Video' : 'Ảnh'} {currentIndex + 1}
      </div>
    </Modal>
  );
};

export default MediaModal;

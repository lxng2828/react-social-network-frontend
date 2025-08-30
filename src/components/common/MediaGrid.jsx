import React, { useState } from 'react';
import { getMediaUrl } from '../../utils/mediaUtils';
import MediaModal from './MediaModal';

const MediaGrid = ({ imageUrls = [], videoUrls = [], style = {} }) => {
    // State cho modal
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Debug log
    console.log('MediaGrid props:', { imageUrls, videoUrls, style });

    // Đảm bảo arrays không null/undefined
    const safeImageUrls = Array.isArray(imageUrls) ? imageUrls : [];
    const safeVideoUrls = Array.isArray(videoUrls) ? videoUrls : [];

    const mediaItems = [
        ...safeImageUrls.map((url, index) => ({ url, type: 'image', index })),
        ...safeVideoUrls.map((url, index) => ({ url, type: 'video', index: index + safeImageUrls.length }))
    ];

    if (mediaItems.length === 0) {
        console.log('No media items to display');
        return null;
    }

    // Handle click vào media
    const handleMediaClick = (media, index) => {
        setSelectedMedia({ ...media, index });
        setShowModal(true);
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMedia(null);
    };

    // Facebook-style layout với maxWidth/maxHeight cố định
    const renderFacebookStyleLayout = () => {
        const maxWidth = 500; // Max width cố định cho post card
        const maxHeight = 400; // Max height cố định cho media grid

        switch (mediaItems.length) {
            case 1:
                return renderSingleMedia(mediaItems[0], maxWidth, maxHeight);
            case 2:
                return renderTwoMedia(mediaItems[0], mediaItems[1], maxWidth, maxHeight);
            case 3:
                return renderThreeMedia(mediaItems[0], mediaItems[1], mediaItems[2], maxWidth, maxHeight);
            case 4:
                return renderFourMedia(mediaItems[0], mediaItems[1], mediaItems[2], mediaItems[3], maxWidth, maxHeight);
            default:
                return renderMultipleMedia(mediaItems, maxWidth, maxHeight);
        }
    };

    // 1 media - full width với max height
    const renderSingleMedia = (media, maxWidth, maxHeight) => {
        const mediaUrl = getMediaUrl(media.url);

        if (media.type === 'video') {
            return (
                <div
                    style={{
                        width: '100%',
                        maxWidth: maxWidth,
                        height: 'auto',
                        maxHeight: maxHeight,
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleMediaClick(media, media.index)}
                >
                    <video
                        src={mediaUrl}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: maxHeight,
                            borderRadius: 8,
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '48px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        pointerEvents: 'none'
                    }}>
                        ▶️
                    </div>
                </div>
            );
        }

        return (
            <div
                style={{
                    width: '100%',
                    maxWidth: maxWidth,
                    height: 'auto',
                    maxHeight: maxHeight,
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
                onClick={() => handleMediaClick(media, media.index)}
            >
                <img
                    src={mediaUrl}
                    alt="Post media"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: maxHeight,
                        borderRadius: 8,
                        objectFit: 'cover'
                    }}
                />
            </div>
        );
    };

    // 2 media - 2 cột bằng nhau
    const renderTwoMedia = (media1, media2, maxWidth, maxHeight) => {
        const mediaUrl1 = getMediaUrl(media1.url);
        const mediaUrl2 = getMediaUrl(media2.url);
        const itemHeight = Math.min(maxHeight, 200);

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                width: '100%',
                maxWidth: maxWidth,
                height: itemHeight,
                borderRadius: 8,
                overflow: 'hidden'
            }}>
                {media1.type === 'video' ? (
                    <div
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media1, media1.index)}
                    >
                        <video
                            src={mediaUrl1}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '32px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            pointerEvents: 'none'
                        }}>
                            ▶️
                        </div>
                    </div>
                ) : (
                    <div
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media1, media1.index)}
                    >
                        <img
                            src={mediaUrl1}
                            alt="Post media 1"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}

                {media2.type === 'video' ? (
                    <div
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media2, media2.index)}
                    >
                        <video
                            src={mediaUrl2}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '32px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            pointerEvents: 'none'
                        }}>
                            ▶️
                        </div>
                    </div>
                ) : (
                    <div
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media2, media2.index)}
                    >
                        <img
                            src={mediaUrl2}
                            alt="Post media 2"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    // 3 media - Facebook style: 1 lớn bên trái, 2 nhỏ bên phải
    const renderThreeMedia = (media1, media2, media3, maxWidth, maxHeight) => {
        const mediaUrl1 = getMediaUrl(media1.url);
        const mediaUrl2 = getMediaUrl(media2.url);
        const mediaUrl3 = getMediaUrl(media3.url);
        const itemHeight = Math.min(maxHeight, 250);

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 2,
                width: '100%',
                maxWidth: maxWidth,
                height: itemHeight,
                borderRadius: 8,
                overflow: 'hidden'
            }}>
                {/* Ảnh/video chính - chiếm 2/3 width và full height */}
                <div
                    style={{ gridRow: 'span 2', cursor: 'pointer' }}
                    onClick={() => handleMediaClick(media1, media1.index)}
                >
                    {media1.type === 'video' ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                                src={mediaUrl1}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '40px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                pointerEvents: 'none'
                            }}>
                                ▶️
                            </div>
                        </div>
                    ) : (
                        <img
                            src={mediaUrl1}
                            alt="Post media 1"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </div>

                {/* 2 ảnh/video nhỏ bên phải */}
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMediaClick(media2, media2.index)}
                >
                    {media2.type === 'video' ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                                src={mediaUrl2}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '24px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                pointerEvents: 'none'
                            }}>
                                ▶️
                            </div>
                        </div>
                    ) : (
                        <img
                            src={mediaUrl2}
                            alt="Post media 2"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </div>

                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMediaClick(media3, media3.index)}
                >
                    {media3.type === 'video' ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                                src={mediaUrl3}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '24px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                pointerEvents: 'none'
                            }}>
                                ▶️
                            </div>
                        </div>
                    ) : (
                        <img
                            src={mediaUrl3}
                            alt="Post media 3"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </div>
            </div>
        );
    };

    // 4 media - Grid 2x2
    const renderFourMedia = (media1, media2, media3, media4, maxWidth, maxHeight) => {
        const mediaUrls = [media1, media2, media3, media4].map(m => getMediaUrl(m.url));
        const itemHeight = Math.min(maxHeight, 200);

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 2,
                width: '100%',
                maxWidth: maxWidth,
                height: itemHeight,
                borderRadius: 8,
                overflow: 'hidden'
            }}>
                {[media1, media2, media3, media4].map((media, index) => (
                    <div
                        key={index}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media, media.index)}
                    >
                        {media.type === 'video' ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <video
                                    src={mediaUrls[index]}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 4,
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'white',
                                    fontSize: '20px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    pointerEvents: 'none'
                                }}>
                                    ▶️
                                </div>
                            </div>
                        ) : (
                            <img
                                src={mediaUrls[index]}
                                alt={`Post media ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // 5+ media - Grid 2x2 với overlay "+X"
    const renderMultipleMedia = (mediaItems, maxWidth, maxHeight) => {
        const firstFour = mediaItems.slice(0, 4);
        const remaining = mediaItems.length - 4;
        const itemHeight = Math.min(maxHeight, 200);

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 2,
                width: '100%',
                maxWidth: maxWidth,
                height: itemHeight,
                borderRadius: 8,
                overflow: 'hidden'
            }}>
                {firstFour.map((media, index) => (
                    <div
                        key={index}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => handleMediaClick(media, media.index)}
                    >
                        {media.type === 'video' ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <video
                                    src={getMediaUrl(media.url)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 4,
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'white',
                                    fontSize: '20px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    pointerEvents: 'none'
                                }}>
                                    ▶️
                                </div>
                            </div>
                        ) : (
                            <img
                                src={getMediaUrl(media.url)}
                                alt={`Post media ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover'
                                }}
                            />
                        )}

                        {/* Overlay cho ảnh cuối cùng nếu có nhiều hơn 4 ảnh */}
                        {index === 3 && remaining > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                +{remaining}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div style={{
                marginBottom: 16,
                width: '100%',
                maxWidth: '100%',
                ...style
            }}>
                {renderFacebookStyleLayout()}
            </div>

            {/* Media Modal */}
            <MediaModal
                visible={showModal}
                media={selectedMedia}
                mediaItems={mediaItems}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default MediaGrid;

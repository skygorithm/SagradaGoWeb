import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import { CloseOutlined, ExpandOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import facadeImage from '../assets/360facade.jpg';
import altarImage from '../assets/360altar.jpg';
import pewsImage from '../assets/360pews.jpg';
import '../styles/virtualTour.css';

export default function VirtualTour({ isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [translateX, setTranslateX] = useState(-33.33); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageContainerRef = useRef(null);
  const isMouseDownRef = useRef(false);

  const tourImages = [
    {
      id: 'facade',
      name: 'Facade',
      image: facadeImage,
      description: 'The magnificent facade of the Sagrada Familia Parish showcases stunning architectural details and intricate designs. This grand entrance welcomes visitors with its beautiful stonework and traditional church architecture.',
    },
    {
      id: 'altar',
      name: 'Altar',
      image: altarImage,
      description: 'The sacred altar is the heart of our parish, where the Holy Eucharist is celebrated. This sacred space is beautifully adorned and serves as the focal point for worship and prayer, creating a reverent atmosphere for all who visit.',
    },
    {
      id: 'pews',
      name: 'Pews',
      image: pewsImage,
      description: 'The pews area provides a peaceful space for congregation members to gather for Mass and prayer. The carefully arranged seating creates a sense of community and togetherness during worship services.',
    },
  ];

  const currentImage = tourImages[currentImageIndex];

  useEffect(() => {
    setTranslateX(-33.33);
    setImageLoaded(false);
  }, [currentImageIndex]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    isMouseDownRef.current = true;
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isMouseDownRef.current) return;
    e.preventDefault();

    const deltaX = dragStart - e.clientX;
    const sensitivity = 0.3; 
    const newTranslateX = translateX + (deltaX * sensitivity);
    
    const clampedX = Math.max(-66.66, Math.min(0, newTranslateX));
    setTranslateX(clampedX);
    setDragStart(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isMouseDownRef.current = false;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const deltaX = dragStart - e.touches[0].clientX;
    const sensitivity = 0.3;
    const newTranslateX = translateX + (deltaX * sensitivity);
    
    const clampedX = Math.max(-66.66, Math.min(0, newTranslateX));
    setTranslateX(clampedX);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={isFullscreen ? '100%' : 900}
        style={{ 
          top: isFullscreen ? 0 : 20,
          maxWidth: isFullscreen ? '100vw' : 900,
          paddingBottom: 0,
        }}
        className={`virtual-tour-modal ${isFullscreen ? 'fullscreen' : ''}`}
        closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '24px', zIndex: 1001 }} />}
        styles={{
          body: { padding: 0, height: isFullscreen ? '100vh' : 'auto', maxHeight: isFullscreen ? '100vh' : 'none' },
          content: { backgroundColor: '#000', maxHeight: isFullscreen ? '100vh' : 'none' },
        }}
        maskStyle={{ backgroundColor: isFullscreen ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.45)' }}
      >
        <div className="virtual-tour-container">
          <div className="virtual-tour-header">
            <div className="virtual-tour-title">
              <h2>{currentImage.name}</h2>
              <p>Virtual Tour - 360° Experience</p>
            </div>
            <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
              <ExpandOutlined />
            </button>
          </div>

          <div
            className="virtual-tour-image-container"
            ref={imageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {!imageLoaded && (
              <div className="virtual-tour-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            )}
            <div
              className="virtual-tour-panorama-wrapper"
              style={{
                transform: `translateX(${translateX}%)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <img
                src={currentImage.image}
                alt={currentImage.name}
                className="virtual-tour-panorama-image"
                onLoad={handleImageLoad}
                draggable={false}
              />
            </div>
            <div className="virtual-tour-instruction">
              <span>👆 Drag left or right to explore the 360° view</span>
            </div>
          </div>

          <div className="virtual-tour-description">
            <p>{currentImage.description}</p>
          </div>

          <div className="virtual-tour-controls">
            <button className="virtual-tour-nav-btn" onClick={handlePrevImage}>
              <LeftOutlined />
              <span>Previous</span>
            </button>

            <div className="virtual-tour-dots">
              {tourImages.map((_, index) => (
                <button
                  key={index}
                  className={`virtual-tour-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            <button className="virtual-tour-nav-btn" onClick={handleNextImage}>
              <span>Next</span>
              <RightOutlined />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}


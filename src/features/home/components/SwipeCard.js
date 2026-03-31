import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeCard = ({ children, currentIndex, totalCount, onPrev, onNext, className = '' }) => {
  const [swipeState, setSwipeState] = useState({
    isDragging: false,
    startX: 0,
    currentX: 0,
    dragOffset: 0,
  });

  const handleClickNavigation = (e) => {
    if (totalCount <= 1) return;
    if (swipeState.isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const cardWidth = rect.width;

    if (clickX < cardWidth / 3) {
      onPrev();
    } else if (clickX > (cardWidth * 2) / 3) {
      onNext();
    }
  };

  const handleTouchStart = (e) => {
    if (totalCount <= 1) return;
    setSwipeState((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
    }));
  };

  const handleTouchMove = (e) => {
    if (!swipeState.isDragging || totalCount <= 1) return;
    const currentX = e.touches[0].clientX;
    setSwipeState((prev) => ({
      ...prev,
      currentX,
      dragOffset: currentX - prev.startX,
    }));
  };

  const handleTouchEnd = () => {
    if (!swipeState.isDragging || totalCount <= 1) return;

    const threshold = 50;
    const offset = swipeState.currentX - swipeState.startX;

    if (Math.abs(offset) > threshold) {
      if (offset > 0) onPrev();
      else onNext();
    }

    setSwipeState((prev) => ({
      ...prev,
      isDragging: false,
      dragOffset: 0,
      startX: 0,
      currentX: 0,
    }));
  };

  const handleMouseDown = (e) => {
    if (totalCount <= 1) return;
    setSwipeState((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.clientX,
      currentX: e.clientX,
    }));
  };

  const handleMouseMove = (e) => {
    if (!swipeState.isDragging || totalCount <= 1) return;
    const currentX = e.clientX;
    setSwipeState((prev) => ({
      ...prev,
      currentX,
      dragOffset: currentX - prev.startX,
    }));
  };

  const handleMouseUp = () => {
    if (!swipeState.isDragging || totalCount <= 1) return;

    const threshold = 50;
    const offset = swipeState.currentX - swipeState.startX;

    if (Math.abs(offset) > threshold) {
      if (offset > 0) onPrev();
      else onNext();
    }

    setSwipeState((prev) => ({
      ...prev,
      isDragging: false,
      dragOffset: 0,
      startX: 0,
      currentX: 0,
    }));
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 min-h-[200px] border border-gray-100 relative cursor-grab ${
        swipeState.isDragging ? 'cursor-grabbing' : ''
      } transition-transform duration-200 select-none ${className}`}
      style={{
        transform: `translateX(${swipeState.dragOffset}px)`,
        opacity: swipeState.isDragging ? 0.9 : 1,
      }}
      onClick={handleClickNavigation}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {totalCount > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-xs text-gray-600">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>
      )}

      {totalCount > 1 && !swipeState.isDragging && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <ChevronLeft size={12} />
            <span>옆으로 넘기기</span>
            <ChevronRight size={12} />
          </div>
        </div>
      )}

      <div className="mt-8 mb-6">{children}</div>
    </div>
  );
};

export default SwipeCard;

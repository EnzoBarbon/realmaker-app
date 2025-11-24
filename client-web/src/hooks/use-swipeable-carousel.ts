import { useState, useRef, TouchEvent, MouseEvent } from 'react';

interface UseSwipeableCarouselOptions {
  totalImages: number;
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  threshold?: number;
}

export function useSwipeableCarousel({
  totalImages,
  currentIndex,
  onIndexChange,
  threshold = 0.3
}: UseSwipeableCarouselOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const diff = clientX - startX;
    const containerWidth = containerRef.current.offsetWidth;
    
    // Limitar el arrastre a ±1 imagen
    const maxDrag = containerWidth;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    
    setDragOffset(limitedDiff);
  };

  const handleEnd = () => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const dragPercentage = Math.abs(dragOffset) / containerWidth;
    
    if (dragPercentage > threshold) {
      // Cambiar de imagen
      if (dragOffset > 0 && currentIndex > 0) {
        // Swipe derecha - imagen anterior
        onIndexChange(currentIndex - 1);
      } else if (dragOffset < 0 && currentIndex < totalImages - 1) {
        // Swipe izquierda - siguiente imagen
        onIndexChange(currentIndex + 1);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch events
  const onTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Mouse events (opcional, para desktop)
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  return {
    containerRef,
    isDragging,
    dragOffset,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
}

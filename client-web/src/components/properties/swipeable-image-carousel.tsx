import { useSwipeableCarousel } from '../../hooks/use-swipeable-carousel';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SwipeableImageCarouselProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  alt: string;
  className?: string;
  showIndicators?: boolean;
  children?: React.ReactNode;
}

export function SwipeableImageCarousel({
  images,
  currentIndex,
  onIndexChange,
  alt,
  className = '',
  showIndicators = true,
  children
}: SwipeableImageCarouselProps) {
  const { containerRef, isDragging, dragOffset, handlers } = useSwipeableCarousel({
    totalImages: images.length,
    currentIndex,
    onIndexChange,
    threshold: 0.25
  });

  // Calcular el offset total (posición base + drag)
  const baseOffset = -currentIndex * 100;
  const dragPercentage = containerRef.current 
    ? (dragOffset / containerRef.current.offsetWidth) * 100 
    : 0;
  const totalOffset = baseOffset + dragPercentage;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      {...handlers}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {/* Contenedor de imágenes deslizables */}
      <div 
        className="flex h-full"
        style={{
          transform: `translateX(${totalOffset}%)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full"
          >
            <ImageWithFallback
              src={image}
              alt={`${alt} - Imagen ${index + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Contenido superpuesto (badges, botones, etc.) */}
      {children}

      {/* Indicadores de puntos */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-2' : 'bg-white/50 w-1'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
import { useSwipeableCarousel } from '../../hooks/use-swipeable-carousel';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SwipeableLightboxCarouselProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  alt: string;
  children?: React.ReactNode;
}

export function SwipeableLightboxCarousel({
  images,
  currentIndex,
  onIndexChange,
  alt,
  children
}: SwipeableLightboxCarouselProps) {
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
      className="relative w-full h-full"
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
            className="flex-shrink-0 w-full h-full flex items-center justify-center"
          >
            <ImageWithFallback
              src={image}
              alt={`${alt} - Imagen ${index + 1}`}
              className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Contenido superpuesto (marca de agua, etc.) */}
      {children}
    </div>
  );
}

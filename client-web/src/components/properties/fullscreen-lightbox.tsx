import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ScrollArea } from "../ui/scroll-area";
import { SwipeableLightboxCarousel } from './swipeable-lightbox-carousel';

interface FullscreenLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
  watermark?: {
    enabled: boolean;
    logo?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    customPosition?: { x: number; y: number };
    opacity?: number;
    rotation?: number;
    width?: number;
  };
}

export function FullscreenLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  title = 'Galería de imágenes',
  watermark
}: FullscreenLightboxProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  // Manejo de teclas
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} - Galería de imágenes`}
    >
      {/* Header fijo superior */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          {/* Contador */}
          <div className="text-white">
            <span className="text-sm sm:text-base">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenedor principal de imagen */}
      <div 
        ref={imageContainerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          paddingTop: '64px',  
          paddingBottom: images.length > 1 ? '120px' : '64px'
        }}
      >
        <div className="relative w-full h-full px-3 sm:px-16">
          <SwipeableLightboxCarousel
            images={images}
            currentIndex={currentIndex}
            onIndexChange={onIndexChange}
            alt={title}
          >
            {/* Marca de agua */}
            {watermark?.enabled && watermark?.logo && (
              <div 
                className="absolute pointer-events-none z-10"
                style={{
                  left: watermark.customPosition ? `${watermark.customPosition.x}%` :
                    watermark.position === 'top-left' || watermark.position === 'bottom-left' ? '8%' :
                    watermark.position === 'top-right' || watermark.position === 'bottom-right' ? '92%' : '50%',
                  top: watermark.customPosition ? `${watermark.customPosition.y}%` :
                    watermark.position === 'top-left' || watermark.position === 'top-right' ? '12%' :
                    watermark.position === 'bottom-left' || watermark.position === 'bottom-right' ? '88%' : '50%',
                  transform: `translate(-50%, -50%) rotate(${watermark.rotation || 0}deg)`,
                  opacity: watermark.opacity || 0.7,
                }}
              >
                <img 
                  src={watermark.logo} 
                  alt="Logo de la agencia" 
                  className="h-auto object-contain drop-shadow-lg"
                  style={{ width: watermark.width ? `${watermark.width}px` : 'auto' }}
                />
              </div>
            )}
          </SwipeableLightboxCarousel>
        </div>
      </div>

      {/* Controles de navegación - Solo si hay más de 1 imagen */}
      {images.length > 1 && (
        <>
          {/* Botón anterior - Desktop */}
          <button
            onClick={prevImage}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 items-center justify-center shadow-2xl transition-all"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          {/* Botón siguiente - Desktop */}
          <button
            onClick={nextImage}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 items-center justify-center shadow-2xl transition-all"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Botones móvil - laterales discretos */}
          <button
            onClick={prevImage}
            className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg transition-all active:scale-95"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextImage}
            className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg transition-all active:scale-95"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Footer - Desktop: Miniaturas | Móvil: Indicadores de puntos */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-t border-white/10">
          {/* Desktop - Miniaturas */}
          <div className="hidden sm:block p-4">
            <ScrollArea className="w-full">
              <div className="flex gap-2 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onIndexChange(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-primary scale-110'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Móvil - Indicadores de puntos */}
          <div className="sm:hidden py-4 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

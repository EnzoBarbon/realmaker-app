import { FullscreenLightbox } from './fullscreen-lightbox';

interface ImageGalleryViewerProps {
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

export function ImageGalleryViewer(props: ImageGalleryViewerProps) {
  return <FullscreenLightbox {...props} />;
}

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreVertical, Edit2, Sparkles } from 'lucide-react';

interface PhotoOptionsPopoverProps {
  onEditPhotos: () => void;
  onConfigureWatermark: () => void;
  watermarkActive: boolean;
  isMobile?: boolean;
}

export function PhotoOptionsPopover({ 
  onEditPhotos, 
  onConfigureWatermark, 
  watermarkActive,
  isMobile = false 
}: PhotoOptionsPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleEditPhotos = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditPhotos();
    setOpen(false);
  };

  const handleWatermark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfigureWatermark();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-3 right-3 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-md text-gray-700 hover:text-gray-900 rounded-full transition-all z-20 ${
            isMobile ? 'w-9 h-9' : 'w-10 h-10'
          } ${open ? 'bg-white shadow-md ring-2 ring-primary/20' : 'shadow-sm'}`}
          aria-label="Opciones de fotos"
        >
          <MoreVertical className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className={`p-0 bg-white border-gray-200 ${isMobile ? 'w-[calc(100vw-2rem)]' : 'w-72'}`}
        sideOffset={8}
      >
        <div className="space-y-0.5 p-1.5">
          {/* Opción: Editar fotos */}
          <button
            onClick={handleEditPhotos}
            className={`w-full flex items-center gap-3 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors ${
              isMobile ? 'px-3 py-2.5' : 'px-3 py-2.5'
            }`}
          >
            <div className={`flex-shrink-0 rounded-md bg-blue-50 flex items-center justify-center ${
              isMobile ? 'w-9 h-9' : 'w-10 h-10'
            }`}>
              <Edit2 className={`text-blue-600 ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className={`text-gray-900 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                Editar fotos
              </div>
              <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'} mt-0.5`}>
                Añade, elimina o reordena imágenes
              </div>
            </div>
          </button>

          {/* Opción: Marca de agua */}
          <button
            onClick={handleWatermark}
            className={`w-full flex items-center gap-3 rounded-md hover:bg-amber-50 active:bg-amber-100 transition-colors ${
              isMobile ? 'px-3 py-2.5' : 'px-3 py-2.5'
            }`}
          >
            <div className={`flex-shrink-0 rounded-md flex items-center justify-center transition-colors ${
              isMobile ? 'w-9 h-9' : 'w-10 h-10'
            } ${
              watermarkActive 
                ? 'bg-primary text-white' 
                : 'bg-amber-50'
            }`}>
              <Sparkles className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} ${watermarkActive ? 'text-white' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className={`text-gray-900 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                  Marca de agua
                </span>
                {watermarkActive && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-medium">
                    ON
                  </span>
                )}
              </div>
              <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'} mt-0.5`}>
                Protege tus imágenes con tu logo
              </div>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
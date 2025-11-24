import { useState, useRef, useEffect } from 'react';
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  RotateCw,
  Move,
  Upload,
  Maximize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface Property {
  id: string;
  images: string[];
  watermarkEnabled?: boolean;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermarkSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
  watermarkOpacity?: number;
  watermarkRotation?: number;
  watermarkCustomPosition?: { x: number; y: number };
  watermarkWidth?: number;
  watermarkImage?: string;
}

interface WatermarkEditorFullScreenProps {
  property: Property;
  agencyLogo: string;
  watermarkEnabled: boolean;
  watermarkPosition: Property['watermarkPosition'];
  watermarkSize: Property['watermarkSize'];
  watermarkOpacity: number;
  watermarkRotation: number;
  watermarkCustomPosition: { x: number; y: number };
  watermarkWidth: number;
  onClose: () => void;
  onSave: (settings: {
    watermarkEnabled: boolean;
    watermarkPosition: Property['watermarkPosition'];
    watermarkSize: Property['watermarkSize'];
    watermarkOpacity: number;
    watermarkRotation: number;
    watermarkCustomPosition?: { x: number; y: number };
    watermarkWidth?: number;
    watermarkImage?: string;
  }) => void;
}

export function WatermarkEditorFullScreen({
  property,
  agencyLogo,
  watermarkEnabled: initialEnabled,
  watermarkPosition: initialPosition,
  watermarkSize: initialSize,
  watermarkOpacity: initialOpacity,
  watermarkRotation: initialRotation,
  watermarkCustomPosition: initialCustomPosition,
  watermarkWidth: initialWidth,
  onClose,
  onSave
}: WatermarkEditorFullScreenProps) {
  const [position, setPosition] = useState<Property['watermarkPosition']>(initialPosition);
  const [size, setSize] = useState<Property['watermarkSize']>(initialSize);
  const [opacity, setOpacity] = useState(initialOpacity);
  const [rotation, setRotation] = useState(initialRotation);
  
  // Estado para la imagen de marca de agua seleccionada
  const [selectedWatermark, setSelectedWatermark] = useState<string>(
    property.watermarkImage || agencyLogo || ''
  );
  const [customWatermark, setCustomWatermark] = useState<string>('');
  
  // Estado para vista ampliada
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  
  // Controles interactivos
  const [logoWidth, setLogoWidth] = useState(initialWidth || 150);
  const [logoPosition, setLogoPosition] = useState(
    initialCustomPosition || { x: 50, y: 50 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, x: 0, y: 0, centerX: 0, centerY: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar tamaño basado en logoWidth
  useEffect(() => {
    if (logoWidth < 80) setSize('xs');
    else if (logoWidth < 120) setSize('s');
    else if (logoWidth < 180) setSize('m');
    else if (logoWidth < 250) setSize('l');
    else setSize('xl');
  }, [logoWidth]);

  // Manejar eventos globales de mouse
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (isDragging && !isResizing) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setLogoPosition({
          x: Math.max(5, Math.min(95, x - dragStart.x)),
          y: Math.max(5, Math.min(95, y - dragStart.y))
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const direction = deltaX + deltaY > 0 ? 1 : -1;
        const change = distance * direction * 1.5;
        const newWidth = Math.max(40, Math.min(800, resizeStart.width + change));
        setLogoWidth(Math.round(newWidth));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, logoPosition]);

  // Manejar eventos globales de touch
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      
      if (isDragging && !isResizing) {
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setLogoPosition({
          x: Math.max(5, Math.min(95, x - dragStart.x)),
          y: Math.max(5, Math.min(95, y - dragStart.y))
        });
      } else if (isResizing) {
        const centerX = (logoPosition.x / 100) * rect.width;
        const centerY = (logoPosition.y / 100) * rect.height;
        
        const initialDistance = Math.sqrt(
          Math.pow(resizeStart.x - centerX, 2) + 
          Math.pow(resizeStart.y - centerY, 2)
        );
        
        const currentDistance = Math.sqrt(
          Math.pow(touch.clientX - centerX, 2) + 
          Math.pow(touch.clientY - centerY, 2)
        );
        
        const scale = currentDistance / initialDistance;
        const newWidth = Math.max(40, Math.min(800, resizeStart.width * scale));
        setLogoWidth(Math.round(newWidth));
      }
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, logoPosition, logoWidth]);

  const handleSave = () => {
    // Si hay una marca de agua seleccionada, watermarkEnabled es true, si no, false
    onSave({
      watermarkEnabled: selectedWatermark !== '',
      watermarkPosition: position,
      watermarkSize: size,
      watermarkOpacity: opacity,
      watermarkRotation: rotation,
      watermarkCustomPosition: logoPosition,
      watermarkWidth: logoWidth,
      watermarkImage: selectedWatermark,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Manejar subida de imagen personalizada
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setCustomWatermark(imageUrl);
        setSelectedWatermark(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    // Resetear el input para permitir subir el mismo archivo de nuevo
    if (e.target) {
      e.target.value = '';
    }
  };

  // Arrastrar logo
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || isResizing) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDragStart({ x: x - logoPosition.x, y: y - logoPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    if (isDragging && !isResizing) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLogoPosition({
        x: Math.max(5, Math.min(95, x - dragStart.x)),
        y: Math.max(5, Math.min(95, y - dragStart.y))
      });
    } else if (isResizing) {
      const centerX = (logoPosition.x / 100) * rect.width;
      const centerY = (logoPosition.y / 100) * rect.height;
      
      const initialDistance = Math.sqrt(
        Math.pow(resizeStart.x - centerX, 2) + 
        Math.pow(resizeStart.y - centerY, 2)
      );
      
      const currentDistance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + 
        Math.pow(e.clientY - centerY, 2)
      );
      
      const scale = currentDistance / initialDistance;
      const newWidth = Math.max(40, Math.min(800, resizeStart.width * scale));
      setLogoWidth(Math.round(newWidth));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || isResizing) return;
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setDragStart({ x: x - logoPosition.x, y: y - logoPosition.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    
    if (isDragging && !isResizing) {
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setLogoPosition({
        x: Math.max(5, Math.min(95, x - dragStart.x)),
        y: Math.max(5, Math.min(95, y - dragStart.y))
      });
    } else if (isResizing) {
      const centerX = (logoPosition.x / 100) * rect.width;
      const centerY = (logoPosition.y / 100) * rect.height;
      
      const initialDistance = Math.sqrt(
        Math.pow(resizeStart.x - centerX, 2) + 
        Math.pow(resizeStart.y - centerY, 2)
      );
      
      const currentDistance = Math.sqrt(
        Math.pow(touch.clientX - centerX, 2) + 
        Math.pow(touch.clientY - centerY, 2)
      );
      
      const scale = currentDistance / initialDistance;
      const newWidth = Math.max(40, Math.min(800, resizeStart.width * scale));
      setLogoWidth(Math.round(newWidth));
    }
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setResizeStart({
      width: logoWidth,
      x: clientX,
      y: clientY,
      centerX: logoPosition.x,
      centerY: logoPosition.y
    });
  };

  const applyQuickPosition = (pos: Property['watermarkPosition']) => {
    setPosition(pos);
    const positions = {
      'top-left': { x: 15, y: 15 },
      'top-right': { x: 85, y: 15 },
      'center': { x: 50, y: 50 },
      'bottom-left': { x: 15, y: 85 },
      'bottom-right': { x: 85, y: 85 }
    };
    setLogoPosition(positions[pos] || { x: 50, y: 50 });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-1 lg:gap-2 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
              <h1 className="text-base lg:text-lg text-gray-900 truncate">
                <span className="sm:hidden">Editor</span>
                <span className="hidden sm:inline">Editor de marca de agua</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-1 lg:gap-2"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 gap-1 lg:gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Guardar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 pb-12">
          <div className="space-y-4 lg:space-y-6">
            {/* Selector de marca de agua - Todo en una vista */}
            <div className="p-4 lg:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base text-gray-900 mb-4">Selecciona la marca de agua</h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                {/* Sin marca de agua - Botón destacado */}
                <button
                  onClick={() => setSelectedWatermark('')}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedWatermark === ''
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title="Sin marca de agua"
                >
                  <div className="w-full h-full bg-gray-50 rounded flex flex-col items-center justify-center gap-1">
                    <X className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-600">Sin marca</span>
                  </div>
                </button>

                {/* Imagen personalizada subida */}
                {customWatermark && (
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedWatermark(customWatermark)}
                      className={`w-full aspect-square p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedWatermark === customWatermark
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title="Imagen personalizada"
                    >
                      <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
                        <img 
                          src={customWatermark} 
                          alt="Imagen personalizada" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setCustomWatermark('');
                        setSelectedWatermark('');
                      }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Eliminar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Logo de agencia */}
                {agencyLogo && (
                  <button
                    onClick={() => setSelectedWatermark(agencyLogo)}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedWatermark === agencyLogo
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title="Tu Logo"
                  >
                    <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
                      <img 
                        src={agencyLogo} 
                        alt="Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* Botón subir imagen */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1"
                  title="Subir imagen"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-gray-500">Subir</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Vista previa */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-100 px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs lg:text-sm text-gray-700 flex items-center gap-2">
                        <Move className="h-4 w-4 text-primary flex-shrink-0" />
                        <span><strong>Arrastra</strong> la marca de agua o <strong>estira</strong> desde las esquinas</span>
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                          className="h-7 w-7 p-0"
                          title="Alejar zoom"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600 min-w-[3rem] text-center">{previewZoom}%</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                          className="h-7 w-7 p-0"
                          title="Acercar zoom"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFullscreen(true)}
                          className="h-7 w-7 p-0"
                          title="Ver en grande"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-auto">
                    <div 
                      ref={containerRef}
                      className="relative bg-gray-900 aspect-video select-none touch-none transition-transform origin-top-left"
                      style={{ 
                        cursor: isDragging ? 'grabbing' : isResizing ? 'nwse-resize' : 'default',
                        transform: `scale(${previewZoom / 100})`,
                        transformOrigin: 'top left',
                        width: `${100 * (100 / previewZoom)}%`,
                        height: `${100 * (100 / previewZoom)}%`
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleMouseUp}
                    >
                      {property.images[0] && (
                        <img 
                          src={property.images[0]} 
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      )}
                      
                      {selectedWatermark && (
                        <div
                          ref={logoRef}
                          className="absolute group"
                          style={{
                            left: `${logoPosition.x}%`,
                            top: `${logoPosition.y}%`,
                            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                            width: `${logoWidth}px`,
                            cursor: 'move',
                          }}
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleTouchStart}
                        >
                          <div className="relative" style={{ opacity: opacity }}>
                            <img 
                              src={selectedWatermark} 
                              alt="Marca de agua"
                              className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none"
                              draggable={false}
                            />
                            
                            <div className="absolute inset-0 pointer-events-none">
                              <div
                                className="absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-auto cursor-nwse-resize hover:scale-110 transition-transform"
                                onMouseDown={handleResizeStart}
                                onTouchStart={handleResizeStart}
                              />
                              <div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-auto cursor-nesw-resize hover:scale-110 transition-transform"
                                onMouseDown={handleResizeStart}
                                onTouchStart={handleResizeStart}
                              />
                              <div
                                className="absolute -bottom-2 -left-2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-auto cursor-nesw-resize hover:scale-110 transition-transform"
                                onMouseDown={handleResizeStart}
                                onTouchStart={handleResizeStart}
                              />
                              <div
                                className="absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-auto cursor-nwse-resize hover:scale-110 transition-transform"
                                onMouseDown={handleResizeStart}
                                onTouchStart={handleResizeStart}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="space-y-4">
                {/* Posiciones rápidas */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <label className="text-sm text-gray-900 mb-3 block">
                    <strong>Posiciones rápidas</strong>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'top-left', label: '↖', title: 'Superior izquierda' },
                      { value: 'top-right', label: '↗', title: 'Superior derecha' },
                      { value: 'center', label: '⊙', title: 'Centro' },
                      { value: 'bottom-left', label: '↙', title: 'Inferior izquierda' },
                      { value: 'bottom-right', label: '↘', title: 'Inferior derecha' },
                    ].map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => applyQuickPosition(pos.value as Property['watermarkPosition'])}
                        className={`p-3 text-xl rounded-lg border-2 transition-all active:scale-95 ${
                          position === pos.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                        title={pos.title}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacidad */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm text-gray-900">
                      <strong>Opacidad</strong>
                    </label>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(opacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[opacity * 100]}
                    onValueChange={(value) => setOpacity(value[0] / 100)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Transparente</span>
                    <span>Opaco</span>
                  </div>
                </div>

                {/* Rotación */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm text-gray-900 flex items-center gap-2">
                      <RotateCw className="h-4 w-4 text-primary" />
                      <strong>Rotación</strong>
                    </label>
                    <span className="text-sm font-medium text-primary">
                      {rotation}°
                    </span>
                  </div>
                  <Slider
                    value={[rotation]}
                    onValueChange={(value) => setRotation(value[0])}
                    min={-180}
                    max={180}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>-180°</span>
                    <span>0°</span>
                    <span>180°</span>
                  </div>
                </div>

                {/* Botón reset */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSize('m');
                    setLogoWidth(150);
                    setPosition('bottom-right');
                    setLogoPosition({ x: 85, y: 85 });
                    setOpacity(0.7);
                    setRotation(0);
                  }}
                  className="w-full"
                >
                  Restaurar valores predeterminados
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vista ampliada */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col">
          {/* Header del modal ampliado */}
          <div className="bg-black/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
            <h2 className="text-white">Vista ampliada</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Imagen ampliada con marca de agua */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div className="relative max-w-full max-h-full">
              <img 
                src={property.images[0]} 
                alt="Vista ampliada"
                className="max-w-full max-h-full object-contain"
              />
              
              {selectedWatermark && (
                <div
                  className="absolute"
                  style={{
                    left: `${logoPosition.x}%`,
                    top: `${logoPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    width: `${logoWidth}px`,
                    opacity: opacity
                  }}
                >
                  <img 
                    src={selectedWatermark} 
                    alt="Marca de agua"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controles inferiores */}
          <div className="bg-black/50 backdrop-blur-sm px-4 py-3 flex items-center justify-center gap-4">
            <span className="text-white text-sm">Presiona ESC o haz clic en X para cerrar</span>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../ui/dialog";
import { Input } from "../ui/input";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  LinkIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Loader2,
  CheckCircle2,
  Home,
  ExternalLink,
  AlertCircle,
  Search,
  AlertTriangle,
  Plus
} from "lucide-react";
import { toast } from 'sonner@2.0.3';

interface Property {
  id: string;
  title: string;
  price: number;
  pricePerM2: number;
  location: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'penthouse' | 'duplex' | 'studio';
  operation: 'sale' | 'rent';
  constructedArea: number;
  usableArea: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  yearBuilt?: number;
  condition?: 'new' | 'good' | 'to-renovate';
  orientation?: string;
  energyCertification?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'pending';
  hasElevator?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  heatingType?: string;
  hasParking?: boolean;
  hasStorage?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasGarden?: boolean;
  hasPool?: boolean;
  hasBuiltInWardrobes?: boolean;
  isFurnished?: boolean;
  isAccessible?: boolean;
  description?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    other?: string;
  };
  images: string[];
  status: 'available' | 'unavailable';
  updatedAt: string;
  idealistaUrl?: string;
}

interface AddPropertyByLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (property: Property) => void;
  onOpenManual?: () => void;
}

type Platform = 'idealista' | 'fotocasa' | 'manual';
type Step = 'select-platform' | 'enter-url' | 'loading' | 'preview' | 'error';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export function AddPropertyByLinkDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  onOpenManual
}: AddPropertyByLinkDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-platform');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [propertyUrl, setPropertyUrl] = useState('');
  const [foundProperty, setFoundProperty] = useState<Property | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [willFail, setWillFail] = useState(false); // Para detectar si va a fallar

  // Simular búsqueda de propiedad
  const handleSearchProperty = async () => {
    setCurrentStep('loading');
    setLoadingProgress(0);
    
    // Detectar si va a fallar antes de empezar
    const isError = propertyUrl.toLowerCase().includes('error');
    setWillFail(isError);

    // Simulación de progreso
    const progressSteps = [
      { progress: 20, message: 'Conectando con el portal...' },
      { progress: 40, message: 'Analizando la URL...' },
      { progress: 60, message: 'Extrayendo información...' },
      { progress: 80, message: 'Procesando imágenes...' },
      { progress: 100, message: 'Completado' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingProgress(step.progress);
    }

    // Si va a fallar, mostrar el error
    if (isError) {
      setCurrentStep('error');
      setErrorMessage('No se pudo encontrar la propiedad');
      toast.error('No se encontró la propiedad en el enlace proporcionado');
      return;
    }

    // Simular datos encontrados (solo si NO hay error)
    const mockProperty: Property = {
      id: `PROP-${Date.now()}`,
      title: 'Apartamento moderno en el centro',
      price: 350000,
      pricePerM2: 3500,
      location: 'Centro, Madrid',
      propertyType: 'apartment',
      operation: 'sale',
      constructedArea: 100,
      usableArea: 90,
      bedrooms: 2,
      bathrooms: 2,
      floor: '3º',
      yearBuilt: 2020,
      condition: 'new',
      orientation: 'Sur',
      energyCertification: 'A',
      hasElevator: true,
      hasAirConditioning: true,
      hasHeating: true,
      heatingType: 'Central',
      hasParking: true,
      hasStorage: false,
      hasTerrace: true,
      hasBalcony: false,
      hasGarden: false,
      hasPool: false,
      hasBuiltInWardrobes: true,
      isFurnished: false,
      isAccessible: true,
      description: 'Precioso apartamento completamente reformado en el corazón de Madrid. Cuenta con acabados de primera calidad, cocina equipada y baño completo. Perfecto para entrar a vivir.',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
      ],
      status: 'available',
      updatedAt: new Date().toISOString(),
      idealistaUrl: propertyUrl
    };

    setFoundProperty(mockProperty);
    setCurrentStep('preview');
    toast.success('Propiedad encontrada correctamente');
  };

  const handleConfirm = () => {
    if (foundProperty) {
      onConfirm(foundProperty);
      handleReset();
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('select-platform');
    setSelectedPlatform(null);
    setPropertyUrl('');
    setFoundProperty(null);
    setLoadingProgress(0);
    setErrorMessage('');
    setWillFail(false);
  };

  const handleBack = () => {
    if (currentStep === 'enter-url') {
      setCurrentStep('select-platform');
      setPropertyUrl('');
    } else if (currentStep === 'preview') {
      setCurrentStep('enter-url');
      setFoundProperty(null);
    }
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'select-platform': return 1;
      case 'enter-url': return 2;
      case 'loading': return 3;
      case 'preview': return 3;
      case 'error': return 3;
      default: return 1;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden max-h-[90vh] sm:max-h-[90vh] flex flex-col">
        {/* Header rediseñado - UX mejorado */}
        <div className="bg-white px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-gray-100 flex-shrink-0">
          <DialogHeader>
            {/* Título con icono más sutil */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                <Plus className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl text-gray-900 mb-1 sm:mb-1">
                  {currentStep === 'preview' ? 'Confirmar propiedad' : 'Añadir propiedad'}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-sm text-gray-600">
                  {currentStep === 'select-platform' && 'Importa desde un portal o completa el formulario manualmente'}
                  {currentStep === 'enter-url' && `Pega el enlace de ${selectedPlatform === 'idealista' ? 'Idealista' : 'Fotocasa'}`}
                  {currentStep === 'loading' && 'Extrayendo información de la propiedad...'}
                  {currentStep === 'preview' && 'Revisa los datos y confirma para añadir la propiedad'}
                  {currentStep === 'error' && 'Error al buscar la propiedad'}
                </DialogDescription>
              </div>
            </div>

            {/* Banner de error inline - más discreto */}
            {currentStep === 'error' && (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-red-50 rounded-lg p-3 sm:p-3 border border-red-200 mt-3">
                <AlertCircle className="h-5 w-5 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-sm text-gray-900">No se encontró la propiedad</p>
                  <p className="text-xs sm:text-xs text-gray-600 mt-0.5">Verifica el enlace e intenta nuevamente</p>
                </div>
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Contenido del diálogo - scrollable */}
        <div className="px-4 sm:px-6 py-5 sm:py-6 overflow-y-auto flex-1">
          {/* Paso 1: Seleccionar portal */}
          {currentStep === 'select-platform' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSelectedPlatform('idealista');
                    setCurrentStep('enter-url');
                  }}
                  type="button"
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-primary active:border-primary transition-all p-4 sm:p-5 bg-white hover:bg-primary/5 active:bg-primary/5 active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex flex-col items-center gap-2.5 sm:gap-3">
                    {/* Logo circular de Idealista */}
                    <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-[#defa45] flex items-center justify-center shadow-md">
                      <span className="text-xl sm:text-lg text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>id</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-sm text-gray-900 group-hover:text-primary transition-colors">
                        Idealista
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Portal inmobiliario</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedPlatform('fotocasa');
                    setCurrentStep('enter-url');
                  }}
                  type="button"
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-primary active:border-primary transition-all p-4 sm:p-5 bg-white hover:bg-primary/5 active:bg-primary/5 active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex flex-col items-center gap-2.5 sm:gap-3">
                    {/* Logo circular de Fotocasa */}
                    <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-[#1e48bc] flex items-center justify-center shadow-md">
                      <span className="text-xl sm:text-lg text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>fc</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-sm text-gray-900 group-hover:text-primary transition-colors">
                        Fotocasa
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Portal inmobiliario</p>
                    </div>
                  </div>
                </button>
                
                {/* Botón para crear propiedad manualmente */}
                <button
                  onClick={() => {
                    setSelectedPlatform('manual');
                    if (onOpenManual) {
                      onOpenManual();
                    } else {
                      toast.info('Funcionalidad de formulario manual próximamente...');
                    }
                    // TODO: Implementar el formulario manual
                  }}
                  type="button"
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-primary active:border-primary transition-all p-4 sm:p-5 bg-white hover:bg-primary/5 active:bg-primary/5 active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex flex-col items-center gap-2.5 sm:gap-3">
                    {/* Icono */}
                    <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                      <Plus className="h-7 w-7 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-sm text-gray-900 group-hover:text-primary transition-colors">
                        Crear propiedad
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Formulario paso a paso</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 sm:p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">💡 Consejo</p>
                    <p className="text-xs sm:text-xs text-blue-700 leading-relaxed">
                      Si importas desde Idealista o Fotocasa, extraeremos automáticamente toda la información de la propiedad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Introducir URL */}
          {currentStep === 'enter-url' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  {/* Logo circular pequeño */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    selectedPlatform === 'idealista' 
                      ? 'bg-[#defa45]' 
                      : 'bg-[#1e48bc]'
                  }`}>
                    <span className={`text-sm ${
                      selectedPlatform === 'idealista' ? 'text-gray-900' : 'text-white'
                    }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {selectedPlatform === 'idealista' ? 'id' : 'fc'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-900">
                      {selectedPlatform === 'idealista' ? 'Idealista' : 'Fotocasa'}
                    </h3>
                    <p className="text-xs text-gray-600">Portal seleccionado</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700">
                  URL de la propiedad
                </label>
                <div className="relative">
                  <Input
                    placeholder={
                      selectedPlatform === 'idealista' 
                        ? 'https://www.idealista.com/inmueble/...'
                        : 'https://www.fotocasa.es/...'
                    }
                    value={propertyUrl}
                    onChange={(e) => setPropertyUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && propertyUrl.trim()) {
                        handleSearchProperty();
                      }
                    }}
                    className="pr-10"
                    autoFocus
                  />
                  <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Ejemplo de URL válida:</span>
                </p>
                <div className="flex items-start gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <code className="text-xs text-gray-700 break-all">
                    {selectedPlatform === 'idealista' 
                      ? 'https://www.idealista.com/inmueble/12345678/'
                      : 'https://www.fotocasa.es/vivienda/madrid/...'
                    }
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Estado de carga */}
          {currentStep === 'loading' && (
            <div className="py-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                </div>

                <div className="text-center space-y-2 w-full max-w-md">
                  <h3 className="text-lg text-gray-900">
                    Extrayendo información
                  </h3>
                  <p className="text-sm text-gray-600">
                    Estamos analizando el enlace y obteniendo todos los detalles de la propiedad
                  </p>

                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-4">
                    <div 
                      className="bg-gradient-to-r from-primary to-yellow-500 h-full transition-all duration-500 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{loadingProgress}%</p>
                </div>

                {/* Indicadores de progreso */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  {[
                    { label: 'Información básica', progress: loadingProgress >= 40 },
                    { label: 'Características', progress: loadingProgress >= 60 },
                    { label: 'Imágenes', progress: loadingProgress >= 80 },
                    { label: 'Descripción', progress: loadingProgress >= 100 }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        !willFail && item.progress 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {!willFail && item.progress ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${
                        !willFail && item.progress ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Preview de la propiedad */}
          {currentStep === 'preview' && foundProperty && (
            <div className="space-y-4">
              {/* Banner de éxito */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-900">Propiedad encontrada correctamente</p>
                    <p className="text-xs text-green-700">Revisa los datos antes de confirmar</p>
                  </div>
                </div>
              </div>

              {/* Imagen principal */}
              <div className="relative h-56 rounded-lg overflow-hidden border border-gray-200">
                <ImageWithFallback
                  src={foundProperty.images[0]}
                  alt={foundProperty.title}
                  className="w-full h-full object-cover"
                />
                {foundProperty.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                    +{foundProperty.images.length - 1} fotos
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg text-gray-900">{foundProperty.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{foundProperty.location}</span>
                  </div>
                </div>

                {/* Precio */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl text-gray-900">
                        {formatPrice(foundProperty.price)}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {formatPrice(foundProperty.pricePerM2)}/m² · {foundProperty.constructedArea} m²
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {foundProperty.operation === 'sale' ? 'Venta' : 'Alquiler'}
                    </Badge>
                  </div>
                </div>

                {/* Características */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Bed className="h-5 w-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-900">{foundProperty.bedrooms}</span>
                    <span className="text-xs text-gray-600">Habitaciones</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <Bath className="h-5 w-5 text-cyan-600 mb-1" />
                    <span className="text-sm text-gray-900">{foundProperty.bathrooms}</span>
                    <span className="text-xs text-gray-600">Baños</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Maximize className="h-5 w-5 text-purple-600 mb-1" />
                    <span className="text-sm text-gray-900">{foundProperty.constructedArea}</span>
                    <span className="text-xs text-gray-600">m²</span>
                  </div>
                </div>

                {/* Descripción */}
                {foundProperty.description && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Descripción:</p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {foundProperty.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paso 5: Error */}
          {currentStep === 'error' && (
            <div className="py-6">
              <div className="flex flex-col items-center gap-6">
                {/* Icono de información (no error agresivo) */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <Search className="h-10 w-10 text-orange-600" />
                  </div>
                </div>

                <div className="text-center space-y-2 max-w-md">
                  <h3 className="text-lg text-gray-900">
                    No pudimos encontrar la propiedad
                  </h3>
                  <p className="text-sm text-gray-600">
                    Esto puede ocurrir si el enlace no es correcto, la propiedad ya no está disponible, o hay problemas temporales de conexión.
                  </p>
                </div>

                {/* URL proporcionada */}
                <div className="w-full">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">Enlace introducido:</p>
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <code className="text-xs text-gray-700 break-all">
                        {propertyUrl}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0">
          {currentStep !== 'loading' && (
            <>
              {currentStep !== 'select-platform' && currentStep !== 'error' && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="h-9 sm:h-10 px-3 sm:px-4 sm:w-auto"
                  size="sm"
                >
                  Atrás
                </Button>
              )}

              <div className="flex gap-2 flex-1 sm:flex-initial sm:ml-auto">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 sm:flex-initial"
                >
                  Cancelar
                </Button>
                
                {currentStep === 'enter-url' && (
                  <Button
                    onClick={handleSearchProperty}
                    disabled={!propertyUrl.trim()}
                    className="bg-primary hover:bg-primary/90 flex-1 sm:flex-initial"
                  >
                    Buscar
                  </Button>
                )}

                {currentStep === 'error' && (
                  <Button
                    onClick={() => {
                      setCurrentStep('enter-url');
                      setErrorMessage('');
                    }}
                    className="bg-primary hover:bg-primary/90 gap-2 flex-1 sm:flex-initial"
                  >
                    <Search className="h-4 w-4" />
                    Intentar de nuevo
                  </Button>
                )}

                {currentStep === 'preview' && (
                  <Button
                    onClick={handleConfirm}
                    className="bg-green-600 hover:bg-green-700 gap-2 flex-1 sm:flex-initial"
                  >
                    <Check className="h-4 w-4" />
                    Confirmar
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
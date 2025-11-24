import {
  Bath,
  Bed,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Facebook,
  Flame,
  Home,
  Instagram,
  Layers,
  Link as LinkIcon,
  Mail,
  MapPin,
  Maximize,
  ParkingCircle,
  Phone,
  Ruler,
  ShieldCheck,
  ThermometerSun,
  Trees,
  User,
  Video,
  Warehouse,
  Waves,
  Wind,
  X as XIcon,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { Property } from 'src/utils/properties-data';
import { TikTokIcon } from '../icons/tiktok-icon';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useIsMobile } from '../ui/use-mobile';
import { ImageGalleryViewer } from './image-gallery-viewer';
import { SwipeableImageCarousel } from './swipeable-image-carousel';

interface PropertyPublicViewProps {
  property: Property;
  onClose?: () => void; // Opcional, para el modo preview en el prototipo
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getPropertyTypeLabel = (type: Property['propertyType']) => {
  const types = {
    apartment: 'Apartamento',
    house: 'Casa',
    condo: 'Piso',
    penthouse: 'Ático',
    duplex: 'Dúplex',
    studio: 'Estudio',
    land: 'Terreno',
    commercial: 'Local comercial',
    warehouse: 'Nave industrial',
    office: 'Oficina',
    garage: 'Garaje',
    storage: 'Trastero',
  };
  return types[type] || type;
};

const getConditionLabel = (condition?: Property['condition']) => {
  const conditions = {
    new: 'Obra nueva',
    good: 'Buen estado',
    'to-renovate': 'A reformar',
  };
  return condition ? conditions[condition] : 'No especificado';
};

const getEnergyCertLabel = (cert?: Property['energyCertification']) => {
  if (!cert || cert === 'pending') return { label: 'En trámite', color: 'bg-gray-500' };

  const colors: Record<string, string> = {
    A: 'bg-green-600',
    B: 'bg-green-500',
    C: 'bg-yellow-500',
    D: 'bg-yellow-600',
    E: 'bg-orange-500',
    F: 'bg-orange-600',
    G: 'bg-red-600',
  };

  return { label: cert, color: colors[cert] || 'bg-gray-500' };
};

// Banda de estado en esquina - complementaria al botón de estado
interface StatusCornerRibbonProps {
  status: Property['status'];
  size?: 'small' | 'large';
}

function StatusCornerRibbon({ status, size = 'small' }: StatusCornerRibbonProps) {
  const ribbonConfig = {
    unavailable: {
      label: 'No disponible',
      bgColor: 'bg-gray-600',
    },
    sold: {
      label: 'Vendida',
      bgColor: 'bg-red-600',
    },
    rented: {
      label: 'Alquilada',
      bgColor: 'bg-orange-600',
    },
    reserved: {
      label: 'Reservada',
      bgColor: 'bg-yellow-600',
    },
  };

  // Solo mostrar si NO está disponible
  if (status === 'available') {
    return null;
  }

  const config = ribbonConfig[status];

  // Configuración según tamaño
  const sizeConfig =
    size === 'large'
      ? {
          containerClass: 'w-40 h-40',
          width: '200px',
          padding: '12px 0',
          top: '30px',
          left: '-50px',
          fontSize: '14px',
          letterSpacing: '1px',
        }
      : {
          containerClass: 'w-24 h-24',
          width: '120px',
          padding: '6px 0',
          top: '18px',
          left: '-30px',
          fontSize: '10px',
          letterSpacing: '0.5px',
        };

  return (
    <div
      className={`absolute top-0 left-0 ${sizeConfig.containerClass} overflow-hidden pointer-events-none z-10`}
    >
      <div
        className={`${config.bgColor} text-white absolute shadow-lg`}
        style={{
          width: sizeConfig.width,
          padding: sizeConfig.padding,
          top: sizeConfig.top,
          left: sizeConfig.left,
          textAlign: 'center',
          transform: 'rotate(-45deg)',
          fontWeight: '600',
          letterSpacing: sizeConfig.letterSpacing,
          fontSize: sizeConfig.fontSize,
        }}
      >
        {config.label.toUpperCase()}
      </div>
    </div>
  );
}

export function PropertyPublicView({ property, onClose }: PropertyPublicViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const isMobile = useIsMobile();

  // Cargar datos de la agencia desde localStorage
  const savedAgencyData = localStorage.getItem('realmaker_agency_data');
  const agencyData = savedAgencyData
    ? JSON.parse(savedAgencyData)
    : {
        agencyLogo: '',
        agentPhoto: '',
        agentName: 'María García',
        agentPhone: '+34 612 345 678',
        agentEmail: 'maria.garcia@inmobiliaria.com',
        agencyName: 'García Propiedades',
        websiteUrl: 'www.garciaprops.com',
        instagramUrl: 'https://instagram.com/garciaprops',
        facebookUrl: 'https://facebook.com/garciaprops',
        tiktokUrl: 'https://tiktok.com/@garciaprops',
        youtubeUrl: 'https://youtube.com/@garciaprops',
      };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (!property) return null;

  const energyCert = getEnergyCertLabel(property.energyCertification);
  const isAvailable = property.status === 'available';

  // Características para mostrar
  const amenities = [
    { condition: property.hasElevator, icon: Building2, label: 'Ascensor' },
    { condition: property.hasAirConditioning, icon: Wind, label: 'Aire acond.' },
    { condition: property.hasHeating, icon: Flame, label: property.heatingType || 'Calefacción' },
    { condition: property.hasParking, icon: ParkingCircle, label: 'Parking' },
    { condition: property.hasStorage, icon: Warehouse, label: 'Trastero' },
    { condition: property.hasTerrace, icon: Layers, label: 'Terraza' },
    { condition: property.hasBalcony, icon: Layers, label: 'Balcón' },
    { condition: property.hasGarden, icon: Trees, label: 'Jardín' },
    { condition: property.hasPool, icon: Waves, label: 'Piscina' },
    { condition: property.hasBuiltInWardrobes, icon: Home, label: 'Armarios emp.' },
    { condition: property.isFurnished, icon: Home, label: 'Amueblado' },
    { condition: property.isAccessible, icon: ShieldCheck, label: 'Accesible' },
  ].filter((amenity) => amenity.condition);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón cerrar flotante (solo si hay onClose) */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-gray-900 rounded-lg shadow-lg transition-all border border-gray-200"
          aria-label="Cerrar vista previa"
        >
          <XIcon className="h-4 w-4" />
          <span className="text-sm">Cerrar</span>
        </button>
      )}

      {/* Content scrollable */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* HEADER MINIMALISTA - Información del agente */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
                {/* MÓVIL: Layout vertical centrado */}
                <div className="flex flex-col items-center gap-3 sm:hidden">
                  {/* Logo */}
                  {agencyData.agencyLogo ? (
                    <img
                      src={agencyData.agencyLogo}
                      alt={agencyData.agencyName}
                      className="h-9 w-auto max-w-[130px] object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{agencyData.agencyName}</span>
                    </div>
                  )}

                  {/* Separador */}
                  <div className="w-12 h-px bg-gray-200"></div>

                  {/* Info agente */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-2">
                      {agencyData.agentPhoto ? (
                        <img
                          src={agencyData.agentPhoto}
                          alt={agencyData.agentName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900">{agencyData.agentName}</span>
                    </div>

                    {/* Contacto en fila */}
                    <div className="flex items-center gap-3 text-xs">
                      <a
                        href={`tel:${agencyData.agentPhone}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{agencyData.agentPhone}</span>
                      </a>
                      <span className="text-gray-300">•</span>
                      <a
                        href={`mailto:${agencyData.agentEmail}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[140px]">{agencyData.agentEmail}</span>
                      </a>
                    </div>

                    {/* Redes sociales y página web */}
                    {(agencyData.websiteUrl ||
                      agencyData.instagramUrl ||
                      agencyData.facebookUrl ||
                      agencyData.tiktokUrl ||
                      agencyData.youtubeUrl) && (
                      <div className="flex items-center gap-2 pt-1">
                        {agencyData.websiteUrl && (
                          <a
                            href={`https://${agencyData.websiteUrl.replace(/^https?:\/\//, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 flex items-center justify-center text-gray-600 hover:text-primary transition-all"
                            aria-label="Página Web"
                          >
                            <LinkIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {agencyData.instagramUrl && (
                          <a
                            href={agencyData.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 flex items-center justify-center text-gray-600 hover:text-pink-600 transition-all"
                            aria-label="Instagram"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {agencyData.facebookUrl && (
                          <a
                            href={agencyData.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all"
                            aria-label="Facebook"
                          >
                            <Facebook className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {agencyData.tiktokUrl && (
                          <a
                            href={agencyData.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
                            aria-label="TikTok"
                          >
                            <TikTokIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {agencyData.youtubeUrl && (
                          <a
                            href={agencyData.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-all"
                            aria-label="YouTube"
                          >
                            <Youtube className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DESKTOP: Layout horizontal en una línea */}
                <div className="hidden sm:flex items-center justify-between gap-6">
                  {/* Logo + Nombre agencia */}
                  <div className="flex items-center gap-3 min-w-0">
                    {agencyData.agencyLogo ? (
                      <img
                        src={agencyData.agencyLogo}
                        alt={agencyData.agencyName}
                        className="h-10 w-auto max-w-[140px] object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{agencyData.agencyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Separador vertical */}
                  <div className="w-px h-12 bg-gray-200 flex-shrink-0"></div>

                  {/* Info agente + contacto */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Foto agente */}
                    {agencyData.agentPhoto ? (
                      <img
                        src={agencyData.agentPhoto}
                        alt={agencyData.agentName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}

                    {/* Nombre y contacto */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm text-gray-900">{agencyData.agentName}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <a
                          href={`tel:${agencyData.agentPhone}`}
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        >
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{agencyData.agentPhone}</span>
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href={`mailto:${agencyData.agentEmail}`}
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors truncate"
                        >
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{agencyData.agentEmail}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Redes sociales y página web */}
                  {(agencyData.websiteUrl ||
                    agencyData.instagramUrl ||
                    agencyData.facebookUrl ||
                    agencyData.tiktokUrl ||
                    agencyData.youtubeUrl) && (
                    <>
                      {/* Separador vertical */}
                      <div className="w-px h-12 bg-gray-200 flex-shrink-0"></div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {agencyData.websiteUrl && (
                          <a
                            href={`https://${agencyData.websiteUrl.replace(/^https?:\/\//, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 flex items-center justify-center text-gray-600 hover:text-primary transition-all"
                            aria-label="Página Web"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        )}
                        {agencyData.instagramUrl && (
                          <a
                            href={agencyData.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 flex items-center justify-center text-gray-600 hover:text-pink-600 transition-all"
                            aria-label="Instagram"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {agencyData.facebookUrl && (
                          <a
                            href={agencyData.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all"
                            aria-label="Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                        {agencyData.tiktokUrl && (
                          <a
                            href={agencyData.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
                            aria-label="TikTok"
                          >
                            <TikTokIcon className="h-4 w-4" />
                          </a>
                        )}
                        {agencyData.youtubeUrl && (
                          <a
                            href={agencyData.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-all"
                            aria-label="YouTube"
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Estadísticas de la propiedad - Mostrar si está habilitado y hay datos */}
            {/* {property.showInterestedSummary !== false &&
              ((property.interestedLeads && property.interestedLeads.length > 0) ||
                property.socialLinks) && (
                <div className="px-4 lg:px-6 pt-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                    <PropertyStats
                      leads={property.interestedLeads || []}
                      socialLinks={property.socialLinks}
                      isPublicView={true}
                    />
                  </div>
                </div>
              )} */}

            {/* Resto del contenido */}
            <div
              className={`px-4 lg:px-6 ${
                property.interestedLeads && property.interestedLeads.length > 0
                  ? 'py-6'
                  : 'pt-6 pb-6'
              } space-y-6`}
            >
              {/* DESKTOP: Grid de 2 columnas - Galería + Info principal */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                {/* Galería de imágenes */}
                <div>
                  <div
                    className="cursor-pointer group rounded-xl overflow-hidden"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <SwipeableImageCarousel
                      images={property.images}
                      currentIndex={currentImageIndex}
                      onIndexChange={setCurrentImageIndex}
                      alt={property.title}
                      className={`bg-gray-900 ${
                        isMobile ? 'aspect-[4/3]' : 'aspect-[4/3]'
                      } rounded-xl`}
                      showIndicators={false}
                    >
                      {/* Banda de estado en esquina */}
                      <StatusCornerRibbon status={property.status} size="large" />

                      {/* Marca de agua */}
                      {property.watermarkEnabled && agencyData.agencyLogo && (
                        <div
                          className="absolute pointer-events-none z-10"
                          style={{
                            left: property.watermarkCustomPosition
                              ? `${property.watermarkCustomPosition.x}%`
                              : property.watermarkPosition === 'top-left' ||
                                property.watermarkPosition === 'bottom-left'
                              ? '8%'
                              : property.watermarkPosition === 'top-right' ||
                                property.watermarkPosition === 'bottom-right'
                              ? '92%'
                              : '50%',
                            top: property.watermarkCustomPosition
                              ? `${property.watermarkCustomPosition.y}%`
                              : property.watermarkPosition === 'top-left' ||
                                property.watermarkPosition === 'top-right'
                              ? '12%'
                              : property.watermarkPosition === 'bottom-left' ||
                                property.watermarkPosition === 'bottom-right'
                              ? '88%'
                              : '50%',
                            transform: `translate(-50%, -50%) rotate(${
                              property.watermarkRotation || 0
                            }deg)`,
                            opacity: property.watermarkOpacity || 0.7,
                          }}
                        >
                          <img
                            src={agencyData.agencyLogo}
                            alt="Logo de la agencia"
                            className="h-auto object-contain drop-shadow-lg"
                            style={{
                              width: property.watermarkWidth
                                ? `${property.watermarkWidth}px`
                                : 'auto',
                            }}
                          />
                        </div>
                      )}

                      {/* Overlay gradient en la parte inferior */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                      {/* Indicador de zoom */}
                      <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <Maximize className="h-4 w-4" />
                        <span>Click para ampliar</span>
                      </div>

                      {/* Navegación de imágenes */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage();
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all backdrop-blur-sm z-20"
                            aria-label="Imagen anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all backdrop-blur-sm z-20"
                            aria-label="Siguiente imagen"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          {/* Contador de imágenes */}
                          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-10 pointer-events-none">
                            {currentImageIndex + 1} / {property.images.length}
                          </div>

                          {/* Indicadores de puntos */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {property.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(index);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                                aria-label={`Ver imagen ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </SwipeableImageCarousel>
                  </div>
                </div>

                {/* DESKTOP: Columna derecha - Información principal con altura igual a la foto */}
                <div className="hidden lg:block lg:h-full">
                  {/* Información básica y precio */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 h-full flex flex-col justify-between">
                    <div>
                      {/* Estado de disponibilidad */}
                      {isAvailable && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs mb-3">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Disponible</span>
                        </div>
                      )}

                      <h1 className="text-xl text-gray-900 mb-2">{property.title}</h1>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{property.location}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span>Ref: {property.id}</span>
                      </div>
                    </div>

                    {/* Precio destacado */}
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 mb-4">
                      <div className="text-3xl text-gray-900 mb-0.5">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(property.pricePerM2)}/m²
                      </div>
                    </div>

                    {/* Características principales en cards compactas */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Tipo */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <Building2 className="h-4 w-4 text-purple-600 mb-1" />
                        <div className="text-sm text-gray-900">
                          {getPropertyTypeLabel(property.propertyType)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {property.operation === 'sale' ? 'Venta' : 'Alquiler'}
                        </div>
                      </div>

                      {/* Superficie */}
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <Maximize className="h-4 w-4 text-primary mb-1" />
                        <div className="text-sm text-gray-900">{property.constructedArea} m²</div>
                        <div className="text-xs text-gray-600">Construidos</div>
                      </div>

                      {/* Habitaciones */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Bed className="h-4 w-4 text-blue-600 mb-1" />
                        <div className="text-sm text-gray-900">{property.bedrooms}</div>
                        <div className="text-xs text-gray-600">Dormitorios</div>
                      </div>

                      {/* Baños */}
                      <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                        <Bath className="h-4 w-4 text-cyan-600 mb-1" />
                        <div className="text-sm text-gray-900">{property.bathrooms}</div>
                        <div className="text-xs text-gray-600">Baños</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MÓVIL: Título, ubicación y link - Después de la galería */}
              <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4">
                {/* Estado de disponibilidad */}
                {isAvailable && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs mb-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Disponible</span>
                  </div>
                )}

                <h1 className="text-xl text-gray-900 mb-2">{property.title}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{property.location}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>Ref: {property.id}</span>
                </div>
              </div>

              {/* MÓVIL: Precio y características - Después del título */}
              <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4">
                {/* Precio destacado */}
                <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 mb-4">
                  <div className="text-3xl text-gray-900 mb-0.5">{formatPrice(property.price)}</div>
                  <div className="text-sm text-gray-600">{formatPrice(property.pricePerM2)}/m²</div>
                </div>

                {/* Características principales en cards compactas */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Tipo */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <Building2 className="h-4 w-4 text-purple-600 mb-1" />
                    <div className="text-sm text-gray-900">
                      {getPropertyTypeLabel(property.propertyType)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {property.operation === 'sale' ? 'Venta' : 'Alquiler'}
                    </div>
                  </div>

                  {/* Superficie */}
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <Maximize className="h-4 w-4 text-primary mb-1" />
                    <div className="text-sm text-gray-900">{property.constructedArea} m²</div>
                    <div className="text-xs text-gray-600">Construidos</div>
                  </div>

                  {/* Habitaciones */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <Bed className="h-4 w-4 text-blue-600 mb-1" />
                    <div className="text-sm text-gray-900">{property.bedrooms}</div>
                    <div className="text-xs text-gray-600">Dormitorios</div>
                  </div>

                  {/* Baños */}
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                    <Bath className="h-4 w-4 text-cyan-600 mb-1" />
                    <div className="text-sm text-gray-900">{property.bathrooms}</div>
                    <div className="text-xs text-gray-600">Baños</div>
                  </div>
                </div>
              </div>

              {/* Visor moderno de galería */}
              <ImageGalleryViewer
                images={property.images}
                currentIndex={currentImageIndex}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                onIndexChange={setCurrentImageIndex}
                title={property.title}
                watermark={
                  property.watermarkEnabled && agencyData.agencyLogo
                    ? {
                        enabled: true,
                        logo: agencyData.agencyLogo,
                        position: property.watermarkPosition,
                        customPosition: property.watermarkCustomPosition,
                        opacity: property.watermarkOpacity,
                        rotation: property.watermarkRotation,
                        width: property.watermarkWidth,
                      }
                    : undefined
                }
              />

              {/* Detalles */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg text-gray-900 mb-4">Detalles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Superficie útil */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <Ruler className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Superficie útil</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium ml-2">
                      {property.usableArea} m²
                    </span>
                  </div>

                  {/* Planta */}
                  {property.floor && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <Layers className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Planta</span>
                      </div>
                      <span className="text-sm text-gray-900 font-medium ml-2">
                        {property.floor}
                      </span>
                    </div>
                  )}

                  {/* Año de construcción */}
                  {property.yearBuilt && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Año construcción</span>
                      </div>
                      <span className="text-sm text-gray-900 font-medium ml-2">
                        {property.yearBuilt}
                      </span>
                    </div>
                  )}

                  {/* Estado */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <Home className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Estado</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium ml-2">
                      {getConditionLabel(property.condition)}
                    </span>
                  </div>

                  {/* Orientación */}
                  {property.orientation && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <Compass className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Orientación</span>
                      </div>
                      <span className="text-sm text-gray-900 font-medium ml-2">
                        {property.orientation}
                      </span>
                    </div>
                  )}

                  {/* Certificación energética */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <ThermometerSun className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Certificación energética</span>
                    </div>
                    <Badge className={`${energyCert.color} text-white text-xs px-2 py-0.5 ml-2`}>
                      {energyCert.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Equipamiento */}
              {amenities.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                  <h2 className="text-lg text-gray-900 mb-4">Equipamiento</h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => {
                      const Icon = amenity.icon;
                      return (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg text-gray-900 mb-4">Descripción</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Enlaces multimedia - Solo mostrar si hay al menos un enlace */}
              {(property.socialLinks?.instagram ||
                property.socialLinks?.facebook ||
                property.socialLinks?.tiktok ||
                property.socialLinks?.youtube) && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg text-gray-900">Enlaces multimedia</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Videos y contenido adicional de la propiedad
                  </p>

                  <div className="space-y-3">
                    {/* Instagram Video - Solo si existe */}
                    {property.socialLinks?.instagram && (
                      <a
                        href={property.socialLinks.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Instagram className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">
                            Ver vídeo de Instagram
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {/* Facebook Video - Solo si existe */}
                    {property.socialLinks?.facebook && (
                      <a
                        href={property.socialLinks.facebook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Facebook className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Ver vídeo de Facebook</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {/* TikTok Video - Solo si existe */}
                    {property.socialLinks?.tiktok && (
                      <a
                        href={property.socialLinks.tiktok.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-xl hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                          <TikTokIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Ver v��deo de TikTok</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {/* YouTube Video - Solo si existe */}
                    {property.socialLinks?.youtube && (
                      <a
                        href={property.socialLinks.youtube.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                          <Youtube className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Ver vídeo de YouTube</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Ubicación */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg text-gray-900 mb-4">Ubicación</h2>
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    title="Mapa de ubicación"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      property.location,
                    )}&t=&z=15&ie=UTF8&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

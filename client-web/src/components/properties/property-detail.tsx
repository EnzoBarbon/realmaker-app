import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getPropertyTypeFeatures } from "../../utils/properties-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useIsMobile } from "../ui/use-mobile";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Home,
  Building2,
  Share2,
  ExternalLink,
  Calendar,
  Compass,
  Layers,
  ParkingCircle,
  Warehouse,
  Trees,
  Waves,
  Wind,
  Flame,
  ShieldCheck,
  Instagram,
  Link as LinkIcon,
  Ruler,
  Building,
  ThermometerSun,
  X as XIcon,
  Users,
  Mail,
  Phone,
  Star,
  Copy,
  Check,
  Facebook,
  Youtube,
  Video,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  ImagePlus,
  Eye,
  EyeOff,
  CheckCheck,
  GripVertical,
  Crown,
  Key,
  Bookmark,
  CheckCircle2,
  Ban,
  XCircle,
  MoreVertical
} from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { QualificationPanel, OldConversationSheet, type Lead, type Conversation } from '../leads/leads-page';
import { TikTokIcon } from '../icons/tiktok-icon';
import { WhatsAppIcon } from '../icons/whatsapp-icon';
import { MessengerIcon } from '../icons/messenger-icon';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { WatermarkEditorFullScreen } from './watermark-editor-fullscreen';
import { ImageGalleryViewer } from './image-gallery-viewer';
import { SwipeableImageCarousel } from './swipeable-image-carousel';
import { PhotoOptionsPopover } from './photo-options-popover';
import { PropertyStats } from './property-stats';

interface Property {
  id: string;
  title: string;
  price: number;
  pricePerM2: number;
  location: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'penthouse' | 'duplex' | 'studio' | 'land' | 'commercial' | 'warehouse' | 'office' | 'garage' | 'storage';
  operation: 'sale' | 'rent';
  
  // Características principales
  constructedArea: number;
  usableArea: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  
  // Detalles adicionales
  yearBuilt?: number;
  condition?: 'new' | 'good' | 'to-renovate';
  orientation?: string;
  energyCertification?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'pending';
  
  // Equipamiento
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
  
  // Descripción y multimedia
  description?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  images: string[];
  
  // Metadata
  status: 'available' | 'unavailable';
  updatedAt: string;
  idealistaUrl?: string;
  
  // Estadísticas de Idealista (solo si está conectado a Idealista)
  idealistaStats?: {
    views: number;        // Visitas
    contacts: number;     // Contactos
    favorites: number;    // Favoritos
    searchPosition?: number; // Posición en búsqueda (opcional)
  };
  
  // Marca de agua
  watermarkEnabled?: boolean;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermarkSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
  watermarkOpacity?: number;
  watermarkRotation?: number;
  watermarkCustomPosition?: { x: number; y: number };
  watermarkWidth?: number; // Ancho en píxeles del logo
  
  // Interesados
  showInterestedSummary?: boolean; // Mostrar resumen de interesados en vista compartida
  interestedCount?: number;
  interestedLeads?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatarUrl?: string;
    lastContact: string;
    qualification: number;
    source?: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok' | 'phone';
  }[];
  
  // Ubicación
  latitude?: number;
  longitude?: number;
  showExactLocation?: boolean;
}

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onUpdate: (propertyId: string, updates: Partial<Property>) => void;
  onDelete: (propertyId: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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
    commercial: 'Local Comercial',
    warehouse: 'Nave Industrial',
    office: 'Oficina',
    garage: 'Garaje',
    storage: 'Trastero'
  };
  return types[type] || type;
};

const getConditionLabel = (condition?: Property['condition']) => {
  const conditions = {
    new: 'Obra nueva',
    good: 'Buen estado',
    'to-renovate': 'A reformar'
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
    G: 'bg-red-600'
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
      bgColor: 'bg-gray-600'
    },
    sold: { 
      label: 'Vendida', 
      bgColor: 'bg-red-600'
    },
    rented: { 
      label: 'Alquilada', 
      bgColor: 'bg-orange-600'
    },
    reserved: { 
      label: 'Reservada', 
      bgColor: 'bg-yellow-600'
    }
  };
  
  // Solo mostrar si NO está disponible
  if (status === 'available') {
    return null;
  }
  
  const config = ribbonConfig[status];
  
  // Configuración según tamaño
  const sizeConfig = size === 'large' 
    ? {
        containerClass: 'w-40 h-40',
        width: '200px',
        padding: '12px 0',
        top: '30px',
        left: '-50px',
        fontSize: '14px',
        letterSpacing: '1px'
      }
    : {
        containerClass: 'w-24 h-24',
        width: '120px',
        padding: '6px 0',
        top: '18px',
        left: '-30px',
        fontSize: '10px',
        letterSpacing: '0.5px'
      };
  
  return (
    <div className={`absolute top-0 left-0 ${sizeConfig.containerClass} overflow-hidden pointer-events-none z-10`}>
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
          fontSize: sizeConfig.fontSize
        }}
      >
        {config.label.toUpperCase()}
      </div>
    </div>
  );
}

// Conversaciones simuladas para los interesados de propiedades
const propertyConversations: Conversation[] = [
  {
    leadId: 'lead-001',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, vi esta propiedad en el portal y me interesa mucho', timestamp: '2024-12-19 10:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Me alegra mucho tu interés. ¿Qué te llamó más la atención de la propiedad?', timestamp: '2024-12-19 10:32', read: true },
      { id: '3', senderId: 'lead', text: 'Me encanta la ubicación y las características que tiene', timestamp: '2024-12-19 10:35', read: true },
      { id: '4', senderId: 'user', text: 'Excelente! ¿Te gustaría agendar una visita para verla en persona?', timestamp: '2024-12-19 10:37', read: true },
      { id: '5', senderId: 'lead', text: 'Sí, me gustaría. ¿Qué disponibilidad tienes?', timestamp: '2024-12-19 10:40', read: true },
      { id: '6', senderId: 'user', text: '¿Te vendría bien mañana a las 11:00?', timestamp: '2024-12-19 10:42', read: true },
    ]
  },
  {
    leadId: 'lead-002',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, quisiera más información sobre esta propiedad', timestamp: '2024-12-18 09:15', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días! Claro, con gusto. ¿Qué información específica necesitas?', timestamp: '2024-12-18 09:17', read: true },
      { id: '3', senderId: 'lead', text: '¿Cuál es el estado de la propiedad? ¿Necesita reformas?', timestamp: '2024-12-18 09:20', read: true },
      { id: '4', senderId: 'user', text: 'La propiedad está en excelente estado, lista para entrar a vivir. Todo está actualizado.', timestamp: '2024-12-18 09:22', read: true },
      { id: '5', senderId: 'lead', text: 'Perfecto, eso es justo lo que busco', timestamp: '2024-12-18 09:25', read: true },
    ]
  },
  {
    leadId: 'lead-003',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola! Me interesa esta propiedad. ¿Está disponible?', timestamp: '2024-12-17 16:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, la propiedad está disponible. ¿Cuándo te gustaría visitarla?', timestamp: '2024-12-17 16:32', read: true },
      { id: '3', senderId: 'lead', text: 'Esta semana si es posible', timestamp: '2024-12-17 16:35', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo disponibilidad el viernes a las 17:00. ¿Te viene bien?', timestamp: '2024-12-17 16:37', read: true },
      { id: '5', senderId: 'lead', text: '¡Perfecto! Confirmo para el viernes', timestamp: '2024-12-17 16:40', read: true },
    ]
  },
  {
    leadId: 'lead-004',
    messages: [
      { id: '1', senderId: 'lead', text: '¿El precio es negociable?', timestamp: '2024-12-19 14:20', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Siempre hay margen para negociar. ¿Te interesa la propiedad?', timestamp: '2024-12-19 14:22', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, mucho. Me gustaría hacer una oferta', timestamp: '2024-12-19 14:25', read: true },
      { id: '4', senderId: 'user', text: 'Excelente! ¿Qué te parece si primero la visitas y luego hablamos de la oferta?', timestamp: '2024-12-19 14:27', read: true },
      { id: '5', senderId: 'lead', text: 'Me parece bien. ¿Cuándo podemos?', timestamp: '2024-12-19 14:30', read: true },
    ]
  },
  {
    leadId: 'lead-005',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, ¿esta propiedad tiene plaza de garaje?', timestamp: '2024-12-16 11:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, incluye plaza de garaje. ¿Te interesa visitarla?', timestamp: '2024-12-16 11:02', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, eso es importante para mí. También quisiera saber sobre trastero', timestamp: '2024-12-16 11:05', read: true },
      { id: '4', senderId: 'user', text: 'También incluye trastero. ¿Te gustaría que agendemos una visita?', timestamp: '2024-12-16 11:07', read: true },
    ]
  },
  {
    leadId: 'lead-006',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuándo se puede hacer la mudanza?', timestamp: '2024-12-19 12:15', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Una vez cerrada la operación, se puede hacer la mudanza de inmediato. ¿Ya has visto la propiedad?', timestamp: '2024-12-19 12:17', read: true },
      { id: '3', senderId: 'lead', text: 'No, todavía no. ¿Podemos visitarla pronto?', timestamp: '2024-12-19 12:20', read: true },
      { id: '4', senderId: 'user', text: 'Claro! ¿Qué día te viene mejor?', timestamp: '2024-12-19 12:22', read: true },
      { id: '5', senderId: 'lead', text: 'El lunes por la tarde', timestamp: '2024-12-19 12:25', read: true },
    ]
  },
  {
    leadId: 'lead-007',
    messages: [
      { id: '1', senderId: 'lead', text: 'Me interesa esta propiedad para inversión', timestamp: '2024-12-15 15:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Excelente, esta propiedad tiene muy buen potencial de rentabilidad. ¿Buscas alquilarla?', timestamp: '2024-12-15 15:32', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, exactamente. ¿Qué rentabilidad estimas?', timestamp: '2024-12-15 15:35', read: true },
      { id: '4', senderId: 'user', text: 'Por la zona y características, podrías obtener entre 5-6% de rentabilidad anual', timestamp: '2024-12-15 15:37', read: true },
      { id: '5', senderId: 'lead', text: 'Interesante. Me gustaría verla', timestamp: '2024-12-15 15:40', read: true },
    ]
  },
  {
    leadId: 'lead-008',
    messages: [
      { id: '1', senderId: 'lead', text: '¿La propiedad tiene buenas vistas?', timestamp: '2024-12-19 17:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, tiene vistas muy bonitas. Te recomiendo que las veas en persona, te van a encantar', timestamp: '2024-12-19 17:02', read: true },
      { id: '3', senderId: 'lead', text: 'Me encantaría. ¿Cuándo podemos?', timestamp: '2024-12-19 17:05', read: true },
      { id: '4', senderId: 'user', text: '¿Te viene bien este jueves a las 16:00?', timestamp: '2024-12-19 17:07', read: true },
    ]
  },
  {
    leadId: 'lead-009',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, ¿se aceptan mascotas en la comunidad?', timestamp: '2024-12-18 13:20', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, se aceptan mascotas sin problema. ¿Te interesa la propiedad?', timestamp: '2024-12-18 13:22', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, tengo un perro y es importante para mí', timestamp: '2024-12-18 13:25', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto! No habrá ningún problema. ¿Quieres visitarla?', timestamp: '2024-12-18 13:27', read: true },
      { id: '5', senderId: 'lead', text: 'Sí, por favor', timestamp: '2024-12-18 13:30', read: true },
    ]
  },
  {
    leadId: 'lead-010',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuánto son los gastos de comunidad?', timestamp: '2024-12-17 10:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Los gastos de comunidad son aproximadamente 80€/mes. ¿Te interesa la propiedad?', timestamp: '2024-12-17 10:02', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, está dentro de mi presupuesto. Me gustaría verla', timestamp: '2024-12-17 10:05', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto! ¿Qué día te viene mejor para la visita?', timestamp: '2024-12-17 10:07', read: true },
    ]
  },
  {
    leadId: 'lead-011',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, me gustaría saber más sobre el barrio', timestamp: '2024-12-19 09:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Es una zona muy tranquila con todos los servicios cerca. ¿Qué te interesa saber específicamente?', timestamp: '2024-12-19 09:02', read: true },
      { id: '3', senderId: 'lead', text: '¿Hay colegios y zonas verdes?', timestamp: '2024-12-19 09:05', read: true },
      { id: '4', senderId: 'user', text: 'Sí, hay varios colegios a menos de 10 minutos y un parque grande muy cerca', timestamp: '2024-12-19 09:07', read: true },
    ]
  },
  {
    leadId: 'lead-012',
    messages: [
      { id: '1', senderId: 'lead', text: '¿La propiedad tiene ascensor?', timestamp: '2024-12-18 16:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, el edificio cuenta con ascensor. ¿Te interesa la propiedad?', timestamp: '2024-12-18 16:02', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, es importante para mí por temas de movilidad', timestamp: '2024-12-18 16:05', read: true },
    ]
  },
  {
    leadId: 'lead-013',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Está cerca del metro?', timestamp: '2024-12-17 11:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, a 5 minutos andando tienes la estación de metro. ¿Te gustaría visitarla?', timestamp: '2024-12-17 11:32', read: true },
      { id: '3', senderId: 'lead', text: 'Perfecto! Me interesa mucho', timestamp: '2024-12-17 11:35', read: true },
    ]
  },
  {
    leadId: 'lead-014',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuántos años tiene el edificio?', timestamp: '2024-12-19 14:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! El edificio fue construido en 2015, está muy bien conservado', timestamp: '2024-12-19 14:02', read: true },
      { id: '3', senderId: 'lead', text: 'Genial, me interesa verlo', timestamp: '2024-12-19 14:05', read: true },
    ]
  },
  {
    leadId: 'lead-015',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene aire acondicionado?', timestamp: '2024-12-16 15:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, tiene aire acondicionado en todas las habitaciones', timestamp: '2024-12-16 15:02', read: true },
      { id: '3', senderId: 'lead', text: 'Perfecto, con el calor que hace es necesario', timestamp: '2024-12-16 15:05', read: true },
    ]
  },
  {
    leadId: 'lead-016',
    messages: [
      { id: '1', senderId: 'lead', text: '¿La cocina está equipada?', timestamp: '2024-12-19 11:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, la cocina viene totalmente equipada con electrodomésticos de primera calidad', timestamp: '2024-12-19 11:02', read: true },
      { id: '3', senderId: 'lead', text: 'Excelente! Me gustaría verla', timestamp: '2024-12-19 11:05', read: true },
    ]
  },
  {
    leadId: 'lead-017',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene terraza?', timestamp: '2024-12-18 10:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, tiene una terraza de 15m² con vistas despejadas', timestamp: '2024-12-18 10:02', read: true },
      { id: '3', senderId: 'lead', text: 'Me encanta! ¿Cuándo puedo visitarla?', timestamp: '2024-12-18 10:05', read: true },
    ]
  },
  {
    leadId: 'lead-021',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, ¿acepta financiación?', timestamp: '2024-12-19 16:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, podemos ayudarte con la financiación. ¿Ya has hablado con algún banco?', timestamp: '2024-12-19 16:02', read: true },
      { id: '3', senderId: 'lead', text: 'Todavía no, estoy empezando a mirar opciones', timestamp: '2024-12-19 16:05', read: true },
    ]
  },
  {
    leadId: 'lead-022',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Hay mucho ruido en la zona?', timestamp: '2024-12-17 14:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! No, es una zona muy tranquila y residencial', timestamp: '2024-12-17 14:02', read: true },
      { id: '3', senderId: 'lead', text: 'Perfecto, busco un lugar tranquilo', timestamp: '2024-12-17 14:05', read: true },
    ]
  },
  {
    leadId: 'lead23',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene calefacción central?', timestamp: '2024-12-19 13:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, tiene calefacción central de gas natural', timestamp: '2024-12-19 13:02', read: true },
    ]
  },
  {
    leadId: 'lead24',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuándo está disponible?', timestamp: '2024-12-18 12:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Está disponible de inmediato. ¿Te gustaría visitarla?', timestamp: '2024-12-18 12:02', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, lo antes posible', timestamp: '2024-12-18 12:05', read: true },
    ]
  },
  {
    leadId: 'lead25',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene piscina comunitaria?', timestamp: '2024-12-19 15:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, el edificio tiene piscina comunitaria y zona ajardinada', timestamp: '2024-12-19 15:32', read: true },
    ]
  },
  {
    leadId: 'lead26',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Los armarios son empotrados?', timestamp: '2024-12-17 09:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, todas las habitaciones tienen armarios empotrados', timestamp: '2024-12-17 09:02', read: true },
    ]
  },
  {
    leadId: 'lead27',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuántas habitaciones tiene?', timestamp: '2024-12-19 10:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Tiene 3 habitaciones y 2 baños completos', timestamp: '2024-12-19 10:02', read: true },
    ]
  },
  {
    leadId: 'lead28',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Está amueblada?', timestamp: '2024-12-18 11:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! No, se entrega sin muebles, pero está en perfecto estado', timestamp: '2024-12-18 11:02', read: true },
    ]
  },
  {
    leadId: 'lead29',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Hay supermercados cerca?', timestamp: '2024-12-19 09:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, hay varios supermercados a menos de 5 minutos', timestamp: '2024-12-19 09:32', read: true },
    ]
  },
  {
    leadId: 'lead30',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene buena orientación?', timestamp: '2024-12-17 16:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, tiene orientación sur, muy luminosa todo el día', timestamp: '2024-12-17 16:02', read: true },
    ]
  },
  {
    leadId: 'lead31',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Cuántos metros cuadrados tiene?', timestamp: '2024-12-19 14:30', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Tiene 100m² construidos, muy bien distribuidos', timestamp: '2024-12-19 14:32', read: true },
    ]
  },
  {
    leadId: 'lead32',
    messages: [
      { id: '1', senderId: 'lead', text: '¿En qué planta está?', timestamp: '2024-12-18 15:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Está en un tercer piso con ascensor', timestamp: '2024-12-18 15:02', read: true },
    ]
  },
  {
    leadId: 'lead33',
    messages: [
      { id: '1', senderId: 'lead', text: '¿Tiene trastero incluido?', timestamp: '2024-12-19 12:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Sí, incluye trastero de 5m² en el precio', timestamp: '2024-12-19 12:02', read: true },
    ]
  },
];

export function PropertyDetail({ property, onClose, onUpdate, onDelete }: PropertyDetailProps) {
  const isMobile = useIsMobile();
  const propertyFeatures = getPropertyTypeFeatures(property.propertyType);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInterestedDialogOpen, setIsInterestedDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingChannel, setEditingChannel] = useState<'instagram' | 'facebook' | 'tiktok' | 'youtube' | null>(null);
  const [showWatermarkSettings, setShowWatermarkSettings] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(property.watermarkEnabled || false);
  const [watermarkPosition, setWatermarkPosition] = useState<Property['watermarkPosition']>(property.watermarkPosition || 'bottom-right');
  const [watermarkSize, setWatermarkSize] = useState<Property['watermarkSize']>(property.watermarkSize || 'm');
  const [watermarkOpacity, setWatermarkOpacity] = useState(property.watermarkOpacity || 0.7);
  const [watermarkRotation, setWatermarkRotation] = useState(property.watermarkRotation || 0);
  const [watermarkCustomPosition, setWatermarkCustomPosition] = useState(property.watermarkCustomPosition || { x: 50, y: 50 });
  const [watermarkWidth, setWatermarkWidth] = useState(property.watermarkWidth || 150);
  const [showInterestedSummary, setShowInterestedSummary] = useState(property.showInterestedSummary !== undefined ? property.showInterestedSummary : true); // Por defecto activado
  const [avatarLightbox, setAvatarLightbox] = useState<{open: boolean, src: string, name: string}>({
    open: false,
    src: '',
    name: ''
  });
  
  // Cargar logo de la agencia desde localStorage
  const savedAgencyData = localStorage.getItem('realmaker_agency_data');
  const agencyLogo = savedAgencyData ? JSON.parse(savedAgencyData).agencyLogo : '';
  
  // Estados para los paneles laterales de leads
  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Estado para trackear leads leídos/no leídos
  const [readLeads, setReadLeads] = useState<Set<string>>(new Set());
  
  // Estados para edición
  const [editedData, setEditedData] = useState({
    title: property.title,
    description: property.description || '',
    socialLinks: property.socialLinks || {},
    status: property.status
  });

  // Estado temporal para el enlace que se está editando
  const [tempLink, setTempLink] = useState('');

  // Estados para edición de fotos
  const [isEditingPhotos, setIsEditingPhotos] = useState(false);
  const [editedImages, setEditedImages] = useState<string[]>(property.images);

  // Estados para edición de secciones
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showAIDescriptionModal, setShowAIDescriptionModal] = useState(false);
  const [aiDescriptionStyle, setAiDescriptionStyle] = useState<string>('comercial');
  const [aiCustomInstructions, setAiCustomInstructions] = useState('');
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState('');

  // Estados temporales para edición
  const [tempTitle, setTempTitle] = useState(property.title);
  const [tempLocation, setTempLocation] = useState(property.location);
  const [tempShowExactLocation, setTempShowExactLocation] = useState(property.showExactLocation ?? true);
  const [tempPrice, setTempPrice] = useState(property.price);
  const [tempPricePerM2, setTempPricePerM2] = useState(property.pricePerM2);
  const [tempConstructedArea, setTempConstructedArea] = useState(property.constructedArea);
  const [tempUsableArea, setTempUsableArea] = useState(property.usableArea);
  const [tempBedrooms, setTempBedrooms] = useState(property.bedrooms);
  const [tempBathrooms, setTempBathrooms] = useState(property.bathrooms);
  const [tempDescription, setTempDescription] = useState(property.description || '');
  const [tempFloor, setTempFloor] = useState(property.floor || '');
  const [tempYearBuilt, setTempYearBuilt] = useState(property.yearBuilt || new Date().getFullYear());
  const [tempCondition, setTempCondition] = useState<Property['condition']>(property.condition || 'good');
  const [tempOrientation, setTempOrientation] = useState(property.orientation || '');
  const [tempEnergyCertification, setTempEnergyCertification] = useState<Property['energyCertification']>(property.energyCertification || 'pending');
  
  // Estados temporales para características booleanas
  const [tempHasElevator, setTempHasElevator] = useState(property.hasElevator || false);
  const [tempHasAirConditioning, setTempHasAirConditioning] = useState(property.hasAirConditioning || false);
  const [tempHasHeating, setTempHasHeating] = useState(property.hasHeating || false);
  const [tempHasParking, setTempHasParking] = useState(property.hasParking || false);
  const [tempHasStorage, setTempHasStorage] = useState(property.hasStorage || false);
  const [tempHasTerrace, setTempHasTerrace] = useState(property.hasTerrace || false);
  const [tempHasBalcony, setTempHasBalcony] = useState(property.hasBalcony || false);
  const [tempHasGarden, setTempHasGarden] = useState(property.hasGarden || false);
  const [tempHasPool, setTempHasPool] = useState(property.hasPool || false);
  const [tempHasBuiltInWardrobes, setTempHasBuiltInWardrobes] = useState(property.hasBuiltInWardrobes || false);
  const [tempIsFurnished, setTempIsFurnished] = useState(property.isFurnished || false);
  const [tempIsAccessible, setTempIsAccessible] = useState(property.isAccessible || false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % editedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + editedImages.length) % editedImages.length);
  };

  const handleToggleStatus = (newStatus: Property['status']) => {
    setEditedData({ ...editedData, status: newStatus });
    onUpdate(property.id, { status: newStatus });
    const labels = {
      available: 'Disponible',
      unavailable: 'No disponible',
      sold: 'Vendida',
      rented: 'Alquilada',
      reserved: 'Reservada'
    };
    toast.success(`Estado actualizado a: ${labels[newStatus]}`);
  };

  const getPublicUrl = () => {
    // Generar URL pública de la ficha
    return `${window.location.origin}/property/${property.id}`;
  };

  const handleShare = () => {
    console.log('🔵 handleShare llamado - propertyId:', property.id);
    
    // Guardar el estado actual de showInterestedSummary antes de compartir
    const savedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    const updatedProperties = savedProperties.map((p: Property) => 
      p.id === property.id ? { ...p, showInterestedSummary: showInterestedSummary } : p
    );
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    // Cerrar el diálogo de compartir
    setIsShareDialogOpen(false);
    
    // Emitir evento para mostrar la vista pública (como una nueva pestaña)
    setTimeout(() => {
      console.log('🟢 Disparando evento showPublicPropertyView con ID:', property.id);
      const event = new CustomEvent('showPublicPropertyView', {
        detail: { propertyId: property.id }
      });
      window.dispatchEvent(event);
      console.log('✅ Evento disparado exitosamente');
    }, 100);
  };

  const handleStartEdit = (channel: 'instagram' | 'facebook' | 'tiktok' | 'youtube') => {
    setEditingChannel(channel);
    setTempLink(property.socialLinks?.[channel] || '');
  };

  const handleSaveLink = (channel: 'instagram' | 'facebook' | 'tiktok' | 'youtube') => {
    const newLinks = { ...property.socialLinks };
    if (tempLink.trim()) {
      newLinks[channel] = tempLink.trim();
    } else {
      delete newLinks[channel];
    }
    onUpdate(property.id, { socialLinks: newLinks });
    setEditingChannel(null);
    setTempLink('');
    toast.success(tempLink.trim() ? 'Enlace guardado correctamente' : 'Enlace eliminado');
  };

  const handleDeleteLink = (channel: 'instagram' | 'facebook' | 'tiktok' | 'youtube') => {
    const newLinks = { ...property.socialLinks };
    delete newLinks[channel];
    onUpdate(property.id, { socialLinks: newLinks });
    toast.success('Enlace eliminado');
  };

  const handleCancelEdit = () => {
    setEditingChannel(null);
    setTempLink('');
  };

  const handleOpenIdealista = () => {
    if (property.idealistaUrl) {
      window.open(property.idealistaUrl, '_blank');
    }
  };

  const handleToggleWatermark = (enabled: boolean) => {
    setWatermarkEnabled(enabled);
    onUpdate(property.id, { watermarkEnabled: enabled, watermarkPosition, watermarkSize });
    toast.success(enabled ? 'Marca de agua activada' : 'Marca de agua desactivada');
  };

  const handleChangeWatermarkPosition = (position: Property['watermarkPosition']) => {
    setWatermarkPosition(position);
    if (watermarkEnabled) {
      onUpdate(property.id, { watermarkPosition: position, watermarkEnabled, watermarkSize });
      toast.success('Posición de marca de agua actualizada');
    }
  };

  const handleChangeWatermarkSize = (size: Property['watermarkSize']) => {
    setWatermarkSize(size);
    if (watermarkEnabled) {
      onUpdate(property.id, { watermarkSize: size, watermarkEnabled, watermarkPosition });
      toast.success('Tamaño de marca de agua actualizado');
    }
  };

  const handleSaveWatermarkSettings = (settings: {
    watermarkEnabled: boolean;
    watermarkPosition: Property['watermarkPosition'];
    watermarkSize: Property['watermarkSize'];
    watermarkOpacity: number;
    watermarkRotation: number;
    watermarkCustomPosition?: { x: number; y: number };
    watermarkWidth?: number;
  }) => {
    setWatermarkEnabled(settings.watermarkEnabled);
    setWatermarkPosition(settings.watermarkPosition);
    setWatermarkSize(settings.watermarkSize);
    setWatermarkOpacity(settings.watermarkOpacity);
    setWatermarkRotation(settings.watermarkRotation);
    if (settings.watermarkCustomPosition) {
      setWatermarkCustomPosition(settings.watermarkCustomPosition);
    }
    if (settings.watermarkWidth) {
      setWatermarkWidth(settings.watermarkWidth);
    }
    onUpdate(property.id, settings);
  };

  // Funciones para editar fotos
  const handleStartEditPhotos = () => {
    setIsEditingPhotos(true);
    setEditedImages([...property.images]);
  };

  const handleAddPhoto = () => {
    // Abrir selector de archivos
    photoInputRef.current?.click();
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setEditedImages([...editedImages, imageUrl]);
        toast.success('Foto agregada');
      };
      reader.readAsDataURL(file);
    }
    // Resetear el input para permitir subir el mismo archivo de nuevo
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (editedImages.length === 1) {
      toast.error('Debe haber al menos una foto');
      return;
    }
    const newImages = editedImages.filter((_, idx) => idx !== index);
    setEditedImages(newImages);
    // Ajustar el índice de la imagen actual si es necesario
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
    toast.success('Foto eliminada');
  };

  const movePhoto = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...editedImages];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, removed);
    setEditedImages(newImages);
    
    // Actualizar el índice actual si es necesario
    if (currentImageIndex === dragIndex) {
      setCurrentImageIndex(hoverIndex);
    } else if (dragIndex < currentImageIndex && hoverIndex >= currentImageIndex) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (dragIndex > currentImageIndex && hoverIndex <= currentImageIndex) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    
    // Mostrar feedback si se mueve a la posición principal
    if (hoverIndex === 0 && dragIndex !== 0) {
      toast.success('Establecida como foto principal');
    }
  };

  const handleSavePhotos = () => {
    onUpdate(property.id, { images: editedImages });
    setIsEditingPhotos(false);
    toast.success('Fotos actualizadas correctamente');
  };

  const handleCancelEditPhotos = () => {
    setEditedImages([...property.images]);
    setIsEditingPhotos(false);
    toast.info('Cambios descartados');
  };

  // Funciones para editar título y ubicación
  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
    setTempTitle(property.title);
    setTempLocation(property.location);
    setTempShowExactLocation(property.showExactLocation ?? true);
  };

  const handleSaveTitle = () => {
    onUpdate(property.id, { title: tempTitle, location: tempLocation, showExactLocation: tempShowExactLocation });
    setIsEditingTitle(false);
    toast.success('Título y ubicación actualizados');
  };

  const handleCancelEditTitle = () => {
    setTempTitle(property.title);
    setTempLocation(property.location);
    setTempShowExactLocation(property.showExactLocation ?? true);
    setIsEditingTitle(false);
  };

  // Funciones para editar precio
  const handleStartEditPrice = () => {
    setIsEditingPrice(true);
    setTempPrice(property.price);
    setTempPricePerM2(property.pricePerM2);
    setTempConstructedArea(property.constructedArea);
    setTempUsableArea(property.usableArea);
    setTempBedrooms(property.bedrooms);
    setTempBathrooms(property.bathrooms);
  };

  const handleSavePrice = () => {
    onUpdate(property.id, {
      price: tempPrice,
      pricePerM2: tempPricePerM2,
      constructedArea: tempConstructedArea,
      usableArea: tempUsableArea,
      bedrooms: tempBedrooms,
      bathrooms: tempBathrooms
    });
    setIsEditingPrice(false);
    toast.success('Características actualizadas');
  };

  const handleCancelEditPrice = () => {
    setTempPrice(property.price);
    setTempPricePerM2(property.pricePerM2);
    setTempConstructedArea(property.constructedArea);
    setTempUsableArea(property.usableArea);
    setTempBedrooms(property.bedrooms);
    setTempBathrooms(property.bathrooms);
    setIsEditingPrice(false);
  };

  // Funciones para editar descripción
  const handleStartEditDescription = () => {
    setIsEditingDescription(true);
    setTempDescription(property.description || '');
  };

  const handleSaveDescription = () => {
    onUpdate(property.id, { description: tempDescription });
    setIsEditingDescription(false);
    toast.success('Descripción actualizada');
  };

  const handleCancelEditDescription = () => {
    setTempDescription(property.description || '');
    setIsEditingDescription(false);
  };

  // Funciones para editar ubicación
  const handleStartEditLocation = () => {
    setIsEditingLocation(true);
    setTempLocation(property.location);
    setTempShowExactLocation(property.showExactLocation ?? true);
  };

  const handleSaveLocation = () => {
    onUpdate(property.id, { location: tempLocation, showExactLocation: tempShowExactLocation });
    setIsEditingLocation(false);
    toast.success('Ubicación actualizada');
  };

  const handleCancelEditLocation = () => {
    setTempLocation(property.location);
    setTempShowExactLocation(property.showExactLocation ?? true);
    setIsEditingLocation(false);
  };

  // Función para generar descripción con IA
  const handleGenerateDescriptionWithAI = async () => {
    setIsGeneratingDescription(true);
    
    // Simular generación con IA (en producción esto llamaría a una API real)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar descripción basada en las características de la propiedad y el estilo seleccionado
    const propertyTypeLabels: Record<Property['propertyType'], string> = {
      apartment: 'piso',
      house: 'casa',
      condo: 'apartamento',
      penthouse: 'ático',
      duplex: 'dúplex',
      studio: 'estudio',
      land: 'terreno',
      commercial: 'local comercial',
      warehouse: 'nave industrial',
      office: 'oficina',
      garage: 'garaje',
      storage: 'trastero'
    };
    
    const propertyTypeName = propertyTypeLabels[property.propertyType] || 'propiedad';
    const operation = property.operation === 'sale' ? 'venta' : 'alquiler';
    
    let description = '';
    
    // Generar según el estilo seleccionado
    switch (aiDescriptionStyle) {
      case 'comercial':
        description = `Excelente oportunidad de ${operation}. ${propertyTypeName.charAt(0).toUpperCase() + propertyTypeName.slice(1)} ubicado en ${property.location}`;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += ` con ${property.bedrooms} ${property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` y ${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}`;
          }
        }
        description += `. Cuenta con ${property.constructedArea}m² construidos`;
        break;
        
      case 'lujo':
        description = `Espectacular ${propertyTypeName} de alto standing en la exclusiva zona de ${property.location}. `;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += `Esta magnífica propiedad dispone de ${property.bedrooms} ${property.bedrooms === 1 ? 'amplio dormitorio' : 'amplios dormitorios'}`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` y ${property.bathrooms} ${property.bathrooms === 1 ? 'baño completo' : 'baños completos'} de diseño`;
          }
          description += '. ';
        }
        description += `Con sus ${property.constructedArea}m² construidos, esta joya inmobiliaria representa la máxima expresión del confort y la elegancia`;
        break;
        
      case 'moderno':
        description = `${propertyTypeName.charAt(0).toUpperCase() + propertyTypeName.slice(1)} contemporáneo en ${property.location}. `;
        description += `${property.constructedArea}m² de diseño funcional`;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += ` | ${property.bedrooms} hab`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` | ${property.bathrooms} baños`;
          }
        }
        description += `. Espacios luminosos y versátiles`;
        break;
        
      case 'familiar':
        description = `Cálido y acogedor ${propertyTypeName} perfecto para familias en ${property.location}. `;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += `Con ${property.bedrooms} ${property.bedrooms === 1 ? 'habitación' : 'habitaciones'} espaciosas`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` y ${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}`;
          }
          description += ', ideal para disfrutar en familia. ';
        }
        description += `Sus ${property.constructedArea}m² están distribuidos para aprovechar cada rincón`;
        break;
        
      case 'formal':
        description = `Se ofrece en ${operation} ${propertyTypeName} sito en ${property.location}. `;
        description += `La propiedad cuenta con una superficie construida de ${property.constructedArea} metros cuadrados`;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += `, distribuidos en ${property.bedrooms} ${property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` y ${property.bathrooms} ${property.bathrooms === 1 ? 'cuarto de baño' : 'cuartos de baño'}`;
          }
        }
        break;
        
      case 'informal':
        description = `¡Echa un vistazo a este ${propertyTypeName} en ${property.location}! `;
        if (propertyFeatures.hasBedrooms && property.bedrooms > 0) {
          description += `Tiene ${property.bedrooms} ${property.bedrooms === 1 ? 'habitación' : 'habitaciones'}`;
          if (propertyFeatures.hasBathrooms && property.bathrooms > 0) {
            description += ` y ${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}`;
          }
          description += '. ';
        }
        description += `Con sus ${property.constructedArea}m², este espacio tiene todo lo que necesitas`;
        break;
    }
    
    // Añadir equipamiento destacado
    const features = [];
    if (property.hasParking) features.push('parking');
    if (property.hasPool) features.push('piscina');
    if (property.hasGarden) features.push('jardín');
    if (property.hasTerrace) features.push('terraza');
    if (property.hasElevator) features.push('ascensor');
    if (property.hasAirConditioning) features.push('aire acondicionado');
    
    if (features.length > 0) {
      const connector = aiDescriptionStyle === 'formal' ? '. Dispone de' : '. Incluye';
      description += `${connector} ${features.join(', ')}.`;
    }
    
    // Añadir instrucciones personalizadas si existen
    if (aiCustomInstructions.trim()) {
      description += ` ${aiCustomInstructions}`;
    }
    
    setAiGeneratedPreview(description);
    setIsGeneratingDescription(false);
  };
  
  const handleApplyAIDescription = () => {
    setTempDescription(aiGeneratedPreview);
    setShowAIDescriptionModal(false);
    setAiGeneratedPreview('');
    setAiCustomInstructions('');
    toast.success('Descripción aplicada correctamente');
  };
  
  const handleOpenAIModal = () => {
    setShowAIDescriptionModal(true);
    setAiDescriptionStyle('comercial');
    setAiCustomInstructions('');
    setAiGeneratedPreview('');
  };

  // Funciones para editar detalles
  const handleStartEditDetails = () => {
    setIsEditingDetails(true);
    setTempFloor(property.floor || '');
    setTempYearBuilt(property.yearBuilt || new Date().getFullYear());
    setTempCondition(property.condition || 'good');
    setTempOrientation(property.orientation || '');
    setTempEnergyCertification(property.energyCertification || 'pending');
  };

  const handleSaveDetails = () => {
    onUpdate(property.id, {
      floor: tempFloor,
      yearBuilt: tempYearBuilt,
      condition: tempCondition,
      orientation: tempOrientation,
      energyCertification: tempEnergyCertification
    });
    setIsEditingDetails(false);
    toast.success('Detalles actualizados');
  };

  const handleCancelEditDetails = () => {
    setTempFloor(property.floor || '');
    setTempYearBuilt(property.yearBuilt || new Date().getFullYear());
    setTempCondition(property.condition || 'good');
    setTempOrientation(property.orientation || '');
    setTempEnergyCertification(property.energyCertification || 'pending');
    setIsEditingDetails(false);
  };

  // Funciones para editar equipamiento
  const handleStartEditFeatures = () => {
    setIsEditingFeatures(true);
    setTempHasElevator(property.hasElevator || false);
    setTempHasAirConditioning(property.hasAirConditioning || false);
    setTempHasHeating(property.hasHeating || false);
    setTempHasParking(property.hasParking || false);
    setTempHasStorage(property.hasStorage || false);
    setTempHasTerrace(property.hasTerrace || false);
    setTempHasBalcony(property.hasBalcony || false);
    setTempHasGarden(property.hasGarden || false);
    setTempHasPool(property.hasPool || false);
    setTempHasBuiltInWardrobes(property.hasBuiltInWardrobes || false);
    setTempIsFurnished(property.isFurnished || false);
    setTempIsAccessible(property.isAccessible || false);
  };

  const handleSaveFeatures = () => {
    onUpdate(property.id, {
      hasElevator: tempHasElevator,
      hasAirConditioning: tempHasAirConditioning,
      hasHeating: tempHasHeating,
      hasParking: tempHasParking,
      hasStorage: tempHasStorage,
      hasTerrace: tempHasTerrace,
      hasBalcony: tempHasBalcony,
      hasGarden: tempHasGarden,
      hasPool: tempHasPool,
      hasBuiltInWardrobes: tempHasBuiltInWardrobes,
      isFurnished: tempIsFurnished,
      isAccessible: tempIsAccessible
    });
    setIsEditingFeatures(false);
    toast.success('Equipamiento actualizado');
  };

  const handleCancelEditFeatures = () => {
    setTempHasElevator(property.hasElevator || false);
    setTempHasAirConditioning(property.hasAirConditioning || false);
    setTempHasHeating(property.hasHeating || false);
    setTempHasParking(property.hasParking || false);
    setTempHasStorage(property.hasStorage || false);
    setTempHasTerrace(property.hasTerrace || false);
    setTempHasBalcony(property.hasBalcony || false);
    setTempHasGarden(property.hasGarden || false);
    setTempHasPool(property.hasPool || false);
    setTempHasBuiltInWardrobes(property.hasBuiltInWardrobes || false);
    setTempIsFurnished(property.isFurnished || false);
    setTempIsAccessible(property.isAccessible || false);
    setIsEditingFeatures(false);
  };

  if (!property) return null;

  const energyCert = getEnergyCertLabel(property.energyCertification);
  const isAvailable = editedData.status === 'available';
  
  // Helper para colores de cualificación
  const getQualificationColor = (qual: number) => {
    if (qual >= 75) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    if (qual >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
  };
  
  // Helper para formatear fecha a DD/MM/YY
  const formatDateShort = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };
  
  // Límite de interesados a mostrar antes del botón "Ver más"
  const MAX_PREVIEW_LEADS = 20;
  const hasMoreLeads = property.interestedLeads && property.interestedLeads.length > MAX_PREVIEW_LEADS;
  
  // Ordenar interesados por fecha más reciente y luego tomar los primeros
  const sortedLeads = property.interestedLeads ? 
    [...property.interestedLeads].sort((a, b) => {
      const dateA = new Date(a.lastContact).getTime();
      const dateB = new Date(b.lastContact).getTime();
      return dateB - dateA; // Más reciente primero
    }) : [];
  const previewLeads = sortedLeads.slice(0, MAX_PREVIEW_LEADS);

  // Convertir un interesado de la propiedad a formato Lead para los componentes
  const convertToLead = (interestedLead: Property['interestedLeads'][number]): Lead => {
    return {
      id: interestedLead.id,
      name: interestedLead.name,
      contactName: interestedLead.name,
      phone: interestedLead.phone,
      contactPhone: interestedLead.phone,
      email: interestedLead.email,
      intention: 'comprador',
      lastContact: interestedLead.lastContact,
      lastMessage: `Me viene bien cualquier día de esta semana por la tarde`,
      budget: formatPrice(property.price),
      zone: property.location,
      propertyType: getPropertyTypeLabel(property.propertyType),
      status: 'nuevo',
      alerts: [],
      score: interestedLead.qualification,
      avatar: interestedLead.avatarUrl,
      source: interestedLead.source || 'whatsapp', // Usar el source del lead o WhatsApp por defecto
      interactions: 5,
      priority: 'media'
    };
  };

  // Componente para miniaturas arrastrables
  const DraggablePhoto = ({ image, index, onClick, onRemove }: { 
    image: string; 
    index: number; 
    onClick: () => void;
    onRemove: () => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag({
      type: 'photo',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'photo',
      hover: (item: { index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        
        movePhoto(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`relative flex-shrink-0 group cursor-move ${isDragging ? 'opacity-50' : ''}`}
        style={{ width: isMobile ? '70px' : '80px', height: isMobile ? '70px' : '80px' }}
      >
        <div className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
          index === currentImageIndex
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-gray-200'
        }`}>
          <ImageWithFallback
            src={image}
            alt={`Foto ${index + 1}`}
            className="w-full h-full object-cover"
            onClick={onClick}
          />
        </div>
        
        {/* Badge de foto principal */}
        {index === 0 && (
          <div className={`absolute -top-1 -left-1 bg-primary text-white rounded text-[10px] flex items-center gap-0.5 shadow-sm z-50 ${
            isMobile ? 'px-1 py-0.5' : 'px-1.5 py-0.5'
          }`}>
            <Crown className={`${isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'}`} />
            {!isMobile && 'Principal'}
          </div>
        )}
        
        {/* Indicador de arrastre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className={`text-white drop-shadow-lg ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </div>
        
        {/* Botón eliminar - en móvil siempre visible, en desktop al hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-opacity z-50 ${
            isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="Eliminar foto"
        >
          <XIcon className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
        </button>
      </div>
    );
  };

  // Componente para miniaturas arrastrables en overlay (modo edición)
  const DraggablePhotoOverlay = ({ image, index, onClick, onRemove, isCurrent, isMobile }: { 
    image: string; 
    index: number; 
    onClick: () => void;
    onRemove: () => void;
    isCurrent: boolean;
    isMobile: boolean;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag({
      type: 'photo',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'photo',
      hover: (item: { index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        
        movePhoto(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`relative flex-shrink-0 group cursor-move ${isDragging ? 'opacity-50' : ''}`}
        style={{ 
          width: isMobile ? '80px' : '70px', 
          height: isMobile ? '80px' : '70px',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={onClick}
      >
        <div className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
          isCurrent
            ? 'border-primary ring-2 ring-primary/50'
            : isMobile ? 'border-gray-300 hover:border-primary' : 'border-white/30 hover:border-white/60'
        }`}>
          <ImageWithFallback
            src={image}
            alt={`Foto ${index + 1}`}
            className="w-full h-full object-cover"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          />
        </div>
        
        {/* Badge de foto principal */}
        {index === 0 && (
          <div className={`absolute top-0 left-0 bg-primary text-white rounded text-[9px] flex items-center gap-0.5 shadow-md z-[60] ${
            isMobile ? 'px-1 py-0.5' : 'px-1.5 py-0.5'
          }`}>
            <Crown className={`${isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'}`} />
            {!isMobile && <span className="text-[9px]">Principal</span>}
          </div>
        )}
        
        {/* Indicador de arrastre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className={`drop-shadow-lg ${isMobile ? 'h-4 w-4 text-gray-500' : 'h-5 w-5 text-white'}`} />
        </div>
        
        {/* Botón eliminar - en móvil siempre visible, en desktop al hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-opacity z-[60] ${
            isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="Eliminar foto"
        >
          <XIcon className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        {/* Header con navegación - Simple y alto */}
        <div className="flex-none border-b border-gray-200 bg-white">
          <div className={`${isMobile ? 'px-4 py-3.5' : 'px-6 py-5'}`}>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={`flex-shrink-0 gap-2 ${isMobile ? 'h-9 px-0' : 'h-10 px-0'}`}
              >
                <ArrowLeft className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
                <span>Volver</span>
              </Button>
              
              <div className={`flex items-center flex-shrink-0 ${isMobile ? 'gap-2' : 'gap-2'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShareDialogOpen(true)}
                  className={`${isMobile ? 'h-9 w-9 p-0' : 'h-9 w-auto px-3 gap-2'}`}
                >
                  <Share2 className="h-4 w-4" />
                  {!isMobile && <span>Compartir</span>}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ${isMobile ? 'h-9 w-9 p-0' : 'h-9 w-auto px-3 gap-2'}`}
                >
                  <Trash2 className="h-4 w-4" />
                  {!isMobile && <span>Eliminar</span>}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-2 ${isMobile ? 'h-9 px-3' : 'h-9 px-3'}`}
                    >
                      {editedData.status === 'available' && <><Eye className="h-4 w-4" /><span>Disponible</span></>}
                      {editedData.status === 'unavailable' && <><EyeOff className="h-4 w-4" /><span>No disponible</span></>}
                      {editedData.status === 'sold' && <><CheckCheck className="h-4 w-4" /><span>Vendida</span></>}
                      {editedData.status === 'rented' && <><Key className="h-4 w-4" /><span>Alquilada</span></>}
                      {editedData.status === 'reserved' && <><Bookmark className="h-4 w-4" /><span>Reservada</span></>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="end">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 px-2 py-1.5">Cambiar estado:</div>
                      
                      <button
                        onClick={() => handleToggleStatus('available')}
                        className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                          editedData.status === 'available' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-green-600" />
                            Disponible
                          </span>
                          {editedData.status === 'available' && <Check className="h-4 w-4 text-[#e7af2a]" />}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 ml-5">
                          El asistente mostrará esta propiedad a los clientes
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus('unavailable')}
                        className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                          editedData.status === 'unavailable' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            <EyeOff className="h-4 w-4 text-gray-600" />
                            No disponible
                          </span>
                          {editedData.status === 'unavailable' && <Check className="h-4 w-4 text-[#e7af2a]" />}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 ml-5">
                          El asistente no mostrará esta propiedad
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus('sold')}
                        className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                          editedData.status === 'sold' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCheck className="h-4 w-4 text-red-600" />
                            Vendida
                          </span>
                          {editedData.status === 'sold' && <Check className="h-4 w-4 text-[#e7af2a]" />}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 ml-5">
                          El asistente informará que ya está vendida
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus('rented')}
                        className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                          editedData.status === 'rented' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            <Key className="h-4 w-4 text-orange-600" />
                            Alquilada
                          </span>
                          {editedData.status === 'rented' && <Check className="h-4 w-4 text-[#e7af2a]" />}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 ml-5">
                          El asistente informará que ya está alquilada
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus('reserved')}
                        className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                          editedData.status === 'reserved' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            <Bookmark className="h-4 w-4 text-yellow-600" />
                            Reservada
                          </span>
                          {editedData.status === 'reserved' && <Check className="h-4 w-4 text-[#e7af2a]" />}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 ml-5">
                          El asistente informará que está reservada
                        </span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6">
            {/* Columna izquierda - Multimedia y detalles */}
            <div className="lg:col-span-2 space-y-6">
              {/* Galería de imágenes */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div 
                  className={`relative bg-gray-100 overflow-hidden rounded-t-xl ${
                    isEditingPhotos 
                      ? isMobile ? 'aspect-video' : 'aspect-[4/3]'
                      : 'aspect-video'
                  }`}
                >
                  {editedImages.length > 0 ? (
                    <>
                      {!isEditingPhotos ? (
                        <div 
                          className="cursor-pointer"
                          onClick={() => setIsLightboxOpen(true)}
                        >
                          <SwipeableImageCarousel
                            images={editedImages}
                            currentIndex={currentImageIndex}
                            onIndexChange={setCurrentImageIndex}
                            alt={property.title}
                            className="aspect-video"
                            showIndicators={false}
                          >
                            {/* Banda de estado en esquina */}
                            <StatusCornerRibbon status={property.status} size="large" />
                            
                            {/* Marca de agua */}
                            {watermarkEnabled && agencyLogo && (
                              <div 
                                className="absolute pointer-events-none z-10"
                                style={{
                                  left: watermarkCustomPosition ? `${watermarkCustomPosition.x}%` :
                                    watermarkPosition === 'top-left' || watermarkPosition === 'bottom-left' ? '8%' :
                                    watermarkPosition === 'top-right' || watermarkPosition === 'bottom-right' ? '92%' : '50%',
                                  top: watermarkCustomPosition ? `${watermarkCustomPosition.y}%` :
                                    watermarkPosition === 'top-left' || watermarkPosition === 'top-right' ? '12%' :
                                    watermarkPosition === 'bottom-left' || watermarkPosition === 'bottom-right' ? '88%' : '50%',
                                  transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
                                  opacity: watermarkOpacity,
                                }}
                              >
                                <img 
                                  src={agencyLogo} 
                                  alt="Logo de la agencia" 
                                  className="h-auto object-contain drop-shadow-lg"
                                  style={{ width: watermarkWidth ? `${watermarkWidth}px` : 'auto' }}
                                />
                              </div>
                            )}
                            
                            {/* Botones de navegación */}
                            {editedImages.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-20"
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-20"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10 pointer-events-none">
                                  {currentImageIndex + 1} / {editedImages.length}
                                </div>
                              </>
                            )}
                            
                            {/* Popover de opciones de fotos */}
                            <PhotoOptionsPopover
                              onEditPhotos={handleStartEditPhotos}
                              onConfigureWatermark={() => setShowWatermarkSettings(!showWatermarkSettings)}
                              watermarkActive={watermarkEnabled}
                              isMobile={isMobile}
                            />
                          </SwipeableImageCarousel>
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={editedImages[currentImageIndex]}
                          alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Banner informativo en modo edición - Overlay superpuesto */}
                      {isEditingPhotos && (
                        <div className={`absolute top-0 left-0 right-0 bg-blue-50/90 backdrop-blur-sm border-b border-blue-200/50 z-20 ${isMobile ? 'py-1.5 px-3' : 'py-2 px-3'}`}>
                          <div className="flex items-center justify-between gap-2 text-blue-900">
                            <div className="flex items-center gap-2">
                              <ImagePlus className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} flex-shrink-0`} />
                              <span className={isMobile ? 'text-xs' : 'text-sm'}>
                                {isMobile ? 'Agrega o elimina fotos' : 'Modo edición: Agrega o elimina fotos de la propiedad'}
                              </span>
                            </div>
                            <button
                              onClick={handleCancelEditPhotos}
                              className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
                              title="Salir del modo edición"
                            >
                              <XIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Banda de estado en esquina - solo visible cuando NO está en modo edición */}
                      {!isEditingPhotos && <StatusCornerRibbon status={property.status} size="large" />}
                      
                      {/* Miniaturas editables como overlay inferior - solo en modo edición DESKTOP */}
                      {isEditingPhotos && !isMobile && (
                        <DndProvider backend={HTML5Backend}>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm z-20">
                            <div className="py-3 px-4 pb-5">
                              {/* Texto de ayuda */}
                              <p className="flex items-center gap-1.5 mb-3 text-white/80 text-xs">
                                <GripVertical className="h-3.5 w-3.5" />
                                Arrastra las fotos para reordenar. La primera foto será la principal.
                              </p>
                              
                              <div 
                                className="minimal-scrollbar flex overflow-x-auto overflow-y-visible gap-3 pt-2"
                                style={{
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
                                  paddingBottom: '8px'
                                }}
                              >
                                {/* Botón para agregar fotos - primero */}
                                <button
                                  onClick={handleAddPhoto}
                                  className="flex-shrink-0 rounded-lg border-2 border-dashed border-white/30 hover:border-primary hover:bg-primary/20 transition-all flex flex-col items-center justify-center gap-1 text-white hover:text-primary"
                                  style={{ width: '70px', height: '70px' }}
                                >
                                  <Plus className="h-5 w-5" />
                                  <span className="text-[9px]">Agregar</span>
                                </button>
                                
                                {/* Miniaturas arrastrables */}
                                {editedImages.map((img, idx) => (
                                  <DraggablePhotoOverlay
                                    key={idx}
                                    image={img}
                                    index={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    onRemove={() => handleRemovePhoto(idx)}
                                    isCurrent={idx === currentImageIndex}
                                    isMobile={false}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </DndProvider>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No hay fotos</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Marca de agua */}
                  {watermarkEnabled && agencyLogo && (
                    <div 
                      className="absolute pointer-events-none"
                      style={{
                        left: watermarkCustomPosition ? `${watermarkCustomPosition.x}%` :
                          watermarkPosition === 'top-left' || watermarkPosition === 'bottom-left' ? '8%' :
                          watermarkPosition === 'top-right' || watermarkPosition === 'bottom-right' ? '92%' : '50%',
                        top: watermarkCustomPosition ? `${watermarkCustomPosition.y}%` :
                          watermarkPosition === 'top-left' || watermarkPosition === 'top-right' ? '12%' :
                          watermarkPosition === 'bottom-left' || watermarkPosition === 'bottom-right' ? '88%' : '50%',
                        transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
                        opacity: watermarkOpacity,
                      }}
                    >
                      <img 
                        src={agencyLogo} 
                        alt="Logo de la agencia" 
                        className="h-auto object-contain drop-shadow-lg"
                        style={{ width: watermarkWidth ? `${watermarkWidth}px` : 'auto' }}
                      />
                    </div>
                  )}
                  
                  {editedImages.length > 1 && !isEditingPhotos && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {editedImages.length}
                      </div>
                    </>
                  )}
                  
                  {/* Popover de opciones de fotos - solo visible cuando NO está en modo edición */}
                  {!isEditingPhotos && (
                    <PhotoOptionsPopover
                      onEditPhotos={handleStartEditPhotos}
                      onConfigureWatermark={() => setShowWatermarkSettings(!showWatermarkSettings)}
                      watermarkActive={watermarkEnabled}
                      isMobile={isMobile}
                    />
                  )}
                </div>
                
                {/* Miniaturas editables debajo de la foto - solo en modo edición MÓVIL */}
                {isEditingPhotos && isMobile && (
                  <DndProvider backend={TouchBackend} options={{ 
                    enableMouseEvents: true,
                    delayTouchStart: 150,
                    ignoreContextMenu: true,
                    touchSlop: 5
                  }}>
                    <div className="bg-white border-t border-gray-200 p-4">
                      {/* Texto de ayuda */}
                      <p className="flex items-center gap-1.5 mb-3 text-gray-600 text-xs">
                        <GripVertical className="h-3.5 w-3.5" />
                        Arrastra las fotos para reordenar. La primera será la principal.
                      </p>
                      
                      <div 
                        className="minimal-scrollbar flex overflow-x-auto overflow-y-visible gap-3 pb-2"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent'
                        }}
                      >
                        {/* Botón para agregar fotos - primero */}
                        <button
                          onClick={handleAddPhoto}
                          className="flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <Plus className="h-5 w-5" />
                          <span className="text-[10px]">Agregar</span>
                        </button>
                        
                        {/* Miniaturas arrastrables */}
                        {editedImages.map((img, idx) => (
                          <DraggablePhotoOverlay
                            key={idx}
                            image={img}
                            index={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            onRemove={() => handleRemovePhoto(idx)}
                            isCurrent={idx === currentImageIndex}
                            isMobile={true}
                          />
                        ))}
                      </div>
                    </div>
                  </DndProvider>
                )}
                
                {/* Input oculto para seleccionar archivos */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
                
                {/* Botones de acción en modo edición */}
                {isEditingPhotos && (
                  <div className={`bg-white border-t border-gray-200 ${isMobile ? 'p-3' : 'p-4'}`}>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSavePhotos}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        size={isMobile ? "sm" : "default"}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {isMobile ? 'Guardar' : 'Guardar cambios'}
                      </Button>
                      <Button
                        onClick={handleCancelEditPhotos}
                        variant="outline"
                        className="flex-1"
                        size={isMobile ? "sm" : "default"}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Panel de configuración de marca de agua */}
                {!isEditingPhotos && showWatermarkSettings && (
                  <div className={`bg-amber-50 border-t border-amber-200 ${isMobile ? 'p-3' : 'p-4'}`}>
                    <div className="flex items-start gap-3">
                      <Sparkles className={`text-primary flex-shrink-0 mt-0.5 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      <div className="flex-1">
                        <h3 className={`text-gray-900 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Marca de agua personalizada</h3>
                        <p className={`text-gray-600 mb-3 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                          {isMobile ? 'Coloca tu logo sobre las fotos' : 'Oculta las marcas de agua de otros portales colocando el logo de tu agencia sobre las fotos'}
                        </p>
                        
                        {!agencyLogo ? (
                          <div className="p-4 bg-white rounded-lg border border-amber-200">
                            <div className="text-center">
                              <div className="mb-2">
                                <Building className="h-8 w-8 text-gray-400 mx-auto" />
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                Primero debes configurar el logo de tu agencia
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                Ve a Configuración → Perfil y sube el logo de tu agencia. Luego podrás usarlo como marca de agua en tus propiedades.
                              </p>
                              <Button
                                onClick={() => {
                                  // Cerrar este diálogo y navegar a perfil
                                  window.location.hash = '#/settings/profile';
                                }}
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                Ir a configurar logo
                              </Button>
                            </div>
                          </div>
                        ) : (
                        <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                          {/* Toggle de activación */}
                          <div className={`flex items-center justify-between bg-white rounded-lg border border-amber-200 ${isMobile ? 'p-2' : 'p-3'}`}>
                            <div className="flex items-center gap-2">
                              <div className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                Activar marca de agua
                              </div>
                            </div>
                            <Switch
                              checked={watermarkEnabled}
                              onCheckedChange={handleToggleWatermark}
                            />
                          </div>
                          
                          {/* Selector de posición */}
                          {watermarkEnabled && (
                            <div className={`bg-white rounded-lg border border-amber-200 ${isMobile ? 'p-2' : 'p-3'}`}>
                              <label className={`text-gray-600 mb-2 block ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                Posición de la marca de agua:
                              </label>
                              <div className={`grid grid-cols-5 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                                {[
                                  { value: 'top-left', label: '↖', title: 'Superior izquierda' },
                                  { value: 'top-right', label: '↗', title: 'Superior derecha' },
                                  { value: 'center', label: '⊙', title: 'Centro' },
                                  { value: 'bottom-left', label: '↙', title: 'Inferior izquierda' },
                                  { value: 'bottom-right', label: '↘', title: 'Inferior derecha' }
                                ].map((pos) => (
                                  <button
                                    key={pos.value}
                                    onClick={() => handleChangeWatermarkPosition(pos.value as Property['watermarkPosition'])}
                                    className={`rounded-md border-2 transition-all ${
                                      isMobile ? 'p-1.5 text-base' : 'p-2 text-lg'
                                    } ${
                                      watermarkPosition === pos.value
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
                          )}
                          
                          {/* Vista previa del logo */}
                          {watermarkEnabled && (
                            <div className="p-3 bg-white rounded-lg border border-amber-200">
                              <label className="text-xs text-gray-600 mb-2 block">
                                Vista previa del logo:
                              </label>
                              <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                                <img 
                                  src={agencyLogo} 
                                  alt="Logo de la agencia" 
                                  className="h-12 w-auto object-contain"
                                  style={{ opacity: 0.7 }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                El logo aparecerá con 70% de opacidad sobre las fotos
                              </p>
                            </div>
                          )}
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Título y ubicación de la propiedad */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                {!isEditingTitle ? (
                  <>
                    <button
                      onClick={handleStartEditTitle}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                      title="Editar título y ubicación"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                    </button>
                    <h1 className="text-gray-900 mb-3 pr-16">{property.title}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        {property.showExactLocation !== false ? (
                          <MapPin className="h-3.5 w-3.5" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 opacity-50" />
                        )}
                        {property.location}
                      </span>
                      {property.showExactLocation === false && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            Ubicación aproximada
                          </span>
                        </>
                      )}
                      {property.idealistaUrl && (
                        <>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={handleOpenIdealista}
                            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <span>Ver en Idealista</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title" className="text-sm text-gray-700 mb-1.5 block">Título</Label>
                      <Input
                        id="edit-title"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder="Título de la propiedad"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-location" className="text-sm text-gray-700 mb-1.5 block">Ubicación</Label>
                      <Input
                        id="edit-location"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        placeholder="Ubicación"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveTitle} size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancelEditTitle} size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Precio y características principales */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                {!isEditingPrice ? (
                  <>
                    {/* Botón editar en esquina superior derecha del card */}
                    <button
                      onClick={handleStartEditPrice}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                      title="Editar características"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                    </button>
                    {/* Precio destacado */}
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 mb-4 mt-8">
                      <div className="text-3xl text-gray-900 mb-0.5">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(property.pricePerM2)}/m²
                      </div>
                    </div>

                    {/* Características principales en cards compactas */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Tipo de propiedad */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <Building2 className="h-4 w-4 text-purple-600 mb-1" />
                        <div className="text-sm text-gray-900">{getPropertyTypeLabel(property.propertyType)}</div>
                        <div className="text-xs text-gray-600">{property.operation === 'sale' ? 'Venta' : 'Alquiler'}</div>
                      </div>
                      
                      {/* Superficie construida */}
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <Maximize className="h-4 w-4 text-primary mb-1" />
                        <div className="text-sm text-gray-900">{property.constructedArea} m²</div>
                        <div className="text-xs text-gray-600">Construidos</div>
                      </div>
                      
                      {/* Habitaciones */}
                      {propertyFeatures.hasBedrooms && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <Bed className="h-4 w-4 text-blue-600 mb-1" />
                          <div className="text-sm text-gray-900">{property.bedrooms}</div>
                          <div className="text-xs text-gray-600">Dormitorios</div>
                        </div>
                      )}
                      
                      {/* Baños */}
                      {propertyFeatures.hasBathrooms && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <Bath className="h-4 w-4 text-cyan-600 mb-1" />
                          <div className="text-sm text-gray-900">{property.bathrooms}</div>
                          <div className="text-xs text-gray-600">Baños</div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="edit-price" className="text-sm text-gray-700 mb-1.5 block">Precio (€)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-price-m2" className="text-sm text-gray-700 mb-1.5 block">Precio/m² (€)</Label>
                        <Input
                          id="edit-price-m2"
                          type="number"
                          value={tempPricePerM2}
                          onChange={(e) => setTempPricePerM2(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="edit-constructed" className="text-sm text-gray-700 mb-1.5 block">M² Construidos</Label>
                        <Input
                          id="edit-constructed"
                          type="number"
                          value={tempConstructedArea}
                          onChange={(e) => setTempConstructedArea(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-usable" className="text-sm text-gray-700 mb-1.5 block">M² Útiles</Label>
                        <Input
                          id="edit-usable"
                          type="number"
                          value={tempUsableArea}
                          onChange={(e) => setTempUsableArea(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    {propertyFeatures.hasBedrooms && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="edit-bedrooms" className="text-sm text-gray-700 mb-1.5 block">Habitaciones</Label>
                          <Input
                            id="edit-bedrooms"
                            type="number"
                            value={tempBedrooms}
                            onChange={(e) => setTempBedrooms(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        {propertyFeatures.hasBathrooms && (
                          <div>
                            <Label htmlFor="edit-bathrooms" className="text-sm text-gray-700 mb-1.5 block">Baños</Label>
                            <Input
                              id="edit-bathrooms"
                              type="number"
                              value={tempBathrooms}
                              onChange={(e) => setTempBathrooms(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSavePrice} size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancelEditPrice} size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {(property.description || isEditingDescription) && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                  {!isEditingDescription ? (
                    <>
                      <button
                        onClick={handleStartEditDescription}
                        className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                        title="Editar descripción"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                      </button>
                      <h2 className="text-lg text-gray-900 mb-3">Descripción</h2>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{property.description}</p>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="edit-description" className="text-sm text-gray-700 mb-1.5 block">Descripción</Label>
                      
                      {/* Botón para generar con IA - diseño sutil */}
                      <button
                        onClick={handleOpenAIModal}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-white hover:bg-primary/5 border-2 border-primary/20 hover:border-primary rounded-lg transition-all group relative overflow-hidden"
                      >
                        {/* Efecto de brillo sutil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform relative z-10" />
                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors relative z-10">Generar descripción con IA</span>
                      </button>
                      
                      <Textarea
                        id="edit-description"
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        placeholder="Escribe una descripción o usa la IA para generarla..."
                        rows={6}
                        className="w-full resize-none"
                      />
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveDescription} size="sm" className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Guardar
                        </Button>
                        <Button onClick={handleCancelEditDescription} size="sm" variant="outline" className="flex-1">
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detalles adicionales */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                {!isEditingDetails ? (
                  <>
                    <button
                      onClick={handleStartEditDetails}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                      title="Editar detalles"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                    </button>
                    <h2 className="text-lg text-gray-900 mb-4">Detalles</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Superficie útil */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <Ruler className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">Superficie útil</span>
                        </div>
                        <span className="text-sm text-gray-900 font-medium ml-2">{property.usableArea} m²</span>
                      </div>
                      
                      {propertyFeatures.hasFloor && property.floor && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <Layers className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Planta</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium ml-2">{property.floor}</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasYearBuilt && property.yearBuilt && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Construido en</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium ml-2">{property.yearBuilt}</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasCondition && property.condition && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Estado</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium ml-2">{getConditionLabel(property.condition)}</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasOrientation && property.orientation && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <Compass className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Orientación</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium ml-2">{property.orientation}</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasEnergyRating && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <ThermometerSun className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Certificación</span>
                          </div>
                          <Badge className={`${energyCert.color} text-white text-xs px-2 py-0.5`}>
                            {energyCert.label}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-lg text-gray-900 mb-4">Editar detalles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {propertyFeatures.hasFloor && (
                        <div>
                          <Label htmlFor="edit-floor" className="text-sm text-gray-700 mb-1.5 block">Planta</Label>
                          <Input
                            id="edit-floor"
                            value={tempFloor}
                            onChange={(e) => setTempFloor(e.target.value)}
                            placeholder="Ej: 3º, Bajo, Ático"
                            className="w-full"
                          />
                        </div>
                      )}
                      {propertyFeatures.hasYearBuilt && (
                        <div>
                          <Label htmlFor="edit-year" className="text-sm text-gray-700 mb-1.5 block">Año construcción</Label>
                          <Input
                            id="edit-year"
                            type="number"
                            value={tempYearBuilt}
                            onChange={(e) => setTempYearBuilt(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}
                      {propertyFeatures.hasCondition && (
                        <div>
                          <Label htmlFor="edit-condition" className="text-sm text-gray-700 mb-1.5 block">Estado</Label>
                          <Select value={tempCondition} onValueChange={(value: Property['condition']) => setTempCondition(value)}>
                            <SelectTrigger id="edit-condition">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Obra nueva</SelectItem>
                              <SelectItem value="good">Buen estado</SelectItem>
                              <SelectItem value="to-renovate">A reformar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {propertyFeatures.hasOrientation && (
                        <div>
                          <Label htmlFor="edit-orientation" className="text-sm text-gray-700 mb-1.5 block">Orientación</Label>
                          <Input
                            id="edit-orientation"
                            value={tempOrientation}
                            onChange={(e) => setTempOrientation(e.target.value)}
                            placeholder="Ej: Sur, Norte, Este"
                            className="w-full"
                          />
                        </div>
                      )}
                      {propertyFeatures.hasEnergyRating && (
                        <div>
                          <Label htmlFor="edit-energy" className="text-sm text-gray-700 mb-1.5 block">Certificación energética</Label>
                          <Select value={tempEnergyCertification} onValueChange={(value: Property['energyCertification']) => setTempEnergyCertification(value)}>
                            <SelectTrigger id="edit-energy">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="E">E</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                              <SelectItem value="G">G</SelectItem>
                              <SelectItem value="pending">En trámite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveDetails} size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancelEditDetails} size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Equipamiento */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                {!isEditingFeatures ? (
                  <>
                    <button
                      onClick={handleStartEditFeatures}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                      title="Editar equipamiento"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                    </button>
                    <h2 className="text-lg text-gray-900 mb-4">Equipamiento</h2>
                    
                    <div className="flex flex-wrap gap-2">
                      {propertyFeatures.hasElevator && property.hasElevator && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Building2 className="h-4 w-4" />
                          <span>Ascensor</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasAirConditioning && property.hasAirConditioning && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Wind className="h-4 w-4" />
                          <span>Aire acondicionado</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasHeating && property.hasHeating && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Flame className="h-4 w-4" />
                          <span>Calefacción{property.heatingType ? ` (${property.heatingType})` : ''}</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasParking && property.hasParking && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <ParkingCircle className="h-4 w-4" />
                          <span>Parking</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasStorage && property.hasStorage && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Warehouse className="h-4 w-4" />
                          <span>Trastero</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasTerrace && property.hasTerrace && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Home className="h-4 w-4" />
                          <span>Terraza</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasBalcony && property.hasBalcony && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Home className="h-4 w-4" />
                          <span>Balcón</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasGarden && property.hasGarden && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Trees className="h-4 w-4" />
                          <span>Jardín</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasPool && property.hasPool && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Waves className="h-4 w-4" />
                          <span>Piscina</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasWardrobes && property.hasBuiltInWardrobes && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Building2 className="h-4 w-4" />
                          <span>Armarios empotrados</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasFurnished && property.isFurnished && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <Home className="h-4 w-4" />
                          <span>Amueblado</span>
                        </div>
                      )}
                      
                      {propertyFeatures.hasAccessible && property.isAccessible && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Accesible</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg text-gray-900">Editar equipamiento</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {propertyFeatures.hasElevator && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasElevator} onCheckedChange={setTempHasElevator} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasElevator(!tempHasElevator)}>
                            Ascensor
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasAirConditioning && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasAirConditioning} onCheckedChange={setTempHasAirConditioning} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasAirConditioning(!tempHasAirConditioning)}>
                            Aire acondicionado
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasHeating && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasHeating} onCheckedChange={setTempHasHeating} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasHeating(!tempHasHeating)}>
                            Calefacción
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasParking && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasParking} onCheckedChange={setTempHasParking} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasParking(!tempHasParking)}>
                            Parking
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasStorage && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasStorage} onCheckedChange={setTempHasStorage} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasStorage(!tempHasStorage)}>
                            Trastero
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasTerrace && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasTerrace} onCheckedChange={setTempHasTerrace} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasTerrace(!tempHasTerrace)}>
                            Terraza
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasBalcony && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasBalcony} onCheckedChange={setTempHasBalcony} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasBalcony(!tempHasBalcony)}>
                            Balcón
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasGarden && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasGarden} onCheckedChange={setTempHasGarden} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasGarden(!tempHasGarden)}>
                            Jardín
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasPool && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasPool} onCheckedChange={setTempHasPool} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasPool(!tempHasPool)}>
                            Piscina
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasWardrobes && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempHasBuiltInWardrobes} onCheckedChange={setTempHasBuiltInWardrobes} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempHasBuiltInWardrobes(!tempHasBuiltInWardrobes)}>
                            Armarios empotrados
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasFurnished && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempIsFurnished} onCheckedChange={setTempIsFurnished} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempIsFurnished(!tempIsFurnished)}>
                            Amueblado
                          </Label>
                        </div>
                      )}
                      {propertyFeatures.hasAccessible && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Switch checked={tempIsAccessible} onCheckedChange={setTempIsAccessible} />
                          <Label className="text-sm cursor-pointer" onClick={() => setTempIsAccessible(!tempIsAccessible)}>
                            Accesible
                          </Label>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveFeatures} size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancelEditFeatures} size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enlaces multimedia */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Video className="h-5 w-5 text-primary" />
                  <h2 className="text-lg text-gray-900">Enlaces multimedia</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">Añade enlaces a reels, TikToks o vídeos de la propiedad</p>

                {/* Info box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="flex gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900">
                      El asistente de IA usará estos enlaces para compartir contenido multimedia de la propiedad
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Instagram */}
                  {editingChannel === 'instagram' ? (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={tempLink}
                          onChange={(e) => setTempLink(e.target.value)}
                          placeholder="https://www.instagram.com/reel/..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          autoFocus
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-9 px-3"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveLink('instagram')}
                        className="h-9 px-3 bg-purple-600 hover:bg-purple-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : property.socialLinks?.instagram ? (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={property.socialLinks!.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-900 font-medium hover:text-purple-600 hover:underline transition-colors"
                        >
                          Ver vídeo de Instagram
                        </a>
                      </div>
                      
                      {/* Desktop - 3 botones */}
                      <div className="hidden md:flex gap-1">
                        <button
                          type="button"
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Ver enlace"
                          onClick={() => window.open(property.socialLinks!.instagram, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-purple-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit('instagram')}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Editar enlace"
                        >
                          <Edit2 className="h-4 w-4 text-purple-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink('instagram')}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar enlace"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      {/* Mobile - Menú 3 puntos */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-purple-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartEdit('instagram')}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar enlace
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLink('instagram')}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar enlace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('instagram')}
                      className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center flex-shrink-0 transition-all">
                        <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">Vídeo de Instagram no agregado</span>
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-purple-600 ml-auto" />
                    </button>
                  )}

                  {/* Facebook */}
                  {editingChannel === 'facebook' ? (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Facebook className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={tempLink}
                          onChange={(e) => setTempLink(e.target.value)}
                          placeholder="https://www.facebook.com/..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          autoFocus
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-9 px-3"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveLink('facebook')}
                        className="h-9 px-3 bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : property.socialLinks?.facebook ? (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl group">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Facebook className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={property.socialLinks!.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-900 font-medium hover:text-blue-600 hover:underline transition-colors"
                        >
                          Ver vídeo de Facebook
                        </a>
                      </div>
                      
                      {/* Desktop - 3 botones */}
                      <div className="hidden md:flex gap-1">
                        <button
                          type="button"
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver enlace"
                          onClick={() => window.open(property.socialLinks!.facebook, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit('facebook')}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar enlace"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink('facebook')}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar enlace"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      {/* Mobile - Menú 3 puntos */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-blue-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartEdit('facebook')}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar enlace
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLink('facebook')}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar enlace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('facebook')}
                      className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-600 flex items-center justify-center flex-shrink-0 transition-all">
                        <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">Vídeo de Facebook no agregado</span>
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
                    </button>
                  )}

                  {/* TikTok */}
                  {editingChannel === 'tiktok' ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <TikTokIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={tempLink}
                          onChange={(e) => setTempLink(e.target.value)}
                          placeholder="https://www.tiktok.com/@usuario/video/..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 outline-none"
                          autoFocus
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-9 px-3"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveLink('tiktok')}
                        className="h-9 px-3 bg-gray-900 hover:bg-gray-800"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : property.socialLinks?.tiktok ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-xl group">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <TikTokIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={property.socialLinks!.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-900 font-medium hover:text-gray-600 hover:underline transition-colors"
                        >
                          Ver vídeo de TikTok
                        </a>
                      </div>
                      
                      {/* Desktop - 3 botones */}
                      <div className="hidden md:flex gap-1">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Ver enlace"
                          onClick={() => window.open(property.socialLinks!.tiktok, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit('tiktok')}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Editar enlace"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink('tiktok')}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar enlace"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      {/* Mobile - Menú 3 puntos */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartEdit('tiktok')}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar enlace
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLink('tiktok')}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar enlace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('tiktok')}
                      className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center flex-shrink-0 transition-all">
                        <TikTokIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">Vídeo de TikTok no agregado</span>
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-gray-600 ml-auto" />
                    </button>
                  )}

                  {/* YouTube */}
                  {editingChannel === 'youtube' ? (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                        <Youtube className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={tempLink}
                          onChange={(e) => setTempLink(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                          autoFocus
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-9 px-3"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveLink('youtube')}
                        className="h-9 px-3 bg-red-600 hover:bg-red-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : property.socialLinks?.youtube ? (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl group">
                      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                        <Youtube className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={property.socialLinks!.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-900 font-medium hover:text-red-600 hover:underline transition-colors"
                        >
                          Ver vídeo de YouTube
                        </a>
                      </div>
                      
                      {/* Desktop - 3 botones */}
                      <div className="hidden md:flex gap-1">
                        <button
                          type="button"
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Ver enlace"
                          onClick={() => window.open(property.socialLinks!.youtube, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-red-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit('youtube')}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Editar enlace"
                        >
                          <Edit2 className="h-4 w-4 text-red-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink('youtube')}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar enlace"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      {/* Mobile - Menú 3 puntos */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-red-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartEdit('youtube')}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar enlace
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLink('youtube')}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar enlace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('youtube')}
                      className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-all">
                        <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">Vídeo de YouTube no agregado</span>
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-red-600 ml-auto" />
                    </button>
                  )}
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 relative">
                {!isEditingLocation ? (
                  <>
                    <button
                      onClick={handleStartEditLocation}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group"
                      title="Editar ubicación"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm hidden lg:inline group-hover:text-gray-600">Editar</span>
                    </button>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-lg text-gray-900">Ubicación</h2>
                      {property.showExactLocation === false && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Ubicación aproximada
                        </Badge>
                      )}
                    </div>
                    
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                      <iframe
                        title="Mapa de ubicación"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-lg text-gray-900">Editar Ubicación</h2>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-location-map" className="text-sm text-gray-700 mb-1.5 block">Dirección</Label>
                      <Input
                        id="edit-location-map"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        placeholder="Ubicación"
                        className="w-full"
                      />
                    </div>
                    
                    {/* Toggle de ubicación exacta */}
                    <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          {tempShowExactLocation ? (
                            <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm text-gray-900">Mostrar ubicación exacta</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {tempShowExactLocation 
                                ? 'La dirección exacta será visible en el mapa'
                                : 'Solo se mostrará la zona aproximada'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={tempShowExactLocation}
                          onCheckedChange={(checked) => setTempShowExactLocation(checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveLocation} size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancelEditLocation} size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Interesados */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                  {/* Estadísticas de la propiedad */}
                  {((property.interestedLeads && property.interestedLeads.length > 0) || property.socialLinks) && (
                    <div className="mb-4">
                      <PropertyStats 
                        leads={property.interestedLeads || []} 
                        socialLinks={property.socialLinks}
                        isPublicView={false}
                      />
                    </div>
                  )}

                  {previewLeads.length > 0 ? (
                    <div className="space-y-3">
                      {/* Título de la sección */}
                      <h2 className="text-lg text-gray-900">Interesados</h2>
                      
                      {/* Separador antes del listado */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Listado de interesados</p>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                      
                      {previewLeads.map((lead) => {
                        const qualColor = getQualificationColor(lead.qualification);
                        return (
                          <button
                            key={lead.id}
                            onClick={() => {
                              setSelectedLeadId(lead.id);
                              setChatOpen(true);
                              // Marcar como leído al hacer clic
                              setReadLeads(prev => new Set(prev).add(lead.id));
                            }}
                            className="w-full p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all text-left group"
                          >
                            <div className="flex items-center gap-3">
                              {/* Avatar con badge del canal */}
                              <div className="relative flex-shrink-0">
                                <ImageWithFallback 
                                  src={lead.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'} 
                                  alt={lead.name || lead.phone}
                                  className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAvatarLightbox({
                                      open: true,
                                      src: lead.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
                                      name: (() => {
                                        const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                                        const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                                        return savedContact?.name || lead.phone;
                                      })()
                                    });
                                  }}
                                />
                                {/* Badge flotante del canal */}
                                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
                                  {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3 w-3" /> : 
                                   lead.source === 'instagram' ? <Instagram className="h-3 w-3" /> :
                                   lead.source === 'messenger' ? <MessengerIcon className="h-3 w-3" /> :
                                   lead.source === 'tiktok' ? <TikTokIcon className="h-3 w-3" /> :
                                   <WhatsAppIcon className="h-3 w-3" />}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    {/* Mostrar nombre guardado o número de teléfono */}
                                    <p className={`text-sm truncate ${!readLeads.has(lead.id) ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                      {(() => {
                                        // Verificar si el contacto está guardado en localStorage
                                        const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                                        const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                                        // Si está guardado, mostrar el nombre guardado
                                        if (savedContact?.name) {
                                          return savedContact.name;
                                        }
                                        // Si no está guardado, mostrar el número
                                        return lead.phone;
                                      })()}
                                    </p>
                                    <p className={`text-xs truncate mt-1 max-w-[220px] ${!readLeads.has(lead.id) ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                      {(() => {
                                        // Obtener el último mensaje de la conversación
                                        const conversation = propertyConversations.find(c => c.leadId === lead.id);
                                        if (conversation && conversation.messages.length > 0) {
                                          const lastMessage = conversation.messages[conversation.messages.length - 1];
                                          return lastMessage.text;
                                        }
                                        return 'Interesado en la propiedad...';
                                      })()}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <Badge 
                                      className={`${qualColor.bg} ${qualColor.text} ${qualColor.border} text-xs px-2.5 py-1 border cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLeadId(lead.id);
                                        setQualificationOpen(true);
                                      }}
                                    >
                                      {lead.qualification}%
                                    </Badge>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDateShort(lead.lastContact)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      
                      {hasMoreLeads && (
                        <button
                          onClick={() => setIsInterestedDialogOpen(true)}
                          className="w-full p-3 rounded-lg border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all text-sm text-gray-600 hover:text-primary"
                        >
                          Ver todos los interesados ({property.interestedLeads?.length || 0})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Aún no hay interesados en esta propiedad
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de todos los interesados */}
      <Dialog open={isInterestedDialogOpen} onOpenChange={setIsInterestedDialogOpen}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center gap-2">
            <DialogTitle>Todos los interesados</DialogTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {property.interestedLeads?.length || 0}
            </Badge>
          </div>
          <DialogDescription>
            Lista completa de personas interesadas en esta propiedad
          </DialogDescription>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-2 mt-4">
              
              {property.interestedLeads?.map((lead) => {
                const qualColor = getQualificationColor(lead.qualification);
                return (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLeadId(lead.id);
                      setIsInterestedDialogOpen(false);
                      setQualificationOpen(true);
                      // Marcar como leído al hacer clic
                      setReadLeads(prev => new Set(prev).add(lead.id));
                    }}
                    className="w-full p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar con badge de canal */}
                      <div className="relative flex-shrink-0">
                        <ImageWithFallback 
                          src={lead.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'} 
                          alt={lead.name || lead.phone}
                          className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAvatarLightbox({
                              open: true,
                              src: lead.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
                              name: (() => {
                                const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                                const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                                return savedContact?.name || lead.phone;
                              })()
                            });
                          }}
                        />
                        {/* Badge flotante del canal */}
                        <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
                          {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3 w-3" /> : 
                           lead.source === 'instagram' ? <Instagram className="h-3 w-3" /> :
                           lead.source === 'messenger' ? <MessengerIcon className="h-3 w-3" /> :
                           lead.source === 'tiktok' ? <TikTokIcon className="h-3 w-3" /> :
                           <WhatsAppIcon className="h-3 w-3" />}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {/* Mostrar nombre guardado o número de teléfono */}
                            <p className={`text-sm text-gray-900 truncate ${!readLeads.has(lead.id) ? 'font-semibold' : ''}`}>
                              {(() => {
                                // Verificar si el contacto está guardado en localStorage
                                const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                                const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                                // Si está guardado, mostrar el nombre guardado
                                if (savedContact?.name) {
                                  return savedContact.name;
                                }
                                // Si no está guardado, mostrar el número
                                return lead.phone;
                              })()}
                            </p>
                            <p className={`text-xs text-gray-900 truncate mt-1 max-w-[220px] ${!readLeads.has(lead.id) ? 'font-semibold' : ''}`}>
                              {(() => {
                                // Obtener el último mensaje de la conversación
                                const conversation = propertyConversations.find(c => c.leadId === lead.id);
                                if (conversation && conversation.messages.length > 0) {
                                  const lastMessage = conversation.messages[conversation.messages.length - 1];
                                  return lastMessage.text;
                                }
                                return 'Interesado en la propiedad...';
                              })()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <Badge 
                              className={`${qualColor.bg} ${qualColor.text} ${qualColor.border} text-xs px-2.5 py-1 border cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLeadId(lead.id);
                                setIsInterestedDialogOpen(false);
                                setQualificationOpen(true);
                              }}
                            >
                              {lead.qualification}%
                            </Badge>
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDateShort(lead.lastContact)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Diálogo de compartir */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogTitle>Compartir propiedad</DialogTitle>
          <DialogDescription>
            Comparte la ficha pública de esta propiedad
          </DialogDescription>
          
          <div className="space-y-4 mt-4">
            {/* Campo para copiar enlace */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={getPublicUrl()}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(getPublicUrl());
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                  toast.success('Enlace copiado al portapapeles');
                }}
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Botones de compartir */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center gap-2 border-2 hover:bg-green-50 hover:border-[#25D366]"
                onClick={() => {
                  const message = `🏠 *${property.title}*\n\n📍 ${property.location}\n💰 ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price)}\n\n🔗 Ver más detalles:\n${getPublicUrl()}`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
                <span className="text-sm">WhatsApp</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-600"
                onClick={() => {
                  const subject = `🏠 ${property.title}`;
                  const body = `Hola,\n\nTe comparto esta propiedad que puede interesarte:\n\n🏠 ${property.title}\n📍 ${property.location}\n💰 ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price)}\n\n🔗 Ver detalles completos:\n${getPublicUrl()}\n\nSaludos`;
                  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  window.location.href = mailtoUrl;
                }}
              >
                <Mail className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Email</span>
              </Button>
            </div>
            
            {/* Opción para mostrar resumen de interesados */}
            {property.interestedLeads && property.interestedLeads.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="show-interested-summary" className="text-sm text-amber-900 cursor-pointer">
                      Mostrar interés en la vista compartida
                    </Label>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Genera FOMO mostrando {property.interestedLeads.length} {property.interestedLeads.length === 1 ? 'interesado' : 'interesados'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="show-interested-summary"
                  checked={showInterestedSummary}
                  onCheckedChange={(checked) => {
                    setShowInterestedSummary(checked);
                    const savedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
                    const updatedProperties = savedProperties.map((p: Property) => 
                      p.id === property.id ? { ...p, showInterestedSummary: checked } : p
                    );
                    localStorage.setItem('properties', JSON.stringify(updatedProperties));
                  }}
                />
              </div>
            )}
            
            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Ver ficha pública
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La propiedad "{property.title}" será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(property.id);
                onClose();
                toast.success('Propiedad eliminada correctamente');
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar propiedad
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Visor moderno de galería */}
      <ImageGalleryViewer
        images={editedImages}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setCurrentImageIndex}
        title={property.title}
        watermark={watermarkEnabled && agencyLogo ? {
          enabled: true,
          logo: agencyLogo,
          position: watermarkPosition,
          customPosition: watermarkCustomPosition,
          opacity: watermarkOpacity,
          rotation: watermarkRotation,
          width: watermarkWidth
        } : undefined}
      />

      {/* Panel de cualificación */}
      {selectedLeadId && (
        <QualificationPanel
          open={qualificationOpen}
          onOpenChange={setQualificationOpen}
          lead={convertToLead(property.interestedLeads?.find(l => l.id === selectedLeadId))}
          onUpdate={(leadId, updates) => {
            // Aquí iría la lógica para actualizar el lead
            console.log('Actualizar lead:', leadId, updates);
          }}
          onOpenChat={() => {
            setQualificationOpen(false);
            setChatOpen(true);
          }}
        />
      )}

      {/* Sheet de conversación */}
      {selectedLeadId && (() => {
        const lead = property.interestedLeads?.find(l => l.id === selectedLeadId);
        const conversation = propertyConversations.find(c => c.leadId === selectedLeadId);
        
        return lead ? (
          <OldConversationSheet
            open={chatOpen}
            onOpenChange={setChatOpen}
            lead={convertToLead(lead)}
            conversation={conversation}
            onSaveContact={(leadId) => {
              console.log('Guardar contacto:', leadId);
            }}
            onCall={(phone) => {
              console.log('Llamar a:', phone);
            }}
            onOpenQualification={() => {
              setChatOpen(false);
              setQualificationOpen(true);
            }}
          />
        ) : null;
      })()}

      {/* Editor de marca de agua - Pantalla completa */}
      {showWatermarkSettings && (
        <WatermarkEditorFullScreen
          property={property}
          agencyLogo={agencyLogo}
          watermarkEnabled={watermarkEnabled}
          watermarkPosition={watermarkPosition}
          watermarkSize={watermarkSize}
          watermarkOpacity={watermarkOpacity}
          watermarkRotation={watermarkRotation}
          watermarkCustomPosition={watermarkCustomPosition}
          watermarkWidth={watermarkWidth}
          onClose={() => setShowWatermarkSettings(false)}
          onSave={handleSaveWatermarkSettings}
        />
      )}

      {/* Lightbox para avatar de contacto */}
      <Dialog open={avatarLightbox.open} onOpenChange={(open) => setAvatarLightbox({...avatarLightbox, open})}>
        <DialogContent className="max-w-2xl p-0">
          <DialogTitle className="sr-only">Foto de {avatarLightbox.name}</DialogTitle>
          <DialogDescription className="sr-only">Vista ampliada de la foto de perfil</DialogDescription>
          <div className="relative aspect-square bg-black">
            <ImageWithFallback
              src={avatarLightbox.src}
              alt={avatarLightbox.name}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {avatarLightbox.name}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Generación de Descripción con IA */}
      <Dialog open={showAIDescriptionModal} onOpenChange={setShowAIDescriptionModal}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] p-4' : 'max-w-2xl'}`}>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generar descripción con IA
          </DialogTitle>
          <DialogDescription>
            Selecciona un estilo o personaliza las instrucciones para generar la descripción perfecta
          </DialogDescription>
          
          <div className="space-y-4 mt-4">
            {/* Estilos rápidos */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Estilo de descripción</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: 'comercial', label: 'Comercial', icon: '💼', desc: 'Enfocado en venta rápida' },
                  { value: 'lujo', label: 'Lujo', icon: '✨', desc: 'Exclusivo y premium' },
                  { value: 'moderno', label: 'Moderno', icon: '🏙️', desc: 'Contemporáneo y urbano' },
                  { value: 'familiar', label: 'Familiar', icon: '🏡', desc: 'Cálido y acogedor' },
                  { value: 'formal', label: 'Formal', icon: '📋', desc: 'Profesional y técnico' },
                  { value: 'informal', label: 'Informal', icon: '😊', desc: 'Cercano y amigable' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setAiDescriptionStyle(style.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      aiDescriptionStyle === style.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{style.icon}</span>
                      <span className={`text-sm font-medium ${
                        aiDescriptionStyle === style.value ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Instrucciones personalizadas */}
            <div>
              <Label htmlFor="ai-instructions" className="text-sm text-gray-700 mb-1.5 block">
                Instrucciones adicionales (opcional)
              </Label>
              <Textarea
                id="ai-instructions"
                value={aiCustomInstructions}
                onChange={(e) => setAiCustomInstructions(e.target.value)}
                placeholder="Ej: Mencionar la proximidad al metro, destacar las vistas, incluir que acepta mascotas..."
                rows={3}
                className="w-full resize-none text-sm"
              />
            </div>

            {/* Preview de la descripción generada */}
            {aiGeneratedPreview && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <Label className="text-sm font-medium text-amber-900">Descripción generada</Label>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {aiGeneratedPreview}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {!aiGeneratedPreview ? (
                <>
                  <Button
                    onClick={handleGenerateDescriptionWithAI}
                    disabled={isGeneratingDescription}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generar descripción
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowAIDescriptionModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isGeneratingDescription}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleApplyAIDescription}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aplicar descripción
                  </Button>
                  <Button
                    onClick={handleGenerateDescriptionWithAI}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAIDescriptionModal(false);
                      setAiGeneratedPreview('');
                    }}
                    variant="ghost"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { LeadDetailsDialog } from "./lead-details-dialog";
import { ContactDataPills } from "./contact-data-pills";
import { ContactDetailsSheet } from "../contacts/contact-details-sheet";
import { PropertyDetail } from "../properties/property-detail";
import { 
  getUnreadConversations, 
  saveUnreadConversations, 
  markConversationAsRead,
  initializeUnreadConversations 
} from "../../utils/conversation-state";
// import { ChatSidebar } from "../conversations/chat-sidebar";
import { useDrag, useDrop } from 'react-dnd';
import {
  Users,
  Search,
  Phone,
  Calendar,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Home,
  AlertTriangle,
  Plus,
  Star,
  Zap,
  ArrowRight,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Send,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  UserPlus,
  Settings2,
  Mail,
  GripVertical,
  ExternalLink,
  BotOff,
  Bot,
  HelpCircle,
  Instagram,
  MessageCircle,
  MessageSquare,
  Building2,
  Key,
  Lock,
  Info,
  BedDouble,
  Bed,
  Bath,
  Maximize2,
  Maximize,
  Share,
  Pencil
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";

// Configuración de cualificaciones - Basado en % de preguntas contestadas
const qualificationConfig = {
  'very-qualified': { label: 'Muy cualificado', shortLabel: 'Muy cualificado', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: Star },
  'qualified': { label: 'Cualificado', shortLabel: 'Cualificado', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', icon: CheckCircle },
  'little-qualified': { label: 'Poco cualificado', shortLabel: 'Poco cualificado', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: BarChart3 },
  'very-little-qualified': { label: 'Muy poco cualificado', shortLabel: 'Muy poco cualificado', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: AlertCircle }
};

// Función helper para calcular el score dinámicamente basado en preguntas respondidas
const calculateLeadScore = (lead: Lead): number => {
  const lockedQuestionsTotal = 3; // Nombre, teléfono, tipo de cliente (preguntas bloqueadas)
  const leadQuestions = lead.qualificationQuestions || [];
  
  // Si el rol es "otros" (sin definir), solo contamos las 3 preguntas bloqueadas
  // porque el asistente no puede hacer las preguntas del rol sin saber qué tipo de cliente es
  const totalQuestions = lead.intention === 'otros' 
    ? lockedQuestionsTotal 
    : leadQuestions.length + lockedQuestionsTotal;
  
  if (totalQuestions === 0) return 0;
  
  // Contar preguntas bloqueadas respondidas
  let lockedAnswered = 0;
  
  // Pregunta 1: Nombre - respondida si hay nombre del cliente o de la plataforma
  const hasName = (lead.contactName && lead.contactName !== '-') || 
                  lead.whatsappName || lead.instagramUsername || 
                  lead.messengerName || lead.tiktokUsername;
  if (hasName) lockedAnswered++;
  
  // Pregunta 2: Teléfono - siempre respondida
  lockedAnswered++;
  
  // Pregunta 3: Tipo de cliente - respondida si no es "otros"
  if (lead.intention !== 'otros') lockedAnswered++;
  
  // Si el rol es "otros", no contamos las preguntas del rol
  if (lead.intention === 'otros') {
    return Math.round((lockedAnswered / totalQuestions) * 100);
  }
  
  // Contar preguntas del lead con respuesta
  const leadAnsweredCount = leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
  
  const totalAnswered = leadAnsweredCount + lockedAnswered;
  
  // Calcular porcentaje
  return Math.round((totalAnswered / totalQuestions) * 100);
};

// Función para formatear precios (igual que en property-detail.tsx)
const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
  if (isNaN(numPrice)) return price;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
};

// Función para calcular precio por metro cuadrado
const calculatePricePerM2 = (price: string, area: number): number => {
  const numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
  if (isNaN(numPrice) || area === 0) return 0;
  return Math.round(numPrice / area);
};

// Función para convertir Property del formato leads a property-detail
const convertPropertyToDetailFormat = (property: Property): any => {
  const numPrice = parseFloat(property.price.replace(/[^\d.-]/g, ''));
  const pricePerM2 = calculatePricePerM2(property.price, property.area);
  
  // Mapeo de tipos de propiedad
  const typeMap: Record<string, string> = {
    'Piso': 'condo',
    'Apartamento': 'apartment',
    'Casa': 'house',
    'Casa rústica': 'house',
    'Chalé': 'house',
    'Ático': 'penthouse',
    'Dúplex': 'duplex',
    'Villa': 'house',
    'Departamento': 'apartment',
  };
  
  return {
    id: property.id,
    title: property.title,
    price: numPrice,
    pricePerM2: pricePerM2,
    location: property.location,
    propertyType: typeMap[property.type] || 'house',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    constructedArea: property.area,
    usableArea: property.area,
    description: property.description,
    images: property.images,
    features: property.features.map(f => ({ name: f, icon: 'Check' })),
    operationType: 'sale' as const,
    status: 'available' as const,
    orientation: 'south' as const,
    energyRating: 'B',
    reference: `REF-${property.id}`,
    yearBuilt: 2020,
    floor: 1,
    hasElevator: true,
    furnished: false,
    parking: true,
    storage: false,
    terrace: false,
    swimmingPool: false,
    garden: false,
    garage: false,
    isExclusive: false,
    isPremium: false,
    showExactLocation: true,
  };
};

// Función para obtener cualificación basada en el score
const getQualification = (score: number): keyof typeof qualificationConfig => {
  if (score >= 75) return 'very-qualified';
  if (score >= 50) return 'qualified';
  if (score >= 25) return 'little-qualified';
  return 'very-little-qualified';
};

// Lista completa de preguntas de cualificación
// Las preguntas de cualificación se obtienen de lead.qualificationQuestions
// que son las preguntas configuradas por rol en la configuración del asistente

// Tipos de datos
export interface QualificationQuestion {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  contactName?: string;
  phone: string;
  contactPhone?: string;
  email?: string;
  intention: 'comprador' | 'vendedor' | 'arrendador' | 'inquilino' | 'otros';
  lastContact: string;
  lastMessage: string;
  budget?: string;
  zone: string;
  propertyType: string;
  status: 'nuevo' | 'calificado' | 'seguimiento' | 'propuesta_enviada' | 'negociacion' | 'cerrado';
  alerts: string[];
  score: number;
  interactions: number;
  priority: 'alta' | 'media' | 'baja';
  nextAction?: string;
  source: 'phone' | 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  channels?: ('whatsapp' | 'email')[];
  isFavorite?: boolean;
  qualificationQuestions?: QualificationQuestion[];
  whatsappName?: string; // Nombre guardado en WhatsApp
  instagramUsername?: string; // @usuario de Instagram
  messengerName?: string; // Nombre en Facebook
  tiktokUsername?: string; // @usuario de TikTok
  matchedProperty?: { // Propiedad coincidente encontrada por el asistente
    propertyId: string;
    propertyTitle: string;
  };
  avatar?: string; // URL de la foto de perfil
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width: string;
  required?: boolean;
}

// Datos mock mejorados
export const mockLeads: Lead[] = [
  {
    id: '0',
    name: '+34 667 452 084',
    contactName: '-',
    phone: '+34 667 452 084',
    contactPhone: '-',
    intention: 'comprador',
    lastContact: '2025-11-05 15:48',
    lastMessage: 'Interesado en Casa Rústica en Villarcazu - 125.000€',
    budget: '€125.000',
    zone: 'Piloña - Villarcazu',
    propertyType: 'Casa rústica',
    status: 'negociacion',
    alerts: ['Reunión confirmada 12 de agosto 11:00'],
    score: 95,
    interactions: 1,
    priority: 'alta',
    nextAction: 'Preparar documentación para reunión del 12 de agosto',
    source: 'whatsapp',
    whatsappName: 'Javier Rodríguez',
    channels: ['whatsapp', 'email'],
    isFavorite: true,
    avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0ODgxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchedProperty: {
      propertyId: '10',
      propertyTitle: 'Chalé rústico en las afueras'
    },
    // 100% - 6 de 6: 3 bloqueadas (tiene nombre, teléfono, rol=comprador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Casa rústica', timestamp: '2024-12-19 15:30' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Piloña - Villarcazu', timestamp: '2024-12-19 15:32' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€125.000', timestamp: '2024-12-19 15:35' },
      { id: 'q4', question: '¿Cuántos dormitorios necesitas?', answer: '3 dormitorios', timestamp: '2024-12-19 15:37' },
      { id: 'q5', question: '¿Tienes alguna preferencia específica?', answer: 'Con jardín y vistas', timestamp: '2024-12-19 15:40' },
    ]
  },
  {
    id: '1',
    name: 'María González López',
    contactName: 'María González López',
    phone: '+34 666 123 456',
    contactPhone: '+34 666 123 456',
    email: 'maria.gonzalez@email.com',
    intention: 'comprador',
    lastContact: '2025-11-04 14:30',
    lastMessage: 'Solicitó información detallada para el sábado por la mañana',
    budget: '€180.000 - €220.000',
    zone: 'Zona Norte',
    propertyType: 'Casa unifamiliar',
    status: 'negociacion',
    alerts: ['Reunión confirmada mañana 10:00'],
    score: 95,
    interactions: 8,
    priority: 'alta',
    nextAction: 'Preparar documentación para la reunión',
    source: 'whatsapp',
    whatsappName: 'María González',
    isFavorite: true,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyNDgzODk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchedProperty: {
      propertyId: '2',
      propertyTitle: 'Casa de lujo con jardín'
    },
    // 83% - 5 de 6: 3 bloqueadas (tiene nombre, teléfono, rol=comprador) + 2 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Casa unifamiliar', timestamp: '2024-12-19 14:10' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Zona Norte', timestamp: '2024-12-19 14:15' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€180.000 - €220.000', timestamp: '2024-12-19 14:18' },
      { id: 'q4', question: '¿Necesitas garage?', answer: 'Sí, para 2 coches', timestamp: '2024-12-19 14:20' },
    ]
  },
  {
    id: '2',
    name: '+34 677 987 654',
    contactName: '-',
    phone: '+34 677 987 654',
    contactPhone: '-',
    intention: 'inquilino',
    lastContact: '2025-10-30 09:15',
    lastMessage: 'Preguntó por precios en el centro',
    budget: '€150.000 - €180.000',
    zone: 'Centro',
    propertyType: 'Piso',
    status: 'nuevo',
    alerts: ['⚠️ Sin respuesta hace 24h'],
    score: 73,
    interactions: 3,
    priority: 'alta',
    nextAction: 'Llamar urgente para no perder interés',
    source: 'instagram',
    instagramUsername: '@pisos_centro_mad',
    avatar: 'https://images.unsplash.com/photo-1579420593648-0deba81fd762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyNDUwMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchedProperty: {
      propertyId: '1',
      propertyTitle: 'Apartamento moderno en el centro'
    },
    // 67% - 4 de 6: 3 bloqueadas (solo tiene username de Instagram, teléfono, rol=inquilino) + 1 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad buscas alquilar?', answer: 'Piso', timestamp: '2024-12-18 09:00' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Centro', timestamp: '2024-12-18 09:02' },
      { id: 'q3', question: '¿Cuál es tu presupuesto mensual de alquiler?', answer: '€900 - €1200', timestamp: '2024-12-18 09:05' },
      { id: 'q4', question: '¿Cuándo necesitas mudarte?', answer: 'Lo antes posible', timestamp: '2024-12-18 09:07' },
    ]
  },
  {
    id: '3',
    name: '+34 655 789 123',
    contactName: '-',
    phone: '+34 655 789 123',
    contactPhone: '-',
    email: 'a.campos@email.com',
    intention: 'vendedor',
    lastContact: '2025-11-05 16:45',
    lastMessage: 'Quiere tasación de su casa en Los Pinos',
    zone: 'Los Pinos',
    propertyType: 'Casa adosada',
    status: 'calificado',
    alerts: [],
    score: 88,
    interactions: 12,
    priority: 'media',
    nextAction: 'Enviar comparativa de precios del mercado',
    source: 'whatsapp',
    whatsappName: 'Antonio Campos',
    channels: ['whatsapp', 'email'],
    avatar: 'https://images.unsplash.com/photo-1718179804654-7c3720b78e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ1NTI0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 50% - 3 de 6: 2 bloqueadas (tiene WhatsApp name, teléfono, pero rol=vendedor ✓) + 1 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres vender?', answer: 'Casa adosada', timestamp: '2024-12-19 16:20' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: 'Los Pinos', timestamp: '2024-12-19 16:22' },
      { id: 'q3', question: '¿En qué rango de precio esperarías venderla?', answer: '€280.000 - €320.000', timestamp: '2024-12-19 16:25' },
      { id: 'q4', question: '¿Cuántos m² tiene la propiedad?', answer: '180 m²', timestamp: '2024-12-19 16:27' },
      { id: 'q5', question: '¿Tiene garage o plaza de parking?', answer: 'Sí, plaza doble', timestamp: '2024-12-19 16:30' },
    ]
  },
  {
    id: '4',
    name: '+34 644 456 789',
    contactName: '-',
    phone: '+34 644 456 789',
    contactPhone: '-',
    email: 'carmen.v@email.com',
    intention: 'arrendador',
    lastContact: '2025-10-28 11:20',
    lastMessage: 'Interesada en pisos con terraza',
    budget: '€200.000 - €250.000',
    zone: 'Zona Sur',
    propertyType: 'Piso con terraza',
    status: 'seguimiento',
    alerts: ['Hace 2 días sin contacto'],
    score: 82,
    interactions: 6,
    priority: 'media',
    nextAction: 'Enviar nuevas opciones con terraza',
    source: 'messenger',
    messengerName: 'Carmen Vega',
    avatar: 'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlcnNvbiUyMGNhc3VhbHxlbnwxfHx8fDE3NjI1MDE0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 33% - 2 de 6: 2 bloqueadas (tiene Messenger name, teléfono, pero NO tiene rol definido ✗ = otros) + 0 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres alquilar?', answer: 'Piso con terraza', timestamp: '2024-12-17 11:15' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: 'Zona Sur', timestamp: '2024-12-17 11:18' },
      { id: 'q3', question: '¿Cuál sería el precio mensual de alquiler?', answer: '€1.500/mes', timestamp: '2024-12-17 11:20' },
      { id: 'q4', question: '¿Cuántos m² tiene la terraza?', answer: '40 m² aprox', timestamp: '2024-12-17 11:22' },
    ]
  },
  {
    id: '5',
    name: '+34 633 321 654',
    contactName: '-',
    phone: '+34 633 321 654',
    contactPhone: '+34 633 321 654',
    intention: 'vendedor',
    lastContact: '2025-11-05 09:20',
    lastMessage: 'Quiere vender su casa de la calle Olivos',
    zone: 'Calle Olivos',
    propertyType: 'Casa',
    status: 'negociacion',
    alerts: ['Reunión hoy 18:00 - ¡Preparar tasación!'],
    score: 91,
    interactions: 4,
    priority: 'alta',
    nextAction: 'Confirmar reunión y preparar tasación',
    source: 'whatsapp',
    whatsappName: 'Fernando López',
    avatar: 'https://images.unsplash.com/photo-1584981886809-8920959a5e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNDM4OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 17% - 1 de 6: 1 bloqueada (tiene WhatsApp name, teléfono, pero NO tiene rol definido ✗ = otros) + 0 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres vender?', answer: '', timestamp: '' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: '', timestamp: '' },
      { id: 'q3', question: '¿En qué rango de precio esperarías venderla?', answer: '', timestamp: '' },
    ]
  },
  {
    id: '6',
    name: '+34 611 222 333',
    contactName: '-',
    phone: '+34 611 222 333',
    contactPhone: '-',
    email: 'roberto.silva@email.com',
    intention: 'comprador',
    lastContact: '2025-11-04 15:20',
    lastMessage: 'Revisando propuesta de inversión',
    budget: '€400.000 - €500.000',
    zone: 'Centro Histórico',
    propertyType: 'Local comercial',
    status: 'propuesta_enviada',
    alerts: [],
    score: 92,
    interactions: 18,
    priority: 'alta',
    nextAction: 'Seguimiento de propuesta en 48h',
    source: 'whatsapp',
    whatsappName: 'Roberto Silva',
    channels: ['whatsapp', 'email'],
    avatar: 'https://images.unsplash.com/photo-1531299983330-093763e1d963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MDY4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 67% - 4 de 6: 3 bloqueadas (tiene WhatsApp name, teléfono, rol=comprador) + 1 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Local comercial', timestamp: '2024-12-18 15:00' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Centro Histórico', timestamp: '2024-12-18 15:03' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€400.000 - €500.000', timestamp: '2024-12-18 15:06' },
      { id: 'q4', question: '¿Para qué tipo de negocio?', answer: 'Restaurante gourmet', timestamp: '2024-12-18 15:08' },
      { id: 'q5', question: '¿Necesitas licencia de actividad?', answer: 'Sí, con salida de humos', timestamp: '2024-12-18 15:10' },
    ]
  },
  {
    id: '7',
    name: '+34 622 654 987',
    contactName: '-',
    phone: '+34 622 654 987',
    contactPhone: '-',
    email: 'isabella.torres@email.com',
    intention: 'inquilino',
    lastContact: '2024-09-20 10:30',
    lastMessage: 'Se decidió por otra opción',
    budget: '€300.000+',
    zone: 'Playa',
    propertyType: 'Departamento',
    status: 'cerrado',
    alerts: [],
    score: 45,
    interactions: 15,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Isabella Torres',
    avatar: 'https://images.unsplash.com/photo-1745434159123-4908d0b9df94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzYyMzkwODAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchedProperty: {
      propertyId: '11',
      propertyTitle: 'Apartamento en primera línea de playa'
    },
    // 33% - 2 de 6: 2 bloqueadas (tiene WhatsApp name, teléfono, pero NO tiene rol ✗ = inquilino) + 0 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad buscas alquilar?', answer: '', timestamp: '' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: '', timestamp: '' },
      { id: 'q3', question: '¿Cuál es tu presupuesto mensual de alquiler?', answer: '', timestamp: '' },
    ]
  },
  {
    id: '8',
    name: '+34 688 445 221',
    contactName: '-',
    phone: '+34 688 445 221',
    contactPhone: '-',
    email: 'diego.m@email.com',
    intention: 'comprador',
    lastContact: '2025-11-05 11:35',
    lastMessage: 'Busca piso cerca de universidades para alquilar',
    budget: '€120.000 - €150.000',
    zone: 'Zona Universitaria',
    propertyType: 'Piso pequeño',
    status: 'calificado',
    alerts: [],
    score: 78,
    interactions: 5,
    priority: 'media',
    nextAction: 'Enviar opciones de inversión cerca de campus',
    source: 'tiktok',
    tiktokUsername: '@diego.inversiones',
    avatar: 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ2NjMzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 50% - 3 de 6: 3 bloqueadas (tiene TikTok username, teléfono, rol=comprador) + 0 de 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: '', timestamp: '' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: '', timestamp: '' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '', timestamp: '' },
    ]
  },
  {
    id: '8b',
    name: '+34 666 333 444',
    contactName: '-',
    phone: '+34 666 333 444',
    contactPhone: '-',
    intention: 'otros',
    lastContact: '2024-12-19 12:15',
    lastMessage: 'Te dejé las llaves en casa de mamá',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 28,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Carlos (Hermano)',
    avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NjI0MTEwNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 67% - 2 de 3: tiene nombre (WhatsApp) + teléfono, pero NO tiene rol = "otros"
    // Max para "otros" = 2 de 3 (67%)
    qualificationQuestions: []
  },
  {
    id: '8c',
    name: '+34 611 222 555',
    contactName: '-',
    phone: '+34 611 222 555',
    contactPhone: '-',
    intention: 'otros',
    lastContact: '2024-12-18 09:20',
    lastMessage: '¿A qué hora cierran hoy?',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 2,
    priority: 'baja',
    source: 'phone',
    avatar: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGNhc3VhbHxlbnwxfHx8fDE3NjI1MDE2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 33% - 1 de 3: Solo teléfono, NO tiene nombre ni rol = otros
    // Max para "otros" = 2 de 3 (67%)
    qualificationQuestions: []
  },
  {
    id: '9',
    name: '+34 699 332 114',
    contactName: '-',
    phone: '+34 699 332 114',
    contactPhone: '-',
    intention: 'vendedor',
    lastContact: '2024-12-19 12:05',
    lastMessage: 'Necesita vender urgente por traslado laboral',
    zone: 'Zona Este',
    propertyType: 'Piso',
    status: 'nuevo',
    alerts: ['Urgente - Traslado en 3 semanas'],
    score: 89,
    interactions: 2,
    priority: 'alta',
    nextAction: 'Visitar propiedad para tasación urgente',
    source: 'whatsapp',
    whatsappName: 'Patricia Sánchez',
    avatar: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGNhc3VhbHxlbnwxfHx8fDE3NjI1MDE2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 100% - 6 de 6: 3 bloqueadas (WhatsApp, teléfono, rol=vendedor) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres vender?', answer: 'Piso', timestamp: '2024-12-19 11:50' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: 'Zona Este', timestamp: '2024-12-19 11:52' },
      { id: 'q3', question: '¿En qué rango de precio esperarías venderla?', answer: 'Venta urgente por traslado', timestamp: '2024-12-19 11:55' },
    ]
  },
  {
    id: '10',
    name: '+34 622 789 456',
    contactName: '-',
    phone: '+34 622 789 456',
    contactPhone: '-',
    intention: 'comprador',
    lastContact: '2024-12-16 18:30',
    lastMessage: 'Preguntó por pisos nuevos en construcción',
    budget: '€280.000+',
    zone: 'Zona Oeste',
    propertyType: 'Piso nuevo',
    status: 'nuevo',
    alerts: ['Sin respuesta hace 3 días'],
    score: 65,
    interactions: 1,
    priority: 'baja',
    nextAction: 'Recontactar con opciones de obra nueva',
    source: 'phone',
    avatar: 'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI1MDE2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Piso nuevo', timestamp: '2024-12-16 18:10' },
      { id: 'q2', question: '¿Cuál es tu presupuesto aproximado?', answer: '€280.000+', timestamp: '2024-12-16 18:15' },
      { id: 'q3', question: '¿En qué zona te gustaría vivir?', answer: 'Zona Oeste', timestamp: '2024-12-16 18:20' },
    ]
  },
  {
    id: '11',
    name: 'Luis Fernández',
    contactName: 'Luis Fernández',
    phone: '+34 655 998 332',
    contactPhone: '+34 655 998 332',
    email: 'luis.fdez@email.com',
    intention: 'comprador',
    lastContact: '2024-12-19 10:15',
    lastMessage: 'Interesado en villa con piscina',
    budget: '€600.000 - €800.000',
    zone: 'Urbanización Las Colinas',
    propertyType: 'Villa',
    status: 'seguimiento',
    alerts: [],
    score: 94,
    interactions: 11,
    priority: 'alta',
    nextAction: 'Programar visita a 3 villas seleccionadas',
    source: 'whatsapp',
    whatsappName: 'Luis Fernández',
    channels: ['whatsapp', 'email'],
    avatar: 'https://images.unsplash.com/photo-1543132220-c6440149c632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMGNhc3VhbHxlbnwxfHx8fDE3NjI1MDE2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchedProperty: {
      propertyId: '7',
      propertyTitle: 'Villa mediterránea con piscina'
    },
    // 100% - 6 de 6: 3 bloqueadas (WhatsApp, teléfono, rol=comprador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Villa', timestamp: '2024-12-19 09:50' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Urbanización Las Colinas', timestamp: '2024-12-19 09:52' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€600.000 - €800.000', timestamp: '2024-12-19 09:55' },
    ]
  },
  {
    id: '12',
    name: 'Ana Morales',
    contactName: 'Ana Morales',
    phone: '+34 677 234 556',
    contactPhone: '+34 677 234 556',
    email: 'ana.morales@email.com',
    intention: 'arrendador',
    lastContact: '2024-12-18 14:45',
    lastMessage: 'Quiere vender apartamento en la playa',
    zone: 'Costa del Sol',
    propertyType: 'Apartamento',
    status: 'propuesta_enviada',
    alerts: ['Propuesta de precio enviada ayer'],
    score: 86,
    interactions: 9,
    priority: 'media',
    nextAction: 'Esperar respuesta a propuesta de valoración',
    source: 'whatsapp',
    whatsappName: 'Ana Morales',
    avatar: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MzY0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // 100% - 6 de 6: 3 bloqueadas (nombre, teléfono, rol=arrendador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres alquilar?', answer: 'Apartamento', timestamp: '2024-12-18 14:20' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: 'Costa del Sol', timestamp: '2024-12-18 14:22' },
      { id: 'q3', question: '¿Cuál sería el precio mensual de alquiler?', answer: 'Valoración de mercado', timestamp: '2024-12-18 14:25' },
    ]
  },
  {
    id: '12b',
    name: 'Tía Marta',
    contactName: 'Tía Marta',
    phone: '+34 622 888 777',
    contactPhone: '+34 622 888 777',
    intention: 'otros',
    lastContact: '2024-12-18 17:45',
    lastMessage: 'Feliz cumpleaños sobrino! 🎂',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 12,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Tía Marta',
    // 67% - 2 de 3: tiene nombre + teléfono, pero NO tiene rol = otros
    qualificationQuestions: []
  },
  {
    id: '13',
    name: 'Jorge Sánchez',
    contactName: 'Jorge Sánchez',
    phone: '+34 644 112 998',
    contactPhone: '-',
    intention: 'comprador',
    lastContact: '2024-12-19 16:00',
    lastMessage: 'Primer comprador, necesita asesoramiento completo',
    budget: '€95.000 - €130.000',
    zone: 'Periferia',
    propertyType: 'Piso',
    status: 'calificado',
    alerts: ['Primer comprador - Requiere más atención'],
    score: 75,
    interactions: 7,
    whatsappName: 'Jorge Sánchez',
    priority: 'media',
    nextAction: 'Explicar proceso de compra y financiación',
    source: 'whatsapp',
    // 100% - 6 de 6: 3 bloqueadas (nombre, teléfono, rol=comprador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Piso', timestamp: '2024-12-19 15:40' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Periferia', timestamp: '2024-12-19 15:42' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€95.000 - €130.000', timestamp: '2024-12-19 15:45' },
    ]
  },
  {
    id: '14',
    name: 'Beatriz Castro',
    contactName: 'Beatriz Castro',
    phone: '+34 633 887 445',
    contactPhone: '+34 633 887 445',
    email: 'b.castro@email.com',
    intention: 'comprador',
    lastContact: '2024-12-14 09:30',
    lastMessage: 'Esperando aprobación de hipoteca',
    budget: '€175.000',
    zone: 'Zona Residencial',
    propertyType: 'Casa adosada',
    status: 'seguimiento',
    alerts: ['Pendiente aprobación bancaria'],
    score: 80,
    interactions: 14,
    priority: 'media',
    nextAction: 'Contactar en 1 semana para estado de hipoteca',
    source: 'whatsapp',
    whatsappName: 'Beatriz Castro',
    // 100% - 6 de 6: 3 bloqueadas (WhatsApp, teléfono, rol=comprador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Casa adosada', timestamp: '2024-12-14 09:10' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Zona Residencial', timestamp: '2024-12-14 09:12' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€175.000', timestamp: '2024-12-14 09:15' },
    ]
  },
  {
    id: '15',
    name: 'Sergio Navarro',
    contactName: 'Sergio Navarro',
    phone: '+34 611 554 223',
    contactPhone: '+34 611 554 223',
    email: 'sergio.nav@email.com',
    intention: 'vendedor',
    lastContact: '2024-12-19 11:40',
    lastMessage: 'Quiere vender local comercial en el centro',
    zone: 'Centro Comercial',
    propertyType: 'Local comercial',
    status: 'calificado',
    alerts: [],
    score: 83,
    interactions: 6,
    priority: 'media',
    nextAction: 'Análisis de mercado para locales comerciales',
    source: 'whatsapp',
    whatsappName: 'Sergio Navarro',
    // 100% - 6 de 6: 3 bloqueadas (WhatsApp, teléfono, rol=vendedor) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres vender?', answer: 'Local comercial', timestamp: '2024-12-19 11:20' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: 'Centro Comercial', timestamp: '2024-12-19 11:22' },
      { id: 'q3', question: '¿En qué rango de precio esperarías venderla?', answer: 'Depende de la tasación', timestamp: '2024-12-19 11:25' },
    ]
  },
  {
    id: '16',
    name: 'Laura Jiménez',
    contactName: '-',
    phone: '+34 699 776 334',
    contactPhone: '+34 699 776 334',
    intention: 'inquilino',
    lastContact: '2024-12-19 15:10',
    lastMessage: 'Busca estudio para estudiante',
    budget: '€70.000 - €90.000',
    zone: 'Centro',
    propertyType: 'Estudio',
    status: 'nuevo',
    alerts: [],
    score: 70,
    interactions: 2,
    priority: 'baja',
    nextAction: 'Enviar opciones de estudios disponibles',
    source: 'whatsapp',
    whatsappName: 'Laura Jiménez',
    // 100% - 6 de 6: 3 bloqueadas (WhatsApp, teléfono, rol=inquilino) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad buscas alquilar?', answer: 'Estudio', timestamp: '2024-12-19 14:50' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Centro', timestamp: '2024-12-19 14:55' },
      { id: 'q3', question: '¿Cuál es tu presupuesto mensual de alquiler?', answer: '€700 - €900/mes', timestamp: '2024-12-19 15:00' },
    ]
  },
  {
    id: '17',
    name: 'Manuel Ortiz',
    contactName: 'Manuel Ortiz',
    phone: '+34 622 445 889',
    contactPhone: '+34 622 445 889',
    email: 'manuel.ortiz@email.com',
    intention: 'comprador',
    lastContact: '2024-12-19 13:25',
    lastMessage: 'Inversionista buscando varias propiedades',
    budget: '€1.000.000+',
    zone: 'Varias zonas',
    propertyType: 'Múltiples',
    status: 'propuesta_enviada',
    alerts: ['Cliente VIP - Inversionista'],
    score: 98,
    interactions: 22,
    priority: 'alta',
    nextAction: 'Preparar portafolio de inversiones premium',
    source: 'whatsapp',
    whatsappName: 'Manuel Ortiz',
    channels: ['whatsapp', 'email'],
    isFavorite: true,
    // 100% - 6 de 6: 3 bloqueadas (nombre, teléfono, rol=comprador) + 3 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Múltiples propiedades para inversión', timestamp: '2024-12-19 13:00' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Varias zonas premium', timestamp: '2024-12-19 13:02' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€1.000.000+', timestamp: '2024-12-19 13:05' },
    ]
  },
  {
    id: '18',
    name: 'Javi (Cuñado)',
    contactName: 'Javi (Cuñado)',
    phone: '+34 699 444 555',
    contactPhone: '+34 699 444 555',
    intention: 'otros',
    lastContact: '2024-12-19 10:00',
    lastMessage: '¿Vamos al partido el sábado?',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 35,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Javi (Cuñado)',
    qualificationQuestions: []
  },
  {
    id: '19',
    name: 'Abuela',
    contactName: 'Abuela',
    phone: '+34 655 222 111',
    contactPhone: '+34 655 222 111',
    intention: 'otros',
    lastContact: '2024-12-17 20:30',
    lastMessage: 'Hijo, ¿cuándo me visitas? Te hago tu comida favorita',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 52,
    priority: 'baja',
    source: 'phone',
    qualificationQuestions: []
  },
  {
    id: '47',
    name: 'Luis Fernández',
    contactName: '-',
    phone: '+34 677 888 999',
    contactPhone: '-',
    email: 'luis.fernandez@email.com',
    intention: 'otros',
    lastContact: '2024-12-19 18:30',
    lastMessage: 'Solo quería información sobre el barrio',
    zone: 'Salamanca',
    propertyType: 'Consulta general',
    status: 'nuevo',
    alerts: [],
    score: 35,
    interactions: 2,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Luis Fernández',
    // 33% - 1 de 3: Solo teléfono, NO tiene nombre guardado ni rol = otros
    qualificationQuestions: []
  },
  {
    id: '48',
    name: 'Patricia Ruiz',
    contactName: '-',
    phone: '+34 688 999 000',
    contactPhone: '+34 688 999 000',
    email: 'patricia.ruiz@email.com',
    intention: 'otros',
    lastContact: '2024-12-17 16:45',
    lastMessage: '¿Ofrecen servicios de asesoría?',
    zone: 'N/A',
    propertyType: 'Consulta',
    status: 'nuevo',
    alerts: [],
    score: 28,
    interactions: 1,
    priority: 'baja',
    source: 'phone',
    qualificationQuestions: []
  },
  {
    id: '49',
    name: 'Primo David',
    contactName: 'Primo David',
    phone: '+34 644 777 888',
    contactPhone: '+34 644 777 888',
    intention: 'otros',
    lastContact: '2024-12-16 14:20',
    lastMessage: 'Oye, ¿tienes el número del fontanero?',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 18,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Primo David',
    qualificationQuestions: []
  },
  {
    id: '50',
    name: 'Vecino Paco',
    contactName: 'Vecino Paco',
    phone: '+34 611 555 666',
    contactPhone: '+34 611 555 666',
    intention: 'otros',
    lastContact: '2024-12-15 09:00',
    lastMessage: 'Buenos días, te dejé un paquete en portería',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 8,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Vecino Paco',
    qualificationQuestions: []
  },
  {
    id: '51',
    name: 'Papá',
    contactName: 'Papá',
    phone: '+34 655 333 222',
    contactPhone: '+34 655 333 222',
    intention: 'otros',
    lastContact: '2024-12-19 08:30',
    lastMessage: 'Buenos días hijo, ¿cómo va todo en el trabajo?',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 67,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Papá',
    qualificationQuestions: []
  },
  {
    id: '52',
    name: 'Amigo Pablo',
    contactName: 'Amigo Pablo',
    phone: '+34 688 222 333',
    contactPhone: '+34 688 222 333',
    intention: 'otros',
    lastContact: '2024-12-18 22:00',
    lastMessage: 'Quedamos el viernes para tomar algo?',
    zone: 'N/A',
    propertyType: 'N/A',
    status: 'nuevo',
    alerts: [],
    score: 0,
    interactions: 42,
    priority: 'baja',
    source: 'whatsapp',
    whatsappName: 'Amigo Pablo'
  },
  {
    id: '53',
    name: '+34 622 111 999',
    contactName: '-',
    phone: '+34 622 111 999',
    contactPhone: '-',
    intention: 'comprador',
    lastContact: '2024-12-19 14:15',
    lastMessage: 'Vi tu vídeo sobre pisos en el centro, me interesa',
    budget: '€160.000 - €190.000',
    zone: 'Centro',
    propertyType: 'Piso',
    status: 'nuevo',
    alerts: [],
    score: 76,
    interactions: 3,
    priority: 'media',
    nextAction: 'Enviar opciones de pisos en centro',
    source: 'tiktok',
    tiktokUsername: '@busco_piso_madrid',
    // 83% - 5 de 6: 3 bloqueadas (TikTok, teléfono, rol=comprador) + 2 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Piso', timestamp: '2024-12-19 14:00' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Centro', timestamp: '2024-12-19 14:05' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '', timestamp: '' },
    ]
  },
  {
    id: '54',
    name: '+34 677 333 888',
    contactName: '-',
    phone: '+34 677 333 888',
    contactPhone: '-',
    intention: 'vendedor',
    lastContact: '2024-12-18 16:30',
    lastMessage: 'Me gustó tu contenido sobre valoraciones',
    zone: 'Zona Norte',
    propertyType: 'Casa',
    status: 'nuevo',
    alerts: [],
    score: 68,
    interactions: 2,
    priority: 'baja',
    nextAction: 'Ofrecer tasación gratuita',
    source: 'tiktok',
    tiktokUsername: '@casas_venta_norte',
    // 50% - 3 de 6: 3 bloqueadas (TikTok, teléfono, rol=vendedor) + 0 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad quieres vender?', answer: '', timestamp: '' },
      { id: 'q2', question: '¿Dónde está ubicada tu propiedad?', answer: '', timestamp: '' },
      { id: 'q3', question: '¿En qué rango de precio esperarías venderla?', answer: '', timestamp: '' },
    ]
  },
  {
    id: '55',
    name: '+34 655 777 222',
    contactName: '-',
    phone: '+34 655 777 222',
    contactPhone: '-',
    email: 'inversiones2024@email.com',
    intention: 'comprador',
    lastContact: '2024-12-19 11:00',
    lastMessage: 'Interesado en propiedades para invertir',
    budget: '€300.000 - €450.000',
    zone: 'Varias zonas',
    propertyType: 'Apartamentos',
    status: 'calificado',
    alerts: [],
    score: 84,
    interactions: 6,
    priority: 'alta',
    nextAction: 'Preparar portafolio de inversión',
    source: 'tiktok',
    tiktokUsername: '@inversor_inmobiliario',
    // 83% - 5 de 6: 3 bloqueadas (TikTok, teléfono, rol=comprador) + 2 del rol respondidas
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Apartamentos', timestamp: '2024-12-19 10:40' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Varias zonas', timestamp: '2024-12-19 10:45' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '', timestamp: '' },
    ]
  }
];

// Interfaz para mensajes de chat
export interface ChatMessage {
  id: string;
  senderId: 'user' | 'lead';
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Conversation {
  leadId: string;
  messages: ChatMessage[];
}

// Datos mock de conversaciones
export const mockConversations: Conversation[] = [
  {
    leadId: '0',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, me interesa la Casa Rústica en Villarcazu que vi en el portal', timestamp: '2024-12-19 15:20', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Claro que sí, es una propiedad preciosa. ¿Has podido ver las fotos?', timestamp: '2024-12-19 15:22', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, me encanta. Tiene el precio de 125.000€ correcto?', timestamp: '2024-12-19 15:25', read: true },
      { id: '4', senderId: 'user', text: 'Exactamente. Además incluye 2000m² de terreno con vistas increíbles.', timestamp: '2024-12-19 15:26', read: true },
      { id: '5', senderId: 'lead', text: 'Perfecto. ¿Podemos agendar una visita?', timestamp: '2024-12-19 15:30', read: true },
      { id: '6', senderId: 'user', text: 'Por supuesto. ¿Te vendría bien el 12 de agosto a las 11:00?', timestamp: '2024-12-19 15:32', read: true },
      { id: '7', senderId: 'lead', text: 'Perfecto, nos vemos ese día!', timestamp: '2024-12-19 15:48', read: true },
    ]
  },
  {
    leadId: '1',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, estoy buscando un piso en la zona norte', timestamp: '2024-12-19 09:15', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días María! Tenemos varias opciones interesantes. ¿Cuál es tu presupuesto aproximado?', timestamp: '2024-12-19 09:20', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 180.000 y 220.000€', timestamp: '2024-12-19 09:25', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te voy a enviar algunas opciones que se ajustan a tu búsqueda', timestamp: '2024-12-19 09:30', read: true },
      { id: '5', senderId: 'lead', text: 'Me gustaría verlas cuanto antes', timestamp: '2024-12-19 09:35', read: true },
      { id: '6', senderId: 'user', text: 'Excelente. ¿Te vendría bien mañana a las 10:00 para hacer una visita?', timestamp: '2024-12-19 14:28', read: true },
      { id: '7', senderId: 'lead', text: 'Sí, perfecto. Confirmo para mañana 10:00', timestamp: '2024-12-19 14:30', read: true },
    ]
  },
  {
    leadId: '2',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, vi varias propiedades en el centro. ¿Cuáles están disponibles?', timestamp: '2024-12-18 09:10', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Tenemos varias opciones en el centro. ¿Qué tipo de propiedad buscas?', timestamp: '2024-12-18 09:12', read: true },
      { id: '3', senderId: 'lead', text: 'Un piso de 2-3 habitaciones, mi presupuesto es de 150.000 a 180.000€', timestamp: '2024-12-18 09:15', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo algunas opciones que podrían interesarte. ¿Te gustaría que te envíe información?', timestamp: '2024-12-18 09:15', read: true },
    ]
  },
  {
    leadId: '3',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, necesito vender mi casa en Los Pinos', timestamp: '2024-12-19 16:40', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días! Encantado de ayudarte. ¿Cuándo te vendría bien que hagamos una tasación?', timestamp: '2024-12-19 16:42', read: true },
      { id: '3', senderId: 'lead', text: 'Esta misma semana si es posible', timestamp: '2024-12-19 16:43', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te preparo un análisis del mercado y agendamos la visita', timestamp: '2024-12-19 16:45', read: true },
    ]
  },
  {
    leadId: '4',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, estoy buscando un piso con terraza en la zona sur', timestamp: '2024-12-17 11:15', read: true },
      { id: '2', senderId: 'user', text: 'Hola Carmen! Claro, tenemos varias opciones con terraza. ¿Cuál es tu presupuesto?', timestamp: '2024-12-17 11:17', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 200.000 y 250.000€', timestamp: '2024-12-17 11:18', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te envío algunas opciones que se ajustan a lo que buscas', timestamp: '2024-12-17 11:20', read: true },
    ]
  },
  {
    leadId: '5',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenas tardes, quiero vender mi casa de la calle Olivos', timestamp: '2024-12-19 13:05', read: true },
      { id: '2', senderId: 'user', text: 'Buenas tardes Fernando! Me parece excelente. ¿Tienes una idea del precio que esperas?', timestamp: '2024-12-19 13:07', read: true },
      { id: '3', senderId: 'lead', text: 'No estoy seguro, por eso necesito una tasación profesional', timestamp: '2024-12-19 13:08', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te agendé para hoy a las 18:00. ¿Te viene bien?', timestamp: '2024-12-19 13:10', read: true },
    ]
  },
  {
    leadId: '6',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, estoy interesado en invertir en locales comerciales en el centro', timestamp: '2024-12-18 15:15', read: true },
      { id: '2', senderId: 'user', text: 'Hola Roberto! Excelente, tenemos varias opciones de inversión. ¿Qué presupuesto manejas?', timestamp: '2024-12-18 15:17', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 400.000 y 500.000€', timestamp: '2024-12-18 15:18', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te preparé una propuesta con 3 locales que podrían interesarte', timestamp: '2024-12-18 15:20', read: true },
    ]
  },
  {
    leadId: '7',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, estaba buscando un departamento en la playa', timestamp: '2024-12-15 10:25', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días Isabella! Claro, tenemos opciones en primera línea. ¿Es para vivir o inversión?', timestamp: '2024-12-15 10:27', read: true },
      { id: '3', senderId: 'lead', text: 'Para vivir. Mi presupuesto es de 300.000€ o más', timestamp: '2024-12-15 10:28', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te envío algunas opciones', timestamp: '2024-12-15 10:30', read: true },
    ]
  },
  {
    leadId: '8',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, busco un piso cerca de las universidades para alquilar como inversión', timestamp: '2024-12-19 17:15', read: true },
      { id: '2', senderId: 'user', text: 'Hola Diego! Excelente idea de inversión. ¿Qué presupuesto tienes pensado?', timestamp: '2024-12-19 17:17', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 120.000 y 150.000€', timestamp: '2024-12-19 17:18', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo varias opciones cerca del campus que generan muy buen retorno', timestamp: '2024-12-19 17:20', read: true },
    ]
  },
  {
    leadId: '9',
    messages: [
      { id: '1', senderId: 'lead', text: 'Urgente! Necesito vender mi piso por traslado laboral', timestamp: '2024-12-19 12:00', read: true },
      { id: '2', senderId: 'user', text: 'Hola Patricia! Entiendo la urgencia. ¿En qué zona está tu piso?', timestamp: '2024-12-19 12:02', read: true },
      { id: '3', senderId: 'lead', text: 'En la zona este. Tengo que mudarme en 3 semanas', timestamp: '2024-12-19 12:03', read: true },
      { id: '4', senderId: 'user', text: 'No te preocupes, vamos a hacer todo lo posible. ¿Cuándo puedo ir a verlo para hacer la tasación?', timestamp: '2024-12-19 12:05', read: true },
    ]
  },
  {
    leadId: '10',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, estoy buscando pisos nuevos en construcción en la zona oeste', timestamp: '2024-12-16 18:25', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Tenemos varios proyectos en obra nueva. ¿Cuál es tu presupuesto aproximado?', timestamp: '2024-12-16 18:27', read: true },
      { id: '3', senderId: 'lead', text: 'Alrededor de 280.000€', timestamp: '2024-12-16 18:30', read: true },
    ]
  },
  {
    leadId: '11',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, me interesa una villa con piscina en Las Colinas', timestamp: '2024-12-19 10:10', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días Luis! Excelente elección de zona. ¿Qué presupuesto manejas?', timestamp: '2024-12-19 10:12', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 600.000 y 800.000€', timestamp: '2024-12-19 10:13', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo 3 villas que se ajustan perfectamente. ¿Te gustaría visitarlas?', timestamp: '2024-12-19 10:15', read: true },
    ]
  },
  {
    leadId: '12',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, quiero vender mi apartamento en la playa', timestamp: '2024-12-18 14:40', read: true },
      { id: '2', senderId: 'user', text: 'Hola Ana! ¿En qué zona de la costa está ubicado?', timestamp: '2024-12-18 14:42', read: true },
      { id: '3', senderId: 'lead', text: 'En Costa del Sol, primera línea', timestamp: '2024-12-18 14:43', read: true },
      { id: '4', senderId: 'user', text: 'Excelente ubicación. Te envié una propuesta de valoración ayer', timestamp: '2024-12-18 14:45', read: true },
    ]
  },
  {
    leadId: '13',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, soy primerizo comprando. ¿Me pueden ayudar con todo el proceso?', timestamp: '2024-12-19 15:55', read: true },
      { id: '2', senderId: 'user', text: 'Hola Jorge! Por supuesto, te acompañamos en todo el proceso. ¿Ya tienes una idea de qué tipo de propiedad buscas?', timestamp: '2024-12-19 15:57', read: true },
      { id: '3', senderId: 'lead', text: 'Un piso pequeño, mi presupuesto es de 95.000 a 130.000€', timestamp: '2024-12-19 15:58', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te voy a explicar todo el proceso de compra y financiación. ¿Tienes tiempo para una llamada?', timestamp: '2024-12-19 16:00', read: true },
    ]
  },
  {
    leadId: '14',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, estoy esperando la aprobación de mi hipoteca para comprar una casa adosada', timestamp: '2024-12-14 09:25', read: true },
      { id: '2', senderId: 'user', text: 'Hola Beatriz! ¿Ya tienes noticias del banco?', timestamp: '2024-12-14 09:27', read: true },
      { id: '3', senderId: 'lead', text: 'Todavía no, me dijeron que me responden esta semana', timestamp: '2024-12-14 09:28', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te contacto en 1 semana para saber cómo va todo', timestamp: '2024-12-14 09:30', read: true },
    ]
  },
  {
    leadId: '15',
    messages: [
      { id: '1', senderId: 'lead', text: 'Buenos días, quiero vender mi local comercial en el centro', timestamp: '2024-12-19 11:35', read: true },
      { id: '2', senderId: 'user', text: 'Buenos días Sergio! ¿Qué superficie tiene el local?', timestamp: '2024-12-19 11:37', read: true },
      { id: '3', senderId: 'lead', text: 'Unos 80m², bien ubicado en zona comercial', timestamp: '2024-12-19 11:38', read: true },
      { id: '4', senderId: 'user', text: 'Excelente. Te preparo un análisis del mercado de locales comerciales en la zona', timestamp: '2024-12-19 11:40', read: true },
    ]
  },
  {
    leadId: '16',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, necesito un estudio para mi hija que va a estudiar en la universidad', timestamp: '2024-12-19 15:05', read: true },
      { id: '2', senderId: 'user', text: 'Hola Laura! ¿Qué presupuesto tienes pensado para el estudio?', timestamp: '2024-12-19 15:07', read: true },
      { id: '3', senderId: 'lead', text: 'Entre 70.000 y 90.000€', timestamp: '2024-12-19 15:08', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, te envío opciones de estudios disponibles cerca del campus', timestamp: '2024-12-19 15:10', read: true },
    ]
  },
  {
    leadId: '17',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, soy inversionista y busco varias propiedades para mi portafolio', timestamp: '2024-12-19 13:20', read: true },
      { id: '2', senderId: 'user', text: 'Hola Manuel! Perfecto, trabajamos con varios inversionistas. ¿Qué tipo de propiedades te interesan?', timestamp: '2024-12-19 13:22', read: true },
      { id: '3', senderId: 'lead', text: 'Propiedades de alto valor, residenciales y comerciales. Mi presupuesto supera el millón', timestamp: '2024-12-19 13:23', read: true },
      { id: '4', senderId: 'user', text: 'Excelente, te preparo un portafolio de inversiones premium con varias opciones', timestamp: '2024-12-19 13:25', read: true },
    ]
  },
  {
    leadId: '53',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola! Vi tu vídeo en TikTok sobre pisos en el centro y me interesa mucho', timestamp: '2024-12-19 14:10', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Qué bueno que te gustó el contenido. ¿Qué tipo de piso estás buscando?', timestamp: '2024-12-19 14:12', read: true },
      { id: '3', senderId: 'lead', text: 'Un piso de 2-3 habitaciones, mi presupuesto es 160.000 a 190.000€', timestamp: '2024-12-19 14:13', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo varias opciones en esa zona y rango de precio. Te envío información', timestamp: '2024-12-19 14:15', read: true },
    ]
  },
  {
    leadId: '54',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, me gustó mucho tu contenido sobre valoraciones de propiedades', timestamp: '2024-12-18 16:25', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Muchas gracias. ¿Estás pensando en vender alguna propiedad?', timestamp: '2024-12-18 16:27', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, tengo una casa en la zona norte que quiero vender', timestamp: '2024-12-18 16:28', read: true },
      { id: '4', senderId: 'user', text: 'Excelente, te puedo ofrecer una tasación gratuita. ¿Cuándo te vendría bien?', timestamp: '2024-12-18 16:30', read: true },
    ]
  },
  {
    leadId: '55',
    messages: [
      { id: '1', senderId: 'lead', text: 'Hola, vi tus vídeos sobre inversión inmobiliaria en TikTok y me parecieron muy interesantes', timestamp: '2024-12-19 10:55', read: true },
      { id: '2', senderId: 'user', text: 'Hola! Me alegra que te haya sido útil. ¿Estás buscando propiedades para invertir?', timestamp: '2024-12-19 10:57', read: true },
      { id: '3', senderId: 'lead', text: 'Sí, tengo un presupuesto de 300.000 a 450.000€ para comprar apartamentos', timestamp: '2024-12-19 10:58', read: true },
      { id: '4', senderId: 'user', text: 'Perfecto, tengo varias opciones con buen potencial de retorno. Te preparo un portafolio', timestamp: '2024-12-19 11:00', read: true },
    ]
  }
];

const getIntentionConfig = (intention: string) => {
  switch (intention) {
    case 'comprador': return { emoji: '🏠', label: 'Comprador', color: 'bg-green-50 text-green-700 border-green-200' };
    case 'vendedor': return { emoji: '💰', label: 'Vendedor', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'arrendador': return { emoji: '🏢', label: 'Arrendador', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'inquilino': return { emoji: '🔑', label: 'Inquilino', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    default: return { emoji: '❓', label: 'Sin definir', color: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'nuevo': return { label: 'Nuevo', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    case 'calificado': return { label: 'Calificado', color: 'bg-green-50 text-green-700 border-green-200' };
    case 'seguimiento': return { label: 'En seguimiento', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'propuesta_enviada': return { label: 'Propuesta enviada', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'negociacion': return { label: 'Negociación', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'cerrado': return { label: 'Cerrado', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    default: return { label: 'Sin estado', color: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta': return 'text-red-600';
    case 'media': return 'text-yellow-600';
    case 'baja': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Hace menos de 1h';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffHours < 48) return 'Ayer';
  return `Hace ${Math.floor(diffHours / 24)} días`;
};

// Función para truncar nombres en listados
const truncateName = (name: string, maxLength: number = 30) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
};

// Vista de Cards (minimalista actual)
const MinimalLeadCard = ({ 
  lead, 
  onOpenChat,
  onCall
}: { 
  lead: Lead;
  onOpenChat: (leadId: string) => void;
  onCall: (phone: string, leadId: string) => void;
}) => {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleCallClick = () => {
    onCall(lead.phone, lead.id);
  };

  const handleSchedule = () => {
    alert('Programar seguimiento');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Nota añadida: ${newNote}`);
      setNewNote('');
      setNoteDialogOpen(false);
    }
  };

  const hasAlerts = lead.alerts.length > 0;
  const intentionConfig = getIntentionConfig(lead.intention);
  const statusConfig = getStatusConfig(lead.status);

  return (
    <Card className={`border-0 shadow-sm hover:shadow-md transition-all ${hasAlerts ? 'ring-2 ring-red-200 bg-red-50/30' : ''}`}>
      <CardContent className="p-6">
        {/* Alertas */}
        {hasAlerts && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm font-medium text-red-800">{lead.alerts[0]}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-gray-100">
              <AvatarFallback className="bg-transparent">
                {lead.source === 'whatsapp' ? (
                  <MessageSquare className="h-6 w-6 text-green-600" />
                ) : lead.source === 'phone' ? (
                  <Phone className="h-6 w-6 text-blue-600" />
                ) : (
                  <Mail className="h-6 w-6 text-blue-600" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{truncateName(lead.name)}</h3>
                {lead.score >= 85 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={intentionConfig.color}>
                  {intentionConfig.emoji} {intentionConfig.label}
                </Badge>
                <Badge variant="outline" className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">{formatDate(lead.lastContact)}</div>
            <div className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
              Prioridad {lead.priority}
            </div>
          </div>
        </div>

        {/* Información clave en grid limpio */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-blue-600 hover:text-blue-800 font-medium"
              onClick={handleCallClick}
            >
              {lead.phone}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{lead.zone}</span>
          </div>
          {lead.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-green-600">{lead.budget}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{lead.propertyType}</span>
          </div>
        </div>

        {/* Último mensaje */}
        <div className="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Último contacto</span>
          </div>
          <p className="text-sm text-blue-700">{lead.lastMessage}</p>
        </div>

        {/* Próxima acción */}
        {lead.nextAction && (
          <div className="mb-6 p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Próxima acción</span>
            </div>
            <p className="text-sm text-yellow-700">{lead.nextAction}</p>
          </div>
        )}

        {/* Acciones principales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            onClick={() => handleCall(lead.phone)}
            className="h-12"
          >
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChat(lead.id)}
            className="h-12"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>

        {/* Acciones secundarias */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSchedule}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Seguimiento
          </Button>
          <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Nota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir nota para {lead.name}</DialogTitle>
                <DialogDescription>
                  Escribe una nota o recordatorio sobre este contacto.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddNote}>
                    Guardar nota
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>{lead.interactions} interacciones</span>
          <span>Score: {calculateLeadScore(lead)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Constantes para DND
const ITEM_TYPE = 'LEAD_CARD';

// Vista Kanban con Drag and Drop
const KanbanView = ({ leads, onLeadMove, onCall }: { leads: Lead[], onLeadMove: (leadId: string, newStatus: Lead['status']) => void, onCall: (phone: string, leadId: string) => void }) => {
  const columns = [
    { id: 'nuevo', title: 'Nuevos', color: 'border-yellow-200 bg-yellow-50' },
    { id: 'calificado', title: 'Calificados', color: 'border-green-200 bg-green-50' },
    { id: 'seguimiento', title: 'En Seguimiento', color: 'border-blue-200 bg-blue-50' },
    { id: 'propuesta_enviada', title: 'Propuesta Enviada', color: 'border-orange-200 bg-orange-50' },
    { id: 'negociacion', title: 'Negociación', color: 'border-purple-200 bg-purple-50' },
    { id: 'cerrado', title: 'Cerrados', color: 'border-gray-200 bg-gray-50' }
  ];

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Componente para la columna con Drop Zone
  const DroppableColumn = ({ column }: { column: typeof columns[0] }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ITEM_TYPE,
      drop: (item: { leadId: string, currentStatus: string }) => {
        if (item.currentStatus !== column.id) {
          onLeadMove(item.leadId, column.id as Lead['status']);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const columnLeads = getLeadsByStatus(column.id);

    return (
      <div 
        ref={drop}
        className={`
          flex-shrink-0 w-80 rounded-lg border-2 p-4 min-h-96
          ${column.color}
          ${isOver ? 'ring-2 ring-primary/50 bg-primary/5' : ''}
          transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge variant="secondary" className="bg-white/50">
            {columnLeads.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {columnLeads.map((lead) => (
            <DraggableKanbanCard 
              key={lead.id} 
              lead={lead} 
              onOpenChat={(leadId) => {
                setSelectedChatLeadId(leadId);
                setChatOpen(true);
              }}
              onCallClick={onCall}
            />
          ))}
          {columnLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">
                {isOver ? 'Suelta aquí para mover' : 'No hay contactos en esta etapa'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente para la card draggable
  const DraggableKanbanCard = ({ 
    lead,
    onOpenChat,
    onCallClick
  }: { 
    lead: Lead;
    onOpenChat: (leadId: string) => void;
    onCallClick: (phone: string, leadId: string) => void;
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ITEM_TYPE,
      item: { leadId: lead.id, currentStatus: lead.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const hasAlerts = lead.alerts.length > 0;
    const intentionConfig = getIntentionConfig(lead.intention);

    return (
      <div 
        ref={drag}
        className={`
          transition-all duration-200
          ${isDragging ? 'opacity-50 rotate-3 shadow-lg' : 'hover:scale-105'}
        `}
      >
        <Card 
          className={`
            border-0 shadow-sm hover:shadow-md transition-all cursor-move select-none
            ${hasAlerts ? 'ring-2 ring-red-200 bg-red-50/30' : ''}
          `}
        >
          <CardContent className="p-4">
            {/* Drag indicator */}
            <div className="flex items-center justify-between mb-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              {lead.score >= 85 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
            </div>

            {hasAlerts && (
              <div className="mb-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
                <AlertTriangle className="h-3 w-3 text-red-600 inline mr-1" />
                <span className="text-red-800">{lead.alerts[0]}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8 bg-gray-100">
                <AvatarFallback className="bg-transparent">
                  {lead.source === 'whatsapp' ? (
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  ) : lead.source === 'phone' ? (
                    <Phone className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Mail className="h-4 w-4 text-blue-600" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-gray-900 text-sm truncate">{lead.name}</p>
                </div>
                <p className="text-xs text-gray-500">{formatDate(lead.lastContact)}</p>
              </div>
            </div>

            <div className="mb-3">
              <Badge variant="outline" className={`${intentionConfig.color} text-xs`}>
                {intentionConfig.emoji} {intentionConfig.label}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span className="truncate">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{lead.zone}</span>
              </div>
              {lead.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="truncate text-green-600 font-medium">{lead.budget}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Score: {calculateLeadScore(lead)}%</span>
              <span className={getPriorityColor(lead.priority)}>
                {lead.priority}
              </span>
            </div>

            <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={() => onCallClick(lead.phone, lead.id)}
              >
                <Phone className="h-3 w-3 mr-1" />
                Llamar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={() => onOpenChat(lead.id)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Instrucciones de uso */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            <strong>Arrastra y suelta</strong> las tarjetas entre columnas para cambiar el estado de los contactos
          </span>
        </div>
      </div>

      {/* Pipeline horizontal con scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-fit">
          {columns.map((column) => (
            <DroppableColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Configuración de Columnas
const ColumnConfigDialog = ({ 
  columns, 
  onColumnsChange, 
  open, 
  onOpenChange 
}: { 
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [localColumns, setLocalColumns] = useState(columns);

  // Sincronizar con las props cuando cambian o cuando el diálogo se abre
  useEffect(() => {
    if (open) {
      setLocalColumns(columns);
    }
  }, [columns, open]);

  const handleToggleColumn = (columnId: string) => {
    setLocalColumns(prev =>
      prev.map(col =>
        col.id === columnId && !col.required
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

  const handleSave = () => {
    onColumnsChange(localColumns);
    onOpenChange(false);
  };

  // Componente de fila de columna simple
  const ColumnRow = ({ column }: { column: ColumnConfig }) => {
    return (
      <div
        className={`
          flex items-center justify-between p-3 rounded-lg border transition-all
          ${column.required ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}
        `}
      >
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={column.visible}
            onCheckedChange={() => handleToggleColumn(column.id)}
            disabled={column.required}
          />
          <span className={`${column.visible ? 'text-gray-900' : 'text-gray-400'}`}>
            {column.label}
          </span>
          {column.required && (
            <Badge variant="secondary" className="text-xs">
              Obligatoria
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Columnas</DialogTitle>
          <DialogDescription>
            Marca o desmarca las columnas que quieres mostrar u ocultar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {localColumns.map((column) => (
            <ColumnRow key={column.id} column={column} />
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Vista de Tabla Excel
const TableView = ({ 
  leads, 
  currentPage, 
  totalPages, 
  onPageChange,
  selectedLeadIds,
  onSelectionChange,
  columns,
  onColumnsChange,
  onAddContact,
  onOpenChat,
  unreadLeads,
  disabledBotLeads,
  toggleBotStatus,
  toggleFavorite,
  onCall,
  onOpenSaveContact,
  onOpenQualification,
  onOpenProperty,
  focusedLeadId
}: { 
  leads: Lead[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedLeadIds: string[];
  onSelectionChange: (ids: string[]) => void;
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  onAddContact: (leadId: string) => void;
  onOpenChat: (leadId: string) => void;
  unreadLeads: Set<string>;
  disabledBotLeads: Set<string>;
  toggleBotStatus: (leadId: string) => void;
  toggleFavorite: (leadId: string) => void;
  onCall: (phone: string, leadId: string) => void;
  onOpenSaveContact: (leadId: string) => void;
  onOpenQualification: (leadId: string) => void;
  onOpenProperty: (property: Property, lead: Lead) => void;
  focusedLeadId: string | null;
}) => {
  // Detectar móvil - usar función inicializadora
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [avatarViewImage, setAvatarViewImage] = useState<string>('');
  
  // useRef para detectar swipe en móvil (prevenir clicks accidentales al deslizar)
  const swipeDataRef = useRef<{
    startX: number;
    startY: number;
    isSwiping: boolean;
  }>({ startX: 0, startY: 0, isSwiping: false });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  // const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const visibleColumns = columns.filter(col => col.visible);

  const handleCall = (phone: string, leadId: string) => {
    onCall(phone, leadId);
  };

  const handleWhatsApp = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  // const handleViewDetails = (lead: Lead) => {
  //   setSelectedLead(lead);
  //   setDetailsDialogOpen(true);
  // };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(leads.map(lead => lead.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLeadIds, leadId]);
    } else {
      onSelectionChange(selectedLeadIds.filter(id => id !== leadId));
    }
  };

  const allSelected = leads.length > 0 && selectedLeadIds.length === leads.length;
  const someSelected = selectedLeadIds.length > 0 && selectedLeadIds.length < leads.length;

  // Verificar si el nombre del contacto es solo un número de teléfono
  const isPhoneNumber = (name: string): boolean => {
    // Eliminar espacios y caracteres especiales comunes en números de teléfono
    const cleanName = name.replace(/[\s\-\(\)\+]/g, '');
    // Verificar si contiene solo dígitos (permite + al inicio)
    return /^[\+]?\d+$/.test(cleanName);
  };

  const renderCellContent = (lead: Lead, columnId: string) => {
    const hasAlerts = lead.alerts.length > 0;
    
    // Calcular preguntas respondidas (incluyendo bloqueadas)
    const getAnsweredQuestionsCount = () => {
      const lockedQuestionsTotal = 3; // Nombre, teléfono, tipo de cliente (preguntas bloqueadas)
      const leadQuestions = lead.qualificationQuestions || [];
      const totalQuestions = leadQuestions.length + lockedQuestionsTotal;
      
      // Contar preguntas bloqueadas respondidas
      let lockedAnswered = 0;
      
      // Pregunta 1: Nombre - respondida si hay nombre del cliente o de la plataforma
      const hasName = (lead.contactName && lead.contactName !== '-') || 
                      lead.whatsappName || lead.instagramUsername || 
                      lead.messengerName || lead.tiktokUsername;
      if (hasName) lockedAnswered++;
      
      // Pregunta 2: Teléfono - siempre respondida
      lockedAnswered++;
      
      // Pregunta 3: Tipo de cliente - respondida si no es "otros"
      if (lead.intention !== 'otros') lockedAnswered++;
      
      // Contar preguntas del lead con respuesta
      const leadAnsweredCount = leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
      
      const answeredCount = leadAnsweredCount + lockedAnswered;
      return { answered: answeredCount, total: totalQuestions };
    };

    switch (columnId) {
      case 'contact':
        const getSourceIcon = () => {
          const iconColor = unreadLeads.has(lead.id) ? 'text-gray-900' : 'text-gray-600';
          if (lead.source === 'whatsapp') {
            return <WhatsAppIcon className={`h-4 w-4 ${iconColor}`} />;
          } else if (lead.source === 'instagram') {
            return <Instagram className={`h-4 w-4 ${iconColor}`} />;
          } else if (lead.source === 'messenger') {
            return <MessengerIcon className={`h-4 w-4 ${iconColor}`} />;
          } else if (lead.source === 'tiktok') {
            return <TikTokIcon className={`h-4 w-4 ${iconColor}`} />;
          } else if (lead.source === 'phone') {
            return <Phone className={`h-4 w-4 ${iconColor}`} />;
          } else {
            return <Mail className={`h-4 w-4 ${iconColor}`} />;
          }
        };
        
        // Obtener el primer mensaje que envió el lead (cliente)
        const getFirstLeadMessage = () => {
          const conversation = mockConversations.find(c => c.leadId === lead.id);
          if (!conversation) return null;
          // Buscar el primer mensaje enviado por el lead (cliente), no por el agente
          const firstLeadMsg = conversation.messages.find(m => m.senderId === 'lead');
          return firstLeadMsg ? firstLeadMsg.text : null;
        };
        
        const firstLeadMessage = getFirstLeadMessage();
        const isBotDisabled = disabledBotLeads.has(lead.id);
        
        // Icono según intención (comprador, vendedor u otros)
        const getIntentionIcon = () => {
          if (lead.intention === 'comprar') {
            return <Home className="h-4 w-4 text-green-600" />;
          } else if (lead.intention === 'vender') {
            return <DollarSign className="h-4 w-4 text-blue-600" />;
          } else {
            return <HelpCircle className="h-4 w-4 text-gray-600" />;
          }
        };
        
        return (
          <div className="flex items-center gap-3">
            <div 
              className="relative flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                const avatarSrc = savedContact?.avatar || lead.avatar;
                if (avatarSrc) {
                  setAvatarViewImage(avatarSrc);
                  setAvatarViewOpen(true);
                }
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={(() => {
                  const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                  const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                  return savedContact?.avatar || lead.avatar;
                })()} alt={lead.phone} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                  {(() => {
                    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                    const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                    if (savedContact?.name) {
                      return savedContact.name.charAt(0).toUpperCase();
                    }
                    const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                    return platformName ? platformName.charAt(0).toUpperCase() : lead.phone.charAt(0);
                  })()}
                </AvatarFallback>
              </Avatar>
              {/* Badge flotante del canal */}
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 pointer-events-none">
                {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3 w-3" /> : 
                 lead.source === 'instagram' ? <Instagram className="h-3 w-3" /> :
                 lead.source === 'messenger' ? <MessengerIcon className="h-3 w-3" /> :
                 lead.source === 'tiktok' ? <TikTokIcon className="h-3 w-3" /> :
                 <Phone className="h-3 w-3" />}
              </div>
            </div>
            <div 
              onClick={() => onOpenChat(lead.id)}
              className="min-w-0 flex-1 cursor-pointer group"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className={`text-sm transition-colors truncate max-w-[350px] ${
                    unreadLeads.has(lead.id) ? 'font-bold text-gray-900' : 'font-normal text-gray-600'
                  }`}
                >
                  {(() => {
                    // Verificar si el contacto está guardado
                    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                    const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                    
                    // Si está guardado, mostrar el nombre guardado truncado
                    if (savedContact?.name) {
                      return truncateName(savedContact.name);
                    }
                    
                    // Si no está guardado, siempre mostrar el número
                    return lead.phone;
                  })()}
                </span>
                {(() => {
                  // Verificar si el contacto está guardado
                  const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                  const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
                  
                  // Solo mostrar el nombre/username de la plataforma si no está guardado
                  if (!isContactSaved) {
                    const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                    if (platformName) {
                      return (
                        <span className="text-xs text-gray-600">
                          · {platformName}
                        </span>
                      );
                    }
                  }
                  return null;
                })()}
                {isBotDisabled && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-gray-100 text-gray-600 border-gray-300">
                    <BotOff className="h-2.5 w-2.5 mr-0.5" />
                    Bot desactivado
                  </Badge>
                )}
              </div>
              <p className={`text-xs truncate ${
                unreadLeads.has(lead.id) ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {firstLeadMessage 
                  ? (firstLeadMessage.length > 45 
                      ? firstLeadMessage.substring(0, 45) + '...' 
                      : firstLeadMessage)
                  : lead.propertyType
                }
              </p>
            </div>
          </div>
        );
      case 'name':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{lead.contactName || '-'}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-sm">{lead.contactPhone || '-'}</span>
          </div>
        );
      case 'role':
        const roleConfig = {
          comprador: { label: 'Comprador', icon: Home, color: 'bg-green-50 text-green-700 border-green-200' },
          vendedor: { label: 'Vendedor', icon: DollarSign, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          arrendador: { label: 'Arrendador', icon: Building2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          inquilino: { label: 'Inquilino', icon: Key, color: 'bg-orange-50 text-orange-700 border-orange-200' },
          otros: { label: 'Sin definir', icon: HelpCircle, color: 'bg-gray-50 text-gray-700 border-gray-200' }
        };
        const config = roleConfig[lead.intention as keyof typeof roleConfig];
        const RoleIcon = config.icon;
        return (
          <Badge variant="outline" className={`${config.color} text-xs px-2.5 py-0.5 gap-1 text-[#080808]`}>
            <RoleIcon className="h-3 w-3 text-[#080808]" />
            {config.label}
          </Badge>
        );
      case 'email':
        return (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600">{lead.email || '-'}</span>
          </div>
        );
      case 'zone':
        return (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-sm">{lead.zone}</span>
          </div>
        );
      case 'budget':
        return lead.budget ? (
          <span className="text-sm font-medium text-green-600">{lead.budget}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      case 'qualification':
        const questionsCount = getAnsweredQuestionsCount();
        const leadScore = calculateLeadScore(lead);
        const qualification = getQualification(leadScore);
        const qualConfig = qualificationConfig[qualification];
        const QualIcon = qualConfig.icon;
        return (
          <div 
            className="flex items-center gap-2 w-full cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onOpenQualification(lead.id);
            }}
          >
            <div className="flex-1 min-w-[80px] bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full transition-all bg-primary"
                style={{ width: `${leadScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap min-w-[35px]">
              ({questionsCount.answered}/{questionsCount.total})
            </span>
          </div>
        );
      case 'matchedProperty':
        return lead.matchedProperty ? (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={(e) => {
              e.stopPropagation();
              // Buscar la propiedad en mockProperties
              const property = mockProperties.find(p => p.id === lead.matchedProperty?.propertyId);
              if (property) {
                onOpenProperty(property, lead);
              }
            }}
          >
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-md group-hover:bg-green-100 transition-colors">
              <Home className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span className="text-xs text-green-700" title={lead.matchedProperty.propertyTitle}>
                {lead.matchedProperty.propertyTitle.length > 10 
                  ? lead.matchedProperty.propertyTitle.substring(0, 10) + '...'
                  : lead.matchedProperty.propertyTitle}
              </span>
              <ExternalLink className="h-3 w-3 text-green-600 flex-shrink-0" />
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      case 'date':
        return (
          <span className="text-sm text-gray-600 whitespace-nowrap text-[12px]">
            {(() => {
              const lastContactDate = new Date(lead.lastContact);
              const now = new Date();
              
              // Resetear horas para comparar solo fechas
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const contactDay = new Date(lastContactDate.getFullYear(), lastContactDate.getMonth(), lastContactDate.getDate());
              const diffMs = today.getTime() - contactDay.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              // Si es hoy
              if (diffDays === 0) {
                const hours = lastContactDate.getHours().toString().padStart(2, '0');
                const minutes = lastContactDate.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
              }
              
              // Si fue ayer
              if (diffDays === 1) {
                return 'Ayer';
              }
              
              // Si fue hace más días, mostrar fecha
              const day = lastContactDate.getDate().toString().padStart(2, '0');
              const month = (lastContactDate.getMonth() + 1).toString().padStart(2, '0');
              const year = lastContactDate.getFullYear();
              
              // Si es del mismo año, no mostrar año
              if (year === now.getFullYear()) {
                return `${day}/${month}`;
              }
              
              // Si es de otro año, mostrar año completo
              return `${day}/${month}/${year}`;
            })()}
          </span>
        );
      case 'interactions':
        return (
          <span className="text-sm text-gray-600">{lead.interactions}</span>
        );
      case 'actions':
        const getChatIcon = () => {
          if (lead.source === 'whatsapp') {
            return <WhatsAppIcon className="h-3 w-3" />;
          } else if (lead.source === 'instagram') {
            return <Instagram className="h-3 w-3" />;
          } else if (lead.source === 'messenger') {
            return <MessengerIcon className="h-3 w-3" />;
          } else if (lead.source === 'tiktok') {
            return <TikTokIcon className="h-3 w-3" />;
          } else {
            return <Phone className="h-3 w-3" />;
          }
        };
        
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleCall(lead.phone, lead.id)}
              className="h-7 px-2 text-xs"
            >
              <Phone className="h-3 w-3" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 px-2 text-xs"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(() => {
                  const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                  const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
                  
                  return (
                    <>
                      {!isContactSaved ? (
                        <DropdownMenuItem onClick={() => onOpenSaveContact(lead.id)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Guardar contacto
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onOpenSaveContact(lead.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar contacto
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  );
                })()}
                <DropdownMenuItem>
                  <Send className="h-4 w-4 mr-2" />
                  Mandar al CRM
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleBotStatus(lead.id)}>
                  <BotOff className="h-4 w-4 mr-2" />
                  {disabledBotLeads.has(lead.id) ? 'Activar bot para este contacto' : 'Desactivar bot para este contacto'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        // Para columnas personalizadas, mostrar un campo editable
        if (columnId.startsWith('custom-')) {
          return (
            <span className="text-sm text-gray-500 italic">-</span>
          );
        }
        return null;
    }
  };

  // Vista móvil estilo WhatsApp
  if (isMobile) {
    return (
      <div className="space-y-0">
        {/* Lista de conversaciones estilo WhatsApp */}
        <div className="bg-white pb-32">
          {leads.map((lead, index) => {
            const conversation = mockConversations.find(c => c.leadId === lead.id);
            const firstLeadMessage = conversation?.messages.find(m => m.senderId === 'lead')?.text || lead.lastMessage;
            const isUnread = unreadLeads.has(lead.id);
            
            // Obtener cualificación del lead
            const leadScore = calculateLeadScore(lead);
            const qualification = getQualification(leadScore);
            const qualConfig = qualificationConfig[qualification];
            
            // Calcular preguntas respondidas (incluyendo bloqueadas)
            const getAnsweredQuestionsCount = () => {
              const lockedQuestionsTotal = 3; // Nombre, teléfono, tipo de cliente (preguntas bloqueadas)
              const leadQuestions = lead.qualificationQuestions || [];
              const totalQuestions = leadQuestions.length + lockedQuestionsTotal;
              
              // Contar preguntas bloqueadas respondidas
              let lockedAnswered = 0;
              
              // Pregunta 1: Nombre - respondida si hay nombre del cliente o de la plataforma
              const hasName = (lead.contactName && lead.contactName !== '-') || 
                              lead.whatsappName || lead.instagramUsername || 
                              lead.messengerName || lead.tiktokUsername;
              if (hasName) lockedAnswered++;
              
              // Pregunta 2: Teléfono - siempre respondida
              lockedAnswered++;
              
              // Pregunta 3: Tipo de cliente - respondida si no es "otros"
              if (lead.intention !== 'otros') lockedAnswered++;
              
              // Contar preguntas del lead con respuesta
              const leadAnsweredCount = leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
              
              const answeredCount = leadAnsweredCount + lockedAnswered;
              return { answered: answeredCount, total: totalQuestions };
            };
            
            const questionsCount = getAnsweredQuestionsCount();
            
            // Icono según canal (WhatsApp, Instagram, Messenger, etc.)
            const getSourceIcon = () => {
              if (lead.source === 'whatsapp') {
                return <WhatsAppIcon className="h-4 w-4" />;
              } else if (lead.source === 'instagram') {
                return <Instagram className="h-4 w-4" />;
              } else if (lead.source === 'messenger') {
                return <MessengerIcon className="h-4 w-4" />;
              } else if (lead.source === 'tiktok') {
                return <TikTokIcon className="h-4 w-4" />;
              } else if (lead.source === 'phone') {
                return <Phone className="h-4 w-4" />;
              } else {
                return <TikTokIcon className="h-4 w-4" />;
              }
            };

            return (
              <div 
                key={lead.id}
                className={`flex items-center gap-2 px-2 py-4 border-b border-gray-100 active:bg-gray-50 cursor-pointer ${
                  isUnread ? 'bg-green-50/30' : 'bg-white'
                }`}
                onClick={() => {
                  if (!swipeDataRef.current.isSwiping) {
                    onOpenChat(lead.id);
                  }
                }}
                onTouchStart={(e) => {
                  swipeDataRef.current.startX = e.touches[0].clientX;
                  swipeDataRef.current.startY = e.touches[0].clientY;
                  swipeDataRef.current.isSwiping = false;
                }}
                onTouchMove={(e) => {
                  const touchEndX = e.touches[0].clientX;
                  const touchEndY = e.touches[0].clientY;
                  const diffX = Math.abs(touchEndX - swipeDataRef.current.startX);
                  const diffY = Math.abs(touchEndY - swipeDataRef.current.startY);
                  
                  // Si se movió más de 10px en cualquier dirección, es un swipe
                  if (diffX > 10 || diffY > 10) {
                    swipeDataRef.current.isSwiping = true;
                  }
                }}
              >
                {/* Avatar con badge del canal */}
                <div 
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                    const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                    const avatarSrc = savedContact?.avatar || lead.avatar;
                    if (avatarSrc) {
                      setAvatarViewImage(avatarSrc);
                      setAvatarViewOpen(true);
                    }
                  }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={(() => {
                      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                      const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                      return savedContact?.avatar || lead.avatar;
                    })()} alt={lead.phone} />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {(() => {
                        const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                        const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                        if (savedContact?.name) {
                          return savedContact.name.charAt(0).toUpperCase();
                        }
                        const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                        return platformName ? platformName.charAt(0).toUpperCase() : lead.phone.charAt(0);
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Badge flotante del canal */}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 pointer-events-none">
                    {getSourceIcon()}
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  {/* Nombre */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h3 className={`truncate ${isUnread ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
                        {truncateName(lead.name)}
                      </h3>
                      {disabledBotLeads.has(lead.id) && (
                        <BotOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <span className={`text-xs flex-shrink-0 ml-2 ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                      {(() => {
                        const lastContactDate = new Date(lead.lastContact);
                        const now = new Date();
                        const diffMs = now.getTime() - lastContactDate.getTime();
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        
                        // Si fue hace menos de 60 minutos
                        if (diffMins < 60) {
                          return `${diffMins} min`;
                        }
                        
                        // Si fue hoy (menos de 24 horas y mismo día)
                        if (diffDays === 0) {
                          const hours = lastContactDate.getHours().toString().padStart(2, '0');
                          const minutes = lastContactDate.getMinutes().toString().padStart(2, '0');
                          return `${hours}:${minutes}`;
                        }
                        
                        // Si fue en otro día, mostrar fecha corta
                        const day = lastContactDate.getDate().toString().padStart(2, '0');
                        const month = (lastContactDate.getMonth() + 1).toString().padStart(2, '0');
                        return `${day}/${month}`;
                      })()}
                    </span>
                  </div>

                  {/* Nombre de la plataforma (si aplica) */}
                  {(() => {
                    // Verificar si el contacto está guardado
                    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                    const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
                    const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.name;
                    
                    // Solo mostrar el nombre de la plataforma si el contacto NO está guardado y es diferente del nombre principal
                    if (!isContactSaved && platformName !== lead.name) {
                      return (
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {platformName}
                        </p>
                      );
                    }
                    return null;
                  })()}

                  {/* Último mensaje */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {firstLeadMessage.length > 60 
                        ? firstLeadMessage.substring(0, 60) + '...' 
                        : firstLeadMessage}
                    </p>
                  </div>

                  {/* Badge con cualificación y rol */}
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Badge 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQualification(lead.id);
                      }}
                      className={`${
                        lead.intention === 'comprador' ? 'bg-green-50 border-green-200' :
                        lead.intention === 'vendedor' ? 'bg-blue-50 border-blue-200' :
                        lead.intention === 'arrendador' ? 'bg-purple-50 border-purple-200' :
                        lead.intention === 'inquilino' ? 'bg-orange-50 border-orange-200' :
                        'bg-gray-50 border-gray-200'
                      } flex-shrink-0 text-xs px-1.5 py-0.5 cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      <span className={
                        lead.intention === 'comprador' ? 'text-green-700' :
                        lead.intention === 'vendedor' ? 'text-blue-700' :
                        lead.intention === 'arrendador' ? 'text-purple-700' :
                        lead.intention === 'inquilino' ? 'text-orange-700' :
                        'text-gray-700'
                      }>
                        {questionsCount.answered}/{questionsCount.total} · {
                          lead.intention === 'comprador' ? 'Comprador' :
                          lead.intention === 'vendedor' ? 'Vendedor' :
                          lead.intention === 'arrendador' ? 'Arrendador' :
                          lead.intention === 'inquilino' ? 'Inquilino' :
                          'Sin definir'
                        }
                      </span>
                    </Badge>
                    
                    {/* Propiedad coincidente - visible solo para compradores e inquilinos */}
                    {lead.matchedProperty && (lead.intention === 'comprador' || lead.intention === 'inquilino') && (
                      <div 
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors cursor-pointer flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Buscar la propiedad en mockProperties
                          const property = mockProperties.find(p => p.id === lead.matchedProperty?.propertyId);
                          if (property) {
                            onOpenProperty(property, lead);
                          }
                        }}
                      >
                        <Home className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-green-700" title={lead.matchedProperty.propertyTitle}>
                          {lead.matchedProperty.propertyTitle.length > 8 
                            ? lead.matchedProperty.propertyTitle.substring(0, 8) + '...'
                            : lead.matchedProperty.propertyTitle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Menú de acciones */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Prevenir apertura si fue un swipe
                        if (swipeDataRef.current.isSwiping) {
                          e.preventDefault();
                        }
                      }}
                      onPointerDown={(e) => {
                        // Prevenir apertura si fue un swipe
                        if (swipeDataRef.current.isSwiping) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleCall(lead.phone, lead.id);
                    }}>
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onOpenQualification(lead.id);
                    }}>
                      <Star className="h-4 w-4 mr-2" />
                      Ver cualificación
                    </DropdownMenuItem>
                    {(() => {
                      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                      const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
                      
                      return !isContactSaved ? (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onOpenSaveContact(lead.id);
                        }}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Guardar contacto
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onOpenSaveContact(lead.id);
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar contacto
                        </DropdownMenuItem>
                      );
                    })()}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar al CRM
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toggleBotStatus(lead.id);
                    }}>
                      <BotOff className="h-4 w-4 mr-2" />
                      {disabledBotLeads.has(lead.id) ? 'Activar bot' : 'Desactivar bot'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
        
        {/* Dialog para ver avatar en grande - Vista móvil */}
        <Dialog open={avatarViewOpen} onOpenChange={setAvatarViewOpen}>
          <DialogContent className="max-w-3xl p-0 bg-black/95 border-none" aria-describedby={undefined}>
            <DialogTitle className="sr-only">Vista de avatar</DialogTitle>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm h-10 w-10 rounded-[10px]"
                onClick={() => setAvatarViewOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img 
                src={avatarViewImage} 
                alt="Avatar" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista desktop (tabla)
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                  />
                </TableHead>
                {visibleColumns.map(column => (
                  <TableHead key={column.id} className={`${column.width} font-semibold`}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const hasAlerts = lead.alerts.length > 0;
                const isFocused = focusedLeadId === lead.id;
                
                return (
                  <TableRow 
                    key={lead.id} 
                    className={`hover:bg-primary/5 transition-colors ${isFocused ? 'bg-primary/5' : 'bg-white'}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedLeadIds.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                      />
                    </TableCell>
                    {visibleColumns.map(column => (
                      <TableCell key={column.id}>
                        {renderCellContent(lead, column.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Paginación */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        
        <div className="flex items-center gap-1">
          {/* Primera página */}
          {currentPage > 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-9 px-0"
              >
                1
              </Button>
              {currentPage > 3 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}
          
          {/* Página anterior */}
          {currentPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              className="w-9 px-0"
            >
              {currentPage - 1}
            </Button>
          )}
          
          {/* Página actual */}
          <Button
            variant="default"
            size="sm"
            className="w-9 px-0"
          >
            {currentPage}
          </Button>
          
          {/* Página siguiente */}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              className="w-9 px-0"
            >
              {currentPage + 1}
            </Button>
          )}
          
          {/* Última página */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-9 px-0"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )}

    {/* Lead Details Dialog - ELIMINADO */}
    {/* <LeadDetailsDialog
      lead={selectedLead}
      open={detailsDialogOpen}
      onOpenChange={setDetailsDialogOpen}
    /> */}
    
    {/* Dialog para ver avatar en grande */}
    <Dialog open={avatarViewOpen} onOpenChange={setAvatarViewOpen}>
      <DialogContent className="max-w-3xl p-0 bg-black/95 border-none" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Vista de avatar</DialogTitle>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm h-10 w-10 rounded-[10px]"
            onClick={() => setAvatarViewOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img 
            src={avatarViewImage} 
            alt="Avatar" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-[10px]"
          />
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

// Componente Panel de Cualificación
export const QualificationPanel = ({
  open,
  onOpenChange,
  lead,
  disabledBotLeads,
  toggleBotStatus,
  onCall,
  onOpenSaveContact,
  onOpenQualification
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null | undefined;
  disabledBotLeads?: Set<string>;
  toggleBotStatus?: (leadId: string) => void;
  onCall: (phone: string, leadId?: string) => void;
  onOpenSaveContact?: (leadId: string) => void;
  onOpenQualification?: (leadId: string) => void;
}) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [displayName, setDisplayName] = useState<string>('');
  const [contactUpdateTrigger, setContactUpdateTrigger] = useState(0);
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [avatarViewImage, setAvatarViewImage] = useState<string>('');
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actualizar displayName cuando cambia el lead o cuando se guarda un contacto
  useEffect(() => {
    if (!lead) return;
    
    const updateDisplayName = () => {
      // Buscar en savedContacts si existe un nombre guardado
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
      
      if (savedContact && savedContact.name) {
        // Si hay contacto guardado, mostrar el nombre guardado
        setDisplayName(savedContact.name);
      } else {
        // Si NO hay contacto guardado, mostrar solo el teléfono
        setDisplayName(lead.phone);
      }
    };

    updateDisplayName();

    // Listener para actualizar cuando se guarda un contacto
    const handleContactsUpdated = () => {
      updateDisplayName();
      setContactUpdateTrigger(prev => prev + 1); // Forzar re-render del menú
    };

    window.addEventListener('contactsUpdated', handleContactsUpdated);
    return () => window.removeEventListener('contactsUpdated', handleContactsUpdated);
  }, [lead]);

  if (!lead) return null;

  // Función para verificar si el contacto está guardado
  const isContactSaved = () => {
    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
    return savedContacts.some((c: any) => c.phone === lead.phone);
  };

  const getRoleIcon = () => {
    if (lead.intention === 'comprador') {
      return <Home className="h-5 w-5 text-green-600" />;
    } else if (lead.intention === 'vendedor') {
      return <DollarSign className="h-5 w-5 text-blue-600" />;
    } else if (lead.intention === 'arrendador') {
      return <Building2 className="h-5 w-5 text-purple-600" />;
    } else if (lead.intention === 'inquilino') {
      return <Key className="h-5 w-5 text-orange-600" />;
    } else {
      return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleTitle = () => {
    if (lead.intention === 'comprador') return 'Comprador';
    if (lead.intention === 'vendedor') return 'Vendedor';
    if (lead.intention === 'arrendador') return 'Arrendador';
    if (lead.intention === 'inquilino') return 'Inquilino';
    return 'Sin definir';
  };

  const getSourceIcon = () => {
    if (lead.source === 'whatsapp') {
      return <WhatsAppIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'instagram') {
      return <Instagram className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'messenger') {
      return <MessengerIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'tiktok') {
      return <TikTokIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'phone') {
      return <Phone className="h-4 w-4 text-gray-500" />;
    } else {
      return <TikTokIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatQuestionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Las preguntas del lead son las que le hizo el asistente durante la conversación
  const leadQuestions = lead.qualificationQuestions || [];
  
  // Calcular preguntas bloqueadas respondidas
  let lockedAnswered = 0;
  
  // Nombre (respondido si tiene nombre del cliente o de la plataforma)
  if (lead.contactName || lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername) {
    lockedAnswered++;
  }
  
  // Teléfono (siempre respondido)
  lockedAnswered++;
  
  // Rol (respondido si no es "otros")
  if (lead.intention !== 'otros') {
    lockedAnswered++;
  }
  
  // Total de preguntas = 3 bloqueadas + preguntas del lead
  const totalQuestions = 3 + leadQuestions.length;
  
  // Preguntas respondidas del lead (con answer no vacío)
  const leadAnsweredCount = leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
  
  // Total respondidas = bloqueadas + del lead
  const totalAnswered = lockedAnswered + leadAnsweredCount;
  
  // Crear mapa de preguntas respondidas por ID para búsqueda rápida
  const answeredQuestionsMap = new Map(
    leadQuestions.map(q => [q.id, q])
  );
  
  // Combinar todas las preguntas con su estado de respuesta
  const allQuestionsWithStatus = leadQuestions.map(q => ({
    id: q.id,
    question: q.question,
    answer: q.answer,
    timestamp: q.timestamp,
    isAnswered: !!(q.answer && q.answer.trim() !== '')
  }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] p-0">
        <div className="flex flex-col h-full">
          {/* Header - Fijo arriba */}
          <SheetHeader className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <SheetDescription className="sr-only">
              Ver cualificación de {displayName}
            </SheetDescription>
            
            <div className="flex items-center gap-1.5 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 px-1 flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <div 
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (lead.avatar) {
                      setAvatarViewImage(lead.avatar);
                      setAvatarViewOpen(true);
                    }
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lead.avatar} alt={displayName} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Badge flotante del canal */}
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200 pointer-events-none">
                    {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3.5 w-3.5" /> : 
                     lead.source === 'instagram' ? <Instagram className="h-3.5 w-3.5" /> :
                     lead.source === 'messenger' ? <MessengerIcon className="h-3.5 w-3.5" /> :
                     lead.source === 'tiktok' ? <TikTokIcon className="h-3.5 w-3.5" /> :
                     <Phone className="h-3.5 w-3.5" />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <SheetTitle className="leading-tight break-words font-normal flex-1 min-w-0">
                      {(() => {
                        if (displayName !== lead.phone) {
                          // Si está guardado: mostrar nombre guardado con icono inline
                          return (
                            <div className="space-y-0.5">
                              <div className="text-base text-black font-semibold flex items-center gap-2">
                                {disabledBotLeads && disabledBotLeads.has(lead.id) && (
                                  <BotOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                )}
                                <span>{displayName}</span>
                              </div>
                            </div>
                          );
                        } else {
                          // Si no está guardado: teléfono con icono inline en línea 1, nombre del canal en línea 2
                          const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                          return (
                            <div className="space-y-0.5">
                              <div className="text-base text-black font-semibold flex items-center gap-2">
                                {disabledBotLeads && disabledBotLeads.has(lead.id) && (
                                  <BotOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                )}
                                <span>{lead.phone}</span>
                              </div>
                              {platformName && (
                                <div className="text-sm text-gray-500">{platformName}</div>
                              )}
                            </div>
                          );
                        }
                      })()}
                    </SheetTitle>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 flex-shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" key={contactUpdateTrigger}>
                  {onOpenSaveContact && (
                    !isContactSaved() ? (
                      <DropdownMenuItem onClick={() => onOpenSaveContact(lead.id)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Guardar contacto
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onOpenSaveContact(lead.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar contacto
                      </DropdownMenuItem>
                    )
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Send className="h-4 w-4 mr-2" />
                    Mandar al CRM
                  </DropdownMenuItem>
                  {toggleBotStatus && disabledBotLeads && (
                    <DropdownMenuItem onClick={() => toggleBotStatus(lead.id)}>
                      <BotOff className="h-4 w-4 mr-2" />
                      {disabledBotLeads.has(lead.id) ? 'Activar bot para este contacto' : 'Desactivar bot para este contacto'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetHeader>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-4 space-y-4 pb-28">
                {/* Barra de progreso */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Progreso de cualificación</h3>
                    <span className="text-lg font-bold text-primary">{calculateLeadScore(lead)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full transition-all bg-primary"
                      style={{ width: `${calculateLeadScore(lead)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {totalAnswered} de {totalQuestions} preguntas respondidas
                  </p>
                </div>

                {/* Preguntas y Respuestas */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Preguntas y respuestas</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Preguntas bloqueadas (siempre primero) */}
                    {(() => {
                      // Determinar el nombre y su fuente
                      const getNameInfo = () => {
                        // 1. Primero verificar si hay nombre guardado del cliente
                        if (lead.contactName && lead.contactName !== '-') {
                          return {
                            name: lead.contactName,
                            source: 'client',
                            sourceLabel: 'Proporcionado por el cliente'
                          };
                        }
                        
                        // 2. Si no, usar el nombre de la plataforma
                        if (lead.source === 'whatsapp' && lead.whatsappName) {
                          return {
                            name: lead.whatsappName,
                            source: 'whatsapp',
                            sourceLabel: 'De WhatsApp',
                            icon: <WhatsAppIcon className="h-3 w-3" />
                          };
                        }
                        
                        if (lead.source === 'instagram' && lead.instagramUsername) {
                          return {
                            name: lead.instagramUsername,
                            source: 'instagram',
                            sourceLabel: 'De Instagram',
                            icon: <Instagram className="h-3 w-3" />
                          };
                        }
                        
                        if (lead.source === 'messenger' && lead.messengerName) {
                          return {
                            name: lead.messengerName,
                            source: 'messenger',
                            sourceLabel: 'De Messenger',
                            icon: <MessengerIcon className="h-3 w-3" />
                          };
                        }
                        
                        if (lead.source === 'tiktok' && lead.tiktokUsername) {
                          return {
                            name: lead.tiktokUsername,
                            source: 'tiktok',
                            sourceLabel: 'De TikTok',
                            icon: <TikTokIcon className="h-3 w-3" />
                          };
                        }
                        
                        // 3. Si no hay nada, usar el teléfono
                        return {
                          name: lead.phone,
                          source: 'phone',
                          sourceLabel: 'Sin nombre'
                        };
                      };

                      const nameInfo = getNameInfo();

                      // Determinar si el teléfono viene del canal
                      const getPhoneInfo = () => {
                        // El teléfono siempre existe, pero verificar si viene del canal original
                        // En WhatsApp, el teléfono siempre es del canal
                        if (lead.source === 'whatsapp') {
                          return {
                            phone: lead.phone,
                            source: 'whatsapp',
                            sourceLabel: 'De WhatsApp',
                            icon: <WhatsAppIcon className="h-3 w-3" />
                          };
                        }
                        
                        // Instagram puede tener teléfono si el usuario lo compartió en la conversación
                        if (lead.source === 'instagram') {
                          return {
                            phone: lead.phone,
                            source: 'instagram',
                            sourceLabel: 'De Instagram',
                            icon: <Instagram className="h-3 w-3" />
                          };
                        }
                        
                        // Messenger puede tener teléfono
                        if (lead.source === 'messenger') {
                          return {
                            phone: lead.phone,
                            source: 'messenger',
                            sourceLabel: 'De Messenger',
                            icon: <MessengerIcon className="h-3 w-3" />
                          };
                        }
                        
                        // TikTok puede tener teléfono
                        if (lead.source === 'tiktok') {
                          return {
                            phone: lead.phone,
                            source: 'tiktok',
                            sourceLabel: 'De TikTok',
                            icon: <TikTokIcon className="h-3 w-3" />
                          };
                        }
                        
                        // Si no tiene fuente identificada del canal, solo retornar el teléfono
                        return {
                          phone: lead.phone,
                          source: 'unknown',
                          sourceLabel: null
                        };
                      };

                      const phoneInfo = getPhoneInfo();

                      const lockedQuestions = [
                        {
                          id: 'locked-name',
                          question: '¿Cuál es tu nombre?',
                          answer: nameInfo.name,
                          source: nameInfo.source,
                          sourceLabel: nameInfo.sourceLabel,
                          sourceIcon: nameInfo.icon,
                          isLocked: true,
                          isAnswered: nameInfo.source === 'client' || nameInfo.source === 'whatsapp' || nameInfo.source === 'instagram' || nameInfo.source === 'messenger' || nameInfo.source === 'tiktok'
                        },
                        {
                          id: 'locked-phone',
                          question: '¿Cuál es tu teléfono?',
                          answer: phoneInfo.phone,
                          source: phoneInfo.source,
                          sourceLabel: phoneInfo.sourceLabel,
                          sourceIcon: phoneInfo.icon,
                          isLocked: true,
                          isAnswered: true // Siempre tenemos el teléfono
                        },
                        {
                          id: 'locked-role',
                          question: '¿Qué tipo de cliente eres?',
                          answer: getRoleTitle(),
                          isLocked: true,
                          isAnswered: lead.intention !== 'otros'
                        }
                      ];

                      return lockedQuestions.map((q, index) => (
                        <div
                          key={q.id}
                          className={`rounded-lg p-4 border ${
                            q.isAnswered 
                              ? 'bg-white border-gray-200' 
                              : 'bg-gray-50 border-gray-200 border-dashed'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="relative flex-shrink-0">
                              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                q.isAnswered 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {index + 1}
                              </span>
                              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm border border-gray-200">
                                <Bot className="h-2 w-2 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                q.isAnswered ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {q.question}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Dato obtenido por el asistente
                              </p>
                            </div>
                          </div>
                          {q.isAnswered ? (
                            <div className="ml-8 mt-2 bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-gray-900">{q.answer}</p>
                                {((q.id === 'locked-name' && q.source && q.source !== 'client') || 
                                  (q.id === 'locked-phone' && q.sourceLabel)) && (
                                  <Badge variant="outline" className="flex-shrink-0 text-[10px] py-0 px-1.5 h-5 bg-gray-100 text-gray-600 border-gray-300 gap-1">
                                    {q.sourceIcon}
                                    {q.sourceLabel}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="ml-8 mt-2 bg-gray-100 rounded-lg p-3 border-l-4 border-gray-300">
                              <p className="text-sm text-gray-400 italic">Pendiente de respuesta</p>
                            </div>
                          )}
                        </div>
                      ));
                    })()}

                    {/* Preguntas de cualificación normales */}
                    {allQuestionsWithStatus.map((q, index) => (
                      <div
                        key={q.id}
                        className={`rounded-lg p-4 border ${
                          q.isAnswered 
                            ? 'bg-white border-gray-200' 
                            : 'bg-gray-50 border-gray-200 border-dashed'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            q.isAnswered 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {index + 4}
                          </span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              q.isAnswered ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {q.question}
                            </p>
                            {q.isAnswered && q.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatQuestionTime(q.timestamp)}
                              </p>
                            )}
                            {!q.isAnswered && (
                              <p className="text-xs text-gray-400 mt-1">
                                Sin responder
                              </p>
                            )}
                          </div>
                        </div>
                        {q.isAnswered && q.answer && (
                          <div className="ml-8 mt-2 bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                            <p className="text-sm text-gray-900">{q.answer}</p>
                          </div>
                        )}
                        {!q.isAnswered && (
                          <div className="ml-8 mt-2 bg-gray-100 rounded-lg p-3 border-l-4 border-gray-300">
                            <p className="text-sm text-gray-400 italic">Pendiente de respuesta</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Footer - Fijo abajo */}
          <div className="border-t border-gray-200 px-6 py-3 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Button
                onClick={() => onCall(lead.phone, lead.id)}
                size="sm"
                variant="outline"
                className="flex-1 h-9 gap-2"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
              <Button
                onClick={() => {
                  if (lead.source === 'whatsapp') {
                    const phone = lead.phone.replace(/[^0-9+]/g, '');
                    window.open(`https://wa.me/${phone}`, '_blank');
                  } else if (lead.source === 'instagram') {
                    window.open('https://www.instagram.com/direct/inbox/', '_blank');
                  } else if (lead.source === 'messenger') {
                    window.open('https://www.messenger.com/', '_blank');
                  } else if (lead.source === 'tiktok') {
                    window.open('https://www.tiktok.com/messages', '_blank');
                  }
                }}
                size="sm"
                className={`flex-1 h-9 gap-2 text-white ${
                  lead.source === 'whatsapp' 
                    ? 'bg-[#25D366] hover:bg-[#20BA5A]' 
                    : lead.source === 'instagram'
                    ? 'bg-[#E4405F] hover:bg-[#D32F4F]'
                    : lead.source === 'messenger'
                    ? 'bg-[#0084FF] hover:bg-[#0073E6]'
                    : lead.source === 'tiktok'
                    ? 'bg-[#000000] hover:bg-[#333333]'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {lead.source === 'whatsapp' ? (
                  <WhatsAppIcon className="h-4 w-4" />
                ) : lead.source === 'instagram' ? (
                  <Instagram className="h-4 w-4" />
                ) : lead.source === 'messenger' ? (
                  <MessengerIcon className="h-4 w-4" />
                ) : lead.source === 'tiktok' ? (
                  <TikTokIcon className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                Abrir {lead.source === 'whatsapp' ? 'WhatsApp' : lead.source === 'instagram' ? 'Instagram' : lead.source === 'messenger' ? 'Messenger' : lead.source === 'tiktok' ? 'TikTok' : 'Chat'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
      
      {/* Dialog para ver avatar en grande */}
      <Dialog open={avatarViewOpen} onOpenChange={setAvatarViewOpen}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Vista de avatar</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setAvatarViewOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img 
              src={avatarViewImage} 
              alt="Avatar" 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

// Componente Chat Lateral con Información Resumida
export const OldConversationSheet = ({
  open,
  onOpenChange,
  lead,
  conversation,
  onSaveContact,
  disabledBotLeads,
  toggleBotStatus,
  onCall,
  onOpenQualification
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null | undefined;
  conversation: Conversation | null | undefined;
  onSaveContact: (leadId: string) => void;
  disabledBotLeads?: Set<string>;
  toggleBotStatus?: (leadId: string) => void;
  onCall: (phone: string, leadId?: string) => void;
  onOpenQualification?: (leadId: string) => void;
}) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isContactSaved, setIsContactSaved] = useState(false);
  const [savedContactData, setSavedContactData] = useState<any>(null);
  const [contactDetailsOpen, setContactDetailsOpen] = useState(false);
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [avatarViewImage, setAvatarViewImage] = useState<string>('');
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verificar si el contacto está guardado
  useEffect(() => {
    if (lead) {
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      const saved = savedContacts.find((c: any) => c.phone === lead.phone);
      console.log('📞 Verificando contacto:', {
        phone: lead.phone,
        savedContacts: savedContacts,
        saved: saved,
        isContactSaved: !!saved
      });
      setIsContactSaved(!!saved);
      setSavedContactData(saved || null);
    }
  }, [lead, open]);

  // Listener para detectar cambios en localStorage (cuando se guarda un contacto)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedContacts' && lead) {
        const savedContacts = JSON.parse(e.newValue || '[]');
        const saved = savedContacts.find((c: any) => c.phone === lead.phone);
        setIsContactSaved(!!saved);
        setSavedContactData(saved || null);
      }
    };

    // También escuchar eventos personalizados para cambios en la misma ventana
    const handleCustomStorageChange = () => {
      if (lead) {
        // Usar setTimeout para evitar actualizaciones de estado durante el render
        setTimeout(() => {
          const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
          const saved = savedContacts.find((c: any) => c.phone === lead.phone);
          setIsContactSaved(!!saved);
          setSavedContactData(saved || null);
        }, 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactsUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactsUpdated', handleCustomStorageChange);
    };
  }, [lead]);

  // Inicializar datos del formulario desde el lead
  useEffect(() => {
    if (lead) {
      setFormData({
        nombre: lead.name !== lead.phone ? lead.name : '',
        telefono: lead.phone || '',
        presupuesto: lead.budget || '',
        zona: lead.zone || '',
        'tipo-propiedad': lead.propertyType || '',
      });
    }
  }, [lead]);

  if (!lead) return null;

  const handleOpenWhatsApp = () => {
    const phone = lead.phone.replace(/[^0-9+]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Función para obtener campos según el rol
  const getFormFields = () => {
    if (lead.intention === 'comprar') {
      return [
        { id: 'nombre', label: 'Nombre', emoji: '👤' },
        { id: 'telefono', label: 'Teléfono', emoji: '📱' },
        { id: 'presupuesto', label: 'Presupuesto', emoji: '💰' },
        { id: 'zona', label: 'Zona', emoji: '📍' },
        { id: 'tipo-propiedad', label: 'Tipo propiedad', emoji: '🏠' },
      ];
    } else if (lead.intention === 'vender') {
      return [
        { id: 'nombre', label: 'Nombre', emoji: '👤' },
        { id: 'telefono', label: 'Teléfono', emoji: '📱' },
        { id: 'direccion-propiedad', label: 'Dirección', emoji: '📍' },
        { id: 'tipo-propiedad', label: 'Tipo propiedad', emoji: '🏠' },
        { id: 'precio-esperado', label: 'Precio esperado', emoji: '💵' },
      ];
    } else {
      return [
        { id: 'nombre', label: 'Nombre', emoji: '👤' },
        { id: 'telefono', label: 'Teléfono', emoji: '📱' },
        { id: 'consulta', label: 'Consulta', emoji: '💬' },
      ];
    }
  };

  const formFields = getFormFields();
  const completedFields = formFields.filter(field => formData[field.id]?.trim()).length;
  const totalFields = formFields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const getRoleTitle = () => {
    if (lead.intention === 'comprar') return 'Comprador';
    if (lead.intention === 'vender') return 'Vendedor';
    return 'Consulta General';
  };

  const getRoleIcon = () => {
    if (lead.intention === 'comprar') return <Home className="h-5 w-5 text-green-600" />;
    if (lead.intention === 'vender') return <DollarSign className="h-5 w-5 text-blue-600" />;
    return <HelpCircle className="h-5 w-5 text-gray-600" />;
  };

  const getChannelIcon = () => {
    if (lead.source === 'whatsapp') {
      return <WhatsAppIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'instagram') {
      return <Instagram className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'messenger') {
      return <MessengerIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'tiktok') {
      return <TikTokIcon className="h-4 w-4 text-gray-500" />;
    } else if (lead.source === 'phone') {
      return <Phone className="h-4 w-4 text-gray-500" />;
    } else {
      return <TikTokIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEditContact = () => {
    // Llamar a onSaveContact que abrirá el diálogo de edición con los datos del contacto
    onSaveContact(lead.id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] p-0">
        <div className="flex flex-col h-full">
          {/* Header - Fijo arriba */}
          <SheetHeader className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <SheetDescription className="sr-only">
              Conversación con {lead.name}
            </SheetDescription>
            {isMobile ? (
              <div className="space-y-2">
                {/* Primera fila: Flecha, Nombre y Opciones */}
                <div className="flex items-center gap-1.5 -ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-8 px-1 flex-shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div 
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const avatarSrc = savedContactData?.avatar || lead.avatar;
                        if (avatarSrc) {
                          setAvatarViewImage(avatarSrc);
                          setAvatarViewOpen(true);
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={savedContactData?.avatar || lead.avatar} alt={savedContactData?.name || lead.phone} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                          {(() => {
                            if (isContactSaved === true && savedContactData?.name) {
                              return savedContactData.name.charAt(0).toUpperCase();
                            }
                            const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                            return platformName ? platformName.charAt(0).toUpperCase() : lead.phone.charAt(0);
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Badge flotante del canal */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200 pointer-events-none">
                        {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3.5 w-3.5" /> : 
                         lead.source === 'instagram' ? <Instagram className="h-3.5 w-3.5" /> :
                         lead.source === 'messenger' ? <MessengerIcon className="h-3.5 w-3.5" /> :
                         lead.source === 'tiktok' ? <TikTokIcon className="h-3.5 w-3.5" /> :
                         <Phone className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <SheetTitle className="leading-tight break-words font-normal flex-1 min-w-0">
                          {(() => {
                            if (isContactSaved === true && savedContactData?.name) {
                              // Si está guardado: mostrar nombre guardado
                              return (
                                <div className="space-y-0.5">
                                  <div className="text-base text-black font-semibold">{savedContactData.name}</div>
                                </div>
                              );
                            } else {
                              // Si no está guardado: teléfono en línea 1, nombre del canal en línea 2
                              const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                              return (
                                <div className="space-y-0.5">
                                  <div className="text-base text-black font-semibold">{lead.phone}</div>
                                  {platformName && (
                                    <div className="text-sm text-gray-500">{platformName}</div>
                                  )}
                                </div>
                              );
                            }
                          })()}
                        </SheetTitle>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 flex-shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!isContactSaved ? (
                          <DropdownMenuItem onClick={() => onSaveContact(lead.id)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Guardar contacto
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onSaveContact(lead.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar contacto
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Mandar al CRM
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          if (lead && onOpenQualification) {
                            onOpenQualification(lead.id);
                            onOpenChange(false);
                          }
                        }}>
                          <Star className="h-4 w-4 mr-2" />
                          Ver Cualificación
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setContactDetailsOpen(true)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Histórico
                        </DropdownMenuItem>
                        {toggleBotStatus && disabledBotLeads && (
                          <DropdownMenuItem onClick={() => toggleBotStatus(lead.id)}>
                            <BotOff className="h-4 w-4 mr-2" />
                            {disabledBotLeads.has(lead.id) ? 'Activar bot para este contacto' : 'Desactivar bot para este contacto'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Primera fila: Flecha, Nombre y Opciones */}
                <div className="flex items-center gap-1.5 -ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-8 px-1 flex-shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div 
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const avatarSrc = savedContactData?.avatar || lead.avatar;
                        if (avatarSrc) {
                          setAvatarViewImage(avatarSrc);
                          setAvatarViewOpen(true);
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={savedContactData?.avatar || lead.avatar} alt={savedContactData?.name || lead.phone} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                          {(() => {
                            if (isContactSaved === true && savedContactData?.name) {
                              return savedContactData.name.charAt(0).toUpperCase();
                            }
                            const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                            return platformName ? platformName.charAt(0).toUpperCase() : lead.phone.charAt(0);
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Badge flotante del canal */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200 pointer-events-none">
                        {lead.source === 'whatsapp' ? <WhatsAppIcon className="h-3.5 w-3.5" /> : 
                         lead.source === 'instagram' ? <Instagram className="h-3.5 w-3.5" /> :
                         lead.source === 'messenger' ? <MessengerIcon className="h-3.5 w-3.5" /> :
                         lead.source === 'tiktok' ? <TikTokIcon className="h-3.5 w-3.5" /> :
                         <Phone className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <SheetTitle className="leading-tight break-words font-normal flex-1 min-w-0">
                          {(() => {
                            if (isContactSaved === true && savedContactData?.name) {
                              // Si está guardado: mostrar nombre guardado
                              return (
                                <div className="space-y-0.5">
                                  <div className="text-base text-black font-semibold">{savedContactData.name}</div>
                                </div>
                              );
                            } else {
                              // Si no está guardado: teléfono en línea 1, nombre del canal en línea 2
                              const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;
                              return (
                                <div className="space-y-0.5">
                                  <div className="text-base text-black font-semibold">{lead.phone}</div>
                                  {platformName && (
                                    <div className="text-sm text-gray-500">{platformName}</div>
                                  )}
                                </div>
                              );
                            }
                          })()}
                        </SheetTitle>
                        {disabledBotLeads && disabledBotLeads.has(lead.id) && (
                          <BotOff className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 flex-shrink-0"
                        type="button"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {!isContactSaved ? (
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          onSaveContact(lead.id);
                        }}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Guardar contacto
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          onSaveContact(lead.id);
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar contacto
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                        <Send className="h-4 w-4 mr-2" />
                        Mandar al CRM
                      </DropdownMenuItem>
                      {onOpenQualification && (
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          if (lead && onOpenQualification) {
                            onOpenQualification(lead.id);
                          }
                        }}>
                          <Star className="h-4 w-4 mr-2" />
                          Ver cualificación
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => {
                        e.preventDefault();
                        setContactDetailsOpen(true);
                      }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Histórico
                      </DropdownMenuItem>
                      {toggleBotStatus && disabledBotLeads && (
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          toggleBotStatus(lead.id);
                        }}>
                          <BotOff className="h-4 w-4 mr-2" />
                          {disabledBotLeads.has(lead.id) ? 'Activar bot para este contacto' : 'Desactivar bot para este contacto'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </SheetHeader>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full">
              <div className="px-6 pt-6 pb-28 space-y-4">


                {/* Conversación Literal */}
                <div>
                  <div className="space-y-3">
                    {conversation && conversation.messages.length > 0 ? (
                      conversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 ${
                              message.senderId === 'user'
                                ? 'bg-blue-50 text-gray-900'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === 'user' ? 'text-gray-600' : 'text-gray-500'
                              }`}
                            >
                              {formatMessageTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No hay mensajes</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Inicia la conversación en WhatsApp
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Footer - Fijo abajo */}
          <div className="border-t border-gray-200 px-6 py-3 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Button
                onClick={() => onCall(lead.phone, lead.id)}
                size="sm"
                variant="outline"
                className="flex-1 h-9 gap-2"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
              <Button
                onClick={() => {
                  if (lead.source === 'whatsapp') {
                    handleOpenWhatsApp();
                  } else if (lead.source === 'instagram') {
                    window.open('https://www.instagram.com/direct/inbox/', '_blank');
                  } else if (lead.source === 'messenger') {
                    window.open('https://www.messenger.com/', '_blank');
                  } else if (lead.source === 'tiktok') {
                    window.open('https://www.tiktok.com/messages', '_blank');
                  } else if (lead.source === 'phone') {
                    handleCall();
                  }
                }}
                size="sm"
                className={`flex-1 h-9 gap-2 text-white ${
                  lead.source === 'whatsapp' 
                    ? 'bg-[#25D366] hover:bg-[#20BA5A]' 
                    : lead.source === 'instagram'
                    ? 'bg-[#E4405F] hover:bg-[#D32F4F]'
                    : lead.source === 'messenger'
                    ? 'bg-[#0084FF] hover:bg-[#0073E6]'
                    : lead.source === 'tiktok'
                    ? 'bg-[#000000] hover:bg-[#2D2D2D]'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {lead.source === 'whatsapp' ? (
                  <WhatsAppIcon className="h-4 w-4" />
                ) : lead.source === 'instagram' ? (
                  <Instagram className="h-4 w-4" />
                ) : lead.source === 'messenger' ? (
                  <MessengerIcon className="h-4 w-4" />
                ) : lead.source === 'tiktok' ? (
                  <TikTokIcon className="h-4 w-4" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
                Abrir {lead.source === 'whatsapp' ? 'WhatsApp' : lead.source === 'instagram' ? 'Instagram' : lead.source === 'messenger' ? 'Messenger' : lead.source === 'tiktok' ? 'TikTok' : 'Teléfono'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>

      {/* ContactDetailsSheet - Muestra detalles completos si está guardado o sin campos del contacto si no lo está */}
      <ContactDetailsSheet
        open={contactDetailsOpen}
        onOpenChange={setContactDetailsOpen}
        contact={
          lead
            ? {
                id: lead.id,
                name: isContactSaved && savedContactData?.name ? savedContactData.name : lead.phone,
                phone: lead.phone,
                email: isContactSaved && savedContactData?.email ? savedContactData.email : undefined,
                avatarUrl: undefined,
                channels: conversation
                  ? [
                      {
                        id: conversation.id,
                        type: lead.source,
                        lastContact: lead.lastContact,
                        messagesCount: conversation.messages.length,
                        conversationId: conversation.id,
                        socialHandle:
                          lead.source === 'whatsapp'
                            ? lead.whatsappName
                            : lead.source === 'instagram'
                            ? lead.instagramUsername
                            : lead.source === 'messenger'
                            ? lead.messengerName
                            : lead.source === 'tiktok'
                            ? lead.tiktokUsername
                            : undefined,
                        conversationData: {
                          intention: lead.intention,
                          budget: lead.budget,
                          zone: lead.zone,
                          propertyType: lead.propertyType,
                          summary:
                            conversation.messages.length > 0
                              ? conversation.messages.find((m) => m.senderId === 'lead')?.text ||
                                conversation.messages[0].text
                              : 'Sin mensajes',
                        },
                      },
                    ]
                  : [],
                tags: isContactSaved && savedContactData?.tags ? savedContactData.tags : [],
              }
            : null
        }
        hideContactInfo={!isContactSaved}
        isMobile={isMobile}
        onConversationClick={(channel) => {
          // Cerrar el sheet de detalles del contacto ya que la conversación ya está abierta
          setContactDetailsOpen(false);
        }}
      />
      
      {/* Dialog para ver avatar en grande */}
      <Dialog open={avatarViewOpen} onOpenChange={setAvatarViewOpen}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Vista de avatar</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setAvatarViewOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img 
              src={avatarViewImage} 
              alt="Avatar" 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

// Interfaz para propiedades
interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  pricePerM2?: number; // Precio por metro cuadrado (calculado)
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // m²
  type: string;
  images: string[];
  features: string[];
}

// Datos mock de propiedades
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento moderno en el centro',
    description: 'Espectacular apartamento moderno ubicado en pleno centro de la ciudad. Completamente reformado con materiales de alta calidad y un diseño contemporáneo. Cuenta con amplias ventanas que proporcionan mucha luz natural, suelos de parquet, cocina americana totalmente equipada con electrodomésticos de última generación. Aire acondicionado y calefacción central. Edificio con ascensor y portal accesible. Ideal para profesionales o parejas jóvenes que buscan comodidad y estilo en el corazón de la ciudad.',
    price: '245000',
    location: 'Centro',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    type: 'Piso',
    images: [
      'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI0OTcyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVufGVufDF8fHx8MTc2MjQ3MDUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tfGVufDF8fHx8MTc2MjQ2MDMxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    features: [
      'Cocina americana equipada',
      'Aire acondicionado',
      'Calefacción central',
      'Suelos de parquet',
      'Ascensor',
      'Portal accesible',
      'Totalmente reformado',
      'Mucha luz natural',
    ]
  },
  {
    id: '2',
    title: 'Casa de lujo con jardín',
    description: 'Impresionante casa unifamiliar de lujo en la zona norte de la ciudad. Diseño arquitectónico exclusivo con acabados premium en cada detalle. La vivienda se distribuye en dos plantas conectadas por una elegante escalera de diseño. Amplio salón-comedor con grandes ventanales que dan acceso al jardín, cocina de alta gama completamente equipada, 4 dormitorios espaciosos y 3 baños completos con sanitarios de primera calidad. El jardín de 500m² incluye zona de piscina, pérgola y área de barbacoa. Garaje para 2 vehículos. Sistema domótico integrado.',
    price: '520000',
    location: 'Zona Norte',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    type: 'Casa unifamiliar',
    images: [
      'https://images.unsplash.com/photo-1711098256574-7b497260cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGdhcmRlbnxlbnwxfHx8fDE3NjI0NTgzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MjQ3MjE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1638799869566-b17fa794c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3NjI1MTA0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    features: [
      'Jardín de 500m²',
      'Piscina privada',
      'Sistema domótico',
      'Garaje para 2 vehículos',
      'Cocina de alta gama',
      'Zona de barbacoa',
      'Acabados premium',
      'Pérgola en jardín',
    ]
  },
  {
    id: '7',
    title: 'Villa mediterránea con piscina',
    description: 'Exclusiva villa mediterránea situada en la prestigiosa Urbanización Las Colinas. Arquitectura mediterránea de lujo con espacios diseñados para el confort y el estilo de vida mediterráneo. La villa cuenta con amplios espacios interiores inundados de luz natural, techos altos y grandes ventanales con vistas panorámicas. Cocina gourmet con isla central, suite principal con vestidor y baño en suite, 4 dormitorios adicionales y 3 baños. En el exterior, una espectacular piscina infinity de 12x6m, zona chill-out cubierta, jardín mediterráneo de bajo mantenimiento y garaje para 3 vehículos. Seguridad 24h.',
    price: '850000',
    location: 'Urbanización Las Colinas',
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    type: 'Villa',
    images: [
      'https://images.unsplash.com/photo-1757439402101-55d1da381e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwdmlsbGElMjBwb29sfGVufDF8fHx8MTc2MjQ3MzQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MjQ3MjE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVufGVufDF8fHx8MTc2MjQ3MDUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    features: [
      'Piscina infinity 12x6m',
      'Vistas panorámicas',
      'Suite principal con vestidor',
      'Cocina gourmet con isla',
      'Garaje para 3 vehículos',
      'Zona chill-out cubierta',
      'Seguridad 24h',
      'Jardín mediterráneo',
    ]
  },
  {
    id: '10',
    title: 'Chalé rústico en las afueras',
    description: 'Magnífica casa rústica en Piloña - Villarcazu, con vistas panorámicas a la montaña. La propiedad cuenta con construcción tradicional asturiana, tejado de teja árabe y acabados en piedra natural. Incluye amplio jardín de 2000m² con árboles frutales, huerto y zona de barbacoa. Interior completamente reformado manteniendo el encanto rústico con vigas de madera vista. Ubicación tranquila ideal para disfrutar de la naturaleza.',
    price: '280000',
    location: 'Piloña - Villarcazu',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: 'Casa rústica',
    images: [
      'https://images.unsplash.com/photo-1646775815157-8645b5af4e08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBydXN0aWMlMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjUwNjU4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjI0OTI3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVufGVufDF8fHx8MTc2MjQ3MDUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    features: [
      'Jardín de 2000m²',
      'Vistas a la montaña',
      'Vigas de madera vista',
      'Chimenea de leña',
      'Zona de barbacoa',
      'Huerto',
      'Garaje cubierto',
      'Pozo de agua',
    ]
  },
  {
    id: '11',
    title: 'Apartamento en primera línea de playa',
    description: 'Extraordinario apartamento de lujo en primera línea de playa con vistas espectaculares al mar. Ubicado en un exclusivo complejo residencial con acceso directo a la playa. El apartamento ofrece un diseño moderno y elegante con grandes ventanales desde el salón y el dormitorio principal que enmarcan vistas panorámicas al océano. Amplia terraza de 30m² perfecta para disfrutar de las puestas de sol. Cocina integrada de diseño completamente equipada, 3 dormitorios con armarios empotrados y 2 baños completos. El complejo incluye piscina comunitaria, jardines tropicales, seguridad 24h y parking privado.',
    price: '425000',
    location: 'Primera línea de playa',
    bedrooms: 3,
    bathrooms: 2,
    area: 125,
    type: 'Departamento',
    images: [
      'https://images.unsplash.com/photo-1759082105425-3a426d3d7275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGFwYXJ0bWVudCUyMHZpZXd8ZW58MXx8fHwxNzYyNTE4NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI0OTcyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tfGVufDF8fHx8MTc2MjQ2MDMxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    features: [
      'Vistas panorámicas al mar',
      'Terraza de 30m²',
      'Acceso directo a la playa',
      'Piscina comunitaria',
      'Jardines tropicales',
      'Seguridad 24h',
      'Parking privado',
      'Cocina de diseño equipada',
    ]
  },
];

interface LeadsPageProps {
  onNavigateToConfig?: () => void;
}

export function LeadsPage({ onNavigateToConfig }: LeadsPageProps = {}) {
  // Detectar si es un usuario nuevo (viene del onboarding) - usar función inicializadora
  const [isNewUser] = useState(() => !localStorage.getItem('hasReceivedFirstConversation'));
  
  const [leads, setLeads] = useState(() => isNewUser ? [] : mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [intentionFilter, setIntentionFilter] = useState<'all' | 'comprador' | 'vendedor' | 'arrendador' | 'inquilino' | 'otros'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'instagram' | 'messenger' | 'tiktok'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const [contactLeads, setContactLeads] = useState<Lead[]>([]);
  const [contactNames, setContactNames] = useState<Record<string, string>>({});
  const [columnConfigOpen, setColumnConfigOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatLeadId, setSelectedChatLeadId] = useState<string | null>(null);
  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [selectedQualificationLeadId, setSelectedQualificationLeadId] = useState<string | null>(null);
  
  // Inicializar unreadLeads desde el sistema centralizado
  const [unreadLeads, setUnreadLeads] = useState<Set<string>>(() => {
    if (isNewUser) {
      return new Set();
    }
    // Cargar desde localStorage
    const storedUnread = getUnreadConversations();
    // Si no hay datos guardados, devolver los IDs iniciales sin llamar a initialize
    if (storedUnread.size === 0) {
      const initialIds = ['0', '1', '2', '3', '4', '5'];
      return new Set(initialIds);
    }
    return storedUnread;
  });
  
  // Inicializar en useEffect para evitar dispatches durante el render
  useEffect(() => {
    if (!isNewUser) {
      const storedUnread = getUnreadConversations();
      if (storedUnread.size === 0) {
        const initialIds = ['0', '1', '2', '3', '4', '5'];
        initializeUnreadConversations(initialIds);
      }
    }
  }, [isNewUser]);
  
  const [disabledBotLeads, setDisabledBotLeads] = useState<Set<string>>(new Set());
  const [saveBeforeCallDialogOpen, setSaveBeforeCallDialogOpen] = useState(false);
  const [leadToCall, setLeadToCall] = useState<Lead | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [saveContactMode, setSaveContactMode] = useState<'saveAndCall' | 'saveOnly'>('saveAndCall');
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  // Estados para etiquetas de información
  const [defaultTags, setDefaultTags] = useState<string[]>([]);
  
  // Inicializar customTags desde localStorage si existe
  const [customTags, setCustomTags] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customContactTags');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing custom tags', e);
          return [];
        }
      }
    }
    return [];
  });

  // Persistir customTags cuando cambien
  useEffect(() => {
    if (customTags.length > 0) {
      localStorage.setItem('customContactTags', JSON.stringify(customTags));
    }
  }, [customTags]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNewTagDialog, setShowNewTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [avatarViewImage, setAvatarViewImage] = useState<string>('');
  const [propertySheetOpen, setPropertySheetOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedPropertyLead, setSelectedPropertyLead] = useState<Lead | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null); // Estado para el lead enfocado
  const [propertyDetailOpen, setPropertyDetailOpen] = useState(false); // Estado para abrir PropertyDetail
  const [isEditingPhotos, setIsEditingPhotos] = useState(false); // Estado para modo edición de fotos
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para el input de archivos
  const ITEMS_PER_PAGE = 20;
  
  // Detectar móvil - usar función inicializadora
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actualizar defaultTags cuando cambie el lead seleccionado
  useEffect(() => {
    if (leadToCall && leadToCall.qualificationQuestions) {
      // Extraer solo las respuestas que tengan valor (no vacías)
      const answersWithValue = leadToCall.qualificationQuestions
        .filter(q => q.answer && q.answer.trim() !== '')
        .map(q => q.answer);
      
      setDefaultTags(answersWithValue);
    } else {
      setDefaultTags([]);
    }
  }, [leadToCall]);

  // Resetear contactos guardados para que aparezcan como conversaciones nuevas
  useEffect(() => {
    // Solo resetear si no se ha hecho antes en esta sesión
    const hasReset = sessionStorage.getItem('contactsResetDone');
    
    if (!hasReset) {
      // Resetear TODOS los contactos guardados en localStorage y sessionStorage
      // Esto elimina cualquier nombre personalizado que se haya guardado previamente
      localStorage.removeItem('savedContacts');
      sessionStorage.removeItem('savedContacts');
      
      // Forzar que esté vacío
      localStorage.setItem('savedContacts', JSON.stringify([]));
      
      // Marcar que ya se hizo el reset en esta sesión
      sessionStorage.setItem('contactsResetDone', 'true');
      
      console.log('🧹 localStorage limpiado - savedContacts reseteado a array vacío');
    }
  }, []);

  // Sincronizar nombres de contactos guardados con leads
  useEffect(() => {
    const syncContactNames = () => {
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      
      if (savedContacts.length > 0) {
        setLeads(prevLeads => 
          prevLeads.map(lead => {
            // Buscar si existe un contacto guardado con el mismo teléfono
            const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
            
            if (savedContact && savedContact.name) {
              // Actualizar el nombre del lead con el nombre del contacto guardado
              return { ...lead, name: savedContact.name };
            }
            
            return lead;
          })
        );
      }
    };
    
    // Sincronizar al montar el componente
    syncContactNames();
    
    // Escuchar cambios en contactos guardados
    const handleContactsUpdated = () => {
      syncContactNames();
    };
    
    window.addEventListener('contactsUpdated', handleContactsUpdated);
    
    return () => {
      window.removeEventListener('contactsUpdated', handleContactsUpdated);
    };
  }, []);

  const toggleBotStatus = (leadId: string) => {
    setDisabledBotLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (leadId: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, isFavorite: !lead.isFavorite }
          : lead
      )
    );
  };

  // Simular detección de nombres en conversaciones
  // En producción, esto analizaría los mensajes reales de la conversación
  const getDetectedNamesForLead = (leadId: string): string[] => {
    // Mapeo de nombres simulados para cada lead
    const detectedNamesMap: Record<string, string[]> = {
      '0': ['Jaime', 'Jaime García'],
      '1': ['María', 'María González'],
      '2': ['Carlos', 'Carlos Martínez'],
      '3': ['Alejandro', 'Alejandro Campos'],
      '4': ['Carmen', 'Carmen Velasco'],
      '5': ['Fernando', 'Fernando López'],
      '6': ['Roberto', 'Roberto Silva'],
      '7': ['Isabella', 'Isabella Román'],
      '8': ['Diego', 'Diego Torres'],
      '9': ['Patricia', 'Patricia Méndez'],
      '10': ['Luis', 'Luis Fernández'],
      '11': ['Ana', 'Ana Rodríguez'],
      '12': ['Miguel', 'Miguel Sánchez'],
      '13': ['Laura', 'Laura Pérez'],
      '14': ['David', 'David Morales'],
      '15': ['Elena', 'Elena Castro'],
    };
    
    // Devolver nombres detectados o array vacío si no hay
    return detectedNamesMap[leadId] || [];
  };

  // Función para manejar llamadas
  // Verificar si el nombre del contacto es solo un número de teléfono
  const isPhoneNumber = (name: string): boolean => {
    // Eliminar espacios y caracteres especiales comunes en números de teléfono
    const cleanName = name.replace(/[\s\-\(\)\+]/g, '');
    // Verificar si contiene solo dígitos (permite + al inicio)
    return /^[\+]?\d+$/.test(cleanName);
  };

  const handleCall = (phone: string, leadId?: string) => {
    // Si se proporciona un leadId, buscar el lead
    if (leadId) {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        // Verificar si el contacto ya está guardado en localStorage
        const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
        const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
        
        // Si NO está guardado, mostrar diálogo para guardar contacto antes de llamar
        if (!isContactSaved) {
          setLeadToCall(lead);
          
          // Priorizar el nombre de la plataforma sobre lead.name
          const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername || lead.name;
          // Solo usar platformName si es diferente de lead.name (evitando duplicar si son iguales)
          const nameToUse = platformName !== lead.name ? platformName : lead.name;
          
          setContactName(nameToUse);
          setContactEmail(lead.email || '');
          setContactNotes('');
          setSelectedTags([]);
          setSaveContactMode('saveAndCall');
          setSaveBeforeCallDialogOpen(true);
          return;
        }
      }
    }
    
    // Si está guardado o no hay leadId, llamar directamente
    window.open(`tel:${phone}`, '_self');
  };

  // Función para abrir el diálogo de guardar contacto (sin llamar)
  const handleOpenSaveContact = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      // Verificar si el contacto ya está guardado
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      const existingContact = savedContacts.find((c: any) => c.phone === lead.phone);
      
      setLeadToCall(lead);
      
      // Si el contacto ya existe, pre-rellenar con todos sus datos guardados
      if (existingContact) {
        setContactName(existingContact.name || lead.name);
        setContactEmail(existingContact.email || lead.email || '');
        setContactNotes(existingContact.notes || '');
        setIsEditingContact(true);
      } else {
        // Si no existe, pre-rellenar con el nombre de la plataforma si existe, sino con lead.name
        const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername || lead.name;
        // Solo usar platformName si es diferente de lead.name (evitando duplicar si son iguales)
        const nameToUse = platformName !== lead.name ? platformName : lead.name;
        
        setContactName(nameToUse);
        setContactEmail(lead.email || '');
        setContactNotes('');
        setSelectedTags([]);
        setIsEditingContact(false);
      }
      
      setSaveContactMode('saveOnly');
      setSaveBeforeCallDialogOpen(true);
    }
  };

  // Guardar contacto y llamar
  const handleSaveAndCall = () => {
    if (leadToCall && contactName.trim()) {
      // Actualizar el nombre del lead
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadToCall.id 
            ? { ...lead, name: contactName.trim() }
            : lead
        )
      );
      
      // Guardar el contacto en localStorage para que aparezca en la página de Contactos
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      
      // Crear el nuevo contacto con la estructura esperada por ContactsPage
      // Solo guardar el nombre que el usuario escribió, sin agregar propiedades automáticamente
      const newContact = {
        id: `saved-${Date.now()}`,
        name: contactName.trim(),
        phone: leadToCall.phone,
        email: contactEmail.trim() || leadToCall.email,
        zone: 'Sin especificar',
        budget: undefined,
        propertyType: 'Sin especificar',
        addedDate: new Date().toISOString().split('T')[0],
        notes: contactNotes.trim(),
        channels: [
          {
            id: `ch-${Date.now()}`,
            type: 'whatsapp',
            lastContact: new Date().toISOString().split('T')[0],
            messagesCount: leadToCall.interactions || 0,
            conversationId: `conv-${leadToCall.id}`
          }
        ],
        tags: selectedTags,
        userType: leadToCall.intention === 'vender' ? 'seller' : 'buyer'
      };
      
      // Verificar que el contacto no exista ya (por teléfono)
      const existingContactIndex = savedContacts.findIndex((c: any) => c.phone === leadToCall.phone);
      
      if (existingContactIndex >= 0) {
        // Actualizar contacto existente - solo guardar lo que el usuario escribió
        savedContacts[existingContactIndex] = {
          ...savedContacts[existingContactIndex],
          name: contactName.trim(),
          email: contactEmail.trim() || savedContacts[existingContactIndex].email,
          notes: contactNotes.trim(),
          tags: selectedTags,
        };
      } else {
        // Añadir nuevo contacto
        savedContacts.push(newContact);
      }
      
      localStorage.setItem('savedContacts', JSON.stringify(savedContacts));
      
      // Guardar también la conversación
      const conversation = mockConversations.find(c => c.leadId === leadToCall.id);
      if (conversation) {
        const savedConversations = JSON.parse(localStorage.getItem('savedConversations') || '[]');
        const conversationToSave = {
          id: `conv-${leadToCall.id}`,
          leadId: leadToCall.id,
          type: 'whatsapp',
          messages: conversation.messages
        };
        
        // Verificar si ya existe la conversación
        const existingConvIndex = savedConversations.findIndex((c: any) => c.leadId === leadToCall.id);
        if (existingConvIndex >= 0) {
          savedConversations[existingConvIndex] = conversationToSave;
        } else {
          savedConversations.push(conversationToSave);
        }
        
        localStorage.setItem('savedConversations', JSON.stringify(savedConversations));
      }
      
      // Disparar evento personalizado para notificar a otras partes de la aplicación
      window.dispatchEvent(new Event('contactsUpdated'));
      
      // Realizar la llamada
      window.open(`tel:${leadToCall.phone}`, '_self');
      setSaveBeforeCallDialogOpen(false);
      setLeadToCall(null);
      setContactName('');
      setContactEmail('');
      setContactNotes('');
      setSelectedTags([]);
    }
  };

  // Guardar contacto solamente (sin llamar)
  const handleSaveContactOnly = () => {
    if (leadToCall && contactName.trim()) {
      // Actualizar el nombre del lead
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadToCall.id 
            ? { ...lead, name: contactName.trim() }
            : lead
        )
      );
      
      // Guardar el contacto en localStorage para que aparezca en la página de Contactos
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      
      // Crear el nuevo contacto con la estructura esperada por ContactsPage
      // Solo guardar el nombre que el usuario escribió, sin agregar propiedades automáticamente
      const newContact = {
        id: `saved-${Date.now()}`,
        name: contactName.trim(),
        phone: leadToCall.phone,
        email: contactEmail.trim() || leadToCall.email,
        zone: 'Sin especificar',
        budget: undefined,
        propertyType: 'Sin especificar',
        addedDate: new Date().toISOString().split('T')[0],
        notes: contactNotes.trim(),
        channels: [
          {
            id: `ch-${Date.now()}`,
            type: 'whatsapp',
            lastContact: new Date().toISOString().split('T')[0],
            messagesCount: leadToCall.interactions || 0,
            conversationId: `conv-${leadToCall.id}`
          }
        ],
        tags: selectedTags,
        userType: leadToCall.intention === 'vender' ? 'seller' : 'buyer'
      };
      
      // Verificar que el contacto no exista ya (por teléfono)
      const existingContactIndex = savedContacts.findIndex((c: any) => c.phone === leadToCall.phone);
      
      if (existingContactIndex >= 0) {
        // Actualizar contacto existente - solo guardar lo que el usuario escribió
        savedContacts[existingContactIndex] = {
          ...savedContacts[existingContactIndex],
          name: contactName.trim(),
          email: contactEmail.trim() || savedContacts[existingContactIndex].email,
          notes: contactNotes.trim(),
          tags: selectedTags,
        };
      } else {
        // Añadir nuevo contacto
        savedContacts.push(newContact);
      }
      
      localStorage.setItem('savedContacts', JSON.stringify(savedContacts));
      
      // Guardar también la conversación
      const conversation = mockConversations.find(c => c.leadId === leadToCall.id);
      if (conversation) {
        const savedConversations = JSON.parse(localStorage.getItem('savedConversations') || '[]');
        const conversationToSave = {
          id: `conv-${leadToCall.id}`,
          leadId: leadToCall.id,
          type: 'whatsapp',
          messages: conversation.messages
        };
        
        // Verificar si ya existe la conversación
        const existingConvIndex = savedConversations.findIndex((c: any) => c.leadId === leadToCall.id);
        if (existingConvIndex >= 0) {
          savedConversations[existingConvIndex] = conversationToSave;
        } else {
          savedConversations.push(conversationToSave);
        }
        
        localStorage.setItem('savedConversations', JSON.stringify(savedConversations));
      }
      
      // Disparar evento personalizado para notificar a otras partes de la aplicación
      window.dispatchEvent(new Event('contactsUpdated'));
      
      setSaveBeforeCallDialogOpen(false);
      setLeadToCall(null);
      setContactName('');
      setContactEmail('');
      setContactNotes('');
      setSelectedTags([]);
    }
  };

  // Llamar sin guardar
  const handleCallWithoutSaving = () => {
    if (leadToCall) {
      window.open(`tel:${leadToCall.phone}`, '_self');
      setSaveBeforeCallDialogOpen(false);
      setLeadToCall(null);
      setContactName('');
      setContactEmail('');
      setContactNotes('');
      setSelectedTags([]);
    }
  };

  // Configuración de columnas
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>([
    { id: 'contact', label: 'Conversaciones', visible: true, width: 'w-[200px]', required: true },
    { id: 'date', label: 'Fecha', visible: true, width: 'w-[100px]' },
    { id: 'role', label: 'Rol', visible: true, width: 'w-[120px]' },
    { id: 'qualification', label: 'Cualificación', visible: true, width: 'w-[150px]' },
    { id: 'matchedProperty', label: 'Propiedad Match', visible: true, width: 'w-[180px]' },
    { id: 'email', label: 'Email', visible: false, width: 'w-[180px]' },
    { id: 'zone', label: 'Zona', visible: false, width: 'w-[120px]' },
    { id: 'budget', label: 'Presupuesto', visible: false, width: 'w-[150px]' },
    { id: 'interactions', label: 'Interacciones', visible: false, width: 'w-[120px]' },
    { id: 'actions', label: 'Acciones', visible: true, width: 'w-[200px]', required: true },
  ]);

  // Función para mover leads entre columnas
  const handleLeadMove = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus }
          : lead
      )
    );
  };

  // Acciones masivas
  const handleBulkStatusChange = (newStatus: Lead['status']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        selectedLeadIds.includes(lead.id) 
          ? { ...lead, status: newStatus }
          : lead
      )
    );
    setSelectedLeadIds([]);
  };

  const handleBulkPriorityChange = (newPriority: Lead['priority']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        selectedLeadIds.includes(lead.id) 
          ? { ...lead, priority: newPriority }
          : lead
      )
    );
    setSelectedLeadIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`¿Estás seguro de eliminar ${selectedLeadIds.length} contacto(s)?`)) {
      setLeads(prevLeads => prevLeads.filter(lead => !selectedLeadIds.includes(lead.id)));
      setSelectedLeadIds([]);
    }
  };

  const handleBulkExport = () => {
    const selectedLeads = leads.filter(lead => selectedLeadIds.includes(lead.id));
    const csvContent = [
      ['Nombre', 'Teléfono', 'Email', 'Intención', 'Estado', 'Prioridad', 'Zona', 'Presupuesto', 'Último Contacto'],
      ...selectedLeads.map(lead => [
        lead.name,
        lead.phone,
        lead.email || '',
        lead.intention,
        lead.status,
        lead.priority,
        lead.zone,
        lead.budget || '',
        lead.lastContact
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddContact = (leadId?: string) => {
    const leadsToAdd = leadId ? [leadId] : selectedLeadIds;
    const selectedLeads = leads.filter(lead => leadsToAdd.includes(lead.id));
    
    setContactLeads(selectedLeads);
    setAddContactDialogOpen(true);
  };

  const confirmAddContact = () => {
    // Aquí se implementaría la lógica real para añadir contactos
    alert(`${contactLeads.length} contacto(s) añadido(s) correctamente`);
    setAddContactDialogOpen(false);
    setSelectedLeadIds([]);
    setContactNames({});
  };

  const handleViewDetails = (lead: Lead) => {
    // Abrir el chat lateral
    setSelectedChatLeadId(lead.id);
    setChatOpen(true);
    
    // Marcar como leído cuando se abre el chat usando el sistema centralizado
    markConversationAsRead(lead.id);
    
    // Actualizar estado local
    setUnreadLeads(prev => {
      const newSet = new Set(prev);
      newSet.delete(lead.id);
      return newSet;
    });
  };

  const handleOpenChatFromTable = (leadId: string) => {
    // Abrir el chat lateral
    setSelectedChatLeadId(leadId);
    setChatOpen(true);
    setFocusedLeadId(leadId); // Establecer el lead enfocado
    
    // Marcar como leído cuando se abre el chat usando el sistema centralizado
    markConversationAsRead(leadId);
    
    // Actualizar estado local
    setUnreadLeads(prev => {
      const newSet = new Set(prev);
      newSet.delete(leadId);
      return newSet;
    });
  };

  const handleOpenQualification = (leadId: string) => {
    // Abrir el panel de cualificación
    setSelectedQualificationLeadId(leadId);
    setQualificationOpen(true);
    setFocusedLeadId(leadId); // Establecer el lead enfocado
  };

  const handleOpenProperty = (property: Property, lead: Lead) => {
    setSelectedProperty(property);
    setSelectedPropertyLead(lead);
    setCurrentImageIndex(0);
    setIsEditingPhotos(false); // Reset modo edición
    setPropertySheetOpen(true);
    setFocusedLeadId(lead.id); // Establecer el lead enfocado
  };

  const handleUploadPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedProperty) return;

    // Convertir archivos a URLs temporales
    const newImageUrls: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImageUrls.push(e.target.result as string);
          
          // Si ya procesamos todos los archivos, actualizar el estado
          if (newImageUrls.length === files.length) {
            setSelectedProperty(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                images: [...prev.images, ...newImageUrls]
              };
            });
            
            // Actualizar también en leads
            setLeads(prevLeads => 
              prevLeads.map(lead => 
                lead.interestedProperty?.id === selectedProperty.id
                  ? {
                      ...lead,
                      interestedProperty: {
                        ...lead.interestedProperty,
                        images: [...lead.interestedProperty.images, ...newImageUrls]
                      }
                    }
                  : lead
              )
            );
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Limpiar el input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    if (!selectedProperty) return;

    const newImages = selectedProperty.images.filter((_, idx) => idx !== indexToDelete);
    
    // Si eliminamos la imagen actual, ajustar el índice
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }

    setSelectedProperty(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        images: newImages
      };
    });

    // Actualizar también en leads
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.interestedProperty?.id === selectedProperty.id
          ? {
              ...lead,
              interestedProperty: {
                ...lead.interestedProperty,
                images: newImages
              }
            }
          : lead
      )
    );
  };

  // Sincronizar con el sistema centralizado y escuchar cambios desde otras páginas
  useEffect(() => {
    // Escuchar cambios desde otras páginas (como alertas)
    const handleUnreadChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number; unreadIds: string[] }>;
      setUnreadLeads(new Set(customEvent.detail.unreadIds));
    };

    window.addEventListener('unreadConversationsChanged', handleUnreadChange);

    return () => {
      window.removeEventListener('unreadConversationsChanged', handleUnreadChange);
    };
  }, []);

  // NOTA: El contador de no leídos se sincroniza automáticamente vía evento 'unreadConversationsChanged'
  // El componente App.tsx escucha este evento, por lo que no necesitamos un prop onUnreadCountChange

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    
    // Buscar en todos los campos del lead
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchLower) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      lead.zone.toLowerCase().includes(searchLower) ||
      lead.propertyType.toLowerCase().includes(searchLower) ||
      (lead.budget && lead.budget.toLowerCase().includes(searchLower)) ||
      lead.intention.toLowerCase().includes(searchLower) ||
      lead.status.toLowerCase().includes(searchLower) ||
      lead.priority.toLowerCase().includes(searchLower) ||
      lead.lastMessage.toLowerCase().includes(searchLower) ||
      lead.lastContact.toLowerCase().includes(searchLower) ||
      (lead.nextAction && lead.nextAction.toLowerCase().includes(searchLower)) ||
      lead.alerts.some(alert => alert.toLowerCase().includes(searchLower)) ||
      lead.source.toLowerCase().includes(searchLower) ||
      (lead.source === 'phone' && ('telefono'.includes(searchLower) || 'llamada'.includes(searchLower))) ||
      (lead.source === 'whatsapp' && ('whatsapp'.includes(searchLower) || 'mensaje'.includes(searchLower) || 'conversacion'.includes(searchLower)));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesIntention = intentionFilter === 'all' || lead.intention === intentionFilter;
    const matchesChannel = channelFilter === 'all' || lead.source === channelFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesIntention && matchesChannel;
  })
  // Ordenar por fecha de más reciente a más antigua
  .sort((a, b) => {
    const dateA = new Date(a.lastContact).getTime();
    const dateB = new Date(b.lastContact).getTime();
    return dateB - dateA; // Orden descendente (más reciente primero)
  });

  // Calcular paginación para vista de tabla
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const stats = {
    total: leads.length,
    alertas: leads.filter(l => l.alerts.length > 0).length,
    nuevos: leads.filter(l => l.status === 'nuevo').length,
    calificados: leads.filter(l => l.status === 'calificado').length,
    propuestas: leads.filter(l => l.status === 'propuesta_enviada').length,
    negociaciones: leads.filter(l => l.status === 'negociacion').length,
    altaPrioridad: leads.filter(l => l.priority === 'alta').length
  };

  const renderContent = () => {
    // Mostrar empty state solo cuando realmente no hay leads (usuario nuevo)
    if (leads.length === 0 && isNewUser) {
      // Leer canales conectados desde localStorage
      const getConnectedChannels = () => {
        const savedChannels = localStorage.getItem('connectedChannels');
        if (savedChannels) {
          try {
            return JSON.parse(savedChannels);
          } catch (e) {
            return { whatsapp: false, instagram: false, messenger: false, tiktok: false };
          }
        }
        return { whatsapp: false, instagram: false, messenger: false, tiktok: false };
      };
      
      const connectedChannels = getConnectedChannels();
      
      // Vista móvil
      if (isMobile) {
        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {/* Icono principal del bot */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg mb-2">Tu asistente está listo</h3>
                <p className="text-gray-600 text-sm">
                  Cuando recibas tu primera conversación, aparecerá aquí
                </p>
              </div>

              {/* Canales conectados - versión móvil */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Canales activos</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    connectedChannels.whatsapp 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}>
                    <WhatsAppIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    connectedChannels.instagram 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}>
                    <Instagram className="h-4 w-4 text-pink-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700">Instagram</span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    connectedChannels.messenger 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}>
                    <MessengerIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700">Messenger</span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    connectedChannels.tiktok 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}>
                    <TikTokIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700">TikTok</span>
                  </div>
                </div>
              </div>

              {/* Información útil - versión móvil */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900">24/7</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900">Cualifica</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900">Notifica</p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => {
                    if (onNavigateToConfig) {
                      onNavigateToConfig();
                    }
                  }}
                  className="gap-2 w-full"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
      
      // Vista desktop
      return (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {/* Preview de la tabla con empty state */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[200px]">Conversaciones</TableHead>
                    <TableHead className="w-[100px]">Fecha</TableHead>
                    <TableHead className="w-[120px]">Rol</TableHead>
                    <TableHead className="w-[150px]">Cualificación</TableHead>
                    <TableHead className="w-[180px]">Propiedad Match</TableHead>
                    <TableHead className="w-[200px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state dentro de la tabla */}
                  <TableRow>
                    <TableCell colSpan={7} className="h-[500px]">
                      <div className="flex items-center justify-center h-full">
                        <div className="max-w-2xl w-full px-6 py-12">
                          {/* Icono principal del bot */}
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
                              <Bot className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl mb-2">Tu asistente está listo</h3>
                            <p className="text-gray-600 text-sm">
                              Cuando recibas tu primera conversación, aparecerá en esta tabla
                            </p>
                          </div>

                          {/* Canales conectados - versión compacta */}
                          <div className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 rounded-lg p-4 mb-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </div>
                              <p className="text-sm font-medium text-gray-900">Canales activos</p>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <div className={`flex items-center justify-center gap-1.5 p-2 rounded border transition-all ${
                                connectedChannels.whatsapp 
                                  ? 'bg-white border-gray-200' 
                                  : 'bg-gray-50 border-gray-100 opacity-50'
                              }`}>
                                <WhatsAppIcon className="h-4 w-4" />
                                <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                              </div>
                              <div className={`flex items-center justify-center gap-1.5 p-2 rounded border transition-all ${
                                connectedChannels.instagram 
                                  ? 'bg-white border-gray-200' 
                                  : 'bg-gray-50 border-gray-100 opacity-50'
                              }`}>
                                <Instagram className="h-4 w-4 text-pink-600" />
                                <span className="text-xs font-medium text-gray-700">Instagram</span>
                              </div>
                              <div className={`flex items-center justify-center gap-1.5 p-2 rounded border transition-all ${
                                connectedChannels.messenger 
                                  ? 'bg-white border-gray-200' 
                                  : 'bg-gray-50 border-gray-100 opacity-50'
                              }`}>
                                <MessengerIcon className="h-4 w-4" />
                                <span className="text-xs font-medium text-gray-700">Messenger</span>
                              </div>
                              <div className={`flex items-center justify-center gap-1.5 p-2 rounded border transition-all ${
                                connectedChannels.tiktok 
                                  ? 'bg-white border-gray-200' 
                                  : 'bg-gray-50 border-gray-100 opacity-50'
                              }`}>
                                <TikTokIcon className="h-4 w-4" />
                                <span className="text-xs font-medium text-gray-700">TikTok</span>
                              </div>
                            </div>
                          </div>

                          {/* Información útil - versión compacta */}
                          <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                              <p className="text-xs font-medium text-gray-900">24/7</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                              <p className="text-xs font-medium text-gray-900">Cualifica</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                              <p className="text-xs font-medium text-gray-900">Notifica</p>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="text-center">
                            <Button 
                              size="sm"
                              variant="outline" 
                              onClick={() => {
                                if (onNavigateToConfig) {
                                  onNavigateToConfig();
                                }
                              }}
                              className="gap-2"
                            >
                              <Settings2 className="h-3.5 w-3.5" />
                              Configuración
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Si no hay resultados por filtros, mostrar mensaje simple
    if (filteredLeads.length === 0) {
      return (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No se encontraron conversaciones</h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros para ver más resultados
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <TableView 
        leads={paginatedLeads} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        selectedLeadIds={selectedLeadIds}
        onSelectionChange={setSelectedLeadIds}
        columns={tableColumns}
        onColumnsChange={setTableColumns}
        onAddContact={(leadId) => handleAddContact(leadId)}
        onOpenChat={handleOpenChatFromTable}
        unreadLeads={unreadLeads}
        disabledBotLeads={disabledBotLeads}
        toggleBotStatus={toggleBotStatus}
        toggleFavorite={toggleFavorite}
        onCall={handleCall}
        onOpenSaveContact={handleOpenSaveContact}
        onOpenQualification={handleOpenQualification}
        onOpenProperty={handleOpenProperty}
        focusedLeadId={focusedLeadId}
      />
    );
  };

  // Construir chatData usando useMemo
  const chatData = useMemo(() => {
    if (!selectedChatLeadId) {
      console.log('No selectedChatLeadId, returning null');
      return null;
    }
    
    console.log('Building chatData for lead:', selectedChatLeadId);
    const lead = mockLeads.find(l => l.id === selectedChatLeadId);
    const conversation = mockConversations.find(c => c.leadId === selectedChatLeadId);
    console.log('Found lead:', lead, 'Found conversation:', conversation);
    
    if (!lead) {
      console.log('No lead found, returning null');
      return null;
    }
    
    const result = {
      conversation: {
        id: lead.id,
        type: lead.source,
        contact: {
          name: lead.name,
          phone: lead.phone,
        },
        property: `${lead.propertyType} en ${lead.zone}`,
        startTime: lead.lastContact,
        duration: '6m 15s',
        status: 'completed' as const,
        leadScore: lead.score,
      },
      messages: conversation ? conversation.messages.map((msg, idx) => ({
        id: msg.id,
        type: msg.senderId === 'lead' ? 'user' as const : 'assistant' as const,
        content: msg.text,
        timestamp: msg.timestamp.split(' ')[1] || msg.timestamp,
      })) : [
        {
          id: '1',
          type: 'system' as const,
          content: `${lead.source === 'phone' ? 'Llamada' : 'Conversación'} iniciada - Asistente IA conectado`,
          timestamp: '15:42:10',
        },
        {
          id: '2',
          type: 'assistant' as const,
          content: 'Hola, soy el asistente inmobiliario. ¿En qué puedo ayudarte?',
          timestamp: '15:42:12',
        },
        {
          id: '3',
          type: 'user' as const,
          content: lead.lastMessage,
          timestamp: '15:42:18',
        },
      ],
    };
    
    console.log('Returning chatData from useMemo:', result);
    return result;
  }, [selectedChatLeadId]);

  return (
    <div className="space-y-8">
      {/* Header minimalista */}
      <div className={isMobile ? "px-4 pt-4" : ""}>
        <div className="flex items-center gap-3">
          <h1 className={isMobile ? "text-xl text-gray-900" : "text-2xl font-semibold text-gray-900"}>Mis Conversaciones</h1>
        </div>
        <p className="text-gray-600 mt-1">
          Gestiona todas tus conversaciones en un solo lugar
        </p>
      </div>

      {/* Filtros y selector de vista */}
      <div className={`flex flex-col gap-4 ${isMobile ? "pt-0 px-4" : ""}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className={`flex flex-col sm:flex-row gap-4 ${isMobile ? 'w-full' : 'flex-1'}`}>
            <div className={`relative ${isMobile ? 'w-full' : 'flex-1'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en conversaciones..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-2 border-gray-300 bg-white focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Filtros por Canal */}
        <div className="space-y-2">
          <span className="text-sm text-gray-600 font-medium">Filtrar por canal:</span>
          
          {/* Vista móvil - Pastillas con scroll horizontal */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 hide-scrollbar">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => {
                  setChannelFilter('all');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  channelFilter === 'all'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Todos</span>
              </button>
              <button
                onClick={() => {
                  setChannelFilter('whatsapp');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  channelFilter === 'whatsapp'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <WhatsAppIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setChannelFilter('instagram');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  channelFilter === 'instagram'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Instagram className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Instagram</span>
              </button>
              <button
                onClick={() => {
                  setChannelFilter('messenger');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  channelFilter === 'messenger'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessengerIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Messenger</span>
              </button>
              <button
                onClick={() => {
                  setChannelFilter('tiktok');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  channelFilter === 'tiktok'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TikTokIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">TikTok</span>
              </button>
            </div>
          </div>

          {/* Vista desktop - Botones originales */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setChannelFilter('all');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                channelFilter === 'all'
                  ? 'bg-[#e7af2a] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Todos</span>
            </button>
            <button
              onClick={() => {
                setChannelFilter('whatsapp');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                channelFilter === 'whatsapp'
                  ? 'bg-[#e7af2a] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <WhatsAppIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">WhatsApp</span>
            </button>
            <button
              onClick={() => {
                setChannelFilter('instagram');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                channelFilter === 'instagram'
                  ? 'bg-[#e7af2a] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Instagram className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Instagram</span>
            </button>
            <button
              onClick={() => {
                setChannelFilter('messenger');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                channelFilter === 'messenger'
                  ? 'bg-[#e7af2a] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessengerIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Messenger</span>
            </button>
            <button
              onClick={() => {
                setChannelFilter('tiktok');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                channelFilter === 'tiktok'
                  ? 'bg-[#e7af2a] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TikTokIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">TikTok</span>
            </button>
          </div>
        </div>

        {/* Tabs de filtro por intención (Rol) */}
        <div className="space-y-2">
          <span className="text-sm text-gray-600 font-medium">Filtrar por rol:</span>
          
          {/* Vista móvil - Pastillas con scroll horizontal */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 hide-scrollbar">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => {
                  setIntentionFilter('all');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'all'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Todos</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('comprador');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'comprador'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Comprador</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('vendedor');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'vendedor'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Vendedor</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('arrendador');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'arrendador'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Arrendador</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('inquilino');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'inquilino'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Key className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Inquilino</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('otros');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'otros'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HelpCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Sin definir</span>
              </button>
            </div>
          </div>

          {/* Vista desktop - Tabs originales */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setIntentionFilter('all');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'all'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Todos</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('comprador');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'comprador'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Comprador</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('vendedor');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'vendedor'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Vendedor</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('arrendador');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'arrendador'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Arrendador</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('inquilino');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'inquilino'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Key className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Inquilino</span>
              </button>
              <button
                onClick={() => {
                  setIntentionFilter('otros');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  intentionFilter === 'otros'
                    ? 'bg-[#e7af2a] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HelpCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Sin definir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de acciones masivas */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs">
                {selectedLeadIds.length}
              </div>
              <p className="text-sm text-gray-700">
                {selectedLeadIds.length > 1 ? 'contactos seleccionados' : 'contacto seleccionado'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Añadir Contacto */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-white"
                onClick={() => handleAddContact()}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Añadir Contacto</span>
              </Button>

              {/* Eliminar */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </Button>

              {/* Cancelar selección */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedLeadIds([])}
                className="h-8"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido según vista seleccionada */}
      {renderContent()}

      {/* Diálogo Añadir Contacto */}
      <Dialog open={addContactDialogOpen} onOpenChange={setAddContactDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {contactLeads.length === 1 ? 'Añadir Contacto' : `Añadir ${contactLeads.length} Contactos`}
            </DialogTitle>
            <DialogDescription>
              Revisa la información que se guardará en tus contactos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {contactLeads.map((lead, index) => {
              // Generar resumen de información
              const infoSummary = [
                `Intención: ${lead.intention === 'comprar' ? 'Comprar propiedad' : lead.intention === 'vender' ? 'Vender propiedad' : 'Ver propiedades'}`,
                lead.budget ? `Presupuesto: ${lead.budget}` : null,
                `Zona de interés: ${lead.zone}`,
                `Tipo de propiedad: ${lead.propertyType}`,
                `Prioridad: ${lead.priority}`,
                `Score: ${calculateLeadScore(lead)}%`,
                lead.nextAction ? `Próxima acción: ${lead.nextAction}` : null,
                `Origen: ${lead.source === 'phone' ? 'Llamada telefónica' : 'WhatsApp'}`,
                `Último contacto: ${lead.lastContact}`,
                lead.lastMessage ? `Último mensaje: ${lead.lastMessage}` : null
              ].filter(Boolean).join(' | ');

              return (
                <div key={lead.id} className={contactLeads.length > 1 ? 'pb-6 border-b border-gray-200 last:border-0' : ''}>
                  {contactLeads.length > 1 && (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-600">Contacto {index + 1} de {contactLeads.length}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <Input 
                        placeholder="Nombre del contacto"
                        value={contactNames[lead.id] || ''}
                        onChange={(e) => setContactNames(prev => ({
                          ...prev,
                          [lead.id]: e.target.value
                        }))}
                      />
                      <ContactDataPills 
                        lead={lead}
                        onAddData={(data) => {
                          const currentValue = (contactNames[lead.id] || '').trim();
                          setContactNames(prev => ({
                            ...prev,
                            [lead.id]: currentValue ? `${currentValue} - ${data}` : data
                          }));
                        }}
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input 
                        placeholder="Número de teléfono"
                        defaultValue={lead.phone}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <Input 
                        type="email"
                        placeholder="correo@ejemplo.com"
                        defaultValue={lead.email || ''}
                      />
                    </div>

                    {/* Información */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Información
                      </label>
                      <Textarea 
                        placeholder="Añade información adicional sobre este contacto..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setAddContactDialogOpen(false);
                setSelectedLeadIds([]);
                setContactNames({});
              }}
            >
              Cancelar
            </Button>
            <Button onClick={confirmAddContact}>
              <UserPlus className="h-4 w-4 mr-2" />
              {contactLeads.length === 1 ? 'Guardar el teléfono' : `Guardar ${contactLeads.length} teléfonos`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Guardar Contacto antes de Llamar */}
      <Dialog open={saveBeforeCallDialogOpen} onOpenChange={setSaveBeforeCallDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {saveContactMode === 'saveAndCall' ? 'Añadir Contacto' : 'Añadir Contacto'}
            </DialogTitle>
            <DialogDescription>
              Revisa la información que se guardará en tus contactos
            </DialogDescription>
          </DialogHeader>

          {leadToCall && (
            <div className="space-y-6">
              <div>
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <Input 
                      placeholder="Nombre del contacto"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && contactName.trim()) {
                          saveContactMode === 'saveAndCall' ? handleSaveAndCall() : handleSaveContactOnly();
                        }
                      }}
                      autoFocus
                    />
                    
                    {/* Etiquetas clickeables para añadir al nombre */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      {/* Etiquetas predeterminadas (dinámicas basadas en respuestas) */}
                      {defaultTags.map((tag, index) => {
                        // Determinar el icono del canal basado en la fuente del lead
                        const getChannelIcon = () => {
                          const iconClass = "h-3 w-3";
                          
                          switch (leadToCall?.source) {
                            case 'whatsapp':
                              return <WhatsAppIcon className={iconClass} />;
                            case 'instagram':
                              return <Instagram className={iconClass} />;
                            case 'messenger':
                              return <MessengerIcon className={iconClass} />;
                            case 'tiktok':
                              return <TikTokIcon className={iconClass} />;
                            default:
                              return <WhatsAppIcon className={iconClass} />;
                          }
                        };

                        // Nombre del canal para el tooltip
                        const getChannelName = () => {
                          switch (leadToCall?.source) {
                            case 'whatsapp':
                              return 'WhatsApp';
                            case 'instagram':
                              return 'Instagram';
                            case 'messenger':
                              return 'Messenger';
                            case 'tiktok':
                              return 'TikTok';
                            default:
                              return 'WhatsApp';
                          }
                        };

                        return (
                          <TooltipProvider key={tag}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentValue = contactName.trim();
                                      setContactName(currentValue ? `${currentValue} - ${tag}` : tag);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" />
                                    {tag}
                                  </button>
                                  {/* Badge flotante con el icono del canal - fondo blanco, icono negro */}
                                  <div className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-white rounded-full border-2 border-gray-200 shadow-sm pointer-events-none">
                                    {getChannelIcon()}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Respuesta de cualificación desde {getChannelName()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                      
                      {/* Etiquetas personalizadas */}
                      {customTags.map((tag) => (
                        <div key={tag} className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const currentValue = contactName.trim();
                              setContactName(currentValue ? `${currentValue} - ${tag}` : tag);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            {tag}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomTags(customTags.filter(t => t !== tag));
                            }}
                            className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Botón para crear nueva etiqueta */}
                      <button
                        type="button"
                        onClick={() => setShowNewTagDialog(true)}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white text-primary border-2 border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Nueva etiqueta
                      </button>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input 
                      placeholder="Número de teléfono"
                      value={leadToCall.phone}
                      disabled
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <Input 
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas
                    </label>
                    <Textarea
                      placeholder="Añade notas adicionales sobre este contacto..."
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            {saveContactMode === 'saveAndCall' ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCallWithoutSaving}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar sin guardar
                </Button>
                <Button 
                  onClick={handleSaveAndCall}
                  disabled={!contactName.trim()}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Guardar y llamar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSaveBeforeCallDialogOpen(false);
                    setLeadToCall(null);
                    setContactName('');
                    setContactEmail('');
                    setContactNotes('');
                    setSelectedTags([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveContactOnly}
                  disabled={!contactName.trim()}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Guardar contacto
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear nueva etiqueta - KEEP THIS */}
      <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nueva etiqueta</DialogTitle>
            <DialogDescription>
              Crea una etiqueta personalizada para añadir al nombre del contacto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-tag-name">Nombre de la etiqueta</Label>
              <Input
                id="new-tag-name"
                placeholder="Ej: Busca parking"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagName.trim()) {
                    const tag = newTagName.trim();
                    if (!customTags.includes(tag)) {
                      setCustomTags([...customTags, tag]);
                      
                      // Automáticamente añadir al nombre del contacto
                      const currentValue = contactName.trim();
                      setContactName(currentValue ? `${currentValue} - ${tag}` : tag);
                      
                      setNewTagName('');
                      setShowNewTagDialog(false);
                    }
                  }
                }}
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewTagDialog(false);
                setNewTagName('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const tag = newTagName.trim();
                if (tag && !customTags.includes(tag)) {
                  setCustomTags([...customTags, tag]);
                  
                  // Automáticamente añadir al nombre del contacto
                  const currentValue = contactName.trim();
                  setContactName(currentValue ? `${currentValue} - ${tag}` : tag);
                  
                  setNewTagName('');
                  setShowNewTagDialog(false);
                }
              }}
              disabled={!newTagName.trim()}
            >
              Crear etiqueta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Configuración de Columnas */}
      <ColumnConfigDialog
        columns={tableColumns}
        onColumnsChange={setTableColumns}
        open={columnConfigOpen}
        onOpenChange={setColumnConfigOpen}
      />

      {/* Chat Lateral */}
      {chatOpen && selectedChatLeadId && (
        <OldConversationSheet
          open={chatOpen}
          onOpenChange={(open) => {
            setChatOpen(open);
          }}
          lead={leads.find(l => l.id === selectedChatLeadId)}
          conversation={mockConversations.find(c => c.leadId === selectedChatLeadId)}
          onSaveContact={handleOpenSaveContact}
          disabledBotLeads={disabledBotLeads}
          toggleBotStatus={toggleBotStatus}
          onCall={handleCall}
          onOpenQualification={handleOpenQualification}
        />
      )}

      {/* Panel de Cualificación */}
      {qualificationOpen && selectedQualificationLeadId && (
        <QualificationPanel
          open={qualificationOpen}
          onOpenChange={(open) => {
            setQualificationOpen(open);
          }}
          lead={leads.find(l => l.id === selectedQualificationLeadId)}
          disabledBotLeads={disabledBotLeads}
          toggleBotStatus={toggleBotStatus}
          onCall={handleCall}
          onOpenSaveContact={handleOpenSaveContact}
          onOpenQualification={handleOpenQualification}
        />
      )}

      {/* Panel Lateral de Detalles de Propiedad */}
      <Sheet open={propertySheetOpen} onOpenChange={(open) => {
        setPropertySheetOpen(open);
      }}>
        <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selectedProperty ? selectedProperty.title : 'Detalles de la propiedad'}
            </SheetTitle>
            <SheetDescription>
              Información detallada de la propiedad de interés del lead
            </SheetDescription>
          </SheetHeader>
          {selectedProperty && selectedPropertyLead && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header - Información del contacto */}
              <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPropertySheetOpen(false)}
                    className="flex-shrink-0"
                    aria-label="Volver"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                      {selectedPropertyLead.avatar && <AvatarImage src={selectedPropertyLead.avatar} alt={selectedPropertyLead.name} />}
                      <AvatarFallback className="bg-transparent text-primary">
                        {selectedPropertyLead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge flotante del canal */}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                      {selectedPropertyLead.source === 'whatsapp' ? <WhatsAppIcon className="h-3.5 w-3.5" /> : 
                       selectedPropertyLead.source === 'instagram' ? <Instagram className="h-3.5 w-3.5" /> :
                       selectedPropertyLead.source === 'messenger' ? <MessengerIcon className="h-3.5 w-3.5" /> :
                       selectedPropertyLead.source === 'tiktok' ? <TikTokIcon className="h-3.5 w-3.5" /> :
                       <Phone className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {selectedPropertyLead.phone}
                    </h2>
                    {/* Nombre del canal detectado */}
                    {(() => {
                      const platformName = selectedPropertyLead.whatsappName || 
                                          selectedPropertyLead.instagramUsername || 
                                          selectedPropertyLead.messengerName || 
                                          selectedPropertyLead.tiktokUsername;
                      return platformName ? (
                        <p className="text-sm text-gray-500 truncate">
                          {platformName}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditingPhotos && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                      Editando fotos
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex-shrink-0 flex items-center justify-center h-8 px-2 rounded-[10px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Opciones de propiedad"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {(() => {
                      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                      const isContactSaved = savedContacts.some((c: any) => c.phone === selectedPropertyLead.phone);
                      return isContactSaved ? (
                        <DropdownMenuItem onClick={() => {
                          // TODO: Abrir ContactDetailsSheet en modo edición
                          alert('Funcionalidad en desarrollo');
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar contacto guardado
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => {
                          handleOpenSaveContact(selectedPropertyLead.id);
                          setPropertySheetOpen(false);
                        }}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Guardar como contacto
                        </DropdownMenuItem>
                      );
                    })()}
                    <DropdownMenuItem onClick={() => {
                      handleCall(selectedPropertyLead.phone);
                      setPropertySheetOpen(false);
                    }}>
                      <Phone className="mr-2 h-4 w-4" />
                      Llamar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setChatOpen(true);
                      setSelectedChatLeadId(selectedPropertyLead.id);
                      setPropertySheetOpen(false);
                    }}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Abrir conversación
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setPropertySheetOpen(false);
                      setPropertyDetailOpen(true);
                    }}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver ficha de la propiedad
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditingPhotos(!isEditingPhotos)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {isEditingPhotos ? 'Terminar edición' : 'Editar fotos'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar propiedad
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar propiedad
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Contenido principal - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-4">
                {/* Información de la propiedad */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
                  {/* Galería de imágenes */}
                  <div>
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={selectedProperty.images[currentImageIndex]}
                        alt={`${selectedProperty.title} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedProperty.images.length > 1 && !isEditingPhotos && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => 
                              prev === 0 ? selectedProperty.images.length - 1 : prev - 1
                            )}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Imagen anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => 
                              prev === selectedProperty.images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Imagen siguiente"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      
                      {/* Indicador de imagen actual */}
                      {selectedProperty.images.length > 1 && !isEditingPhotos && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          {currentImageIndex + 1} / {selectedProperty.images.length}
                        </div>
                      )}
                      
                      {/* Botón + para agregar fotos en modo edición */}
                      {isEditingPhotos && (
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.multiple = true;
                            input.onchange = (e: any) => handleAddPhotos(e.target.files);
                            input.click();
                          }}
                          className="absolute top-2 right-2 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg transition-colors"
                          aria-label="Agregar fotos"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Miniaturas */}
                    {selectedProperty.images.length > 1 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                        {selectedProperty.images.map((img, idx) => (
                          <div key={idx} className="relative flex-shrink-0">
                            <button
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex 
                                  ? 'border-primary ring-2 ring-primary/20' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Miniatura ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                            
                            {/* Botón X para eliminar miniatura en modo edición */}
                            {isEditingPhotos && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(idx);
                                }}
                                className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                                aria-label={`Eliminar imagen ${idx + 1}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Título y ubicación */}
                  <div>
                    <h3 className="text-gray-900">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      {selectedProperty.location}
                    </p>
                  </div>

                  {/* Precio y características principales - igual que property-detail */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    {/* Precio destacado */}
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 mb-4">
                      <div className="text-3xl text-gray-900 mb-0.5">
                        {formatPrice(selectedProperty.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedProperty.area > 0 ? `${formatPrice(calculatePricePerM2(selectedProperty.price, selectedProperty.area)).replace(/\s/g, '')}/m²` : '—'}
                      </div>
                    </div>

                    {/* Características principales en cards compactas */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Tipo de propiedad */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <Building2 className="h-4 w-4 text-purple-600 mb-1" />
                        <div className="text-sm text-gray-900">{selectedProperty.type}</div>
                        <div className="text-xs text-gray-600">Venta</div>
                      </div>
                      
                      {/* Superficie construida */}
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <Maximize className="h-4 w-4 text-primary mb-1" />
                        <div className="text-sm text-gray-900">{selectedProperty.area} m²</div>
                        <div className="text-xs text-gray-600">Construidos</div>
                      </div>
                      
                      {/* Habitaciones */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Bed className="h-4 w-4 text-blue-600 mb-1" />
                        <div className="text-sm text-gray-900">{selectedProperty.bedrooms}</div>
                        <div className="text-xs text-gray-600">Dormitorios</div>
                      </div>
                      
                      {/* Baños */}
                      <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                        <Bath className="h-4 w-4 text-cyan-600 mb-1" />
                        <div className="text-sm text-gray-900">{selectedProperty.bathrooms}</div>
                        <div className="text-xs text-gray-600">Baños</div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  {selectedProperty.description && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h2 className="text-lg text-gray-900 mb-3">Descripción</h2>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {selectedProperty.description}
                      </p>
                    </div>
                  )}

                  {/* Características adicionales */}
                  {selectedProperty.features && selectedProperty.features.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h2 className="text-lg text-gray-900 mb-3">Características</h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.features.map((feature, idx) => (
                          <div key={idx} className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ubicación con mapa */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-lg text-gray-900">Ubicación</h2>
                    </div>
                    
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                      <iframe
                        title="Mapa de ubicación"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedProperty.location)}&t=&z=15&ie=UTF8&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con acciones */}
            <div className="border-t p-4 bg-white flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPropertySheetOpen(false);
                    setChatOpen(true);
                    setSelectedChatLeadId(selectedPropertyLead.id);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Abrir conversación
                </Button>
                <Button
                  className="flex-1 bg-[#e7af2a] hover:bg-[#d19e25] text-white"
                  onClick={() => {
                    setPropertySheetOpen(false);
                    if (selectedPropertyLead?.phone) {
                      window.location.href = `tel:${selectedPropertyLead.phone}`;
                    }
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>

    {/* PropertyDetail modal para ver ficha completa */}
    {propertyDetailOpen && selectedProperty && (
      <PropertyDetail
        property={convertPropertyToDetailFormat(selectedProperty)}
        onClose={() => setPropertyDetailOpen(false)}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )}
  </div>
);
}
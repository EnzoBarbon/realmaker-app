import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "../ui/use-mobile";
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  MapPin,
  DollarSign,
  Download,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings2,
  UserPlus,
  X,
  Send,
  Clock,
  Home,
  ShoppingCart,
  ArrowLeft,
  Instagram,
  ExternalLink,
  Pencil,
  Save,
  MoreVertical,
  BotOff,
  RefreshCw,
  CheckCircle2,
  FileEdit,
  Link as LinkIcon,
  Plus,
  Cloud,
  Mail,
  Loader2,
  Info,
  User,
  Eye,
  Check
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import { toast } from "sonner@2.0.3";
import { TestModal } from "./test-modal";
import { ContactTagsSection } from "./contact-tags-section";

// Tipos
interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  zone: string;
  budget?: string;
  propertyType: string;
  addedDate: string;
  channels: ContactChannel[];
  tags?: string[];
  notes?: string;
  userType: 'buyer' | 'seller';
  avatarUrl?: string;
  qualificationQuestions?: Array<{
    id: string;
    question: string;
    answer: string;
    timestamp: string;
  }>;
  sourceChannel?: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok'; // Canal desde donde se guardó el contacto
}

interface ContactChannel {
  id: string;
  type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  lastContact: string;
  messagesCount: number;
  conversationId: string;
  socialHandle?: string; // Nombre de usuario en Instagram, Facebook o TikTok
  conversationData?: {
    intention?: string; // 'comprar', 'vender', 'consulta'
    budget?: string;
    zone?: string;
    propertyType?: string;
    summary?: string; // Resumen de lo hablado
  };
}

interface Message {
  id: string;
  senderId: 'lead' | 'agent' | 'bot';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  leadId: string;
  type: 'whatsapp';
  messages: Message[];
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
  required?: boolean;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'María García',
    phone: '+34 612 345 678',
    zone: 'Centro',
    budget: '€250,000',
    propertyType: 'Piso',
    addedDate: '2024-10-10',
    notes: 'Clienta VIP muy interesada. Prefiere planta alta con ascensor. Disponible para visitas los fines de semana.',
    channels: [
      { 
        id: 'ch1', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 12, 
        conversationId: 'conv1',
        conversationData: {
          intention: 'comprar',
          budget: '€250,000',
          zone: 'Centro',
          propertyType: 'Piso',
          summary: 'Interesada en pisos en el centro de la ciudad. Busca 2-3 habitaciones con buena luz natural.'
        }
      },
      { 
        id: 'ch1b', 
        type: 'instagram', 
        lastContact: '2024-10-13', 
        messagesCount: 5, 
        conversationId: 'conv1',
        socialHandle: '@maria.garcia',
        conversationData: {
          intention: 'consulta',
          summary: 'Consulta sobre proceso de compra y documentación necesaria para hipoteca.'
        }
      },
      { 
        id: 'ch1c', 
        type: 'messenger', 
        lastContact: '2024-10-12', 
        messagesCount: 3, 
        conversationId: 'conv1',
        socialHandle: 'María García',
        conversationData: {
          intention: 'consulta',
          summary: 'Pregunta sobre horarios de visita y disponibilidad de propiedades.'
        }
      }
    ],
    tags: ['VIP', 'Comprador'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MTAyOTM3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sourceChannel: 'whatsapp',
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Piso', timestamp: '2024-10-10 10:15' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Centro', timestamp: '2024-10-10 10:17' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€250.000', timestamp: '2024-10-10 10:20' },
      { id: 'q4', question: '¿Cuántos dormitorios necesitas?', answer: '2-3 habitaciones', timestamp: '2024-10-10 10:22' },
    ]
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    phone: '+34 623 456 789',
    zone: 'Norte',
    budget: '€180,000',
    propertyType: 'Apartamento',
    addedDate: '2024-10-08',
    notes: 'Primera vivienda',
    channels: [
      { 
        id: 'ch3', 
        type: 'whatsapp', 
        lastContact: '2024-10-13', 
        messagesCount: 8, 
        conversationId: 'conv3',
        conversationData: {
          intention: 'comprar',
          budget: '€180,000',
          zone: 'Norte',
          propertyType: 'Apartamento',
          summary: 'Busca apartamento en zona norte cerca del metro. Primera vivienda, necesita asesoramiento.'
        }
      }
    ],
    tags: ['Primera vivienda'],
    userType: 'buyer',
    sourceChannel: 'instagram',
    qualificationQuestions: [
      { id: 'q1', question: '¿Qué tipo de propiedad estás buscando?', answer: 'Apartamento', timestamp: '2024-10-08 14:30' },
      { id: 'q2', question: '¿En qué zona te gustaría vivir?', answer: 'Norte', timestamp: '2024-10-08 14:33' },
      { id: 'q3', question: '¿Cuál es tu presupuesto aproximado?', answer: '€180.000', timestamp: '2024-10-08 14:35' },
    ]
  },
  {
    id: '3',
    name: 'Ana Martínez',
    phone: '+34 634 789 012',
    zone: 'Sur',
    budget: '€320,000',
    propertyType: 'Chalet',
    addedDate: '2024-10-05',
    channels: [
      { 
        id: 'ch5', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 7, 
        conversationId: 'conv5',
        conversationData: {
          intention: 'comprar',
          budget: '€320,000',
          zone: 'Sur',
          propertyType: 'Chalet',
          summary: 'Inversora interesada en chalet en zona sur con potencial de revalorización. Busca propiedad para alquiler.'
        }
      },
      { 
        id: 'ch5b', 
        type: 'instagram', 
        lastContact: '2024-10-13', 
        messagesCount: 6, 
        conversationId: 'conv5',
        socialHandle: '@ana.martinez.invest',
        conversationData: {
          intention: 'comprar',
          zone: 'Costa',
          propertyType: 'Apartamento',
          summary: 'Interesada en apartamentos en la costa para inversión turística.'
        }
      }
    ],
    tags: ['Inversor', 'VIP'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1689635665521-264268212250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzYxMDczNDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    name: 'Pedro López',
    phone: '+34 645 123 456',
    zone: 'Este',
    budget: '€400,000',
    propertyType: 'Casa',
    addedDate: '2024-10-12',
    channels: [
      { 
        id: 'ch6', 
        type: 'whatsapp', 
        lastContact: '2024-10-15', 
        messagesCount: 5, 
        conversationId: 'conv6',
        conversationData: {
          intention: 'vender',
          zone: 'Este',
          propertyType: 'Casa',
          summary: 'Quiere vender casa en zona este. Necesita tasación y asesoramiento sobre mejor momento para vender.'
        }
      }
    ],
    tags: ['Vendedor'],
    userType: 'seller',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NjEwODc5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '5',
    name: 'Laura Fernández',
    phone: '+34 656 789 012',
    zone: 'Oeste',
    budget: '€275,000',
    propertyType: 'Piso',
    addedDate: '2024-10-09',
    channels: [
      { 
        id: 'ch7', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 10, 
        conversationId: 'conv7',
        conversationData: {
          intention: 'vender',
          zone: 'Oeste',
          propertyType: 'Piso',
          summary: 'Urgencia por vender piso por motivos laborales. Busca venta rápida y segura.'
        }
      },
      { 
        id: 'ch7c', 
        type: 'messenger', 
        lastContact: '2024-10-12', 
        messagesCount: 5, 
        conversationId: 'conv7',
        socialHandle: 'Laura Fernández',
        conversationData: {
          intention: 'consulta',
          summary: 'Consulta sobre documentación necesaria para la venta.'
        }
      }
    ],
    tags: ['Vendedor', 'Urgente'],
    userType: 'seller'
  },
  {
    id: '6',
    name: 'Javier Sánchez',
    phone: '+34 667 234 567',
    email: 'javier.sanchez@email.com',
    zone: 'Centro',
    budget: '€350,000',
    propertyType: 'Dúplex',
    addedDate: '2024-10-11',
    channels: [
      { 
        id: 'ch8', 
        type: 'tiktok', 
        lastContact: '2024-10-15', 
        messagesCount: 15, 
        conversationId: 'conv8',
        socialHandle: '@javier.homes',
        conversationData: {
          intention: 'comprar',
          budget: '€350,000',
          zone: 'Centro',
          propertyType: 'Dúplex',
          summary: 'Vio nuestro video sobre dúplex en el centro. Busca propiedad moderna con terraza y parking.'
        }
      },
      { 
        id: 'ch8b', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 8, 
        conversationId: 'conv8b',
        conversationData: {
          intention: 'comprar',
          zone: 'Centro',
          propertyType: 'Dúplex',
          summary: 'Solicita más información sobre opciones de financiación y visitas programadas.'
        }
      }
    ],
    tags: ['TikTok Lead', 'Comprador'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjEwODc5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '7',
    name: 'Sofía Morales',
    phone: '+34 678 345 678',
    email: 'sofia.m@email.com',
    zone: 'Costa',
    budget: '€500,000',
    propertyType: 'Villa',
    addedDate: '2024-10-07',
    channels: [
      { 
        id: 'ch9', 
        type: 'instagram', 
        lastContact: '2024-10-15', 
        messagesCount: 20, 
        conversationId: 'conv9',
        socialHandle: '@sofia.lifestyle',
        conversationData: {
          intention: 'comprar',
          budget: '€500,000',
          zone: 'Costa',
          propertyType: 'Villa',
          summary: 'Interesada en villas de lujo en la costa. Busca propiedad con vistas al mar y piscina privada.'
        }
      },
      { 
        id: 'ch9b', 
        type: 'tiktok', 
        lastContact: '2024-10-13', 
        messagesCount: 12, 
        conversationId: 'conv9b',
        socialHandle: '@sofia.lifestyle',
        conversationData: {
          intention: 'consulta',
          summary: 'Pregunta sobre el proceso de compra para extranjeros y requisitos legales.'
        }
      },
      { 
        id: 'ch9c', 
        type: 'whatsapp', 
        lastContact: '2024-10-10', 
        messagesCount: 6, 
        conversationId: 'conv9c',
        conversationData: {
          intention: 'comprar',
          budget: '€500,000',
          zone: 'Costa',
          propertyType: 'Villa',
          summary: 'Solicita visita virtual para propiedades en la costa este fin de semana.'
        }
      }
    ],
    tags: ['VIP', 'Inversor', 'Internacional'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTA4Nzk4M3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '8',
    name: 'Roberto Díaz',
    phone: '+34 689 456 789',
    zone: 'Norte',
    budget: '€220,000',
    propertyType: 'Estudio',
    addedDate: '2024-10-13',
    channels: [
      { 
        id: 'ch10', 
        type: 'messenger', 
        lastContact: '2024-10-15', 
        messagesCount: 9, 
        conversationId: 'conv10',
        socialHandle: 'Roberto Díaz',
        conversationData: {
          intention: 'comprar',
          budget: '€220,000',
          zone: 'Norte',
          propertyType: 'Estudio',
          summary: 'Joven profesional buscando su primer estudio cerca de su trabajo en zona norte.'
        }
      },
      { 
        id: 'ch10b', 
        type: 'instagram', 
        lastContact: '2024-10-14', 
        messagesCount: 4, 
        conversationId: 'conv10b',
        socialHandle: '@roberto_diaz',
        conversationData: {
          intention: 'consulta',
          summary: 'Pregunta sobre ayudas para jóvenes compradores y requisitos de hipoteca.'
        }
      }
    ],
    tags: ['Primera vivienda', 'Joven'],
    userType: 'buyer'
  },
  {
    id: '9',
    name: 'Elena Rodríguez',
    phone: '+34 690 567 890',
    email: 'elena.r@email.com',
    zone: 'Sur',
    budget: '€380,000',
    propertyType: 'Piso',
    addedDate: '2024-10-06',
    channels: [
      { 
        id: 'ch11', 
        type: 'tiktok', 
        lastContact: '2024-10-15', 
        messagesCount: 18, 
        conversationId: 'conv11',
        socialHandle: '@elena.homes',
        conversationData: {
          intention: 'comprar',
          budget: '€380,000',
          zone: 'Sur',
          propertyType: 'Piso',
          summary: 'Descubrió nuestra cuenta por video viral. Busca piso amplio en zona sur para familia numerosa.'
        }
      },
      { 
        id: 'ch11b', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 11, 
        conversationId: 'conv11b',
        conversationData: {
          intention: 'comprar',
          budget: '€380,000',
          zone: 'Sur',
          propertyType: 'Piso',
          summary: 'Necesita al menos 4 habitaciones, 2 baños y zona comunitaria con jardín para niños.'
        }
      },
      { 
        id: 'ch11c', 
        type: 'messenger', 
        lastContact: '2024-10-12', 
        messagesCount: 7, 
        conversationId: 'conv11c',
        socialHandle: 'Elena Rodríguez',
        conversationData: {
          intention: 'consulta',
          summary: 'Consulta sobre colegios y servicios en la zona sur.'
        }
      }
    ],
    tags: ['Familia', 'TikTok Lead'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTA4Nzk4M3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '10',
    name: 'Miguel Herrera',
    phone: '+34 601 678 901',
    zone: 'Este',
    budget: '€190,000',
    propertyType: 'Apartamento',
    addedDate: '2024-10-14',
    channels: [
      { 
        id: 'ch12', 
        type: 'whatsapp', 
        lastContact: '2024-10-15', 
        messagesCount: 14, 
        conversationId: 'conv12',
        conversationData: {
          intention: 'comprar',
          budget: '€190,000',
          zone: 'Este',
          propertyType: 'Apartamento',
          summary: 'Busca apartamento económico en zona este. Primerizo con presupuesto ajustado.'
        }
      },
      { 
        id: 'ch12b', 
        type: 'tiktok', 
        lastContact: '2024-10-13', 
        messagesCount: 6, 
        conversationId: 'conv12b',
        socialHandle: '@miguel.herrera',
        conversationData: {
          intention: 'consulta',
          summary: 'Vio nuestros tips sobre compra de primera vivienda. Solicita asesoramiento completo.'
        }
      }
    ],
    tags: ['Primera vivienda', 'TikTok Lead'],
    userType: 'buyer'
  },
  {
    id: '11',
    name: 'Carmen Navarro',
    phone: '+34 612 789 012',
    email: 'carmen.n@email.com',
    zone: 'Centro',
    budget: '€450,000',
    propertyType: 'Ático',
    addedDate: '2024-10-04',
    channels: [
      { 
        id: 'ch13', 
        type: 'instagram', 
        lastContact: '2024-10-15', 
        messagesCount: 22, 
        conversationId: 'conv13',
        socialHandle: '@carmen.luxury',
        conversationData: {
          intention: 'comprar',
          budget: '€450,000',
          zone: 'Centro',
          propertyType: 'Ático',
          summary: 'Inversora VIP buscando áticos de lujo en el centro con terraza y vistas panorámicas.'
        }
      },
      { 
        id: 'ch13b', 
        type: 'whatsapp', 
        lastContact: '2024-10-14', 
        messagesCount: 10, 
        conversationId: 'conv13b',
        conversationData: {
          intention: 'comprar',
          budget: '€450,000',
          zone: 'Centro',
          propertyType: 'Ático',
          summary: 'Solicita visitas exclusivas a áticos premium. Disponibilidad inmediata para cerrar trato.'
        }
      },
      { 
        id: 'ch13c', 
        type: 'tiktok', 
        lastContact: '2024-10-11', 
        messagesCount: 8, 
        conversationId: 'conv13c',
        socialHandle: '@carmen.luxury',
        conversationData: {
          intention: 'consulta',
          summary: 'Interesada en nuestro contenido sobre propiedades de lujo. Solicita newsletter VIP.'
        }
      },
      { 
        id: 'ch13d', 
        type: 'messenger', 
        lastContact: '2024-10-09', 
        messagesCount: 5, 
        conversationId: 'conv13d',
        socialHandle: 'Carmen Navarro',
        conversationData: {
          intention: 'consulta',
          summary: 'Pregunta sobre servicios de decoración y reforma incluidos en la venta.'
        }
      }
    ],
    tags: ['VIP', 'Inversor', 'Lujo'],
    userType: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTA4Nzk4M3ww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    leadId: '1',
    type: 'whatsapp',
    messages: [
      { id: 'm1', senderId: 'lead', text: 'Hola! Me gustaría información sobre pisos en el centro de la ciudad', timestamp: '2024-10-14 10:30' },
      { id: 'm2', senderId: 'bot', text: '¡Hola María! Encantado de ayudarte. ¿Qué presupuesto tienes?', timestamp: '2024-10-14 10:31' },
      { id: 'm3', senderId: 'lead', text: 'Alrededor de 250.000€', timestamp: '2024-10-14 10:32' }
    ]
  },
  {
    id: 'conv3',
    leadId: '2',
    type: 'whatsapp',
    messages: [
      { id: 'm7', senderId: 'lead', text: 'Buenas tardes, estoy buscando apartamento en la zona norte', timestamp: '2024-10-13 16:20' },
      { id: 'm8', senderId: 'bot', text: '¡Hola Carlos! Tenemos varias opciones en zona norte. ¿Cuál es tu presupuesto?', timestamp: '2024-10-13 16:21' }
    ]
  },
  {
    id: 'conv5',
    leadId: '3',
    type: 'whatsapp',
    messages: [
      { id: 'm11', senderId: 'lead', text: 'Quiero invertir en un chalet. ¿Tienen algo en la zona sur?', timestamp: '2024-10-14 11:00' },
      { id: 'm12', senderId: 'agent', text: 'Hola Ana, tenemos excelentes opciones de chalets en zona sur. ¿Podemos agendar una llamada?', timestamp: '2024-10-14 11:30' }
    ]
  },
  {
    id: 'conv6',
    leadId: '4',
    type: 'whatsapp',
    messages: [
      { id: 'm13', senderId: 'lead', text: 'Buenos días, necesito vender mi casa en zona este. ¿Me ayudan?', timestamp: '2024-10-15 14:20' },
      { id: 'm14', senderId: 'bot', text: '¡Hola Pedro! Estaré encantado de ayudarte. ¿Cuál es el valor aproximado?', timestamp: '2024-10-15 14:21' }
    ]
  },
  {
    id: 'conv7',
    leadId: '5',
    type: 'whatsapp',
    messages: [
      { id: 'm15', senderId: 'lead', text: 'Hola! Tengo que vender mi piso lo antes posible por trabajo', timestamp: '2024-10-14 09:10' },
      { id: 'm16', senderId: 'bot', text: '¡Hola Laura! Entiendo la urgencia. Vamos a trabajar para encontrar un comprador rápido.', timestamp: '2024-10-14 09:11' }
    ]
  },
  {
    id: 'conv8',
    leadId: '6',
    type: 'whatsapp',
    messages: [
      { id: 'm17', senderId: 'lead', text: '¡Hola! Acabo de ver su TikTok sobre dúplex en el centro. Me interesa mucho', timestamp: '2024-10-15 12:00' },
      { id: 'm18', senderId: 'bot', text: '¡Hola Javier! Me alegra que hayas visto nuestro contenido. ¿Te interesa agendar una visita?', timestamp: '2024-10-15 12:05' },
      { id: 'm19', senderId: 'lead', text: 'Sí, me gustaría ver las opciones disponibles con parking', timestamp: '2024-10-15 12:10' }
    ]
  },
  {
    id: 'conv8b',
    leadId: '6',
    type: 'whatsapp',
    messages: [
      { id: 'm20', senderId: 'lead', text: 'Necesito información sobre opciones de financiamiento', timestamp: '2024-10-14 15:30' },
      { id: 'm21', senderId: 'agent', text: 'Tenemos acuerdos con varios bancos. Te puedo conectar con un asesor financiero.', timestamp: '2024-10-14 15:35' }
    ]
  },
  {
    id: 'conv9',
    leadId: '7',
    type: 'whatsapp',
    messages: [
      { id: 'm22', senderId: 'lead', text: 'Me encantaría encontrar una villa con vistas al mar en la costa', timestamp: '2024-10-15 10:00' },
      { id: 'm23', senderId: 'agent', text: 'Hola Sofía, tenemos varias villas espectaculares. ¿Cuándo podrías visitarlas?', timestamp: '2024-10-15 10:15' },
      { id: 'm24', senderId: 'lead', text: 'Este fin de semana estaría perfecto', timestamp: '2024-10-15 10:20' }
    ]
  },
  {
    id: 'conv9b',
    leadId: '7',
    type: 'whatsapp',
    messages: [
      { id: 'm25', senderId: 'lead', text: '¿Es posible hacer una visita virtual antes de ir en persona?', timestamp: '2024-10-10 14:00' },
      { id: 'm26', senderId: 'bot', text: 'Por supuesto, podemos organizar un tour virtual en 360°', timestamp: '2024-10-10 14:05' }
    ]
  },
  {
    id: 'conv9c',
    leadId: '7',
    type: 'whatsapp',
    messages: [
      { id: 'm27', senderId: 'lead', text: 'Hola! He visto sus propiedades de lujo en Instagram y me parecen increíbles', timestamp: '2024-10-13 11:00' },
      { id: 'm28', senderId: 'bot', text: 'Gracias por seguirnos Sofía. ¿Te interesa alguna propiedad en particular?', timestamp: '2024-10-13 11:10' }
    ]
  },
  {
    id: 'conv10',
    leadId: '8',
    type: 'whatsapp',
    messages: [
      { id: 'm29', senderId: 'lead', text: 'Hola, ando buscando un estudio para mí en zona norte, cerca del trabajo', timestamp: '2024-10-15 16:00' },
      { id: 'm30', senderId: 'bot', text: 'Hola Roberto, tenemos varios estudios en esa zona. ¿Cuál es tu presupuesto?', timestamp: '2024-10-15 16:05' },
      { id: 'm31', senderId: 'lead', text: 'Hasta 220.000€', timestamp: '2024-10-15 16:10' }
    ]
  },
  {
    id: 'conv10b',
    leadId: '8',
    type: 'whatsapp',
    messages: [
      { id: 'm32', senderId: 'lead', text: 'Una pregunta: ¿existen ayudas especiales para jóvenes compradores?', timestamp: '2024-10-14 13:00' },
      { id: 'm33', senderId: 'agent', text: 'Sí Roberto, hay varias ayudas para jóvenes. Te envío información.', timestamp: '2024-10-14 13:10' }
    ]
  },
  {
    id: 'conv11',
    leadId: '9',
    type: 'whatsapp',
    messages: [
      { id: 'm34', senderId: 'lead', text: 'Buenos días! Vi su último video en TikTok sobre casas para familias y me pareció súper útil', timestamp: '2024-10-15 09:00' },
      { id: 'm35', senderId: 'bot', text: 'Hola Elena, me alegra que te haya gustado. ¿Cuántas habitaciones necesitas?', timestamp: '2024-10-15 09:10' },
      { id: 'm36', senderId: 'lead', text: 'Al menos 4 habitaciones y jardín para los niños', timestamp: '2024-10-15 09:15' }
    ]
  },
  {
    id: 'conv11b',
    leadId: '9',
    type: 'whatsapp',
    messages: [
      { id: 'm37', senderId: 'lead', text: 'Consulta: ¿las propiedades tienen parque infantil o áreas para niños?', timestamp: '2024-10-14 11:00' },
      { id: 'm38', senderId: 'agent', text: 'Sí Elena, varias de nuestras propiedades tienen parque infantil y piscina.', timestamp: '2024-10-14 11:15' }
    ]
  },
  {
    id: 'conv11c',
    leadId: '9',
    type: 'whatsapp',
    messages: [
      { id: 'm39', senderId: 'lead', text: '¿Me podrían informar sobre colegios y servicios educativos en la zona sur?', timestamp: '2024-10-12 10:00' },
      { id: 'm40', senderId: 'bot', text: 'Te envío un listado de colegios en la zona sur.', timestamp: '2024-10-12 10:05' }
    ]
  },
  {
    id: 'conv12',
    leadId: '10',
    type: 'whatsapp',
    messages: [
      { id: 'm41', senderId: 'lead', text: 'Hola! Busco apartamento económico en zona este. ¿Qué tienen disponible?', timestamp: '2024-10-15 14:30' },
      { id: 'm42', senderId: 'bot', text: 'Hola Miguel, tenemos opciones desde 190.000€. ¿Te interesa?', timestamp: '2024-10-15 14:35' },
      { id: 'm43', senderId: 'lead', text: 'Sí, por favor envíeme detalles', timestamp: '2024-10-15 14:40' }
    ]
  },
  {
    id: 'conv12b',
    leadId: '10',
    type: 'whatsapp',
    messages: [
      { id: 'm44', senderId: 'lead', text: 'Me encantaron sus consejos en TikTok sobre comprar tu primera casa', timestamp: '2024-10-13 17:00' },
      { id: 'm45', senderId: 'bot', text: 'Genial Miguel, ¿necesitas asesoramiento completo?', timestamp: '2024-10-13 17:10' }
    ]
  },
  {
    id: 'conv13',
    leadId: '11',
    type: 'whatsapp',
    messages: [
      { id: 'm46', senderId: 'lead', text: 'Estoy buscando áticos exclusivos en el centro con terraza y vistas panorámicas', timestamp: '2024-10-15 11:00' },
      { id: 'm47', senderId: 'agent', text: 'Hola Carmen, tenemos áticos exclusivos con terraza. ¿Cuándo podemos agendar visita VIP?', timestamp: '2024-10-15 11:10' },
      { id: 'm48', senderId: 'lead', text: 'Esta semana tengo disponibilidad', timestamp: '2024-10-15 11:20' }
    ]
  },
  {
    id: 'conv13b',
    leadId: '11',
    type: 'whatsapp',
    messages: [
      { id: 'm49', senderId: 'lead', text: 'Hola! Quisiera conocer las propiedades premium de su catálogo', timestamp: '2024-10-14 15:00' },
      { id: 'm50', senderId: 'agent', text: 'Por supuesto Carmen, te envío nuestro catálogo exclusivo.', timestamp: '2024-10-14 15:15' }
    ]
  },
  {
    id: 'conv13c',
    leadId: '11',
    type: 'whatsapp',
    messages: [
      { id: 'm51', senderId: 'lead', text: '¡Qué buen contenido tienen en TikTok! Me encanta el estilo de sus propiedades de lujo', timestamp: '2024-10-11 13:00' },
      { id: 'm52', senderId: 'bot', text: 'Gracias Carmen, ¿te gustaría recibir nuestro newsletter VIP?', timestamp: '2024-10-11 13:10' }
    ]
  },
  {
    id: 'conv13d',
    leadId: '11',
    type: 'whatsapp',
    messages: [
      { id: 'm53', senderId: 'lead', text: 'Tengo una pregunta: ¿trabajan con decoradores de interiores?', timestamp: '2024-10-09 10:00' },
      { id: 'm54', senderId: 'agent', text: 'Sí, tenemos alianzas con decoradores de alto nivel.', timestamp: '2024-10-09 10:15' }
    ]
  }
];

interface ContactsPageProps {
  // No props needed
}

export function ContactsPage({}: ContactsPageProps = {}) {
  const isMobile = useIsMobile();
  console.log('ContactsPage renderizado');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [channelDetailsOpen, setChannelDetailsOpen] = useState(false);
  const [mobileContactDetailsOpen, setMobileContactDetailsOpen] = useState(false);
  const [conversationSheetOpen, setConversationSheetOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContactData, setEditedContactData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [defaultTags, setDefaultTags] = useState<string[]>(['Referido', 'Alto presupuesto', 'Urgente', 'Inversión', 'Primera vivienda']);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNewTagDialog, setShowNewTagDialog] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [avatarViewImage, setAvatarViewImage] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showSyncResultDialog, setShowSyncResultDialog] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    newContacts: number;
    updatedContacts: number;
  } | null>(null);
  const [isContactsConnected, setIsContactsConnected] = useState(false); // Cambiado a false por defecto
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'apple'>('google');
  
  // Estados para dialogs de conexión
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [showICloudDialog, setShowICloudDialog] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [iCloudEmail, setICloudEmail] = useState('');
  const [iCloudPassword, setICloudPassword] = useState('');
  const [googleContactsStep, setGoogleContactsStep] = useState<'input' | 'loading' | 'summary'>('input');
  const [iCloudContactsStep, setICloudContactsStep] = useState<'input' | 'loading' | 'summary'>('input');
  const [googleContactsFound, setGoogleContactsFound] = useState(0);
  const [iCloudContactsFound, setICloudContactsFound] = useState(0);
  const [googleShowAllContacts, setGoogleShowAllContacts] = useState(false);
  const [iCloudShowAllContacts, setICloudShowAllContacts] = useState(false);
  
  const [disabledBotLeads, setDisabledBotLeads] = useState<Set<string>>(new Set());

  // Cargar disabledBotLeads desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('disabledBotLeads');
      if (stored) {
        try {
          setDisabledBotLeads(new Set(JSON.parse(stored)));
        } catch (e) {
          console.error('Error parsing disabledBotLeads', e);
        }
      }
    }
  }, []);

  const toggleBotStatus = (contactId: string) => {
    setDisabledBotLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
        toast.success('Bot activado para este contacto');
      } else {
        newSet.add(contactId);
        toast.success('Bot desactivado para este contacto');
      }
      localStorage.setItem('disabledBotLeads', JSON.stringify([...newSet]));
      return newSet;
    });
  };
  
  const ITEMS_PER_PAGE = 20;

  // Cargar contactos guardados desde localStorage al montar el componente
  useEffect(() => {
    const loadContacts = () => {
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      // Combinar contactos guardados con contactos mock
      const allContacts = [...savedContacts, ...mockContacts];
      // Eliminar duplicados por teléfono
      const uniqueContacts = allContacts.reduce((acc: Contact[], contact) => {
        if (!acc.find(c => c.phone === contact.phone)) {
          acc.push(contact);
        }
        return acc;
      }, []);
      setContacts(uniqueContacts);
    };

    loadContacts();

    // Escuchar cambios en localStorage (para actualizar en tiempo real)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedContacts') {
        loadContacts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // También escuchar un evento personalizado para cambios dentro de la misma pestaña
    const handleCustomEvent = () => {
      loadContacts();
    };

    window.addEventListener('contactsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactsUpdated', handleCustomEvent);
    };
  }, []);

  // Contador de contactos removido completamente

  // Función para truncar nombres en listados
  const truncateName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Configuración de columnas
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>([
    { id: 'contact', label: 'Contacto', visible: true, width: 'w-[250px]', required: true },
    { id: 'phone', label: 'Teléfono', visible: true, width: 'w-[150px]' },
    { id: 'channels', label: 'Conversaciones', visible: true, width: 'w-[150px]' },
    { id: 'actions', label: 'Acciones', visible: true, width: 'w-[150px]', required: true },
  ]);

  // Filtrado y ordenamiento
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      
      // Buscar en etiquetas
      const matchesTags = contact.tags?.some(tag => 
        tag.toLowerCase().includes(searchLower)
      );
      
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.phone.toLowerCase().includes(searchLower) ||
        contact.zone.toLowerCase().includes(searchLower) ||
        matchesTags
      );
    }).sort((a, b) => {
      // Ordenar alfabéticamente por nombre (ignorando mayúsculas/minúsculas)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }, [contacts, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  const visibleColumns = tableColumns.filter(col => col.visible);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContactIds(paginatedContacts.map(c => c.id));
    } else {
      setSelectedContactIds([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContactIds([...selectedContactIds, contactId]);
    } else {
      setSelectedContactIds(selectedContactIds.filter(id => id !== contactId));
    }
  };

  const handleOpenChannelHistory = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditingContact(false);
    
    // Inicializar etiquetas desde el contacto
    const contactTags = contact.tags || [];
    setSelectedTags(contactTags);
    
    setEditedContactData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      notes: contact.notes || ''
    });
    if (isMobile) {
      setMobileContactDetailsOpen(true);
    } else {
      setChannelDetailsOpen(true);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditingContact(true);
    
    // Inicializar etiquetas desde el contacto
    const contactTags = contact.tags || [];
    setSelectedTags(contactTags);
    
    setEditedContactData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      notes: contact.notes || ''
    });
    if (isMobile) {
      setMobileContactDetailsOpen(true);
    } else {
      setChannelDetailsOpen(true);
    }
  };

  const handleSaveContact = () => {
    if (!selectedContact) return;
    
    // Actualizar el contacto en el estado
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, name: editedContactData.name, phone: editedContactData.phone, email: editedContactData.email, notes: editedContactData.notes, tags: selectedTags }
          : c
      )
    );
    
    // Actualizar selectedContact
    setSelectedContact({
      ...selectedContact,
      name: editedContactData.name,
      phone: editedContactData.phone,
      email: editedContactData.email,
      notes: editedContactData.notes,
      tags: selectedTags
    });
    
    // Actualizar localStorage si el contacto estaba guardado
    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
    const updatedSavedContacts = savedContacts.map((c: Contact) => 
      c.id === selectedContact.id 
        ? { ...c, name: editedContactData.name, phone: editedContactData.phone, email: editedContactData.email, notes: editedContactData.notes, tags: selectedTags }
        : c
    );
    localStorage.setItem('savedContacts', JSON.stringify(updatedSavedContacts));
    window.dispatchEvent(new Event('contactsUpdated'));
    
    setIsEditingContact(false);
  };

  const handleUpdateContacts = () => {
    setIsUpdating(true);
    // Simular sincronización con Google Contacts o Apple Contacts
    setTimeout(() => {
      setIsUpdating(false);
      setLastUpdate(new Date());
      
      // Generar resultados aleatorios de sincronización
      const result = {
        newContacts: Math.floor(Math.random() * 10) + 1,
        updatedContacts: Math.floor(Math.random() * 15) + 5
      };
      
      setSyncResult(result);
      setShowSyncResultDialog(true);
      // NO incrementar el contador aquí porque el usuario está dentro de la página y actualizó manualmente
    }, 2000);
  };

  // Handlers para Google Contacts
  const handleConnectGoogle = () => {
    if (!googleEmail || !googleEmail.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }
    
    setGoogleContactsStep('loading');
    
    setTimeout(() => {
      const randomContacts = Math.floor(Math.random() * 200) + 50;
      setGoogleContactsFound(randomContacts);
      setGoogleContactsStep('summary');
    }, 2500);
  };

  const handleConfirmGoogleConnection = () => {
    setIsContactsConnected(true);
    setSelectedProvider('google');
    setShowGoogleDialog(false);
    setGoogleContactsStep('input');
    setGoogleShowAllContacts(false);
    setLastUpdate(new Date());
  };

  // Handlers para iCloud Contacts
  const handleConnectICloud = () => {
    if (!iCloudEmail || !iCloudEmail.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }
    if (!iCloudPassword) {
      toast.error('Por favor ingresa tu contraseña de aplicación');
      return;
    }
    
    setICloudContactsStep('loading');
    
    setTimeout(() => {
      const randomContacts = Math.floor(Math.random() * 200) + 50;
      setICloudContactsFound(randomContacts);
      setICloudContactsStep('summary');
    }, 2500);
  };

  const handleConfirmICloudConnection = () => {
    setIsContactsConnected(true);
    setSelectedProvider('apple');
    setShowICloudDialog(false);
    setICloudContactsStep('input');
    setICloudShowAllContacts(false);
    setLastUpdate(new Date());
  };

  const getTimeSinceSync = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `hace ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const getConversationSummary = (channel: ContactChannel): string => {
    // Buscar en las conversaciones guardadas/mock
    const savedConversations = JSON.parse(localStorage.getItem('savedConversations') || '[]');
    let conversation = savedConversations.find((c: any) => c.id === channel.conversationId);
    
    if (!conversation) {
      conversation = mockConversations.find(c => c.id === channel.conversationId);
    }
    
    if (!conversation || !conversation.messages || conversation.messages.length === 0) {
      // Si no hay mensajes, usar el resumen de conversationData como fallback
      return channel.conversationData?.summary || 'Sin mensajes';
    }
    
    // Obtener la fecha del canal (lastContact)
    const channelDate = new Date(channel.lastContact);
    const channelDateStr = channelDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Filtrar mensajes de ese día
    const messagesOfTheDay = conversation.messages.filter((m: Message) => {
      const msgDate = new Date(m.timestamp);
      const msgDateStr = msgDate.toISOString().split('T')[0];
      return msgDateStr === channelDateStr;
    });
    
    // Retornar el primer mensaje de ese día
    if (messagesOfTheDay.length > 0) {
      return messagesOfTheDay[0].text;
    }
    
    // Si no hay mensajes de ese día, retornar el primer mensaje de la conversación
    return conversation.messages[0].text;
  };

  const getChannelDisplayName = (channel: ContactChannel): string => {
    const channelNames: Record<string, string> = {
      'whatsapp': 'WhatsApp',
      'instagram': 'Instagram',
      'messenger': 'Facebook Messenger',
      'tiktok': 'TikTok'
    };
    
    const baseName = channelNames[channel.type] || channel.type;
    
    if (channel.socialHandle) {
      return `${baseName} - ${channel.socialHandle}`;
    }
    
    return baseName;
  };

  const handleBulkDelete = () => {
    if (confirm(`¿Estás seguro de eliminar ${selectedContactIds.length} contacto(s)?`)) {
      setContacts(prevContacts => prevContacts.filter(c => !selectedContactIds.includes(c.id)));
      setSelectedContactIds([]);
    }
  };

  const handleBulkExport = () => {
    const selectedContacts = contacts.filter(c => selectedContactIds.includes(c.id));
    const csvContent = [
      ['Nombre', 'Teléfono', 'Zona', 'Presupuesto', 'Tipo de Propiedad', 'Fecha Agregado', 'Mensajes WhatsApp'],
      ...selectedContacts.map(c => [
        c.name,
        c.phone,
        c.zone,
        c.budget || '',
        c.propertyType,
        c.addedDate,
        c.channels[0]?.messagesCount || '0'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contactos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getChannelIcon = (type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok', isTimeline?: boolean) => {
    const colorClass = isTimeline ? 'text-white' : 
      type === 'whatsapp' ? 'text-green-600' :
      type === 'instagram' ? 'text-pink-600' : 
      type === 'messenger' ? 'text-blue-600' : 'text-gray-900';
    
    const sizeClass = isTimeline ? 'h-6 w-6' : 'h-3.5 w-3.5';
    
    switch (type) {
      case 'whatsapp':
        return <WhatsAppIcon className={`${sizeClass} ${colorClass}`} />;
      case 'instagram':
        return <Instagram className={`${sizeClass} ${colorClass}`} />;
      case 'messenger':
        return <MessengerIcon className={`${sizeClass} ${colorClass}`} />;
      case 'tiktok':
        return <TikTokIcon className={`${sizeClass} ${colorClass}`} />;
    }
  };

  const renderCellContent = (contact: Contact, columnId: string) => {
    switch (columnId) {
      case 'contact':
        return (
          <div className="flex items-center gap-3">
            <div 
              className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                if (contact.avatarUrl) {
                  setAvatarViewImage(contact.avatarUrl);
                  setAvatarViewOpen(true);
                }
              }}
            >
              <Avatar className="h-9 w-9 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={contact.name} />}
                <AvatarFallback className="bg-transparent text-primary">
                  {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div 
              onClick={() => handleOpenChannelHistory(contact)}
              className="min-w-0 flex-1 cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-900">
                  {truncateName(contact.name)}
                </span>
                {disabledBotLeads.has(contact.id) && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-gray-100 text-gray-600 border-gray-300">
                    <BotOff className="h-2.5 w-2.5 mr-0.5" />
                    Bot desactivado
                  </Badge>
                )}
              </div>

            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-gray-400" />
            <a 
              href={`tel:${contact.phone}`}
              className="text-sm text-gray-700 hover:text-primary hover:underline cursor-pointer transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {contact.phone}
            </a>
          </div>
        );
      case 'channels':
        return (
          <div className="flex items-center gap-1">
            {contact.channels?.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-primary/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContact(contact);
                  setSelectedChannel(channel);
                  setSelectedConversationId(channel.conversationId);
                  setConversationSheetOpen(true);
                }}
              >
                {getChannelIcon(channel.type)}
              </div>
            ))}
          </div>
        );
      case 'actions':
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar contacto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleBotStatus(contact.id)}>
                  <BotOff className="h-4 w-4 mr-2" />
                  {disabledBotLeads.has(contact.id) ? 'Activar bot' : 'Desactivar bot'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Send className="h-4 w-4 mr-2" />
                  Mandar al CRM
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return null;
    }
  };

  const allSelected = paginatedContacts.length > 0 && selectedContactIds.length === paginatedContacts.length;
  const someSelected = selectedContactIds.length > 0 && selectedContactIds.length < paginatedContacts.length;

  const getUserTypeLabel = (userType: 'buyer' | 'seller') => {
    return userType === 'buyer' ? 'Comprador' : 'Vendedor';
  };

  const getUserTypeIcon = (userType: 'buyer' | 'seller') => {
    return userType === 'buyer' ? <ShoppingCart className="h-4 w-4" /> : <Home className="h-4 w-4" />;
  };

  const getUserTypeBadgeColor = (userType: 'buyer' | 'seller') => {
    return userType === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

  // Vista móvil
  if (isMobile) {
    // Vista de lista de contactos en móvil
    return (
      <>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="mb-3">
              <h1 className="text-xl text-gray-900">Mis Contactos</h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus contactos desde un solo lugar
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, teléfono o etiquetas..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-2 border-gray-300 bg-white focus:border-primary w-full"
              />
            </div>

            {/* Barra de información y actualización - Mobile */}
            <div className="flex flex-col gap-3 py-3 px-3 bg-white rounded-lg border border-gray-200 shadow-sm mt-3">
              {isContactsConnected ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-900">
                      {filteredContacts.length} {filteredContacts.length === 1 ? 'contacto' : 'contactos'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 whitespace-nowrap">
                      {selectedProvider === 'google' ? 'Google Contacts' : 'Apple Contacts'}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-900">
                      {filteredContacts.length} {filteredContacts.length === 1 ? 'contacto' : 'contactos'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Botón Google clickeado - estado ANTES:', showGoogleDialog);
                        setShowGoogleDialog((prev) => {
                          console.log('Actualizando estado de', prev, 'a true');
                          return true;
                        });
                      }}
                      variant="outline"
                      className="border-gray-300 hover:border-primary hover:bg-primary/5 justify-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Conectar Google
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Botón iCloud clickeado', showICloudDialog);
                        setShowICloudDialog(true);
                      }}
                      variant="outline"
                      className="border-gray-300 hover:border-primary hover:bg-primary/5 justify-center"
                    >
                      <Cloud className="h-4 w-4 mr-2" />
                      Conectar iCloud
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lista de contactos */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-200 pb-32">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer ${
                  selectedContact?.id === contact.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div 
                    className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (contact.avatarUrl) {
                        setAvatarViewImage(contact.avatarUrl);
                        setAvatarViewOpen(true);
                      }
                    }}
                  >
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                      {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={contact.name} />}
                      <AvatarFallback className="bg-transparent text-primary">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div 
                    className="flex-1 min-w-0 overflow-hidden max-w-[calc(100%-120px)]"
                    onClick={() => handleOpenChannelHistory(contact)}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm text-gray-900 truncate max-w-[150px]">
                        {contact.name.length > 18 ? contact.name.substring(0, 18) + '...' : contact.name}
                      </p>
                      {disabledBotLeads.has(contact.id) && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-gray-100 text-gray-600 border-gray-300 shrink-0">
                          <BotOff className="h-2.5 w-2.5 mr-0.5" />
                          Bot desactivado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 overflow-x-auto">
                      {contact.channels.map((channel) => (
                        <div
                          key={channel.id}
                          className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                            setSelectedChannel(channel);
                            setSelectedConversationId(channel.conversationId);
                            setConversationSheetOpen(true);
                            setMobileContactDetailsOpen(false);
                          }}
                        >
                          {getChannelIcon(channel.type)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${contact.phone}`, '_self');
                      }}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 flex-shrink-0 mr-1"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          toggleBotStatus(contact.id);
                        }}>
                          <BotOff className="h-4 w-4 mr-2" />
                          {disabledBotLeads.has(contact.id) ? 'Activar bot' : 'Desactivar bot'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Send className="h-4 w-4 mr-2" />
                          Mandar al CRM
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 text-center">
                No se encontraron contactos
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Sheet de detalles del contacto en móvil */}
        <Sheet open={mobileContactDetailsOpen} onOpenChange={(open) => {
          setMobileContactDetailsOpen(open);
          if (!open) setIsEditingContact(false);
        }}>
          <SheetContent side="right" className="w-full p-0">
            <div className="flex flex-col h-full">
              {/* Header - Fijo arriba */}
              <SheetHeader className="border-b border-gray-200 px-4 py-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMobileContactDetailsOpen(false);
                      setIsEditingContact(false);
                    }}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div 
                    className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedContact?.avatarUrl) {
                        setAvatarViewImage(selectedContact.avatarUrl);
                        setAvatarViewOpen(true);
                      }
                    }}
                  >
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                      {selectedContact?.avatarUrl && <AvatarImage src={selectedContact.avatarUrl} alt={selectedContact.name} />}
                      <AvatarFallback className="bg-transparent text-primary">
                        {selectedContact?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SheetTitle className="text-base">{selectedContact?.name}</SheetTitle>
                        {selectedContact && disabledBotLeads.has(selectedContact.id) && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-gray-100 text-gray-600 border-gray-300">
                            <BotOff className="h-2.5 w-2.5 mr-0.5" />
                            Bot desactivado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{selectedContact?.phone}</p>
                    </div>
                  </div>
                  {!isEditingContact && selectedContact && (
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
                        <DropdownMenuItem onClick={() => setIsEditingContact(true)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar contacto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          if (selectedContact) toggleBotStatus(selectedContact.id);
                        }}>
                          <BotOff className="h-4 w-4 mr-2" />
                          {selectedContact && disabledBotLeads.has(selectedContact.id) ? 'Activar bot' : 'Desactivar bot'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Mandar al CRM
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <SheetDescription className="sr-only">
                  Detalles del contacto {selectedContact?.name}
                </SheetDescription>
              </SheetHeader>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-4 py-4 space-y-6">
                    {/* Datos del contacto */}
                    <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Información del Contacto</h3>
                      {!isEditingContact ? (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                          {/* Nombre */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Nombre completo</p>
                            <p className="text-sm text-gray-900">{selectedContact?.name || 'Sin nombre'}</p>
                          </div>

                          {/* Teléfono */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                            <a 
                              href={selectedContact?.phone ? `tel:${selectedContact.phone}` : undefined}
                              className="text-sm text-gray-900 flex items-center gap-2 hover:text-[#e7af2a] transition-colors cursor-pointer"
                            >
                              <Phone className="h-4 w-4" />
                              {selectedContact?.phone || 'Sin teléfono'}
                            </a>
                          </div>

                          {/* Email */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Correo electrónico</p>
                            <p className="text-sm text-gray-900">{selectedContact?.email || 'Sin correo electrónico'}</p>
                          </div>

                          {/* Notas */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Notas</p>
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact?.notes || 'Sin notas'}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                          {/* Nombre */}
                          <div className="space-y-2">
                            <Label htmlFor="contact-name-mobile" className="text-xs text-gray-600">Nombre completo</Label>
                            <Input
                              id="contact-name-mobile"
                              value={editedContactData.name}
                              onChange={(e) => setEditedContactData({ ...editedContactData, name: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          {/* Teléfono */}
                          <div className="space-y-2">
                            <Label htmlFor="contact-phone-mobile" className="text-xs text-gray-600">Teléfono</Label>
                            <Input
                              id="contact-phone-mobile"
                              value={editedContactData.phone}
                              onChange={(e) => setEditedContactData({ ...editedContactData, phone: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="contact-email-mobile" className="text-xs text-gray-600">Correo electrónico</Label>
                            <Input
                              id="contact-email-mobile"
                              type="email"
                              value={editedContactData.email}
                              onChange={(e) => setEditedContactData({ ...editedContactData, email: e.target.value })}
                              className="bg-white"
                            />
                          </div>

                          {/* Notas */}
                          <div className="space-y-2">
                            <Label htmlFor="contact-notes-mobile" className="text-xs text-gray-600">Notas</Label>
                            <Textarea
                              id="contact-notes-mobile"
                              value={editedContactData.notes}
                              onChange={(e) => setEditedContactData({ ...editedContactData, notes: e.target.value })}
                              placeholder="Escribe notas sobre este contacto..."
                              className="bg-white min-h-[80px] resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Historial de conversaciones */}
                    <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Historial de Conversaciones</h3>
                      <div className="relative">
                        {selectedContact?.channels
                          .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
                          .map((channel, index) => {
                            const summary = getConversationSummary(channel);
                            const data = channel.conversationData;
                            const isLast = index === (selectedContact?.channels.length ?? 0) - 1;
                            
                            // Determinar color del canal
                            const getChannelColor = (type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok') => {
                              switch (type) {
                                case 'whatsapp':
                                  return { bg: 'bg-green-500', ring: 'ring-green-100' };
                                case 'instagram':
                                  return { bg: 'bg-pink-500', ring: 'ring-pink-100' };
                                case 'messenger':
                                  return { bg: 'bg-blue-500', ring: 'ring-blue-100' };
                                case 'tiktok':
                                  return { bg: 'bg-gray-900', ring: 'ring-gray-200' };
                                default:
                                  return { bg: 'bg-gray-500', ring: 'ring-gray-100' };
                              }
                            };
                            
                            const channelColor = getChannelColor(channel.type);
                            
                            return (
                              <div key={channel.id} className="relative flex gap-4 pb-8">
                                {/* Timeline - Círculo e iconos */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                  {/* Círculo con icono */}
                                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${channelColor.bg} ring-[3px] ${channelColor.ring} shadow-md relative z-10 transition-transform active:scale-95`}>
                                    {getChannelIcon(channel.type, true)}
                                  </div>
                                  
                                  {/* Línea vertical conectora */}
                                  {!isLast && (
                                    <div className="w-[2px] bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 flex-1 absolute top-12 bottom-0 left-[1.375rem]" />
                                  )}
                                </div>

                                {/* Contenido de la conversación */}
                                <div className="flex-1 -mt-1">
                                  {/* Fecha */}
                                  <div className="text-xs text-gray-500 mb-2">
                                    {formatDate(channel.lastContact)}
                                  </div>
                                  
                                  {/* Card con información */}
                                  <div className="bg-white rounded-lg border border-gray-200 p-3.5">
                                    {/* Nombre del canal */}
                                    <div className="text-sm text-gray-900 mb-2">
                                      {getChannelDisplayName(channel)}
                                    </div>

                                    {/* Datos relevantes */}
                                    {data && (data.intention || data.budget || data.zone || data.propertyType) && (
                                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                                        {data.intention && (
                                          <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                            {data.intention === 'comprar' ? (
                                              <>
                                                <ShoppingCart className="h-3 w-3" />
                                                Comprar
                                              </>
                                            ) : data.intention === 'vender' ? (
                                              <>
                                                <Home className="h-3 w-3" />
                                                Vender
                                              </>
                                            ) : (
                                              <>
                                                <MessageSquare className="h-3 w-3" />
                                                Consulta
                                              </>
                                            )}
                                          </Badge>
                                        )}
                                        {data.propertyType && (
                                          <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                            <Home className="h-3 w-3" />
                                            {data.propertyType}
                                          </Badge>
                                        )}
                                        {data.zone && (
                                          <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {data.zone}
                                          </Badge>
                                        )}
                                        {data.budget && (
                                          <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {data.budget}
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    {/* Resumen */}
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
                                      {summary}
                                    </p>

                                    {/* Botón ver conversación */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full h-7 text-xs text-primary hover:text-primary hover:bg-primary/5 -mx-1"
                                      onClick={() => {
                                        setSelectedChannel(channel);
                                        setSelectedConversationId(channel.conversationId);
                                        setConversationSheetOpen(true);
                                      }}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                      Ver conversación
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Botón de guardar - Solo visible en modo edición */}
              {isEditingContact && (
                <div className="border-t border-gray-200 px-4 py-4 flex-shrink-0 bg-white">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingContact(false);
                        setEditedContactData({
                          name: selectedContact?.name || '',
                          phone: selectedContact?.phone || '',
                          email: selectedContact?.email || '',
                          notes: ''
                        });
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveContact}
                      className="flex-1 gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Sheet de Conversación */}
        <ConversationSheet 
          open={conversationSheetOpen}
          onOpenChange={setConversationSheetOpen}
          conversationId={selectedConversationId}
          contact={selectedContact}
          channel={selectedChannel}
        />
        
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

        {/* Diálogo de resultados de sincronización */}
        <Dialog open={showSyncResultDialog} onOpenChange={setShowSyncResultDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Sincronización completada
              </DialogTitle>
              <DialogDescription>
                Tus contactos se han actualizado correctamente desde Google Contacts
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{syncResult?.newContacts} contactos nuevos</p>
                  <p className="text-xs text-gray-600">Añadidos desde Google Contacts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileEdit className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{syncResult?.updatedContacts} contactos actualizados</p>
                  <p className="text-xs text-gray-600">Información modificada</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LinkIcon className="h-4 w-4" />
                <span>Conectado con Google</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{getTimeSinceSync()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-2">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600">
                La sincronización automática se realiza diariamente. Puedes sincronizar manualmente cuando lo necesites.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialogs compartidos entre móvil y desktop */}
      {renderSharedDialogs()}
      </>
    );
  }

  // Vista de escritorio
  return (
    <>
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl text-gray-900">Mis Contactos</h1>
        <p className="text-gray-600">
          Gestiona tus contactos desde un solo lugar
        </p>
      </div>

      {/* Búsqueda - Responsive */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, teléfono o etiquetas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 border-2 border-gray-300 bg-white focus:border-primary w-full"
        />
      </div>

      {/* Barra de acciones masivas */}
      {selectedContactIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
                {selectedContactIds.length}
              </div>
              <p className="text-sm text-gray-700">
                {selectedContactIds.length > 1 ? 'contactos seleccionados' : 'contacto seleccionado'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-white flex-1 sm:flex-initial"
                onClick={handleBulkExport}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-white flex-1 sm:flex-initial"
                onClick={() => {
                  setDisabledBotLeads(prev => {
                    const newSet = new Set(prev);
                    selectedContactIds.forEach(id => newSet.add(id));
                    localStorage.setItem('disabledBotLeads', JSON.stringify([...newSet]));
                    return newSet;
                  });
                  toast.success(`Bot desactivado para ${selectedContactIds.length} ${selectedContactIds.length === 1 ? 'contacto' : 'contactos'}`);
                }}
              >
                <BotOff className="h-3.5 w-3.5" />
                <span>Desactivar bot</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedContactIds([])}
                className="h-8"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Información de sincronización - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-3 sm:px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-900">
            {filteredContacts.length} {filteredContacts.length === 1 ? 'contacto' : 'contactos'}
          </span>
        </div>
        
        {isContactsConnected ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              <span className="hidden lg:inline">
                Última actualización: {lastUpdate.toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })} a las {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="lg:hidden">
                {lastUpdate.toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit'
                })} {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">
                  {selectedProvider === 'google' ? 'Google Contacts' : 'Apple Contacts'}
                </span>
              </div>

              <Button
                size="sm"
                onClick={handleUpdateContacts}
                disabled={isUpdating}
                variant="outline"
                className="h-8 px-3 border-gray-300"
              >
                <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={() => setShowGoogleDialog(true)}
              variant="outline"
              className="border-gray-300 hover:border-primary hover:bg-primary/5 justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Conectar Google
            </Button>
            <Button
              size="sm"
              onClick={() => setShowICloudDialog(true)}
              variant="outline"
              className="border-gray-300 hover:border-primary hover:bg-primary/5 justify-center"
            >
              <Cloud className="h-4 w-4 mr-2" />
              Conectar iCloud
            </Button>
          </div>
        )}
      </div>

      {/* Tabla de contactos */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                    />
                  </TableHead>
                  {visibleColumns.map(column => (
                    <TableHead 
                      key={column.id} 
                      className={`${column.width} ${
                        column.id === 'conversations' ? 'hidden lg:table-cell' :
                        column.id === 'actions' ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContacts.map((contact) => (
                  <TableRow 
                    key={contact.id} 
                    className={`hover:bg-primary/5 transition-colors border-b border-gray-100 ${
                      selectedContactIds.includes(contact.id) ? 'bg-primary/10' : 
                      selectedContact?.id === contact.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedContactIds.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      />
                    </TableCell>
                    {visibleColumns.map(column => (
                      <TableCell 
                        key={column.id}
                        onClick={column.id === 'name' ? () => handleOpenChannelHistory(contact) : undefined}
                        className={`${column.id === 'name' ? 'cursor-pointer hover:bg-gray-50' : ''} ${
                          column.id === 'conversations' ? 'hidden lg:table-cell' :
                          column.id === 'actions' ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {renderCellContent(contact, column.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sheet lateral con vista completa del contacto */}
      <Sheet open={channelDetailsOpen} onOpenChange={(open) => {
        setChannelDetailsOpen(open);
        if (!open) setIsEditingContact(false);
      }}>
        <SheetContent className="w-full sm:max-w-[500px] p-0">
          <div className="flex flex-col h-full">
            {/* Header - Fijo arriba */}
            <SheetHeader className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Botón Atrás */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setChannelDetailsOpen(false);
                    setIsEditingContact(false);
                  }}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div 
                  className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedContact?.avatarUrl) {
                      setAvatarViewImage(selectedContact.avatarUrl);
                      setAvatarViewOpen(true);
                    }
                  }}
                >
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    {selectedContact?.avatarUrl && <AvatarImage src={selectedContact.avatarUrl} alt={selectedContact.name} />}
                    <AvatarFallback className="bg-transparent text-primary">
                      {selectedContact?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SheetTitle className="text-base">{selectedContact?.name}</SheetTitle>
                      {selectedContact && disabledBotLeads.has(selectedContact.id) && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-gray-100 text-gray-600 border-gray-300">
                          <BotOff className="h-2.5 w-2.5 mr-0.5" />
                          Bot desactivado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{selectedContact?.phone}</p>
                  </div>
                </div>
                {!isEditingContact && selectedContact && (
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
                      <DropdownMenuItem onClick={() => setIsEditingContact(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar contacto
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        if (selectedContact) toggleBotStatus(selectedContact.id);
                      }}>
                        <BotOff className="h-4 w-4 mr-2" />
                        {selectedContact && disabledBotLeads.has(selectedContact.id) ? 'Activar bot' : 'Desactivar bot'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Mandar al CRM
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <SheetDescription className="sr-only">
                Detalles del contacto {selectedContact?.name}
              </SheetDescription>
            </SheetHeader>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="px-6 py-4 space-y-6">
                  {/* Datos del contacto */}
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Información del Contacto</h3>
                    {!isEditingContact ? (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Nombre */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nombre completo</p>
                          <p className="text-sm text-gray-900">{selectedContact?.name || 'Sin nombre'}</p>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                          <a 
                            href={selectedContact?.phone ? `tel:${selectedContact.phone}` : undefined}
                            className="text-sm text-gray-900 flex items-center gap-2 hover:text-[#e7af2a] transition-colors cursor-pointer"
                          >
                            <Phone className="h-4 w-4" />
                            {selectedContact?.phone || 'Sin teléfono'}
                          </a>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Correo electrónico</p>
                          <p className="text-sm text-gray-900">{selectedContact?.email || 'Sin correo electrónico'}</p>
                        </div>

                        {/* Notas */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Notas</p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact?.notes || 'Sin notas'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                          <Label htmlFor="contact-name" className="text-xs text-gray-600">Nombre completo</Label>
                          <Input
                            id="contact-name"
                            value={editedContactData.name}
                            onChange={(e) => setEditedContactData({ ...editedContactData, name: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone" className="text-xs text-gray-600">Teléfono</Label>
                          <Input
                            id="contact-phone"
                            value={editedContactData.phone}
                            onChange={(e) => setEditedContactData({ ...editedContactData, phone: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="contact-email" className="text-xs text-gray-600">Correo electrónico</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={editedContactData.email}
                            onChange={(e) => setEditedContactData({ ...editedContactData, email: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                          <Label htmlFor="contact-notes" className="text-xs text-gray-600">Notas</Label>
                          <Textarea
                            id="contact-notes"
                            value={editedContactData.notes}
                            onChange={(e) => setEditedContactData({ ...editedContactData, notes: e.target.value })}
                            placeholder="Escribe notas sobre este contacto..."
                            className="bg-white min-h-[80px] resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Historial de conversaciones */}
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Historial de Conversaciones</h3>
                    <div className="relative">
                      {selectedContact?.channels
                        ?.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
                        .map((channel, index) => {
                          const summary = getConversationSummary(channel);
                          const data = channel.conversationData;
                          const isLast = index === (selectedContact?.channels.length ?? 0) - 1;
                          
                          // Determinar color del canal
                          const getChannelColor = (type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok') => {
                            switch (type) {
                              case 'whatsapp':
                                return { bg: 'bg-green-500', ring: 'ring-green-100' };
                              case 'instagram':
                                return { bg: 'bg-pink-500', ring: 'ring-pink-100' };
                              case 'messenger':
                                return { bg: 'bg-blue-500', ring: 'ring-blue-100' };
                              case 'tiktok':
                                return { bg: 'bg-black', ring: 'ring-gray-100' };
                            }
                          };
                          
                          const channelColor = getChannelColor(channel.type);
                          
                          return (
                            <div key={channel.id} className="relative flex gap-4 pb-8">
                              {/* Timeline - Círculo e iconos */}
                              <div className="flex flex-col items-center flex-shrink-0">
                                {/* Círculo con icono */}
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${channelColor.bg} ring-[3px] ${channelColor.ring} shadow-md relative z-10 transition-transform hover:scale-110`}>
                                  {getChannelIcon(channel.type, true)}
                                </div>
                                
                                {/* Línea vertical conectora */}
                                {!isLast && (
                                  <div className="w-[2px] bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 flex-1 absolute top-12 bottom-0 left-[1.375rem]" />
                                )}
                              </div>

                              {/* Contenido de la conversación */}
                              <div className="flex-1 -mt-1">
                                {/* Fecha */}
                                <div className="text-xs text-gray-500 mb-2">
                                  {formatDate(channel.lastContact)}
                                </div>
                                
                                {/* Card con información */}
                                <div className="bg-white rounded-lg border border-gray-200 hover:border-primary/30 transition-colors p-3.5">
                                  {/* Nombre del canal */}
                                  <div className="text-sm text-gray-900 mb-2">
                                    {getChannelDisplayName(channel)}
                                  </div>

                                  {/* Datos relevantes */}
                                  {data && (data.intention || data.budget || data.zone || data.propertyType) && (
                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                      {data.intention && (
                                        <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          {data.intention === 'comprar' ? (
                                            <>
                                              <ShoppingCart className="h-3 w-3" />
                                              Comprar
                                            </>
                                          ) : data.intention === 'vender' ? (
                                            <>
                                              <Home className="h-3 w-3" />
                                              Vender
                                            </>
                                          ) : (
                                            <>
                                              <MessageSquare className="h-3 w-3" />
                                              Consulta
                                            </>
                                          )}
                                        </Badge>
                                      )}
                                      {data.propertyType && (
                                        <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <Home className="h-3 w-3" />
                                          {data.propertyType}
                                        </Badge>
                                      )}
                                      {data.zone && (
                                        <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {data.zone}
                                        </Badge>
                                      )}
                                      {data.budget && (
                                        <Badge variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <DollarSign className="h-3 w-3" />
                                          {data.budget}
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  {/* Resumen */}
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
                                    {summary}
                                  </p>

                                  {/* Botón ver conversación */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs bg-primary/5 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all -mx-1"
                                    onClick={() => {
                                      setSelectedChannel(channel);
                                      setSelectedConversationId(channel.conversationId);
                                      setConversationSheetOpen(true);
                                    }}
                                  >
                                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                    Ver conversación
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Botón de guardar - Solo visible en modo edición */}
            {isEditingContact && (
              <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-white">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingContact(false);
                      setEditedContactData({
                        name: selectedContact?.name || '',
                        phone: selectedContact?.phone || '',
                        email: selectedContact?.email || '',
                        notes: ''
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveContact}
                    className="flex-1 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet de Conversación */}
      <ConversationSheet 
        open={conversationSheetOpen}
        onOpenChange={setConversationSheetOpen}
        conversationId={selectedConversationId}
        contact={selectedContact}
        channel={selectedChannel}
      />
      
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
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de resultados de sincronización */}
      <Dialog open={showSyncResultDialog} onOpenChange={setShowSyncResultDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Sincronización completada
            </DialogTitle>
            <DialogDescription>
              Tus contactos se han actualizado correctamente desde Google Contacts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{syncResult?.newContacts} contactos nuevos</p>
                <p className="text-xs text-gray-600">Añadidos a tu lista</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <FileEdit className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{syncResult?.updatedContacts} contactos actualizados</p>
                <p className="text-xs text-gray-600">Información modificada</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LinkIcon className="h-4 w-4" />
              <span>Conectado con Google</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{getTimeSinceSync()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-2">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600">
              La sincronización automática se realiza diariamente. Puedes sincronizar manualmente cuando lo necesites.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Los Dialogs de Google e iCloud están ahora compartidos al final del componente */}

      {/* Diálogo para crear nueva etiqueta */}
      <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nueva Etiqueta</DialogTitle>
            <DialogDescription>
              Crea una etiqueta personalizada para clasificar tus contactos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Nombre de la etiqueta</Label>
              <Input
                id="tag-name"
                placeholder="Ej: Cliente VIP, Seguimiento mensual..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagInput.trim()) {
                    if (!customTags.includes(newTagInput.trim()) && !defaultTags.includes(newTagInput.trim())) {
                      setCustomTags([...customTags, newTagInput.trim()]);
                      setNewTagInput('');
                      setShowNewTagDialog(false);
                      toast.success('Etiqueta creada correctamente');
                    } else {
                      toast.error('Esta etiqueta ya existe');
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewTagInput('');
                setShowNewTagDialog(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (newTagInput.trim()) {
                  if (!customTags.includes(newTagInput.trim()) && !defaultTags.includes(newTagInput.trim())) {
                    setCustomTags([...customTags, newTagInput.trim()]);
                    setNewTagInput('');
                    setShowNewTagDialog(false);
                    toast.success('Etiqueta creada correctamente');
                  } else {
                    toast.error('Esta etiqueta ya existe');
                  }
                }
              }}
              disabled={!newTagInput.trim()}
            >
              Crear etiqueta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {/* Dialogs compartidos entre móvil y desktop */}
    {renderSharedDialogs()}
    </>
  );

  function renderSharedDialogs() {
    console.log('Renderizando diálogos - Google:', showGoogleDialog, 'iCloud:', showICloudDialog);
    return (
      <>
        {/* Test Modal para Google - Solo para paso input */}
        <TestModal
          isOpen={showGoogleDialog && googleContactsStep === 'input'}
          onClose={() => {
            setShowGoogleDialog(false);
            setGoogleContactsStep('input');
            setGoogleEmail('');
          }}
          title="Conectar Google Contacts"
          description="Autoriza el acceso a tus contactos de Google"
          email={googleEmail}
          onEmailChange={setGoogleEmail}
          onConnect={() => {
            setGoogleContactsStep('loading');
            setTimeout(() => {
              setGoogleContactsFound(120);
              setGoogleContactsStep('summary');
            }, 1500);
          }}
          placeholder="tu-email@gmail.com"
        />

        {/* Test Modal para iCloud - Solo para paso input */}
        <TestModal
          isOpen={showICloudDialog && iCloudContactsStep === 'input'}
          onClose={() => {
            setShowICloudDialog(false);
            setICloudContactsStep('input');
            setICloudEmail('');
          }}
          title="Conectar iCloud Contacts"
          description="Autoriza el acceso a tus contactos de iCloud"
          email={iCloudEmail}
          onEmailChange={setICloudEmail}
          onConnect={() => {
            setICloudContactsStep('loading');
            setTimeout(() => {
              setICloudContactsFound(85);
              setICloudContactsStep('summary');
            }, 1500);
          }}
          placeholder="tu-email@icloud.com"
        />

        {/* Dialog para conectar Google Contacts - Pasos loading y summary */}
        <Dialog open={showGoogleDialog && (googleContactsStep === 'loading' || googleContactsStep === 'summary')} onOpenChange={(open) => {
          console.log('Dialog Google onOpenChange:', open);
          if (!open) {
            setShowGoogleDialog(false);
            setGoogleContactsStep('input');
            setGoogleEmail('');
            setGoogleShowAllContacts(false);
          }
        }} modal>
          <DialogContent className="max-w-md" style={{ zIndex: 99999 }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                {googleContactsStep === 'loading' ? 'Sincronizando contactos' : googleContactsStep === 'summary' ? '¡Contactos encontrados!' : 'Conectar Google Contacts'}
              </DialogTitle>
              <DialogDescription>
                {googleContactsStep === 'loading' ? 'Importando tus contactos desde Google...' : googleContactsStep === 'summary' ? `Hemos encontrado ${googleContactsFound} contactos en tu cuenta` : 'Autoriza el acceso a tus contactos de Google'}
              </DialogDescription>
            </DialogHeader>

            {googleContactsStep === 'input' && (
              <>
                <div className="space-y-4 py-4">
                {/* Logo de Google */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="h-10 w-10">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                </div>

                {/* Formulario */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="google-email">Correo de Google</Label>
                    <Input
                      id="google-email"
                      type="email"
                      placeholder="tu-email@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-900 leading-relaxed">
                        Al conectar Google Contacts, tu asistente podrá reconocer automáticamente a tus clientes y personalizar las conversaciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoogleDialog(false);
                    setGoogleEmail('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConnectGoogle}
                  disabled={!googleEmail}
                  className="flex-1 bg-[#4285F4] hover:bg-[#3367D6]"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Autorizar
                </Button>
              </div>
            </>
          )}

          {googleContactsStep === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-sm text-gray-600">Esto puede tomar unos segundos...</p>
            </div>
          )}

          {googleContactsStep === 'summary' && (
            <>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-900">{googleContactsFound} contactos encontrados</p>
                    <p className="text-xs text-green-700">Se sincronizarán automáticamente</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <p className="font-medium mb-1">Sincronización automática</p>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Tus contactos se actualizarán automáticamente cada día. No necesitas hacer nada más.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoogleDialog(false);
                    setGoogleEmail('');
                    setGoogleContactsStep('input');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmGoogleConnection}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para conectar iCloud Contacts - Pasos loading y summary */}
      <Dialog open={showICloudDialog && (iCloudContactsStep === 'loading' || iCloudContactsStep === 'summary')} onOpenChange={setShowICloudDialog} modal>
        <DialogContent className="sm:max-w-[480px]" style={{ zIndex: 99999 }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {iCloudContactsStep === 'loading' ? (
                <>
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  Conectando...
                </>
              ) : iCloudContactsStep === 'summary' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Listo para sincronizar
                </>
              ) : (
                <>
                  <Cloud className="h-5 w-5 text-primary" />
                  Conectar iCloud Contacts
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {iCloudContactsStep === 'loading' 
                ? 'Estamos sincronizando tus contactos de iCloud' 
                : iCloudContactsStep === 'summary' 
                ? `Hemos encontrado ${iCloudContactsFound} contactos en tu cuenta`
                : 'Sincroniza tus contactos de Apple automáticamente'}
            </DialogDescription>
          </DialogHeader>

          {iCloudContactsStep === 'input' && (
            <>

              <div className="space-y-4 py-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">¿Qué es esto?</p>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Al conectar iCloud Contacts, tu asistente podrá reconocer automáticamente a tus clientes y personalizar las conversaciones.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icloud-email">Apple ID</Label>
                  <Input
                    id="icloud-email"
                    type="email"
                    placeholder="tu@icloud.com"
                    value={iCloudEmail}
                    onChange={(e) => setICloudEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icloud-password">Contraseña de aplicación</Label>
                  <Input
                    id="icloud-password"
                    type="password"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    value={iCloudPassword}
                    onChange={(e) => setICloudPassword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Genera una contraseña específica en appleid.apple.com
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowICloudDialog(false);
                    setICloudEmail('');
                    setICloudPassword('');
                    setICloudContactsStep('input');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConnectICloud}
                  disabled={!iCloudEmail || !iCloudPassword}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Conectar
                </Button>
              </div>
            </>
          )}

          {iCloudContactsStep === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-sm text-gray-600">Esto puede tomar unos segundos...</p>
            </div>
          )}

          {iCloudContactsStep === 'summary' && (
            <>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-900">{iCloudContactsFound} contactos encontrados</p>
                    <p className="text-xs text-green-700">Se sincronizarán automáticamente</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <p className="font-medium mb-1">Sincronización automática</p>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Tus contactos se actualizarán automáticamente cada día. No necesitas hacer nada más.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowICloudDialog(false);
                    setICloudEmail('');
                    setICloudPassword('');
                    setICloudContactsStep('input');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmICloudConnection}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </>
    );
  }
}

// Componente Sheet de Conversación
const ConversationSheet = ({
  open,
  onOpenChange,
  conversationId,
  contact,
  channel
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | null;
  contact: Contact | null;
  channel: ContactChannel | null;
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContactData, setEditedContactData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [defaultTags, setDefaultTags] = useState<string[]>(['Referido', 'Alto presupuesto', 'Urgente', 'Inversión', 'Primera vivienda']);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNewTagDialog, setShowNewTagDialog] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actualizar datos del contacto cuando cambie
  useEffect(() => {
    if (contact) {
      setEditedContactData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        notes: ''
      });
    }
  }, [contact]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Buscar la conversación
  const conversation = useMemo(() => {
    if (!conversationId) return null;
    
    // Buscar en localStorage primero
    const savedConversations = JSON.parse(localStorage.getItem('savedConversations') || '[]');
    let conv = savedConversations.find((c: Conversation) => c.id === conversationId);
    
    // Si no se encuentra, buscar en mockConversations
    if (!conv) {
      conv = mockConversations.find(c => c.id === conversationId);
    }
    
    return conv;
  }, [conversationId]);

  if (!contact || !channel) return null;

  const handleOpenChannel = () => {
    const phone = contact.phone.replace(/[^0-9+]/g, '');
    
    if (channel.type === 'whatsapp') {
      window.open(`https://wa.me/${phone}`, '_blank');
    } else if (channel.type === 'instagram') {
      window.open(`https://ig.me/m/${phone}`, '_blank');
    } else if (channel.type === 'messenger') {
      window.open(`https://m.me/${phone}`, '_blank');
    } else if (channel.type === 'tiktok') {
      window.open('https://www.tiktok.com/messages', '_blank');
    }
  };

  const handleCall = () => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  const getChannelIcon = () => {
    if (channel.type === 'whatsapp') {
      return <WhatsAppIcon className="h-4 w-4 text-gray-500" />;
    } else if (channel.type === 'instagram') {
      return <Instagram className="h-4 w-4 text-gray-500" />;
    } else if (channel.type === 'messenger') {
      return <MessengerIcon className="h-4 w-4 text-gray-500" />;
    } else if (channel.type === 'tiktok') {
      return <TikTokIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChannelIconColored = () => {
    if (channel.type === 'whatsapp') {
      return <WhatsAppIcon className="h-4 w-4" />;
    } else if (channel.type === 'instagram') {
      return <Instagram className="h-4 w-4" />;
    } else if (channel.type === 'messenger') {
      return <MessengerIcon className="h-4 w-4" />;
    } else if (channel.type === 'tiktok') {
      return <TikTokIcon className="h-4 w-4" />;
    }
  };

  const handleEditContact = () => {
    setIsEditingContact(true);
    
    // Inicializar etiquetas desde el contacto
    const contactTags = contact?.tags || [];
    setSelectedTags(contactTags);
    
    setEditedContactData({
      name: contact?.name || '',
      phone: contact?.phone || '',
      email: contact?.email || '',
      notes: contact?.notes || ''
    });
  };

  const handleSaveEditedContact = () => {
    // Actualizar contacto en localStorage
    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
    const updatedContacts = savedContacts.map((c: any) => 
      c.phone === contact?.phone ? { 
        ...c, 
        ...editedContactData,
        tags: selectedTags
      } : c
    );
    
    localStorage.setItem('savedContacts', JSON.stringify(updatedContacts));
    
    // Disparar evento para actualizar otras vistas
    window.dispatchEvent(new Event('contactsUpdated'));
    
    toast.success('Contacto actualizado correctamente');
    setIsEditingContact(false);
  };

  const getPlatformName = () => {
    if (channel.socialHandle) {
      return channel.socialHandle;
    }
    return contact.phone;
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[500px] p-0">
          <div className="flex flex-col h-full">
            {/* Header - Fijo arriba */}
            <SheetHeader className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <SheetDescription className="sr-only">
                Conversación con {contact.name}
              </SheetDescription>
              <div className="flex items-center justify-between gap-3 -ml-2">
                {/* Botón atrás */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {/* Avatar + Info del contacto */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-base truncate">
                      {contact.name}
                    </SheetTitle>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.phone || contact.email || 'Sin teléfono'}
                    </p>
                  </div>
                </div>

                {/* Menú de opciones */}
                {!isEditingContact && (
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
                      <DropdownMenuItem onClick={handleEditContact}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar contacto
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Mandar al CRM
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </SheetHeader>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {isEditingContact ? (
                  // Formulario de edición
                  <div className="px-4 py-4 space-y-6">
                    <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Información del Contacto</h3>
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-xs text-gray-600">Nombre completo</Label>
                        <Input
                          id="contact-name"
                          value={editedContactData.name}
                          onChange={(e) => setEditedContactData({ ...editedContactData, name: e.target.value })}
                          className="bg-white"
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="text-xs text-gray-600">Teléfono</Label>
                        <Input
                          id="contact-phone"
                          value={editedContactData.phone}
                          onChange={(e) => setEditedContactData({ ...editedContactData, phone: e.target.value })}
                          className="bg-white"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-xs text-gray-600">Correo electrónico</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={editedContactData.email}
                          onChange={(e) => setEditedContactData({ ...editedContactData, email: e.target.value })}
                          className="bg-white"
                        />
                      </div>

                      {/* Notas */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-notes-new" className="text-xs text-gray-600">Notas</Label>
                        <Textarea
                          id="contact-notes-new"
                          value={editedContactData.notes}
                          onChange={(e) => setEditedContactData({ ...editedContactData, notes: e.target.value })}
                          placeholder="Escribe notas sobre este contacto..."
                          className="bg-white min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    </div>
                  </div>
                ) : (
                  // Vista de conversación
                  <div className="px-6 py-4 space-y-4 pb-28">
                    {/* Conversación */}
                    <div>
                      <div className="space-y-3">
                        {conversation && conversation.messages && conversation.messages.length > 0 ? (
                          conversation.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === 'agent' || message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                                  message.senderId === 'agent' || message.senderId === 'user'
                                    ? 'bg-blue-50 text-gray-900'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.senderId === 'agent' || message.senderId === 'user' ? 'text-gray-600' : 'text-gray-500'
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
                              Inicia la conversación en {getChannelDisplayName()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer - Fijo abajo */}
            {isEditingContact ? (
              <div className="border-t border-gray-200 px-4 py-4 flex-shrink-0 bg-white">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveContact}
                    className="flex-1 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 px-6 py-3 bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <Button
                    onClick={handleCall}
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </Button>
                  <Button
                    onClick={handleOpenChannel}
                    size="sm"
                    className={`flex-1 h-9 gap-2 text-white ${
                      channel.type === 'whatsapp' 
                        ? 'bg-[#25D366] hover:bg-[#20BA5A]' 
                        : channel.type === 'instagram'
                        ? 'bg-[#E4405F] hover:bg-[#D32F4F]'
                        : channel.type === 'tiktok'
                        ? 'bg-[#000000] hover:bg-[#333333]'
                        : 'bg-[#0084FF] hover:bg-[#0073E6]'
                    }`}
                  >
                    {channel.type === 'whatsapp' ? (
                      <WhatsAppIcon className="h-4 w-4" />
                    ) : channel.type === 'instagram' ? (
                      <InstagramIcon className="h-4 w-4" />
                    ) : channel.type === 'tiktok' ? (
                      <TikTokIcon className="h-4 w-4" />
                    ) : (
                      <MessengerIcon className="h-4 w-4" />
                    )}
                    Abrir {channel.type === 'whatsapp' ? 'WhatsApp' : channel.type === 'instagram' ? 'Instagram' : channel.type === 'tiktok' ? 'TikTok' : 'Messenger'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Diálogo para crear nueva etiqueta */}
      <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nueva Etiqueta</DialogTitle>
            <DialogDescription>
              Crea una etiqueta personalizada para clasificar tus contactos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name-conv">Nombre de la etiqueta</Label>
              <Input
                id="tag-name-conv"
                placeholder="Ej: Cliente VIP, Seguimiento mensual..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagInput.trim()) {
                    handleAddNewTag();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewTagDialog(false);
                setNewTagInput('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddNewTag}
              disabled={!newTagInput.trim()}
              className="flex-1"
            >
              Crear etiqueta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsPage;

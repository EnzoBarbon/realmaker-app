import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { ContactDataPills } from "../leads/contact-data-pills";
import { useIsMobile } from "../ui/use-mobile";
import { AlertMobileView } from "./alert-mobile-view";
import { 
  OldConversationSheet,
  QualificationPanel,
  mockLeads, 
  mockConversations,
  type Lead, 
  type Conversation 
} from "../leads/leads-page";
import { 
  getUnreadConversations, 
  markConversationAsRead 
} from "../../utils/conversation-state";
import {
  ChevronLeft,
  Home,
  DollarSign,
  Building2,
  Key,
  HelpCircle,
  Phone,
  Instagram,
  MessageCircle,
  Flame,
  TrendingUp,
  Thermometer,
  Snowflake,
  Mail,
  MapPin,
  BotOff,
  ExternalLink,
  MoreHorizontal,
  UserPlus,
  X,
  Plus,
  Star,
  CheckCircle,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import type { Notification } from './notifications-page';

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

// Función para obtener cualificación basada en el score
const getQualification = (score: number): keyof typeof qualificationConfig => {
  if (score >= 75) return 'very-qualified';
  if (score >= 50) return 'qualified';
  if (score >= 25) return 'little-qualified';
  return 'very-little-qualified';
};

interface AlertConversationsPageProps {
  alertId: string;
  onBack: () => void;
}

export function AlertConversationsPage({ alertId, onBack }: AlertConversationsPageProps) {
  const isMobile = useIsMobile();
  
  // Estados del chat lateral - EXACTAMENTE igual que en leads-page.tsx
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatLeadId, setSelectedChatLeadId] = useState<string | null>(null);
  
  // Inicializar unreadLeads desde el sistema centralizado
  const [unreadLeads, setUnreadLeads] = useState<Set<string>>(() => {
    return getUnreadConversations();
  });
  
  const [disabledBotLeads, setDisabledBotLeads] = useState<Set<string>>(new Set());
  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [selectedQualificationLeadId, setSelectedQualificationLeadId] = useState<string | null>(null);
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null); // Estado para el lead enfocado
  
  // Sincronizar con el sistema centralizado y escuchar cambios desde otras páginas
  useEffect(() => {
    // Sincronizar el estado local al montar el componente
    const storedUnread = getUnreadConversations();
    setUnreadLeads(storedUnread);

    // Escuchar cambios desde otras páginas (como página de conversaciones)
    const handleUnreadChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number; unreadIds: string[] }>;
      setUnreadLeads(new Set(customEvent.detail.unreadIds));
    };

    window.addEventListener('unreadConversationsChanged', handleUnreadChange);

    return () => {
      window.removeEventListener('unreadConversationsChanged', handleUnreadChange);
    };
  }, []);
  
  // Estados para guardar contacto - EXACTAMENTE igual que en leads-page.tsx
  const [saveBeforeCallDialogOpen, setSaveBeforeCallDialogOpen] = useState(false);
  const [leadToCall, setLeadToCall] = useState<Lead | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [saveContactMode, setSaveContactMode] = useState<'saveAndCall' | 'saveOnly'>('saveAndCall');
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  // Estados para etiquetas de información - EXACTAMENTE igual que en leads-page.tsx
  const [defaultTags, setDefaultTags] = useState<string[]>([
    'Referido',
    'Alto presupuesto',
    'Urgente',
    'Inversión',
    'Primera vivienda'
  ]);
  
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
  
  // Obtener la configuración de la alerta según el ID
  const getAlertById = (id: string): Notification => {
    const alerts: Record<string, Notification> = {
      '1': {
        id: '1',
        name: 'Compradores muy cualificados',
        types: ['email', 'push'],
        role: 'buyer',
        qualification: 'very-qualified',
        enabled: true,
        createdAt: '2025-10-25',
        newContactsCount: 2,
        totalContactsCount: 2
      },
      '2': {
        id: '2',
        name: 'Todos los leads cualificados',
        types: ['push'],
        role: 'all',
        qualification: 'qualified',
        enabled: true,
        createdAt: '2025-10-26',
        newContactsCount: 0,
        totalContactsCount: 0
      }
    };
    
    return alerts[id] || alerts['1'];
  };

  const alert = getAlertById(alertId);

  // Mapeo de roles entre notificaciones y leads
  const roleMapping = {
    'buyer': 'comprador',
    'seller': 'vendedor',
    'renter': 'inquilino',
    'landlord': 'arrendador',
    'all': 'all'
  } as const;

  // Filtrar leads según criterios de la alerta - IGUAL que conversaciones filtradas
  const filteredLeads = useMemo(() => {
    let filtered = mockLeads;

    // Filtrar por rol si no es "all"
    if (alert.role !== 'all') {
      const mappedRole = roleMapping[alert.role];
      filtered = filtered.filter(lead => lead.intention === mappedRole);
    }

    // Filtrar por cualificación si no es "all"
    if (alert.qualification !== 'all') {
      filtered = filtered.filter(lead => {
        const leadQual = getQualification(calculateLeadScore(lead));
        return leadQual === alert.qualification;
      });
    }

    return filtered;
  }, [alert.role, alert.qualification]);

  // Funciones helper - IGUALES que en leads-page.tsx
  const truncateName = (name: string) => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  const handleOpenChatFromTable = (leadId: string) => {
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

  const handleOpenQualification = (leadId: string) => {
    setSelectedQualificationLeadId(leadId);
    setQualificationOpen(true);
    setFocusedLeadId(leadId); // Establecer el lead enfocado
  };

  const handleCall = (phone: string, leadId?: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleOpenSaveContact = (leadId: string) => {
    const lead = filteredLeads.find(l => l.id === leadId);
    if (lead) {
      // Verificar si el contacto ya está guardado
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      const existingContact = savedContacts.find((c: any) => c.phone === lead.phone);
      
      setLeadToCall(lead);
      setFocusedLeadId(leadId); // Establecer el lead enfocado
      
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
        setIsEditingContact(false);
      }
      
      setSaveContactMode('saveOnly');
      setSaveBeforeCallDialogOpen(true);
    }
  };

  // Guardar contacto
  const handleSaveContact = () => {
    if (leadToCall && contactName.trim()) {
      // Guardar el contacto en localStorage
      const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
      
      // Verificar si ya existe y actualizar o crear nuevo
      const existingIndex = savedContacts.findIndex((c: any) => c.phone === leadToCall.phone);
      
      const contactData = {
        id: existingIndex >= 0 ? savedContacts[existingIndex].id : Date.now().toString(),
        name: contactName.trim(),
        phone: leadToCall.phone,
        email: contactEmail.trim(),
        notes: contactNotes.trim(),
        avatar: leadToCall.avatar,
        source: leadToCall.source,
        whatsappName: leadToCall.whatsappName,
        instagramUsername: leadToCall.instagramUsername,
        messengerName: leadToCall.messengerName,
        tiktokUsername: leadToCall.tiktokUsername,
        intention: leadToCall.intention,
        createdAt: existingIndex >= 0 ? savedContacts[existingIndex].createdAt : new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        savedContacts[existingIndex] = contactData;
      } else {
        savedContacts.push(contactData);
      }
      
      localStorage.setItem('savedContacts', JSON.stringify(savedContacts));
      
      // Disparar evento personalizado para notificar el cambio
      window.dispatchEvent(new Event('contactsUpdated'));
      
      // Cerrar el diálogo
      setSaveBeforeCallDialogOpen(false);
      setContactName('');
      setContactEmail('');
      setContactNotes('');
      setLeadToCall(null);
    }
  };

  // Renderizar contenido de celda - EXACTAMENTE igual que en leads-page.tsx
  const renderCellContent = (lead: Lead, columnId: string) => {
    const firstLeadMessage = mockConversations.find(c => c.leadId === lead.id)?.messages?.[0]?.text || '';
    const isBotDisabled = disabledBotLeads.has(lead.id);
    
    switch (columnId) {
      case 'contact':
        return (
          <div className="flex items-center gap-2">
            {/* Avatar con badge del canal */}
            <div 
              className="relative flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
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
              onClick={() => handleOpenChatFromTable(lead.id)}
              className="min-w-0 flex-1 cursor-pointer group"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className={`text-sm transition-colors truncate max-w-[350px] ${
                    unreadLeads.has(lead.id) ? 'font-bold text-gray-900' : 'font-normal text-gray-600'
                  }`}
                >
                  {(() => {
                    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                    const savedContact = savedContacts.find((c: any) => c.phone === lead.phone);
                    
                    if (savedContact?.name) {
                      return truncateName(savedContact.name);
                    }
                    
                    return lead.phone;
                  })()}
                </span>
                {(() => {
                  const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
                  const isContactSaved = savedContacts.some((c: any) => c.phone === lead.phone);
                  
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
      case 'qualification':
        const lockedQuestionsTotal = 3; // 3 preguntas bloqueadas
        const leadQuestions = lead.qualificationQuestions || [];
        
        // Si el rol es "otros", solo contamos las 3 preguntas bloqueadas
        const totalQuestions = lead.intention === 'otros' 
          ? lockedQuestionsTotal 
          : leadQuestions.length + lockedQuestionsTotal;
        
        // Contar preguntas respondidas
        let lockedAnswered = 0;
        const hasName = (lead.contactName && lead.contactName !== '-') || 
                        lead.whatsappName || lead.instagramUsername || 
                        lead.messengerName || lead.tiktokUsername;
        if (hasName) lockedAnswered++;
        lockedAnswered++; // Teléfono siempre respondida
        if (lead.intention !== 'otros') lockedAnswered++;
        
        const leadAnsweredCount = lead.intention === 'otros' 
          ? 0 
          : leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
        const totalAnswered = leadAnsweredCount + lockedAnswered;
        
        const leadScore = calculateLeadScore(lead);
        
        return (
          <div 
            className="flex items-center gap-2 w-full cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenQualification(lead.id);
            }}
          >
            <div className="flex-1 min-w-[80px] bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full transition-all bg-primary"
                style={{ width: `${leadScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap min-w-[35px]">
              ({totalAnswered}/{totalQuestions})
            </span>
          </div>
        );
      case 'matchedProperty':
        return lead.matchedProperty ? (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={(e) => {
              e.stopPropagation();
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
              
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const contactDay = new Date(lastContactDate.getFullYear(), lastContactDate.getMonth(), lastContactDate.getDate());
              const diffMs = today.getTime() - contactDay.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) {
                const hours = lastContactDate.getHours().toString().padStart(2, '0');
                const minutes = lastContactDate.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
              }
              
              if (diffDays === 1) {
                return 'Ayer';
              }
              
              const day = lastContactDate.getDate().toString().padStart(2, '0');
              const month = (lastContactDate.getMonth() + 1).toString().padStart(2, '0');
              const year = lastContactDate.getFullYear();
              
              if (year === now.getFullYear()) {
                return `${day}/${month}`;
              }
              
              return `${day}/${month}/${year}`;
            })()}
          </span>
        );
      case 'actions':
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
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleOpenChatFromTable(lead.id)}
              className="h-7 px-2 text-xs"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  // Configuración de columnas visibles - EXACTO a lo que se muestra en conversaciones
  const visibleColumns = [
    { id: 'contact', label: 'Conversación', width: 'w-[200px]' },
    { id: 'date', label: 'Fecha', width: 'w-[100px]' },
    { id: 'role', label: 'Rol', width: 'w-[120px]' },
    { id: 'qualification', label: 'Cualificación', width: 'w-[150px]' },
    { id: 'matchedProperty', label: 'Propiedad Match', width: 'w-[180px]' },
    { id: 'actions', label: 'Acciones', width: 'w-[200px]' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm">Volver a alertas</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-gray-900">{alert.name}</h1>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <p className="text-muted-foreground">
            Conversaciones que cumplen:
          </p>
          {/* Badge de rol */}
          {alert.role !== 'all' && (() => {
            const roleLabels = {
              'buyer': { label: 'Comprador', icon: Home, color: 'bg-green-50 text-green-700 border-green-200' },
              'seller': { label: 'Vendedor', icon: DollarSign, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              'landlord': { label: 'Arrendador', icon: Building2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
              'renter': { label: 'Inquilino', icon: Key, color: 'bg-orange-50 text-orange-700 border-orange-200' }
            };
            const roleConfig = roleLabels[alert.role as keyof typeof roleLabels];
            const RoleIcon = roleConfig.icon;
            return (
              <Badge variant="outline" className={`${roleConfig.color} px-2.5 py-0.5 gap-1`}>
                <RoleIcon className="h-3.5 w-3.5" />
                {roleConfig.label}
              </Badge>
            );
          })()}
          
          {/* Badge de cualificación */}
          {alert.qualification !== 'all' && (() => {
            const qualConf = qualificationConfig[alert.qualification as keyof typeof qualificationConfig];
            const QualIcon = qualConf.icon;
            return (
              <Badge variant="outline" className={`${qualConf.bgColor} px-2.5 py-0.5 gap-1`}>
                <QualIcon className={`h-3.5 w-3.5 ${qualConf.color}`} />
                <span className={qualConf.color}>{qualConf.label}</span>
              </Badge>
            );
          })()}
        </div>
      </div>

      {/* Tabla de conversaciones - EXACTAMENTE igual que en leads-page.tsx */}
      {isMobile ? (
        /* Vista móvil estilo WhatsApp */
        filteredLeads.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">
                No hay conversaciones
              </h3>
              <p className="text-sm text-gray-500">
                No hay conversaciones que cumplan los criterios de esta alerta
              </p>
            </CardContent>
          </Card>
        ) : (
          <AlertMobileView
            filteredLeads={filteredLeads}
            unreadLeads={unreadLeads}
            disabledBotLeads={disabledBotLeads}
            onOpenChat={handleOpenChatFromTable}
            calculateLeadScore={calculateLeadScore}
          />
        )
      ) : (
        /* Vista de escritorio con tabla */
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">
                  No hay conversaciones
                </h3>
                <p className="text-sm text-gray-500">
                  No hay conversaciones que cumplan los criterios de esta alerta
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {visibleColumns.map(column => (
                        <TableHead key={column.id} className={`${column.width} font-semibold`}>
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => {
                      const isFocused = focusedLeadId === lead.id;
                      
                      return (
                        <TableRow 
                          key={lead.id} 
                          className={`hover:bg-primary/5 transition-colors ${
                            isFocused ? 'bg-primary/5' : (unreadLeads.has(lead.id) ? 'bg-blue-50/30' : 'bg-white')
                          }`}
                        >
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Lateral - Usando exactamente el MISMO componente que en leads-page.tsx */}
      {chatOpen && selectedChatLeadId && (
        <OldConversationSheet
          open={chatOpen}
          onOpenChange={(open) => {
            setChatOpen(open);
          }}
          lead={filteredLeads.find(l => l.id === selectedChatLeadId)}
          conversation={mockConversations.find(c => c.leadId === selectedChatLeadId)}
          onSaveContact={handleOpenSaveContact}
          disabledBotLeads={disabledBotLeads}
          toggleBotStatus={toggleBotStatus}
          onCall={handleCall}
          onOpenQualification={handleOpenQualification}
        />
      )}

      {/* Diálogo para guardar contacto - EXACTAMENTE igual que en leads-page.tsx */}
      <Dialog open={saveBeforeCallDialogOpen} onOpenChange={setSaveBeforeCallDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Añadir Contacto
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
                          handleSaveContact();
                        }
                      }}
                      autoFocus
                    />
                    
                    {/* Etiquetas clickeables para añadir al nombre */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Etiquetas predeterminadas */}
                      {defaultTags.map((tag) => (
                        <button
                          key={tag}
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
                      ))}
                      
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
                    
                    {/* Etiquetas predeterminadas y personalizadas */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Etiquetas predeterminadas */}
                        {defaultTags.map((tag) => (
                          <div
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors group"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedTags.includes(tag)) {
                                  const newSelectedTags = [...selectedTags, tag];
                                  setSelectedTags(newSelectedTags);
                                  setContactNotes(newSelectedTags.join(', '));
                                }
                              }}
                              className="inline-flex items-center cursor-pointer"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {tag}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDefaultTags(defaultTags.filter(t => t !== tag));
                              }}
                              className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Etiquetas personalizadas */}
                        {customTags.map((tag) => (
                          <div
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors group"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedTags.includes(tag)) {
                                  const newSelectedTags = [...selectedTags, tag];
                                  setSelectedTags(newSelectedTags);
                                  setContactNotes(newSelectedTags.join(', '));
                                }
                              }}
                              className="inline-flex items-center cursor-pointer"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {tag}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomTags(customTags.filter(t => t !== tag));
                              }}
                              className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
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
                    
                    {/* Área de etiquetas seleccionadas */}
                    <div className="min-h-[100px] p-3 border border-gray-300 rounded-md bg-white cursor-default">
                      {selectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <div
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSelectedTags = selectedTags.filter(t => t !== tag);
                                  setSelectedTags(newSelectedTags);
                                  setContactNotes(newSelectedTags.join(', '));
                                }}
                                className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3 text-primary hover:text-red-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Las etiquetas seleccionadas aparecerán aquí...</p>
                      )}
                    </div>
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
              onClick={handleSaveContact}
              disabled={!contactName.trim()}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Guardar contacto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear nueva etiqueta */}
      <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nueva etiqueta</DialogTitle>
            <DialogDescription>
              Crea una etiqueta personalizada que podrás usar en el campo de información.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="new-tag-name">Nombre de la etiqueta</Label>
              <Input
                id="new-tag-name"
                placeholder="Ej: Busca parking"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagName.trim()) {
                    const tag = newTagName.trim();
                    if (!customTags.includes(tag) && !defaultTags.includes(tag)) {
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
                if (tag && !customTags.includes(tag) && !defaultTags.includes(tag)) {
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

      {/* Panel de Cualificación */}
      {qualificationOpen && selectedQualificationLeadId && (
        <QualificationPanel
          open={qualificationOpen}
          onOpenChange={(open) => {
            setQualificationOpen(open);
          }}
          lead={filteredLeads.find(l => l.id === selectedQualificationLeadId)}
          disabledBotLeads={disabledBotLeads}
          toggleBotStatus={toggleBotStatus}
          onCall={handleCall}
          onOpenSaveContact={handleOpenSaveContact}
          onOpenQualification={handleOpenQualification}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { ChatSidebar } from "../conversations/chat-sidebar";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Star,
  Save,
  X,
  History,
  Eye,
  Send,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Plus,
  Check,
  ChevronLeft,
  Instagram
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";

interface TagDefinition {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  intention: 'comprar' | 'vender' | 'informacion';
  lastContact: string;
  lastMessage: string;
  budget?: string;
  zone: string;
  propertyType: string;
  status: 'nuevo' | 'calificado' | 'seguimiento' | 'propuesta_enviada' | 'contactado' | 'cerrado';
  priority: 'baja' | 'media' | 'alta';
  source: 'phone' | 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  tags?: string[];
  notes?: string;
  avatar?: string;
  whatsappName?: string;
  instagramUsername?: string;
  messengerName?: string;
  tiktokUsername?: string;
  contactName?: string;
}

interface Activity {
  id: string;
  type: 'call' | 'whatsapp' | 'email' | 'status_change' | 'visit_scheduled' | 'note' | 'recontact';
  description: string;
  timestamp: string;
  details?: string;
  icon?: string;
}

interface LeadDetailsDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Etiquetas predeterminadas
const predefinedTags: TagDefinition[] = [
  { id: 'vip', name: 'VIP', color: '#fbbf24', textColor: '#78350f' },
  { id: 'urgente', name: 'Urgente', color: '#ef4444', textColor: '#ffffff' },
  { id: 'inversor', name: 'Inversor', color: '#8b5cf6', textColor: '#ffffff' },
  { id: 'primera-vivienda', name: 'Primera Vivienda', color: '#3b82f6', textColor: '#ffffff' },
  { id: 'referido', name: 'Referido', color: '#10b981', textColor: '#ffffff' },
  { id: 'recurrente', name: 'Recurrente', color: '#06b6d4', textColor: '#ffffff' },
  { id: 'premium', name: 'Premium', color: '#e7af2a', textColor: '#ffffff' },
  { id: 'seguimiento-mensual', name: 'Seguimiento Mensual', color: '#f97316', textColor: '#ffffff' },
];

// Colores disponibles para etiquetas personalizadas
const availableColors = [
  { color: '#ef4444', textColor: '#ffffff', name: 'Rojo' },
  { color: '#f97316', textColor: '#ffffff', name: 'Naranja' },
  { color: '#fbbf24', textColor: '#78350f', name: 'Amarillo' },
  { color: '#10b981', textColor: '#ffffff', name: 'Verde' },
  { color: '#06b6d4', textColor: '#ffffff', name: 'Cian' },
  { color: '#3b82f6', textColor: '#ffffff', name: 'Azul' },
  { color: '#8b5cf6', textColor: '#ffffff', name: 'Morado' },
  { color: '#ec4899', textColor: '#ffffff', name: 'Rosa' },
  { color: '#6b7280', textColor: '#ffffff', name: 'Gris' },
  { color: '#e7af2a', textColor: '#ffffff', name: 'Dorado' },
];

// Mock activities data - en producción vendría de la API
const mockActivities: Record<string, Activity[]> = {
  '0': [
    {
      id: '1',
      type: 'call',
      description: 'Llamada telefónica realizada',
      timestamp: '2024-12-19 15:48',
      details: 'Duración: 6m 15s - Cliente interesado en casa rústica',
    },
    {
      id: '2',
      type: 'property_sent',
      description: 'Propiedades enviadas',
      timestamp: '2024-12-19 15:48',
      details: 'Casa Rústica Villarcazu - Información completa enviada',
    },
  ],
  '1': [
    {
      id: '1',
      type: 'whatsapp',
      description: 'Conversación por WhatsApp',
      timestamp: '2024-12-19 14:30',
      details: 'Cliente interesado en propiedades de la zona',
    },
    {
      id: '2',
      type: 'property_sent',
      description: 'Propiedades enviadas',
      timestamp: '2024-12-19 14:30',
      details: 'Listado de apartamentos disponibles',
    },
    {
      id: '3',
      type: 'status_change',
      description: 'Estado cambiado a "Seguimiento"',
      timestamp: '2024-12-19 14:30',
    },
    {
      id: '4',
      type: 'whatsapp',
      description: 'Primer contacto por WhatsApp',
      timestamp: '2024-12-18 16:20',
      details: 'Interesada en casas unifamiliares en Zona Norte',
    },
  ],
  '2': [
    {
      id: '1',
      type: 'note',
      description: 'Nota añadida',
      timestamp: '2024-12-18 11:30',
      details: 'Llamar urgente para no perder interés',
    },
    {
      id: '2',
      type: 'call',
      description: 'Llamada telefónica sin respuesta',
      timestamp: '2024-12-18 09:15',
    },
    {
      id: '3',
      type: 'call',
      description: 'Llamada telefónica realizada',
      timestamp: '2024-12-17 18:45',
      details: 'Duración: 4m 20s - Preguntó por precios en el centro',
    },
  ],
  '3': [
    {
      id: '1',
      type: 'whatsapp',
      description: 'Conversación por WhatsApp',
      timestamp: '2024-12-19 16:45',
      details: 'Solicita tasación de su propiedad en Los Pinos',
    },
    {
      id: '2',
      type: 'status_change',
      description: 'Estado cambiado a "Calificado"',
      timestamp: '2024-12-19 16:45',
    },
    {
      id: '3',
      type: 'email',
      description: 'Email enviado',
      timestamp: '2024-12-19 16:50',
      details: 'Comparativa de precios del mercado',
    },
    {
      id: '4',
      type: 'whatsapp',
      description: 'Primer contacto por WhatsApp',
      timestamp: '2024-12-18 10:20',
      details: 'Interesado en vender casa adosada',
    },
  ],
  '4': [
    {
      id: '1',
      type: 'whatsapp',
      description: 'Conversación por WhatsApp',
      timestamp: '2024-12-17 11:20',
      details: 'Interesada en pisos con terraza',
    },
    {
      id: '2',
      type: 'email',
      description: 'Email enviado',
      timestamp: '2024-12-17 14:30',
      details: 'Opciones de pisos con terraza en Zona Sur',
    },
    {
      id: '3',
      type: 'status_change',
      description: 'Estado cambiado a "En Seguimiento"',
      timestamp: '2024-12-17 11:20',
    },
  ],
  '5': [
    {
      id: '1',
      type: 'call',
      description: 'Llamada telefónica realizada',
      timestamp: '2024-12-19 13:10',
      details: 'Duración: 5m 30s - Quiere ver casa en Calle Olivos',
    },
    {
      id: '2',
      type: 'property_sent',
      description: 'Propiedades enviadas',
      timestamp: '2024-12-19 13:10',
      details: 'Inversión Calle Olivos - Información completa',
    },
    {
      id: '3',
      type: 'note',
      description: 'Nota añadida',
      timestamp: '2024-12-19 13:15',
      details: '¡Preparar llaves!',
    },
  ],
  '6': [
    {
      id: '1',
      type: 'whatsapp',
      description: 'Conversación por WhatsApp',
      timestamp: '2024-12-18 15:20',
      details: 'Revisando propuesta de inversión',
    },
    {
      id: '2',
      type: 'email',
      description: 'Email enviado con propuesta',
      timestamp: '2024-12-18 10:00',
      details: 'Propuesta de inversión - Local comercial Centro Histórico',
    },
    {
      id: '3',
      type: 'status_change',
      description: 'Estado cambiado a "Propuesta Enviada"',
      timestamp: '2024-12-18 10:00',
    },
    {
      id: '4',
      type: 'whatsapp',
      description: 'Conversación por WhatsApp',
      timestamp: '2024-12-15 09:30',
      details: 'Interesado en locales comerciales para inversión',
    },
  ],
  '7': [
    {
      id: '1',
      type: 'status_change',
      description: 'Estado cambiado a "Cerrado"',
      timestamp: '2024-12-15 10:30',
      details: 'Se decidió por otra opción',
    },
    {
      id: '2',
      type: 'call',
      description: 'Llamada telefónica realizada',
      timestamp: '2024-12-14 16:00',
      details: 'Duración: 10m 15s - Seguimiento de propuestas',
    },
    {
      id: '3',
      type: 'email',
      description: 'Email enviado',
      timestamp: '2024-12-12 11:00',
      details: 'Opciones de departamentos en zona de playa',
    },
  ],
};

export function LeadDetailsDialog({ lead, open, onOpenChange }: LeadDetailsDialogProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);
  const [chatOpen, setChatOpen] = useState(false);

  // Update editedLead when lead prop changes using useEffect
  useEffect(() => {
    if (lead && (!editedLead || editedLead.id !== lead.id)) {
      setEditedLead(lead);
    }
  }, [lead]);

  if (!lead || !editedLead) return null;

  const activities = mockActivities[lead.id] || [];

  const handleSave = () => {
    // Aquí se guardarían los cambios
    console.log('Guardando cambios:', editedLead);
    onOpenChange(false);
  };

  const getStatusBadge = (status: Lead['status']) => {
    const styles = {
      nuevo: 'bg-blue-100 text-blue-700 border-blue-200',
      calificado: 'bg-green-100 text-green-700 border-green-200',
      seguimiento: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      propuesta_enviada: 'bg-purple-100 text-purple-700 border-purple-200',
      contactado: 'bg-orange-100 text-orange-700 border-orange-200',
      cerrado: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || styles.nuevo;
  };

  const getPriorityBadge = (priority: Lead['priority']) => {
    const styles = {
      baja: 'bg-gray-100 text-gray-700 border-gray-200',
      media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      alta: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[priority];
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="h-4 w-4 text-blue-600" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-600" />;
      case 'status_change':
        return <CheckCircle2 className="h-4 w-4 text-orange-600" />;
      case 'visit_scheduled':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'note':
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
      case 'recontact':
        return <PhoneIncoming className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleViewConversation = () => {
    setChatOpen(true);
  };

  // Mock chat data para el ChatSidebar
  const chatData = {
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
      leadScore: 95,
    },
    messages: [
      {
        id: '1',
        type: 'system' as const,
        content: `${lead.source === 'phone' ? 'Llamada' : 'Conversación'} iniciada - Asistente IA conectado`,
        timestamp: '15:42:10',
      },
      {
        id: '2',
        type: 'assistant' as const,
        content: 'Hola, soy el asistente inmobiliario de RealMaker. ¿Estás buscando información sobre alguna propiedad en particular?',
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

  // Función para obtener el icono del canal
  const getSourceIcon = () => {
    switch (lead.source) {
      case 'whatsapp':
        return <WhatsAppIcon className="h-3.5 w-3.5" />;
      case 'instagram':
        return <Instagram className="h-3.5 w-3.5" />;
      case 'messenger':
        return <MessengerIcon className="h-3.5 w-3.5" />;
      case 'tiktok':
        return <TikTokIcon className="h-3.5 w-3.5" />;
      case 'phone':
        return <Phone className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Función para obtener el nombre del canal
  const getSourceName = () => {
    switch (lead.source) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'instagram':
        return 'Instagram';
      case 'messenger':
        return 'Messenger';
      case 'tiktok':
        return 'TikTok';
      case 'phone':
        return 'Teléfono';
      default:
        return '';
    }
  };

  // Obtener el nombre a mostrar
  const displayName = lead.contactName || lead.name;
  const platformName = lead.whatsappName || lead.instagramUsername || lead.messengerName || lead.tiktokUsername;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogDescription className="sr-only">
            Ver cualificación de {displayName}
          </DialogDescription>
          
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
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={lead.avatar} alt={displayName} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Badge flotante del canal */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                  {getSourceIcon()}
                </div>
              </div>
              
              <DialogTitle className="leading-tight break-words font-normal text-base text-black">
                {displayName}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] pr-4">
          <div className="space-y-6">

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-900">
                <User className="h-4 w-4 text-primary" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={editedLead.name}
                    onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={editedLead.phone}
                    onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedLead.email || ''}
                    onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastContact">Último Contacto</Label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {editedLead.lastContact}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Información de Búsqueda */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-900">
                <Home className="h-4 w-4 text-primary" />
                Información de Búsqueda
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="intention">Intención</Label>
                  <Select
                    value={editedLead.intention}
                    onValueChange={(value) => setEditedLead({ ...editedLead, intention: value as Lead['intention'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprar">Comprar</SelectItem>
                      <SelectItem value="vender">Vender</SelectItem>
                      <SelectItem value="informacion">Información</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Tipo de Propiedad</Label>
                  <Input
                    id="propertyType"
                    value={editedLead.propertyType}
                    onChange={(e) => setEditedLead({ ...editedLead, propertyType: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone">Zona de Interés</Label>
                  <Input
                    id="zone"
                    value={editedLead.zone}
                    onChange={(e) => setEditedLead({ ...editedLead, zone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto</Label>
                  <Input
                    id="budget"
                    value={editedLead.budget || ''}
                    onChange={(e) => setEditedLead({ ...editedLead, budget: e.target.value })}
                    placeholder="$100,000 - $200,000"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Estado y Seguimiento */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-900">
                <MessageSquare className="h-4 w-4 text-primary" />
                Estado y Seguimiento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={editedLead.status}
                    onValueChange={(value) => setEditedLead({ ...editedLead, status: value as Lead['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="calificado">Calificado</SelectItem>
                      <SelectItem value="seguimiento">Seguimiento</SelectItem>
                      <SelectItem value="propuesta_enviada">Propuesta Enviada</SelectItem>
                      <SelectItem value="contactado">Contactado</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={editedLead.priority}
                    onValueChange={(value) => setEditedLead({ ...editedLead, priority: value as Lead['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastMessage">Último Mensaje</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm border border-gray-200">
                  {editedLead.lastMessage}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Etiquetas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={editedLead.notes || ''}
                  onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                  placeholder="Añade etiquetas sobre este contacto..."
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Historial de Actividad */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-gray-900">
                  <History className="h-4 w-4 text-primary" />
                  Historial de Actividad
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewConversation}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Conversación
                </Button>
              </div>

              {activities.length > 0 ? (
                <div className="space-y-3 ml-4">
                  {activities.map((activity, index) => (
                    <div 
                      key={activity.id}
                      className="relative pl-8 pb-3 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute -left-[0.875rem] top-0 bg-white rounded-full p-1.5 border-2 border-gray-200">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp.split(' ')[1] || activity.timestamp}
                          </span>
                        </div>
                        {activity.details && (
                          <p className="text-xs text-gray-600">
                            {activity.details}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {activity.timestamp.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <History className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay actividad registrada</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Botón de Guardar */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>

        {/* ChatSidebar para ver la conversación */}
        {/* <ChatSidebar 
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          chatData={chatData}
        /> */}
      </DialogContent>
    </Dialog>
  );
}
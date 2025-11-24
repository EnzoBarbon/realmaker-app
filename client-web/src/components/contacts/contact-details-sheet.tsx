import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import {
  ChevronLeft,
  Pencil,
  Save,
  MessageSquare,
  ShoppingCart,
  Home,
  MapPin,
  DollarSign,
  Phone
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { Instagram } from "lucide-react";

interface ContactChannel {
  id: string;
  type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  lastContact: string;
  messagesCount: number;
  conversationId: string;
  socialHandle?: string;
  conversationData?: {
    intention?: string;
    budget?: string;
    zone?: string;
    propertyType?: string;
    summary?: string;
  };
}

interface ContactData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  channels?: ContactChannel[];
  tags?: string[];
  notes?: string;
}

interface ContactDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactData | null;
  hideContactInfo?: boolean; // Ocultar la sección de información del contacto
  isMobile?: boolean;
  onConversationClick?: (channel: ContactChannel) => void;
}

export function ContactDetailsSheet({
  open,
  onOpenChange,
  contact,
  hideContactInfo = false,
  isMobile = false,
  onConversationClick
}: ContactDetailsSheetProps) {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContactData, setEditedContactData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (contact) {
      setEditedContactData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        notes: contact.notes || ''
      });
    }
  }, [contact]);

  const handleSaveContact = () => {
    if (!contact) return;
    
    // Actualizar en localStorage
    const savedContacts = JSON.parse(localStorage.getItem('savedContacts') || '[]');
    const updatedSavedContacts = savedContacts.map((c: any) => 
      c.id === contact.id 
        ? { ...c, name: editedContactData.name, phone: editedContactData.phone, email: editedContactData.email, notes: editedContactData.notes }
        : c
    );
    localStorage.setItem('savedContacts', JSON.stringify(updatedSavedContacts));
    window.dispatchEvent(new Event('contactsUpdated'));
    
    setIsEditingContact(false);
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
    const sizeClass = isTimeline ? 'h-6 w-6' : 'h-3.5 w-3.5';
    const colorClass = isTimeline ? 'text-white' : '';
    
    switch (type) {
      case 'whatsapp':
        return <WhatsAppIcon className={`${sizeClass} ${colorClass}`} />;
      case 'instagram':
        return <Instagram className={`${sizeClass} ${colorClass}`} />;
      case 'messenger':
        return <MessengerIcon className={`${sizeClass} ${colorClass}`} />;
      default:
        return <Phone className={`${sizeClass} ${colorClass}`} />;
    }
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

  const getConversationSummary = (channel: ContactChannel): string => {
    if (channel.conversationData?.summary) {
      return channel.conversationData.summary;
    }
    return 'Sin mensajes';
  };

  // Función para verificar si el contacto no está guardado (nombre es igual al teléfono)
  const isContactNotSaved = (): boolean => {
    return contact.name === contact.phone || /^[\d\s+()-]+$/.test(contact.name);
  };

  // Función para extraer nombres detectados de los canales
  const getDetectedNames = (): string => {
    if (!contact.channels || contact.channels.length === 0) return '';
    
    const names: string[] = [];
    
    contact.channels.forEach(channel => {
      // Si tiene handle social, agregarlo
      if (channel.socialHandle) {
        names.push(channel.socialHandle);
      }
    });
    
    // Eliminar duplicados
    const uniqueNames = [...new Set(names)];
    
    return uniqueNames.join(' - ');
  };

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setIsEditingContact(false);
    }}>
      <SheetContent 
        side={isMobile ? "right" : "right"} 
        className={isMobile ? "w-full p-0" : "w-full sm:max-w-[500px] p-0"}
      >
        <div className="flex flex-col h-full">
          {/* Header - Fijo arriba */}
          <SheetHeader className={`border-b border-gray-200 ${isMobile ? 'px-4 py-4' : 'px-6 py-4'} flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  setIsEditingContact(false);
                }}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={contact.name} />}
                <AvatarFallback className="bg-transparent text-primary">
                  {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                {isContactNotSaved() ? (
                  <div>
                    <SheetTitle className="text-base">{contact.phone}</SheetTitle>
                    {getDetectedNames() && (
                      <p className="text-sm text-gray-500 line-clamp-2">{getDetectedNames()}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <SheetTitle className="text-base">{contact.name}</SheetTitle>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                )}
              </div>
              {!isEditingContact && !hideContactInfo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingContact(true)}
                  className="h-8 gap-1.5 flex-shrink-0"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className={isMobile ? "hidden sm:inline" : ""}>Editar</span>
                </Button>
              )}
            </div>
            <SheetDescription className="sr-only">
              Detalles del contacto {contact.name}
            </SheetDescription>
          </SheetHeader>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-4'} space-y-6`}>
                {/* Datos del contacto - Solo mostrar si hideContactInfo es false */}
                {!hideContactInfo && (
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Información del Contacto</h3>
                    {!isEditingContact ? (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Nombre */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nombre completo</p>
                          <p className="text-sm text-gray-900">{contact.name || 'Sin nombre'}</p>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                          <p className="text-sm text-gray-900">{contact.phone || 'Sin teléfono'}</p>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Correo electrónico</p>
                          <p className="text-sm text-gray-900">{contact.email || 'Sin correo electrónico'}</p>
                        </div>

                        {/* Notas */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Notas</p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{contact.notes || 'Sin notas'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                          <Label htmlFor={`contact-name-${isMobile ? 'mobile' : 'desktop'}`} className="text-xs text-gray-600">Nombre completo</Label>
                          <Input
                            id={`contact-name-${isMobile ? 'mobile' : 'desktop'}`}
                            value={editedContactData.name}
                            onChange={(e) => setEditedContactData({ ...editedContactData, name: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                          <Label htmlFor={`contact-phone-${isMobile ? 'mobile' : 'desktop'}`} className="text-xs text-gray-600">Teléfono</Label>
                          <Input
                            id={`contact-phone-${isMobile ? 'mobile' : 'desktop'}`}
                            value={editedContactData.phone}
                            onChange={(e) => setEditedContactData({ ...editedContactData, phone: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor={`contact-email-${isMobile ? 'mobile' : 'desktop'}`} className="text-xs text-gray-600">Correo electrónico</Label>
                          <Input
                            id={`contact-email-${isMobile ? 'mobile' : 'desktop'}`}
                            type="email"
                            value={editedContactData.email}
                            onChange={(e) => setEditedContactData({ ...editedContactData, email: e.target.value })}
                            className="bg-white"
                          />
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                          <Label htmlFor={`contact-notes-${isMobile ? 'mobile' : 'desktop'}`} className="text-xs text-gray-600">Notas</Label>
                          <Textarea
                            id={`contact-notes-${isMobile ? 'mobile' : 'desktop'}`}
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
                )}

                {/* Historial de conversaciones */}
                {contact.channels && contact.channels.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Historial de Conversaciones</h3>
                    <div className="relative">
                      {contact.channels
                        .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
                        .map((channel, index) => {
                          const summary = getConversationSummary(channel);
                          const data = channel.conversationData;
                          const isLast = index === (contact.channels?.length ?? 0) - 1;
                          
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
                            <div key={channel.id || index} className="relative flex gap-4 pb-8">
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
                                      {data.intention === 'comprar' && (
                                        <Badge key="intention-comprar" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <ShoppingCart className="h-3 w-3" />
                                          Comprar
                                        </Badge>
                                      )}
                                      {data.intention === 'vender' && (
                                        <Badge key="intention-vender" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <Home className="h-3 w-3" />
                                          Vender
                                        </Badge>
                                      )}
                                      {data.intention && data.intention !== 'comprar' && data.intention !== 'vender' && (
                                        <Badge key="intention-other" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" />
                                          Consulta
                                        </Badge>
                                      )}
                                      {data.propertyType && (
                                        <Badge key="propertyType" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <Home className="h-3 w-3" />
                                          {data.propertyType}
                                        </Badge>
                                      )}
                                      {data.zone && (
                                        <Badge key="zone" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {data.zone}
                                        </Badge>
                                      )}
                                      {data.budget && (
                                        <Badge key="budget" variant="outline" className="text-xs py-0 h-5 flex items-center gap-1">
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
                                  {onConversationClick && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full h-9 text-xs bg-white border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all -mx-1"
                                      onClick={() => onConversationClick(channel)}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                      Ver conversación ({channel.messagesCount} mensajes)
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Botón de guardar - Solo visible en modo edición */}
          {isEditingContact && (
            <div className={`border-t border-gray-200 ${isMobile ? 'px-4 py-4' : 'px-6 py-4'} flex-shrink-0 bg-white`}>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingContact(false);
                    setEditedContactData({
                      name: contact.name || '',
                      phone: contact.phone || '',
                      email: contact.email || '',
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
  );
}
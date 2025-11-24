import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { BotOff, Home, Phone, Instagram } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import type { Lead } from "../leads/leads-page";
import { mockConversations } from "../leads/leads-page";

interface AlertMobileViewProps {
  filteredLeads: Lead[];
  unreadLeads: Set<string>;
  disabledBotLeads: Set<string>;
  onOpenChat: (leadId: string) => void;
  calculateLeadScore: (lead: Lead) => number;
}

export function AlertMobileView({ 
  filteredLeads, 
  unreadLeads, 
  disabledBotLeads,
  onOpenChat,
  calculateLeadScore 
}: AlertMobileViewProps) {
  
  const truncateName = (name: string) => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  // Función helper para calcular preguntas contestadas
  const getAnsweredQuestionsCount = (lead: Lead) => {
    const lockedQuestionsTotal = 3; // Nombre, teléfono, tipo de cliente (preguntas bloqueadas)
    const leadQuestions = lead.qualificationQuestions || [];
    const totalQuestions = lead.intention === 'otros' 
      ? lockedQuestionsTotal 
      : leadQuestions.length + lockedQuestionsTotal;
    
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
    const leadAnsweredCount = lead.intention === 'otros' 
      ? 0 
      : leadQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
    
    const answeredCount = leadAnsweredCount + lockedAnswered;
    return { answered: answeredCount, total: totalQuestions };
  };

  return (
    <div className="space-y-0">
      {/* Lista de conversaciones estilo WhatsApp */}
      <div className="bg-white pb-24">
        {filteredLeads.map((lead) => {
          const conversation = mockConversations.find(c => c.leadId === lead.id);
          const firstLeadMessage = conversation?.messages.find(m => m.senderId === 'lead')?.text || lead.lastMessage;
          const isUnread = unreadLeads.has(lead.id);
          
          const questionsCount = getAnsweredQuestionsCount(lead);
          
          // Icono según canal
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
              onClick={() => onOpenChat(lead.id)}
            >
              {/* Avatar con badge del canal */}
              <div className="relative flex-shrink-0">
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
                    {firstLeadMessage && firstLeadMessage.length > 60 
                      ? firstLeadMessage.substring(0, 60) + '...' 
                      : firstLeadMessage}
                  </p>
                </div>

                {/* Badge con cualificación y rol */}
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Badge 
                    variant="outline" 
                    className={`${
                      lead.intention === 'comprador' ? 'bg-green-50 border-green-200' :
                      lead.intention === 'vendedor' ? 'bg-blue-50 border-blue-200' :
                      lead.intention === 'arrendador' ? 'bg-purple-50 border-purple-200' :
                      lead.intention === 'inquilino' ? 'bg-orange-50 border-orange-200' :
                      'bg-gray-50 border-gray-200'
                    } flex-shrink-0 text-xs px-1.5 py-0.5`}
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
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

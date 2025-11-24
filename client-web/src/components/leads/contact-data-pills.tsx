import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { MapPin, DollarSign, Home, Building2, Key, HelpCircle, Plus, X, Instagram } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import { useState } from "react";

export interface QualificationQuestion {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface Lead {
  zone?: string;
  budget?: string;
  propertyType?: string;
  intention?: string;
  qualificationQuestions?: QualificationQuestion[];
  source?: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok' | 'phone';
}

interface ContactDataPillsProps {
  lead: Lead;
  onAddData: (data: string) => void;
}

export function ContactDataPills({ lead, onAddData }: ContactDataPillsProps) {
  const [customTags, setCustomTags] = useState<string[]>([]);

  // Generar etiquetas dinámicas desde las respuestas de cualificación
  const defaultTags = (lead.qualificationQuestions || [])
    .filter(q => q.answer && q.answer.trim() !== '')
    .map(q => q.answer);

  // Función para obtener el icono del canal
  const getChannelIcon = () => {
    const iconClass = "h-3 w-3";
    
    switch (lead.source) {
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

  // Función para obtener el nombre del canal
  const getChannelName = () => {
    switch (lead.source) {
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
    <div className="mt-6 flex flex-wrap gap-4">
      {/* Etiquetas dinámicas desde respuestas de cualificación */}
      {defaultTags.map((tag, index) => (
        <TooltipProvider key={`response-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onAddData(tag)}
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
      ))}

      {/* Etiquetas de datos básicos del lead */}
      {lead.zone && (
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-gray-100 transition-colors bg-white"
          onClick={() => onAddData(lead.zone!)}
        >
          <MapPin className="h-3 w-3 mr-1" />
          {lead.zone}
        </Badge>
      )}
      
      {lead.budget && (
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-gray-100 transition-colors bg-white"
          onClick={() => onAddData(lead.budget!)}
        >
          <DollarSign className="h-3 w-3 mr-1" />
          {lead.budget}
        </Badge>
      )}
      
      {lead.propertyType && (
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-gray-100 transition-colors bg-white"
          onClick={() => onAddData(lead.propertyType!)}
        >
          <Home className="h-3 w-3 mr-1" />
          {lead.propertyType}
        </Badge>
      )}
      
      {lead.intention && (
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-gray-100 transition-colors bg-white"
          onClick={() => {
            const intentionLabel = lead.intention === 'comprador' ? 'Comprador' : 
                                  lead.intention === 'vendedor' ? 'Vendedor' : 
                                  lead.intention === 'arrendador' ? 'Arrendador' : 
                                  lead.intention === 'inquilino' ? 'Inquilino' : 'Otros';
            onAddData(intentionLabel);
          }}
        >
          {lead.intention === 'comprador' && <Home className="h-3 w-3 mr-1" />}
          {lead.intention === 'vendedor' && <DollarSign className="h-3 w-3 mr-1" />}
          {lead.intention === 'arrendador' && <Building2 className="h-3 w-3 mr-1" />}
          {lead.intention === 'inquilino' && <Key className="h-3 w-3 mr-1" />}
          {!['comprador', 'vendedor', 'arrendador', 'inquilino'].includes(lead.intention) && <HelpCircle className="h-3 w-3 mr-1" />}
          {lead.intention === 'comprador' ? 'Comprador' : 
           lead.intention === 'vendedor' ? 'Vendedor' : 
           lead.intention === 'arrendador' ? 'Arrendador' : 
           lead.intention === 'inquilino' ? 'Inquilino' : 'Otros'}
        </Badge>
      )}

      {/* Etiquetas personalizadas */}
      {customTags.map((tag) => (
        <div key={tag} className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddData(tag)}
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
    </div>
  );
}

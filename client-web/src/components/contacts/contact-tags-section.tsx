import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, Instagram } from 'lucide-react';
import { WhatsAppIcon } from '../icons/whatsapp-icon';
import { MessengerIcon } from '../icons/messenger-icon';
import { TikTokIcon } from '../icons/tiktok-icon';

interface ContactTagsSectionProps {
  contact?: {
    qualificationQuestions?: Array<{
      id: string;
      question: string;
      answer: string;
      timestamp: string;
    }>;
  };
  channelType?: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function ContactTagsSection({ contact, channelType, selectedTags, onTagsChange }: ContactTagsSectionProps) {
  // Función para obtener el icono del canal
  const getChannelIcon = () => {
    const iconClass = "h-3 w-3";
    
    switch (channelType) {
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
    switch (channelType) {
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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Nombre
      </label>
      
      {/* Etiquetas clickeables para añadir al nombre */}
      <div className="flex flex-wrap gap-3">
        {/* Etiquetas dinámicas desde respuestas de cualificación */}
        {contact?.qualificationQuestions && contact.qualificationQuestions.length > 0 && (
          <TooltipProvider>
            {contact.qualificationQuestions
              .filter(q => q.answer && q.answer.trim() !== '')
              .map((question, index) => (
                <Tooltip key={question.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedTags.includes(question.answer)) {
                          onTagsChange([...selectedTags, question.answer]);
                        }
                      }}
                      className="relative inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      {question.answer}
                      {/* Badge flotante con el icono del canal */}
                      <div className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary rounded-full border-2 border-white shadow-sm">
                        <div className="text-white">
                          {getChannelIcon()}
                        </div>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium text-xs">{question.question}</p>
                      <p className="text-xs text-gray-500">
                        Respuesta de cualificación desde {getChannelName()}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
          </TooltipProvider>
        )}
      </div>

      {/* Texto explicativo */}
      {contact?.qualificationQuestions && contact.qualificationQuestions.filter(q => q.answer && q.answer.trim() !== '').length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Estas etiquetas se generan automáticamente desde la conversación de {getChannelName()}. Haz clic en cualquiera para añadirla al nombre del contacto.
          </p>
        </div>
      )}
    </div>
  );
}

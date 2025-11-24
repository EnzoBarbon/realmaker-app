import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { Instagram } from "lucide-react";
import { TikTokIcon } from "../icons/tiktok-icon";
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface InterestedLead {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  lastContact: string;
  qualification: number;
  source: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
}

interface InterestedLeadsSummaryProps {
  leads: InterestedLead[];
  className?: string;
  // Estadísticas de portales inmobiliarios
  idealistaStats?: {
    views: number;
    contacts: number;
    favorites: number;
    searchPosition?: number;
  };
}

export function InterestedLeadsSummary({ leads, className = '', idealistaStats }: InterestedLeadsSummaryProps) {
  if (!leads || leads.length === 0) {
    return null;
  }

  // Calcular estadísticas
  const totalLeads = leads.length;
  const leadsLast24h = leads.filter(lead => {
    const daysDiff = Math.floor((new Date().getTime() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 1;
  }).length;

  const leadsLast7d = leads.filter(lead => {
    const daysDiff = Math.floor((new Date().getTime() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  }).length;

  const avgQualification = Math.round(leads.reduce((sum, lead) => sum + lead.qualification, 0) / leads.length);
  const vipLeads = leads.filter(lead => lead.qualification >= 80).length;

  const whatsappCount = leads.filter(l => l.source === 'whatsapp').length;
  const instagramCount = leads.filter(l => l.source === 'instagram').length;
  const messengerCount = leads.filter(l => l.source === 'messenger').length;
  const tiktokCount = leads.filter(l => l.source === 'tiktok').length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Card principal de resumen */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Total de interesados */}
          <div className="flex-1 min-w-[140px]">
            <p className="text-xs text-gray-600 mb-1">Total de interesados</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl text-gray-900">{totalLeads}</p>
              {leadsLast24h > 0 && (
                <p className="text-xs text-gray-600">
                  {leadsLast24h} en las últimas 24h
                </p>
              )}
            </div>
          </div>
          
          {/* Cualificación media */}
          <div className="flex-1 min-w-[140px]">
            <p className="text-xs text-gray-600 mb-1">Cualificación media</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl text-gray-900">{avgQualification}%</p>
            </div>
          </div>
        </div>
        
        {/* Desglose por canales */}
        <div className="mt-4 pt-3 border-t border-primary/20">
          <p className="text-xs text-gray-600 mb-2">Interesados por canal</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            {whatsappCount > 0 && (
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="bg-green-500 rounded-full p-1.5 flex items-center justify-center">
                  <WhatsAppIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-sm text-gray-900">{whatsappCount}</p>
                </div>
              </div>
            )}
            
            {/* Instagram */}
            {instagramCount > 0 && (
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full p-1.5 flex items-center justify-center">
                  <Instagram className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Instagram</p>
                  <p className="text-sm text-gray-900">{instagramCount}</p>
                </div>
              </div>
            )}
            
            {/* Messenger */}
            {messengerCount > 0 && (
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="bg-blue-500 rounded-full p-1.5 flex items-center justify-center">
                  <MessengerIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Messenger</p>
                  <p className="text-sm text-gray-900">{messengerCount}</p>
                </div>
              </div>
            )}
            
            {/* TikTok */}
            {tiktokCount > 0 && (
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="bg-gray-900 rounded-full p-1.5 flex items-center justify-center">
                  <TikTokIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">TikTok</p>
                  <p className="text-sm text-gray-900">{tiktokCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mensaje de urgencia estilo Booking */}
      {totalLeads > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900">
              <span className="font-semibold">
                {totalLeads} {totalLeads === 1 ? 'persona ha' : 'personas han'}
              </span> mostrado interés en esta propiedad.
              {leadsLast7d >= 3 && (
                <span> ¡Alta demanda esta semana!</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
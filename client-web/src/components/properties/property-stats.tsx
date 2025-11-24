import { Sparkles, Eye, MessageCircle, Heart, ThumbsUp } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { Instagram } from "lucide-react";
import { TikTokIcon } from "../icons/tiktok-icon";
import { Facebook } from "lucide-react";
import { Youtube } from "lucide-react";

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

interface SocialStats {
  instagram?: { url: string; likes: number; comments: number };
  facebook?: { url: string; likes: number; comments: number };
  youtube?: { url: string; likes: number; comments: number };
  tiktok?: { url: string; likes: number; comments: number };
}

interface PropertyStatsProps {
  leads: InterestedLead[];
  socialLinks?: SocialStats;
  className?: string;
  isPublicView?: boolean; // Para ocultar cualificación en vista pública
  hidePublications?: boolean; // Para ocultar publicaciones de redes sociales (popup de interesados)
}

export function PropertyStats({ leads, socialLinks, className = '', isPublicView = false, hidePublications = false }: PropertyStatsProps) {
  // Si no hay leads ni enlaces sociales, no mostrar nada
  const hasLeads = leads && leads.length > 0;
  const hasSocialLinks = socialLinks && Object.keys(socialLinks).length > 0;
  
  if (!hasLeads && !hasSocialLinks) {
    return null;
  }

  // Calcular estadísticas de leads
  const totalLeads = leads?.length || 0;
  const leadsLast24h = leads?.filter(lead => {
    const daysDiff = Math.floor((new Date().getTime() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 1;
  }).length || 0;

  const leadsLast7d = leads?.filter(lead => {
    const daysDiff = Math.floor((new Date().getTime() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  }).length || 0;

  const avgQualification = leads && leads.length > 0 
    ? Math.round(leads.reduce((sum, lead) => sum + lead.qualification, 0) / leads.length)
    : 0;

  // Contar por canal de mensajería
  const whatsappCount = leads?.filter(l => l.source === 'whatsapp').length || 0;
  const instagramDMCount = leads?.filter(l => l.source === 'instagram').length || 0;
  const messengerCount = leads?.filter(l => l.source === 'messenger').length || 0;
  const tiktokDMCount = leads?.filter(l => l.source === 'tiktok').length || 0;

  // Calcular totales de redes sociales
  const totalSocialLikes = (socialLinks?.instagram?.likes || 0) + 
                           (socialLinks?.facebook?.likes || 0) + 
                           (socialLinks?.youtube?.likes || 0) + 
                           (socialLinks?.tiktok?.likes || 0);
  
  const totalSocialComments = (socialLinks?.instagram?.comments || 0) + 
                              (socialLinks?.facebook?.comments || 0) + 
                              (socialLinks?.youtube?.comments || 0) + 
                              (socialLinks?.tiktok?.comments || 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-gray-900">Estadísticas de la propiedad</h3>
      </div>

      {/* Mensaje de FOMO - Arriba como resumen */}
      {hasLeads && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 sm:p-3 flex items-start gap-2 sm:gap-2.5">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm text-amber-900">
              <span className="font-semibold">
                {totalLeads} {totalLeads === 1 ? 'persona está' : 'personas están'}
              </span> muy {totalLeads === 1 ? 'interesada' : 'interesadas'} en esta propiedad.
              {leadsLast7d >= 3 && ' ¡Alta demanda esta semana!'}
            </p>
          </div>
        </div>
      )}

      {/* Card principal */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 overflow-hidden">
        {/* Resumen principal - Solo si hay leads */}
        {hasLeads && (
          <div className="p-3 sm:p-4 border-b border-primary/20">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Total de interesados */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Interesados</p>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <p className="text-2xl sm:text-3xl text-gray-900">{totalLeads}</p>
                  {leadsLast24h > 0 && (
                    <span className="text-xs text-gray-600">
                      +{leadsLast24h} hoy
                    </span>
                  )}
                </div>
              </div>

              {/* Cualificación media - Solo en vista privada */}
              {!isPublicView && avgQualification > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Cualificación</p>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <p className="text-2xl sm:text-3xl text-gray-900">{avgQualification}%</p>
                  </div>
                </div>
              )}

              {/* En vista pública, también mostrar cualificación media si hay leads */}
              {isPublicView && avgQualification > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Cualificación</p>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <p className="text-2xl sm:text-3xl text-gray-900">{avgQualification}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canales de mensajería */}
        {hasLeads && (
          <div className={`p-3 sm:p-4 bg-white/50 ${!hidePublications && hasSocialLinks ? 'border-b border-primary/20' : ''}`}>
            <p className="text-xs text-gray-600 mb-2.5 sm:mb-3">Interesados por canal</p>
            <div className="grid grid-cols-2 gap-2">
              {whatsappCount > 0 && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-200 shadow-sm">
                  <div className="bg-[#25D366] rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">WhatsApp</p>
                    <p className="text-sm sm:text-base text-gray-900">{whatsappCount}</p>
                  </div>
                </div>
              )}

              {instagramDMCount > 0 && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-200 shadow-sm">
                  <div className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">Instagram</p>
                    <p className="text-sm sm:text-base text-gray-900">{instagramDMCount}</p>
                  </div>
                </div>
              )}

              {messengerCount > 0 && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-200 shadow-sm">
                  <div className="bg-[#0084FF] rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
                    <MessengerIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">Messenger</p>
                    <p className="text-sm sm:text-base text-gray-900">{messengerCount}</p>
                  </div>
                </div>
              )}

              {tiktokDMCount > 0 && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-200 shadow-sm">
                  <div className="bg-black rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
                    <TikTokIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">TikTok</p>
                    <p className="text-sm sm:text-base text-gray-900">{tiktokDMCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas de redes sociales */}
        {!hidePublications && hasSocialLinks && (
          <div className="p-3 sm:p-4 bg-white/50">
            <p className="text-xs text-gray-600 mb-2.5 sm:mb-3">Publicaciones de la propiedad</p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5 sm:gap-3">
              {socialLinks?.instagram && (
                <a 
                  href={socialLinks.instagram.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 sm:gap-2 lg:gap-2.5 bg-white rounded-lg p-2 sm:p-2.5 lg:p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] rounded-lg p-1 sm:p-1.5 lg:p-2 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 mb-1">Instagram</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.instagram.likes || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.instagram.comments || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {socialLinks?.facebook && (
                <a 
                  href={socialLinks.facebook.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 sm:gap-2 lg:gap-2.5 bg-white rounded-lg p-2 sm:p-2.5 lg:p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-[#1877F2] rounded-lg p-1 sm:p-1.5 lg:p-2 flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 mb-1">Facebook</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#1877F2] flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.facebook.likes || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.facebook.comments || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {socialLinks?.youtube && (
                <a 
                  href={socialLinks.youtube.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 sm:gap-2 lg:gap-2.5 bg-white rounded-lg p-2 sm:p-2.5 lg:p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-[#FF0000] rounded-lg p-1 sm:p-1.5 lg:p-2 flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 mb-1">YouTube</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FF0000] flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.youtube.likes || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.youtube.comments || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {socialLinks?.tiktok && (
                <a 
                  href={socialLinks.tiktok.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 sm:gap-2 lg:gap-2.5 bg-white rounded-lg p-2 sm:p-2.5 lg:p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-black rounded-lg p-1 sm:p-1.5 lg:p-2 flex items-center justify-center flex-shrink-0">
                    <TikTokIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 mb-1">TikTok</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.tiktok.likes || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{(socialLinks.tiktok.comments || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import { Badge } from "../ui/badge";

// Mockup de pantalla de conversaciones para mostrar en teléfonos
export function MobileMockupConversations() {
  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-20 bg-primary/30 rounded"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex gap-1">
          <div className="px-2 py-1 bg-primary text-white rounded text-[7px]">Todos</div>
          <div className="px-2 py-1 bg-white text-gray-600 rounded text-[7px] border border-gray-200">VIP</div>
          <div className="px-2 py-1 bg-white text-gray-600 rounded text-[7px] border border-gray-200">Sin leer</div>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="divide-y divide-gray-100">
        {/* Conversación 1 - WhatsApp VIP */}
        <div className="p-2.5 bg-red-50/30">
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                <WhatsAppIcon className="h-2 w-2 text-[#25D366]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-[9px] text-gray-900">María González</span>
                <span className="text-[7px] text-gray-400">5 min</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className="bg-red-100 text-red-700 text-[6px] px-1 py-0 h-3 border-0">
                  VIP
                </Badge>
                <span className="text-[7px] text-gray-500">€250K • 3 hab</span>
              </div>
              <p className="text-[8px] text-gray-600 line-clamp-1">
                ¿Cuándo podríamos hacer la visita?
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-3.5 w-3.5 bg-primary rounded-full text-[7px] text-white flex items-center justify-center">
                2
              </div>
            </div>
          </div>
        </div>

        {/* Conversación 2 - Instagram */}
        <div className="p-2.5">
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                <InstagramIcon className="h-2 w-2 text-[#E4405F]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-[9px] text-gray-900">Carlos Ruiz</span>
                <span className="text-[7px] text-gray-400">15 min</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className="bg-orange-100 text-orange-700 text-[6px] px-1 py-0 h-3 border-0">
                  Caliente
                </Badge>
                <span className="text-[7px] text-gray-500">€380K • 4 hab</span>
              </div>
              <p className="text-[8px] text-gray-600 line-clamp-1">
                Me interesa mucho esta propiedad
              </p>
            </div>
          </div>
        </div>

        {/* Conversación 3 - Messenger */}
        <div className="p-2.5">
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                <MessengerIcon className="h-2 w-2 text-[#0084FF]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-[9px] text-gray-900">Ana López</span>
                <span className="text-[7px] text-gray-400">1h</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className="bg-blue-100 text-blue-700 text-[6px] px-1 py-0 h-3 border-0">
                  Tibio
                </Badge>
                <span className="text-[7px] text-gray-500">€180K • 2 hab</span>
              </div>
              <p className="text-[8px] text-gray-600 line-clamp-1">
                ¿Admite mascotas?
              </p>
            </div>
          </div>
        </div>

        {/* Conversación 4 - TikTok */}
        <div className="p-2.5">
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                <TikTokIcon className="h-2 w-2 text-black" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-[9px] text-gray-900">Javier Soto</span>
                <span className="text-[7px] text-gray-400">2h</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className="bg-blue-100 text-blue-700 text-[6px] px-1 py-0 h-3 border-0">
                  Tibio
                </Badge>
                <span className="text-[7px] text-gray-500">€150K • 1 hab</span>
              </div>
              <p className="text-[8px] text-gray-600 line-clamp-1">
                Info sobre la zona
              </p>
            </div>
          </div>
        </div>

        {/* Conversación 5 */}
        <div className="p-2.5 bg-gray-50/50">
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                <WhatsAppIcon className="h-2 w-2 text-[#25D366]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-[9px] text-gray-500">Laura Martín</span>
                <span className="text-[7px] text-gray-400">3h</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className="bg-cyan-100 text-cyan-700 text-[6px] px-1 py-0 h-3 border-0">
                  Frío
                </Badge>
                <span className="text-[7px] text-gray-500">€120K • 2 hab</span>
              </div>
              <p className="text-[8px] text-gray-500 line-clamp-1">
                Gracias por la información
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

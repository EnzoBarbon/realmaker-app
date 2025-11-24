import { Badge } from "../ui/badge";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TrendingUp, Users, Zap, Clock } from "lucide-react";

// Mockup minimalista del dashboard para mostrar en teléfonos
export function MobileMockupDashboard() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-16 bg-primary/30 rounded"></div>
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
              <Zap className="h-2.5 w-2.5 text-red-600" />
            </div>
            <span className="text-[8px] text-gray-500">VIP</span>
          </div>
          <div className="text-lg text-gray-900">12</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-2.5 w-2.5 text-blue-600" />
            </div>
            <span className="text-[8px] text-gray-500">Total</span>
          </div>
          <div className="text-lg text-gray-900">47</div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-2">
        {/* Lead 1 - VIP */}
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0"></div>
                <span className="text-[9px] text-gray-900 truncate">María González</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <WhatsAppIcon className="h-2.5 w-2.5 text-[#25D366]" />
                <span className="text-[7px] text-gray-500">Hace 5 min</span>
              </div>
            </div>
            <Badge className="bg-red-50 text-red-700 border-red-200 text-[7px] px-1.5 py-0 h-4">
              VIP
            </Badge>
          </div>
          <div className="text-[8px] text-gray-600 line-clamp-1">
            Piso 3 hab. Centro • €250K
          </div>
        </div>

        {/* Lead 2 - Caliente */}
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0"></div>
                <span className="text-[9px] text-gray-900 truncate">Carlos Ruiz</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <InstagramIcon className="h-2.5 w-2.5 text-[#E4405F]" />
                <span className="text-[7px] text-gray-500">Hace 15 min</span>
              </div>
            </div>
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-[7px] px-1.5 py-0 h-4">
              Caliente
            </Badge>
          </div>
          <div className="text-[8px] text-gray-600 line-clamp-1">
            Casa 4 hab. Residencial • €380K
          </div>
        </div>

        {/* Lead 3 - Tibio */}
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0"></div>
                <span className="text-[9px] text-gray-900 truncate">Ana López</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <MessengerIcon className="h-2.5 w-2.5 text-[#0084FF]" />
                <span className="text-[7px] text-gray-500">Hace 1h</span>
              </div>
            </div>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[7px] px-1.5 py-0 h-4">
              Tibio
            </Badge>
          </div>
          <div className="text-[8px] text-gray-600 line-clamp-1">
            Apartamento 2 hab. • €180K
          </div>
        </div>
      </div>
    </div>
  );
}

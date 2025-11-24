import { Badge } from "../ui/badge";
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  MoreHorizontal,
  Building2
} from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  conversationsBadge?: string;
}

const navItems = [
  {
    id: 'leads',
    label: 'Conversaciones',
    icon: MessageSquare,
    badge: 'conversations'
  },
  {
    id: 'contacts',
    label: 'Contactos',
    icon: Users
  },
  {
    id: 'properties',
    label: 'Propiedades',
    icon: Building2
  }
];

export function BottomNav({ activeTab, onTabChange, conversationsBadge }: BottomNavProps) {
  const isMoreActive = activeTab === 'more' || activeTab === 'config' || activeTab === 'integrations' || activeTab === 'profile' || activeTab === 'admin' || activeTab === 'notifications';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50 md:hidden">
      <nav className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeValue = item.badge === 'conversations' ? conversationsBadge : undefined;
          const showBadge = badgeValue && parseInt(badgeValue) > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 active:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#e7af2a] text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm shadow-[#e7af2a]/30">
                    {badgeValue}
                  </span>
                )}
              </div>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
            </button>
          );
        })}
        
        {/* More button */}
        <button
          onClick={() => onTabChange('more')}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
            isMoreActive
              ? 'text-primary'
              : 'text-gray-500 active:text-gray-700'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className={`h-6 w-6 ${isMoreActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className={`text-[11px] leading-tight ${isMoreActive ? 'font-semibold' : 'font-medium'}`}>
            Más
          </span>
          {isMoreActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
          )}
        </button>
      </nav>
    </div>
  );
}
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import Frame5980 from "../../imports/Frame5980";
import { useState, useEffect } from "react";
import { getUnreadCount } from "../../utils/conversation-state";
import {
  Users,
  Layers3,
  Settings2,
  Home,
  ArrowLeft,
  Clock,
  Menu,
  X,
  MessageSquare,
  Bell,
  Shield,
  Building2,
  Globe,
  Sparkles,
  Rocket
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onBackToHub?: () => void;
  unreadCount?: number;
}

interface MobileSidebarProps extends SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  category: string;
  badge?: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

const navigationItems: MenuItem[] = [
  {
    id: 'leads',
    label: 'Conversaciones',
    icon: MessageSquare,
    category: 'main',
    badge: '3'
  },
  {
    id: 'contacts',
    label: 'Contactos',
    icon: Users,
    category: 'main'
  },
  {
    id: 'properties',
    label: 'Propiedades',
    icon: Building2,
    category: 'main'
  },
  {
    id: 'notifications',
    label: 'Alertas',
    icon: Bell,
    category: 'main'
  },
  {
    id: 'website',
    label: 'Página Web',
    icon: Globe,
    category: 'main',
    comingSoon: true
  },
  {
    id: 'more',
    label: 'Configuración',
    icon: Settings2,
    category: 'main'
  }
];

const menuItems: MenuItem[] = [
  {
    id: 'leads',
    label: 'Conversaciones',
    icon: MessageSquare,
    category: 'main',
    badge: '3'
  },
  {
    id: 'contacts',
    label: 'Contactos',
    icon: Users,
    category: 'main'
  },
  {
    id: 'properties',
    label: 'Propiedades',
    icon: Building2,
    category: 'main'
  },
  {
    id: 'notifications',
    label: 'Alertas',
    icon: Bell,
    category: 'main'
  },
  {
    id: 'website',
    label: 'Página Web',
    icon: Globe,
    category: 'main',
    comingSoon: true
  },
  {
    id: 'more',
    label: 'Configuración',
    icon: Settings2,
    category: 'main'
  },
  {
    id: 'integrations',
    label: 'Conexiones',
    icon: Layers3,
    category: 'tools'
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: Shield,
    category: 'account'
  }
];

const categoryLabels = {
  main: 'Principal',
  assistant: 'Asistentes',
  tools: 'Herramientas',
  account: 'Cuenta'
};

// Desktop Sidebar minimalista
export function MinimalSidebar({ activeTab, onTabChange, collapsed = false, onCollapsedChange, onBackToHub, unreadCount = 0 }: SidebarProps) {
  // Estado local para el contador de no leídos (se sincroniza con el sistema centralizado)
  const [localUnreadCount, setLocalUnreadCount] = useState(getUnreadCount());
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  // Escuchar cambios en las conversaciones no leídas
  useEffect(() => {
    const handleUnreadChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number; unreadIds: string[] }>;
      setLocalUnreadCount(customEvent.detail.count);
    };

    window.addEventListener('unreadConversationsChanged', handleUnreadChange);

    // Sincronizar al montar
    setLocalUnreadCount(getUnreadCount());

    return () => {
      window.removeEventListener('unreadConversationsChanged', handleUnreadChange);
    };
  }, []);

  // Usar el contador local en lugar del prop
  const displayUnreadCount = localUnreadCount > 0 ? localUnreadCount : 0;

  // Filtrar "Conexiones" del menú desktop (ya está dentro de Configuración)
  const visibleMenuItems = menuItems.filter(item => item.id !== 'integrations').map(item => {
    // Añadir el badge dinámico a Conversaciones
    if (item.id === 'leads' && displayUnreadCount > 0) {
      return { ...item, badge: String(displayUnreadCount) };
    }
    // Limpiar badges estáticos para leads
    if (item.id === 'leads') {
      return { ...item, badge: undefined };
    }
    return { ...item, badge: item.badge };
  });

  const groupedItems = visibleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const handleItemClick = (item: MenuItem) => {
    if (item.comingSoon && !hasSeenDialog) {
      setShowComingSoonDialog(true);
    } else {
      onTabChange(item.id);
    }
  };

  const handleDialogClose = () => {
    setShowComingSoonDialog(false);
    setHasSeenDialog(true);
    // Permitir acceso después de cerrar el diálogo
    onTabChange('website');
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="px-3">
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    const button = (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => !item.disabled && handleItemClick(item)}
                        disabled={item.disabled}
                        className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start px-3'} h-11 relative transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary border-r-2 border-primary hover:bg-primary/15' 
                            : item.disabled
                            ? 'text-gray-400 opacity-60 cursor-not-allowed hover:bg-transparent'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`${collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'} flex-shrink-0`} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.comingSoon && (
                              <Badge 
                                variant="secondary" 
                                className="absolute top-1.5 right-2 text-[9px] px-1.5 py-0.5 h-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md flex items-center gap-0.5"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Próximamente</span>
                              </Badge>
                            )}
                            {item.badge && !item.comingSoon && (
                              <Badge 
                                variant="secondary" 
                                className={`ml-auto text-xs font-semibold ${
                                  item.disabled 
                                    ? 'bg-gray-100 text-gray-500 border-gray-200'
                                    : 'bg-[#e7af2a] text-white border-0 shadow-sm shadow-[#e7af2a]/30'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                        {collapsed && item.badge && !item.comingSoon && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#e7af2a] text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                            {item.badge}
                          </span>
                        )}
                        {collapsed && item.comingSoon && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm" />
                        )}
                      </Button>
                    );
                    
                    if (collapsed) {
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            {button}
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                            {item.comingSoon && <p className="text-xs text-gray-400">Próximamente</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    
                    return button;
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Coming Soon Dialog */}
        <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#e7af2a] to-[#f0c45f] flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">
                ¡Próximamente disponible!
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-4">
                Estamos trabajando en una nueva funcionalidad de <span className="font-semibold text-gray-900">Página Web</span> que te permitirá crear y gestionar tu sitio web inmobiliario de forma automática.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Características principales
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Diseño profesional y personalizable</li>
                      <li>• Integración automática con tus propiedades</li>
                      <li>• Optimizado para SEO y dispositivos móviles</li>
                      <li>• Publicación con un solo clic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                onClick={handleDialogClose}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

// Mobile Sidebar minimalista
export function MinimalMobileSidebar({ activeTab, onTabChange, isOpen, onClose, onBackToHub, unreadCount = 0 }: MobileSidebarProps) {
  // Estado local para el contador de no leídos (se sincroniza con el sistema centralizado)
  const [localUnreadCount, setLocalUnreadCount] = useState(getUnreadCount());
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  // Escuchar cambios en las conversaciones no leídas
  useEffect(() => {
    const handleUnreadChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number; unreadIds: string[] }>;
      setLocalUnreadCount(customEvent.detail.count);
    };

    window.addEventListener('unreadConversationsChanged', handleUnreadChange);

    // Sincronizar al montar
    setLocalUnreadCount(getUnreadCount());

    return () => {
      window.removeEventListener('unreadConversationsChanged', handleUnreadChange);
    };
  }, []);

  // Usar el contador local en lugar del prop
  const displayUnreadCount = localUnreadCount > 0 ? localUnreadCount : 0;

  // Tabs dentro de la configuración que deberían ocultar "Conexiones"
  const configSubPages = ['profile', 'admin', 'integrations', 'config', 'account'];
  const isInConfigSection = configSubPages.includes(activeTab);
  
  // Filtrar items según si estamos en sub-página de configuración
  const visibleMenuItems = (isInConfigSection 
    ? menuItems.filter(item => item.id !== 'integrations')
    : menuItems).map(item => {
    // Añadir el badge dinámico a Conversaciones
    if (item.id === 'leads' && displayUnreadCount > 0) {
      return { ...item, badge: String(displayUnreadCount) };
    }
    // Limpiar badges estáticos para leads
    if (item.id === 'leads') {
      return { ...item, badge: undefined };
    }
    return { ...item, badge: item.badge };
  });

  const groupedItems = visibleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const handleItemClick = (item: MenuItem) => {
    if (item.comingSoon && !hasSeenDialog) {
      setShowComingSoonDialog(true);
    } else {
      onTabChange(item.id);
      onClose();
    }
  };

  const handleDialogClose = () => {
    setShowComingSoonDialog(false);
    setHasSeenDialog(true);
    // Permitir acceso después de cerrar el diálogo
    onTabChange('website');
    onClose();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-80">
          {/* Título y descripción ocultos para accesibilidad */}
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de navegación</SheetTitle>
            <SheetDescription>
              Navega por las diferentes secciones de RealMaker AI
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full bg-white">
            {/* Header con Logo y botón cerrar */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-9 w-9 p-0 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
              <button
                onClick={() => handleItemClick({ id: 'home', label: 'Home', icon: Home, category: 'main' })}
                className="flex-1 hover:opacity-80 transition-opacity max-w-[160px]"
              >
                <Frame5980 />
              </button>
            </div>

            {/* Back to Hub Button */}
            <div className="px-6 pt-4 pb-2">
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
                onClick={() => {
                  onBackToHub?.();
                  onClose();
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Volver a Betterplace</span>
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-8">
                {Object.keys(groupedItems).map((category) => (
                  <div key={category} className="space-y-2 px-6">
                    {groupedItems[category as keyof typeof groupedItems].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => !item.disabled && handleItemClick(item)}
                          disabled={item.disabled}
                          className={`w-full justify-start px-3 h-11 transition-all ${
                            isActive 
                              ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                              : item.disabled
                              ? 'text-gray-400 opacity-60 cursor-not-allowed hover:bg-transparent'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.comingSoon && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto text-[10px] px-2 py-0.5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Próximamente
                            </Badge>
                          )}
                          {item.badge && !item.comingSoon && (
                            <Badge 
                              variant="secondary" 
                              className={`ml-auto text-xs font-semibold ${
                                item.disabled 
                                  ? 'bg-gray-100 text-gray-500 border-gray-200'
                                  : 'bg-[#e7af2a] text-white border-0 shadow-sm shadow-[#e7af2a]/30'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  © 2025 RealMaker AI
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  By Betterplace
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Coming Soon Dialog - Fuera del Sheet para evitar problemas de z-index */}
      <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
        <DialogContent className="sm:max-w-[90vw] max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#e7af2a] to-[#f0c45f] flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">
              ¡Próximamente disponible!
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base mt-4">
              Estamos trabajando en una nueva funcionalidad de <span className="font-semibold text-gray-900">Página Web</span> que te permitirá crear y gestionar tu sitio web inmobiliario de forma automática.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    Características principales
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Diseño profesional y personalizable</li>
                    <li>• Integración automática con tus propiedades</li>
                    <li>• Optimizado para SEO y dispositivos móviles</li>
                    <li>• Publicación con un solo clic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              onClick={handleDialogClose}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
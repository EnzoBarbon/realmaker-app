import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Settings2, 
  Layers3, 
  ArrowLeft,
  ChevronRight,
  User,
  Shield,
  LogOut,
  Building2,
  QrCode,
  Info,
  Check,
  AlertTriangle,
  Globe,
  Sparkles,
  Rocket
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/whatsapp-icon';
import { InstagramIcon } from '../icons/instagram-icon';
import { MessengerIcon } from '../icons/messenger-icon';
import { TikTokIcon } from '../icons/tiktok-icon';

interface SettingsHubProps {
  onNavigate: (tab: string) => void;
  onBackToHub?: () => void;
  onLogout?: () => void;
  isMobile?: boolean;
}

interface Assistant {
  id: string;
  name: string;
  type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  icon: any;
  configured: boolean;
  available: boolean;
  description: string;
}

const settingsOptions = [
  {
    id: 'notifications',
    title: 'Alertas',
    description: 'Gestiona tus notificaciones y alertas del sistema',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100'
  },
  {
    id: 'website',
    title: 'Página Web',
    description: 'Crea y gestiona tu sitio web inmobiliario',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
    comingSoon: true
  },
  {
    id: 'config',
    title: 'Configuración de asistentes',
    description: 'Configura tus asistentes de IA para WhatsApp, Instagram y Messenger',
    icon: Settings2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  },
  {
    id: 'integrations',
    title: 'Conexiones',
    description: 'Conecta tus herramientas y plataformas favoritas',
    icon: Layers3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100'
  },
  {
    id: 'profile',
    title: 'Mi Perfil',
    description: 'Gestiona tu información personal y configuración de cuenta',
    icon: User,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20'
  },
  {
    id: 'admin',
    title: 'Administración',
    description: 'Gestiona usuarios, licencias y estadísticas del sistema',
    icon: Shield,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100'
  }
];

export function SettingsHub({ onNavigate, onBackToHub, onLogout, isMobile }: SettingsHubProps) {
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  // En desktop ocultar Alertas, Mi Perfil y Administración (ya están en menú principal y header)
  // En móvil mostrar todas las opciones
  const visibleOptions = isMobile 
    ? settingsOptions 
    : settingsOptions.filter(opt => opt.id !== 'notifications' && opt.id !== 'profile' && opt.id !== 'admin' && opt.id !== 'website');

  const handleOptionClick = (option: any) => {
    if (option.comingSoon && !hasSeenDialog) {
      setShowComingSoonDialog(true);
    } else {
      onNavigate(option.id);
    }
  };

  const handleDialogClose = () => {
    setShowComingSoonDialog(false);
    setHasSeenDialog(true);
    // Permitir acceso después de cerrar el diálogo
    onNavigate('website');
  };

  return (
    <>
      <div className="px-6 lg:px-8 pt-6 lg:pt-8 space-y-8 pb-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">
            {isMobile ? 'Más secciones' : 'Configuración'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isMobile 
              ? 'Accede a todas las secciones de la aplicación'
              : 'Gestiona la configuración de los asistentes y sus conexiones'
            }
          </p>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          {/* Título de sección - Solo en móvil */}
          {isMobile && (
            <div>
              <h2 className="text-gray-900">Todas las secciones</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Gestiona alertas, perfil, asistentes e integraciones
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {visibleOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <Card 
                  key={option.id}
                  className={`border-2 ${option.borderColor} hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => handleOptionClick(option)}
                >
                  <CardContent className="p-0">
                    <button className="w-full p-6 text-left flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                      {/* Icon */}
                      <div className={`${option.bgColor} p-4 rounded-xl flex-shrink-0`}>
                        <Icon className={`h-7 w-7 ${option.color}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900">
                            {option.title}
                          </h3>
                          {option.comingSoon && (
                            <Badge 
                              variant="secondary" 
                              className="text-[10px] px-2 py-0.5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Próximamente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Logout Button - Mobile Only */}
        <div className="md:hidden pb-6">
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>

      {/* Coming Soon Dialog */}
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
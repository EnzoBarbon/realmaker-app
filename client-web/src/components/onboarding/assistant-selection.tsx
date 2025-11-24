import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import Frame5980 from '../../imports/Frame5980';
import BetterplaceLogo from '../../imports/BetterplaceLogo';
import RealMakerLogo from '../../imports/RealMakerLogo';
import { 
  Phone, 
  Check,
  Clock,
  Sparkles,
  UserCheck,
  X,
  Headset
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/whatsapp-icon';
import { InstagramIcon } from '../icons/instagram-icon';
import { MessengerIcon } from '../icons/messenger-icon';
import { TikTokIcon } from '../icons/tiktok-icon';

interface AssistantSelectionProps {
  onSelectAssistant: (type: 'whatsapp' | 'email') => void;
}

export function AssistantSelection({ onSelectAssistant }: AssistantSelectionProps) {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactRequested, setContactRequested] = useState(false);

  const handleTrialClick = () => {
    setShowContactDialog(true);
  };

  const handleCloseDialog = () => {
    setContactRequested(true);
    setShowContactDialog(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col items-start">
            <div className="w-32 sm:w-36 md:w-40 lg:w-44">
              <RealMakerLogo />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-3">
            Configura tu asistente
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Configura tu asistente en minutos y comienza a atender todos tus contactos automáticamente
          </p>
        </div>

        {/* Asistente */}
        <div className="mb-12">
          <div className="max-w-lg mx-auto">
            {/* Asistente de Mensajería */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-white to-primary/5 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <CardContent className="p-8 relative">
                {/* Badge destacado */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-white border-0 shadow-md">
                    Disponible ahora
                  </Badge>
                </div>

                {/* Iconos de canales */}
                <div className="flex gap-3 mb-6">
                  <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                    <InstagramIcon className="h-8 w-8 text-[#E4405F]" />
                  </div>
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <MessengerIcon className="h-8 w-8 text-[#0084FF]" />
                  </div>
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <TikTokIcon className="h-8 w-8 text-black" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-gray-900 mb-2">
                  Asistente de Mensajería
                </h3>
                <p className="text-gray-600 mb-6">
                  Responde mensajes automáticamente, califica leads y captura información en todos tus canales
                </p>

                {/* Características */}
                <div className="space-y-3 mb-8">
                  {[
                    'Respuestas instantáneas 24/7',
                    'Calificación automática de leads',
                    'Captura de datos de clientes',
                    'Guardado automático de contactos',
                    'Integración con tu CRM'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
                  size="lg"
                  onClick={contactRequested ? () => onSelectAssistant('whatsapp') : handleTrialClick}
                >
                  {contactRequested ? (
                    <>
                      Comenzar configuración
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Prueba gratis
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trial info */}
                <p className="text-xs text-center text-gray-500 mt-3">
                  {contactRequested ? (
                    <>✅ Un agente se pondrá en contacto contigo</>
                  ) : (
                    <>🎁 7 días de prueba gratis - No requiere tarjeta</>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog para contacto */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogTitle className="sr-only">Solicitud Enviada</DialogTitle>
          <DialogDescription className="sr-only">
            Tu solicitud ha sido recibida. Un consultor se pondrá en contacto contigo pronto.
          </DialogDescription>
          
          <button
            onClick={handleCloseDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            {/* Icono de check en círculo */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Headset className="h-10 w-10 text-primary" />
            </div>

            {/* Mensaje principal */}
            <p className="text-gray-700 max-w-sm leading-relaxed mb-4">
              Uno de nuestros asesores se pondrá en contacto contigo.
            </p>
            
            {/* Horario de atención */}
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Horario de atención:</span>
              </div>
              <div className="space-y-1">
                <p>Lunes a Jueves: 9:00h a 14:00h y 15:00h a 18:30h</p>
                <p>Viernes: 08:30h a 14:30h</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

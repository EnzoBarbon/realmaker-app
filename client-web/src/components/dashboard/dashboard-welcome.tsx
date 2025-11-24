import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Phone, CheckCircle2, AlertCircle, Lightbulb, ArrowRight, Clock, Check, Info, QrCode, AlertTriangle } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";

interface Assistant {
  id: string;
  name: string;
  type: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  icon: typeof Phone;
  configured: boolean;
  available: boolean;
  description: string;
}

export function DashboardWelcome() {
  // Estados para control de conexión de asistentes
  // Leer canales conectados desde localStorage (onboarding) o usar valores por defecto
  const [assistantsState, setAssistantsState] = useState<{[key: string]: boolean}>(() => {
    const savedChannels = localStorage.getItem('connectedChannels');
    if (savedChannels) {
      try {
        const channels = JSON.parse(savedChannels);
        return {
          whatsapp: channels.whatsapp || false,
          instagram: channels.instagram || false,
          messenger: channels.messenger || false,
          tiktok: channels.tiktok || false
        };
      } catch (e) {
        // Si hay error al parsear, usar valores por defecto
        return {
          whatsapp: true,
          instagram: false,
          messenger: false,
          tiktok: false
        };
      }
    }
    // Si no hay datos guardados, usar valores por defecto
    return {
      whatsapp: true,
      instagram: false,
      messenger: false,
      tiktok: false
    };
  });

  // Estados para diálogos de conexión de canales
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [showInstagramDialog, setShowInstagramDialog] = useState(false);
  const [showMessengerDialog, setShowMessengerDialog] = useState(false);
  const [showTikTokDialog, setShowTikTokDialog] = useState(false);
  
  // Estado para diálogo de confirmación de desconexión
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [channelToDisconnect, setChannelToDisconnect] = useState<string | null>(null);
  
  // Estados para formularios de conexión
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramPassword, setInstagramPassword] = useState('');
  const [facebookEmail, setFacebookEmail] = useState('');
  const [facebookPassword, setFacebookPassword] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [tiktokPassword, setTiktokPassword] = useState('');

  // Mock data - En producción esto vendría de un estado o API
  const assistants: Assistant[] = [
    {
      id: 'whatsapp',
      name: 'Asistente WhatsApp',
      type: 'whatsapp',
      icon: WhatsAppIcon as typeof Phone,
      configured: assistantsState.whatsapp,
      available: true,
      description: 'Responde mensajes de WhatsApp al instante'
    },
    {
      id: 'instagram',
      name: 'Asistente Instagram',
      type: 'instagram',
      icon: InstagramIcon as typeof Phone,
      configured: assistantsState.instagram,
      available: true,
      description: 'Gestiona mensajes directos de Instagram automáticamente'
    },
    {
      id: 'messenger',
      name: 'Asistente Messenger',
      type: 'messenger',
      icon: MessengerIcon as typeof Phone,
      configured: assistantsState.messenger,
      available: true,
      description: 'Atiende conversaciones de Facebook Messenger'
    },
    {
      id: 'tiktok',
      name: 'Asistente TikTok',
      type: 'tiktok',
      icon: TikTokIcon as typeof Phone,
      configured: assistantsState.tiktok,
      available: true,
      description: 'Gestiona mensajes directos de TikTok automáticamente'
    }
  ];

  const configuredCount = assistants.filter(a => a.configured && a.available).length;
  const totalCount = assistants.filter(a => a.available).length;

  const handleConfigureAssistant = (assistantId: string) => {
    const assistant = assistants.find(a => a.id === assistantId);
    if (!assistant) return;

    // Si ya está conectado, mostrar diálogo de confirmación de desconexión
    if (assistant.configured) {
      setChannelToDisconnect(assistantId);
      setDisconnectDialogOpen(true);
      return;
    }

    // Si no está conectado, abrir el diálogo correspondiente
    if (assistantId === 'whatsapp') {
      setShowWhatsAppDialog(true);
    } else if (assistantId === 'instagram') {
      setShowInstagramDialog(true);
    } else if (assistantId === 'messenger') {
      setShowMessengerDialog(true);
    } else if (assistantId === 'tiktok') {
      setShowTikTokDialog(true);
    }
  };

  // Función para confirmar la desconexión
  const handleConfirmDisconnect = () => {
    if (channelToDisconnect) {
      setAssistantsState(prev => {
        const newState = {
          ...prev,
          [channelToDisconnect]: false
        };
        // Guardar en localStorage
        localStorage.setItem('connectedChannels', JSON.stringify(newState));
        return newState;
      });
    }
    setDisconnectDialogOpen(false);
    setChannelToDisconnect(null);
  };

  // Funciones para confirmar la conexión desde los diálogos
  const handleConfirmWhatsApp = () => {
    setAssistantsState(prev => {
      const newState = {
        ...prev,
        whatsapp: true
      };
      // Guardar en localStorage
      localStorage.setItem('connectedChannels', JSON.stringify(newState));
      return newState;
    });
    setShowWhatsAppDialog(false);
  };

  const handleConfirmInstagram = () => {
    setAssistantsState(prev => {
      const newState = {
        ...prev,
        instagram: true
      };
      // Guardar en localStorage
      localStorage.setItem('connectedChannels', JSON.stringify(newState));
      return newState;
    });
    setShowInstagramDialog(false);
    setInstagramUsername('');
    setInstagramPassword('');
  };

  const handleConfirmMessenger = () => {
    setAssistantsState(prev => {
      const newState = {
        ...prev,
        messenger: true
      };
      // Guardar en localStorage
      localStorage.setItem('connectedChannels', JSON.stringify(newState));
      return newState;
    });
    setShowMessengerDialog(false);
    setFacebookEmail('');
    setFacebookPassword('');
  };

  const handleConfirmTikTok = () => {
    setAssistantsState(prev => {
      const newState = {
        ...prev,
        tiktok: true
      };
      // Guardar en localStorage
      localStorage.setItem('connectedChannels', JSON.stringify(newState));
      return newState;
    });
    setShowTikTokDialog(false);
    setTiktokUsername('');
    setTiktokPassword('');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Tus Asistentes de IA</h1>
        <p className="text-gray-600">
          {configuredCount === totalCount 
            ? '¡Todos tus asistentes están configurados y listos!' 
            : `${configuredCount} de ${totalCount} asistentes configurados`}
        </p>
      </div>

      {/* Assistants Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {assistants.map((assistant) => {
          const Icon = assistant.icon;
          
          // Diseño unificado para todos los asistentes
          return (
            <Card 
              key={assistant.id} 
              className={`p-6 transition-shadow ${
                assistant.available 
                  ? 'hover:shadow-md' 
                  : 'border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    assistant.type === 'whatsapp'
                      ? 'bg-green-50 text-[#25D366]'
                      : assistant.type === 'instagram'
                      ? 'bg-pink-50 text-pink-600'
                      : assistant.type === 'messenger'
                      ? 'bg-blue-50 text-blue-600'
                      : assistant.type === 'tiktok'
                      ? 'bg-gray-100 text-gray-900'
                      : !assistant.available
                      ? 'bg-primary/10 text-primary'
                      : assistant.configured 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{assistant.name}</h3>
                    <p className="text-gray-500">{assistant.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 min-h-[40px]">
                <div className="flex items-center gap-2">
                  {assistant.configured ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                      Desconectado
                    </Badge>
                  )}
                </div>
                <Button 
                  variant={assistant.configured ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleConfigureAssistant(assistant.id)}
                  disabled={!assistant.available}
                  className={assistant.configured ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {assistant.configured ? 'Desconectar' : 'Conectar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Diálogo de conexión WhatsApp */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WhatsAppIcon className="h-5 w-5 text-green-600" />
              Conectar WhatsApp Business
            </DialogTitle>
            <DialogDescription>
              Escanea el código QR con tu dispositivo móvil
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-green-200 text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                Escanea este código QR con WhatsApp
              </p>
            </div>

            {/* Instrucciones */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-900">
                  <p className="font-medium mb-1">Pasos para conectar:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Abre WhatsApp en tu teléfono</li>
                    <li>Ve a Configuración → Dispositivos vinculados</li>
                    <li>Toca "Vincular un dispositivo"</li>
                    <li>Escanea el código QR</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWhatsAppDialog(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Conectado
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de conexión Instagram */}
      <Dialog open={showInstagramDialog} onOpenChange={setShowInstagramDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <InstagramIcon className="h-5 w-5 text-pink-600" />
              Conectar Instagram Direct
            </DialogTitle>
            <DialogDescription>
              Inicia sesión con tu cuenta de Instagram Business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Logo de Instagram */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center">
                <InstagramIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="instagram-username">Nombre de usuario o correo</Label>
                <Input
                  id="instagram-username"
                  placeholder="tu_usuario_instagram"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram-password">Contraseña</Label>
                <Input
                  id="instagram-password"
                  type="password"
                  placeholder="••••••••"
                  value={instagramPassword}
                  onChange={(e) => setInstagramPassword(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Nota de seguridad */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-pink-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-pink-900">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>
                    Tu información está segura y encriptada. Solo se usa para conectar tu asistente con Instagram Direct.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowInstagramDialog(false);
                setInstagramUsername('');
                setInstagramPassword('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmInstagram}
              disabled={!instagramUsername || !instagramPassword}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de conexión Messenger */}
      <Dialog open={showMessengerDialog} onOpenChange={setShowMessengerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessengerIcon className="h-5 w-5 text-blue-600" />
              Conectar Facebook Messenger
            </DialogTitle>
            <DialogDescription>
              Inicia sesión con tu cuenta de Facebook
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Logo de Messenger/Facebook */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <MessengerIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="facebook-email">Correo electrónico o teléfono</Label>
                <Input
                  id="facebook-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={facebookEmail}
                  onChange={(e) => setFacebookEmail(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook-password">Contraseña</Label>
                <Input
                  id="facebook-password"
                  type="password"
                  placeholder="••••••••"
                  value={facebookPassword}
                  onChange={(e) => setFacebookPassword(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-medium mb-1">Conecta tu Página de Facebook:</p>
                  <p>
                    Necesitas tener una Página de Facebook con Messenger activado para usar esta función.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowMessengerDialog(false);
                setFacebookEmail('');
                setFacebookPassword('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmMessenger}
              disabled={!facebookEmail || !facebookPassword}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de conexión TikTok */}
      <Dialog open={showTikTokDialog} onOpenChange={setShowTikTokDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TikTokIcon className="h-5 w-5 text-gray-900" />
              Conectar TikTok Direct
            </DialogTitle>
            <DialogDescription>
              Inicia sesión con tu cuenta de TikTok Business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Logo de TikTok */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                <TikTokIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="tiktok-username">Nombre de usuario o correo</Label>
                <Input
                  id="tiktok-username"
                  placeholder="tu_usuario_tiktok"
                  value={tiktokUsername}
                  onChange={(e) => setTiktokUsername(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok-password">Contraseña</Label>
                <Input
                  id="tiktok-password"
                  type="password"
                  placeholder="••••••••"
                  value={tiktokPassword}
                  onChange={(e) => setTiktokPassword(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Nota de seguridad */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-900">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>
                    Tu información está segura y encriptada. Solo se usa para conectar tu asistente con TikTok Direct.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowTikTokDialog(false);
                setTiktokUsername('');
                setTiktokPassword('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmTikTok}
              disabled={!tiktokUsername || !tiktokPassword}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
            >
              <Check className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de desconexión */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                ¿Desconectar canal?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base space-y-3 pt-2">
              <p>
                Estás a punto de desconectar <strong className="text-gray-900">
                  {channelToDisconnect === 'whatsapp' && 'WhatsApp'}
                  {channelToDisconnect === 'instagram' && 'Instagram'}
                  {channelToDisconnect === 'messenger' && 'Messenger'}
                  {channelToDisconnect === 'tiktok' && 'TikTok'}
                </strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-900">
                  <strong className="block mb-1">Importante:</strong>
                  Al desconectar este canal, dejarás de recibir conversaciones automáticamente. Los clientes que escriban no obtendrán respuesta del asistente.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Puedes volver a conectar el canal cuando lo necesites.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="m-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisconnect}
              className="bg-red-600 hover:bg-red-700 m-0"
            >
              Sí, desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

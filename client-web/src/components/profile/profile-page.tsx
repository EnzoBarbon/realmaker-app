import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { User, Mail, Phone, Building2, MapPin, Lock, Camera, Save, Instagram, MessageCircle, Send, ArrowLeft, Upload, X, Facebook, Youtube, ExternalLink, Info, Globe, Pencil } from "lucide-react";
import { toast } from "sonner";
import Frame5980 from "../../imports/Frame5980";
import { TikTokIcon } from '../icons/tiktok-icon';

export function ProfilePage({ onBackToSettings }: { onBackToSettings?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingUpdateValue, setPendingUpdateValue] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordErrorDialog, setShowPasswordErrorDialog] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPasswordSuccessDialog, setShowPasswordSuccessDialog] = useState(false);
  
  // Cargar datos de branding desde localStorage
  const savedAgencyData = localStorage.getItem('realmaker_agency_data');
  const initialAgencyData = savedAgencyData ? JSON.parse(savedAgencyData) : {
    agencyLogo: '',
    agentPhoto: '',
    agentName: 'Juan Pérez',
    agentPhone: '+34 600 123 456',
    agentEmail: 'juan.perez@miinmobiliaria.com',
    agencyName: 'Mi Inmobiliaria S.L.',
    websiteUrl: 'https://www.miinmobiliaria.com',
    instagramUrl: 'https://instagram.com/miinmobiliaria',
    facebookUrl: 'https://facebook.com/miinmobiliaria',
    tiktokUrl: 'https://tiktok.com/@miinmobiliaria',
    youtubeUrl: 'https://youtube.com/@miinmobiliaria'
  };

  const [agencyData, setAgencyData] = useState(initialAgencyData);
  
  // Estado para trackear valores originales y detectar cambios
  const [originalAgencyData, setOriginalAgencyData] = useState(initialAgencyData);
  
  // Simular canales conectados - en producción esto vendría del backend
  const [connectedChannels] = useState({
    whatsapp: true,
    instagram: true,
    messenger: false,
    tiktok: true
  });
  
  const [profileData, setProfileData] = useState({
    name: "Juan Pérez",
    email: "juan.perez@miinmobiliaria.com",
    phone: "+34 600 123 456",
    company: "Mi Inmobiliaria S.L.",
    location: "Madrid, España",
    role: "Agente Inmobiliario"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Simular contraseña actual guardada del usuario que hizo login
  // En producción esto vendría del backend/contexto de autenticación
  // Cualquier contraseña que escribas aquí será la "contraseña correcta" para validar
  const CURRENT_PASSWORD_STORED = "RealMaker2025!";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el perfil
    setIsEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que la contraseña actual sea correcta
    if (passwordData.currentPassword !== CURRENT_PASSWORD_STORED) {
      setPasswordErrorMessage("La contraseña actual no es correcta. Por favor, verifica e inténtalo de nuevo.");
      setShowPasswordErrorDialog(true);
      return;
    }
    
    // Validar que las contraseñas nuevas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMessage("Las contraseñas nuevas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.");
      setShowPasswordErrorDialog(true);
      return;
    }
    
    // Si todo es correcto, actualizar contraseña
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordSuccessDialog(true);
  };

  const handleSelectPhotoSource = (source: string) => {
    setShowPhotoDialog(false);
    toast.success(`Foto de perfil actualizada desde ${source}`);
    // Aquí iría la lógica para obtener la foto del canal seleccionado
  };

  // Función para subir foto de perfil personalizada
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        // Aquí se guardaría la foto de perfil
        setShowPhotoDialog(false);
        toast.success('Foto de perfil actualizada correctamente');
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para manejar las imágenes del branding
  const handleAgencyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande. Máximo 2MB');
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido (PNG, JPG o SVG)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        const updatedData = { ...agencyData, agencyLogo: logoUrl };
        setAgencyData(updatedData);
      };
      reader.readAsDataURL(file);
    }
    
    // Resetear el input para permitir subir el mismo archivo de nuevo
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleAgentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        const updatedData = { ...agencyData, agentPhoto: photoUrl };
        setAgencyData(updatedData);
        localStorage.setItem('realmaker_agency_data', JSON.stringify(updatedData));
        toast.success('Foto del agente actualizada correctamente');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAgencyLogo = () => {
    const updatedData = { ...agencyData, agencyLogo: '' };
    setAgencyData(updatedData);
  };

  const handleRemoveAgentPhoto = () => {
    const updatedData = { ...agencyData, agentPhoto: '' };
    setAgencyData(updatedData);
    localStorage.setItem('realmaker_agency_data', JSON.stringify(updatedData));
    toast.success('Foto del agente eliminada');
  };

  const handleAgencyDataChange = (field: string, value: string) => {
    const updatedData = { ...agencyData, [field]: value };
    setAgencyData(updatedData);
  };

  const handleSaveBrandingLogo = () => {
    localStorage.setItem('realmaker_agency_data', JSON.stringify(agencyData));
    setOriginalAgencyData(agencyData); // Actualizar valores originales después de guardar
    toast.success('Logo guardado correctamente');
  };

  const handleSaveSocialMedia = () => {
    localStorage.setItem('realmaker_agency_data', JSON.stringify(agencyData));
    setOriginalAgencyData(agencyData); // Actualizar valores originales después de guardar
    toast.success('Redes sociales guardadas correctamente');
  };

  // Función para detectar si hay cambios en el logo
  const hasLogoChanges = () => {
    return agencyData.agencyLogo !== originalAgencyData.agencyLogo;
  };

  // Función para detectar si hay cambios en las redes sociales
  const hasSocialMediaChanges = () => {
    return agencyData.websiteUrl !== originalAgencyData.websiteUrl ||
           agencyData.instagramUrl !== originalAgencyData.instagramUrl ||
           agencyData.facebookUrl !== originalAgencyData.facebookUrl ||
           agencyData.tiktokUrl !== originalAgencyData.tiktokUrl ||
           agencyData.youtubeUrl !== originalAgencyData.youtubeUrl;
  };

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      connected: connectedChannels.whatsapp,
      color: 'text-green-600'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      connected: connectedChannels.instagram,
      color: 'text-pink-600'
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: Send,
      connected: connectedChannels.messenger,
      color: 'text-blue-600'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: TikTokIcon,
      connected: connectedChannels.tiktok,
      color: 'text-gray-900'
    }
  ];

  const connectedChannelsList = channels.filter(channel => channel.connected);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Navigation */}
      {onBackToSettings && (
        <button
          onClick={onBackToSettings}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver a Más secciones</span>
        </button>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar con Avatar y Resumen */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={() => setShowPhotoDialog(true)}
                    className="absolute bottom-0 right-0 h-8 w-8 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900">{profileData.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{profileData.company}</p>
                <Badge className="mt-3 bg-green-50 text-green-700 border-green-200">
                  Cuenta Activa
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Miembro desde</p>
                <p className="text-sm text-gray-900">Enero 2025</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plan Actual</p>
                <p className="text-sm text-gray-900">Mensual</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Última Sesión</p>
                <p className="text-sm text-gray-900">Hoy a las 10:30</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                  <CardDescription className="mt-1">
                    Actualiza tus datos personales y de contacto
                  </CardDescription>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group -mt-1"
                    title="Editar información personal"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="text-sm group-hover:text-gray-600 hidden md:inline">Editar</span>
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {!isEditing ? (
                // Vista de solo lectura - diseño minimalista
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Nombre completo</p>
                    <div className="flex items-center gap-2.5">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{profileData.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Correo electrónico</p>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Teléfono</p>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{profileData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Agencia inmobiliaria</p>
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{profileData.company}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Vista de edición - mostrar campos de entrada
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="pl-11 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900">Correo electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="pl-11 h-11 bg-gray-50 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-900">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="pl-11 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-900">Agencia inmobiliaria</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          className="pl-11 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Branding de la Agencia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logo de la agencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo de la agencia */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Este logo se mostrará en las fichas de propiedades compartidas
                </p>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  {/* Vista previa del logo */}
                  <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
                    {agencyData.agencyLogo ? (
                      <div className="relative group">
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
                          <img 
                            src={agencyData.agencyLogo} 
                            alt="Logo de la agencia"
                            className="h-20 w-auto max-w-[200px] object-contain"
                          />
                        </div>
                        <button
                          onClick={handleRemoveAgencyLogo}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Eliminar logo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 w-[200px] h-[88px] flex items-center justify-center">
                        <div className="text-center">
                          <Building2 className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500">Sin logo</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botones y acciones */}
                  <div className="flex-1 w-full space-y-3">
                    <input
                      type="file"
                      id="agency-logo-upload"
                      accept="image/*"
                      onChange={handleAgencyLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('agency-logo-upload')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {agencyData.agencyLogo ? 'Cambiar logo' : 'Subir logo'}
                    </Button>
                    <p className="text-xs text-gray-500 text-center md:text-left">
                      Formatos: PNG, JPG, SVG. Tamaño recomendado: 400x100px
                    </p>
                    
                    {/* Botón para guardar logo */}
                    <Button
                      onClick={handleSaveBrandingLogo}
                      disabled={!hasLogoChanges()}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar logo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociales */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Redes Sociales y Página Web</CardTitle>
                  <CardDescription className="mt-1">
                    Añade los enlaces a tus redes sociales y página web para que aparezcan en las fichas públicas
                  </CardDescription>
                </div>
                {!isEditingSocial && (
                  <button
                    onClick={() => setIsEditingSocial(true)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors group -mt-1"
                    title="Editar redes sociales"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="text-sm group-hover:text-gray-600 hidden md:inline">Editar</span>
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {!isEditingSocial ? (
                // Vista de solo lectura
                <div className="space-y-5">
                  {/* Página Web */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Página Web</p>
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{agencyData.websiteUrl || 'No configurado'}</p>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Instagram</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="text-sm text-gray-900">{agencyData.instagramUrl || 'No configurado'}</p>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Facebook</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                        <Facebook className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="text-sm text-gray-900">{agencyData.facebookUrl || 'No configurado'}</p>
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">TikTok</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                        <TikTokIcon className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="text-sm text-gray-900">{agencyData.tiktokUrl || 'No configurado'}</p>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">YouTube</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                        <Youtube className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="text-sm text-gray-900">{agencyData.youtubeUrl || 'No configurado'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Vista de edición
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSocialMedia();
                  setIsEditingSocial(false);
                }} className="space-y-6">
                  {/* Sitio web */}
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-gray-900">Página Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="websiteUrl"
                        value={agencyData.websiteUrl || ''}
                        onChange={(e) => handleAgencyDataChange('websiteUrl', e.target.value)}
                        className="pl-11 h-11"
                        placeholder="https://www.tuinmobiliaria.com"
                      />
                    </div>
                  </div>

                  {/* Redes sociales */}
                  <div className="space-y-3">
                    <Label className="text-gray-900">Redes Sociales</Label>
                    
                    <div className="space-y-3">
                      {/* Instagram */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-32 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Instagram className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">Instagram</span>
                        </div>
                        <Input
                          id="instagramUrl"
                          value={agencyData.instagramUrl || ''}
                          onChange={(e) => handleAgencyDataChange('instagramUrl', e.target.value)}
                          className="h-11 flex-1"
                          placeholder="https://instagram.com/tuinmobiliaria"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-32 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                            <Facebook className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">Facebook</span>
                        </div>
                        <Input
                          id="facebookUrl"
                          value={agencyData.facebookUrl || ''}
                          onChange={(e) => handleAgencyDataChange('facebookUrl', e.target.value)}
                          className="h-11 flex-1"
                          placeholder="https://facebook.com/tuinmobiliaria"
                        />
                      </div>

                      {/* TikTok */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-32 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                            <TikTokIcon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">TikTok</span>
                        </div>
                        <Input
                          id="tiktokUrl"
                          value={agencyData.tiktokUrl || ''}
                          onChange={(e) => handleAgencyDataChange('tiktokUrl', e.target.value)}
                          className="h-11 flex-1"
                          placeholder="https://tiktok.com/@tuinmobiliaria"
                        />
                      </div>

                      {/* YouTube */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-32 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                            <Youtube className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">YouTube</span>
                        </div>
                        <Input
                          id="youtubeUrl"
                          value={agencyData.youtubeUrl || ''}
                          onChange={(e) => handleAgencyDataChange('youtubeUrl', e.target.value)}
                          className="h-11 flex-1"
                          placeholder="https://youtube.com/@tuinmobiliaria"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingSocial(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Introduce tu contraseña actual"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pl-10"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Repite la contraseña"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-10"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="bg-[#e7af2a] hover:bg-[#d19e25] text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e7af2a]"
                  >
                    <Lock className="h-4 w-4" />
                    Actualizar contraseña
                  </Button>
                  <p className="text-sm text-gray-500 flex items-center">
                    Se aplicarán los cambios inmediatamente
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>


          {/* Preferencias y Términos */}
          <Card>
            <CardHeader>
              <CardTitle>Preferencias y Términos</CardTitle>
              <CardDescription>
                Configuración de comunicaciones y aceptación de términos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Checkbox para recibir información */}
              <div className="flex items-start space-x-3 p-4 bg-[#e7af2a]/5 rounded-lg border border-[#e7af2a]/20">
                <Switch
                  id="receive-updates"
                  checked={receiveUpdates}
                  onCheckedChange={(checked) => {
                    setPendingUpdateValue(checked);
                    setShowConfirmDialog(true);
                  }}
                  className="mt-0.5 data-[state=checked]:bg-[#e7af2a]"
                />
                <label
                  htmlFor="receive-updates"
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  Deseo recibir información sobre las mejoras, actualizaciones y cambios en la aplicación además de comunicaciones promocionales.
                </label>
              </div>

              {/* Información de aceptación de términos */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  (*) Has aceptado las{' '}
                  <a href="#" className="text-[#e7af2a] hover:text-[#d19e25] underline">
                    condiciones generales
                  </a>
                  {' '}y la{' '}
                  <a href="#" className="text-[#e7af2a] hover:text-[#d19e25] underline">
                    política de privacidad
                  </a>
                  {' '}el día <span className="font-medium text-gray-900">13-11-2023</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Suscripción */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Suscripción</CardTitle>
              <CardDescription>
                Administra tu suscripción desde Betterplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pastilla informativa */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-900">
                      <strong>RealMaker AI</strong> es una aplicación de Betterplace. Tu suscripción se gestiona desde el panel de administración de Betterplace.
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>¿Cómo acceder?</strong>
                      </p>
                      <ol className="text-sm text-gray-700 space-y-1.5 pl-1">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</span>
                          <span className="flex-1 pt-0.5">Accede a <a href="https://betterplaceapp.com/feature/dashboard/subscription" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Betterplace</a></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</span>
                          <span className="flex-1 pt-0.5">Ve a <strong>Mi cuenta</strong> → <strong>Suscripción</strong></span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Botón de acceso directo */}
                <div className="pt-1">
                  <a 
                    href="https://betterplaceapp.com/feature/dashboard/subscription" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto"
                  >
                    <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 w-full sm:w-auto">
                      <ExternalLink className="h-4 w-4" />
                      Ir a Gestión de Suscripción
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Diálogo para seleccionar foto de perfil */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleccionar foto de perfil</DialogTitle>
            <DialogDescription>
              Elige de qué canal quieres usar la foto de perfil
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {connectedChannelsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No tienes canales conectados. Conecta al menos un canal para usar su foto de perfil.
                </p>
              </div>
            ) : (
              connectedChannelsList.map((channel) => {
                const Icon = channel.icon;
                const isSvgComponent = channel.id === 'tiktok';
                
                return (
                  <button
                    key={channel.id}
                    onClick={() => handleSelectPhotoSource(channel.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#e7af2a] hover:bg-[#e7af2a]/5 transition-all group"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white transition-colors ${channel.color}`}>
                      {isSvgComponent ? (
                        <div className="w-6 h-6">
                          <Icon />
                        </div>
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{channel.name}</p>
                      <p className="text-xs text-gray-500">Usar foto de perfil de {channel.name}</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-[#e7af2a] transition-colors">
                      <Camera className="w-5 h-5" />
                    </div>
                  </button>
                );
              })
            )}
            <button
              onClick={() => document.getElementById('profile-photo-upload')?.click()}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#e7af2a] hover:bg-[#e7af2a]/5 transition-all group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Subir foto personalizada</p>
                <p className="text-xs text-gray-500">Usar una foto de tu dispositivo</p>
              </div>
              <div className="text-gray-400 group-hover:text-[#e7af2a] transition-colors">
                <Upload className="w-5 h-5" />
              </div>
            </button>
            <input
              type="file"
              id="profile-photo-upload"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              className="hidden"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para recibir actualizaciones */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cambio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas {pendingUpdateValue ? 'recibir' : 'dejar de recibir'} actualizaciones y comunicaciones promocionales?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setReceiveUpdates(pendingUpdateValue);
                setShowConfirmDialog(false);
                setSuccessMessage(pendingUpdateValue ? "Tu preferencia ha sido actualizada. A partir de ahora recibirás actualizaciones y comunicaciones promocionales." : "Tu preferencia ha sido actualizada. Ya no recibirás actualizaciones ni comunicaciones promocionales.");
                setShowSuccessDialog(true);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Operación Exitosa</AlertDialogTitle>
            <AlertDialogDescription>
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSuccessDialog(false)}
            >
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de error de contraseña */}
      <AlertDialog open={showPasswordErrorDialog} onOpenChange={setShowPasswordErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error de Contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              {passwordErrorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowPasswordErrorDialog(false)}
            >
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de éxito de contraseña */}
      <AlertDialog open={showPasswordSuccessDialog} onOpenChange={setShowPasswordSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Contraseña Actualizada</AlertDialogTitle>
            <AlertDialogDescription>
              Tu contraseña ha sido actualizada correctamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowPasswordSuccessDialog(false)}
            >
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
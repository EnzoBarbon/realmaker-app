import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, Mail, Phone, Building2, MapPin, Globe, Save, Upload, Bell, Shield, CreditCard, ArrowLeft, Instagram, Facebook, Youtube } from "lucide-react";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { TikTokIcon } from '../icons/tiktok-icon';

export function AccountPage({ onBackToSettings }: { onBackToSettings?: () => void }) {
  // Cargar datos guardados de localStorage
  const savedAgencyData = localStorage.getItem('realmaker_agency_data');
  const initialAgencyData = savedAgencyData ? JSON.parse(savedAgencyData) : {
    agencyLogo: 'https://images.unsplash.com/photo-1689869432627-e538fdd88f14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbmN5JTIwbG9nb3xlbnwxfHx8fDE3NjI5NjkwMjh8MA&ixlib=rb-4.1.0&q=80&w=400',
    agentPhoto: '',
    agentName: 'María García',
    agentPhone: '+34 612 345 678',
    agentEmail: 'maria.garcia@inmobiliaria.com',
    agencyName: 'García Propiedades'
  };

  const [profileData, setProfileData] = useState({
    name: 'María García',
    email: 'maria.garcia@inmobiliaria.com',
    phone: '+34 612 345 678',
    company: 'García Propiedades',
    location: 'Madrid, España',
    website: 'www.garciaprops.com'
  });

  const [agencyData, setAgencyData] = useState(initialAgencyData);

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailMessages: true,
    pushLeads: false,
    pushMessages: true,
    weeklyReport: true
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgencyDataChange = (field: string, value: string) => {
    setAgencyData((prev: typeof initialAgencyData) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: 'agencyLogo' | 'agentPhoto', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande. Máximo 2MB');
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updatedData = { ...agencyData, [field]: result };
        setAgencyData(updatedData);
        // Guardar automáticamente en localStorage
        localStorage.setItem('realmaker_agency_data', JSON.stringify(updatedData));
        
        // Mostrar toast de confirmación
        const fieldName = field === 'agencyLogo' ? 'Logo de la agencia' : 'Foto del agente';
        toast.success(`${fieldName} guardado correctamente`);
      };
      reader.readAsDataURL(file);
    }
    
    // Resetear el input para permitir subir el mismo archivo de nuevo
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSaveProfile = () => {
    // Guardar datos de la agencia en localStorage
    localStorage.setItem('realmaker_agency_data', JSON.stringify(agencyData));
    // Aquí iría la lógica para guardar los datos del perfil
    toast.success('Perfil actualizado correctamente');
  };

  return (
    <div className="space-y-6">
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
        <h1>Mi Cuenta</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      {/* Información del Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Cambiar Foto
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG o GIF. Máximo 2MB
              </p>
            </div>
          </div>

          <Separator />

          {/* Formulario de Datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa / Inmobiliaria</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Datos para Fichas Públicas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Datos para Fichas Públicas</CardTitle>
          </div>
          <CardDescription>
            Esta información aparecerá en las fichas que compartas públicamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo de la Agencia */}
          <div className="space-y-3">
            <Label>Logo de la Agencia</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {agencyData.agencyLogo ? (
                <div className="h-24 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white p-2 flex-shrink-0">
                  <img 
                    src={agencyData.agencyLogo} 
                    alt="Logo de la agencia" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-24 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="file"
                  id="agencyLogo"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('agencyLogo', e)}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 mb-2 w-full sm:w-auto"
                  onClick={() => document.getElementById('agencyLogo')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {agencyData.agencyLogo ? 'Cambiar Logo' : 'Subir Logo'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG o JPG. Recomendado 400x200px. Máximo 2MB
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Foto del Agente */}
          <div className="space-y-3">
            <Label>Foto del Agente</Label>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                {agencyData.agentPhoto ? (
                  <AvatarImage src={agencyData.agentPhoto} />
                ) : (
                  <>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" />
                    <AvatarFallback>AG</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1">
                <input
                  type="file"
                  id="agentPhoto"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('agentPhoto', e)}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 mb-2"
                  onClick={() => document.getElementById('agentPhoto')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {agencyData.agentPhoto ? 'Cambiar Foto' : 'Subir Foto'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG o PNG. Tamaño cuadrado recomendado. Máximo 2MB
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Datos de Contacto del Agente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Nombre del Agente</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="agentName"
                  value={agencyData.agentName}
                  onChange={(e) => handleAgencyDataChange('agentName', e.target.value)}
                  className="pl-10"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Nombre de la Agencia</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="agencyName"
                  value={agencyData.agencyName}
                  onChange={(e) => handleAgencyDataChange('agencyName', e.target.value)}
                  className="pl-10"
                  placeholder="Nombre de tu inmobiliaria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentPhone">Teléfono del Agente</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="agentPhone"
                  value={agencyData.agentPhone}
                  onChange={(e) => handleAgencyDataChange('agentPhone', e.target.value)}
                  className="pl-10"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentEmail">Email del Agente</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="agentEmail"
                  type="email"
                  value={agencyData.agentEmail}
                  onChange={(e) => handleAgencyDataChange('agentEmail', e.target.value)}
                  className="pl-10"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Redes Sociales */}
          <div className="space-y-4">
            <div>
              <Label className="text-base">Redes Sociales y Página Web</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Añade los enlaces a tus redes sociales y página web para que aparezcan en las fichas públicas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Página Web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="websiteUrl"
                    value={agencyData.websiteUrl || ''}
                    onChange={(e) => handleAgencyDataChange('websiteUrl', e.target.value)}
                    className="pl-10"
                    placeholder="https://www.tu-web.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="instagramUrl"
                    value={agencyData.instagramUrl || ''}
                    onChange={(e) => handleAgencyDataChange('instagramUrl', e.target.value)}
                    className="pl-10"
                    placeholder="https://instagram.com/tu-usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="facebookUrl"
                    value={agencyData.facebookUrl || ''}
                    onChange={(e) => handleAgencyDataChange('facebookUrl', e.target.value)}
                    className="pl-10"
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktokUrl">TikTok</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <TikTokIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="tiktokUrl"
                    value={agencyData.tiktokUrl || ''}
                    onChange={(e) => handleAgencyDataChange('tiktokUrl', e.target.value)}
                    className="pl-10"
                    placeholder="https://tiktok.com/@tu-usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="youtubeUrl"
                    value={agencyData.youtubeUrl || ''}
                    onChange={(e) => handleAgencyDataChange('youtubeUrl', e.target.value)}
                    className="pl-10"
                    placeholder="https://youtube.com/@tu-canal"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Consejo:</strong> Estos datos aparecerán en todas las fichas que compartas públicamente. Asegúrate de que estén actualizados para que los clientes potenciales puedan contactarte fácilmente.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Seguridad</CardTitle>
          </div>
          <CardDescription>
            Gestiona la seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Contraseña</Label>
              <p className="text-sm text-muted-foreground">
                Última actualización hace 3 meses
              </p>
            </div>
            <Button variant="outline" size="sm">
              Cambiar Contraseña
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticación de Dos Factores</Label>
              <p className="text-sm text-muted-foreground">
                Añade una capa extra de seguridad
              </p>
            </div>
            <Button variant="outline" size="sm">
              Activar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Sesiones Activas</Label>
              <p className="text-sm text-muted-foreground">
                3 dispositivos conectados
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ver Sesiones
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
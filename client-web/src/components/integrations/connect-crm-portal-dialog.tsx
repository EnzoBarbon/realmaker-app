import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Home,
  ExternalLink,
  AlertCircle,
  Building2,
  Key,
  Link as LinkIcon,
  User
} from "lucide-react";
import { toast } from 'sonner@2.0.3';

interface ConnectCrmPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'crm' | 'portal';
  crmName?: string;
  onCrmNameChange?: (name: string) => void;
  onSaveName?: (name: string) => void;
}

type Step = 'crm-name' | 'select-type' | 'enter-credentials' | 'loading' | 'preview' | 'error';
type ConnectionType = 'idealista' | 'fotocasa' | 'crm';

interface ImportedProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  type: string;
}

export function ConnectCrmPortalDialog({ 
  open, 
  onOpenChange, 
  mode,
  crmName,
  onCrmNameChange,
  onSaveName
}: ConnectCrmPortalDialogProps) {
  // Inicializar el paso correcto dependiendo del modo usando una función
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (mode === 'crm' && !crmName) return 'crm-name';
    if (mode === 'portal') return 'select-type';
    return 'enter-credentials';
  });
  const [selectedType, setSelectedType] = useState<ConnectionType | null>(() => mode === 'crm' ? 'crm' : null);
  const [localCrmName, setLocalCrmName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedProperties, setImportedProperties] = useState<ImportedProperty[]>([]);

  // Resetear el diálogo cuando se abre
  useEffect(() => {
    if (open) {
      // Resetear el paso inicial
      if (mode === 'crm' && !crmName) {
        setCurrentStep('crm-name');
      } else if (mode === 'portal') {
        setCurrentStep('select-type');
      } else {
        setCurrentStep('enter-credentials');
      }
      
      // Resetear otros estados
      setSelectedType(mode === 'crm' ? 'crm' : null);
      setLocalCrmName('');
      setProfileUrl('');
      setApiKey('');
      setApiSecret('');
      setErrorMessage('');
      setImportedProperties([]);
    }
  }, [open, mode, crmName]);

  // Simular propiedades importadas
  const mockProperties: ImportedProperty[] = [
    {
      id: '1',
      title: 'Piso en Salamanca',
      address: 'Calle Serrano 45, Madrid',
      price: 450000,
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      type: 'piso'
    },
    {
      id: '2',
      title: 'Chalet en Pozuelo',
      address: 'Urbanización Las Rozas, Pozuelo de Alarcón',
      price: 850000,
      bedrooms: 5,
      bathrooms: 3,
      size: 280,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
      type: 'chalet'
    },
    {
      id: '3',
      title: 'Apartamento en Centro',
      address: 'Plaza Mayor 12, Madrid',
      price: 320000,
      bedrooms: 2,
      bathrooms: 1,
      size: 85,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      type: 'apartamento'
    }
  ];

  const handleClose = () => {
    setCurrentStep('select-type');
    setSelectedType(null);
    setProfileUrl('');
    setApiKey('');
    setApiSecret('');
    setErrorMessage('');
    setImportedProperties([]);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (currentStep === 'enter-credentials') {
      if (mode === 'portal') {
        setCurrentStep('select-type');
        setSelectedType(null);
      } else {
        handleClose();
      }
    } else if (currentStep === 'error') {
      setCurrentStep('enter-credentials');
      setErrorMessage('');
    }
  };

  const handleSelectType = (type: ConnectionType) => {
    setSelectedType(type);
    setCurrentStep('enter-credentials');
  };

  const handleConnect = async () => {
    // Validaciones
    if (mode === 'portal' && !profileUrl.trim()) {
      toast.error('Por favor, introduce la URL de tu perfil');
      return;
    }

    if (mode === 'crm' && (!apiKey.trim() || !apiSecret.trim())) {
      toast.error('Por favor, introduce tu API Key y API Secret');
      return;
    }

    // Simular carga
    setCurrentStep('loading');

    setTimeout(() => {
      // Simular éxito o error aleatorio (90% éxito)
      const success = Math.random() > 0.1;

      if (success) {
        setImportedProperties(mockProperties);
        setCurrentStep('preview');
      } else {
        setErrorMessage('No se pudo conectar con el servicio');
        setCurrentStep('error');
      }
    }, 2500);
  };

  const handleConfirmImport = () => {
    toast.success(`${importedProperties.length} propiedades importadas correctamente`);
    handleClose();
  };

  const getTypeLabel = () => {
    if (selectedType === 'idealista') return 'Idealista';
    if (selectedType === 'fotocasa') return 'Fotocasa';
    return crmName || 'CRM';
  };

  const getTypeIcon = () => {
    if (selectedType === 'idealista') return '🟢';
    if (selectedType === 'fotocasa') return '📷';
    return '💼';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header fijo */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
              <Plus className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl text-gray-900 mb-1 sm:mb-1">
                {currentStep === 'preview' 
                  ? 'Confirmar importación' 
                  : mode === 'portal' 
                    ? 'Conectar Portal Inmobiliario'
                    : `Conectar ${crmName || 'CRM'}`
                }
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-sm text-gray-600">
                {currentStep === 'crm-name' && 'Indícanos qué CRM utilizas en tu inmobiliaria'}
                {currentStep === 'select-type' && 'Selecciona el portal inmobiliario que quieres conectar'}
                {currentStep === 'enter-credentials' && mode === 'portal' && `Introduce la URL de tu perfil de ${getTypeLabel()}`}
                {currentStep === 'enter-credentials' && mode === 'crm' && `Introduce las credenciales de API de ${getTypeLabel()}`}
                {currentStep === 'loading' && 'Conectando y buscando propiedades...'}
                {currentStep === 'preview' && 'Revisa las propiedades encontradas y confirma la importación'}
                {currentStep === 'error' && 'Error al conectar'}
              </DialogDescription>
            </div>
          </div>

          {/* Stepper - Solo visible en pasos intermedios */}
          {currentStep !== 'select-type' && currentStep !== 'error' && (
            <div className="flex items-center gap-2 mt-4 sm:mt-5">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0 ${
                  currentStep === 'enter-credentials' || currentStep === 'loading' || currentStep === 'preview'
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep === 'loading' || currentStep === 'preview' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <span className="text-xs sm:text-sm">1</span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm text-gray-700">
                  {mode === 'portal' ? 'URL' : 'Credenciales'}
                </span>
              </div>

              {/* Connector */}
              <div className={`h-0.5 w-8 sm:w-12 flex-shrink-0 ${
                currentStep === 'preview' ? 'bg-primary' : 'bg-gray-200'
              }`} />

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0 ${
                  currentStep === 'preview'
                    ? 'bg-primary text-white' 
                    : currentStep === 'loading'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep === 'preview' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : currentStep === 'loading' ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <span className="text-xs sm:text-sm">2</span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm text-gray-700">Importar</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* Step 0: Pedir nombre del CRM (solo para modo CRM sin nombre) */}
          {currentStep === 'crm-name' && mode === 'crm' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900">
                    Indícanos qué CRM utilizas para configurar la integración correctamente
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm-name" className="text-sm font-medium text-gray-900">
                  Nombre del CRM
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="crm-name"
                    type="text"
                    placeholder="Ej: Salesforce, HubSpot, Zoho..."
                    value={localCrmName}
                    onChange={(e) => setLocalCrmName(e.target.value)}
                    className="pl-10 h-11"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Indica el nombre del CRM que utilizas en tu inmobiliaria
                </p>
              </div>

              {/* Ejemplos de CRMs */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {['Salesforce', 'HubSpot', 'Zoho CRM', 'Pipedrive'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setLocalCrmName(name)}
                    className="p-3 text-sm text-left border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Seleccionar tipo de portal (solo para modo portal) */}
          {currentStep === 'select-type' && mode === 'portal' && (
            <div className="space-y-3">
              {/* Idealista */}
              <button
                onClick={() => handleSelectType('idealista')}
                className="w-full group"
              >
                <div className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-lime-500/10 flex items-center justify-center text-3xl sm:text-4xl">
                      🟢
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Idealista</h3>
                    <p className="text-sm text-gray-600">
                      Conecta tu perfil de Idealista para importar tus propiedades
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </button>

              {/* Fotocasa */}
              <button
                onClick={() => handleSelectType('fotocasa')}
                className="w-full group"
              >
                <div className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-500/10 flex items-center justify-center text-3xl sm:text-4xl">
                      📷
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Fotocasa</h3>
                    <p className="text-sm text-gray-600">
                      Conecta tu perfil de Fotocasa para importar tus propiedades
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Ingresar credenciales */}
          {currentStep === 'enter-credentials' && (
            <div className="space-y-4">
              {/* Banner informativo */}
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900">
                    {mode === 'portal' 
                      ? `Copia la URL completa de tu perfil de ${getTypeLabel()} para importar automáticamente todas tus propiedades publicadas.`
                      : `Introduce tus credenciales de API para conectar ${getTypeLabel()} y sincronizar tus propiedades automáticamente.`
                    }
                  </p>
                </div>
              </div>

              {mode === 'portal' ? (
                // Campo para URL del portal
                <div className="space-y-2">
                  <Label htmlFor="profile-url" className="text-sm font-medium text-gray-900">
                    URL de tu perfil
                  </Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="profile-url"
                      type="url"
                      placeholder={
                        selectedType === 'idealista' 
                          ? 'https://www.idealista.com/profesional/...'
                          : 'https://www.fotocasa.es/profesional/...'
                      }
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Pega aquí la URL completa de tu perfil profesional
                  </p>
                </div>
              ) : (
                // Campos para credenciales de CRM
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api-key" className="text-sm font-medium text-gray-900">
                      API Key
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="api-key"
                        type="text"
                        placeholder="Introduce tu API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pl-10 h-11 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-secret" className="text-sm font-medium text-gray-900">
                      API Secret
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="api-secret"
                        type="password"
                        placeholder="Introduce tu API Secret"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="pl-10 h-11 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      Puedes encontrar tus credenciales de API en la sección de configuración de {getTypeLabel()}
                    </p>
                  </div>
                </>
              )}

              {/* Ejemplo visual */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{getTypeIcon()}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {getTypeLabel()}
                    </p>
                    <p className="text-xs text-gray-600">
                      Una vez conectado, sincronizaremos automáticamente tus propiedades
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Loading */}
          {currentStep === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin" />
                </div>
              </div>
              
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Conectando con {getTypeLabel()}
                </h3>
                <p className="text-sm text-gray-600">
                  Estamos buscando y cargando tus propiedades publicadas...
                </p>
              </div>

              {/* Barra de progreso animada */}
              <div className="w-full max-w-xs mt-8">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview - Propiedades encontradas */}
          {currentStep === 'preview' && (
            <div className="space-y-4">
              {/* Resumen */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    ¡Conexión exitosa!
                  </p>
                  <p className="text-sm text-green-700">
                    Se encontraron <span className="font-semibold">{importedProperties.length} propiedades</span> en tu perfil de {getTypeLabel()}
                  </p>
                </div>
              </div>

              {/* Lista de propiedades */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Propiedades a importar ({importedProperties.length})
                </h4>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {importedProperties.map((property) => (
                    <div 
                      key={property.id}
                      className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-900 mb-1 truncate">
                          {property.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 truncate">
                          {property.address}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            {property.bedrooms} hab
                          </span>
                          <span>•</span>
                          <span>{property.bathrooms} baños</span>
                          <span>•</span>
                          <span>{property.size} m²</span>
                        </div>
                      </div>
                      <div className="flex items-start flex-shrink-0">
                        <p className="text-sm font-semibold text-primary">
                          {property.price.toLocaleString('es-ES')}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">
                  Las propiedades se sincronizarán automáticamente y estarán disponibles para tu asistente de IA
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {currentStep === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-6">
              {/* Icono de error */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-orange-600" />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-lg text-gray-900">
                  No se pudo establecer la conexión
                </h3>
                <p className="text-sm text-gray-600">
                  Verifica que {mode === 'portal' ? 'la URL sea correcta y' : 'las credenciales sean válidas y'} que tu perfil esté activo.
                </p>
              </div>

              {/* Información proporcionada */}
              {mode === 'portal' && profileUrl && (
                <div className="w-full">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">URL introducida:</p>
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <code className="text-xs text-gray-700 break-all">
                        {profileUrl}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
          {currentStep !== 'loading' && (
            <>
              <div className="flex-shrink-0">
                {(currentStep === 'enter-credentials' || currentStep === 'error') && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-1.5 h-9 sm:h-10 px-3 sm:px-4"
                    size="sm"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Atrás</span>
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                
                {currentStep === 'crm-name' && (
                  <Button
                    onClick={() => {
                      if (!localCrmName.trim()) {
                        toast.error('Por favor, introduce el nombre del CRM');
                        return;
                      }
                      if (onSaveName) {
                        onSaveName(localCrmName);
                      }
                      setCurrentStep('enter-credentials');
                    }}
                    disabled={!localCrmName.trim()}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Continuar
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                
                {currentStep === 'enter-credentials' && (
                  <Button
                    onClick={handleConnect}
                    disabled={mode === 'portal' ? !profileUrl.trim() : (!apiKey.trim() || !apiSecret.trim())}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Conectar
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}

                {currentStep === 'error' && (
                  <Button
                    onClick={() => {
                      setCurrentStep('enter-credentials');
                      setErrorMessage('');
                    }}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Intentar de nuevo
                  </Button>
                )}

                {currentStep === 'preview' && (
                  <Button
                    onClick={handleConfirmImport}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Importar {importedProperties.length} propiedades
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
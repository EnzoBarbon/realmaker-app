import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Switch } from '../ui/switch';
import {
  Bell,
  Plus,
  Mail,
  Smartphone,
  Edit,
  Trash2,
  Home,
  DollarSign,
  Key,
  Building2,
  Star,
  AlertCircle,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
  Eye,
  CheckCircle,
  BarChart3,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Zap,
  Target
} from 'lucide-react';

export interface Notification {
  id: string;
  name: string;
  types: ('push' | 'email')[];
  type: 'qualification' | 'property-match';
  role: 'buyer' | 'seller' | 'renter' | 'landlord' | 'all';
  qualification: 'very-qualified' | 'qualified' | 'little-qualified' | 'very-little-qualified' | 'all';
  enabled: boolean;
  createdAt: string;
  newContactsCount?: number;
  totalContactsCount?: number;
  propertyId?: string;
  propertyName?: string;
}

interface NotificationsPageProps {
  onAlertClick?: (alertId: string) => void;
  onBackToSettings?: () => void;
}

const roleConfig = {
  buyer: { label: 'Comprador', icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  seller: { label: 'Vendedor', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  renter: { label: 'Inquilino', icon: Key, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  landlord: { label: 'Arrendador', icon: Building2, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  all: { label: 'Todos los roles', icon: Star, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
};

const qualificationConfig = {
  'very-qualified': { label: 'Mín. 75%', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: Star },
  qualified: { label: 'Mín. 50%', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', icon: CheckCircle },
  'little-qualified': { label: 'Mín. 25%', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: BarChart3 },
  'very-little-qualified': { label: 'Cualquier nivel', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: AlertCircle },
  all: { label: 'Cualquier nivel', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: Star }
};

export function NotificationsPage({ onAlertClick, onBackToSettings }: NotificationsPageProps) {
  // Estado inicial de las notificaciones (sin contadores)
  const initialNotifications: Notification[] = [
    {
      id: '1',
      name: 'Compradores muy cualificados',
      types: ['email', 'push'],
      type: 'qualification',
      role: 'buyer',
      qualification: 'very-qualified',
      enabled: true,
      createdAt: '2025-10-25',
      newContactsCount: 3,
      totalContactsCount: 8
    },
    {
      id: '2',
      name: 'Todos los leads cualificados',
      types: ['push'],
      type: 'qualification',
      role: 'all',
      qualification: 'qualified',
      enabled: true,
      createdAt: '2025-10-26',
      newContactsCount: 2,
      totalContactsCount: 15
    },
    {
      id: '3',
      name: 'Interesados en Piso Salamanca',
      types: ['email', 'push'],
      type: 'property-match',
      role: 'buyer',
      qualification: 'very-qualified',
      enabled: true,
      createdAt: '2025-11-01',
      propertyId: 'prop-1',
      propertyName: 'Piso lujo Salamanca',
      newContactsCount: 1,
      totalContactsCount: 1
    }
  ];

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Cargar estado desde sessionStorage al montar el componente
  useEffect(() => {
    const viewedAlertsSession = sessionStorage.getItem('realmaker_viewed_alerts_session');
    
    if (viewedAlertsSession) {
      try {
        const viewedIds = JSON.parse(viewedAlertsSession) as string[];
        
        // Actualizar notificaciones: ocultar las que ya fueron vistas en esta sesión
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => {
            if (viewedIds.includes(notification.id)) {
              // Si ya fue vista en esta sesión, poner contador a 0
              return {
                ...notification,
                newContactsCount: 0
              };
            }
            
            // Si no fue vista, mantener el contador original
            return notification;
          })
        );
      } catch (error) {
        console.error('Error al cargar alertas vistas desde sessionStorage:', error);
      }
    }
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  
  // Wizard step (3 steps for property-match, 2 for qualification)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  
  // Form states
  const [formAlertType, setFormAlertType] = useState<'qualification' | 'property-match' | null>(null);
  const [formName, setFormName] = useState('');
  const [formTypes, setFormTypes] = useState<('push' | 'email')[]>(['push']);
  const [formRole, setFormRole] = useState<'buyer' | 'seller' | 'renter' | 'landlord' | 'all'>('all');
  const [formQualification, setFormQualification] = useState<'very-qualified' | 'qualified' | 'little-qualified' | 'very-little-qualified' | 'all'>('all');
  const [formPropertyId, setFormPropertyId] = useState<string>('');

  // Mock properties data with images
  const mockProperties = [
    { 
      id: 'prop-1', 
      name: 'Piso lujo Salamanca', 
      description: '180m², 4 hab, 3 baños',
      price: '850.000€', 
      type: 'sale' as const,
      image: 'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI5Mjc5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 'prop-2', 
      name: 'Ático Chamberí', 
      description: '3 habitaciones, terraza 50m²',
      price: '1.200€/mes', 
      type: 'rent' as const,
      image: 'https://images.unsplash.com/photo-1760611656071-a8bef0578874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjB2aWV3fGVufDF8fHx8MTc2MjkyNTQzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 'prop-3', 
      name: 'Casa adosada Pozuelo', 
      description: '250m², jardín, garaje 2 coches',
      price: '1.250.000€', 
      type: 'sale' as const,
      image: 'https://images.unsplash.com/photo-1656712193274-d391a185fde6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjI4NDU3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 'prop-4', 
      name: 'Estudio Malasaña', 
      description: '45m², recién reformado',
      price: '900€/mes', 
      type: 'rent' as const,
      image: 'https://images.unsplash.com/photo-1652882861109-570be85c2b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2Mjk1ODc1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ];

  const resetForm = () => {
    setFormAlertType(null);
    setFormName('');
    setFormTypes(['push']);
    setFormRole('all');
    setFormQualification('all');
    setFormPropertyId('');
    setEditingNotification(null);
    setWizardStep(1);
  };

  const handleOpenDialog = (notification?: Notification) => {
    if (notification) {
      setEditingNotification(notification);
      setFormName(notification.name);
      setFormTypes(notification.types);
      setFormRole(notification.role);
      setFormQualification(notification.qualification);
      setFormPropertyId(notification.propertyId || '');
      setFormAlertType(notification.type);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const toggleFormType = (type: 'push' | 'email') => {
    setFormTypes(prev => {
      if (prev.includes(type)) {
        // Solo permite deseleccionar si hay más de uno seleccionado
        if (prev.length > 1) {
          return prev.filter(t => t !== type);
        }
        return prev;
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSaveNotification = () => {
    if (!formName.trim() || formTypes.length === 0) return;

    if (editingNotification) {
      // Edit existing
      const selectedProperty = mockProperties.find(p => p.id === formPropertyId);
      setNotifications(notifications.map(n => 
        n.id === editingNotification.id
          ? { 
              ...n, 
              name: formName, 
              types: formTypes, 
              role: formRole, 
              qualification: formQualification, 
              propertyId: formPropertyId, 
              propertyName: selectedProperty?.name,
              type: formAlertType || 'qualification' 
            }
          : n
      ));
    } else {
      // Create new
      const selectedProperty = mockProperties.find(p => p.id === formPropertyId);
      const newNotification: Notification = {
        id: Date.now().toString(),
        name: formName,
        types: formTypes,
        type: formAlertType || 'qualification',
        role: formRole,
        qualification: formQualification,
        enabled: true,
        createdAt: new Date().toISOString().split('T')[0],
        propertyId: formPropertyId,
        propertyName: selectedProperty?.name
      };
      setNotifications([...notifications, newNotification]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteNotification = (notification: Notification) => {
    setNotificationToDelete(notification);
    setShowDeleteDialog(true);
  };

  const confirmDeleteNotification = () => {
    if (!notificationToDelete) return;
    setNotifications(notifications.filter(n => n.id !== notificationToDelete.id));
    setShowDeleteDialog(false);
    setNotificationToDelete(null);
  };

  const handleViewResults = (notificationId: string) => {
    // Resetear el contador de nuevas alertas a 0 cuando se hace clic
    setNotifications(notifications.map(n => 
      n.id === notificationId
        ? { ...n, newContactsCount: 0 }
        : n
    ));
    
    // Guardar en sessionStorage que esta alerta fue visitada
    try {
      const viewedAlertsSession = sessionStorage.getItem('realmaker_viewed_alerts_session');
      const viewedIds = viewedAlertsSession ? JSON.parse(viewedAlertsSession) : [];
      
      if (!viewedIds.includes(notificationId)) {
        viewedIds.push(notificationId);
        sessionStorage.setItem('realmaker_viewed_alerts_session', JSON.stringify(viewedIds));
      }
    } catch (error) {
      console.error('Error al guardar visita en sessionStorage:', error);
    }
    
    // Llamar al callback si existe
    if (onAlertClick) {
      onAlertClick(notificationId);
    }
  };

  const getRoleIcon = (role: string) => {
    const config = roleConfig[role as keyof typeof roleConfig];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      {onBackToSettings && (
        <button
          onClick={onBackToSettings}
          className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver a Más secciones</span>
        </button>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alertas</h1>
          <p className="text-gray-600 mt-1">
            Configura alertas para recibir notificaciones sobre leads importantes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingNotification ? 'Editar alerta' : 'Crear nueva alerta'}
              </DialogTitle>
              <DialogDescription>
                {wizardStep === 1 ? (
                  'Selecciona el tipo de alerta que deseas configurar'
                ) : wizardStep === 2 ? (
                  'Elige la propiedad sobre la que quieres recibir notificaciones'
                ) : (
                  formAlertType === 'qualification' 
                    ? 'Configura los detalles de tu alerta de cualificación'
                    : 'Configura los detalles de tu alerta de propiedad'
                )}
              </DialogDescription>
            </DialogHeader>

            {!editingNotification && wizardStep === 1 ? (
              /* PASO 1: Seleccionar tipo de alerta */
              <div className="space-y-4 py-4">
                <div className="grid gap-3">
                  {/* Alerta por cualificación */}
                  <button
                    onClick={() => {
                      setFormAlertType('qualification');
                      setWizardStep(3); // Skip step 2 for qualification
                      setFormRole('all');
                      setFormQualification('very-qualified');
                    }}
                    className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 pt-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 mb-1">Alerta por cualificación</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Notifícame cuando un lead (comprador, vendedor, inquilino...) alcance un nivel de cualificación específico
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <Badge variant="outline" className="bg-blue-50 border-blue-200">
                          <Star className="h-3 w-3 text-blue-600 mr-1" />
                          <span className="text-blue-600">Nivel de cualificación</span>
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="hidden sm:block h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </button>

                  {/* Alerta por match de propiedad */}
                  <button
                    onClick={() => {
                      setFormAlertType('property-match');
                      setWizardStep(2);
                      setFormRole('buyer');
                      setFormQualification('all');
                    }}
                    className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex-shrink-0 p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 pt-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 mb-1">Alerta por match de propiedad</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Notifícame cuando un comprador o inquilino muestre interés en una propiedad específica de mi cartera
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <Badge variant="outline" className="bg-green-50 border-green-200">
                          <Building2 className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-green-600">Propiedad específica</span>
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="hidden sm:block h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </button>
                </div>

                {/* Info card */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-900">
                          <span className="font-medium">Ejemplo:</span> Para saber inmediatamente cuando el asistente detecte un comprador interesado en tu piso de lujo en Salamanca, usa <span className="font-medium">Alerta por match de propiedad</span>.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : !editingNotification && wizardStep === 2 ? (
              /* PASO 2: Seleccionar propiedad visualmente (solo para property-match) */
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-sm">Selecciona la propiedad</Label>
                  <p className="text-xs text-gray-500 mt-1 mb-4">
                    Elige la propiedad sobre la que quieres recibir alertas cuando haya interesados
                  </p>
                </div>

                {/* Grid de propiedades con imágenes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockProperties.map((property) => {
                    const isSelected = formPropertyId === property.id;
                    return (
                      <button
                        key={property.id}
                        onClick={() => {
                          setFormPropertyId(property.id);
                          // Asignar automáticamente el rol según el tipo de propiedad
                          setFormRole(property.type === 'sale' ? 'buyer' : 'renter');
                        }}
                        className={`group relative flex flex-col rounded-xl border-2 transition-all text-left overflow-hidden ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-32 sm:h-40 bg-gray-100 overflow-hidden">
                          <ImageWithFallback
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Type badge */}
                          <div className="absolute top-2 right-2">
                            <Badge className={`${property.type === 'sale' ? 'bg-blue-600' : 'bg-purple-600'} text-white border-0`}>
                              {property.type === 'sale' ? 'Venta' : 'Alquiler'}
                            </Badge>
                          </div>
                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-primary rounded-full p-1 shadow-lg">
                                <CheckCircle className="h-4 w-4 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1">
                          <h4 className="font-medium text-gray-900 mb-1 leading-snug">{property.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{property.description}</p>
                          <p className="font-semibold text-primary">{property.price}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* PASO 3: Configurar detalles de la alerta */
              <div className="space-y-4 py-4">
                {/* Mostrar propiedad seleccionada como resumen visual (solo para property-match) */}
                {!editingNotification && formAlertType === 'property-match' && formPropertyId && (() => {
                  const selectedProperty = mockProperties.find(p => p.id === formPropertyId);
                  return selectedProperty ? (
                    <div className="space-y-2">
                      <Label className="text-sm">Propiedad seleccionada</Label>
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            {/* Imagen pequeña */}
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                              <ImageWithFallback
                                src={selectedProperty.image}
                                alt={selectedProperty.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 leading-tight">{selectedProperty.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{selectedProperty.description}</p>
                              <p className="text-sm font-semibold text-primary mt-1">{selectedProperty.price}</p>
                            </div>
                            {/* Botón cambiar */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setWizardStep(2)}
                              className="gap-1.5 flex-shrink-0"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Cambiar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null;
                })()}

                {/* Nombre de la alerta */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la alerta</Label>
                  <Input
                    id="name"
                    placeholder={
                      formAlertType === 'qualification'
                        ? 'Ej: Compradores muy cualificados'
                        : 'Ej: Interesados en Piso Salamanca'
                    }
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                {/* Tipo de notificación */}
                <div className="space-y-2">
                  <Label>Tipo de notificación</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => toggleFormType('push')}
                      className={`flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        formTypes.includes('push')
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${formTypes.includes('push') ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Smartphone className={`h-5 w-5 ${formTypes.includes('push') ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className={`text-sm font-medium ${formTypes.includes('push') ? 'text-gray-900' : 'text-gray-700'}`}>
                          Push
                        </p>
                        <p className="text-xs text-gray-500">
                          En navegador
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFormType('email')}
                      className={`flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        formTypes.includes('email')
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${formTypes.includes('email') ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Mail className={`h-5 w-5 ${formTypes.includes('email') ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className={`text-sm font-medium ${formTypes.includes('email') ? 'text-gray-900' : 'text-gray-700'}`}>
                          Email
                        </p>
                        <p className="text-xs text-gray-500">
                          Correo electrónico
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Filtros según el tipo de alerta */}
                {formAlertType === 'qualification' ? (
                  /* ALERTA POR CUALIFICACIÓN */
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        Criterios de la alerta
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Recibe notificaciones cuando se cumplan estos criterios
                      </p>
                    </div>

                    {/* Rol */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol del lead</Label>
                      <Select value={formRole} onValueChange={(value: any) => setFormRole(value)}>
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gray-600" />
                              <span>Todos los roles</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="buyer">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-blue-600" />
                              <span>Comprador</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="seller">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>Vendedor</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="renter">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-purple-600" />
                              <span>Inquilino</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="landlord">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-orange-600" />
                              <span>Arrendador</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cualificación */}
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Cualificación del lead</Label>
                      <Select value={formQualification} onValueChange={(value: any) => setFormQualification(value)}>
                        <SelectTrigger id="qualification">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-qualified">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-green-700" />
                              <span>Mínimo 75% de cualificación</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="qualified">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Mínimo 50% de cualificación</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="little-qualified">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-orange-600" />
                              <span>Mínimo 25% de cualificación</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="very-little-qualified">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-gray-600" />
                              <span>Cualquier nivel de cualificación</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Recibirás alertas de leads que tengan este nivel de cualificación o superior
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ALERTA POR MATCH DE PROPIEDAD */
                  <div className="space-y-4">
                    {/* Info: Tipo de interesado se determina automáticamente */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-3">
                        <div className="flex gap-2.5">
                          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-blue-900">
                              {(() => {
                                const selectedProperty = mockProperties.find(p => p.id === formPropertyId);
                                if (selectedProperty?.type === 'sale') {
                                  return 'Esta alerta se activará cuando un comprador muestre interés en esta propiedad en venta.';
                                } else if (selectedProperty?.type === 'rent') {
                                  return 'Esta alerta se activará cuando un inquilino muestre interés en esta propiedad en alquiler.';
                                }
                                return 'Esta alerta se activará cuando haya interesados en esta propiedad.';
                              })()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Footer buttons */}
            {wizardStep === 1 ? (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
              </div>
            ) : wizardStep === 2 ? (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setWizardStep(1);
                  setFormAlertType(null);
                  setFormPropertyId('');
                }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <Button 
                  onClick={() => setWizardStep(3)} 
                  disabled={!formPropertyId}
                  className="gap-2"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (!editingNotification && formAlertType === 'property-match') {
                      setWizardStep(2);
                    } else if (!editingNotification && formAlertType === 'qualification') {
                      setWizardStep(1);
                      setFormAlertType(null);
                    } else {
                      setIsDialogOpen(false);
                      resetForm();
                    }
                  }}
                >
                  {!editingNotification ? (
                    <>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </>
                  ) : (
                    'Cancelar'
                  )}
                </Button>
                <Button 
                  onClick={handleSaveNotification} 
                  disabled={
                    !formName.trim() || 
                    formTypes.length === 0 || 
                    (formAlertType === 'property-match' && !formPropertyId)
                  }
                >
                  {editingNotification ? 'Guardar cambios' : 'Crear alerta'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  No hay alertas configuradas
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Crea tu primera alerta para recibir notificaciones sobre leads importantes
                </p>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear primera alerta
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const roleConf = roleConfig[notification.role];
              const qualConf = qualificationConfig[notification.qualification];
              const RoleIcon = roleConf.icon;
              const hasBothTypes = notification.types.length === 2;

              return (
                <Card key={notification.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header with title */}
                      <div className="flex items-center gap-3">
                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 leading-none">{notification.name}</h3>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Badge de tipo de alerta */}
                        {notification.type === 'qualification' ? (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 gap-1.5">
                            <Zap className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-600">Por cualificación</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 border-green-200 gap-1.5">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Match de propiedad</span>
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className={`${roleConf.bgColor} ${roleConf.borderColor} gap-1.5`}>
                          <RoleIcon className={`h-3 w-3 ${roleConf.color}`} />
                          <span className={roleConf.color}>{roleConf.label}</span>
                        </Badge>
                        {notification.type === 'property-match' && notification.propertyName && (
                          <Badge variant="outline" className="bg-amber-50 border-amber-200 gap-1.5">
                            <Building2 className="h-3 w-3 text-amber-600" />
                            <span className="text-amber-600">{notification.propertyName}</span>
                          </Badge>
                        )}
                        {notification.qualification !== 'all' && (() => {
                          const QualIcon = qualConf.icon;
                          return (
                            <Badge variant="outline" className={`${qualConf.bgColor} ${qualConf.borderColor} gap-1.5`}>
                              <QualIcon className={`h-3 w-3 ${qualConf.color}`} />
                              <span className={qualConf.color}>{qualConf.label}</span>
                            </Badge>
                          );
                        })()}
                        {notification.types.includes('email') && (
                          <Badge variant="outline" className="gap-1.5">
                            <Mail className="h-3 w-3" />
                            Email
                          </Badge>
                        )}
                        {notification.types.includes('push') && (
                          <Badge variant="outline" className="gap-1.5">
                            <Smartphone className="h-3 w-3" />
                            Push
                          </Badge>
                        )}
                      </div>

                      {/* Fila de pastillas y botones de acción */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {/* Botón de ver resultados - diseño minimalista y elegante */}
                        {(notification.newContactsCount !== undefined || notification.totalContactsCount !== undefined) && (
                          <Button
                            onClick={() => handleViewResults(notification.id)}
                            className="group relative flex items-center justify-center gap-2 px-4 h-10 bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                          >
                            <Eye className="h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ver resultados</span>
                            {notification.newContactsCount !== undefined && notification.newContactsCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs font-semibold text-white">{notification.newContactsCount}</span>
                              </div>
                            )}
                          </Button>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(notification)}
                            className="flex-1 sm:flex-none h-10 sm:h-9 gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification)}
                            className="flex-1 sm:flex-none h-10 sm:h-9 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                Sobre las alertas
              </p>
              <p className="text-sm text-blue-700">
                Las notificaciones push aparecerán en tu navegador cuando estés conectado. 
                Los emails se enviarán a tu correo registrado. Puedes seleccionar uno o ambos tipos de notificación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar alerta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la alerta{" "}
              <span className="font-medium text-gray-900">{notificationToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteNotification}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, eliminar alerta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
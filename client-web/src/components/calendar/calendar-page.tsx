import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Home,
  User,
  Calendar as CalendarViewIcon,
  List,
  Grid3X3,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";
import { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration: number; // minutes
  type: 'visit' | 'call' | 'meeting' | 'follow-up' | 'appointment';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  leadName: string;
  leadPhone?: string;
  property?: string;
  address?: string;
  priority: 'low' | 'medium' | 'high';
}

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Visita Casa Zona Norte',
    description: 'Primera visita con María González',
    date: new Date(2024, 11, 15, 10, 0),
    time: '10:00',
    duration: 60,
    type: 'visit',
    status: 'confirmed',
    leadName: 'María González',
    leadPhone: '+34 600 123 456',
    property: 'Casa en Zona Norte',
    address: 'Calle Principal 123, Madrid',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Llamada Carlos Ruiz',
    description: 'Seguimiento post-visita',
    date: new Date(2024, 11, 15, 14, 30),
    time: '14:30',
    duration: 30,
    type: 'call',
    status: 'scheduled',
    leadName: 'Carlos Ruiz',
    leadPhone: '+34 600 987 654',
    property: 'Apartamento Centro',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Reunión Equipo Ventas',
    description: 'Revisión semanal de objetivos',
    date: new Date(2024, 11, 16, 9, 0),
    time: '09:00',
    duration: 90,
    type: 'meeting',
    status: 'scheduled',
    leadName: 'Equipo Interno',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Visita Apartamento Centro',
    date: new Date(2024, 11, 17, 11, 0),
    time: '11:00',
    duration: 45,
    type: 'visit',
    status: 'scheduled',
    leadName: 'Ana Martínez',
    leadPhone: '+34 600 555 777',
    property: 'Apartamento Centro',
    address: 'Plaza Mayor 45, Madrid',
    priority: 'high'
  },
  {
    id: '5',
    title: 'Cita Firmado Contrato',
    description: 'Firma de contrato de compraventa',
    date: new Date(2024, 11, 18, 16, 0),
    time: '16:00',
    duration: 120,
    type: 'appointment',
    status: 'confirmed',
    leadName: 'Luis Pérez',
    property: 'Oficina Comercial',
    priority: 'high'
  }
];

const eventTypeConfig = {
  visit: { 
    label: 'Visita', 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Home,
    darkColor: 'bg-blue-500'
  },
  call: { 
    label: 'Llamada', 
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: Phone,
    darkColor: 'bg-green-500'
  },
  meeting: { 
    label: 'Reunión', 
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: User,
    darkColor: 'bg-purple-500'
  },
  'follow-up': { 
    label: 'Seguimiento', 
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: MessageCircle,
    darkColor: 'bg-orange-500'
  },
  appointment: { 
    label: 'Cita', 
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: CalendarIcon,
    darkColor: 'bg-primary'
  }
};

const statusConfig = {
  scheduled: { label: 'Programado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmed: { label: 'Confirmado', color: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completado', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200' }
};

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<CalendarEvent[]>(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  
  // Estados para sincronización de calendario
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [googleBidirectional, setGoogleBidirectional] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [outlookBidirectional, setOutlookBidirectional] = useState(false);

  // Filter events based on search and type
  const handleFilter = () => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.property?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    setFilteredEvents(filtered);
  };

  useState(() => {
    handleFilter();
  }, [searchTerm, filterType]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const today = new Date();
  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getTodayEvents = () => {
    return getEventsForDate(today);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return filteredEvents
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2>Calendario</h2>
          <p className="text-muted-foreground">
            Gestiona tus citas, visitas y reuniones inmobiliarias
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Mes
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
            >
              <CalendarViewIcon className="h-4 w-4 mr-1" />
              Semana
            </Button>
            <Button
              variant={view === 'agenda' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('agenda')}
            >
              <List className="h-4 w-4 mr-1" />
              Agenda
            </Button>
          </div>
          
          <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Conectar Calendario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Conectar Calendario Externo
                </DialogTitle>
                <DialogDescription>
                  Conecta tu calendario con Google Calendar o Outlook para mantener todo sincronizado
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Google Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                          <path fill="#EA4335" d="M12 13h5v5h-5z"/>
                          <path fill="#FBBC04" d="M7 13h5v5H7z"/>
                          <path fill="#34A853" d="M12 18h5v2h-5z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Calendar</h4>
                        <p className="text-sm text-gray-500">
                          {googleCalendarConnected ? 'Conectado' : 'No conectado'}
                        </p>
                      </div>
                    </div>
                    {googleCalendarConnected ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </div>

                  {googleCalendarConnected ? (
                    <div className="space-y-3 pl-11">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="google-bidirectional" className="text-sm">
                            Sincronización bidireccional
                          </Label>
                          <p className="text-xs text-gray-500">
                            Los eventos se sincronizan en ambas direcciones
                          </p>
                        </div>
                        <Switch
                          id="google-bidirectional"
                          checked={googleBidirectional}
                          onCheckedChange={setGoogleBidirectional}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setGoogleCalendarConnected(false)}
                        >
                          Desconectar
                        </Button>
                        <Button size="sm" className="flex-1">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sincronizar Ahora
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-11">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGoogleCalendarConnected(true)}
                        className="w-full"
                      >
                        <LinkIcon className="h-3 w-3 mr-2" />
                        Conectar con Google
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Outlook Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                          <path fill="#0078D4" d="M24 7.5v9L12 21l-6-3v-4.5L12 16.5l6-3v-3L12 7.5 6 10.5V6l6-3 12 4.5z"/>
                          <path fill="#0364B8" d="M6 10.5V15l6 3v-4.5l-6-3z"/>
                          <path fill="#28A8EA" d="M18 10.5v3L12 16.5v4.5l6-3v-4.5l-6-3v-3l6 3z"/>
                          <path fill="#0078D4" d="M12 7.5v3L6 13.5V9l6-1.5z"/>
                          <path fill="#50D9FF" d="M0 10.5v6l6 3v-6l-6-3z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Outlook Calendar</h4>
                        <p className="text-sm text-gray-500">
                          {outlookConnected ? 'Conectado' : 'No conectado'}
                        </p>
                      </div>
                    </div>
                    {outlookConnected ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </div>

                  {outlookConnected ? (
                    <div className="space-y-3 pl-11">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="outlook-bidirectional" className="text-sm">
                            Sincronización bidireccional
                          </Label>
                          <p className="text-xs text-gray-500">
                            Los eventos se sincronizan en ambas direcciones
                          </p>
                        </div>
                        <Switch
                          id="outlook-bidirectional"
                          checked={outlookBidirectional}
                          onCheckedChange={setOutlookBidirectional}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setOutlookConnected(false)}
                        >
                          Desconectar
                        </Button>
                        <Button size="sm" className="flex-1">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sincronizar Ahora
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-11">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOutlookConnected(true)}
                        className="w-full"
                      >
                        <LinkIcon className="h-3 w-3 mr-2" />
                        Conectar con Outlook
                      </Button>
                    </div>
                  )}
                </div>

                {(googleCalendarConnected || outlookConnected) && (
                  <>
                    <Separator />
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900">
                            Acerca de la sincronización bidireccional
                          </p>
                          <p className="text-xs text-blue-700">
                            Cuando está activada, los eventos que crees o modifiques en cualquiera de los calendarios se actualizarán automáticamente en ambos. 
                            Si está desactivada, solo los eventos de RealMaker AI se enviarán a tu calendario externo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSyncDialog(false)}
                >
                  Cerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Cita</DialogTitle>
                <DialogDescription>
                  Programa una nueva cita, visita o reunión
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Título</Label>
                  <Input id="event-title" placeholder="Ej: Visita Casa Zona Norte" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visit">🏠 Visita</SelectItem>
                        <SelectItem value="call">📞 Llamada</SelectItem>
                        <SelectItem value="meeting">👥 Reunión</SelectItem>
                        <SelectItem value="follow-up">💬 Seguimiento</SelectItem>
                        <SelectItem value="appointment">📅 Cita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Fecha</Label>
                    <Input id="event-date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Hora</Label>
                    <Input id="event-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-duration">Duración (min)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1.5 horas</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-name">Cliente/Lead</Label>
                  <Input id="lead-name" placeholder="Nombre del cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">Propiedad</Label>
                  <Input id="property" placeholder="Nombre/dirección de la propiedad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Etiquetas</Label>
                  <Textarea id="notes" placeholder="Etiquetas adicionales..." rows={3} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowNewEventDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    Crear Cita
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar citas, clientes o propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="visit">Visitas</SelectItem>
              <SelectItem value="call">Llamadas</SelectItem>
              <SelectItem value="meeting">Reuniones</SelectItem>
              <SelectItem value="follow-up">Seguimientos</SelectItem>
              <SelectItem value="appointment">Citas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Calendar View */}
        <div className="xl:col-span-3">
          {view === 'month' && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Hoy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                  {/* Header Days */}
                  {dayNames.map((day) => (
                    <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {calendarDays.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const isToday = date.toDateString() === today.toDateString();
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    
                    return (
                      <div 
                        key={index} 
                        className={`bg-white p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors ${
                          !isCurrentMonth ? 'text-gray-400' : ''
                        } ${isToday ? 'bg-primary/5 border-2 border-primary/20' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`text-sm mb-2 ${isToday ? 'font-semibold text-primary' : ''}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => {
                            const config = eventTypeConfig[event.type];
                            return (
                              <div 
                                key={event.id}
                                className={`text-xs p-1 rounded text-white truncate ${config.darkColor}`}
                                title={`${event.time} - ${event.title}`}
                              >
                                {event.time} {event.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {view === 'agenda' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Vista de Agenda
                </CardTitle>
                <CardDescription>
                  Lista completa de próximas citas y eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {getUpcomingEvents().map((event) => {
                      const config = eventTypeConfig[event.type];
                      const Icon = config.icon;
                      
                      return (
                        <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-600">{event.leadName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {event.date.toLocaleDateString('es-ES', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-sm text-gray-600">{event.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.duration} min
                              </div>
                              {event.address && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{event.address}</span>
                                </div>
                              )}
                              <Badge variant="outline" className={statusConfig[event.status].color}>
                                {statusConfig[event.status].label}
                              </Badge>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Hoy
              </CardTitle>
              <CardDescription>
                {today.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodayEvents().length > 0 ? (
                  getTodayEvents().map((event) => {
                    const config = eventTypeConfig[event.type];
                    const Icon = config.icon;
                    
                    return (
                      <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-1.5 rounded ${config.color}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-gray-600">{event.time} - {event.leadName}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No hay eventos hoy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Resumen Semanal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary">12</p>
                  <p className="text-xs text-gray-600">Visitas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600">8</p>
                  <p className="text-xs text-gray-600">Llamadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-blue-600">5</p>
                  <p className="text-xs text-gray-600">Reuniones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-600">3</p>
                  <p className="text-xs text-gray-600">Citas</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <h5 className="font-medium text-sm">Próximas 24h</h5>
                <div className="space-y-1">
                  {getUpcomingEvents().slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-xs">
                      <span className="truncate">{event.title}</span>
                      <span className="text-gray-500 ml-2">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Programar Visita
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Agendar Llamada
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Nueva Reunión
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Seguimiento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
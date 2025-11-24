import { StatsCards } from "./stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Phone,
  MessageCircle,
  Calendar,
  TrendingUp,
  Clock,
  Users,
  PlayCircle,
  Settings,
  ArrowRight,
  Activity,
  CreditCard,
  Sparkles
} from "lucide-react";

const stats = {
  phoneConversations: 127,
  whatsappMessages: 843,
  activeLeads: 34,
  conversionRate: 23.5
};

const recentActivity = [
  {
    id: 0,
    type: 'phone',
    contact: 'Jaime González',
    phone: '+34 656789235',
    property: 'Piso en Zona Residencial',
    time: '2 min',
    status: 'appointment-scheduled'
  },
  {
    id: 1,
    type: 'phone',
    contact: 'María González',
    property: 'Casa en Zona Norte',
    time: '5 min',
    status: 'lead-qualified'
  },
  {
    id: 2,
    type: 'whatsapp',  
    contact: 'Carlos Ruiz',
    property: 'Apartamento Centro',
    time: '12 min',
    status: 'appointment-scheduled'
  },
  {
    id: 3,
    type: 'phone',
    contact: 'Ana Martínez', 
    property: 'Casa en Suburbios',
    time: '23 min',
    status: 'follow-up-needed'
  },
  {
    id: 4,
    type: 'whatsapp',
    contact: 'Luis Pérez',
    property: 'Oficina Comercial', 
    time: '35 min',
    status: 'info-requested'
  }
];

const statusConfig = {
  'lead-qualified': { 
    label: 'Lead Calificado', 
    color: 'bg-green-50 text-green-700 border-green-200',
    emoji: '✅'
  },
  'appointment-scheduled': { 
    label: 'Cita Agendada', 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    emoji: '📅'
  },
  'follow-up-needed': { 
    label: 'Seguimiento', 
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    emoji: '⏰'
  },
  'info-requested': { 
    label: 'Info Solicitada', 
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    emoji: '📋'
  }
};

interface MainDashboardProps {
  onNavigate?: (tab: string) => void;
}

export function MainDashboard({ onNavigate }: MainDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen de la actividad de tus asistentes de IA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Este Mes
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Stats Cards - más compactas */}
      <StatsCards stats={stats} />

      {/* Minutos del Plan - Indicador destacado */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">Plan Básico</p>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Activo
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">500 minutos mensuales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-primary">328</p>
              <p className="text-xs text-gray-500">minutos restantes</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Consumidos: 172 min (34%)</span>
              <span>Restantes: 328 min (66%)</span>
            </div>
            <Progress value={34} className="h-2" />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Renueva el 15 de Nov
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => onNavigate?.('plans')}
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Ver planes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Actividad Reciente - más compacta */}
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Actividad Reciente</CardTitle>
                <CardDescription className="text-gray-500 mt-1">
                  Últimas interacciones con clientes
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex-shrink-0">
                    {activity.type === 'phone' ? (
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Phone className="h-3 w-3 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{activity.contact}</p>
                        {(activity as any).phone && (
                          <p className="text-xs text-gray-500 mt-0.5">{(activity as any).phone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${statusConfig[activity.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[activity.status as keyof typeof statusConfig].emoji} {statusConfig[activity.status as keyof typeof statusConfig].label}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{activity.property}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar con cards más compactas */}
        <div className="space-y-4">
          {/* Estado de Asistentes */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Estado de los Asistentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Asistente Telefónico */}
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900 text-sm">Teléfono</span>
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                    ✓ Activo
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Llamadas hoy</span>
                      <span className="font-medium text-gray-900">18/25</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tasa de éxito</span>
                      <span className="font-medium text-gray-900">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Asistente WhatsApp */}
              <div className="p-3 bg-green-50/50 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900 text-sm">WhatsApp</span>
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                    ✓ Conectado
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Mensajes hoy</span>
                      <span className="font-medium text-gray-900">156/200</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiempo respuesta</span>
                      <span className="font-medium text-gray-900">2.3s</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Leads */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'María González', property: 'Casa en Zona Norte', score: 95 },
                  { name: 'Carlos Ruiz', property: 'Apartamento Centro', score: 87 },
                  { name: 'Ana Martínez', property: 'Casa en Suburbios', score: 76 }
                ].map((lead) => (
                  <div key={lead.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-600 truncate">{lead.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{lead.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
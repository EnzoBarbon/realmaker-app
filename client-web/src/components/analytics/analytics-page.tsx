import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  Target,
  Trophy,
  ArrowUp,
  ArrowDown,
  Equal,
  Clock
} from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";

// Datos mock para las gráficas
const conversationsByChannel = [
  { channel: 'Teléfono', conversaciones: 127, leads: 34, citas: 18 },
  { channel: 'WhatsApp', conversaciones: 234, leads: 67, citas: 28 }
];

const evolutionData = [
  { periodo: 'Sem 1', conversaciones: 85, leads: 23 },
  { periodo: 'Sem 2', conversaciones: 92, leads: 28 },
  { periodo: 'Sem 3', conversaciones: 118, leads: 31 },
  { periodo: 'Sem 4', conversaciones: 145, leads: 42 }
];

const conversionData = [
  { name: 'Teléfono', value: 26.8, fill: '#3b82f6' },
  { name: 'WhatsApp', value: 28.6, fill: '#10b981' }
];

const topLeads = [
  { 
    name: 'María González', 
    property: 'Casa en Zona Norte', 
    score: 95, 
    interactions: 8,
    lastContact: 'Hace 2 horas'
  },
  { 
    name: 'Alejandro Campos', 
    property: 'Penthouse Premium', 
    score: 91, 
    interactions: 6,
    lastContact: 'Hace 4 horas'
  },
  { 
    name: 'Carmen Vásquez', 
    property: 'Casa con Jardín', 
    score: 84, 
    interactions: 12,
    lastContact: 'Hace 1 día'
  },
  { 
    name: 'Fernando López', 
    property: 'Casa Colonial', 
    score: 77, 
    interactions: 9,
    lastContact: 'Hace 1 día'
  },
  { 
    name: 'Isabella Torres', 
    property: 'Departamento Playa', 
    score: 73, 
    interactions: 5,
    lastContact: 'Hace 3 horas'
  }
];

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadgeColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getTrendIcon = (change: number) => {
  if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
  if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
  return <Equal className="h-4 w-4 text-gray-600" />;
};

const getTrendColor = (change: number) => {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
};

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2>Análisis</h2>
            <p className="text-muted-foreground">
              Métricas y resultados de tus asistentes de IA
            </p>
          </div>
        </div>
        
        {/* Filtros básicos */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Este Mes</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="phone">Teléfono</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 1. Resumen General */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversaciones Totales</p>
                <p className="text-2xl">361</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leads Generados</p>
                <p className="text-2xl">101</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Citas Agendadas</p>
                <p className="text-2xl">46</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contratos Cerrados</p>
                <p className="text-2xl">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversaciones por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Conversaciones por Canal</CardTitle>
            <CardDescription>
              Comparación entre Teléfono y WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversationsByChannel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversaciones" fill="#e7af2a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolución en el Tiempo */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
            <CardDescription>
              Conversaciones y leads por semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="conversaciones" 
                  stroke="#e7af2a" 
                  strokeWidth={3}
                  name="Conversaciones"
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversión por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Conversión por Canal</CardTitle>
            <CardDescription>
              Efectividad de cada canal para generar leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teléfono */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">127 conversaciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-medium text-blue-600">26.8%</p>
                  <p className="text-sm text-muted-foreground">34 leads</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full relative overflow-hidden"
                  style={{ width: '26.8%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Contestadas</p>
                  <p className="font-medium">118</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Citas</p>
                  <p className="font-medium">18</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Perdidas</p>
                  <p className="font-medium">9</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* WhatsApp */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <WhatsAppIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">234 conversaciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-medium text-green-600">28.6%</p>
                  <p className="text-sm text-muted-foreground">67 leads</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full relative overflow-hidden"
                  style={{ width: '28.6%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Respondidas</p>
                  <p className="font-medium">223</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Citas</p>
                  <p className="font-medium">28</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sin respuesta</p>
                  <p className="font-medium">11</p>
                </div>
              </div>
            </div>

            {/* Comparación */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">¡WhatsApp es 1.8% más efectivo!</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                WhatsApp genera más leads por conversación que el teléfono
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comparativa Mes Actual vs Anterior - MEJORADA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Este Mes vs Mes Pasado
            </CardTitle>
            <CardDescription>
              Evolución de tus métricas principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Conversaciones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Conversaciones</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-medium">361</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-sm font-medium">+20%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Mes anterior</p>
                  <p className="font-medium">301</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 h-8">
                {[85, 92, 118, 145].map((value, index) => (
                  <div key={index} className="bg-muted rounded-sm relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-primary/80 to-primary rounded-sm transition-all"
                      style={{ 
                        height: `${(value / 145) * 100}%`,
                        minHeight: '8px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />
            
            {/* Leads Calificados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Leads Calificados</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-medium">101</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-sm font-medium">+10%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Mes anterior</p>
                  <p className="font-medium">92</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 h-8">
                {[23, 28, 31, 42].map((value, index) => (
                  <div key={index} className="bg-muted rounded-sm relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-green-400 to-green-500 rounded-sm transition-all"
                      style={{ 
                        height: `${(value / 42) * 100}%`,
                        minHeight: '8px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Citas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Citas Agendadas</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-medium">46</span>
                    <div className="flex items-center gap-1 text-red-600">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-sm font-medium">-5%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Mes anterior</p>
                  <p className="font-medium">48</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 h-8">
                {[15, 18, 16, 12].map((value, index) => (
                  <div key={index} className="bg-muted rounded-sm relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-orange-400 to-orange-500 rounded-sm transition-all"
                      style={{ 
                        height: `${(value / 18) * 100}%`,
                        minHeight: '8px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tasa de Conversión */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Tasa de Conversión</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-medium">27.9%</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Mes anterior</p>
                  <p className="font-medium">24.3%</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-4 rounded-full relative overflow-hidden"
                  style={{ width: '27.9%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-80"></div>
                </div>
              </div>
            </div>

            {/* Resumen del mes */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Excelente mes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 de 4 métricas principales muestran crecimiento. La ligera baja en citas puede estar relacionada con el aumento en leads de mayor calidad.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Top Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Leads más Activos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top 5 Leads más Activos
            </CardTitle>
            <CardDescription>
              Tus mejores prospectos este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLeads.map((lead, index) => (
                <div key={lead.name} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.property}</p>
                    <p className="text-xs text-muted-foreground">{lead.interactions} interacciones • {lead.lastContact}</p>
                  </div>
                  
                  <Badge variant="outline" className={getScoreBadgeColor(lead.score)}>
                    {lead.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights y Mejor Día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Insights Clave
            </CardTitle>
            <CardDescription>
              Patrones y recomendaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mejor Día */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Mejor Día de la Semana</span>
              </div>
              <p className="text-lg font-medium text-green-900 mb-1">Martes</p>
              <p className="text-sm text-green-700">
                Generas 35% más leads los martes. ¡Considera enfocar tu estrategia este día!
              </p>
            </div>

            {/* Mejor Canal */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <WhatsAppIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Canal Más Efectivo</span>
              </div>
              <p className="text-lg font-medium text-blue-900 mb-1">WhatsApp</p>
              <p className="text-sm text-blue-700">
                28.6% de conversión vs 26.8% de teléfono. Excelente rendimiento!
              </p>
            </div>

            {/* Horario Pico */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Horario Pico</span>
              </div>
              <p className="text-lg font-medium text-purple-900 mb-1">2:00 PM - 5:00 PM</p>
              <p className="text-sm text-purple-700">
                Mejor momento para contactar leads. 42% más respuestas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
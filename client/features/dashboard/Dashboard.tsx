import { H1, Muted } from '@/components/ui/Typography';
import { AnimatedElement } from '@/components/animation/AnimatedElement';
import React from 'react';
import { View } from 'react-native';
import StatsCards from './components/StatsCards';
import RecentActivityCard from './components/RecentActivityCard';
import AssistantsStatusCard from './components/AssistantsStatusCard';
import TopLeadsCard from './components/TopLeadsCard';
import type { ConversationListItem, LeadListItem } from '@/models';

export default function Dashboard() {
  return (
    <View className="flex-1 gap-6">
      <View>
        <AnimatedElement animationIndex={0}>
          <H1>Dashboard</H1>
        </AnimatedElement>
        <AnimatedElement animationIndex={1}>
          <Muted>Resumen de la actividad de tus asistentes de IA</Muted>
        </AnimatedElement>
      </View>

      {/* Stats */}
      <StatsCards />

      {/* Content */}
      <View className="flex-col gap-4 md:flex-row">
        {/* Left column */}
        <View className="min-w-0 flex-1">
          <RecentActivityCard items={recent} />
        </View>

        {/* Right column */}
        <View className="flex-none w-full lg:w-[360px] gap-4">
          <AssistantsStatusCard metrics={assistantMetrics} />
          <TopLeadsCard leads={topLeads} />
        </View>
      </View>
    </View>
  );
}

const recent: ConversationListItem[] = [
  {
    id: 'c1',
    channel: 'phone',
    name: 'María González',
    phone: '+1 234 567 8901',
    property: 'Casa en Zona Norte',
    note: 'Lead Calificado',
    timeAgo: 'Hace 5 min',
    status: 'Completada',
    duration: '8m 23s',
    score: 92,
  },
  {
    id: 'c2',
    channel: 'whatsapp',
    name: 'Carlos Ruiz',
    phone: '+1 234 567 8902',
    property: 'Apartamento Centro',
    note: 'Cita Agendada',
    timeAgo: 'Hace 12 min',
    status: 'En curso',
    score: 87,
  },
  {
    id: 'c3',
    channel: 'phone',
    name: 'Ana Martínez',
    phone: '+1 234 567 8903',
    property: 'Casa en Suburbios',
    note: 'Seguimiento',
    timeAgo: 'Hace 23 min',
    status: 'Transferida',
  },
  {
    id: 'c4',
    channel: 'web',
    name: 'Luis Pérez',
    phone: '+1 234 567 8904',
    property: 'Oficina Comercial',
    note: 'Info Solicitada',
    timeAgo: 'Hace 35 min',
    status: 'Perdida',
  },
];

const assistantMetrics = [
  { label: 'Teléfono', valueLeft: 'Llamadas hoy', valueRight: '18/25', progress: 72, tone: 'info' as const },
  { label: 'WhatsApp', valueLeft: 'Mensajes hoy', valueRight: '156/200', progress: 78, tone: 'success' as const },
  { label: 'Tiempo respuesta', valueLeft: '', valueRight: '2.3s', progress: 65, tone: 'warning' as const },
];

const topLeads: LeadListItem[] = [
  { id: 'l1', name: 'María González', interestedProperty: 'Casa en Zona Norte', stage: 'qualified', score: 95 },
  { id: 'l2', name: 'Carlos Ruiz', interestedProperty: 'Apartamento Centro', stage: 'appointment', score: 87 },
  { id: 'l3', name: 'Ana Martínez', interestedProperty: 'Casa en Suburbios', stage: 'contacted', score: 76 },
];

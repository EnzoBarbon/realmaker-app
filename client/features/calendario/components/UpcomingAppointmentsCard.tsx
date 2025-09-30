import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Appointment } from '@/models';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type UpcomingAppointmentsCardProps = {
  appointments: Appointment[];
  onAppointmentClick?: (leadId: string) => void;
};

export function UpcomingAppointmentsCard({
  appointments,
  onAppointmentClick,
}: UpcomingAppointmentsCardProps) {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.startDate);
      return aptDate >= now && aptDate <= next24Hours && apt.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visita':
        return 'amber';
      case 'llamada':
        return 'green';
      case 'reunion':
        return 'blue';
      case 'cita':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'visita':
        return 'Visita';
      case 'llamada':
        return 'Llamada';
      case 'reunion':
        return 'Reunión';
      case 'cita':
        return 'Cita';
      default:
        return type;
    }
  };

  return (
    <Card className="p-6">
      <Text className="text-base font-semibold text-gray-900 mb-4">Próximas 24h</Text>
      {upcoming.length === 0 ? (
        <Text className="text-sm text-gray-500">No hay citas próximas</Text>
      ) : (
        <View className="space-y-3">
          {upcoming.map((apt) => {
            const startTime = new Date(apt.startDate).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const startDate = new Date(apt.startDate);
            const isToday = startDate.toDateString() === now.toDateString();

            return (
              <Pressable
                key={apt.id}
                onPress={() => onAppointmentClick?.(apt.leadId)}
                className="border-l-2 border-gray-200 pl-3 py-2 active:opacity-70"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm font-medium text-gray-900 flex-1">{apt.title}</Text>
                  <Badge variant={getTypeColor(apt.type) as any} size="sm">
                    {getTypeLabel(apt.type)}
                  </Badge>
                </View>
                <Text className="text-xs text-gray-500">
                  {isToday
                    ? 'Hoy'
                    : startDate.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                      })}{' '}
                  • {startTime}
                </Text>
                {apt.clientName && (
                  <Text className="text-xs text-gray-600 mt-1">{apt.clientName}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </Card>
  );
}

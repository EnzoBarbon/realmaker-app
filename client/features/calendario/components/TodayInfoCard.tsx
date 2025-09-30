import { Card } from '@/components/ui/Card';
import type { Appointment } from '@/models';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CalendarIcon } from 'react-native-heroicons/outline';

type TodayInfoCardProps = {
  appointments: Appointment[];
  selectedDate: Date;
  onAppointmentClick?: (leadId: string) => void;
};

export function TodayInfoCard({
  appointments,
  selectedDate,
  onAppointmentClick,
}: TodayInfoCardProps) {
  const monthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.startDate);
    return (
      aptDate.getDate() === selectedDate.getDate() &&
      aptDate.getMonth() === selectedDate.getMonth() &&
      aptDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const dayName = dayNames[selectedDate.getDay()];
  const day = selectedDate.getDate();
  const monthName = monthNames[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();

  return (
    <Card className="p-6">
      <Text className="text-base font-semibold text-gray-900 mb-3">
        {isToday() ? 'Hoy' : 'Fecha seleccionada'}
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        {dayName}, {day} de {monthName} de {year}
      </Text>

      {todayAppointments.length === 0 ? (
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-3">
            <CalendarIcon size={28} color="#d1d5db" />
          </View>
          <Text className="text-sm text-gray-500">
            No hay eventos {isToday() ? 'hoy' : 'este día'}
          </Text>
        </View>
      ) : (
        <View className="space-y-3">
          {todayAppointments.map((apt) => {
            const startTime = new Date(apt.startDate).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Pressable
                key={apt.id}
                onPress={() => onAppointmentClick?.(apt.leadId)}
                className="border-l-2 border-blue-500 pl-3 py-2 active:opacity-70"
              >
                <Text className="text-sm font-medium text-gray-900">{apt.title}</Text>
                <Text className="text-xs text-gray-500">{startTime}</Text>
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

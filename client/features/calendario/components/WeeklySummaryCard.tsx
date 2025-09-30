import { Card } from '@/components/ui/Card';
import type { Appointment } from '@/models';
import React from 'react';
import { Text, View } from 'react-native';

type WeeklySummaryCardProps = {
  appointments: Appointment[];
};

export function WeeklySummaryCard({ appointments }: WeeklySummaryCardProps) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weekAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.startDate);
    return aptDate >= startOfWeek && aptDate <= endOfWeek;
  });

  const visitas = weekAppointments.filter((apt) => apt.type === 'visita').length;
  const llamadas = weekAppointments.filter((apt) => apt.type === 'llamada').length;
  const reuniones = weekAppointments.filter((apt) => apt.type === 'reunion').length;
  const citas = weekAppointments.filter((apt) => apt.type === 'cita').length;

  const stats = [
    { label: 'Visitas', value: visitas, color: 'text-amber-600' },
    { label: 'Llamadas', value: llamadas, color: 'text-green-600' },
    { label: 'Reuniones', value: reuniones, color: 'text-blue-600' },
    { label: 'Citas', value: citas, color: 'text-purple-600' },
  ];

  return (
    <Card className="p-6">
      <Text className="text-base font-semibold text-gray-900 mb-4">Resumen Semanal</Text>
      <View className="flex-row flex-wrap">
        {stats.map((stat, index) => (
          <View key={index} className="w-1/2 mb-4">
            <Text className={`text-2xl font-bold ${stat.color}`}>{stat.value}</Text>
            <Text className="text-sm text-gray-600">{stat.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

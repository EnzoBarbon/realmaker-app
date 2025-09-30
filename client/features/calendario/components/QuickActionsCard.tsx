import { Card } from '@/components/ui/Card';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BellAlertIcon, HomeIcon, PhoneIcon, UsersIcon } from 'react-native-heroicons/outline';

type QuickActionsCardProps = {
  onAction: (action: string) => void;
};

export function QuickActionsCard({ onAction }: QuickActionsCardProps) {
  const actions = [
    { icon: HomeIcon, label: 'Programar Visita', action: 'schedule-visit' },
    { icon: PhoneIcon, label: 'Agendar Llamada', action: 'schedule-call' },
    { icon: UsersIcon, label: 'Nueva Reunión', action: 'new-meeting' },
    { icon: BellAlertIcon, label: 'Seguimiento', action: 'follow-up' },
  ];

  return (
    <Card className="p-6">
      <Text className="text-base font-semibold text-gray-900 mb-4">Acciones Rápidas</Text>
      <View className="space-y-2">
        {actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={() => onAction(action.action)}
            className="flex-row items-center py-3 px-3 bg-gray-50 rounded-lg active:opacity-80"
          >
            <action.icon size={18} color="#374151" />
            <Text className="text-sm text-gray-700 ml-3">{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

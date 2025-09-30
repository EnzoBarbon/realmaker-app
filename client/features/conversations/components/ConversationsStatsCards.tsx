import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { Label } from '@/components/ui/Typography';
import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { PhoneIcon, ChatBubbleLeftRightIcon, ChartBarIcon, UserIcon } from 'react-native-heroicons/outline';

type Stat = {
  title: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
};

function StatCard({ title, value, Icon, iconColor }: Stat) {
  return (
    <Card>
      <CardBody className="gap-2">
        <View className="flex-row items-center justify-between">
          <Label>{title}</Label>
          <Icon size={18} color={iconColor ?? '#64748B'} />
        </View>
        <Text className="mt-1 text-3xl font-semibold text-gray-900">{value}</Text>
      </CardBody>
    </Card>
  );
}

export default function ConversationsStatsCards() {
  const stats: Stat[] = [
    { title: 'Llamadas Hoy', value: '3', Icon: PhoneIcon, iconColor: '#2563EB' },
    { title: 'WhatsApp Hoy', value: '3', Icon: ChatBubbleLeftRightIcon, iconColor: '#22C55E' },
    { title: 'Score Promedio', value: '71%', Icon: ChartBarIcon, iconColor: '#F59E0B' },
    { title: 'Leads Calificados', value: '18', Icon: UserIcon, iconColor: '#8B5CF6' },
  ];

  return (
    <View className="flex-row flex-wrap gap-4">
      {stats.map((s, i) => (
        <AnimatedElement key={s.title} animationIndex={2 + i} className="w-full md:flex-1 lg:w-[24%]">
          <StatCard {...s} />
        </AnimatedElement>
      ))}
    </View>
  );
}


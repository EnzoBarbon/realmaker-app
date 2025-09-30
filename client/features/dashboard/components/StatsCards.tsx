import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Typography';
import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { PhoneIcon, ChatBubbleLeftRightIcon, UsersIcon, ChartBarIcon } from 'react-native-heroicons/outline';

type Stat = {
  title: string;
  value: string;
  badge: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
};

function StatCard({ title, value, badge, Icon, iconColor }: Stat) {
  return (
    <Card>
      <CardBody className="gap-2">
        <View className="flex-row items-center justify-between">
          <Label>{title}</Label>
          <Icon size={18} color={iconColor ?? '#64748B'} />
        </View>
        <View className="mt-1 flex-row items-center gap-2">
          <Text className="text-3xl font-semibold text-gray-900">{value}</Text>
          <Badge label={badge} />
        </View>
      </CardBody>
    </Card>
  );
}

export default function StatsCards() {
  const stats: Stat[] = [
    { title: 'Conversaciones Telefónicas', value: '127', badge: 'Este mes', Icon: PhoneIcon, iconColor: '#2563EB' },
    { title: 'Mensajes WhatsApp', value: '843', badge: 'Este mes', Icon: ChatBubbleLeftRightIcon, iconColor: '#22C55E' },
    { title: 'Leads Activos', value: '34', badge: 'Total', Icon: UsersIcon, iconColor: '#F59E0B' },
    { title: 'Tasa de Conversión', value: '23.5%', badge: 'Este mes', Icon: ChartBarIcon, iconColor: '#8B5CF6' },
  ];

  return (
    <View className="flex-row flex-wrap gap-4">
      {stats.map((s, i) => (
        <AnimatedElement key={s.title} animationIndex={i} className="w-full md:flex-1 lg:w-[24%]">
          <StatCard {...s} />
        </AnimatedElement>
      ))}
    </View>
  );
}


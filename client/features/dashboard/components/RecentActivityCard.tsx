import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { H1, Muted } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import type { ConversationListItem } from '@/models';
import { AnimatedElement } from '@/components/animation/AnimatedElement';

type Props = {
  items: ConversationListItem[];
};

export default function RecentActivityCard({ items }: Props) {
  return (
    <AnimatedElement animationDelay={140}>
      <Card>
        <CardBody>
          <View className="mb-2 flex-row items-center justify-between">
            <H1>Actividad Reciente</H1>
            <Text className="text-sm text-blue-600">Ver todas</Text>
          </View>
          {items.map((item, idx) => (
            <View
              key={item.id ?? idx}
              className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0"
            >
              <View>
                <Text className="text-sm font-medium text-gray-900">{item.name}</Text>
                {item.property ? (
                  <Text className="text-xs text-gray-500">{item.property}</Text>
                ) : item.note ? (
                  <Text className="text-xs text-gray-500">{item.note}</Text>
                ) : null}
              </View>
              <View className="flex-row items-center gap-3">
                {item.status ? <Badge label={item.status} /> : null}
                {item.timeAgo ? <Muted>{item.timeAgo}</Muted> : null}
              </View>
            </View>
          ))}
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}


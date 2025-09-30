import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { AnimatedElement } from '@/components/animation/AnimatedElement';
import type { LeadListItem } from '@/models';

export default function TopLeadsCard({ leads }: { leads: LeadListItem[] }) {
  return (
    <AnimatedElement animationDelay={260}>
      <Card>
        <CardBody>
          <View className="mb-3 flex-row items-center gap-2">
            <Text className="text-base font-medium text-gray-900">Top Leads</Text>
          </View>
          {leads.map((p, i) => (
            <View
              key={p.id ?? i}
              className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Text className="text-[11px] font-medium text-amber-700">
                    {p.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-900">{p.name}</Text>
                  {p.interestedProperty ? (
                    <Text className="text-xs text-gray-500">{p.interestedProperty}</Text>
                  ) : null}
                </View>
              </View>
              {p.score != null ? <Text className="text-sm text-gray-500">{p.score}%</Text> : null}
            </View>
          ))}
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}


import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { H1, Muted } from '@/components/ui/Typography';
import type { ConversationListItem } from '@/models';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChatBubbleLeftRightIcon, PhoneIcon } from 'react-native-heroicons/outline';

interface ConversationCardProps {
  conversation: ConversationListItem;
  onPress?: () => void;
  animationIndex: number;
}

function ConversationCard({ conversation: c, onPress, animationIndex }: ConversationCardProps) {
  const ChannelIcon = c.channel === 'phone' ? PhoneIcon : ChatBubbleLeftRightIcon;
  const tone = c.status === 'Completada' ? 'success' : c.status === 'Perdida' ? 'warning' : 'info';

  return (
    <AnimatedElement animationIndex={animationIndex}>
      <Pressable onPress={onPress}>
        <Card>
          <CardBody>
            <View className="flex-col gap-3">
              <View className="flex-row items-start justify-between gap-2">
                {/* Left meta */}
                <View className="flex-row items-start gap-3">
                  <View
                    className={`mt-0.5 h-9 w-9 items-center justify-center rounded-full ${
                      c.channel === 'phone' ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}
                  >
                    <ChannelIcon size={18} color={c.channel === 'phone' ? '#2563EB' : '#059669'} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-gray-900">{c.name}</Text>
                    {c.phone ? <Text className="text-xs text-gray-500">{c.phone}</Text> : null}
                    {c.property ? (
                      <Text className="text-xs text-gray-500">{c.property}</Text>
                    ) : null}
                  </View>
                </View>

                {/* Right status */}
                <View className="items-end gap-1">
                  {c.status ? <Badge label={c.status} tone={tone as any} /> : null}
                  {c.score != null ? (
                    <Text className="text-xs text-gray-500">{c.score}%</Text>
                  ) : null}
                </View>
              </View>

              {/* Message / note */}
              {c.note ? (
                <View className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <Text className="text-xs text-gray-700">{c.note}</Text>
                </View>
              ) : null}

              {/* Footer */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  {c.timeAgo ? <Muted>{c.timeAgo}</Muted> : null}
                  {c.duration ? <Muted>{c.duration}</Muted> : null}
                </View>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      onPress?.();
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5"
                  >
                    <Text className="text-sm text-gray-700">Ver Chat</Text>
                  </Pressable>
                  {c.channel === 'phone' ? (
                    <Pressable
                      onPress={(e) => e.stopPropagation()}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5"
                    >
                      <Text className="text-sm text-gray-700">Audio</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          </CardBody>
        </Card>
      </Pressable>
    </AnimatedElement>
  );
}

export default function ConversationsListCard({
  items,
  onPressItem,
}: {
  items: ConversationListItem[];
  onPressItem?: (item: ConversationListItem) => void;
}) {
  return (
    <View className="gap-6">
      <H1>Conversaciones</H1>
      {items.map((c, i) => (
        <ConversationCard
          key={c.id ?? i}
          conversation={c}
          onPress={() => onPressItem?.(c)}
          animationIndex={12 + i}
        />
      ))}
    </View>
  );
}

import { Badge } from '@/components/ui/Badge';
import { getConversationByLeadId } from '@/lib/mockData';
import type { Lead } from '@/models';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  CurrencyEuroIcon,
  FlagIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

type Props = {
  lead: Lead;
  onClose: () => void;
};

const stageLabels: Record<string, string> = {
  nuevo: 'Nuevo',
  visita_agendada: 'Visita agendada',
  en_seguimiento: 'En seguimiento',
  propuesta_enviada: 'Propuesta enviada',
  calificado: 'Calificado',
  cerrado: 'Cerrado',
};

const intentionLabels: Record<string, string> = {
  comprar: 'Comprar',
  visitar: 'Visitar',
  vender: 'Vender',
  alquilar: 'Alquilar',
};

const priorityColors = {
  alta: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  media: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  baja: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export default function LeadDetailContent({ lead, onClose }: Props) {
  const priorityStyle = priorityColors[lead.priority || 'baja'];
  const conversation = lead.conversationId ? getConversationByLeadId(lead.id) : undefined;

  const viewConversation = useCallback(() => {
    if (lead.conversationId) {
      router.push(`/conversation/${lead.conversationId}`);
    }
  }, [lead.conversationId]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
            <UserIcon size={20} color="#4F46E5" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">{lead.name}</Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <PhoneIcon size={12} color="#6B7280" />
              <Text className="text-xs text-gray-500">{lead.phone}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable className="h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <BellIcon size={18} color="#374151" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <XMarkIcon size={18} color="#374151" />
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="gap-4">
          {/* Priority & Score Row */}
          <View className="flex-row gap-3">
            {lead.priority ? (
              <View
                className={`flex-1 rounded-xl border ${priorityStyle.border} ${priorityStyle.bg} px-4 py-3`}
              >
                <View className="flex-row items-center gap-2 mb-1">
                  <FlagIcon
                    size={14}
                    color={
                      priorityStyle.text.includes('red')
                        ? '#B91C1C'
                        : priorityStyle.text.includes('amber')
                          ? '#B45309'
                          : '#374151'
                    }
                  />
                  <Text className="text-xs font-medium text-gray-600">Prioridad</Text>
                </View>
                <Text className={`text-base font-semibold ${priorityStyle.text} capitalize`}>
                  {lead.priority}
                </Text>
              </View>
            ) : null}

            {lead.score != null ? (
              <View className="flex-1 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <StarIcon size={14} color="#4F46E5" />
                  <Text className="text-xs font-medium text-gray-600">Score</Text>
                </View>
                <Text className="text-base font-semibold text-indigo-700">{lead.score}%</Text>
              </View>
            ) : null}
          </View>

          {/* Intention & Stage */}
          <View className="flex-row gap-3">
            {lead.intention ? (
              <View className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <Text className="text-xs font-medium text-gray-500 mb-1.5">Intención</Text>
                <View className="inline-flex">
                  <Badge label={intentionLabels[lead.intention] || lead.intention} tone="info" />
                </View>
              </View>
            ) : null}

            <View className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <Text className="text-xs font-medium text-gray-500 mb-1.5">Estado</Text>
              <View className="inline-flex">
                <Badge label={stageLabels[lead.stage] || lead.stage} tone="success" />
              </View>
            </View>
          </View>

          {/* Zone */}
          {lead.zone ? (
            <View className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <View className="flex-row items-center gap-2 mb-1.5">
                <MapPinIcon size={14} color="#6B7280" />
                <Text className="text-xs font-medium text-gray-500">Zona</Text>
              </View>
              <Text className="text-sm text-gray-900">{lead.zone}</Text>
            </View>
          ) : null}

          {/* Budget */}
          {lead.budget ? (
            <View className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <View className="flex-row items-center gap-2 mb-1.5">
                <CurrencyEuroIcon size={14} color="#15803D" />
                <Text className="text-xs font-medium text-green-700">Presupuesto</Text>
              </View>
              <Text className="text-base font-semibold text-green-900">{lead.budget}</Text>
            </View>
          ) : null}

          {/* Interested Property */}
          {lead.interestedProperty ? (
            <View className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Text className="text-xs font-medium text-gray-500 mb-1.5">Propiedad de interés</Text>
              <Text className="text-sm text-gray-900">{lead.interestedProperty}</Text>
            </View>
          ) : null}

          {/* Last Contact */}
          {lead.lastContactDays != null ? (
            <View className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <Text className="text-xs font-medium text-gray-500 mb-1.5">Último Contacto</Text>
              <Text className="text-sm text-gray-900">Hace {lead.lastContactDays} días</Text>
            </View>
          ) : null}

          {/* Notes */}
          {lead.notes ? (
            <View className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Text className="text-xs font-medium text-gray-500 mb-1.5">Notas</Text>
              <Text className="text-sm text-gray-900">{lead.notes}</Text>
            </View>
          ) : null}

          {/* Conversation Link */}
          {conversation ? (
            <Pressable
              accessibilityRole="button"
              onPress={viewConversation}
              className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <ChatBubbleLeftRightIcon size={16} color="#4F46E5" />
                    <Text className="text-xs font-medium text-indigo-700">
                      Conversación Asociada
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-indigo-900 mb-0.5">
                    {conversation.channel === 'phone' ? '📞' : '💬'} {conversation.name}
                  </Text>
                  <Text className="text-xs text-indigo-600">
                    Último contacto: {conversation.timeAgo || 'N/A'}
                  </Text>
                </View>
                <View className="ml-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                    <Text className="text-indigo-600 text-lg">→</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

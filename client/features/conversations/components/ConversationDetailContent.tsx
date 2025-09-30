import type { ConversationDetail, MessageAction } from '@/models';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import {
  BellIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  PencilIcon,
  PhoneIcon,
  StarIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

type Props = {
  detail: ConversationDetail;
  onClose: () => void;
};

const actionIcons: Record<string, any> = {
  estado_actualizado: CheckCircleIcon,
  presupuesto_actualizado: CurrencyEuroIcon,
  visita_agendada: CalendarIcon,
  lead_calificado: StarIcon,
  propuesta_enviada: DocumentTextIcon,
  nota_agregada: PencilIcon,
};

const actionColors: Record<string, { bg: string; icon: string; text: string }> = {
  estado_actualizado: { bg: 'bg-blue-50', icon: '#2563EB', text: 'text-blue-700' },
  presupuesto_actualizado: { bg: 'bg-green-50', icon: '#059669', text: 'text-green-700' },
  visita_agendada: { bg: 'bg-purple-50', icon: '#7C3AED', text: 'text-purple-700' },
  lead_calificado: { bg: 'bg-amber-50', icon: '#F59E0B', text: 'text-amber-700' },
  propuesta_enviada: { bg: 'bg-indigo-50', icon: '#4F46E5', text: 'text-indigo-700' },
  nota_agregada: { bg: 'bg-gray-50', icon: '#6B7280', text: 'text-gray-700' },
};

export default function ConversationDetailContent({ detail, onClose }: Props) {
  const ChannelIcon = detail.conversation.channel === 'phone' ? PhoneIcon : ChatBubbleLeftRightIcon;

  const openWhatsApp = useCallback(() => {
    const raw = detail.conversation.phone ?? '';
    const digits = (raw.match(/\d+/g) || []).join('');
    if (!digits) return;
    const url = `https://wa.me/${digits}`;
    Linking.openURL(url).catch(() => {
      // no-op: ignore failures silently for now
    });
  }, [detail.conversation.phone]);

  const viewLead = useCallback(() => {
    if (detail.leadId) {
      router.push(`/leads/${detail.leadId}`);
    }
  }, [detail.leadId]);

  const ActionCard = ({ action, isLast }: { action: MessageAction; isLast?: boolean }) => {
    const Icon = actionIcons[action.type] || CheckCircleIcon;
    const colors = actionColors[action.type] || actionColors.nota_agregada;

    return (
      <View className={`flex-row items-center gap-2 ${!isLast ? 'mb-2' : ''}`}>
        <View className={`h-6 w-6 items-center justify-center rounded-full ${colors.bg}`}>
          <Icon size={13} color={colors.icon} />
        </View>
        <Text className={`text-xs font-medium ${colors.text} flex-shrink`}>
          {action.description}
        </Text>
        {action.value ? (
          <>
            <Text className="text-xs text-gray-400">→</Text>
            <Text className={`text-xs font-semibold ${colors.text} flex-shrink`}>
              {action.value}
            </Text>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`h-9 w-9 items-center justify-center rounded-full ${
              detail.conversation.channel === 'phone' ? 'bg-blue-100' : 'bg-emerald-100'
            }`}
          >
            <ChannelIcon
              size={18}
              color={detail.conversation.channel === 'phone' ? '#2563EB' : '#059669'}
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900">{detail.conversation.name}</Text>
            {detail.conversation.phone ? (
              <Text className="text-xs text-gray-500">{detail.conversation.phone}</Text>
            ) : null}
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
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {detail.messages.map((m) => (
          <View key={m.id} className="mb-4">
            {/* Author label */}
            <Text
              className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${
                m.author === 'IA' ? 'text-right text-gray-600' : 'text-left text-gray-500'
              }`}
            >
              {m.author === 'IA' ? '🤖 Asistente IA' : '👤 Cliente'}
            </Text>

            {/* Message bubble */}
            <View
              className={`self-${m.author === 'IA' ? 'end' : 'start'} max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.author === 'IA' ? 'bg-primary rounded-tr-sm' : 'bg-gray-100 rounded-tl-sm'
              }`}
            >
              <Text
                className={`text-sm leading-5 ${m.author === 'IA' ? 'text-gray-900' : 'text-gray-800'}`}
              >
                {m.text}
              </Text>
            </View>

            {/* Timestamp */}
            <Text
              className={`mt-1 text-[11px] text-gray-400 ${m.author === 'IA' ? 'text-right' : 'text-left'}`}
            >
              {typeof m.at === 'string' ? m.at : (m.at as Date).toLocaleTimeString()}
            </Text>

            {/* Actions taken by IA */}
            {m.actions && m.actions.length > 0 && m.author === 'IA' ? (
              <View className="self-end max-w-[85%] mt-2">
                <View className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Text className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ✨ Acciones realizadas por IA
                  </Text>
                  {m.actions.map((action, idx) => (
                    <ActionCard
                      key={`${m.id}-action-${idx}`}
                      action={action}
                      isLast={idx === m.actions!.length - 1}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Footer actions */}
      <View className="px-4 py-3 border-t border-gray-100 bg-white">
        <View className="flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={openWhatsApp}
            className="flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-3"
          >
            <Text className="text-sm font-semibold text-white">Abrir en Whatsapp</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={viewLead}
            disabled={!detail.leadId}
            className={`flex-1 items-center justify-center rounded-lg border px-4 py-3 ${
              detail.leadId ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-50'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${detail.leadId ? 'text-gray-900' : 'text-gray-400'}`}
            >
              Ver Lead
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

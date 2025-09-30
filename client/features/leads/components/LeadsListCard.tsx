import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { LeadListItem } from '@/models';
import React from 'react';
import { Text, View } from 'react-native';
import { ChatBubbleLeftIcon, PhoneIcon } from 'react-native-heroicons/outline';

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

const stageToTone: Record<string, 'success' | 'warning' | 'info' | 'muted'> = {
  cerrado: 'muted',
  calificado: 'success',
  visita_agendada: 'success',
  en_seguimiento: 'info',
  propuesta_enviada: 'warning',
  nuevo: 'muted',
};

const priorityToTone: Record<string, 'success' | 'warning' | 'info' | 'muted'> = {
  alta: 'warning',
  media: 'warning',
  baja: 'muted',
};

const columns: Column<LeadListItem>[] = [
  {
    key: 'name',
    header: 'Lead',
    minWidth: 180,
    render: (item) => (
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <Text className="text-[11px] font-medium text-amber-700">
            {item.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-sm font-medium text-gray-900">{item.name}</Text>
          {item.interestedProperty ? (
            <Text className="text-xs text-gray-500">{item.interestedProperty}</Text>
          ) : null}
        </View>
      </View>
    ),
  },
  {
    key: 'intention',
    header: 'Intención',
    minWidth: 120,
    hideOnMobile: true,
    render: (item) =>
      item.intention ? (
        <Badge label={intentionLabels[item.intention] || item.intention} tone="info" />
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'stage',
    header: 'Estado',
    minWidth: 140,
    render: (item) => (
      <Badge
        label={stageLabels[item.stage] || item.stage}
        tone={stageToTone[item.stage] || 'muted'}
      />
    ),
  },
  {
    key: 'phone',
    header: 'Teléfono',
    minWidth: 140,
    hideOnMobile: true,
    render: (item) => (
      <View className="flex-row items-center gap-1.5">
        <PhoneIcon size={14} color="#6B7280" />
        <Text className="text-sm text-gray-700">{item.phone}</Text>
      </View>
    ),
  },
  {
    key: 'zone',
    header: 'Zona',
    minWidth: 120,
    hideOnMobile: true,
    render: (item) =>
      item.zone ? (
        <Text className="text-sm text-gray-700">{item.zone}</Text>
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'budget',
    header: 'Presupuesto',
    minWidth: 160,
    hideOnMobile: true,
    render: (item) =>
      item.budget ? (
        <Text className="text-sm font-medium text-green-700">{item.budget}</Text>
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'score',
    header: 'Score',
    minWidth: 80,
    render: (item) =>
      item.score != null ? (
        <Text className="text-sm font-semibold text-indigo-600">{item.score}%</Text>
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'priority',
    header: 'Prioridad',
    minWidth: 100,
    hideOnMobile: true,
    render: (item) =>
      item.priority ? (
        <Badge label={item.priority} tone={priorityToTone[item.priority] || 'muted'} />
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'lastContactDays',
    header: 'Último Contacto',
    minWidth: 140,
    hideOnMobile: true,
    render: (item) =>
      item.lastContactDays != null ? (
        <Text className="text-sm text-gray-700">Hace {item.lastContactDays} días</Text>
      ) : (
        <Text className="text-xs text-gray-400">-</Text>
      ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    width: 100,
    hideOnMobile: true,
    render: () => (
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <PhoneIcon size={16} color="#374151" />
        </View>
        <View className="h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <ChatBubbleLeftIcon size={16} color="#374151" />
        </View>
      </View>
    ),
  },
];

export default function LeadsListCard({
  items,
  onPressItem,
}: {
  items: LeadListItem[];
  onPressItem?: (item: LeadListItem) => void;
}) {
  return (
    <AnimatedElement animationIndex={12}>
      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(item) => item.id}
            onRowPress={onPressItem}
            emptyMessage="No se encontraron leads"
          />
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}

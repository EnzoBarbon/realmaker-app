import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { Card, CardBody } from '@/components/ui/Card';
import type { LeadStage } from '@/models';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export interface LeadsFilters {
  searchQuery: string;
  stage: LeadStage | 'all';
  timePeriod: 'all' | 'week' | 'month';
}

interface LeadsFiltersCardProps {
  filters: LeadsFilters;
  onFiltersChange: (filters: LeadsFilters) => void;
  counts: {
    all: number;
    calificado: number;
    visita_agendada: number;
    cerrado: number;
  };
}

function Pill({
  children,
  active,
  onPress,
}: {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  const Component = onPress ? Pressable : View;
  return (
    <Component
      onPress={onPress}
      className={`rounded-lg border px-3 py-2 ${
        active ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
      }`}
    >
      <Text className={`text-sm ${active ? 'text-amber-900 font-medium' : 'text-gray-700'}`}>
        {children}
      </Text>
    </Component>
  );
}

function TabPill({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${
        active ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
      } rounded-full border px-3 py-1.5`}
    >
      <Text className={`text-sm ${active ? 'text-amber-900 font-medium' : 'text-gray-700'}`}>
        {label} ({count})
      </Text>
    </Pressable>
  );
}

export default function LeadsFiltersCard({
  filters,
  onFiltersChange,
  counts,
}: LeadsFiltersCardProps) {
  return (
    <AnimatedElement animationIndex={6}>
      <Card>
        <CardBody>
          <View className="flex-row flex-wrap items-center gap-3">
            <View className="min-w-[200px] flex-1">
              <TextInput
                placeholder="Buscar por nombre, email, teléfono o propiedad..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700"
                value={filters.searchQuery}
                onChangeText={(text) => onFiltersChange({ ...filters, searchQuery: text })}
              />
            </View>
            <AnimatedElement animationIndex={7}>
              <Pill
                active={filters.stage === 'all'}
                onPress={() => onFiltersChange({ ...filters, stage: 'all' })}
              >
                Todos los Estados
              </Pill>
            </AnimatedElement>
            <AnimatedElement animationIndex={8}>
              <Pill
                active={filters.timePeriod === 'week'}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    timePeriod: filters.timePeriod === 'week' ? 'all' : 'week',
                  })
                }
              >
                Esta Semana
              </Pill>
            </AnimatedElement>
            <View className="ml-auto flex-row gap-2">
              <Pressable className="rounded-lg border border-gray-200 px-3 py-2">
                <Text className="text-sm text-gray-700">Exportar</Text>
              </Pressable>
              <Pressable className="rounded-lg bg-amber-100 px-3 py-2">
                <Text className="text-sm font-medium text-amber-900">Filtros</Text>
              </Pressable>
            </View>
          </View>
          <View className="mt-4 flex-row items-center gap-2">
            <AnimatedElement animationIndex={9}>
              <TabPill
                active={filters.stage === 'all'}
                label="Todos"
                count={counts.all}
                onPress={() => onFiltersChange({ ...filters, stage: 'all' })}
              />
            </AnimatedElement>
            <AnimatedElement animationIndex={10}>
              <TabPill
                active={filters.stage === 'calificado'}
                label="Calificados"
                count={counts.calificado}
                onPress={() => onFiltersChange({ ...filters, stage: 'calificado' })}
              />
            </AnimatedElement>
            <AnimatedElement animationIndex={11}>
              <TabPill
                active={filters.stage === 'visita_agendada'}
                label="Visita Agendada"
                count={counts.visita_agendada}
                onPress={() => onFiltersChange({ ...filters, stage: 'visita_agendada' })}
              />
            </AnimatedElement>
            <AnimatedElement animationIndex={11}>
              <TabPill
                active={filters.stage === 'cerrado'}
                label="Cerrados"
                count={counts.cerrado}
                onPress={() => onFiltersChange({ ...filters, stage: 'cerrado' })}
              />
            </AnimatedElement>
          </View>
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}

import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { AnimatedElement } from '@/components/animation/AnimatedElement';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <Text className="text-sm text-gray-700">{children}</Text>
    </View>
  );
}

function TabPill({ label, count, active }: { label: string; count: number; active?: boolean }) {
  return (
    <View className={`${active ? 'bg-amber-50 border-amber-200' : 'bg-white'} rounded-full border px-3 py-1.5`}>
      <Text className={`text-sm ${active ? 'text-amber-900' : 'text-gray-700'}`}>
        {label} ({count})
      </Text>
    </View>
  );
}

export default function ConversationsFiltersCard() {
  return (
    <AnimatedElement animationIndex={6}>
      <Card>
        <CardBody>
          <View className="flex-row flex-wrap items-center gap-3">
            <View className="min-w-[200px] flex-1">
              <TextInput
                placeholder="Buscar por nombre, teléfono o propiedad..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700"
              />
            </View>
            <AnimatedElement animationIndex={7}>
              <Pill>Todos los Estados</Pill>
            </AnimatedElement>
            <AnimatedElement animationIndex={8}>
              <Pill>Hoy</Pill>
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
              <TabPill active label="Todas" count={6} />
            </AnimatedElement>
            <AnimatedElement animationIndex={10}>
              <TabPill label="Teléfono" count={3} />
            </AnimatedElement>
            <AnimatedElement animationIndex={11}>
              <TabPill label="WhatsApp" count={3} />
            </AnimatedElement>
          </View>
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}


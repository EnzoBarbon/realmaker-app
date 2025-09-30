import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';

type ViewMode = 'month' | 'week' | 'agenda';

type CalendarHeaderProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewAppointment: () => void;
};

export function CalendarHeader({
  viewMode,
  onViewModeChange,
  onNewAppointment,
}: CalendarHeaderProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-4 gap-3">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">Calendario</Text>
          <Text className="text-sm text-gray-500 hidden md:flex">
            Gestiona tus citas, visitas y reuniones inmobiliarias
          </Text>
        </View>
        <Pressable
          onPress={onNewAppointment}
          className="bg-amber-500 px-3 md:px-4 py-2.5 rounded-lg flex-row items-center active:opacity-80"
        >
          <PlusIcon size={18} color="white" />
          <Text className="text-white font-medium ml-2 hidden sm:flex">Nueva Cita</Text>
          <Text className="text-white font-medium ml-2 sm:hidden">Cita</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5">
          <MagnifyingGlassIcon size={18} color="#9ca3af" />
          <TextInput
            placeholder="Buscar citas, clientes o propiedades..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-sm text-gray-900"
          />
        </View>
        <Pressable className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row items-center active:opacity-80">
          <FunnelIcon size={18} color="#374151" />
          <Text className="ml-2 text-sm text-gray-700">Todos los tipos</Text>
        </Pressable>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-row bg-white border border-gray-200 rounded-lg p-1">
          <Pressable
            onPress={() => onViewModeChange('month')}
            className={`px-4 py-1.5 rounded ${viewMode === 'month' ? 'bg-amber-500' : ''}`}
          >
            <Text
              className={`text-sm font-medium ${viewMode === 'month' ? 'text-white' : 'text-gray-700'}`}
            >
              Mes
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onViewModeChange('week')}
            className={`px-4 py-1.5 rounded ${viewMode === 'week' ? 'bg-amber-500' : ''}`}
          >
            <Text
              className={`text-sm font-medium ${viewMode === 'week' ? 'text-white' : 'text-gray-700'}`}
            >
              Semana
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onViewModeChange('agenda')}
            className={`px-4 py-1.5 rounded ${viewMode === 'agenda' ? 'bg-amber-500' : ''}`}
          >
            <Text
              className={`text-sm font-medium ${viewMode === 'agenda' ? 'text-white' : 'text-gray-700'}`}
            >
              Agenda
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

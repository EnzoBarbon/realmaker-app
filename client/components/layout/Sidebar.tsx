import React from 'react';
import { Text, View } from 'react-native';
import {
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  UsersIcon,
} from 'react-native-heroicons/outline';

type Item = {
  label: string;
  badge?: string;
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
};

const main: Item[] = [
  { label: 'Dashboard', Icon: HomeIcon },
  { label: 'Conversaciones', badge: '3', Icon: ChatBubbleLeftRightIcon },
  { label: 'Leads', badge: '12', Icon: UsersIcon },
];

const assistants: Item[] = [
  { label: 'Asistente Teléfono', Icon: PhoneIcon },
  { label: 'Asistente WhatsApp', Icon: ChatBubbleLeftRightIcon },
];

const tools: Item[] = [
  { label: 'Integraciones', Icon: Squares2X2Icon },
  { label: 'Calendario', Icon: CalendarIcon },
  { label: 'Análisis', Icon: ChartBarIcon },
];

const others: Item[] = [
  { label: 'Configuración', Icon: Cog6ToothIcon },
  { label: 'Ayuda', Icon: QuestionMarkCircleIcon },
];

type SidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  mode?: 'fixed' | 'collapsed' | 'hoverable';
};

export function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  return (
    <View
      className={`hidden md:flex h-screen bg-white border-r border-gray-100 flex-col justify-between ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      <View>
        <View className={`px-4 py-5 ${collapsed ? 'items-center' : ''}`}>
          <Text className="text-xl font-semibold text-gray-900">
            {collapsed ? 'RM' : 'RealMaker'}
          </Text>
          {!collapsed ? <Text className="text-xs text-gray-500">Asistente IA</Text> : null}
        </View>
        <Section
          title="PRINCIPAL"
          items={main}
          activeIndex={0}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <Section
          title="ASISTENTES IA"
          items={assistants}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <Section title="HERRAMIENTAS" items={tools} collapsed={collapsed} onNavigate={onNavigate} />
        <Section title="OTROS" items={others} collapsed={collapsed} onNavigate={onNavigate} />
      </View>
      <View className={`px-4 py-4 ${collapsed ? 'items-center' : ''}`}>
        <Text className="text-xs text-gray-400">© 2024 RM</Text>
      </View>
    </View>
  );
}

function Section({
  title,
  items,
  activeIndex,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: Item[];
  activeIndex?: number;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <View className="px-3 py-3">
      {!collapsed ? (
        <Text className="mb-2 px-2 text-[10px] tracking-wider text-gray-400">{title}</Text>
      ) : null}
      <View className="gap-1">
        {items.map((item, i) => (
          <View
            key={i}
            className={`flex-row items-center ${collapsed ? 'justify-center' : 'justify-between'} rounded-lg px-3 py-2 ${
              i === activeIndex ? 'border border-amber-200 bg-amber-50' : 'hover:bg-gray-50'
            }`}
          >
            <View className="flex-row items-center gap-2">
              {item.Icon ? <item.Icon size={18} color="#334155" /> : null}
              {!collapsed ? <Text className="text-sm text-gray-700">{item.label}</Text> : null}
            </View>
            {!collapsed && item.badge ? (
              <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                {item.badge}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

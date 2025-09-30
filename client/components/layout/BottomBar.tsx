import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { HomeIcon, ChatBubbleLeftRightIcon, UsersIcon } from 'react-native-heroicons/outline';

type Item = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const items: Item[] = [
  { label: 'Dashboard', href: '/', Icon: HomeIcon },
  { label: 'Conversaciones', href: '/conversations', Icon: ChatBubbleLeftRightIcon },
  { label: 'Leads', href: '/leads', Icon: UsersIcon },
];

export function BottomBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="border-t border-gray-100 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <View className="mx-auto flex h-14 w-full max-w-screen items-stretch flex-row">
        {items.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Pressable
              key={href}
              className="flex-1 items-center justify-center"
              onPress={() => router.push(href as any)}
            >
              <Icon size={20} color={active ? '#111827' : '#6B7280'} />
              <Text className={`text-[11px] ${active ? 'text-gray-900' : 'text-gray-500'}`}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default BottomBar;

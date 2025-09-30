import { useAuth } from '@/store/auth';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BellIcon, UserIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
};

export function MobileTopBar({ title = 'Real Maker' }: Props) {
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#ffffff' }}>
      <View className="w-full bg-white border-b border-gray-100">
        <View className="h-14 px-4 flex-row items-center justify-between">
          {/* Left: Title */}
          <Text className="text-base font-semibold text-gray-900">{title}</Text>

          {/* Right: Icons */}
          <View className="flex-row items-center">
            {/* Notifications (mock) */}
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 mr-1 rounded-full items-center justify-center"
              onPress={() => {}}
            >
              <BellIcon size={22} color="#111827" />
            </Pressable>

            {/* Vertical separator */}
            <View className="h-5 w-px bg-gray-200 mx-2" />

            {/* User menu */}
            <View>
              <Pressable
                accessibilityRole="button"
                className="h-9 w-9 rounded-full items-center justify-center"
                onPress={() => setMenuOpen((v) => !v)}
              >
                <UserIcon size={22} color="#111827" />
              </Pressable>

              {menuOpen ? (
                <View className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <View className="px-3 py-2 border-b border-gray-100">
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                      {user?.email ?? 'Usuario'}
                    </Text>
                  </View>
                  <Pressable
                    className="px-3 py-2"
                    onPress={async () => {
                      setMenuOpen(false);
                      await logout();
                    }}
                  >
                    <Text className="text-sm text-red-600">Cerrar Sesión</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MobileTopBar;

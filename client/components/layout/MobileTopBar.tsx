import { useAuth } from '@/store/auth';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { BellIcon, UserIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
};

export function MobileTopBar({ title = 'Real Maker' }: Props) {
  const { logout, user } = useAuth();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

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
                onPress={() => setProfileSheetOpen(true)}
              >
                <UserIcon size={22} color="#111827" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={profileSheetOpen}
        onRequestClose={() => setProfileSheetOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setProfileSheetOpen(false)}
        >
          <Pressable className="absolute bottom-0 left-0 right-0">
            <View className="rounded-t-2xl bg-white p-5 shadow-xl">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">Cuenta</Text>
                <TouchableOpacity onPress={() => setProfileSheetOpen(false)}>
                  <Text className="text-sm text-gray-500">Cerrar</Text>
                </TouchableOpacity>
              </View>
              <View className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <Text className="text-xs text-gray-500">Sesión iniciada como</Text>
                <Text className="text-sm font-medium text-gray-900">{user?.email ?? 'Usuario'}</Text>
              </View>
              <TouchableOpacity
                className="rounded-lg bg-red-50 py-3"
                onPress={async () => {
                  setProfileSheetOpen(false);
                  await logout();
                }}
              >
                <Text className="text-center text-sm font-semibold text-red-600">Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default MobileTopBar;

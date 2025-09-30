import Dashboard from '@/features/dashboard/Dashboard';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardTab() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 96 }}
      >
        <View className="w-full">
          <Dashboard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

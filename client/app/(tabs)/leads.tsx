import Leads from '@/features/leads/Leads';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeadsTab() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 96 }}
      >
        <View className="w-full">
          <Leads onPressItem={(item) => router.push(`/leads/${item.id}`)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

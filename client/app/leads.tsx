import Leads from '@/features/leads/Leads';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function LeadsPage() {
  return (
    <View className="w-full relative" style={{ minHeight: 'calc(100vh - 56px)' } as any}>
      <Leads onPressItem={(item) => router.push(`/leads/${item.id}`)} />
    </View>
  );
}

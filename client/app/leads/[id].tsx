import LeadDetailContent from '@/features/leads/components/LeadDetailContent';
import { getLeadById } from '@/lib/mockData';
import type { Lead } from '@/models';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeadModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lead: Lead | undefined = useMemo(() => {
    if (!id) return undefined;
    return getLeadById(id.toString());
  }, [id]);

  if (!lead) {
    return null;
  }

  const windowWidth = Dimensions.get('window').width;
  const drawerWidth =
    Platform.OS === 'web' ? Math.min(520, Math.max(360, windowWidth * 0.38)) : windowWidth;

  return (
    <View className="absolute inset-0 z-50" pointerEvents="box-none">
      {/* Backdrop closes modal (respect safe areas) */}
      <Pressable
        style={{ top: insets.top, bottom: insets.bottom, left: 0, right: 0 }}
        className="absolute bg-black/20"
        onPress={() => router.back()}
      />

      {/* Right drawer (respect safe areas) */}
      <View
        style={{ width: drawerWidth, top: insets.top, bottom: insets.bottom }}
        className="absolute right-0 bg-white border-l border-gray-200 shadow-xl"
      >
        <LeadDetailContent lead={lead} onClose={() => router.back()} />
      </View>
    </View>
  );
}

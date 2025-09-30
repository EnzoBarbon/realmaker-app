import { mockConversationListItems } from '@/lib/mockData';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import ConversationsFiltersCard from './components/ConversationsFiltersCard';
import ConversationsHeader from './components/ConversationsHeader';
import ConversationsListCard from './components/ConversationsListCard';
import ConversationsStatsCards from './components/ConversationsStatsCards';

export default function Conversations() {
  return (
    <View className="gap-6">
      <ConversationsHeader />
      <ConversationsStatsCards />
      <ConversationsFiltersCard />
      <ConversationsListCard
        items={mockConversationListItems}
        onPressItem={(item) => router.push(`/conversation/${item.id}`)}
      />
    </View>
  );
}

import { mockLeadListItems } from '@/lib/mockData';
import type { LeadListItem } from '@/models';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import LeadsFiltersCard, { type LeadsFilters } from './components/LeadsFiltersCard';
import LeadsHeader from './components/LeadsHeader';
import LeadsListCard from './components/LeadsListCard';
import LeadsStatsCards from './components/LeadsStatsCards';

export default function Leads({ onPressItem }: { onPressItem?: (item: LeadListItem) => void }) {
  const [filters, setFilters] = useState<LeadsFilters>({
    searchQuery: '',
    stage: 'all',
    timePeriod: 'all',
  });

  // Filter leads based on current filters
  const filteredLeads = useMemo(() => {
    let filtered = mockLeadListItems;

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.zone?.toLowerCase().includes(query) ||
          lead.interestedProperty?.toLowerCase().includes(query),
      );
    }

    // Stage filter
    if (filters.stage !== 'all') {
      filtered = filtered.filter((lead) => lead.stage === filters.stage);
    }

    // Time period filter (mock implementation - would need actual dates in real app)
    if (filters.timePeriod === 'week') {
      filtered = filtered.filter((lead) => (lead.lastContactDays || 0) <= 7);
    }

    return filtered;
  }, [filters]);

  // Calculate counts for filter tabs
  const counts = useMemo(
    () => ({
      all: mockLeadListItems.length,
      calificado: mockLeadListItems.filter((l) => l.stage === 'calificado').length,
      visita_agendada: mockLeadListItems.filter((l) => l.stage === 'visita_agendada').length,
      cerrado: mockLeadListItems.filter((l) => l.stage === 'cerrado').length,
    }),
    [],
  );

  return (
    <View className="gap-6">
      <LeadsHeader />
      <LeadsStatsCards />
      <LeadsFiltersCard filters={filters} onFiltersChange={setFilters} counts={counts} />
      <LeadsListCard items={filteredLeads} onPressItem={onPressItem} />
    </View>
  );
}

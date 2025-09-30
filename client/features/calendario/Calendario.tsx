import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { mockAppointments } from '@/lib/mockData';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarHeader } from './components/CalendarHeader';
import { MonthCalendarCard } from './components/MonthCalendarCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { TodayInfoCard } from './components/TodayInfoCard';
import { UpcomingAppointmentsCard } from './components/UpcomingAppointmentsCard';
import { WeeklySummaryCard } from './components/WeeklySummaryCard';

type ViewMode = 'month' | 'week' | 'agenda';

export function Calendario() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleNewAppointment = () => {
    console.log('Nueva cita');
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
  };

  const handleAppointmentClick = (leadId: string) => {
    router.push(`/leads/${leadId}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Platform.select({ web: 32, default: 24 }),
          paddingTop: 12,
          paddingBottom: 96,
        }}
      >
        <AnimatedElement animationDelay={0}>
          <CalendarHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onNewAppointment={handleNewAppointment}
          />
        </AnimatedElement>

        <View className="flex-row gap-6">
          <View className="flex-1">
            <AnimatedElement animationDelay={100}>
              <MonthCalendarCard
                appointments={mockAppointments}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </AnimatedElement>
          </View>

          {Platform.OS === 'web' && (
            <View className="w-80">
              <View className="space-y-4">
                <AnimatedElement animationDelay={150}>
                  <TodayInfoCard
                    appointments={mockAppointments}
                    selectedDate={selectedDate}
                    onAppointmentClick={handleAppointmentClick}
                  />
                </AnimatedElement>
                <AnimatedElement animationDelay={200}>
                  <WeeklySummaryCard appointments={mockAppointments} />
                </AnimatedElement>
                <AnimatedElement animationDelay={250}>
                  <UpcomingAppointmentsCard
                    appointments={mockAppointments}
                    onAppointmentClick={handleAppointmentClick}
                  />
                </AnimatedElement>
                <AnimatedElement animationDelay={300}>
                  <QuickActionsCard onAction={handleQuickAction} />
                </AnimatedElement>
              </View>
            </View>
          )}
        </View>

        {Platform.OS !== 'web' && (
          <>
            <View className="mt-4">
              <AnimatedElement animationDelay={150}>
                <TodayInfoCard
                  appointments={mockAppointments}
                  selectedDate={selectedDate}
                  onAppointmentClick={handleAppointmentClick}
                />
              </AnimatedElement>
            </View>
            <View className="mt-4">
              <AnimatedElement animationDelay={200}>
                <WeeklySummaryCard appointments={mockAppointments} />
              </AnimatedElement>
            </View>
            <View className="mt-4">
              <AnimatedElement animationDelay={250}>
                <UpcomingAppointmentsCard
                  appointments={mockAppointments}
                  onAppointmentClick={handleAppointmentClick}
                />
              </AnimatedElement>
            </View>
            <View className="mt-4">
              <AnimatedElement animationDelay={300}>
                <QuickActionsCard onAction={handleQuickAction} />
              </AnimatedElement>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { Card } from '@/components/ui/Card';
import type { Appointment } from '@/models';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/outline';

type MonthCalendarCardProps = {
  appointments: Appointment[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export function MonthCalendarCard({
  appointments,
  selectedDate,
  onDateChange,
}: MonthCalendarCardProps) {
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();

  const previousMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = [];

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = previousMonthLastDay - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, day),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, day),
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, day),
    });
  }

  const goToPreviousMonth = () => {
    onDateChange(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    onDateChange(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasAppointments = (date: Date) => {
    return appointments.some((apt) => {
      const aptDate = new Date(apt.startDate);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <Card className="p-6">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-2">
          <CalendarIcon size={20} color="#f59e0b" />
          <Text className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={goToToday}
            className="px-3 py-1.5 rounded-lg border border-gray-200 active:opacity-80"
          >
            <Text className="text-sm text-gray-700">Hoy</Text>
          </Pressable>
          <Pressable
            onPress={goToPreviousMonth}
            className="p-1.5 rounded-lg border border-gray-200 active:opacity-80"
          >
            <ChevronLeftIcon size={18} color="#374151" />
          </Pressable>
          <Pressable
            onPress={goToNextMonth}
            className="p-1.5 rounded-lg border border-gray-200 active:opacity-80"
          >
            <ChevronRightIcon size={18} color="#374151" />
          </Pressable>
        </View>
      </View>

      {/* Day headers */}
      <View className="flex-row mb-2">
        {dayNames.map((day) => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-xs font-medium text-gray-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View>
        {Array.from({ length: 6 }).map((_, weekIndex) => (
          <View key={weekIndex} className="flex-row">
            {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayInfo, dayIndex) => {
              const today = isToday(dayInfo.date);
              const selected = isSelected(dayInfo.date);
              const hasApts = hasAppointments(dayInfo.date);

              return (
                <Pressable
                  key={dayIndex}
                  onPress={() => onDateChange(dayInfo.date)}
                  className={`flex-1 aspect-square items-center justify-center border-t border-r border-gray-100 active:opacity-80 ${
                    selected && !today ? 'bg-amber-50' : ''
                  }`}
                  style={{ borderLeftWidth: dayIndex === 0 ? 1 : 0 }}
                >
                  <View
                    className={`w-8 h-8 items-center justify-center rounded-full ${
                      today ? 'bg-amber-500' : selected ? 'border-2 border-amber-400' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        today
                          ? 'text-white font-semibold'
                          : selected
                            ? 'text-amber-600 font-medium'
                            : dayInfo.isCurrentMonth
                              ? 'text-gray-900'
                              : 'text-gray-300'
                      }`}
                    >
                      {dayInfo.day}
                    </Text>
                  </View>
                  {hasApts && <View className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" />}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </Card>
  );
}

import React from 'react';
import { View } from 'react-native';

type ProgressProps = {
  value: number; // 0..100
  tone?: 'primary' | 'success' | 'info' | 'warning';
};

const toneToClasses: Record<NonNullable<ProgressProps['tone']>, string> = {
  primary: 'bg-primary',
  success: 'bg-green-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

export function Progress({ value, tone = 'primary' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <View className={`h-full ${toneToClasses[tone]}`} style={{ width: `${clamped}%` }} />
    </View>
  );
}

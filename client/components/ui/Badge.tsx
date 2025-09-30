import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type BadgeProps = ViewProps & {
  tone?: 'success' | 'warning' | 'info' | 'muted';
  label: string;
};

const toneToClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  muted: 'bg-gray-50 text-gray-700 border-gray-200',
};

export function Badge({ label, tone = 'muted', style, ...props }: BadgeProps) {
  return (
    <View
      className={`px-2 py-1 rounded-full border ${toneToClasses[tone]}`}
      style={style}
      {...props}
    >
      <Text className="text-xs font-medium">{label}</Text>
    </View>
  );
}

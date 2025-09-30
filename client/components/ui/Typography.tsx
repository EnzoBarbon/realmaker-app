import React from 'react';
import { Text, TextProps } from 'react-native';

type Props = TextProps & { children: React.ReactNode };

export function H1({ style, children, ...props }: Props) {
  return (
    <Text
      className="text-2xl md:text-3xl text-brand"
      style={[{ fontFamily: 'Inter_600SemiBold' }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function Muted({ style, children, ...props }: Props) {
  return (
    <Text
      className="text-sm text-gray-500"
      style={[{ fontFamily: 'Inter_400Regular' }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function Label({ style, children, ...props }: Props) {
  return (
    <Text
      className="text-xs text-gray-700"
      style={[{ fontFamily: 'Inter_500Medium' }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

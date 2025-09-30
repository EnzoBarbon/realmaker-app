import React from 'react';
import { View, ViewProps } from 'react-native';

type CardProps = ViewProps & { children: React.ReactNode };

// Merge base classes with any incoming className (so consumers can add width/layout classes)
export function Card({ style, children, className, ...props }: CardProps & { className?: string }) {
  const merged = [
    'bg-background-card rounded-xl shadow-card border border-gray-100',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View className={merged} style={style} {...props}>
      {children}
    </View>
  );
}

export function CardBody({ style, children, className, ...props }: CardProps & { className?: string }) {
  const merged = ['p-4', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <View className={merged} style={style} {...props}>
      {children}
    </View>
  );
}

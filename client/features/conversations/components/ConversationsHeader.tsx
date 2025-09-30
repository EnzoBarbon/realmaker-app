import React from 'react';
import { View } from 'react-native';
import { H1, Muted } from '@/components/ui/Typography';
import { AnimatedElement } from '@/components/animation/AnimatedElement';

export default function ConversationsHeader() {
  return (
    <View>
      <AnimatedElement animationIndex={0}>
        <H1>Conversaciones</H1>
      </AnimatedElement>
      <AnimatedElement animationIndex={1}>
        <Muted>Historial completo de interacciones con clientes</Muted>
      </AnimatedElement>
    </View>
  );
}


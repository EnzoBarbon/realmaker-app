import React from 'react';
import { View } from 'react-native';
import { H1, Muted } from '@/components/ui/Typography';
import { AnimatedElement } from '@/components/animation/AnimatedElement';

export default function LeadsHeader() {
  return (
    <View>
      <AnimatedElement animationIndex={0}>
        <H1>Leads</H1>
      </AnimatedElement>
      <AnimatedElement animationIndex={1}>
        <Muted>Gestión y seguimiento de oportunidades</Muted>
      </AnimatedElement>
    </View>
  );
}


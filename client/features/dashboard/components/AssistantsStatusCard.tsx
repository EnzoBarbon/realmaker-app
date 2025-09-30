import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardBody } from '@/components/ui/Card';
import { H1, Muted } from '@/components/ui/Typography';
import { Progress } from '@/components/ui/Progress';
import { AnimatedElement } from '@/components/animation/AnimatedElement';

type Metric = {
  label: string;
  valueLeft?: string;
  valueRight?: string;
  progress: number; // 0..100
  tone?: 'primary' | 'success' | 'info' | 'warning';
};

function MetricRow({ label, valueLeft, valueRight, progress, tone = 'primary' }: Metric) {
  return (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <Progress value={progress} tone={tone} />
      {(valueLeft || valueRight) && (
        <View className="mt-1 flex-row justify-between">
          {valueLeft ? <Muted>{valueLeft}</Muted> : <View />}
          {valueRight ? <Muted>{valueRight}</Muted> : null}
        </View>
      )}
    </View>
  );
}

export default function AssistantsStatusCard({ metrics }: { metrics: Metric[] }) {
  return (
    <AnimatedElement animationDelay={200}>
      <Card>
        <CardBody>
          <H1>Estado de los Asistentes</H1>
          <View className="mt-4 gap-4">
            {metrics.map((m, i) => (
              <MetricRow key={`${m.label}-${i}`} {...m} />
            ))}
          </View>
        </CardBody>
      </Card>
    </AnimatedElement>
  );
}


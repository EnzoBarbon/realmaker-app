import React from 'react';
import { ViewProps } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';

export interface AnimatedElementProps extends ViewProps {
  children: React.ReactNode;
  animationIndex?: number;
  animationDelay?: number;
  className?: string;
  animated?: boolean;
}

export function AnimatedElement({
  children,
  animationIndex = 0,
  animationDelay,
  className,
  animated = true,
  style,
  ...props
}: AnimatedElementProps) {
  const delay = animationDelay ?? animationIndex * 150;
  const entering = animated
    ? FadeInUp.duration(500).easing(Easing.out(Easing.cubic)).delay(delay)
    : undefined;

  return (
    <Animated.View entering={entering} className={className} style={style} {...props}>
      {children}
    </Animated.View>
  );
}

export default AnimatedElement;


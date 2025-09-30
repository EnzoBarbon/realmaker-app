import React from 'react';
import { ViewProps } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';

type Props = ViewProps & {
  animated?: boolean;
  delay?: number;
};

export function AnimatedInView({ children, animated = true, delay = 0, style, ...rest }: Props) {
  const entering = animated ? FadeInUp.duration(500).easing(Easing.out(Easing.cubic)).delay(delay) : undefined;
  return (
    <Animated.View entering={entering} style={style} {...rest}>
      {children}
    </Animated.View>
  );
}

export default AnimatedInView;


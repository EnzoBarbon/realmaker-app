import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedElementProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  animationIndex?: number;
  animationDelay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  animated?: boolean;
}

export function AnimatedElement({
  children,
  animationIndex = 0,
  animationDelay,
  className,
  as: Component = 'div',
  animated = true,
  ...props
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const delay = animationDelay ?? animationIndex * 150;
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [animated, animationIndex, animationDelay]);

  const ElementComponent = Component as React.ElementType;

  return (
    <ElementComponent
      className={cn(
        animated && 'transform transition-all duration-500 ease-out',
        animated && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
        className,
      )}
      {...props}
    >
      {children}
    </ElementComponent>
  );
}

export default AnimatedElement;


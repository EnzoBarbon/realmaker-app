import React, { useEffect, useRef, useState } from 'react';
import cn from '@/lib/cn';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  animated?: boolean;
  delay?: number;
  once?: boolean;
};

export function AnimatedInView({
  children,
  className,
  animated = true,
  delay = 0,
  once = true,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [animated, once]);

  return (
    <div
      ref={ref}
      className={cn(
        animated && 'transform transition-all duration-500 ease-out will-change-transform',
        animated && (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
        className
      )}
      style={animated ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

export default AnimatedInView;


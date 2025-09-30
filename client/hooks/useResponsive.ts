import { useWindowDimensions, Platform } from 'react-native';
import { useEffect, useState } from 'react';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const [webWidth, setWebWidth] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const update = () => setWebWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const effectiveWidth = Platform.OS === 'web' && webWidth != null ? webWidth : width;
  // Treat web widths below 768px as compact (mobile-like)
  const isCompact = Platform.OS === 'web' ? effectiveWidth < 768 : true;
  return { width: effectiveWidth, height, isCompact, platform: Platform.OS };
}

export default useResponsive;

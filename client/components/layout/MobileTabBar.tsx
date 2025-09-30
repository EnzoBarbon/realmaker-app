import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom mobile tab bar styled to match the app color schema
export default function MobileTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 items-center h-14"
      style={{ bottom: Math.max(insets.bottom + 0, 0) }}
    >
      <View className="mx-2 w-[95%] rounded-3xl border border-muted bg-background-card shadow-card">
        <View className="flex-row items-center justify-between px-3 py-2">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };
            const handleLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            const renderIcon = (focused: boolean) => {
              const color = focused ? '#1E293B' : '#6B7280';
              const size = 24;
              return typeof options.tabBarIcon === 'function'
                ? options.tabBarIcon({ focused, color, size })
                : null;
            };

            return (
              <TabItem
                key={route.key}
                isFocused={isFocused}
                onPress={handlePress}
                onLongPress={handleLongPress}
                renderIcon={renderIcon}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

function TabItem({
  isFocused,
  onPress,
  onLongPress,
  renderIcon,
}: {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  renderIcon: (focused: boolean) => React.ReactNode;
}) {
  const scale = useSharedValue(isFocused ? 1.06 : 1);
  const indicator = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1.08 : 1, {
      duration: 140,
      easing: Easing.out(Easing.cubic),
    });
    indicator.value = withTiming(isFocused ? 1 : 0, {
      duration: 140,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: indicator.value,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center px-2 py-2"
    >
      <Animated.View
        style={iconAnimatedStyle}
        className={`items-center justify-center rounded-2xl ${isFocused ? 'bg-muted px-3 py-2' : ''}`}
      >
        {renderIcon(isFocused)}
      </Animated.View>
      <Animated.View
        style={indicatorAnimatedStyle}
        className={`mt-1 h-1 w-4 rounded-full bg-primary`}
      />
    </Pressable>
  );
}

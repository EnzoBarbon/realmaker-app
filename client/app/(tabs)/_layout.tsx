import MobileTabBar from '@/components/layout/MobileTabBar';
import MobileTopBar from '@/components/layout/MobileTopBar';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  PhoneIcon,
  UsersIcon,
} from 'react-native-heroicons/solid';

function IconWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        animation: 'shift',
        tabBarActiveTintColor: activeColor,
        headerShown: true,
        header: () => (
          <View>
            <MobileTopBar />
          </View>
        ),
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <MobileTabBar {...props} />}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused, size = 22 }) => (
            <IconWrapper>
              <HomeIcon
                size={size}
                color={color as string}
                fill={`${focused ? '#383730' : '#a8a8a4'}`}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Conversaciones',
          tabBarIcon: ({ color, focused, size = 22 }) => (
            <IconWrapper>
              <ChatBubbleLeftRightIcon
                size={size}
                color={color as string}
                fill={`${focused ? '#383730' : '#a8a8a4'}`}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, focused, size = 22 }) => (
            <IconWrapper>
              <UsersIcon
                size={size}
                color={color as string}
                fill={`${focused ? '#383730' : '#a8a8a4'}`}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="asistentes"
        options={{
          title: 'Asistentes',
          tabBarIcon: ({ color, focused, size = 22 }) => (
            <IconWrapper>
              <PhoneIcon
                size={size}
                color={color as string}
                fill={`${focused ? '#383730' : '#a8a8a4'}`}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, focused, size = 22 }) => (
            <IconWrapper>
              <CalendarIcon
                size={size}
                color={color as string}
                fill={`${focused ? '#383730' : '#a8a8a4'}`}
              />
            </IconWrapper>
          ),
        }}
      />
    </Tabs>
  );
}

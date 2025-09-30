import { BottomBar } from '@/components/layout/BottomBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type Props = { children: React.ReactNode };

export function Shell({ children }: Props) {
  // const { isCompact, platform } = useResponsive();
  const [sidebarMode, setSidebarMode] = useState<'fixed' | 'collapsed' | 'hoverable'>('fixed');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWeb = true;
  const isCompact = false;

  return (
    // Outer container
    <View className="min-h-screen w-full flex-row bg-background">
      {/* Desktop Sidebar */}
      {isWeb && !isCompact ? (
        <View>
          <Sidebar mode={sidebarMode} />
        </View>
      ) : null}

      {/* Main area */}
      <View className="relative min-h-screen flex-1">
        {/* Topbar */}
        {isWeb ? (
          <Topbar
            isCompact={isCompact}
            sidebarMode={sidebarMode}
            onCycleSidebarMode={() =>
              setSidebarMode((m) =>
                m === 'fixed' ? 'collapsed' : m === 'collapsed' ? 'hoverable' : 'fixed',
              )
            }
            onToggleMenu={() => setMobileMenuOpen(true)}
          />
        ) : null}

        {/* Content scroll container */}
        <ScrollView
          style={isWeb ? ({ height: 'calc(100vh - 56px)' } as any) : ({ flex: 1 } as any)}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
            // Add larger bottom padding only on native where the tab bar exists
            paddingBottom: !isWeb ? 96 : 24,
          }}
        >
          <View className="w-full">{children}</View>
        </ScrollView>

        {/* Bottom bar only for native */}
        {!isWeb ? (
          <View className="absolute bottom-0 left-0 right-0">
            <BottomBar />
          </View>
        ) : null}
      </View>

      {/* Mobile / compact overlay menu for web */}
      {isWeb && isCompact && mobileMenuOpen ? (
        <View className="absolute inset-0 z-20">
          {/* Backdrop */}
          <Pressable
            className="absolute inset-0 bg-black/30"
            onPress={() => setMobileMenuOpen(false)}
          />
          {/* Panel */}
          <View className="absolute left-0 top-0 h-full w-[260px] border-r border-gray-100 bg-white">
            <Sidebar mode="fixed" onNavigate={() => setMobileMenuOpen(false)} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default Shell;

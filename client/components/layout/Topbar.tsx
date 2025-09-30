import React from 'react';
import { View } from 'react-native';

type Props = {
  isCompact?: boolean;
  sidebarMode?: 'fixed' | 'collapsed' | 'hoverable';
  onCycleSidebarMode?: () => void;
  onToggleMenu?: () => void;
};

// Native fallback (web uses Topbar.web.tsx). Kept minimal for typing and compatibility.
export function Topbar(_props: Props) {
  return <View />;
}

export default Topbar;

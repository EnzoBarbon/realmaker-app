import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  UsersIcon,
} from 'react-native-heroicons/outline';

type Item = {
  label: string;
  href?: string;
  badge?: string;
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
};

const main: Item[] = [
  { label: 'Dashboard', href: '/', Icon: HomeIcon },
  { label: 'Conversaciones', href: '/conversations', badge: '3', Icon: ChatBubbleLeftRightIcon },
  { label: 'Leads', href: '/leads', badge: '12', Icon: UsersIcon },
  { label: 'Asistentes', href: '/asistentes', Icon: PhoneIcon },
  { label: 'Calendario', href: '/calendario', Icon: CalendarIcon },
];

// Removed split assistants list; single entry exists in main

const tools: Item[] = [
  { label: 'Integraciones', Icon: Squares2X2Icon },
  { label: 'Análisis', Icon: ChartBarIcon },
  { label: 'Configuración', Icon: Cog6ToothIcon },
];

const others: Item[] = [{ label: 'Ayuda', Icon: QuestionMarkCircleIcon }];

type SidebarMode = 'fixed' | 'collapsed' | 'hoverable';

type SidebarProps = {
  mode?: SidebarMode;
  onNavigate?: () => void;
};

export function Sidebar({ mode = 'fixed', onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Width and interaction rules per mode
  const containerBase =
    'hidden md:flex group flex-col justify-between bg-white transition-all duration-300 ease-in-out m-3 rounded-2xl border border-gray-100 shadow-card h-[calc(100vh-24px)]';
  const widthClass =
    mode === 'fixed' ? 'w-[260px]' : mode === 'collapsed' ? 'w-[72px]' : 'w-[72px] hover:w-[260px]';
  const collapsed = mode !== 'fixed';

  return (
    <div className={`${containerBase} ${widthClass}`}>
      <div>
        <div className={`flex flex-col px-4 py-5 ${collapsed ? 'items-center' : ''}`}>
          <div className="text-xl font-semibold text-gray-900">
            {collapsed ? 'RM' : 'RealMaker'}
          </div>
          <div
            className={`${
              mode === 'fixed'
                ? 'opacity-100'
                : mode === 'collapsed'
                  ? 'opacity-0'
                  : 'opacity-0 group-hover:opacity-100'
            } transition-opacity duration-200 text-xs text-gray-500`}
          >
            {!collapsed ? 'Asistente IA' : ''}
          </div>
        </div>

        <Section
          items={main}
          mode={mode}
          getActive={(item) =>
            !!item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))
          }
          onItemPress={(item) => {
            if (item.href) router.push(item.href as any);
            onNavigate?.();
          }}
        />
        <Separator />
        <Section items={tools} mode={mode} onNavigate={onNavigate} />
        <Separator />
        <Section items={others} mode={mode} onNavigate={onNavigate} />
      </div>
      <div className={`flex px-4 py-4 ${collapsed ? 'items-center' : ''}`}>
        <div className="text-xs text-gray-400">© 2024 RM</div>
      </div>
    </div>
  );
}

function Section({
  items,
  activeIndex,
  mode,
  onNavigate,
  getActive,
  onItemPress,
}: {
  items: Item[];
  activeIndex?: number;
  mode?: SidebarMode;
  onNavigate?: () => void;
  getActive?: (item: Item, index: number) => boolean;
  onItemPress?: (item: Item, index: number) => void;
}) {
  const collapsed = mode !== 'fixed';
  return (
    <div
      className={`${mode === 'fixed' ? 'px-3' : mode === 'hoverable' ? 'px-3 group-hover:px-3' : 'px-3'} py-2`}
    >
      <div className="flex flex-col gap-1">
        {items.map((item, i) => {
          const active = getActive ? getActive(item, i) : i === activeIndex;
          return (
            <div
              key={i}
              onClick={() => (onItemPress ? onItemPress(item, i) : onNavigate?.())}
              className={`group/item flex h-10 w-full cursor-pointer items-center rounded-lg ${
                active
                  ? 'border border-amber-200 bg-amber-50 border-r-2 border-r-amber-400'
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Left icon column: fixed 72px, always centered */}
              <div className="flex w-[72px] flex-none items-center justify-center -translate-x-3">
                {item.Icon ? <item.Icon size={18} color="#334155" /> : null}
              </div>
              {/* Middle label column */}
              <div
                className={`${
                  mode === 'fixed'
                    ? 'flex'
                    : mode === 'hoverable'
                      ? 'hidden group-hover:flex'
                      : 'hidden'
                } flex-1 overflow-hidden pr-3 text-sm text-gray-700 transition-opacity duration-200 -translate-x-3`}
              >
                {item.label}
              </div>
              {/* Right badge column */}
              <div
                className={`${
                  mode === 'fixed'
                    ? 'flex'
                    : mode === 'hoverable'
                      ? 'hidden group-hover:flex'
                      : 'hidden'
                } flex-none items-center justify-end pr-3`}
              >
                {item.badge ? (
                  <div className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                    {item.badge}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Separator() {
  return <div className="my-2 h-px bg-gray-100" />;
}

export default Sidebar;

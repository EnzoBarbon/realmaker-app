import ConversationsFiltersCard from './components/ConversationsFiltersCard';
import ConversationsHeader from './components/ConversationsHeader';
import ConversationsListCard from './components/ConversationsListCard';
import ConversationsStatsCards from './components/ConversationsStatsCards';
import ConversationDetailContent from './components/ConversationDetailContent';
import type { ConversationDetail, ConversationListItem } from '@/models';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { createPortal } from 'react-dom';

function buildMockDetail(id?: string): ConversationDetail {
  const isPhone = id?.toString().endsWith('1');
  return {
    conversation: {
      id: id?.toString() ?? 'c1',
      channel: isPhone ? 'phone' : 'whatsapp',
      name: 'María González',
      phone: '+1 234 567 8901',
      property: 'Casa en Zona Norte - $350,000',
      status: 'Completada',
      timeAgo: 'Hace 5 min',
      duration: '8m 23s',
      score: 92,
    },
    messages: [
      { id: 'm1', author: 'IA', text: 'Hola, soy Elena de RealMaker.', at: '14:32:15' },
      { id: 'm2', author: 'User', text: '¿Detalles de la casa por favor?', at: '14:32:25' },
      {
        id: 'm3',
        author: 'IA',
        text: '3 habitaciones, 2.5 baños y jardín 150m².',
        at: '14:32:40',
      },
    ],
  };
}

export default function Conversations() {
  const items: ConversationListItem[] = [
    {
      id: 'c1',
      channel: 'phone',
      name: 'María González',
      phone: '+1 234 567 8901',
      property: 'Casa en Zona Norte - $350,000',
      note: 'Cliente interesado en visita. Programada para mañana 3:00 PM',
      timeAgo: 'Hace 5 min',
      duration: '8m 23s',
      status: 'Completada',
      score: 92,
    },
    {
      id: 'c2',
      channel: 'whatsapp',
      name: 'Carlos Ruiz',
      phone: '+1 234 567 8902',
      property: 'Apartamento Centro - $280,000',
      note: '“Perfecto, me interesa conocer más detalles sobre el apartamento”',
      timeAgo: 'Hace 12 min',
      duration: 'Activa',
      status: 'En curso',
      score: 78,
    },
    {
      id: 'c3',
      channel: 'phone',
      name: 'Ana Martínez',
      phone: '+1 234 567 8903',
      property: 'Casa en Suburbios - $420,000',
      note: 'Solicitó información adicional. Enviar brochure por email',
      timeAgo: 'Hace 23 min',
      duration: '12m 45s',
      status: 'Completada',
      score: 65,
    },
  ];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const detail = useMemo(() => (selectedId ? buildMockDetail(selectedId) : null), [selectedId]);
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(520, Math.max(360, width * 0.38));

  return (
    <View className="gap-6 relative" style={{ minHeight: 'calc(100vh - 56px)' } as any}>
      <ConversationsHeader />
      <ConversationsStatsCards />
      <ConversationsFiltersCard />
      <ConversationsListCard items={items} onPressItem={(item) => setSelectedId(item.id)} />

      {detail ? <GlobalOverlay onClose={() => setSelectedId(null)} width={drawerWidth}>
        <ConversationDetailContent detail={detail} onClose={() => setSelectedId(null)} />
      </GlobalOverlay> : null}
    </View>
  );
}

function GlobalOverlay({ children, onClose, width }: { children: React.ReactNode; onClose: () => void; width: number }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-overlay-root', 'true');
    el.style.position = 'fixed';
    el.style.inset = '0px';
    el.style.zIndex = '50';
    el.style.pointerEvents = 'auto';
    document.body.appendChild(el);
    mountRef.current = el;
    setMounted(true);
    return () => {
      el.parentNode?.removeChild(el);
      mountRef.current = null;
    };
  }, []);

  if (!mounted || !mountRef.current) return null;

  return createPortal(
    <View style={{ position: 'relative', width: '100%', height: '100%' } as any}>
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as any}
        className="bg-black/20"
      />
      {/* Right drawer */}
      <View
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width } as any}
        className="bg-white border-l border-gray-200 shadow-xl"
      >
        {children}
      </View>
    </View>,
    mountRef.current,
  );
}

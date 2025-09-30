import { useAuth } from '@/store/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowsRightLeftIcon,
  Bars3Icon,
  BellIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
} from 'react-native-heroicons/outline';

type Props = {
  isCompact?: boolean;
  sidebarMode?: 'fixed' | 'collapsed' | 'hoverable';
  onCycleSidebarMode?: () => void;
  onToggleMenu?: () => void;
};

export function Topbar({ isCompact, sidebarMode, onCycleSidebarMode, onToggleMenu }: Props) {
  const { logout, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className="sticky top-0 z-30 p-3">
      <div className="flex h-16 w-full items-center justify-between px-6 bg-white rounded-2xl border border-gray-100 shadow-card backdrop-blur-xl">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {isCompact ? (
            <button
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
              onClick={onToggleMenu}
            >
              <Bars3Icon size={20} color="#374151" />
            </button>
          ) : (
            <button
              aria-label="Cycle sidebar mode"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all md:inline-flex"
              onClick={onCycleSidebarMode}
            >
              {sidebarMode === 'fixed' ? (
                <ChevronDoubleLeftIcon size={18} color="#374151" />
              ) : sidebarMode === 'collapsed' ? (
                <ChevronDoubleRightIcon size={18} color="#374151" />
              ) : (
                <ArrowsRightLeftIcon size={18} color="#374151" />
              )}
            </button>
          )}

          {/* Welcome message with better styling */}
          <div className="hidden md:flex items-center gap-3">
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900">¡Bienvenido de vuelta!</div>
              <div className="text-xs text-gray-500">Gestiona tus asistentes de IA</div>
            </div>
          </div>
        </div>

        {/* Center - Enhanced search */}
        <div className="hidden lg:block flex-1 max-w-xl mx-8">
          <div
            className={`relative transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon size={20} color="#9CA3AF" />
            </div>
            <input
              type="text"
              placeholder="Buscar leads, conversaciones, configuraciones..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 
                         hover:border-gray-300 transition-all duration-200"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <button className="lg:hidden h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all">
            <MagnifyingGlassIcon size={18} color="#374151" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all group">
              <BellIcon size={18} color="#374151" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
          </div>

          {/* Quick action button */}
          <button
            className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-gray-900 font-medium text-sm 
                           hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PlusIcon size={16} />
            <span>Nuevo Lead</span>
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-3 h-10 pl-3 pr-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-600 text-xs font-semibold text-gray-900 shadow-sm">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'RM'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <div className="text-sm font-medium text-gray-900">Real Maker</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <ChevronDownIcon
                size={16}
                color="#9CA3AF"
                className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-gray-900">Real Maker Admin</div>
                  <div className="text-sm text-gray-500">admin@realmaker.com</div>
                </div>

                <div className="py-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <UserIcon size={16} />
                    Mi Perfil
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Cog6ToothIcon size={16} />
                    Configuración
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;

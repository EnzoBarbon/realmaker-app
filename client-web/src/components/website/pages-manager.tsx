import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { GripVertical, Home, Building2, User, Mail } from 'lucide-react';

interface PagesManagerProps {
  pages: any;
  onPagesChange: (pages: any) => void;
}

const pagesConfig = [
  {
    id: 'home',
    label: 'Inicio',
    icon: Home,
    description: 'Página principal con hero y destacados'
  },
  {
    id: 'properties',
    label: 'Propiedades',
    icon: Building2,
    description: 'Listado de propiedades disponibles'
  },
  {
    id: 'about',
    label: 'Sobre nosotros',
    icon: User,
    description: 'Información sobre tu agencia'
  },
  {
    id: 'contact',
    label: 'Contacto',
    icon: Mail,
    description: 'Formulario de contacto y datos'
  }
];

export function PagesManager({ pages, onPagesChange }: PagesManagerProps) {
  const handleTogglePage = (pageId: string) => {
    onPagesChange({
      ...pages,
      [pageId]: {
        ...pages[pageId],
        enabled: !pages[pageId].enabled
      }
    });
  };

  const enabledPages = Object.entries(pages)
    .filter(([, page]: [string, any]) => page.enabled)
    .sort((a, b) => a[1].order - b[1].order);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-gray-900 mb-3 text-xl">Gestión de páginas</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Activa o desactiva las páginas de tu sitio web
        </p>
      </div>

      <div className="space-y-5">
        {pagesConfig.map((pageConfig) => {
          const Icon = pageConfig.icon;
          const page = pages[pageConfig.id];
          
          return (
            <div
              key={pageConfig.id}
              className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all ${
                page.enabled
                  ? 'border-gray-200 bg-white shadow-md'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex-shrink-0">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                  page.enabled ? 'bg-primary/10 ring-4 ring-primary/20' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-7 w-7 ${page.enabled ? 'text-primary' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-gray-900 font-semibold text-lg">{pageConfig.label}</p>
                  {page.enabled && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-green-100 text-green-700 font-semibold">
                      Activa
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{pageConfig.description}</p>
              </div>

              <div className="flex-shrink-0">
                <Switch
                  checked={page.enabled}
                  onCheckedChange={() => handleTogglePage(pageConfig.id)}
                  disabled={pageConfig.id === 'home'} // Home siempre activa
                  className="scale-110"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
        <p className="text-sm text-blue-900 leading-relaxed">
          💡 La página de Inicio siempre está activa y es la primera que verán tus visitantes
        </p>
      </div>

      {/* Páginas activas en orden */}
      <div className="pt-8 border-t-2 border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-5">Orden de navegación</h4>
        <div className="space-y-4">
          {enabledPages.map(([pageId, page], index) => {
            const pageConfig = pagesConfig.find(p => p.id === pageId);
            if (!pageConfig) return null;
            const Icon = pageConfig.icon;
            
            return (
              <div
                key={pageId}
                className="flex items-center gap-5 p-5 rounded-xl bg-gray-50 border-2 border-gray-200"
              >
                <GripVertical className="h-6 w-6 text-gray-400" />
                <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-sm text-primary font-bold ring-2 ring-primary/20">
                  {index + 1}
                </span>
                <Icon className="h-6 w-6 text-gray-500" />
                <span className="text-sm text-gray-700 font-semibold">{pageConfig.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
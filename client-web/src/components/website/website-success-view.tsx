import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Globe, 
  Eye,
  Edit,
  Check,
  Sparkles,
  Copy,
  Monitor,
  Smartphone,
  X
} from 'lucide-react';
import { useState } from 'react';
import { WebsitePreview } from './website-preview';

interface WebsiteSuccessViewProps {
  config: any;
  agencyData: any;
  onEnterEditor: () => void;
  onPublish?: () => void;
  isNewlyCreated?: boolean; // Indica si la web acaba de ser creada o ya existía
}

export function WebsiteSuccessView({ config, agencyData, onEnterEditor, onPublish, isNewlyCreated = true }: WebsiteSuccessViewProps) {
  const [viewportSize, setViewportSize] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header con acciones */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-gray-900">
                {isNewlyCreated ? 'Tu página web está lista' : 'Tu página web'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isNewlyCreated 
                  ? 'Personaliza tu sitio web en el editor antes de publicarlo'
                  : 'Edita y personaliza tu sitio web en cualquier momento'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={onEnterEditor}
              className="bg-primary hover:bg-primary/90 gap-2 h-11 px-6"
            >
              <Edit className="h-4 w-4" />
              Abrir editor
            </Button>
          </div>
        </div>
      </Card>

      {/* Vista previa */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-gray-500" />
              <h3 className="text-gray-900">Vista previa del sitio web</h3>
            </div>
            
            {/* Selector de dispositivo */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewportSize('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  viewportSize === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-xs">Escritorio</span>
              </button>
              <button
                onClick={() => setViewportSize('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  viewportSize === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-xs">Móvil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la vista previa */}
        <div className="bg-gray-50 p-6">
          <div className={`mx-auto transition-all duration-300 ${
            viewportSize === 'mobile' ? 'max-w-[375px]' : 'w-full'
          }`}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <WebsitePreview
                config={config}
                agencyData={agencyData}
                viewportSize={viewportSize}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
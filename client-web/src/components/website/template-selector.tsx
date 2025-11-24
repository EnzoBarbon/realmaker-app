import { Check } from 'lucide-react';
import { Card } from '../ui/card';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Diseño limpio y minimalista con énfasis en las imágenes',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    features: ['Hero full-width', 'Grid de propiedades', 'Animaciones suaves']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Elegante y sofisticado, ideal para propiedades premium',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    features: ['Diseño exclusivo', 'Tipografía serif', 'Efectos de lujo']
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Simple y funcional, enfocado en el contenido',
    thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
    features: ['Diseño limpio', 'Espacios blancos', 'Fácil navegación']
  },
  {
    id: 'dynamic',
    name: 'Dinámico',
    description: 'Vibrante y energético con mucho movimiento',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    features: ['Animaciones', 'Colores vibrantes', 'Interactivo']
  }
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-gray-900 mb-3 text-xl">Elige una plantilla</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Selecciona el diseño base para tu sitio web inmobiliario
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
              selectedTemplate === template.id
                ? 'border-primary bg-primary/5 ring-4 ring-primary/20 shadow-lg'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex gap-6 p-6">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-48 h-36 object-cover rounded-xl ring-2 ring-gray-200 shadow-md"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-primary/20 rounded-xl flex items-center justify-center">
                    <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                      <Check className="h-7 w-7 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 py-2">
                <h4 className="text-gray-900 mb-3 text-xl font-semibold">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{template.description}</p>
                
                <div className="flex flex-wrap gap-2.5">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-xs text-gray-700 font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
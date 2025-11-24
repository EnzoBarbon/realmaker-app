import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Globe, Sparkles, Layout, Palette, Rocket, CheckCircle2 } from 'lucide-react';

interface WebsiteEmptyStateProps {
  onStartCreation: () => void;
}

export function WebsiteEmptyState({ onStartCreation }: WebsiteEmptyStateProps) {
  const features = [
    {
      icon: Layout,
      title: 'Plantillas profesionales',
      description: 'Elige entre diseños modernos y elegantes'
    },
    {
      icon: Palette,
      title: 'Personalización total',
      description: 'Colores, tipografía y diseño a tu medida'
    },
    {
      icon: Globe,
      title: 'Tu dominio incluido',
      description: 'Subdominio .realmaker.ai listo para usar'
    }
  ];

  const benefits = [
    'Diseño responsive para móvil, tablet y desktop',
    'Publicación de propiedades en tiempo real',
    'Optimización SEO automática',
    'Sin necesidad de código'
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-12 text-center border-b-2 border-gray-100">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 ring-4 ring-primary/20 mb-6">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-gray-900 mb-4 text-3xl">
              Crea tu página web inmobiliaria
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Potencia tu negocio con un sitio web profesional. Muestra tus propiedades, 
              conecta con clientes y aumenta tus ventas en minutos.
            </p>
          </div>

          {/* Características principales */}
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-50 border-2 border-gray-100 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={onStartCreation}
                className="bg-primary hover:bg-primary/90 h-14 px-10 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-3"
              >
                <Sparkles className="h-5 w-5" />
                Crear mi página web
                <Rocket className="h-5 w-5" />
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Configuración en menos de 5 minutos
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
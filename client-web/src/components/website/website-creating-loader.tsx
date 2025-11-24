import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { 
  Globe, 
  Layout, 
  Palette, 
  FileText, 
  Settings,
  Check,
  Loader2
} from 'lucide-react';

interface WebsiteCreatingLoaderProps {
  onComplete: () => void;
}

export function WebsiteCreatingLoader({ onComplete }: WebsiteCreatingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Layout,
      title: 'Configurando plantilla',
      description: 'Preparando diseño y estructura',
      duration: 1000
    },
    {
      icon: Palette,
      title: 'Aplicando personalización',
      description: 'Configurando colores y estilos',
      duration: 1000
    },
    {
      icon: FileText,
      title: 'Creando páginas',
      description: 'Generando páginas de tu sitio web',
      duration: 900
    },
    {
      icon: Globe,
      title: 'Registrando dominio',
      description: 'Configurando tu URL personalizada',
      duration: 1100
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    } else {
      // Pequeña pausa antes de completar
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep]);

  const isComplete = currentStep === steps.length;

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
      <Card className="w-full max-w-2xl border shadow-xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isComplete ? '¡Tu página web está lista!' : 'Creando tu página web'}
            </h2>
            <p className="text-gray-600">
              {isComplete 
                ? 'Todo configurado correctamente. Redirigiendo...'
                : 'Por favor espera mientras configuramos tu sitio web'
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              const isPending = currentStep < index;

              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-5 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-2 border-green-200'
                      : isActive
                      ? 'bg-primary/5 border-2 border-primary/20'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-600'
                        : isActive
                        ? 'bg-primary'
                        : 'bg-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6 text-white" />
                    ) : isActive ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6 text-white/70" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p
                      className={`font-semibold ${
                        isCompleted
                          ? 'text-green-900'
                          : isActive
                          ? 'text-gray-900'
                          : 'text-gray-700'
                      }`}
                    >
                      {isActive ? `${step.title}...` : step.title}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        isCompleted
                          ? 'text-green-700'
                          : isActive
                          ? 'text-gray-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {isActive
                        ? step.description
                        : isCompleted
                        ? '✓ Completado'
                        : step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              >
                <div className="h-full w-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">
                Paso {Math.min(currentStep + 1, steps.length)} de {steps.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Complete Message */}
          {isComplete && (
            <div className="mt-6 flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">
                Página web creada exitosamente
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

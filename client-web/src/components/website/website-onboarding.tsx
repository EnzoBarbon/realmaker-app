import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Globe,
  Layout,
  Palette,
  Link as LinkIcon,
  Sparkles,
  Home,
  Building2,
  Mail,
  User,
  Eye,
  Star
} from 'lucide-react';

interface WebsiteOnboardingProps {
  agencyData: {
    name: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    description: string;
  };
  onComplete: (config: any) => void;
}

interface OnboardingData {
  siteName: string;
  siteDescription: string;
  template: string;
  primaryColor: string;
  domain: string;
}

const templates = [
  {
    id: 'modern',
    name: 'Moderno',
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
  },
  {
    id: 'elegant',
    name: 'Elegante',
    preview: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop'
  }
];

const colorPresets = [
  { name: 'Dorado', value: '#e7af2a' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Púrpura', value: '#8b5cf6' },
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Índigo', value: '#6366f1' }
];

export function WebsiteOnboarding({ agencyData, onComplete }: WebsiteOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [data, setData] = useState<OnboardingData>({
    siteName: agencyData.name,
    siteDescription: agencyData.description,
    template: 'modern',
    primaryColor: '#e7af2a',
    domain: agencyData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  });

  const steps = [
    { number: 1, title: 'Info', icon: User },
    { number: 2, title: 'Plantilla', icon: Layout },
    { number: 3, title: 'Diseño', icon: Palette },
    { number: 4, title: 'Dominio', icon: LinkIcon }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const config = {
      domain: `${data.domain}.realmaker.ai`,
      template: data.template,
      colors: {
        primary: data.primaryColor,
        secondary: '#1f2937',
        accent: '#3b82f6'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter'
      },
      pages: {
        home: { enabled: true, order: 1 },
        properties: { enabled: true, order: 2 },
        about: { enabled: true, order: 3 },
        contact: { enabled: true, order: 4 }
      },
      seo: {
        title: `${data.siteName} - Tu hogar perfecto te espera`,
        description: data.siteDescription,
        keywords: ['inmobiliaria', 'propiedades', 'casas', 'pisos']
      }
    };
    onComplete(config);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.siteName.trim() !== '' && data.siteDescription.trim() !== '';
      case 2:
        return data.template !== '';
      case 3:
        return data.primaryColor !== '';
      case 4:
        return data.domain.trim() !== '';
      default:
        return false;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-5xl">
        {/* Header compacto */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute h-20 w-20 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="relative h-14 w-14 bg-gradient-to-br from-primary to-amber-500 rounded-2xl shadow-lg flex items-center justify-center">
              <Globe className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-1 text-2xl">Crea tu página web</h1>
          <p className="text-gray-500 text-sm">Paso {currentStep} de {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Steps Indicator compacto */}
          <div className="flex items-center justify-center gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all mb-2 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : isCompleted
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card compacto */}
        <Card className="border shadow-xl overflow-hidden">
          <div className="p-6">
            {/* Step 1: Información */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h2 className="text-gray-900 mb-1 text-xl">Información básica</h2>
                  <p className="text-gray-500 text-sm">Cuéntanos sobre tu agencia</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-sm font-medium">Nombre del sitio web</Label>
                    <Input
                      id="siteName"
                      value={data.siteName}
                      onChange={(e) => setData({ ...data, siteName: e.target.value })}
                      placeholder="Ej: Inmobiliaria Excellence"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription" className="text-sm font-medium">Descripción</Label>
                    <Textarea
                      id="siteDescription"
                      value={data.siteDescription}
                      onChange={(e) => setData({ ...data, siteDescription: e.target.value })}
                      placeholder="Describe tu agencia..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Preview compacto */}
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-primary" />
                      <p className="text-xs font-medium text-gray-700">Vista previa</p>
                    </div>
                    <h3 className="text-gray-900 mb-1">{data.siteName || 'Nombre del sitio'}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {data.siteDescription || 'Descripción...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Plantilla */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h2 className="text-gray-900 mb-1 text-xl">Elige una plantilla</h2>
                  <p className="text-gray-500 text-sm">Selecciona el estilo que prefieras</p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {templates.map((template) => {
                    const isSelected = data.template === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setData({ ...data, template: template.id })}
                        className={`group relative overflow-hidden rounded-xl transition-all ${
                          isSelected
                            ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                            : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="h-7 w-7 rounded-full bg-primary shadow-lg flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`p-3 bg-white border-t ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-gray-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900">{template.name}</p>
                            {isSelected && <Star className="h-4 w-4 text-primary fill-primary" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Diseño */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h2 className="text-gray-900 mb-1 text-xl">Personaliza el diseño</h2>
                  <p className="text-gray-500 text-sm">Elige el color de tu marca</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-5">
                  {/* Color Presets */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Colores predefinidos</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {colorPresets.map((color) => {
                        const isSelected = data.primaryColor === color.value;
                        return (
                          <button
                            key={color.value}
                            onClick={() => setData({ ...data, primaryColor: color.value })}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              isSelected
                                ? 'border-gray-900 bg-gray-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="relative flex-shrink-0">
                              <div
                                className="h-10 w-10 rounded-lg shadow-sm border-2 border-white"
                                style={{ backgroundColor: color.value }}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-white drop-shadow" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{color.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{color.value}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Color */}
                  <div className="space-y-2">
                    <Label htmlFor="customColor" className="text-sm font-medium">Color personalizado</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customColor"
                        type="text"
                        value={data.primaryColor}
                        onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                        placeholder="#e7af2a"
                        className="h-11 font-mono"
                      />
                      <input
                        type="color"
                        value={data.primaryColor}
                        onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                        className="h-11 w-11 rounded-lg cursor-pointer border"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="h-8 w-8 rounded-lg flex items-center justify-center shadow"
                        style={{ backgroundColor: data.primaryColor }}
                      >
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">Vista previa</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        style={{ backgroundColor: data.primaryColor }}
                        className="flex-1 h-10 text-white text-sm"
                      >
                        Botón primario
                      </Button>
                      <Button 
                        variant="outline"
                        style={{ borderColor: data.primaryColor, color: data.primaryColor }}
                        className="flex-1 h-10 text-sm"
                      >
                        Secundario
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Dominio */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h2 className="text-gray-900 mb-1 text-xl">Configura tu dominio</h2>
                  <p className="text-gray-500 text-sm">Define la URL de tu sitio</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-sm font-medium">Subdominio de RealMaker</Label>
                    <div className="relative">
                      <Input
                        id="domain"
                        value={data.domain}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                          setData({ ...data, domain: value });
                        }}
                        placeholder="mi-inmobiliaria"
                        className="h-11 pr-36 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                        .realmaker.ai
                      </span>
                    </div>
                  </div>

                  {/* URL Preview */}
                  <div className="bg-gradient-to-br from-primary/5 to-amber-500/5 rounded-xl p-4 border"
                       style={{ borderColor: data.primaryColor + '30' }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg border-2 border-white flex items-center justify-center shadow-md flex-shrink-0"
                        style={{ backgroundColor: data.primaryColor }}
                      >
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600 mb-0.5">Tu sitio web estará en:</p>
                        <p className="font-semibold text-gray-900 truncate">
                          https://{data.domain || 'tu-dominio'}.realmaker.ai
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agency Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Información que se mostrará:</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 truncate">{agencyData.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 truncate">{agencyData.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 truncate">{agencyData.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="h-10 px-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index + 1 === currentStep
                      ? 'w-8 bg-primary'
                      : index + 1 < currentStep
                      ? 'w-1.5 bg-primary'
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="h-10 px-4 gap-2"
              style={{ 
                backgroundColor: isStepValid() ? data.primaryColor : undefined,
                opacity: isStepValid() ? 1 : 0.5
              }}
            >
              {currentStep === totalSteps ? (
                <>
                  <Check className="h-4 w-4" />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

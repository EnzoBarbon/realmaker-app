import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Phone, Zap, Crown, Check, ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import Frame5980 from "../../imports/Frame5980";
import { WhatsAppIcon } from "../icons/whatsapp-icon";

interface PlansLandingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const allPlans = [
  {
    id: 'basic',
    name: 'Básico',
    type: 'phone',
    minutes: 500,
    price: 99,
    icon: Phone,
    color: 'blue',
    popular: false
  },
  {
    id: 'professional',
    name: 'Profesional',
    type: 'phone',
    minutes: 1000,
    price: 169,
    icon: Zap,
    color: 'primary',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    type: 'phone',
    minutes: 3000,
    price: 399,
    icon: Crown,
    color: 'purple',
    popular: false
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    type: 'whatsapp',
    minutes: null,
    price: 99,
    icon: WhatsAppIcon,
    color: 'green',
    popular: false
  }
];

export function PlansLandingPage({ onBack, onGetStarted }: PlansLandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="w-48">
              <Frame5980 />
            </div>
            <Button 
              variant="ghost"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Free Trial Banner */}
      <section className="py-6 px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-primary/30 bg-white shadow-lg">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Prueba gratis sin compromiso</h3>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span><strong>Teléfono:</strong> 100 minutos o 7 días</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <WhatsAppIcon className="h-4 w-4 text-green-600" />
                        <span><strong>WhatsApp:</strong> 7 días completos</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 flex-shrink-0"
                  onClick={onGetStarted}
                >
                  Empezar prueba gratis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Planes y Precios
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
            Elige el plan perfecto<br/>
            <span className="text-primary">para tu negocio</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sin permanencia, cancela cuando quieras. Todos los planes incluyen funcionalidades completas.
          </p>
        </div>
      </section>

      {/* Phone Plans Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Planes de Asistente Telefónico
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Gestiona todas tus llamadas automáticamente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {allPlans.filter(plan => plan.type === 'phone').map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative transition-all ${
                    isPopular 
                      ? 'border-2 border-primary shadow-lg' 
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white border-primary text-xs">
                        ⭐ Más Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      plan.color === 'primary' 
                        ? 'bg-primary/10 text-primary' 
                        : plan.color === 'blue'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-semibold text-gray-900">{plan.price}€</span>
                        <span className="text-gray-500">/mes</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {plan.minutes.toLocaleString()} minutos incluidos
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">Atención 24/7 automática</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">Calificación de leads</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">Agenda de visitas automática</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">Gestión de contactos</span>
                      </div>
                      {plan.id === 'professional' && (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">Integraciones CRM</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">Analítica avanzada</span>
                          </div>
                        </>
                      )}
                      {plan.id === 'premium' && (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">Todo del Profesional</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">IA personalizada</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">Soporte dedicado 24/7</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={onGetStarted}
                    >
                      Contratar plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* WhatsApp Plan Section */}
          <div className="border-t border-gray-100 pt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                Plan de Asistente WhatsApp
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Responde mensajes automáticamente, siempre
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {allPlans.filter(plan => plan.type === 'whatsapp').map((plan) => {
                const Icon = plan.icon;
                
                return (
                  <Card 
                    key={plan.id}
                    className="border-2 border-green-200 hover:border-green-300 transition-all"
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-green-50 text-green-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-semibold text-gray-900">{plan.price}€</span>
                          <span className="text-gray-500">/mes</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Mensajes ilimitados
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Respuestas instantáneas 24/7</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Envío automático de propiedades</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Coordinación de visitas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Gestión de contactos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Seguimiento proactivo</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={onGetStarted}
                      >
                        Contratar plan
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Cómo funciona la prueba gratis?</h3>
              <p className="text-sm text-gray-600">
                Teléfono: 100 minutos o 7 días (lo que termine primero). WhatsApp: 7 días completos sin límites. Sin tarjeta de crédito requerida.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Puedo cambiar de plan después?</h3>
              <p className="text-sm text-gray-600">
                Sí, puedes cambiar a un plan superior o inferior en cualquier momento desde tu cuenta.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Qué pasa si me quedo sin minutos?</h3>
              <p className="text-sm text-gray-600">
                Puedes cambiar a un plan superior o comprar paquetes adicionales de minutos según tus necesidades.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Puedo usar ambos asistentes?</h3>
              <p className="text-sm text-gray-600">
                Sí, puedes combinar un plan de teléfono con el plan de WhatsApp para atención completa en todos los canales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <CardContent className="py-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                ¿Tienes dudas?
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestro equipo está aquí para ayudarte a elegir el mejor plan para tu negocio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={onGetStarted}
                >
                  Comenzar ahora
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  Contactar con ventas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-40">
              <Frame5980 />
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button className="hover:text-primary transition-colors" onClick={onBack}>
                Inicio
              </button>
              <button className="hover:text-primary transition-colors">
                Contacto
              </button>
              <button className="hover:text-primary transition-colors">
                Ayuda
              </button>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-6">
            © 2025 RealMaker AI. By Betterplace. Asistentes de IA para agentes inmobiliarios.
          </div>
        </div>
      </footer>
    </div>
  );
}

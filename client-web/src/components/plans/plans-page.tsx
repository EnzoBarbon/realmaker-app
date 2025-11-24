import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Phone, Zap, Crown, ArrowRight, MessageSquare } from "lucide-react";

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
    icon: MessageSquare,
    color: 'green',
    popular: false
  }
];

export function PlansPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          Planes y Precios
        </Badge>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Elige el plan perfecto para tu negocio
        </h1>
        <p className="text-gray-600">
          Planes de teléfono y WhatsApp. Sin permanencia ni costes ocultos.
        </p>
      </div>

      {/* Current Plan Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Plan Actual: Básico</p>
                <p className="text-sm text-gray-600">328 de 500 minutos restantes</p>
              </div>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Cambiar plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
        {allPlans.map((plan) => {
          const Icon = plan.icon;
          const isPopular = plan.popular;
          const isWhatsApp = plan.type === 'whatsapp';
          
          return (
            <Card 
              key={plan.id}
              className={`relative transition-all ${
                isPopular 
                  ? 'border-primary shadow-lg' 
                  : isWhatsApp
                  ? 'border-green-200 hover:border-green-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white border-primary text-xs">
                    ⭐ Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-3">
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  plan.color === 'primary' 
                    ? 'bg-primary/10 text-primary' 
                    : plan.color === 'blue'
                    ? 'bg-blue-50 text-blue-600'
                    : plan.color === 'purple'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-green-50 text-green-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-3">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-semibold text-gray-900">{plan.price}€</span>
                    <span className="text-sm text-gray-500">/mes</span>
                  </div>
                  {plan.minutes ? (
                    <p className="text-xs text-gray-600 mt-2">
                      {plan.minutes.toLocaleString()} min incluidos
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 mt-2">
                      Mensajes ilimitados
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full ${
                    isPopular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : isWhatsApp
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {isPopular ? 'Comenzar' : 'Seleccionar'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 pt-12 border-t border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Preguntas frecuentes
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">¿Qué pasa si me quedo sin minutos?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Puedes cambiar a un plan superior en cualquier momento o comprar paquetes adicionales de minutos según tus necesidades.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">¿Puedo cancelar cuando quiera?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sí, sin permanencia. Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">¿Los minutos se acumulan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                No, los minutos se renuevan cada mes. Te recomendamos elegir el plan que mejor se ajuste a tu uso mensual promedio.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">¿El asistente WhatsApp consume minutos?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                No, solo las llamadas telefónicas consumen minutos. El asistente de WhatsApp está incluido sin límite de mensajes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent mt-12">
        <CardContent className="py-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            ¿Necesitas un plan personalizado?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Si tu negocio necesita más de 3,000 minutos al mes o funcionalidades específicas, 
            contacta con nuestro equipo para crear un plan a medida.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Contactar con ventas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
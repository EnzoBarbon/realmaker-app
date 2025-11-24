import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Phone, AlertCircle, Check, ArrowRight, X, Smartphone, Download } from "lucide-react";
import Frame5980 from "../../imports/Frame5980";
import { WhatsAppIcon } from "../icons/whatsapp-icon";

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPlans: () => void;
}

const problems = [
  {
    title: "Llamadas Perdidas",
    description: "Reciben muchas llamadas y no tienen tiempo de atenderlas todas",
    icon: Phone
  },
  {
    title: "WhatsApps Sin Respuesta",
    description: "No contestan mensajes y pierden clientes potenciales",
    icon: WhatsAppIcon
  },
  {
    title: "Información Perdida",
    description: "No agendan contactos y pierden información valiosa de leads",
    icon: AlertCircle
  },
  {
    title: "Oportunidades Perdidas",
    description: "Mala experiencia al no devolver llamadas, perdiendo ventas",
    icon: X
  }
];

export function LandingPage({ onGetStarted, onViewPlans }: LandingPageProps) {
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
              onClick={onViewPlans}
            >
              Ver Planes
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
            Asistentes de IA para<br/>
            <span className="text-primary">Agentes Inmobiliarios</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nunca pierdas una oportunidad. Atiende todas tus llamadas y mensajes automáticamente.
          </p>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-8 px-6 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            ¿Te suena familiar?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{problem.title}</h3>
                    <p className="text-sm text-gray-600">{problem.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assistants Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              La solución: Dos asistentes de IA
            </h2>
            <p className="text-gray-600">
              Elige teléfono, WhatsApp, o ambos. Trabajan 24/7 para ti.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Phone Assistant Card */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Phone className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Asistente Telefónico</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Responde llamadas automáticamente y programa citas.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Atiende todas las llamadas 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Califica leads automáticamente</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Agenda visitas en tu calendario</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Voz natural y profesional</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Prueba gratis</p>
                    <p className="text-xs text-blue-700">100 minutos · 1 semana · Sin tarjeta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Assistant Card */}
            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                  <WhatsAppIcon className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Asistente WhatsApp</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Gestiona conversaciones y envía información al instante.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Respuestas instantáneas 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Envía info de propiedades automáticamente</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Coordina visitas por chat</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Mensajes ilimitados</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Prueba gratis</p>
                    <p className="text-xs text-green-700">1 semana completa · Sin tarjeta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-10 mb-4"
              onClick={onGetStarted}
            >
              Comenzar prueba gratis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-xs text-gray-500">
              Sin tarjeta de crédito · Sin permanencia · Cancelación inmediata
            </p>
          </div>
        </div>
      </section>

      {/* Android App Download Section */}
      <section className="py-12 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Descarga la app para Android
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-0">
                    Gestiona tus asistentes de IA desde cualquier lugar. Disponible ahora para dispositivos Android.
                  </p>
                </div>
                
                {/* Download Button */}
                <div className="flex-shrink-0">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      // Aquí iría la lógica de descarga del APK
                      window.open('#', '_blank');
                    }}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar APK
                  </Button>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Última versión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Android 8.0+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-40">
              <Frame5980 />
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button className="hover:text-primary transition-colors" onClick={onViewPlans}>
                Planes
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
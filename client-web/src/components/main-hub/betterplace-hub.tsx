import { useState } from "react";
import { ArrowRight, Clock, Star, TrendingUp, Users, Zap, CheckCircle2, Quote, Check, Sparkles, Facebook, Linkedin, Instagram, Contact, X, Smartphone, Download, Calendar } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Switch } from "../ui/switch";
import RealMakerLogo from "../../imports/RealMakerLogo";
import RealMakerLogoWhite from "../../imports/RealMakerLogoWhite";
import aiLogoMobile from 'figma:asset/97131dc4f6e5ece4b4c8c547a7a9d021c634b308.png';

interface BetterplaceHubProps {
  onEnterAI: (tab: 'login' | 'register') => void;
}

const testimonials = [
  {
    name: "Carmen Sánchez",
    role: "Agente Inmobiliaria",
    company: "RE/MAX Madrid",
    image: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMjg0ODUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    quote: "Antes pasaba la mitad del día contestando '¿tiene garaje?' o '¿admite mascotas?'. Ahora RealMaker cualifica todo automáticamente y solo me llegan los leads realmente interesados. Mi tasa de conversión se ha disparado."
  },
  {
    name: "David Martínez",
    role: "Director Comercial",
    company: "Engel & Völkers Barcelona",
    image: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHN1aXR8ZW58MXx8fHwxNzYzMjg5NDA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    quote: "Los mejores leads llegaban a las 22h o los domingos y los perdíamos. Con RealMaker AI atendemos 24/7 en WhatsApp, Instagram y Messenger. Hemos capturado un 38% más de leads solo por estar disponibles siempre."
  },
  {
    name: "Laura Fernández",
    role: "Broker Independiente",
    company: "Inmobiliaria Costa del Sol",
    image: "https://images.unsplash.com/photo-1758518729459-235dcaadc611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc3dvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYzMjIxODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    quote: "Antes tenía mensajes desperdigados entre WhatsApp, Instagram, Messenger y TikTok. Ahora todo está en un solo lugar, cualificado y priorizado. He triplicado mis leads sin gastar más en publicidad."
  }
];

const stats = [
  { value: "15h", label: "ahorradas semanalmente", icon: Clock },
  { value: "3x", label: "más leads cualificados", icon: TrendingUp },
  { value: "24/7", label: "disponibilidad automática", icon: Zap },
  { value: "4", label: "canales integrados", icon: Users }
];

const plans = [
  {
    name: "Starter",
    price: "99",
    period: "mes",
    description: "Perfecto para agentes individuales",
    features: [
      "1 usuario incluido",
      "Mensajes ilimitados",
      "Todos los canales (WhatsApp, Instagram, Messenger, TikTok)",
      "Catálogo de propiedades"
    ],
    highlighted: false
  },
  {
    name: "Professional",
    price: "125",
    period: "mes",
    description: "Para agentes que quieren más",
    features: [
      "1 usuario incluido",
      "Mensajes ilimitados",
      "Todos los canales (WhatsApp, Instagram, Messenger, TikTok)",
      "Catálogo de propiedades",
      "Sistema de alertas avanzado"
    ],
    highlighted: true,
    badge: "Recomendado"
  },
  {
    name: "Premium",
    price: "149",
    period: "mes",
    description: "Para agentes de alto nivel",
    features: [
      "1 usuario incluido",
      "Mensajes ilimitados",
      "Todos los canales (WhatsApp, Instagram, Messenger, TikTok)",
      "Catálogo de propiedades",
      "Sistema de alertas avanzado",
      "Web Inmobiliaria"
    ],
    highlighted: false,
    comingSoon: true
  }
];

const features = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp Business",
    description: "Cualifica leads automáticamente y envía información de propiedades al instante",
    color: "text-[#25D366]",
    bgColor: "bg-[#25D366]/10"
  },
  {
    icon: InstagramIcon,
    title: "Instagram Direct",
    description: "Atiende DMs automáticamente y convierte seguidores en clientes potenciales",
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10"
  },
  {
    icon: MessengerIcon,
    title: "Facebook Messenger",
    description: "Gestiona mensajes de tu página de Facebook sin esfuerzo manual",
    color: "text-[#0084FF]",
    bgColor: "bg-[#0084FF]/10"
  },
  {
    icon: TikTokIcon,
    title: "TikTok Messages",
    description: "Conecta con la audiencia más joven y cualifica leads desde TikTok",
    color: "text-black",
    bgColor: "bg-gray-100"
  }
];

export function BetterplaceHub({ onEnterAI }: BetterplaceHubProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header fijo minimalista */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Responsive */}
            <div>
              {/* Logo desktop - Completo */}
              <div className="hidden sm:block w-48">
                <RealMakerLogo />
              </div>
            </div>

            {/* Botones de autenticación */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botones de autenticación */}
              <Button
                variant="ghost"
                onClick={() => onEnterAI('login')}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 px-3 sm:px-4"
              >
                <span className="text-sm sm:text-base">Iniciar sesión</span>
              </Button>
              <Button
                onClick={() => onEnterAI('register')}
                className="shadow-sm hover:shadow-md transition-all px-3 sm:px-4"
              >
                <span className="text-sm sm:text-base">Prueba gratis</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Espaciado para header fijo */}
      <div className="h-16 sm:h-20"></div>

      {/* Hero Section - MEJORADO Y MÁS ATRACTIVO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary/5">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Círculos decorativos con gradientes */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-primary/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          {/* Patrón de puntos */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Contenido */}
            <div className="text-center lg:text-left">
              {/* Logo móvil - Solo visible en móvil */}
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-48">
                  <RealMakerLogo />
                </div>
              </div>

              {/* Botón APK Android - Solo móvil - Debajo del logo */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('#', '_blank');
                }}
                className="lg:hidden inline-flex items-center gap-2.5 px-5 py-3 bg-black hover:bg-gray-900 text-white rounded-lg transition-all hover:scale-105 shadow-md mb-6"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52M7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5"/>
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] opacity-90 leading-tight">Descargar en</span>
                  <span className="text-sm leading-tight">Android APK</span>
                </div>
              </a>

              {/* Badge superior con animación */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-8 border border-primary/20 shadow-sm hover:shadow-md transition-all">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-gray-700">Asistentes de IA para agentes inmobiliarios</span>
              </div>

              {/* Subtítulo mejorado */}
              <p className="text-gray-600 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Asistentes de IA que atienden <strong className="text-gray-900">WhatsApp, Instagram, Messenger y TikTok</strong> las 24 horas del día. Cualifica los leads de tu inmobiliaria automáticamente.
              </p>

              {/* Iconos de canales con animación hover */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <WhatsAppIcon className="w-8 h-8 text-[#25D366] transform group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="relative">
                      <InstagramIcon className="w-8 h-8 text-[#E4405F] transform group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="relative">
                      <MessengerIcon className="w-8 h-8 text-[#0084FF] transform group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="relative">
                      <TikTokIcon className="w-8 h-8 text-black transform group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200"></div>
                  <span className="text-sm font-medium text-gray-700">4 canales</span>
                </div>
              </div>

              {/* CTAs principales */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <Button
                  onClick={() => onEnterAI('register')}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Empezar prueba gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    window.open('https://calendly.com/realmaker-ai', '_blank');
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-6 text-lg border-2 flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Agendar demo
                </Button>
              </div>

              {/* Texto confianza con iconos */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Sin tarjeta</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>7 días gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Cancela cuando quieras</span>
                </div>
              </div>
            </div>

            {/* Columna derecha - Visual/Mockup */}
            <div className="relative hidden lg:block">
              {/* Contenedor con efecto de profundidad */}
              <div className="relative">
                {/* Card flotante principal - Simulación de dashboard */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform">
                  {/* Header del card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Conversaciones hoy</div>
                        <div className="text-2xl text-gray-900">47 leads</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-700">Online</span>
                    </div>
                  </div>

                  {/* Simulación de gráfico */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">WhatsApp</span>
                          <span className="text-sm text-gray-900">24</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#25D366] rounded-full" style={{width: '80%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <InstagramIcon className="w-6 h-6 text-[#E4405F]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Instagram</span>
                          <span className="text-sm text-gray-900">15</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#E4405F] rounded-full" style={{width: '50%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessengerIcon className="w-6 h-6 text-[#0084FF]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Messenger</span>
                          <span className="text-sm text-gray-900">8</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0084FF] rounded-full" style={{width: '30%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas rápidas */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl text-gray-900 mb-1">92%</div>
                      <div className="text-xs text-gray-500">Cualificados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-gray-900 mb-1">24/7</div>
                      <div className="text-xs text-gray-500">Disponible</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-gray-900 mb-1">3.2s</div>
                      <div className="text-xs text-gray-500">Resp. media</div>
                    </div>
                  </div>
                </div>

                {/* Cards flotantes secundarios */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 w-48 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Nuevo lead VIP</div>
                      <div className="text-sm text-gray-900">María García</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 w-56 animate-bounce-slow" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-900">+156% conversiones</span>
                  </div>
                  <div className="text-xs text-gray-500">vs mes anterior</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - REDISEÑADO */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - REDISEÑADO */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Integración multicanal</span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Un asistente para cada canal
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conecta con tus clientes donde están. Cada canal optimizado para conversión.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300"></div>
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - REDISEÑADO */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">7 días gratis • Sin tarjeta</span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Precios transparentes
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Escoge el plan perfecto para tu inmobiliaria. Cambia o cancela cuando quieras.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlighted 
                    ? 'border-2 border-primary shadow-2xl lg:scale-105' 
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-amber-500 text-white text-sm px-5 py-2 rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Próximamente
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="text-gray-500 mb-2">{plan.name}</div>
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-5xl text-gray-900">{plan.price}€</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onEnterAI('register')}
                  className={`w-full py-6 ${
                    plan.highlighted 
                      ? 'bg-primary hover:bg-primary/90 shadow-lg' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.comingSoon ? 'Próximamente disponible' : 'Empezar gratis'}
                </Button>
              </div>
            ))}

            {/* Addon - Usuario extra */}
            <div className="mt-12 lg:col-span-3">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-dashed border-gray-300 hover:border-primary/40 transition-all">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Contenido izquierdo */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-3">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs text-primary">Addon disponible</span>
                    </div>
                    <h3 className="text-gray-900 mb-2">Usuario extra</h3>
                    <p className="text-sm text-gray-600">
                      Añade usuarios adicionales a cualquier plan
                    </p>
                  </div>

                  {/* Separador vertical - Solo desktop */}
                  <div className="hidden sm:block w-px h-16 bg-gray-300"></div>

                  {/* Precio derecho */}
                  <div className="flex-shrink-0 text-center sm:min-w-[200px]">
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-5xl text-gray-900">49€</span>
                      <span className="text-gray-500 text-lg">/mes</span>
                    </div>
                    <p className="text-xs text-gray-500">por usuario adicional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - REDISEÑADO */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm text-primary">Lo que dicen nuestros clientes</span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Historias de éxito
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Agentes inmobiliarios que transformaron su negocio con RealMaker AI
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Quote decorativo */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center opacity-50">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
                
                {/* Estrellas */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Android App Download Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-gray-100" id="android-app-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-gray-900 mb-3">
              Lleva RealMaker AI contigo
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Gestiona tus conversaciones y atiende consultas desde cualquier lugar
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            {/* Android Badge Button - Estilo estándar */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Aquí iría la lógica de descarga del APK
                window.open('#', '_blank');
              }}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-black hover:bg-gray-900 text-white rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52M7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-90">Descargar en</span>
                <span className="text-lg leading-tight">Android APK</span>
              </div>
            </a>

            {/* Info badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Compatible Android</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Última versión</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - REDISEÑADO */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-200">
            <h2 className="text-gray-900 mb-4">
              Empieza hoy mismo
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Únete a cientos de agentes que ya están ahorrando tiempo y cerrando más ventas
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                onClick={() => onEnterAI('register')}
                size="lg"
                className="w-full sm:w-auto px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group"
              >
                Prueba gratis ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => {
                  window.open('https://calendly.com/realmaker-ai', '_blank');
                }}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-10 py-6 text-lg border-2 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Agendar demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Sin tarjeta</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Configura en 5 minutos</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Cancela cuando quieras</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - REDISEÑADO */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Columna 1: Redes Sociales */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex gap-4 mb-6">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Columna 2: Links Legales */}
            <div className="flex flex-col items-center space-y-3">
              <a href="#" className="text-white hover:text-primary transition-colors text-sm">
                Blog
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors text-sm">
                Contacto
              </a>
              <a 
                href="#" 
                className="text-white hover:text-primary transition-colors text-sm flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Aquí iría la lógica de descarga del APK
                  window.open('#', '_blank');
                }}
              >
                <Download className="w-4 h-4" />
                Descargar APK
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors text-sm">
                Política de Cookies
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors text-sm">
                Aviso Legal
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors text-sm">
                Política de privacidad
              </a>
            </div>

            {/* Columna 3: Logos de pago */}
            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-2 mb-6">
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 48 32" className="w-8 h-5">
                    <circle cx="19" cy="16" r="11" fill="#EB001B"/>
                    <circle cx="29" cy="16" r="11" fill="#F79E1B"/>
                    <path d="M24 8c1.9 1.7 3 4.2 3 7s-1.1 5.3-3 7c-1.9-1.7-3-4.2-3-7s1.1-5.3 3-7z" fill="#FF5F00"/>
                  </svg>
                </div>
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 48 32" className="w-8 h-5">
                    <rect width="48" height="32" fill="#00579F" rx="4"/>
                    <path d="M20 18h8v2h-8z" fill="#FAA61A"/>
                  </svg>
                </div>
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center shadow-sm px-1">
                  <span className="text-[#0072CE] text-[10px]">CaixaBank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col items-center">
            <div className="w-40 mb-4 opacity-90 hover:opacity-100 transition-opacity">
              <RealMakerLogoWhite />
            </div>
            <p className="text-gray-300 text-sm text-center">
              © 2025 RealMaker AI by Betterplace
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Asistentes de IA para agentes inmobiliarios
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
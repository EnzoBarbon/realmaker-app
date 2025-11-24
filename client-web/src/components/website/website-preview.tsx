import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Bed, 
  Bath, 
  Maximize, 
  Star,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  Quote,
  Search,
  Home,
  DollarSign
} from 'lucide-react';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface WebsitePreviewProps {
  config: any;
  agencyData: any;
  viewportSize: ViewportSize;
}

export function WebsitePreview({ config, agencyData, viewportSize }: WebsitePreviewProps) {
  const viewportStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px]',
    mobile: 'w-[375px] h-[667px]'
  };

  const scaleClass = viewportSize !== 'desktop' ? 'origin-top' : '';

  // Propiedades de ejemplo más realistas
  const featuredProperties = [
    {
      id: 1,
      title: 'Ático de lujo con vistas panorámicas',
      location: 'Salamanca, Madrid',
      price: 895000,
      bedrooms: 4,
      bathrooms: 3,
      area: 185,
      image: 'https://images.unsplash.com/photo-1568115286680-d203e08a8be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3NjMxMTg0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true
    },
    {
      id: 2,
      title: 'Apartamento moderno en el centro',
      location: 'Chamberí, Madrid',
      price: 525000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image: 'https://images.unsplash.com/photo-1701789668339-140f67db12df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZ3xlbnwxfHx8fDE3NjMxMTg0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      featured: false
    },
    {
      id: 3,
      title: 'Villa independiente con piscina',
      location: 'Pozuelo de Alarcón, Madrid',
      price: 1250000,
      bedrooms: 5,
      bathrooms: 4,
      area: 320,
      image: 'https://images.unsplash.com/photo-1611018399688-7a9bd5b67ca1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwdmlsbGElMjBwb29sfGVufDF8fHx8MTc2MzExODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true
    },
    {
      id: 4,
      title: 'Casa adosada con jardín privado',
      location: 'Las Rozas, Madrid',
      price: 675000,
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      image: 'https://images.unsplash.com/photo-1706808849827-7366c098b317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzAyMTc4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      featured: false
    }
  ];

  const stats = [
    { icon: Building2, value: '500+', label: 'Propiedades' },
    { icon: Users, value: '1,200+', label: 'Clientes felices' },
    { icon: Award, value: '15+', label: 'Años de experiencia' },
    { icon: TrendingUp, value: '98%', label: 'Tasa de éxito' }
  ];

  const features = [
    {
      icon: CheckCircle2,
      title: 'Asesoramiento personalizado',
      description: 'Expertos dedicados a encontrar tu propiedad ideal'
    },
    {
      icon: Award,
      title: 'Garantía de calidad',
      description: 'Todas nuestras propiedades verificadas y certificadas'
    },
    {
      icon: TrendingUp,
      title: 'Mejores precios',
      description: 'Negociamos el mejor precio del mercado para ti'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Compradora',
      content: 'Increíble experiencia. Me ayudaron a encontrar el apartamento perfecto en menos de un mes. Profesionales, atentos y muy eficientes.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1652878530627-cc6f063e3947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsJTIwZXN0YXRlJTIwYWdlbnR8ZW58MXx8fHwxNzYzMTA5OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      name: 'Carlos Ruiz',
      role: 'Inversor',
      content: 'Llevo años trabajando con ellos y siempre me ofrecen las mejores oportunidades de inversión. Totalmente recomendable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1652878530627-cc6f063e3947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsJTIwZXN0YXRlJTIwYWdlbnR8ZW58MXx8fHwxNzYzMTA5OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div className={`${viewportStyles[viewportSize]} bg-white rounded-lg shadow-2xl overflow-hidden ${scaleClass}`}>
      <div className="h-full overflow-y-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* Header/Navbar - Mejorado */}
        <nav 
          className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b"
          style={{ 
            borderColor: config.colors.primary + '15'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={agencyData.logo} 
                alt={agencyData.name}
                className="h-12 w-12 rounded-xl object-cover shadow-sm"
              />
              <span 
                className="text-xl tracking-tight"
                style={{ 
                  color: config.colors.secondary,
                  fontFamily: 'Manrope, Inter, sans-serif',
                  fontWeight: 800
                }}
              >
                {agencyData.name}
              </span>
            </div>
            
            {viewportSize === 'desktop' && (
              <div className="flex items-center gap-8">
                {Object.entries(config.pages)
                  .filter(([, page]: [string, any]) => page.enabled)
                  .sort((a, b) => a[1].order - b[1].order)
                  .map(([pageId]) => (
                    <a
                      key={pageId}
                      href="#"
                      className="text-sm tracking-wide hover:opacity-70 transition-all relative group"
                      style={{ 
                        color: config.colors.secondary,
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {pageId === 'home' && 'Inicio'}
                      {pageId === 'properties' && 'Propiedades'}
                      {pageId === 'about' && 'Sobre nosotros'}
                      {pageId === 'contact' && 'Contacto'}
                      <span 
                        className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                        style={{ backgroundColor: config.colors.primary }}
                      />
                    </a>
                  ))
                }
              </div>
            )}
            
            <button 
              className="px-6 py-2.5 rounded-lg text-white text-sm tracking-wide transition-all hover:shadow-lg hover:scale-105"
              style={{ 
                backgroundColor: config.colors.primary,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Contactar
            </button>
          </div>
        </nav>

        {/* Hero Section - Mucho más elegante */}
        <section 
          className="relative h-[600px] flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(https://images.unsplash.com/photo-1723623145591-ed2931459188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwcm9wZXJ0eSUyMGhlcm98ZW58MXx8fHwxNjMxMTg0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          <div className="text-center max-w-4xl px-6 relative z-10">
            <h1 
              className="text-5xl md:text-6xl mb-6 tracking-tight leading-tight"
              style={{ 
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 800
              }}
            >
              Encuentra tu hogar perfecto
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 opacity-95 max-w-2xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}
            >
              {agencyData.description || 'Tu socio de confianza en el mundo inmobiliario'}
            </p>
            
            {/* Buscador de propiedades */}
            <div className="max-w-5xl mx-auto mb-8">
              <div 
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Campo de ubicación */}
                  <div className="md:col-span-1">
                    <label 
                      className="block text-xs mb-2 text-left"
                      style={{ 
                        color: config.colors.secondary,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Ubicación
                    </label>
                    <div className="relative">
                      <MapPin 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                      />
                      <input
                        type="text"
                        placeholder="Madrid, Barcelona..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-opacity-50 transition-all text-gray-900 placeholder:text-gray-400"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          borderColor: config.colors.primary + '00',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = config.colors.primary + '80'}
                        onBlur={(e) => e.target.style.borderColor = config.colors.primary + '00'}
                      />
                    </div>
                  </div>

                  {/* Tipo de operación */}
                  <div className="md:col-span-1">
                    <label 
                      className="block text-xs mb-2 text-left"
                      style={{ 
                        color: config.colors.secondary,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Tipo
                    </label>
                    <div className="relative">
                      <Home 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                      />
                      <select
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 appearance-none transition-all text-gray-900"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          borderColor: config.colors.primary + '00',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = config.colors.primary + '80'}
                        onBlur={(e) => e.target.style.borderColor = config.colors.primary + '00'}
                      >
                        <option>Comprar</option>
                        <option>Alquilar</option>
                      </select>
                    </div>
                  </div>

                  {/* Rango de precio */}
                  <div className="md:col-span-1">
                    <label 
                      className="block text-xs mb-2 text-left"
                      style={{ 
                        color: config.colors.secondary,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Precio máximo
                    </label>
                    <div className="relative">
                      <DollarSign 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                      />
                      <select
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 appearance-none transition-all text-gray-900"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          borderColor: config.colors.primary + '00',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = config.colors.primary + '80'}
                        onBlur={(e) => e.target.style.borderColor = config.colors.primary + '00'}
                      >
                        <option>300.000€</option>
                        <option>500.000€</option>
                        <option>750.000€</option>
                        <option>1.000.000€</option>
                        <option>1.500.000€+</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón de búsqueda */}
                  <div className="md:col-span-1 flex items-end">
                    <button
                      className="w-full py-3 rounded-xl text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: config.colors.primary,
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <Search className="h-5 w-5" />
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                className="px-8 py-4 rounded-xl text-white shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
                style={{ 
                  backgroundColor: config.colors.primary,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Ver propiedades
              </button>
              <button
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white transition-all hover:bg-white/20"
                style={{ 
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Contactar ahora
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: config.colors.primary + '15' }}
                  >
                    <stat.icon className="h-8 w-8" style={{ color: config.colors.primary }} />
                  </div>
                  <div 
                    className="text-4xl mb-2"
                    style={{ 
                      color: config.colors.secondary,
                      fontFamily: 'Manrope, Inter, sans-serif',
                      fontWeight: 800
                    }}
                  >
                    {stat.value}
                  </div>
                  <p 
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Propiedades Destacadas - Mejoradas */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl md:text-5xl mb-4 tracking-tight"
              style={{ 
                color: config.colors.secondary,
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 800
              }}
            >
              Propiedades destacadas
            </h2>
            <p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Descubre nuestra exclusiva selección de propiedades premium en las mejores ubicaciones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                className="group rounded-2xl overflow-hidden bg-white border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                style={{ borderColor: config.colors.primary + '15' }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {property.featured && (
                    <div 
                      className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm shadow-lg"
                      style={{ 
                        backgroundColor: config.colors.primary,
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Destacada
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {property.location}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    className="text-xl mb-4 group-hover:opacity-70 transition-opacity"
                    style={{ 
                      color: config.colors.secondary,
                      fontFamily: 'Manrope, Inter, sans-serif',
                      fontWeight: 700
                    }}
                  >
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center gap-6 mb-5 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="h-5 w-5" />
                      <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bath className="h-5 w-5" />
                      <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Maximize className="h-5 w-5" />
                      <span className="text-sm">{property.area} m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Precio
                      </p>
                      <span 
                        className="text-3xl tracking-tight"
                        style={{ 
                          color: config.colors.primary,
                          fontFamily: 'Manrope, Inter, sans-serif',
                          fontWeight: 800
                        }}
                      >
                        {property.price.toLocaleString('es-ES')}€
                      </span>
                    </div>
                    <button 
                      className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: config.colors.primary }}
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="px-8 py-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-105"
              style={{ 
                borderColor: config.colors.primary,
                color: config.colors.primary,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Ver todas las propiedades
            </button>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section 
          className="py-20"
          style={{ backgroundColor: config.colors.primary + '05' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl mb-4 tracking-tight"
                style={{ 
                  color: config.colors.secondary,
                  fontFamily: 'Manrope, Inter, sans-serif',
                  fontWeight: 800
                }}
              >
                ¿Por qué elegirnos?
              </h2>
              <p 
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Nos diferenciamos por nuestro compromiso y excelencia en el servicio
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div 
                    className="h-16 w-16 rounded-2xl mb-6 flex items-center justify-center"
                    style={{ backgroundColor: config.colors.primary + '15' }}
                  >
                    <feature.icon className="h-8 w-8" style={{ color: config.colors.primary }} />
                  </div>
                  <h3 
                    className="text-xl mb-3"
                    style={{ 
                      color: config.colors.secondary,
                      fontFamily: 'Manrope, Inter, sans-serif',
                      fontWeight: 700
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-gray-600 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-4 tracking-tight"
              style={{ 
                color: config.colors.secondary,
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 800
              }}
            >
              Lo que dicen nuestros clientes
            </h2>
            <p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              La satisfacción de nuestros clientes es nuestra mejor carta de presentación
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg border-2 relative"
                style={{ borderColor: config.colors.primary + '15' }}
              >
                <Quote 
                  className="h-12 w-12 absolute top-6 right-6 opacity-10"
                  style={{ color: config.colors.primary }}
                />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 fill-current" 
                      style={{ color: config.colors.primary }}
                    />
                  ))}
                </div>
                <p 
                  className="text-gray-700 mb-6 leading-relaxed text-lg"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-14 w-14 rounded-full bg-gradient-to-br overflow-hidden"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`
                    }}
                  >
                    <div className="h-full w-full flex items-center justify-center text-white text-xl"
                      style={{ fontFamily: 'Manrope, Inter, sans-serif', fontWeight: 700 }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p 
                      className="font-semibold"
                      style={{ 
                        color: config.colors.secondary,
                        fontFamily: 'Manrope, Inter, sans-serif'
                      }}
                    >
                      {testimonial.name}
                    </p>
                    <p 
                      className="text-sm text-gray-500"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sobre Nosotros Preview */}
        {config.pages.about?.enabled && (
          <section 
            className="py-20"
            style={{ backgroundColor: config.colors.primary + '08' }}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                    alt="Oficina"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 
                    className="text-4xl md:text-5xl mb-6 tracking-tight"
                    style={{ 
                      color: config.colors.secondary,
                      fontFamily: 'Manrope, Inter, sans-serif',
                      fontWeight: 800
                    }}
                  >
                    Sobre nosotros
                  </h2>
                  <p 
                    className="text-gray-700 mb-6 text-lg leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {agencyData.description || 'Somos una agencia inmobiliaria con años de experiencia en el sector, dedicados a ayudar a nuestros clientes a encontrar la propiedad perfecta.'}
                  </p>
                  <p 
                    className="text-gray-600 mb-8 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Nuestro equipo de profesionales está comprometido en ofrecer un servicio personalizado y de calidad, acompañándote en cada paso del proceso de compra o venta.
                  </p>
                  <button
                    className="px-8 py-4 rounded-xl border-2 transition-all hover:shadow-lg"
                    style={{ 
                      borderColor: config.colors.primary,
                      color: config.colors.primary,
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Conocer más sobre nosotros
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section 
          className="relative py-24 text-white overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(135deg, ' + config.colors.primary + ', ' + config.colors.secondary + ')'
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 
              className="text-4xl md:text-5xl mb-6 tracking-tight"
              style={{ 
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 800
              }}
            >
              ¿Listo para encontrar tu hogar ideal?
            </h2>
            <p 
              className="text-xl mb-8 opacity-95"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Contáctanos hoy y déjanos ayudarte a hacer realidad tus sueños
            </p>
            <button
              className="px-10 py-4 rounded-xl bg-white shadow-2xl transition-all hover:shadow-3xl hover:scale-105"
              style={{ 
                color: config.colors.primary,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Hablar con un experto
            </button>
          </div>
        </section>

        {/* Contacto Preview */}
        {config.pages.contact?.enabled && (
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl mb-4 tracking-tight"
                style={{ 
                  color: config.colors.secondary,
                  fontFamily: 'Manrope, Inter, sans-serif',
                  fontWeight: 800
                }}
              >
                Contacta con nosotros
              </h2>
              <p 
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Estamos aquí para ayudarte en cada paso del camino
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-white shadow-lg border-2" 
                style={{ borderColor: config.colors.primary + '15' }}
              >
                <div 
                  className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: config.colors.primary + '15' }}
                >
                  <Phone className="h-8 w-8" style={{ color: config.colors.primary }} />
                </div>
                <h3 
                  className="text-xl mb-3"
                  style={{ 
                    color: config.colors.secondary,
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  Teléfono
                </h3>
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {agencyData.phone}
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-white shadow-lg border-2" 
                style={{ borderColor: config.colors.primary + '15' }}
              >
                <div 
                  className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: config.colors.primary + '15' }}
                >
                  <Mail className="h-8 w-8" style={{ color: config.colors.primary }} />
                </div>
                <h3 
                  className="text-xl mb-3"
                  style={{ 
                    color: config.colors.secondary,
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  Email
                </h3>
                <p className="text-gray-600 text-lg break-all" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {agencyData.email}
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-white shadow-lg border-2" 
                style={{ borderColor: config.colors.primary + '15' }}
              >
                <div 
                  className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: config.colors.primary + '15' }}
                >
                  <MapPin className="h-8 w-8" style={{ color: config.colors.primary }} />
                </div>
                <h3 
                  className="text-xl mb-3"
                  style={{ 
                    color: config.colors.secondary,
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  Dirección
                </h3>
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {agencyData.address}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Footer - Mejorado */}
        <footer 
          className="py-12 text-white"
          style={{ backgroundColor: config.colors.secondary }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={agencyData.logo} 
                    alt={agencyData.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <span 
                    className="text-xl"
                    style={{ 
                      fontFamily: 'Manrope, Inter, sans-serif',
                      fontWeight: 800
                    }}
                  >
                    {agencyData.name}
                  </span>
                </div>
                <p 
                  className="opacity-80 mb-4 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Tu socio de confianza en el mundo inmobiliario. Más de 15 años ayudando a personas a encontrar su hogar perfecto.
                </p>
              </div>
              
              <div>
                <h4 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  Enlaces
                </h4>
                <ul className="space-y-2 opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Inicio</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Propiedades</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Contacto</a></li>
                </ul>
              </div>

              <div>
                <h4 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontWeight: 700
                  }}
                >
                  Legal
                </h4>
                <ul className="space-y-2 opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Privacidad</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Términos</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Cookies</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: config.typography.bodyFont }}
              >
                © 2025 {agencyData.name}. Todos los derechos reservados.
              </p>
              <p className="text-xs opacity-50">
                Powered by RealMaker AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
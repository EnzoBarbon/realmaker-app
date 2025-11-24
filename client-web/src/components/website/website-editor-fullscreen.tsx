import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Globe, 
  Eye, 
  Save,
  Undo2,
  Redo2,
  Monitor,
  Smartphone,
  Tablet,
  Layout,
  Type,
  Image as ImageIcon,
  Palette,
  Settings,
  Home as HomeIcon,
  FileText,
  Mail,
  Building2,
  Users,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Move,
  Layers,
  MousePointer2,
  Link as LinkIcon,
  Search,
  Calculator,
  MapPin,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  CheckCircle2,
  Phone,
  Sparkles,
  ChevronRight,
  GripVertical,
  Edit3,
  ExternalLink,
  Download
} from 'lucide-react';
import { WebsitePreview } from './website-preview';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface WebsiteEditorFullscreenProps {
  config: any;
  agencyData: any;
  onClose: () => void;
  onPublish: () => void;
}

type Tool = 'select' | 'sections' | 'elements' | 'design' | 'pages' | 'settings';
type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface Section {
  id: string;
  name: string;
  icon: any;
  category: 'hero' | 'content' | 'properties' | 'testimonials' | 'cta' | 'footer';
  description: string;
  preview?: string;
}

export function WebsiteEditorFullscreen({ config, agencyData, onClose, onPublish }: WebsiteEditorFullscreenProps) {
  const [activeTool, setActiveTool] = useState<Tool>('sections');
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [zoom, setZoom] = useState(100);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  // Secciones prediseñadas para inmobiliarias
  const sections: Section[] = [
    // Hero Sections
    {
      id: 'hero-search',
      name: 'Hero con Buscador',
      icon: Search,
      category: 'hero',
      description: 'Banner principal con buscador de propiedades integrado'
    },
    {
      id: 'hero-simple',
      name: 'Hero Simple',
      icon: Layout,
      category: 'hero',
      description: 'Banner con título, descripción y llamada a la acción'
    },
    {
      id: 'hero-video',
      name: 'Hero con Video',
      icon: Layout,
      category: 'hero',
      description: 'Banner con video de fondo'
    },
    
    // Property Sections
    {
      id: 'properties-grid',
      name: 'Galería de Propiedades',
      icon: Building2,
      category: 'properties',
      description: 'Grid responsive de propiedades destacadas'
    },
    {
      id: 'properties-slider',
      name: 'Carrusel de Propiedades',
      icon: Building2,
      category: 'properties',
      description: 'Slider horizontal de propiedades'
    },
    {
      id: 'property-search',
      name: 'Buscador Avanzado',
      icon: Search,
      category: 'properties',
      description: 'Filtros avanzados de búsqueda de propiedades'
    },
    {
      id: 'property-map',
      name: 'Mapa de Propiedades',
      icon: MapPin,
      category: 'properties',
      description: 'Mapa interactivo con ubicaciones'
    },
    
    // Content Sections
    {
      id: 'stats',
      name: 'Estadísticas',
      icon: TrendingUp,
      category: 'content',
      description: 'Contadores de logros y números clave'
    },
    {
      id: 'features',
      name: 'Características',
      icon: CheckCircle2,
      category: 'content',
      description: 'Grid de servicios y ventajas'
    },
    {
      id: 'about',
      name: 'Sobre Nosotros',
      icon: Users,
      category: 'content',
      description: 'Sección de presentación de la agencia'
    },
    {
      id: 'team',
      name: 'Equipo',
      icon: Users,
      category: 'content',
      description: 'Grid de miembros del equipo'
    },
    {
      id: 'calculator',
      name: 'Calculadora Hipoteca',
      icon: Calculator,
      category: 'content',
      description: 'Calculadora interactiva de hipotecas'
    },
    
    // Testimonials
    {
      id: 'testimonials-grid',
      name: 'Testimonios Grid',
      icon: MessageSquare,
      category: 'testimonials',
      description: 'Reseñas de clientes en formato grid'
    },
    {
      id: 'testimonials-slider',
      name: 'Testimonios Slider',
      icon: Star,
      category: 'testimonials',
      description: 'Carrusel de testimonios'
    },
    
    // CTA Sections
    {
      id: 'cta-simple',
      name: 'Llamada a la Acción',
      icon: Sparkles,
      category: 'cta',
      description: 'CTA con botón destacado'
    },
    {
      id: 'cta-form',
      name: 'CTA con Formulario',
      icon: Mail,
      category: 'cta',
      description: 'CTA con formulario de contacto'
    },
    {
      id: 'contact-form',
      name: 'Formulario de Contacto',
      icon: Mail,
      category: 'cta',
      description: 'Formulario completo de contacto'
    },
    
    // Footer
    {
      id: 'footer-complete',
      name: 'Footer Completo',
      icon: Layout,
      category: 'footer',
      description: 'Footer con información de contacto y enlaces'
    },
  ];

  const tools = [
    { id: 'select' as Tool, icon: MousePointer2, label: 'Seleccionar', description: 'Selecciona y edita elementos' },
    { id: 'sections' as Tool, icon: Layers, label: 'Secciones', description: 'Añade bloques prediseñados' },
    { id: 'elements' as Tool, icon: Plus, label: 'Elementos', description: 'Añade elementos individuales' },
    { id: 'design' as Tool, icon: Palette, label: 'Diseño', description: 'Colores, tipografía y estilos' },
    { id: 'pages' as Tool, icon: FileText, label: 'Páginas', description: 'Gestiona las páginas del sitio' },
    { id: 'settings' as Tool, icon: Settings, label: 'Configuración', description: 'SEO y ajustes avanzados' },
  ];

  const sectionsByCategory = {
    hero: sections.filter(s => s.category === 'hero'),
    properties: sections.filter(s => s.category === 'properties'),
    content: sections.filter(s => s.category === 'content'),
    testimonials: sections.filter(s => s.category === 'testimonials'),
    cta: sections.filter(s => s.category === 'cta'),
    footer: sections.filter(s => s.category === 'footer'),
  };

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'sections':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Hero Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layout className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Hero / Banner</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.hero.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Property Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Propiedades</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.properties.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Content Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Contenido</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.content.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Testimonials */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Testimonios</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.testimonials.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* CTA & Contact */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Llamadas a la Acción</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.cta.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Footer */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layout className="h-4 w-4 text-primary" />
                  <h4 className="text-sm text-gray-900">Footer</h4>
                </div>
                <div className="space-y-2">
                  {sectionsByCategory.footer.map((section) => (
                    <button
                      key={section.id}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{section.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      case 'elements':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Text Elements */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Texto</h4>
                <div className="space-y-2">
                  {[
                    { icon: Type, name: 'Título', desc: 'H1, H2, H3...' },
                    { icon: FileText, name: 'Párrafo', desc: 'Texto normal' },
                    { icon: FileText, name: 'Lista', desc: 'Lista con viñetas' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Media Elements */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Medios</h4>
                <div className="space-y-2">
                  {[
                    { icon: ImageIcon, name: 'Imagen', desc: 'Sube o arrastra imagen' },
                    { icon: Layout, name: 'Galería', desc: 'Grid de imágenes' },
                    { icon: Layout, name: 'Video', desc: 'Video embebido' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Interactive Elements */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Interactivos</h4>
                <div className="space-y-2">
                  {[
                    { icon: Sparkles, name: 'Botón', desc: 'Botón de acción' },
                    { icon: Mail, name: 'Formulario', desc: 'Formulario de contacto' },
                    { icon: LinkIcon, name: 'Enlace', desc: 'Link a otra página' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      case 'design':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Colors */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Colores de marca</h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Color primario</Label>
                    <div className="flex gap-3">
                      <button 
                        className="h-11 w-11 rounded-xl border-2 border-gray-300 flex-shrink-0 hover:border-primary transition-colors"
                        style={{ backgroundColor: config.colors.primary }}
                      />
                      <Input 
                        defaultValue={config.colors.primary} 
                        className="h-11 font-mono text-sm" 
                        placeholder="#e7af2a"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Color secundario</Label>
                    <div className="flex gap-3">
                      <button 
                        className="h-11 w-11 rounded-xl border-2 border-gray-300 flex-shrink-0 hover:border-primary transition-colors"
                        style={{ backgroundColor: config.colors.secondary }}
                      />
                      <Input 
                        defaultValue={config.colors.secondary} 
                        className="h-11 font-mono text-sm" 
                        placeholder="#1a1a1a"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Color de acento</Label>
                    <div className="flex gap-3">
                      <button 
                        className="h-11 w-11 rounded-xl border-2 border-gray-300 flex-shrink-0 hover:border-primary transition-colors"
                        style={{ backgroundColor: config.colors.accent }}
                      />
                      <Input 
                        defaultValue={config.colors.accent} 
                        className="h-11 font-mono text-sm" 
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Typography */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Tipografía</h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Fuente de títulos</Label>
                    <select className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm">
                      <option>Manrope</option>
                      <option>Inter</option>
                      <option>Poppins</option>
                      <option>Montserrat</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Fuente de texto</Label>
                    <select className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm">
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                      <option>Lato</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Spacing */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Espaciado</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-600">Espaciado de secciones</Label>
                      <span className="text-xs text-gray-500">80px</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="160" 
                      defaultValue="80"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-600">Radio de bordes</Label>
                      <span className="text-xs text-gray-500">12px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="24" 
                      defaultValue="12"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      case 'pages':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Añadir página nueva
              </Button>

              <Separator />

              <div className="space-y-2">
                {[
                  { name: 'Inicio', path: '/', enabled: true, icon: HomeIcon },
                  { name: 'Propiedades', path: '/propiedades', enabled: true, icon: Building2 },
                  { name: 'Sobre nosotros', path: '/sobre-nosotros', enabled: true, icon: Users },
                  { name: 'Contacto', path: '/contacto', enabled: true, icon: Mail },
                ].map((page, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <page.icon className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-0.5">{page.name}</p>
                          <p className="text-xs text-gray-500 truncate">{page.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={page.enabled} />
                        <button className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit3 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        );

      case 'settings':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                </TabsList>

                <TabsContent value="seo" className="space-y-4 mt-0">
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Título SEO</Label>
                    <Input 
                      defaultValue={config.seo?.title || ''} 
                      placeholder="Tu agencia inmobiliaria en Madrid"
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máx. 60 caracteres</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Descripción SEO</Label>
                    <textarea 
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none"
                      placeholder="Descripción de tu sitio web que aparecerá en los resultados de búsqueda"
                      defaultValue={config.seo?.description || ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">Máx. 160 caracteres</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Palabras clave</Label>
                    <Input 
                      placeholder="inmobiliaria, pisos, casas, Madrid"
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Imagen de compartir (OG Image)</Label>
                    <div className="aspect-[2/1] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">1200 x 630 px</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-0">
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Dominio personalizado</Label>
                    <Input 
                      defaultValue={config.domain || ''} 
                      placeholder="tuinmobiliaria.com"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Google Analytics ID</Label>
                    <Input 
                      placeholder="G-XXXXXXXXXX"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Facebook Pixel ID</Label>
                    <Input 
                      placeholder="000000000000000"
                      className="h-11"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">Modo mantenimiento</p>
                        <p className="text-xs text-gray-500">Oculta el sitio a los visitantes</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">Indexar en buscadores</p>
                        <p className="text-xs text-gray-500">Permite a Google indexar tu sitio</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <MousePointer2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Selecciona una herramienta</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        {/* Left - Back & Title */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="gap-2 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          
          <div className="h-8 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-900 leading-tight">Editor de Página Web</p>
              <p className="text-xs text-gray-500">{config.domain || 'excellence-inmobiliaria'}</p>
            </div>
          </div>
        </div>

        {/* Center - Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-8 w-px bg-gray-200" />
          
          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewportSize('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewportSize === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista escritorio"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewportSize === 'tablet'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista tablet"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewportSize === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista móvil"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 h-9">
            <button 
              onClick={() => setZoom(Math.max(25, zoom - 10))}
              className="h-6 w-6 rounded hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              title="Reducir zoom"
            >
              <span className="text-base leading-none">−</span>
            </button>
            <span className="text-xs text-gray-600 w-12 text-center font-medium">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="h-6 w-6 rounded hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              title="Aumentar zoom"
            >
              <span className="text-base leading-none">+</span>
            </button>
          </div>
        </div>

        {/* Right - Save & Publish */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Eye className="h-4 w-4" />
            Vista previa
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Save className="h-4 w-4" />
            Guardar borrador
          </Button>

          <Button 
            onClick={onPublish}
            className="gap-2 bg-primary hover:bg-primary/90 h-9 px-6"
          >
            <Globe className="h-4 w-4" />
            Publicar sitio
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tool Icons */}
        <TooltipProvider delayDuration={300}>
          <div className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-1 flex-shrink-0">
            {tools.map((tool) => {
              const isActive = activeTool === tool.id;
              
              return (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-12 h-11 justify-center px-2 relative transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-r-2 border-primary hover:bg-primary/15' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <tool.icon className="h-5 w-5 flex-shrink-0" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            
            <div className="flex-1" />
            
            {/* Help Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-12 h-11 justify-center px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                >
                  <span className="text-xl leading-none">?</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Ayuda y atajos</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Left Panel - Tool Options */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-start gap-3">
              {tools.find(t => t.id === activeTool) && (
                <>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const Tool = tools.find(t => t.id === activeTool)!.icon;
                      return <Tool className="h-5 w-5 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">
                      {tools.find(t => t.id === activeTool)?.label}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {tools.find(t => t.id === activeTool)?.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {renderToolPanel()}
        </div>

        {/* Center - Canvas/Preview */}
        <div className="flex-1 bg-gray-100 overflow-auto relative">
          {/* Canvas Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 flex items-center gap-1">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`h-8 px-3 rounded-md text-xs transition-colors ${
                  showGrid 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex items-start justify-center p-12 min-h-full">
            <div 
              className={`bg-white shadow-2xl transition-all duration-300 mx-auto ${
                showGrid ? 'ring-1 ring-blue-200' : ''
              }`}
              style={{ 
                width: viewportSize === 'desktop' ? '100%' : viewportSize === 'tablet' ? '768px' : '375px',
                maxWidth: viewportSize === 'desktop' ? '1440px' : undefined,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
            >
              <WebsitePreview
                config={config}
                agencyData={agencyData}
                viewportSize={viewportSize === 'tablet' ? 'desktop' : viewportSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
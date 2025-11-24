import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  Globe, 
  Eye, 
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  ChevronRight,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Settings,
  FileText,
  Home as HomeIcon,
  Building2,
  Mail,
  User,
  Check,
  Copy,
  Link as LinkIcon
} from 'lucide-react';
import { WebsitePreview } from './website-preview';
import { TemplateSelector } from './template-selector';
import { DesignCustomizer } from './design-customizer';
import { PagesManager } from './pages-manager';
import { PropertiesPublisher } from './properties-publisher';
import { SEOSettings } from './seo-settings';
import { WebsiteEmptyState } from './website-empty-state';
import { WebsiteOnboarding } from './website-onboarding';
import { WebsiteCreatingLoader } from './website-creating-loader';
import { WebsiteSuccessView } from './website-success-view';
import { WebsiteEditorFullscreen } from './website-editor-fullscreen';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
type PublishStatus = 'draft' | 'published';

interface WebsiteConfig {
  domain: string;
  customDomain?: string;
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: {
    home: { enabled: boolean; order: number };
    properties: { enabled: boolean; order: number };
    about: { enabled: boolean; order: number };
    contact: { enabled: boolean; order: number };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export function WebsiteBuilder() {
  // Verificar si el usuario ya tiene una website creada (persistido en localStorage)
  const websiteExists = localStorage.getItem('hasCreatedWebsite') === 'true';
  
  const [hasWebsite, setHasWebsite] = useState(websiteExists); // Estado para controlar si existe la web
  const [isOnboarding, setIsOnboarding] = useState(false); // Estado para el onboarding
  const [isCreating, setIsCreating] = useState(false); // Estado para la pantalla de carga
  const [showSuccessView, setShowSuccessView] = useState(websiteExists); // Si ya existe, mostrar success view
  const [showEditorFullscreen, setShowEditorFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('draft');
  const [activeTab, setActiveTab] = useState('info');
  const [domainCopied, setDomainCopied] = useState(false);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false); // Indica si la web acaba de ser creada
  
  // Datos de la agencia (importados de "Mi Cuenta")
  const agencyData = {
    name: 'Inmobiliaria Excellence',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
    email: 'contacto@excellence.com',
    phone: '+34 910 123 456',
    address: 'Calle Serrano 123, Madrid',
    description: 'Somos una inmobiliaria líder en Madrid con más de 20 años de experiencia ayudando a nuestros clientes a encontrar su hogar perfecto.'
  };

  const [config, setConfig] = useState<WebsiteConfig>({
    domain: 'excellence.realmaker.ai',
    template: 'modern',
    colors: {
      primary: '#e7af2a',
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
      title: 'Inmobiliaria Excellence - Tu hogar perfecto te espera',
      description: 'Encuentra las mejores propiedades en Madrid con Inmobiliaria Excellence',
      keywords: ['inmobiliaria madrid', 'pisos madrid', 'casas venta', 'alquiler madrid']
    }
  });

  const handlePublish = () => {
    setPublishStatus('published');
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(`https://${config.domain}`);
    setDomainCopied(true);
    setTimeout(() => setDomainCopied(false), 2000);
  };

  const handleStartCreation = () => {
    setIsOnboarding(true);
  };

  const handleOnboardingComplete = (newConfig: any) => {
    setConfig(newConfig);
    setIsOnboarding(false);
    setIsCreating(true);
  };

  const handleCreatingComplete = () => {
    setIsCreating(false);
    setHasWebsite(true);
    setShowSuccessView(true);
    localStorage.setItem('hasCreatedWebsite', 'true');
    setIsNewlyCreated(true);
  };

  const viewportButtons = [
    { id: 'desktop' as ViewportSize, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as ViewportSize, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as ViewportSize, icon: Smartphone, label: 'Móvil' }
  ];

  // Si no hay web creada, mostrar vista inicial
  if (!hasWebsite && !isOnboarding && !isCreating) {
    return <WebsiteEmptyState onStartCreation={handleStartCreation} />;
  }

  // Si está en onboarding, mostrar el wizard
  if (isOnboarding) {
    return (
      <WebsiteOnboarding 
        agencyData={agencyData}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Si está creando, mostrar la pantalla de carga
  if (isCreating) {
    return <WebsiteCreatingLoader onComplete={handleCreatingComplete} />;
  }

  // Si se ha creado con éxito, mostrar la vista de éxito
  if (showSuccessView) {
    return (
      <WebsiteSuccessView 
        config={config}
        agencyData={agencyData}
        onEnterEditor={() => {
          setShowSuccessView(false);
          setShowEditorFullscreen(true);
        }}
        isNewlyCreated={isNewlyCreated}
      />
    );
  }

  // Si está en el editor de pantalla completa
  if (showEditorFullscreen) {
    return (
      <WebsiteEditorFullscreen
        config={config}
        agencyData={agencyData}
        onClose={() => {
          setShowEditorFullscreen(false);
          setShowSuccessView(true);
        }}
        onPublish={handlePublish}
      />
    );
  }

  // Vista por defecto - no debería llegar aquí
  return null;
}
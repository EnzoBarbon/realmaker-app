import { useState, useCallback } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Home,
  Building2,
  Check,
  CheckCircle2,
  Upload,
  X,
  Info,
  Bed,
  Bath,
  Maximize,
  ArrowLeft,
  DollarSign,
  Euro,
  Hash,
  Calendar,
  Sparkles,
  Compass,
  Zap,
  Square,
  Car,
  Box,
  Waves,
  Trees,
  Wind,
  Sofa,
  Shirt,
  Store,
  Warehouse,
  Briefcase,
  Package,
  Video,
  Trash2,
  Search,
  Map,
  Eye,
  EyeOff,
  Navigation,
  Plus,
  Minus,
  XCircle
} from "lucide-react";
import { toast } from 'sonner@2.0.3';
import { getPropertyTypeFeatures } from '../../utils/properties-data';
import { InstagramIcon, FacebookIcon, TikTokIcon, YoutubeIcon } from './social-icons';

interface Property {
  id: string;
  title: string;
  price: number;
  pricePerM2: number;
  location: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'penthouse' | 'duplex' | 'studio' | 'land' | 'commercial' | 'warehouse' | 'office' | 'garage' | 'storage';
  operation: 'sale' | 'rent';
  constructedArea: number;
  usableArea: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  yearBuilt?: number;
  condition?: 'new' | 'good' | 'to-renovate';
  orientation?: string;
  energyCertification?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'pending';
  hasElevator?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  heatingType?: string;
  hasParking?: boolean;
  hasStorage?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasGarden?: boolean;
  hasPool?: boolean;
  hasBuiltInWardrobes?: boolean;
  isFurnished?: boolean;
  isAccessible?: boolean;
  description?: string;
  images: string[];
  status: 'available' | 'unavailable';
  updatedAt: string;
  latitude?: number;
  longitude?: number;
  showExactLocation?: boolean;
}

interface AddPropertyManualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (property: Property) => void;
}

type ManualStep = 1 | 2 | 3 | 4;

interface FormData {
  propertyType: 'apartment' | 'house' | 'condo' | 'penthouse' | 'duplex' | 'studio' | '';
  operation: 'sale' | 'rent' | '';
  searchAddress: string;
  showExactLocation: boolean;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;
  condition: 'new' | 'good' | 'to-renovate' | '';
  constructedArea: string;
  usableArea: string;
  bedrooms: string;
  bathrooms: string;
  hasElevator: boolean;
  orientation: string;
  hasTerrace: boolean;
  hasAirConditioning: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasStorage: boolean;
  hasBuiltInWardrobes: boolean;
  isFurnished: boolean;
  energyCertification: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'pending' | '';
  description: string;
  price: string;
  images: File[];
  imagePreviews: string[];
  instagramVideoUrl: string;
  facebookVideoUrl: string;
  tiktokVideoUrl: string;
  youtubeVideoUrl: string;
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Piso', icon: Building2, desc: 'Apartamento en edificio' },
  { value: 'house', label: 'Casa o chalet', icon: Home, desc: 'Vivienda independiente' },
  { value: 'studio', label: 'Estudio', icon: Square, desc: 'Espacio diáfano' },
  { value: 'duplex', label: 'Dúplex', icon: Building2, desc: 'Dos plantas' },
  { value: 'penthouse', label: 'Ático', icon: Building2, desc: 'Última planta' },
  { value: 'commercial', label: 'Local comercial', icon: Store, desc: 'Espacio comercial' },
  { value: 'warehouse', label: 'Nave industrial', icon: Warehouse, desc: 'Espacio industrial' },
  { value: 'land', label: 'Terreno', icon: Trees, desc: 'Parcela o solar' },
  { value: 'garage', label: 'Garaje', icon: Car, desc: 'Plaza de garaje' },
  { value: 'storage', label: 'Trastero', icon: Package, desc: 'Espacio de almacenaje' },
  { value: 'office', label: 'Oficina', icon: Briefcase, desc: 'Espacio de trabajo' },
];

const PROPERTY_CONDITIONS = [
  { value: 'new', label: 'Obra nueva', desc: 'Recién construido', icon: Sparkles },
  { value: 'good', label: 'Buen estado', desc: 'Listo para entrar', icon: CheckCircle2 },
  { value: 'to-renovate', label: 'A reformar', desc: 'Necesita mejoras', icon: Home },
];

const ORIENTATIONS = [
  { value: 'north', label: 'Norte' },
  { value: 'south', label: 'Sur' },
  { value: 'east', label: 'Este' },
  { value: 'west', label: 'Oeste' },
  { value: 'northeast', label: 'Noreste' },
  { value: 'northwest', label: 'Noroeste' },
  { value: 'southeast', label: 'Sureste' },
  { value: 'southwest', label: 'Suroeste' },
];

const ENERGY_CERTS = [
  { value: 'A', color: 'bg-green-500' },
  { value: 'B', color: 'bg-green-400' },
  { value: 'C', color: 'bg-lime-400' },
  { value: 'D', color: 'bg-yellow-400' },
  { value: 'E', color: 'bg-orange-400' },
  { value: 'F', color: 'bg-orange-500' },
  { value: 'G', color: 'bg-red-500' },
  { value: 'pending', color: 'bg-gray-400' },
];

const FEATURES = [
  { id: 'hasElevator', label: 'Ascensor', icon: Zap },
  { id: 'hasTerrace', label: 'Terraza', icon: Square },
  { id: 'hasAirConditioning', label: 'A/A', icon: Wind },
  { id: 'hasParking', label: 'Garaje', icon: Car },
  { id: 'hasStorage', label: 'Trastero', icon: Box },
  { id: 'hasPool', label: 'Piscina', icon: Waves },
  { id: 'hasGarden', label: 'Jardín', icon: Trees },
  { id: 'hasBuiltInWardrobes', label: 'Armarios', icon: Shirt },
  { id: 'isFurnished', label: 'Amueblado', icon: Sofa },
];

// Simulación de búsqueda de direcciones (en producción usarías Google Places API)
const MOCK_ADDRESSES = [
  { address: 'Calle Gran Vía 28, Madrid', lat: 40.4200, lng: -3.7038, city: 'Madrid' },
  { address: 'Paseo de Gracia 92, Barcelona', lat: 41.3948, lng: 2.1619, city: 'Barcelona' },
  { address: 'Calle Larios 5, Málaga', lat: 36.7213, lng: -4.4214, city: 'Málaga' },
  { address: 'Plaza del Pilar 1, Zaragoza', lat: 41.6561, lng: -0.8773, city: 'Zaragoza' },
  { address: 'Avenida de la Constitución 24, Sevilla', lat: 37.3891, lng: -5.9845, city: 'Sevilla' },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export function AddPropertyManualDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: AddPropertyManualDialogProps) {
  const [currentStep, setCurrentStep] = useState<ManualStep>(1);
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    operation: '',
    searchAddress: '',
    showExactLocation: true,
    latitude: null,
    longitude: null,
    formattedAddress: '',
    condition: '',
    constructedArea: '',
    usableArea: '',
    bedrooms: '',
    bathrooms: '',
    hasElevator: false,
    orientation: '',
    hasTerrace: false,
    hasAirConditioning: false,
    hasPool: false,
    hasGarden: false,
    hasParking: false,
    hasStorage: false,
    hasBuiltInWardrobes: false,
    isFurnished: false,
    energyCertification: '',
    description: '',
    price: '',
    images: [],
    imagePreviews: [],
    instagramVideoUrl: '',
    facebookVideoUrl: '',
    tiktokVideoUrl: '',
    youtubeVideoUrl: '',
  });

  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<typeof MOCK_ADDRESSES>([]);
  
  // Estados para generación de descripción con IA
  const [showAIDescriptionModal, setShowAIDescriptionModal] = useState(false);
  const [aiDescriptionStyle, setAiDescriptionStyle] = useState<string>('comercial');
  const [aiCustomInstructions, setAiCustomInstructions] = useState('');
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  // Obtener características del tipo de propiedad seleccionado
  const propertyFeatures = formData.propertyType 
    ? getPropertyTypeFeatures(formData.propertyType as any)
    : null;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressSearch = (value: string) => {
    handleInputChange('searchAddress', value);
    
    if (value.length > 2) {
      // Simular búsqueda de direcciones
      const filtered = MOCK_ADDRESSES.filter(addr => 
        addr.address.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered);
      setShowAddressSuggestions(true);
    } else {
      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (suggestion: typeof MOCK_ADDRESSES[0]) => {
    setFormData(prev => ({
      ...prev,
      searchAddress: suggestion.address,
      formattedAddress: suggestion.address,
      latitude: suggestion.lat,
      longitude: suggestion.lng,
    }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    
    if (errors.searchAddress) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.searchAddress;
        return newErrors;
      });
    }
    
    toast.success('Ubicación establecida correctamente');
  };

  const handleNext = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!formData.propertyType) newErrors.propertyType = 'Selecciona un tipo de inmueble';
      if (!formData.operation) newErrors.operation = 'Selecciona una operación';
      if (!formData.price) newErrors.price = 'El precio es obligatorio';
      if (!formData.formattedAddress) newErrors.searchAddress = 'Busca y selecciona una dirección';
    }
    
    if (currentStep === 2) {
      if (!formData.constructedArea) newErrors.constructedArea = 'Los m² construidos son obligatorios';
      if (propertyFeatures?.hasBedrooms && !formData.bedrooms) newErrors.bedrooms = 'Las habitaciones son obligatorias';
      if (propertyFeatures?.hasBathrooms && !formData.bathrooms) newErrors.bathrooms = 'Los baños son obligatorios';
      if (!formData.description) newErrors.description = 'La descripción es obligatoria';
    }
    
    if (currentStep === 3) {
      if (formData.imagePreviews.length === 0) newErrors.images = 'Debes añadir al menos una foto';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    setErrors({});
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as ManualStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as ManualStep);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newImages = [...formData.images, ...files].slice(0, 20);
    const newPreviews = [...formData.imagePreviews];

    files.forEach(file => {
      if (newPreviews.length < 20) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setFormData(prev => ({
            ...prev,
            imagePreviews: newPreviews
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleConfirm = () => {
    const newProperty: Property = {
      id: `PROP-${Date.now()}`,
      title: `${PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label || 'Propiedad'} en ${formData.formattedAddress.split(',').pop()?.trim() || '...'}`,
      price: parseFloat(formData.price) || 0,
      pricePerM2: parseFloat(formData.price) / parseFloat(formData.constructedArea) || 0,
      location: formData.formattedAddress,
      propertyType: formData.propertyType as any,
      operation: formData.operation as any,
      constructedArea: parseFloat(formData.constructedArea) || 0,
      usableArea: parseFloat(formData.usableArea) || parseFloat(formData.constructedArea) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      condition: formData.condition as any,
      orientation: formData.orientation,
      energyCertification: formData.energyCertification as any,
      hasElevator: formData.hasElevator,
      hasAirConditioning: formData.hasAirConditioning,
      hasParking: formData.hasParking,
      hasStorage: formData.hasStorage,
      hasTerrace: formData.hasTerrace,
      hasGarden: formData.hasGarden,
      hasPool: formData.hasPool,
      hasBuiltInWardrobes: formData.hasBuiltInWardrobes,
      isFurnished: formData.isFurnished,
      description: formData.description,
      images: formData.imagePreviews,
      status: 'available',
      updatedAt: new Date().toISOString(),
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      showExactLocation: formData.showExactLocation,
    };

    onConfirm(newProperty);
    handleReset();
    onOpenChange(false);
    toast.success('Propiedad añadida correctamente');
  };

  // Funciones para generación de descripción con IA
  const handleGenerateDescriptionWithAI = async () => {
    setIsGeneratingDescription(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const propertyTypeLabels: Record<string, string> = {
      apartment: 'piso',
      house: 'casa',
      condo: 'apartamento',
      penthouse: 'ático',
      duplex: 'dúplex',
      studio: 'estudio',
      land: 'terreno',
      commercial: 'local comercial',
      warehouse: 'nave industrial',
      office: 'oficina',
      garage: 'garaje',
      storage: 'trastero'
    };
    
    const propertyTypeName = propertyTypeLabels[formData.propertyType] || 'propiedad';
    const operation = formData.operation === 'sale' ? 'venta' : 'alquiler';
    const location = formData.formattedAddress.split(',')[1]?.trim() || 'ubicación privilegiada';
    
    let description = '';
    
    switch (aiDescriptionStyle) {
      case 'comercial':
        description = `Excelente oportunidad de ${operation}. ${propertyTypeName.charAt(0).toUpperCase() + propertyTypeName.slice(1)} ubicado en ${location}`;
        if (formData.bedrooms) {
          description += ` con ${formData.bedrooms} ${Number(formData.bedrooms) === 1 ? 'dormitorio' : 'dormitorios'}`;
          if (formData.bathrooms) {
            description += ` y ${formData.bathrooms} ${Number(formData.bathrooms) === 1 ? 'baño' : 'baños'}`;
          }
        }
        if (formData.constructedArea) {
          description += `. Cuenta con ${formData.constructedArea}m² construidos`;
        }
        break;
        
      case 'lujo':
        description = `Espectacular ${propertyTypeName} de alto standing en la exclusiva zona de ${location}. `;
        if (formData.bedrooms) {
          description += `Esta magnífica propiedad dispone de ${formData.bedrooms} ${Number(formData.bedrooms) === 1 ? 'amplio dormitorio' : 'amplios dormitorios'}`;
          if (formData.bathrooms) {
            description += ` y ${formData.bathrooms} ${Number(formData.bathrooms) === 1 ? 'baño completo' : 'baños completos'} de diseño`;
          }
          description += '. ';
        }
        if (formData.constructedArea) {
          description += `Con sus ${formData.constructedArea}m² construidos, esta joya inmobiliaria representa la máxima expresión del confort y la elegancia`;
        }
        break;
        
      case 'moderno':
        description = `${propertyTypeName.charAt(0).toUpperCase() + propertyTypeName.slice(1)} contemporáneo en ${location}. `;
        if (formData.constructedArea) {
          description += `${formData.constructedArea}m² de diseño funcional`;
        }
        if (formData.bedrooms) {
          description += ` | ${formData.bedrooms} hab`;
          if (formData.bathrooms) {
            description += ` | ${formData.bathrooms} baños`;
          }
        }
        description += `. Espacios luminosos y versátiles`;
        break;
        
      case 'familiar':
        description = `Cálido y acogedor ${propertyTypeName} perfecto para familias en ${location}. `;
        if (formData.bedrooms) {
          description += `Con ${formData.bedrooms} ${Number(formData.bedrooms) === 1 ? 'habitación' : 'habitaciones'} espaciosas`;
          if (formData.bathrooms) {
            description += ` y ${formData.bathrooms} ${Number(formData.bathrooms) === 1 ? 'baño' : 'baños'}`;
          }
          description += ', ideal para disfrutar en familia. ';
        }
        if (formData.constructedArea) {
          description += `Sus ${formData.constructedArea}m² están distribuidos para aprovechar cada rincón`;
        }
        break;
        
      case 'formal':
        description = `Se ofrece en ${operation} ${propertyTypeName} sito en ${location}. `;
        if (formData.constructedArea) {
          description += `La propiedad cuenta con una superficie construida de ${formData.constructedArea} metros cuadrados`;
        }
        if (formData.bedrooms) {
          description += `, distribuidos en ${formData.bedrooms} ${Number(formData.bedrooms) === 1 ? 'dormitorio' : 'dormitorios'}`;
          if (formData.bathrooms) {
            description += ` y ${formData.bathrooms} ${Number(formData.bathrooms) === 1 ? 'cuarto de baño' : 'cuartos de baño'}`;
          }
        }
        break;
        
      case 'informal':
        description = `¡Echa un vistazo a este ${propertyTypeName} en ${location}! `;
        if (formData.bedrooms) {
          description += `Tiene ${formData.bedrooms} ${Number(formData.bedrooms) === 1 ? 'habitación' : 'habitaciones'}`;
          if (formData.bathrooms) {
            description += ` y ${formData.bathrooms} ${Number(formData.bathrooms) === 1 ? 'baño' : 'baños'}`;
          }
          description += '. ';
        }
        if (formData.constructedArea) {
          description += `Con sus ${formData.constructedArea}m², este espacio tiene todo lo que necesitas`;
        }
        break;
    }
    
    const features = [];
    if (formData.hasParking) features.push('parking');
    if (formData.hasPool) features.push('piscina');
    if (formData.hasGarden) features.push('jardín');
    if (formData.hasTerrace) features.push('terraza');
    if (formData.hasElevator) features.push('ascensor');
    if (formData.hasAirConditioning) features.push('aire acondicionado');
    
    if (features.length > 0) {
      const connector = aiDescriptionStyle === 'formal' ? '. Dispone de' : '. Incluye';
      description += `${connector} ${features.join(', ')}.`;
    }
    
    if (aiCustomInstructions.trim()) {
      description += ` ${aiCustomInstructions}`;
    }
    
    setAiGeneratedPreview(description);
    setIsGeneratingDescription(false);
  };
  
  const handleApplyAIDescription = () => {
    handleInputChange('description', aiGeneratedPreview);
    setShowAIDescriptionModal(false);
    setAiGeneratedPreview('');
    setAiCustomInstructions('');
    toast.success('Descripción aplicada correctamente');
  };
  
  const handleOpenAIModal = () => {
    setShowAIDescriptionModal(true);
    setAiDescriptionStyle('comercial');
    setAiCustomInstructions('');
    setAiGeneratedPreview('');
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      propertyType: '',
      operation: '',
      searchAddress: '',
      showExactLocation: true,
      latitude: null,
      longitude: null,
      formattedAddress: '',
      condition: '',
      constructedArea: '',
      usableArea: '',
      bedrooms: '',
      bathrooms: '',
      hasElevator: false,
      orientation: '',
      hasTerrace: false,
      hasAirConditioning: false,
      hasPool: false,
      hasGarden: false,
      hasParking: false,
      hasStorage: false,
      hasBuiltInWardrobes: false,
      isFurnished: false,
      energyCertification: '',
      description: '',
      price: '',
      images: [],
      imagePreviews: [],
      instagramVideoUrl: '',
      facebookVideoUrl: '',
      tiktokVideoUrl: '',
      youtubeVideoUrl: '',
    });
    setErrors({});
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const propertyTitle = `${PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label || 'Propiedad'} en ${formData.formattedAddress.split(',').pop()?.trim() || '...'}`;
  const priceValue = parseFloat(formData.price) || 0;
  const constructedAreaValue = parseFloat(formData.constructedArea) || 1;
  const pricePerM2Value = priceValue / constructedAreaValue;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header minimalista */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Volver</span>
              </button>
            </div>

            {/* Center - Progress */}
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                      currentStep === step
                        ? 'bg-primary text-white'
                        : currentStep > step
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-1 ${currentStep > step + 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Right - Mobile progress indicator */}
            <div className="flex sm:hidden items-center gap-2">
              <span className="text-xs text-gray-500">Paso {currentStep} de 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-10">
          {/* Paso 1: Datos básicos */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Header del paso */}
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-900">Datos básicos</h2>
                <p className="text-sm text-gray-500 mt-1">Información principal de la propiedad</p>
              </div>

              {/* Tipo de inmueble */}
              <div data-error={!!errors.propertyType}>
                <Label className="text-sm text-gray-700 mb-3 block">Tipo de inmueble *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.propertyType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('propertyType', type.value)}
                        className={`group p-4 rounded-xl border-2 transition-all duration-200 text-left hover:border-primary/50 hover:shadow-sm active:scale-95 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-2 transition-all duration-200 ${isSelected ? 'text-primary scale-110' : 'text-gray-400 group-hover:text-primary/70 group-hover:scale-105'}`} />
                        <div className="text-sm text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-200" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.propertyType && <p className="text-red-500 text-xs mt-2">{errors.propertyType}</p>}
              </div>

              {/* Operación y Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Operación */}
                <div data-error={!!errors.operation}>
                  <Label className="text-sm text-gray-700 mb-3 block">Operación *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('operation', 'sale')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-sm active:scale-95 ${
                        formData.operation === 'sale'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary/50'
                      }`}
                    >
                      <Euro className={`h-5 w-5 mb-1 transition-all duration-200 ${formData.operation === 'sale' ? 'text-primary scale-110' : 'text-gray-400'}`} />
                      <div className="text-sm text-gray-900">Venta</div>
                      {formData.operation === 'sale' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-200" />
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('operation', 'rent')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-sm active:scale-95 ${
                        formData.operation === 'rent'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary/50'
                      }`}
                    >
                      <Calendar className={`h-5 w-5 mb-1 transition-all duration-200 ${formData.operation === 'rent' ? 'text-primary scale-110' : 'text-gray-400'}`} />
                      <div className="text-sm text-gray-900">Alquiler</div>
                      {formData.operation === 'rent' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-200" />
                        </div>
                      )}
                    </button>
                  </div>
                  {errors.operation && <p className="text-red-500 text-xs mt-2">{errors.operation}</p>}
                </div>

                {/* Precio */}
                <div data-error={!!errors.price}>
                  <Label htmlFor="price" className="text-sm text-gray-700 mb-3 block">
                    {formData.operation === 'rent' ? 'Precio €/mes *' : 'Precio *'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                    <Input
                      id="price"
                      type="text"
                      placeholder={formData.operation === 'rent' ? '1.200' : '250.000'}
                      value={formData.price ? new Intl.NumberFormat('es-ES').format(Number(formData.price.replace(/\./g, ''))) : ''}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\./g, '');
                        if (numericValue === '' || /^\d+$/.test(numericValue)) {
                          handleInputChange('price', numericValue);
                        }
                      }}
                      className={`pl-8 h-12 ${errors.price ? 'border-red-500' : ''}`}
                    />
                    {formData.operation === 'rent' && formData.price && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/mes</span>
                    )}
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-2">{errors.price}</p>}
                </div>
              </div>

              {/* Ubicación con mapa */}
              <div data-error={!!errors.searchAddress}>
                <Label className="text-sm text-gray-700 mb-3 block">Ubicación *</Label>
                
                {/* Buscador de dirección */}
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Busca la dirección..."
                    value={formData.searchAddress}
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    onFocus={() => formData.searchAddress.length > 2 && setShowAddressSuggestions(true)}
                    className={`pl-11 h-12 ${errors.searchAddress ? 'border-red-500' : ''}`}
                  />
                  
                  {/* Sugerencias de direcciones */}
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectAddress(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{suggestion.address}</p>
                              <p className="text-xs text-gray-500">{suggestion.city}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {errors.searchAddress && <p className="text-red-500 text-xs mb-3">{errors.searchAddress}</p>}

                {/* Mapa simulado */}
                {formData.latitude && formData.longitude && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Simulación de mapa */}
                    <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-50 to-green-50">
                      {/* Cuadrícula simulada del mapa */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 grid-rows-8 h-full">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className="border border-gray-300" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Pin de ubicación */}
                      {formData.showExactLocation && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                          <MapPin className="h-8 w-8 text-primary fill-primary drop-shadow-lg" />
                        </div>
                      )}
                      
                      {/* Área difuminada cuando no se muestra ubicación exacta */}
                      {!formData.showExactLocation && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-32 h-32 rounded-full bg-primary/20 blur-xl" />
                        </div>
                      )}
                      
                      {/* Dirección seleccionada */}
                      <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg px-4 py-3 shadow-sm">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-900 flex-1">{formData.formattedAddress}</p>
                        </div>
                      </div>
                      
                      {/* Controles de zoom simulados */}
                      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm overflow-hidden">
                        <button className="p-2 hover:bg-gray-50 border-b border-gray-200">
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-50">
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Toggle de ubicación exacta */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          {formData.showExactLocation ? (
                            <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm text-gray-900">Mostrar ubicación exacta</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formData.showExactLocation 
                                ? 'La dirección exacta será visible en el mapa'
                                : 'Solo se mostrará la zona aproximada'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.showExactLocation}
                          onCheckedChange={(checked) => handleInputChange('showExactLocation', checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón siguiente */}
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 h-11 px-8 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                >
                  <span>Continuar</span>
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 2: Detalles */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Header del paso */}
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-900">Detalles</h2>
                <p className="text-sm text-gray-500 mt-1">Características y equipamiento</p>
              </div>

              {/* Superficies y distribución */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error={!!errors.constructedArea}>
                  <Label htmlFor="constructedArea" className="text-sm text-gray-700 mb-2 block">m² construidos *</Label>
                  <div className="relative">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="constructedArea"
                      type="number"
                      value={formData.constructedArea}
                      onChange={(e) => handleInputChange('constructedArea', e.target.value)}
                      placeholder="85"
                      className={`pl-10 h-11 ${errors.constructedArea ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.constructedArea && <p className="text-red-500 text-xs mt-1">{errors.constructedArea}</p>}
                </div>
                
                <div>
                  <Label htmlFor="usableArea" className="text-sm text-gray-700 mb-2 block">m² útiles</Label>
                  <div className="relative">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="usableArea"
                      type="number"
                      value={formData.usableArea}
                      onChange={(e) => handleInputChange('usableArea', e.target.value)}
                      placeholder="75"
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {propertyFeatures?.hasBedrooms && (
                  <div data-error={!!errors.bedrooms}>
                    <Label htmlFor="bedrooms" className="text-sm text-gray-700 mb-2 block">Habitaciones *</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        placeholder="3"
                        className={`pl-10 h-11 ${errors.bedrooms ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
                  </div>
                )}
                
                {propertyFeatures?.hasBathrooms && (
                  <div data-error={!!errors.bathrooms}>
                    <Label htmlFor="bathrooms" className="text-sm text-gray-700 mb-2 block">Baños *</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        placeholder="2"
                        className={`pl-10 h-11 ${errors.bathrooms ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
                  </div>
                )}
              </div>

              {/* Estado */}
              <div>
                <Label className="text-sm text-gray-700 mb-3 block">Estado</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PROPERTY_CONDITIONS.map((condition) => {
                    const Icon = condition.icon;
                    const isSelected = formData.condition === condition.value;
                    return (
                      <button
                        key={condition.value}
                        type="button"
                        onClick={() => handleInputChange('condition', condition.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-sm active:scale-95 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-1 transition-all duration-200 ${isSelected ? 'text-primary scale-110' : 'text-gray-400'}`} />
                        <div className="text-sm text-gray-900">{condition.label}</div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-200" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Orientación */}
              <div>
                <Label className="text-sm text-gray-700 mb-3 block">Orientación</Label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {ORIENTATIONS.map((orient) => {
                    const isSelected = formData.orientation === orient.value;
                    return (
                      <button
                        key={orient.value}
                        type="button"
                        onClick={() => handleInputChange('orientation', orient.value)}
                        className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Compass className={`h-3.5 w-3.5 transition-all duration-200 ${isSelected ? 'rotate-0' : ''}`} />
                          <span>{orient.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Características */}
              <div>
                <Label className="text-sm text-gray-700 mb-3 block">Características</Label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = formData[feature.id as keyof FormData];
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => handleInputChange(feature.id as keyof FormData, !isSelected)}
                        className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-sm active:scale-95 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mb-1 mx-auto transition-all duration-200 ${isSelected ? 'text-primary scale-110' : 'text-gray-400'}`} />
                        <div className="text-xs sm:text-sm text-gray-900 text-center">{feature.label}</div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-200">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certificación energética */}
              <div>
                <Label className="text-sm text-gray-700 mb-3 block">Certificación energética</Label>
                <div className="flex flex-wrap gap-2">
                  {ENERGY_CERTS.map((cert) => {
                    const isSelected = formData.energyCertification === cert.value;
                    return (
                      <button
                        key={cert.value}
                        type="button"
                        onClick={() => handleInputChange('energyCertification', cert.value)}
                        className={`relative px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-sm active:scale-95 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${cert.color} flex items-center justify-center text-white text-xs shadow-sm transition-all duration-200 ${isSelected ? 'scale-110' : ''}`}>
                            {cert.value === 'pending' ? '?' : cert.value}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1">
                            <CheckCircle2 className="h-4 w-4 text-primary bg-white rounded-full animate-in zoom-in duration-200" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción */}
              <div data-error={!!errors.description}>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="description" className="text-sm text-gray-700">Descripción *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAIModal}
                    className="h-8 gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span className="text-xs">Generar con IA</span>
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe las características destacadas de la propiedad..."
                  rows={5}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-2">{formData.description.length} caracteres</p>
              </div>

              {/* Botones navegación */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-6 hover:shadow-sm transition-all duration-200 active:scale-95 group"
                >
                  <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span>Atrás</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 h-11 px-8 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group"
                >
                  <span>Continuar</span>
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Fotos */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Header del paso */}
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-900">Fotos y multimedia</h2>
                <p className="text-sm text-gray-500 mt-1">Añade imágenes y enlaces a videos</p>
              </div>

              <div data-error={!!errors.images}>
                {/* Zona de drag & drop */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                    dragActive
                      ? 'border-primary bg-primary/5 scale-105 shadow-lg'
                      : errors.images
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-primary/30 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="text-primary">Haz clic para seleccionar</span> o arrastra las fotos aquí
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG hasta 10MB cada una (máximo 20 fotos)</p>
                  </div>
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}

                {/* Preview de imágenes */}
                {formData.imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-700 mb-3">{formData.imagePreviews.length} foto{formData.imagePreviews.length !== 1 ? 's' : ''}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-white text-xs">Principal</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enlaces multimedia */}
              <div>
                <Label className="text-sm text-gray-700 mb-3 block">Enlaces multimedia (opcional)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <InstagramIcon className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      type="url"
                      value={formData.instagramVideoUrl}
                      onChange={(e) => handleInputChange('instagramVideoUrl', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="flex-1 h-11 transition-all duration-200 focus:shadow-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <FacebookIcon className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      type="url"
                      value={formData.facebookVideoUrl}
                      onChange={(e) => handleInputChange('facebookVideoUrl', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="flex-1 h-11 transition-all duration-200 focus:shadow-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <TikTokIcon className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      type="url"
                      value={formData.tiktokVideoUrl}
                      onChange={(e) => handleInputChange('tiktokVideoUrl', e.target.value)}
                      placeholder="https://tiktok.com/..."
                      className="flex-1 h-11 transition-all duration-200 focus:shadow-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <YoutubeIcon className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      type="url"
                      value={formData.youtubeVideoUrl}
                      onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="flex-1 h-11 transition-all duration-200 focus:shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Botones navegación */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-6"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Atrás</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 h-11 px-8"
                >
                  <span>Revisar</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 4: Revisión final */}
          {currentStep === 4 && (
            <div className="space-y-8">
              {/* Header del paso */}
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-900">Revisión final</h2>
                <p className="text-sm text-gray-500 mt-1">Verifica que todos los datos sean correctos</p>
              </div>

              {/* Resumen de la propiedad */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Imagen principal */}
                {formData.imagePreviews[0] && (
                  <div className="aspect-[16/9] relative">
                    <img
                      src={formData.imagePreviews[0]}
                      alt="Imagen principal"
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      {formData.operation === 'sale' ? 'En venta' : 'En alquiler'}
                    </Badge>
                  </div>
                )}

                {/* Información principal */}
                <div className="p-6">
                  <h3 className="text-lg text-gray-900 mb-2">{propertyTitle}</h3>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl text-primary">{formatPrice(priceValue)}</span>
                    {formData.constructedArea && (
                      <span className="text-sm text-gray-500">
                        {formatPrice(pricePerM2Value)}/m²
                      </span>
                    )}
                  </div>

                  {/* Características principales */}
                  <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100">
                    {formData.constructedArea && (
                      <div className="flex items-center gap-2">
                        <Maximize className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formData.constructedArea}m²</span>
                      </div>
                    )}
                    {formData.bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formData.bedrooms} hab.</span>
                      </div>
                    )}
                    {formData.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formData.bathrooms} baño{Number(formData.bathrooms) !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  {formData.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-3">{formData.description}</p>
                    </div>
                  )}

                  {/* Galería de imágenes */}
                  {formData.imagePreviews.length > 1 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-4 gap-2">
                        {formData.imagePreviews.slice(1, 5).map((preview, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={preview}
                              alt={`Imagen ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {formData.imagePreviews.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">+{formData.imagePreviews.length - 5} fotos más</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Revisa todos los datos antes de guardar</p>
                    <p className="text-xs text-blue-700 mt-1">Puedes volver atrás para editar cualquier información</p>
                  </div>
                </div>
              </div>

              {/* Botones navegación */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-6 hover:shadow-sm transition-all duration-200 active:scale-95 group"
                >
                  <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span>Editar</span>
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-primary hover:bg-primary/90 h-11 px-8 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  <Check className="h-4 w-4 mr-2" />
                  <span>Guardar propiedad</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de generación de descripción con IA */}
      {/* Modal de Generación de Descripción con IA */}
      <Dialog open={showAIDescriptionModal} onOpenChange={setShowAIDescriptionModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl p-4 sm:p-6">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generar descripción con IA
          </DialogTitle>
          <DialogDescription>
            Selecciona un estilo o personaliza las instrucciones para generar la descripción perfecta
          </DialogDescription>
          
          <div className="space-y-4 mt-4">
            {/* Estilos rápidos */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Estilo de descripción</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: 'comercial', label: 'Comercial', icon: '💼', desc: 'Enfocado en venta rápida' },
                  { value: 'lujo', label: 'Lujo', icon: '✨', desc: 'Exclusivo y premium' },
                  { value: 'moderno', label: 'Moderno', icon: '🏙️', desc: 'Contemporáneo y urbano' },
                  { value: 'familiar', label: 'Familiar', icon: '🏡', desc: 'Cálido y acogedor' },
                  { value: 'formal', label: 'Formal', icon: '📋', desc: 'Profesional y técnico' },
                  { value: 'informal', label: 'Informal', icon: '😊', desc: 'Cercano y amigable' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setAiDescriptionStyle(style.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      aiDescriptionStyle === style.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{style.icon}</span>
                      <span className={`text-sm font-medium ${
                        aiDescriptionStyle === style.value ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Instrucciones personalizadas */}
            <div>
              <Label htmlFor="ai-instructions" className="text-sm text-gray-700 mb-1.5 block">
                Instrucciones adicionales (opcional)
              </Label>
              <Textarea
                id="ai-instructions"
                value={aiCustomInstructions}
                onChange={(e) => setAiCustomInstructions(e.target.value)}
                placeholder="Ej: Mencionar la proximidad al metro, destacar las vistas, incluir que acepta mascotas..."
                rows={3}
                className="w-full resize-none text-sm"
              />
            </div>

            {/* Preview de la descripción generada */}
            {aiGeneratedPreview && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <Label className="text-sm font-medium text-amber-900">Descripción generada</Label>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {aiGeneratedPreview}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {!aiGeneratedPreview ? (
                <>
                  <Button
                    onClick={handleGenerateDescriptionWithAI}
                    disabled={isGeneratingDescription}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generar descripción
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowAIDescriptionModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isGeneratingDescription}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleApplyAIDescription}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aplicar descripción
                  </Button>
                  <Button
                    onClick={handleGenerateDescriptionWithAI}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAIDescriptionModal(false);
                      setAiGeneratedPreview('');
                    }}
                    variant="ghost"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "../ui/use-mobile";
import {
  X,
  Upload,
  Image as ImageIcon,
  Home,
  Building2,
  DollarSign,
  MapPin,
  Ruler,
  Bed,
  Bath,
  ArrowLeft,
  Check,
  Trash2
} from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface AddPropertyFormProps {
  onClose: () => void;
  onSave: (property: any) => void;
}

export function AddPropertyForm({ onClose, onSave }: AddPropertyFormProps) {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'apartment' as 'apartment' | 'house' | 'condo',
    operation: 'sale' as 'sale' | 'rent',
    status: 'available' as 'available' | 'reserved',
    description: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular subida de imágenes
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      toast.success(`${files.length} imagen(es) añadida(s)`);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Imagen eliminada');
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.title || !formData.location || !formData.price) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    if (images.length === 0) {
      toast.error('Por favor añade al menos una imagen');
      return;
    }

    const newProperty = {
      id: Date.now().toString(),
      title: formData.title,
      location: formData.location,
      price: parseFloat(formData.price),
      pricePerM2: formData.size ? parseFloat(formData.price) / parseFloat(formData.size) : 0,
      size: parseFloat(formData.size) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      propertyType: formData.propertyType,
      operation: formData.operation,
      status: formData.status,
      images: images,
      updatedAt: new Date().toISOString()
    };

    onSave(newProperty);
    toast.success('Propiedad añadida correctamente');
    onClose();
  };

  const nextStep = () => {
    if (currentStep === 1 && images.length === 0) {
      toast.error('Por favor añade al menos una imagen');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const totalSteps = 3;

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center ${isMobile ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white ${isMobile ? 'w-full h-full' : 'max-w-2xl w-full max-h-[90vh] rounded-lg shadow-xl'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && currentStep > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Añadir Propiedad</h2>
              <p className="text-sm text-gray-500">Paso {currentStep} de {totalSteps}</p>
            </div>
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Indicador de progreso */}
        <div className="flex gap-1 px-4 pt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-all ${
                step <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <ScrollArea className={`${isMobile ? 'h-[calc(100vh-180px)]' : 'h-[calc(90vh-180px)]'}`}>
          <div className="p-6">
            {/* Paso 1: Imágenes */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">Fotos de la propiedad</h3>
                  <p className="text-sm text-gray-500">Añade fotos atractivas para captar la atención</p>
                </div>

                <div className="space-y-3">
                  {/* Upload area */}
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Haz clic para subir fotos
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG hasta 10MB (máximo 10 fotos)
                      </p>
                    </div>
                  </label>

                  {/* Preview de imágenes */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <ImageWithFallback
                              src={image}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 2: Información básica */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">Información básica</h3>
                  <p className="text-sm text-gray-500">Completa los datos principales de la propiedad</p>
                </div>

                {/* Tipo de operación */}
                <div className="space-y-2">
                  <Label>Tipo de operación *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, operation: 'sale' })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.operation === 'sale'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      <span>Venta</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, operation: 'rent' })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.operation === 'rent'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Alquiler</span>
                    </button>
                  </div>
                </div>

                {/* Tipo de propiedad */}
                <div className="space-y-2">
                  <Label>Tipo de propiedad *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: 'apartment' })}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        formData.propertyType === 'apartment'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Apartamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: 'house' })}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        formData.propertyType === 'house'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Casa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: 'condo' })}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        formData.propertyType === 'condo'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Piso
                    </button>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la propiedad *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Apartamento moderno en el centro"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-2"
                  />
                </div>

                {/* Ubicación */}
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Ej: Centro, Madrid"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10 border-2"
                    />
                  </div>
                </div>

                {/* Precio y Tamaño */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {formData.operation === 'sale' ? 'Precio €' : 'Precio €/mes'} *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="350000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="pl-10 border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Tamaño (m²)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="size"
                        type="number"
                        placeholder="100"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="pl-10 border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Habitaciones y Baños */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Habitaciones</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="pl-10 border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Baños</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        className="pl-10 border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Detalles adicionales */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">Detalles adicionales</h3>
                  <p className="text-sm text-gray-500">Información complementaria de la propiedad</p>
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label>Estado de disponibilidad</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'available' })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.status === 'available'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      <span>Disponible</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'reserved' })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.status === 'reserved'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>Reservada</span>
                    </button>
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe las características principales de la propiedad..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="border-2 resize-none"
                  />
                </div>

                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="font-medium text-gray-900">Resumen de la propiedad</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Título:</span>
                      <span className="text-gray-900 font-medium">{formData.title || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="text-gray-900 font-medium">{formData.location || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio:</span>
                      <span className="text-gray-900 font-medium">
                        {formData.price ? `${formData.price}€${formData.operation === 'rent' ? '/mes' : ''}` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fotos:</span>
                      <span className="text-gray-900 font-medium">{images.length} imagen(es)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
          <div className="flex gap-3">
            {currentStep > 1 && !isMobile && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Atrás
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Guardar Propiedad
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

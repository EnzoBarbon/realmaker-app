import { useState } from 'react';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Building2, Euro, MapPin, Maximize } from 'lucide-react';
import { MOCK_PROPERTIES } from '../../utils/properties-data';

interface PropertiesPublisherProps {
  publishedPropertyIds?: string[];
  onPublishChange?: (propertyIds: string[]) => void;
}

export function PropertiesPublisher({ 
  publishedPropertyIds = [], 
  onPublishChange 
}: PropertiesPublisherProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localPublished, setLocalPublished] = useState<Set<string>>(
    new Set(publishedPropertyIds)
  );

  const handleTogglePublish = (propertyId: string) => {
    const newPublished = new Set(localPublished);
    if (newPublished.has(propertyId)) {
      newPublished.delete(propertyId);
    } else {
      newPublished.add(propertyId);
    }
    setLocalPublished(newPublished);
    onPublishChange?.(Array.from(newPublished));
  };

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.propertyType.toLowerCase().includes(searchLower)
    );
  });

  const publishedCount = localPublished.size;
  const totalCount = MOCK_PROPERTIES.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 mb-1">Propiedades publicadas</h3>
          <p className="text-sm text-gray-500">
            Selecciona qué propiedades mostrar en tu web
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          {publishedCount} de {totalCount}
        </Badge>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar propiedades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de propiedades */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredProperties.map((property) => {
          const isPublished = localPublished.has(property.id);
          
          return (
            <div
              key={property.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                isPublished
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Imagen */}
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm text-gray-900 line-clamp-1">{property.title}</h4>
                  {isPublished && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs flex-shrink-0">
                      Publicada
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location.split(',')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3 w-3" />
                    {property.constructedArea}m²
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-primary">
                    {property.price.toLocaleString('es-ES')} €
                  </span>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={() => handleTogglePublish(property.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron propiedades</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 Las propiedades se sincronizan automáticamente con tu sección de Propiedades. 
          Cualquier cambio que hagas allí se reflejará en tu web.
        </p>
      </div>
    </div>
  );
}

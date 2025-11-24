import { useParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { PropertyPublicView } from '../../components/properties/property-public-view';
import { getPropertyById } from '../../utils/properties-data';

export function PublicPropertyPage() {
  const { id } = useParams();
  const property = id ? getPropertyById(id) : null;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-2">Propiedad no encontrada</h1>
          <p className="text-gray-600">La propiedad que buscas no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PropertyPublicView property={property} />
      <Toaster position="top-right" duration={2000} />
    </>
  );
}

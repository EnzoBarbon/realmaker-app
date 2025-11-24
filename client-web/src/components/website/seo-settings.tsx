import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SEOSettingsProps {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  onSeoChange: (seo: any) => void;
}

export function SEOSettings({ seo, onSeoChange }: SEOSettingsProps) {
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !seo.keywords.includes(keywordInput.trim())) {
      onSeoChange({
        ...seo,
        keywords: [...seo.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onSeoChange({
      ...seo,
      keywords: seo.keywords.filter(k => k !== keyword)
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-gray-900 mb-3 text-xl">Configuración SEO</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Optimiza tu sitio web para motores de búsqueda
        </p>
      </div>

      {/* Título SEO */}
      <div className="space-y-4">
        <Label htmlFor="seo-title" className="text-sm font-semibold">Título de la página</Label>
        <Input
          id="seo-title"
          value={seo.title}
          onChange={(e) => onSeoChange({ ...seo, title: e.target.value })}
          placeholder="Tu inmobiliaria - Las mejores propiedades"
          maxLength={60}
          className="h-14 text-base"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 leading-relaxed">
            Aparece en los resultados de búsqueda de Google
          </p>
          <span className={`text-xs font-semibold ${seo.title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
            {seo.title.length}/60
          </span>
        </div>
      </div>

      {/* Meta Descripción */}
      <div className="space-y-4">
        <Label htmlFor="seo-description" className="text-sm font-semibold">Meta descripción</Label>
        <Textarea
          id="seo-description"
          value={seo.description}
          onChange={(e) => onSeoChange({ ...seo, description: e.target.value })}
          placeholder="Encuentra tu hogar ideal con nuestra amplia selección de propiedades..."
          rows={5}
          maxLength={160}
          className="resize-none text-base"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 leading-relaxed">
            Descripción que aparece debajo del título en Google
          </p>
          <span className={`text-xs font-semibold ${seo.description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
            {seo.description.length}/160
          </span>
        </div>
      </div>

      {/* Palabras clave */}
      <div className="space-y-5">
        <Label htmlFor="seo-keywords" className="text-sm font-semibold">Palabras clave</Label>
        <div className="flex gap-4">
          <Input
            id="seo-keywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Añadir palabra clave..."
            className="h-14 text-base"
          />
          <button
            onClick={handleAddKeyword}
            className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            Añadir
          </button>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Presiona Enter o haz clic en Añadir para agregar palabras clave
        </p>

        {/* Lista de palabras clave */}
        {seo.keywords.length > 0 && (
          <div className="flex flex-wrap gap-3 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
            {seo.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-2.5 pr-2.5 bg-white border-2 border-gray-200 py-2.5 px-4 text-sm"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-5 pt-8 border-t-2 border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700">Vista previa en Google</h4>
        <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-xs text-green-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-medium">https://excellence.realmaker.ai</span>
          </div>
          <div className="text-blue-600 hover:underline cursor-pointer text-xl font-medium">
            {seo.title || 'Título de tu página'}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {seo.description || 'Meta descripción de tu página web para motores de búsqueda...'}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 space-y-4">
        <p className="text-sm text-blue-900 font-semibold">
          💡 Tips para un buen SEO:
        </p>
        <ul className="text-sm text-blue-800 space-y-2.5 ml-5 list-disc leading-relaxed">
          <li>Usa palabras clave relevantes en el título y descripción</li>
          <li>Mantén el título bajo 60 caracteres</li>
          <li>La descripción debe tener entre 150-160 caracteres</li>
          <li>Incluye la ubicación en las palabras clave (ej: "Madrid", "Barcelona")</li>
        </ul>
      </div>
    </div>
  );
}
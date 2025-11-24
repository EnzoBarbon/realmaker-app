import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DesignCustomizerProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const fontOptions = [
  { value: 'inter', label: 'Inter (Moderno)' },
  { value: 'playfair', label: 'Playfair Display (Elegante)' },
  { value: 'roboto', label: 'Roboto (Clásico)' },
  { value: 'montserrat', label: 'Montserrat (Versátil)' },
  { value: 'lora', label: 'Lora (Serif)' }
];

export function DesignCustomizer({ config, onConfigChange }: DesignCustomizerProps) {
  const handleColorChange = (key: string, value: string) => {
    onConfigChange({
      ...config,
      colors: {
        ...config.colors,
        [key]: value
      }
    });
  };

  const handleTypographyChange = (key: string, value: string) => {
    onConfigChange({
      ...config,
      typography: {
        ...config.typography,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-gray-900 mb-3 text-xl">Personalización de diseño</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Ajusta los colores y tipografía de tu sitio web
        </p>
      </div>

      {/* Colores */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-gray-700">Paleta de colores</h4>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="primary-color" className="text-sm font-semibold mb-4 block">Color primario</Label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  id="primary-color"
                  type="text"
                  value={config.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="pr-20 h-14 text-base"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl border-2 border-gray-300 cursor-pointer shadow-md hover:scale-105 transition-transform"
                    style={{ backgroundColor: config.colors.primary }}
                    onClick={() => document.getElementById('primary-color-picker')?.click()}
                  />
                  <input
                    id="primary-color-picker"
                    type="color"
                    value={config.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Color principal de tu marca (botones, enlaces, acentos)
            </p>
          </div>

          <div>
            <Label htmlFor="secondary-color" className="text-sm font-semibold mb-4 block">Color secundario</Label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  id="secondary-color"
                  type="text"
                  value={config.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="pr-20 h-14 text-base"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl border-2 border-gray-300 cursor-pointer shadow-md hover:scale-105 transition-transform"
                    style={{ backgroundColor: config.colors.secondary }}
                    onClick={() => document.getElementById('secondary-color-picker')?.click()}
                  />
                  <input
                    id="secondary-color-picker"
                    type="color"
                    value={config.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Color para textos y elementos secundarios
            </p>
          </div>

          <div>
            <Label htmlFor="accent-color" className="text-sm font-semibold mb-4 block">Color de acento</Label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  id="accent-color"
                  type="text"
                  value={config.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="pr-20 h-14 text-base"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl border-2 border-gray-300 cursor-pointer shadow-md hover:scale-105 transition-transform"
                    style={{ backgroundColor: config.colors.accent }}
                    onClick={() => document.getElementById('accent-color-picker')?.click()}
                  />
                  <input
                    id="accent-color-picker"
                    type="color"
                    value={config.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Color para destacados y llamadas a la acción
            </p>
          </div>
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-6 pt-8 border-t-2 border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700">Tipografía</h4>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="heading-font" className="text-sm font-semibold mb-4 block">Fuente para títulos</Label>
            <Select
              value={config.typography.headingFont}
              onValueChange={(value) => handleTypographyChange('headingFont', value)}
            >
              <SelectTrigger id="heading-font" className="h-14 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Fuente utilizada en títulos y encabezados
            </p>
          </div>

          <div>
            <Label htmlFor="body-font" className="text-sm font-semibold mb-4 block">Fuente para textos</Label>
            <Select
              value={config.typography.bodyFont}
              onValueChange={(value) => handleTypographyChange('bodyFont', value)}
            >
              <SelectTrigger id="body-font" className="h-14 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Fuente utilizada en párrafos y contenido
            </p>
          </div>
        </div>
      </div>

      {/* Preview de estilos */}
      <div className="space-y-5 pt-8 border-t-2 border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700">Vista previa de estilos</h4>
        <div 
          className="p-10 rounded-2xl border-2 space-y-8"
          style={{ borderColor: config.colors.primary + '30' }}
        >
          <div style={{ fontFamily: config.typography.headingFont }}>
            <h2 className="text-3xl" style={{ color: config.colors.secondary }}>
              Título de ejemplo
            </h2>
          </div>
          <div style={{ fontFamily: config.typography.bodyFont }}>
            <p className="text-gray-600 leading-relaxed text-base">
              Este es un ejemplo de cómo se verá el texto en tu sitio web con la configuración actual.
            </p>
          </div>
          <button
            className="px-10 py-4 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105 font-semibold shadow-lg"
            style={{ backgroundColor: config.colors.primary }}
          >
            Botón de ejemplo
          </button>
        </div>
      </div>
    </div>
  );
}
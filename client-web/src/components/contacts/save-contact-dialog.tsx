import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { UserPlus, Phone, X, Plus, MapPin, Home, DollarSign, ShoppingCart, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  conversationData?: {
    intention?: string;
    budget?: string;
    zone?: string;
    propertyType?: string;
  };
}

interface SaveContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  mode?: 'save' | 'saveAndCall';
  onSave?: (data: {
    name: string;
    phone: string;
    email: string;
    tags: string[];
    notes: string;
  }) => void;
  onSaveAndCall?: (data: {
    name: string;
    phone: string;
    email: string;
    tags: string[];
    notes: string;
  }) => void;
  onCallWithoutSaving?: () => void;
  isMobile?: boolean;
}

export function SaveContactDialog({
  open,
  onOpenChange,
  lead,
  mode = 'save',
  onSave,
  onSaveAndCall,
  onCallWithoutSaving,
  isMobile = false
}: SaveContactDialogProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Etiquetas predeterminadas del sistema (no editables)
  const systemTags = [
    'Referido',
    'Alto presupuesto',
    'Urgente',
    'Inversión',
    'Primera vivienda',
    'VIP'
  ];

  // Cargar etiquetas personalizadas del localStorage
  useEffect(() => {
    const savedCustomTags = localStorage.getItem('customContactTags');
    if (savedCustomTags) {
      setCustomTags(JSON.parse(savedCustomTags));
    }
  }, []);

  // Resetear formulario cuando cambia el lead
  useEffect(() => {
    if (lead) {
      setContactName(lead.name || '');
      setContactEmail(lead.email || '');
      setContactNotes('');
      setSelectedTags([]);
      setShowNewTagInput(false);
      setNewTagName('');
    }
  }, [lead]);

  // Obtener etiquetas automáticas de la conversación
  const getAutoTags = (): { label: string; icon: React.ReactNode; color: string }[] => {
    if (!lead?.conversationData) return [];
    
    const tags: { label: string; icon: React.ReactNode; color: string }[] = [];
    const data = lead.conversationData;

    if (data.zone) {
      tags.push({
        label: data.zone,
        icon: <MapPin className="h-3 w-3" />,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      });
    }

    if (data.propertyType) {
      tags.push({
        label: data.propertyType,
        icon: <Home className="h-3 w-3" />,
        color: 'text-green-600 bg-green-50 border-green-200'
      });
    }

    if (data.intention) {
      const intentionLabel = data.intention === 'comprar' ? 'Comprador' : data.intention === 'vender' ? 'Vendedor' : 'Consulta';
      tags.push({
        label: intentionLabel,
        icon: <ShoppingCart className="h-3 w-3" />,
        color: 'text-purple-600 bg-purple-50 border-purple-200'
      });
    }

    if (data.budget) {
      tags.push({
        label: data.budget,
        icon: <DollarSign className="h-3 w-3" />,
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      });
    }

    return tags;
  };

  const handleAddCustomTag = () => {
    if (newTagName.trim() && !customTags.includes(newTagName.trim())) {
      const updatedTags = [...customTags, newTagName.trim()];
      setCustomTags(updatedTags);
      localStorage.setItem('customContactTags', JSON.stringify(updatedTags));
      setNewTagName('');
      setShowNewTagInput(false);
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    const updatedTags = customTags.filter(t => t !== tag);
    setCustomTags(updatedTags);
    localStorage.setItem('customContactTags', JSON.stringify(updatedTags));
    // También removerla de las seleccionadas si estaba
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!contactName.trim()) return;

    const data = {
      name: contactName.trim(),
      phone: lead?.phone || '',
      email: contactEmail.trim(),
      tags: selectedTags,
      notes: contactNotes.trim()
    };

    if (mode === 'saveAndCall' && onSaveAndCall) {
      onSaveAndCall(data);
    } else if (onSave) {
      onSave(data);
    }

    // Reset form
    handleClose();
  };

  const handleClose = () => {
    setContactName('');
    setContactEmail('');
    setContactNotes('');
    setSelectedTags([]);
    setShowNewTagInput(false);
    setNewTagName('');
    onOpenChange(false);
  };

  const autoTags = getAutoTags();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] flex flex-col",
        isMobile && "w-full h-full max-h-full"
      )}>
        <DialogHeader>
          <DialogTitle>Añadir Contacto</DialogTitle>
          <DialogDescription>
            Revisa la información que se guardará en tus contactos
          </DialogDescription>
        </DialogHeader>

        {lead && (
          <div className="flex-1 overflow-y-auto space-y-5 py-2">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                Nombre
              </Label>
              <Input
                id="contact-name"
                placeholder="Nombre del contacto"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                autoFocus
                className="text-base"
              />
              
              {/* Etiquetas automáticas de cualificación */}
              {autoTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {autoTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={cn(
                        "text-xs py-0.5 px-2.5 h-6 flex items-center gap-1.5 font-medium border",
                        tag.color
                      )}
                    >
                      {tag.icon}
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Texto explicativo sobre las etiquetas automáticas */}
              {autoTags.length > 0 && (
                <p className="text-xs text-gray-500 italic">
                  Estas etiquetas se generan automáticamente desde la conversación
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                Teléfono
              </Label>
              <Input
                id="contact-phone"
                value={lead.phone}
                disabled
                className="bg-gray-50 text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Etiquetas personalizadas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Etiquetas
              </Label>
              
              {/* Etiquetas disponibles */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {/* Etiquetas del sistema */}
                {systemTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                      selectedTags.includes(tag)
                        ? "bg-primary text-white border border-primary"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary"
                    )}
                  >
                    {!selectedTags.includes(tag) && <Plus className="h-3 w-3" />}
                    {tag}
                  </button>
                ))}

                {/* Etiquetas personalizadas */}
                {customTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                        selectedTags.includes(tag)
                          ? "bg-primary text-white border border-primary"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary"
                      )}
                    >
                      {!selectedTags.includes(tag) && <Plus className="h-3 w-3" />}
                      {tag}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomTag(tag)}
                      className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                ))}

                {/* Input para nueva etiqueta */}
                {showNewTagInput ? (
                  <div className="inline-flex items-center gap-2">
                    <Input
                      placeholder="Nueva etiqueta..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCustomTag();
                        } else if (e.key === 'Escape') {
                          setShowNewTagInput(false);
                          setNewTagName('');
                        }
                      }}
                      className="h-8 w-32 text-xs"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewTagInput(false);
                        setNewTagName('');
                      }}
                      className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewTagInput(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-primary border-2 border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary transition-all cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Nueva etiqueta
                  </button>
                )}
              </div>

              {/* Área de etiquetas seleccionadas */}
              <div className="min-h-[80px] p-3 border border-gray-300 rounded-lg bg-white">
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className="ml-0.5 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3 text-primary hover:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Las etiquetas seleccionadas aparecerán aquí...</p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="contact-notes" className="text-sm font-medium text-gray-700">
                Notas
              </Label>
              <Textarea
                id="contact-notes"
                placeholder="Añade notas adicionales sobre este contacto..."
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          {mode === 'saveAndCall' ? (
            <>
              <Button
                variant="outline"
                onClick={onCallWithoutSaving}
                className="w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 mr-2" />
                Llamar sin guardar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!contactName.trim()}
                className="w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Guardar y llamar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!contactName.trim()}
                className="w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Guardar contacto
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

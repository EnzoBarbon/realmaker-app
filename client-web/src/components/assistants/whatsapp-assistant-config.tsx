import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MessageCircle, AlertCircle, CheckCircle2, X, ShoppingCart, Home, Zap, Settings2 } from "lucide-react";
import { useState } from "react";

export function WhatsAppAssistantConfig() {
  // Estado de conexión WhatsApp
  const [isConnected, setIsConnected] = useState(true);
  const [businessName, setBusinessName] = useState('RealMaker AI');
  const [businessNumber, setBusinessNumber] = useState('+34 612 345 678');
  const [webhookUrl, setWebhookUrl] = useState('https://api.realmaker.com/webhook');
  
  // Estado para Compradores
  const [buyerInitialMessage, setBuyerInitialMessage] = useState('¡Hola! 👋 Soy el asistente virtual de RealMaker AI. Estoy aquí para ayudarte a encontrar la propiedad perfecta. ¿Qué tipo de propiedad estás buscando?');
  const [buyerFinalMessage, setBuyerFinalMessage] = useState('¡Perfecto! 😊 He registrado toda tu información. Un agente se pondrá en contacto contigo pronto para mostrarte propiedades que se ajusten a tus necesidades. ¡Que tengas un excelente día!');
  const [buyerSelectedFields, setBuyerSelectedFields] = useState<string[]>(['nombre', 'telefono', 'presupuesto', 'zona']);
  const [buyerRequiredFields, setBuyerRequiredFields] = useState<string[]>(['nombre', 'telefono']);
  
  // Estado para Vendedores
  const [sellerInitialMessage, setSellerInitialMessage] = useState('¡Hola! 👋 Soy el asistente virtual de RealMaker AI. Estoy aquí para ayudarte a vender tu propiedad al mejor precio. ¿Qué tipo de propiedad quieres vender?');
  const [sellerFinalMessage, setSellerFinalMessage] = useState('¡Excelente! 😊 Tenemos toda la información de tu propiedad. Un agente especializado se pondrá en contacto contigo para realizar una valoración y empezar el proceso de venta. ¡Que tengas un excelente día!');
  const [sellerSelectedFields, setSellerSelectedFields] = useState<string[]>(['nombre', 'telefono', 'direccion-propiedad', 'tipo-propiedad']);
  const [sellerRequiredFields, setSellerRequiredFields] = useState<string[]>(['nombre', 'telefono']);
  
  // Configuraciones compartidas con toggles
  const [autoGreeting, setAutoGreeting] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [sendConfirmation, setSendConfirmation] = useState(true);
  const [qualifyLead, setQualifyLead] = useState(true);
  const [escalateToAgent, setEscalateToAgent] = useState(false);
  const [savePartialData, setSavePartialData] = useState(true);

  // Campos para COMPRADORES
  const buyerInfoFields = [
    { id: 'nombre', label: 'Nombre completo', emoji: '👤' },
    { id: 'telefono', label: 'Teléfono', emoji: '📱' },
    { id: 'email', label: 'Email', emoji: '📧' },
    { id: 'presupuesto', label: 'Presupuesto disponible', emoji: '💰' },
    { id: 'zona', label: 'Zona de interés', emoji: '📍' },
    { id: 'tipo-propiedad', label: 'Tipo de propiedad', emoji: '🏠' },
    { id: 'habitaciones', label: 'Número de habitaciones', emoji: '🛏️' },
    { id: 'banos', label: 'Número de baños', emoji: '🚿' },
    { id: 'urgencia', label: 'Urgencia de compra', emoji: '⏰' },
    { id: 'motivo', label: 'Motivo de compra', emoji: '💭' },
    { id: 'financiamiento', label: 'Necesita financiamiento', emoji: '🏦' },
    { id: 'visita-disponibilidad', label: 'Disponibilidad para visitas', emoji: '📅' },
  ];

  // Campos para VENDEDORES
  const sellerInfoFields = [
    { id: 'nombre', label: 'Nombre completo', emoji: '👤' },
    { id: 'telefono', label: 'Teléfono', emoji: '📱' },
    { id: 'email', label: 'Email', emoji: '📧' },
    { id: 'direccion-propiedad', label: 'Dirección de la propiedad', emoji: '📍' },
    { id: 'tipo-propiedad', label: 'Tipo de propiedad', emoji: '🏠' },
    { id: 'metros-cuadrados', label: 'Metros cuadrados', emoji: '📐' },
    { id: 'habitaciones', label: 'Número de habitaciones', emoji: '🛏️' },
    { id: 'banos', label: 'Número de baños', emoji: '🚿' },
    { id: 'antiguedad', label: 'Antigüedad de la propiedad', emoji: '📆' },
    { id: 'precio-esperado', label: 'Precio esperado', emoji: '💵' },
    { id: 'motivo-venta', label: 'Motivo de venta', emoji: '💭' },
    { id: 'urgencia-venta', label: 'Urgencia de venta', emoji: '⏰' },
    { id: 'estado-propiedad', label: 'Estado de la propiedad', emoji: '🔧' },
  ];

  const toggleInfoField = (
    fieldId: string, 
    type: 'buyer' | 'seller',
    selectedFields: string[],
    setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>,
    setRequiredFields: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
    // Si se deselecciona, también quitarlo de requeridos
    if (selectedFields.includes(fieldId)) {
      setRequiredFields(prev => prev.filter(id => id !== fieldId));
    }
  };

  const toggleRequiredField = (
    fieldId: string,
    selectedFields: string[],
    requiredFields: string[],
    setRequiredFields: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    // Solo permitir marcar como requerido si está seleccionado
    if (!selectedFields.includes(fieldId)) {
      return;
    }
    setRequiredFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const renderFlowConfig = (
    flowType: 'buyer' | 'seller',
    initialMessage: string,
    setInitialMessage: React.Dispatch<React.SetStateAction<string>>,
    finalMessage: string,
    setFinalMessage: React.Dispatch<React.SetStateAction<string>>,
    infoFields: Array<{ id: string; label: string; emoji: string }>,
    selectedFields: string[],
    setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>,
    requiredFields: string[],
    setRequiredFields: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="space-y-6">
      {/* Mensaje Inicial */}
      <Card>
        <CardHeader>
          <CardTitle>1. Mensaje Inicial</CardTitle>
          <CardDescription>
            Este es el primer mensaje que recibirán tus contactos cuando inicien una conversación como {flowType === 'buyer' ? 'compradores' : 'vendedores'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${flowType}-initial-message`}>Mensaje de Bienvenida</Label>
            <Textarea
              id={`${flowType}-initial-message`}
              placeholder="Ej: ¡Hola! 👋 Bienvenido a..."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Usa un tono amigable y menciona cómo puedes ayudar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información a Recopilar */}
      <Card>
        <CardHeader>
          <CardTitle>2. Información a Recopilar</CardTitle>
          <CardDescription>
            Selecciona qué información quieres que el asistente pregunte a {flowType === 'buyer' ? 'los compradores' : 'los vendedores'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Campos de Información</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Selecciona los campos que el asistente debe preguntar. El asistente formulará las preguntas de manera natural según el flujo de la conversación.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {infoFields.map((field) => {
                const isSelected = selectedFields.includes(field.id);
                const isRequired = requiredFields.includes(field.id);
                
                return (
                  <div key={field.id} className="relative">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInfoField(field.id, flowType, selectedFields, setSelectedFields, setRequiredFields)}
                      className={`h-auto py-2 px-3 ${
                        isSelected 
                          ? 'bg-primary text-white hover:bg-primary/90' 
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <span className="mr-1.5">{field.emoji}</span>
                      {field.label}
                      {isSelected && (
                        <X className="ml-1.5 h-3 w-3" />
                      )}
                    </Button>
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRequiredField(field.id, selectedFields, requiredFields, setRequiredFields);
                        }}
                        className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                          isRequired 
                            ? 'bg-red-500 text-white shadow-md' 
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                        title={isRequired ? "Campo obligatorio - click para quitar" : "Click para marcar como obligatorio"}
                      >
                        {isRequired ? '!' : '?'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <strong>Cómo funciona:</strong> 
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Selecciona los campos que quieres recopilar</li>
                    <li>Haz click en el botón <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-gray-200 text-gray-600 text-xs mx-1">?</span> para marcar un campo como <strong>obligatorio</strong></li>
                    <li>Los campos obligatorios <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs mx-1">!</span> deben ser respondidos para continuar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resumen de campos */}
          {selectedFields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Resumen de Configuración</Label>
                <Badge variant="outline">
                  {selectedFields.length} campo{selectedFields.length !== 1 ? 's' : ''} seleccionado{selectedFields.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Campos Opcionales</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFields
                      .filter(id => !requiredFields.includes(id))
                      .map(fieldId => {
                        const field = infoFields.find(f => f.id === fieldId);
                        return field ? (
                          <Badge key={fieldId} variant="secondary" className="gap-1">
                            <span>{field.emoji}</span>
                            <span className="text-xs">{field.label}</span>
                          </Badge>
                        ) : null;
                      })}
                    {selectedFields.filter(id => !requiredFields.includes(id)).length === 0 && (
                      <p className="text-xs text-muted-foreground">Ninguno</p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700 mb-2">Campos Obligatorios</p>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredFields.map(fieldId => {
                      const field = infoFields.find(f => f.id === fieldId);
                      return field ? (
                        <Badge key={fieldId} variant="destructive" className="gap-1">
                          <span>{field.emoji}</span>
                          <span className="text-xs">{field.label}</span>
                        </Badge>
                      ) : null;
                    })}
                    {requiredFields.length === 0 && (
                      <p className="text-xs text-muted-foreground">Ninguno - El flujo es flexible</p>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {requiredFields.length > 0 
                  ? `El asistente insistirá en obtener ${requiredFields.length} campo${requiredFields.length !== 1 ? 's' : ''} obligatorio${requiredFields.length !== 1 ? 's' : ''} antes de finalizar.`
                  : 'El asistente intentará recopilar toda la información posible, pero no insistirá si el usuario no quiere proporcionar algún dato.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensaje Final */}
      <Card>
        <CardHeader>
          <CardTitle>3. Mensaje Final</CardTitle>
          <CardDescription>
            Mensaje que se enviará cuando el asistente haya completado la recopilación de información
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${flowType}-final-message`}>Mensaje de Cierre</Label>
            <Textarea
              id={`${flowType}-final-message`}
              placeholder="Ej: ¡Perfecto! He registrado toda tu información..."
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Indica próximos pasos o tiempo de respuesta esperado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary flex-shrink-0" />
        <h2 className="flex-1">Configuración del Flujo de WhatsApp</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={isConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
            {isConnected ? '✓ Conectado' : '○ Desconectado'}
          </Badge>
          <Switch checked={isConnected} onCheckedChange={setIsConnected} />
        </div>
      </div>

      {/* Configuración de Conexión WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-green-600" />
            Configuración de WhatsApp Business
          </CardTitle>
          <CardDescription>
            Configura y conecta tu cuenta de WhatsApp Business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Negocio */}
            <div className="space-y-2">
              <Label htmlFor="business-name">Nombre del Negocio</Label>
              <Input
                id="business-name"
                placeholder="Tu Inmobiliaria"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Este nombre aparecerá en las conversaciones
              </p>
            </div>

            {/* Número de WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="business-number">Número de WhatsApp Business</Label>
              <Input
                id="business-number"
                placeholder="+34 612 345 678"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Número asociado a tu cuenta de WhatsApp Business
              </p>
            </div>

            {/* Webhook URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://tu-dominio.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL donde se recibirán los mensajes de WhatsApp
              </p>
            </div>

            {/* Token de Acceso */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="access-token">Token de Acceso de WhatsApp API</Label>
              <Input
                id="access-token"
                type="password"
                placeholder="Tu token de WhatsApp Business API"
                defaultValue="••••••••••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Token de autenticación de WhatsApp Business API
              </p>
            </div>
          </div>

          <Separator />

          {/* Estado de Conexión */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <div>
                <p className="font-medium text-green-900">
                  {isConnected ? 'Conexión Activa' : 'Desconectado'}
                </p>
                <p className="text-sm text-green-700">
                  {isConnected ? 'Tu cuenta de WhatsApp Business está conectada correctamente' : 'Conecta tu cuenta para comenzar'}
                </p>
              </div>
            </div>
            <Badge className={isConnected ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
              {isConnected ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Zap className="h-4 w-4" />
              {isConnected ? 'Reconectar' : 'Conectar WhatsApp'}
            </Button>
            {isConnected && (
              <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <X className="h-4 w-4" />
                Desconectar
              </Button>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 <strong>Guía rápida:</strong> Para conectar WhatsApp Business necesitas tener una cuenta verificada y acceso al API de Meta. Consulta nuestra documentación para más información.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Tipo de Cliente</CardTitle>
          <CardDescription>
            Configura flujos separados para compradores y vendedores. Cada tipo tendrá su propio mensaje inicial, campos a recopilar y mensaje final.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Compradores
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Vendedores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyer" className="mt-6 space-y-6">
              {renderFlowConfig(
                'buyer',
                buyerInitialMessage,
                setBuyerInitialMessage,
                buyerFinalMessage,
                setBuyerFinalMessage,
                buyerInfoFields,
                buyerSelectedFields,
                setBuyerSelectedFields,
                buyerRequiredFields,
                setBuyerRequiredFields
              )}
            </TabsContent>

            <TabsContent value="seller" className="mt-6 space-y-6">
              {renderFlowConfig(
                'seller',
                sellerInitialMessage,
                setSellerInitialMessage,
                sellerFinalMessage,
                setSellerFinalMessage,
                sellerInfoFields,
                sellerSelectedFields,
                setSellerSelectedFields,
                sellerRequiredFields,
                setSellerRequiredFields
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuraciones Adicionales (Compartidas para ambos flujos) */}
      <Card>
        <CardHeader>
          <CardTitle>4. Configuraciones Adicionales</CardTitle>
          <CardDescription>
            Estas configuraciones aplican a ambos flujos (compradores y vendedores)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Saludo automático */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="auto-greeting" className="cursor-pointer">Saludo Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar el mensaje inicial automáticamente cuando un nuevo contacto escriba
                </p>
              </div>
              <Switch 
                id="auto-greeting"
                checked={autoGreeting} 
                onCheckedChange={setAutoGreeting}
              />
            </div>

            {/* Usar emojis */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="use-emojis" className="cursor-pointer">Usar Emojis</Label>
                <p className="text-sm text-muted-foreground">
                  Incluir emojis en las respuestas para hacerlas más amigables
                </p>
              </div>
              <Switch 
                id="use-emojis"
                checked={useEmojis} 
                onCheckedChange={setUseEmojis}
              />
            </div>

            {/* Enviar confirmación */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="send-confirmation" className="cursor-pointer">Enviar Confirmación</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar un resumen de la información recopilada antes del mensaje final
                </p>
              </div>
              <Switch 
                id="send-confirmation"
                checked={sendConfirmation} 
                onCheckedChange={setSendConfirmation}
              />
            </div>

            {/* Calificar lead */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="qualify-lead" className="cursor-pointer">Calificar Contacto Automáticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Asignar prioridad al contacto según presupuesto, urgencia y otros factores
                </p>
              </div>
              <Switch 
                id="qualify-lead"
                checked={qualifyLead} 
                onCheckedChange={setQualifyLead}
              />
            </div>

            {/* Escalar a agente */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="escalate-agent" className="cursor-pointer">Escalar a Agente Humano</Label>
                <p className="text-sm text-muted-foreground">
                  Transferir automáticamente a un agente si el usuario lo solicita o si hay dudas complejas
                </p>
              </div>
              <Switch 
                id="escalate-agent"
                checked={escalateToAgent} 
                onCheckedChange={setEscalateToAgent}
              />
            </div>

            {/* Guardar datos parciales */}
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="save-partial" className="cursor-pointer">Guardar Información Parcial</Label>
                <p className="text-sm text-muted-foreground">
                  Guardar la información aunque el usuario no complete todos los campos obligatorios
                </p>
              </div>
              <Switch 
                id="save-partial"
                checked={savePartialData} 
                onCheckedChange={setSavePartialData}
              />
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Flujo Conversacional Inteligente</p>
                <p className="text-sm text-green-800 mt-1">
                  El asistente detectará automáticamente si el usuario es comprador o vendedor según sus primeras respuestas y aplicará el flujo correspondiente. Las preguntas se formularán de manera natural y adaptada al contexto.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón Guardar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button size="lg" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Phone, Volume2, Clock, Users, Play, Send, Mic, MicOff } from "lucide-react";
import { useState } from "react";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function PhoneAssistantConfig() {
  const [showTestChat, setShowTestChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hola, soy Ana de Inmobiliaria Premium. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        'Perfecto, estaré encantada de ayudarte a encontrar la propiedad ideal. ¿Qué tipo de propiedad estás buscando?',
        'Entiendo. ¿Podrías contarme un poco más sobre tu presupuesto y la zona de tu preferencia?',
        'Excelente. Tengo varias opciones que podrían interesarte. ¿Te gustaría que te envíe más información?',
        'Por supuesto, puedo ayudarte con eso. ¿Cuál sería el mejor horario para ti?',
        'Perfecto. ¿Tienes alguna pregunta específica sobre la propiedad o el proceso de compra?'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Phone className="h-6 w-6 text-primary flex-shrink-0" />
        <h2 className="flex-1">Configuración Asistente de Teléfono</h2>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTestChat(!showTestChat)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {showTestChat ? 'Ocultar Prueba' : 'Probar Prompt'}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Estado:</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {showTestChat && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Simulador de Llamada Telefónica
            </CardTitle>
            <CardDescription>
              Prueba cómo responderá tu asistente durante una llamada real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat Interface */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    🟢 Llamada en curso
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    ⏱️ 02:34
                  </Badge>
                </div>

                <ScrollArea className="h-80 w-full border rounded-lg p-4 bg-white">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className={message.isUser ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'}>
                              {message.isUser ? 'U' : 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`rounded-lg p-3 ${
                            message.isUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Escribe lo que dirías por teléfono..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
                        isListening ? 'text-red-600' : 'text-gray-500'
                      }`}
                      onClick={toggleListening}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Test Controls */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Controles de Prueba</h4>
                
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    🏠 "Estoy buscando una casa"
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    💰 "¿Cuáles son los precios?"
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    🏠 "¿Tienen más propiedades?"
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    ❓ "¿Pueden ayudarme con el financiamiento?"
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    🤝 "Quiero hablar con un agente"
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="font-medium text-sm text-gray-700">Configuración de Prueba</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
                      🔄 Reiniciar
                    </Button>
                    <Button variant="outline" size="sm">
                      📋 Exportar
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-sm text-blue-900 mb-2">💡 Consejos</h5>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Prueba diferentes tipos de consultas</li>
                    <li>• Verifica que el tono sea profesional</li>
                    <li>• Asegúrate de que capture información clave</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración Básica</CardTitle>
            <CardDescription>
              Configuración fundamental del asistente telefónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assistant-name">Nombre del Asistente</Label>
              <Input
                id="assistant-name"
                placeholder="Ej: Ana - Asistente Inmobiliaria"
                defaultValue="Ana"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-number">Número de Teléfono</Label>
              <Input
                id="phone-number"
                placeholder="+1 234 567 8900"
                defaultValue="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-type">Tipo de Voz</Label>
              <Select defaultValue="female">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Femenina - Natural</SelectItem>
                  <SelectItem value="male">Masculina - Natural</SelectItem>
                  <SelectItem value="neutral">Neutral - Profesional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Conversación */}
        <Card>
          <CardHeader>
            <CardTitle>Comportamiento de Conversación</CardTitle>
            <CardDescription>
              Cómo debe actuar tu asistente durante las llamadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="greeting">Saludo Inicial</Label>
              <Textarea
                id="greeting"
                placeholder="Ej: Hola, soy Ana de [Tu Inmobiliaria]. ¿En qué puedo ayudarte hoy?"
                defaultValue="Hola, soy Ana de Inmobiliaria Premium. ¿En qué puedo ayudarte hoy?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol del Asistente</Label>
              <Textarea
                id="role"
                placeholder="Describe el rol y expertise del asistente..."
                defaultValue="Eres una asistente experta en bienes raíces que ayuda a clientes a encontrar propiedades, califica leads y responde preguntas sobre el mercado inmobiliario."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transferir a Humano</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir transferencia a agente humano
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Personalización del Prompt */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personalización del Prompt</CardTitle>
            <CardDescription>
              Ajusta la personalidad y comportamiento específico del asistente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tono de Conversación</Label>
                <Select defaultValue="profesional-amigable">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesional-amigable">Profesional y Amigable</SelectItem>
                    <SelectItem value="formal">Formal y Corporativo</SelectItem>
                    <SelectItem value="casual">Casual y Cercano</SelectItem>
                    <SelectItem value="entusiasta">Entusiasta y Motivador</SelectItem>
                    <SelectItem value="consultivo">Consultivo y Asesor</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Define cómo suena tu asistente al hablar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attitude">Actitud</Label>
                <Select defaultValue="servicial">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servicial">Servicial y Atento</SelectItem>
                    <SelectItem value="proactivo">Proactivo y Propositivo</SelectItem>
                    <SelectItem value="empatico">Empático y Comprensivo</SelectItem>
                    <SelectItem value="directo">Directo y Eficiente</SelectItem>
                    <SelectItem value="consultivo">Consultivo y Educativo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  La actitud general del asistente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication-style">Estilo de Comunicación</Label>
                <Select defaultValue="equilibrado">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muy-directo">Muy Directo - Ir al grano</SelectItem>
                    <SelectItem value="directo">Directo - Pocas preguntas</SelectItem>
                    <SelectItem value="equilibrado">Equilibrado - Balance perfecto</SelectItem>
                    <SelectItem value="conversacional">Conversacional - Más preguntas</SelectItem>
                    <SelectItem value="detallado">Detallado - Explicaciones completas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Qué tan directo o conversacional es
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-objective">Objetivo Principal</Label>
                <Select defaultValue="calificar-lead">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calificar-lead">🎯 Calificar al Lead</SelectItem>
                    <SelectItem value="informar">ℹ️ Informar sobre Propiedades</SelectItem>
                    <SelectItem value="capturar-datos">📝 Capturar Datos del Cliente</SelectItem>
                    <SelectItem value="derivar-agente">👤 Derivar a Agente Humano</SelectItem>
                    <SelectItem value="multiple">🔄 Objetivos Múltiples</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  El objetivo principal de cada llamada
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farewell">Frase de Despedida</Label>
              <Textarea
                id="farewell"
                placeholder="Ej: Ha sido un placer ayudarte. Te enviaré un resumen por WhatsApp. ¡Que tengas un excelente día!"
                defaultValue="Ha sido un placer ayudarte. Te enviaré toda la información por WhatsApp. ¡Que tengas un excelente día!"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Cómo se despide el asistente al finalizar la llamada
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-instructions">Instrucciones Clave</Label>
              <Textarea
                id="key-instructions"
                placeholder="Ej: Siempre preguntar el presupuesto antes de ofrecer propiedades. Enfocarse en las ventajas de la zona..."
                defaultValue="Siempre preguntar el presupuesto y zona de interés. Mencionar que enviamos información detallada por WhatsApp."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Instrucciones específicas que el asistente debe seguir siempre
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones Avanzadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Configuraciones de Llamada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-duration">Duración Máxima (minutos)</Label>
              <Input
                id="max-duration"
                type="number"
                defaultValue="15"
                min="5"
                max="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="silence-timeout">Tiempo de Silencio (segundos)</Label>
              <Input
                id="silence-timeout"
                type="number"
                defaultValue="5"
                min="3"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ring-tones">Número de Tonos antes de Contestar</Label>
              <Input
                id="ring-tones"
                type="number"
                defaultValue="5"
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground">
                El asistente contestará automáticamente después de este número de tonos
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Grabación de Llamadas</Label>
                <p className="text-sm text-muted-foreground">
                  Grabar llamadas para análisis
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Horarios de Operación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios de Operación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Hora de Inicio</Label>
                <Input
                  id="start-time"
                  type="time"
                  defaultValue="09:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Hora de Fin</Label>
                <Input
                  id="end-time"
                  type="time"
                  defaultValue="18:00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Días de la Semana</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Switch defaultChecked={day !== 'Sábado'} />
                    <Label className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" className="w-full sm:w-auto">Cancelar</Button>
        <Button className="w-full sm:w-auto">Guardar Configuración</Button>
      </div>
    </div>
  );
}
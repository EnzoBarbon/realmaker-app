import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Mail, Check, Link as LinkIcon, AlertCircle, Info } from "lucide-react";
import { useState } from "react";

export function EmailAssistantConfig() {
  const [connectedPortals, setConnectedPortals] = useState<{[key: string]: boolean}>({
    'idealista': false,
    'fotocasa': false,
    'pisos': false,
    'habitaclia': false
  });

  const togglePortal = (portalId: string) => {
    setConnectedPortals(prev => ({
      ...prev,
      [portalId]: !prev[portalId]
    }));
  };

  const portals = [
    { id: 'idealista', name: 'Idealista', color: 'bg-yellow-500' },
    { id: 'fotocasa', name: 'Fotocasa', color: 'bg-blue-500' },
    { id: 'pisos', name: 'Pisos.com', color: 'bg-green-500' },
    { id: 'habitaclia', name: 'Habitaclia', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <h2 className="flex-1">Configuración Asistente de Leads de Portales</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ✓ Conectado
          </Badge>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Correo Electrónico */}
        <Card>
          <CardHeader>
            <CardTitle>Correo Electrónico</CardTitle>
            <CardDescription>
              Configura el correo donde recibes los leads de portales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-address">Dirección de correo</Label>
              <Input
                id="email-address"
                type="email"
                placeholder="leads@tuinmobiliaria.com"
                defaultValue="leads@tuinmobiliaria.com"
              />
              <p className="text-xs text-muted-foreground">
                El correo donde recibes leads de los portales inmobiliarios
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-password">Contraseña de aplicación</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="••••••••••••••••"
                defaultValue="••••••••••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Usa una contraseña de aplicación, no tu contraseña principal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imap-server">Servidor IMAP</Label>
              <Input
                id="imap-server"
                placeholder="imap.gmail.com"
                defaultValue="imap.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imap-port">Puerto IMAP</Label>
              <Input
                id="imap-port"
                placeholder="993"
                defaultValue="993"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-900">
                    Para Gmail, usa una contraseña de aplicación. Para otros proveedores, consulta su documentación de IMAP.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portales Conectados */}
        <Card>
          <CardHeader>
            <CardTitle>Portales Inmobiliarios</CardTitle>
            <CardDescription>
              Selecciona los portales desde donde recibes leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {portals.map((portal) => (
              <div 
                key={portal.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${portal.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                    {portal.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{portal.name}</p>
                    {connectedPortals[portal.id] && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Leads detectados automáticamente
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={connectedPortals[portal.id]}
                  onCheckedChange={() => togglePortal(portal.id)}
                />
              </div>
            ))}

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-700 font-medium mb-1">
                    Detección automática de portales
                  </p>
                  <p className="text-xs text-gray-600">
                    El sistema identificará automáticamente de qué portal proviene cada lead basándose en el remitente del correo.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Correo</CardTitle>
          <CardDescription>
            Configura qué correos deben importarse como leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject-filter">Filtrar por asunto (opcional)</Label>
              <Input
                id="subject-filter"
                placeholder="Ej: Nuevo lead, Contacto, Interesado"
                defaultValue="Nuevo lead, Contacto"
              />
              <p className="text-xs text-muted-foreground">
                Solo importar correos con estas palabras en el asunto
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-filter">Filtrar por remitente (opcional)</Label>
              <Input
                id="sender-filter"
                placeholder="Ej: @idealista.com, @fotocasa.es"
                defaultValue="@idealista.com, @fotocasa.es"
              />
              <p className="text-xs text-muted-foreground">
                Solo importar correos de estos dominios
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Sincronización automática</p>
                <p className="text-xs text-blue-700">Los nuevos correos se importan cada 5 minutos</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Información sobre cómo funcionan los leads */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Cómo funciona el Asistente de Leads de Portales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Recepción automática</p>
              <p className="text-xs text-gray-600">Los correos de portales llegan a tu bandeja de entrada configurada</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Detección inteligente</p>
              <p className="text-xs text-gray-600">El sistema identifica de qué portal proviene y extrae los datos del cliente</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Aparece en conversaciones</p>
              <p className="text-xs text-gray-600">El lead se muestra en tu panel de conversaciones con toda la información extraída</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              4
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Sin respuesta automática</p>
              <p className="text-xs text-gray-600">Este asistente NO responde automáticamente, solo organiza los leads para que tú les des seguimiento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

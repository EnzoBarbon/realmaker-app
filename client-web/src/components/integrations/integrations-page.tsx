import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { 
  Check, 
  Info,
  Users,
  Building2,
  ArrowLeft,
  Contact,
  LinkIcon,
  Building
} from "lucide-react";
import { ConnectCrmPortalDialog } from "./connect-crm-portal-dialog";

interface IntegrationsPageProps {
  onBackToSettings?: () => void;
}

export function IntegrationsPage({ onBackToSettings }: IntegrationsPageProps) {
  const [otherCrmName, setOtherCrmName] = useState('');
  const [otherCrmConnected, setOtherCrmConnected] = useState(false);
  const [showCrmDialog, setShowCrmDialog] = useState(false);
  
  // Portal states (Idealista y Fotocasa)
  const [connectedPortals, setConnectedPortals] = useState<{[key: string]: boolean}>({
    'idealista': false,
    'fotocasa': false
  });
  const [portalUrls, setPortalUrls] = useState<{[key: string]: string}>({
    'idealista': '',
    'fotocasa': ''
  });
  const [portalProfileNames, setPortalProfileNames] = useState<{[key: string]: string}>({
    'idealista': '',
    'fotocasa': ''
  });

  // Google & iCloud states
  const [googleContactsConnected, setGoogleContactsConnected] = useState(false);
  const [iCloudContactsConnected, setICloudContactsConnected] = useState(false);

  // Inmovilla state
  const [inmovillaConnected, setInmovillaConnected] = useState(false);

  const handleCrmClick = () => {
    setShowCrmDialog(true);
  };

  const handleCloseCrmDialog = () => {
    setShowCrmDialog(false);
  };

  const handleSaveOtherCrmName = (name: string) => {
    setOtherCrmName(name);
    setOtherCrmConnected(true);
  };

  const handleDisconnectOtherCrm = () => {
    setOtherCrmConnected(false);
    setOtherCrmName('');
    setConnectedPortals({ idealista: false, fotocasa: false });
    setPortalUrls({ idealista: '', fotocasa: '' });
    setPortalProfileNames({ idealista: '', fotocasa: '' });
  };

  const handleDisconnectInmovilla = () => {
    setInmovillaConnected(false);
  };

  const togglePortal = (portalId: string) => {
    if (!connectedPortals[portalId]) {
      // Conectar
      const url = portalUrls[portalId];
      const profileName = url.split('/').pop() || `Perfil de ${portalId}`;
      setPortalProfileNames(prev => ({ ...prev, [portalId]: profileName }));
      setConnectedPortals(prev => ({ ...prev, [portalId]: true }));
    } else {
      // Desconectar
      setConnectedPortals(prev => ({ ...prev, [portalId]: false }));
      setPortalUrls(prev => ({ ...prev, [portalId]: '' }));
      setPortalProfileNames(prev => ({ ...prev, [portalId]: '' }));
    }
  };

  const handlePortalUrlChange = (portalId: string, url: string) => {
    setPortalUrls(prev => ({ ...prev, [portalId]: url }));
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      {onBackToSettings && (
        <button
          onClick={onBackToSettings}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver a Más secciones</span>
        </button>
      )}

      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Conexiones</h1>
        <p className="text-gray-600 mt-1">
          Conecta tu sistema de gestión para sincronizar propiedades
        </p>
      </div>

      <div className="max-w-6xl">
        {/* Grid de 2 columnas para CRM y Portales */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          {/* Tarjeta Sistema CRM */}
          <Card className={`border-2 transition-all ${
            (inmovillaConnected || otherCrmConnected)
              ? 'border-green-300 bg-green-50/30 shadow-sm'
              : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sistema CRM</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gestión de clientes y propiedades
                  </p>
                </div>
              </div>
              
              {!(inmovillaConnected || otherCrmConnected) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900">
                      Conecta tu CRM para sincronizar automáticamente clientes y propiedades
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              {(inmovillaConnected || otherCrmConnected) ? (
                <> 
                {/* CRM Conectado */}
                <div className="space-y-3">
                  <div className="bg-white border-2 border-green-200 rounded-xl p-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center text-xl">
                          {inmovillaConnected ? '🏢' : '⚙️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-semibold text-sm">
                              {inmovillaConnected ? 'Inmovilla CRM' : otherCrmName || 'Otro CRM'}
                            </h5>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {inmovillaConnected 
                              ? 'Sincronizando propiedades automáticamente'
                              : 'Gestión integrada de tu CRM'}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={inmovillaConnected ? handleDisconnectInmovilla : handleDisconnectOtherCrm}
                        className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                </div>
                </>
              ) : (
                <>
                {/* CRM No Conectado */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Conecta tu CRM para gestionar clientes y propiedades desde un solo lugar
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Sincronización automática</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Gestión centralizada de clientes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Actualización en tiempo real</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleCrmClick}
                    className="w-full bg-primary hover:bg-primary/90 h-10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Conectar mi CRM
                  </Button>
                </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta Portales Inmobiliarios */}
          <Card className={`border-2 transition-all ${
            (connectedPortals.idealista || connectedPortals.fotocasa)
              ? 'border-green-300 bg-green-50/30 shadow-sm'
              : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Portales Inmobiliarios</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Importa desde Idealista o Fotocasa
                  </p>
                </div>
              </div>
              
              {!(connectedPortals.idealista || connectedPortals.fotocasa) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900">
                      <strong>¿No tienes CRM?</strong> Conecta tus portales para importar propiedades directamente
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              {(connectedPortals.idealista || connectedPortals.fotocasa) ? (
                <>
                {/* Portales Conectados */}
                <div className="space-y-2">
                  {connectedPortals.idealista && (
                    <div className="bg-white border-2 border-green-200 rounded-xl p-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#defa45] flex items-center justify-center shadow-sm">
                            <span className="text-sm text-gray-900 font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>id</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-semibold text-sm">Idealista</h5>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Conectado
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {portalProfileNames.idealista || 'Portal conectado'}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePortal('idealista')}
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {connectedPortals.fotocasa && (
                    <div className="bg-white border-2 border-green-200 rounded-xl p-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1e48bc] flex items-center justify-center shadow-sm">
                            <span className="text-sm text-white font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>fc</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-semibold text-sm">Fotocasa</h5>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Conectado
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {portalProfileNames.fotocasa || 'Portal conectado'}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePortal('fotocasa')}
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                {/* Portales No Conectados */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Importa las propiedades publicadas en tus portales inmobiliarios
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Sin instalación de software</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Ideal si no usas CRM</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Compatible con Idealista y Fotocasa</span>
                    </div>
                  </div>

                  {/* Botones de portales */}
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Simulamos conectar Idealista con una URL de ejemplo
                        setPortalUrls(prev => ({ ...prev, idealista: 'https://idealista.com/usuario/ejemplo' }));
                        togglePortal('idealista');
                      }}
                      className="w-full h-12 justify-start gap-3 bg-white hover:bg-gray-50 border-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#defa45] flex items-center justify-center shadow-sm">
                        <span className="text-xs text-gray-900 font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>id</span>
                      </div>
                      <span className="font-medium">Idealista</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Simulamos conectar Fotocasa con una URL de ejemplo
                        setPortalUrls(prev => ({ ...prev, fotocasa: 'https://fotocasa.es/usuario/ejemplo' }));
                        togglePortal('fotocasa');
                      }}
                      className="w-full h-12 justify-start gap-3 bg-white hover:bg-gray-50 border-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1e48bc] flex items-center justify-center shadow-sm">
                        <span className="text-xs text-white font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>fc</span>
                      </div>
                      <span className="font-medium">Fotocasa</span>
                    </Button>
                  </div>
                </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sección de Contactos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactos</h3>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Google Contacts */}
            <Card className={`border-2 transition-all ${
              googleContactsConnected
                ? 'border-green-300 bg-green-50/30 shadow-sm'
                : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Contact className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Google Contacts</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sincroniza contactos de Google
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {googleContactsConnected ? (
                  <div className="space-y-3">
                    <div className="bg-white border-2 border-green-200 rounded-xl p-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs mb-2">
                              <Check className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Sincronización automática activa
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setGoogleContactsConnected(false)}
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Sincroniza automáticamente tus contactos de Google para tener toda tu agenda en un solo lugar
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Sincronización automática</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Importación de contactos</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Actualización en tiempo real</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setGoogleContactsConnected(true)}
                      className="w-full bg-primary hover:bg-primary/90 h-10"
                    >
                      Conectar ahora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* iCloud Contacts */}
            <Card className={`border-2 transition-all ${
              iCloudContactsConnected
                ? 'border-green-300 bg-green-50/30 shadow-sm'
                : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                    <Contact className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">iCloud Contacts</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sincroniza contactos de iCloud
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {iCloudContactsConnected ? (
                  <div className="space-y-3">
                    <div className="bg-white border-2 border-green-200 rounded-xl p-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs mb-2">
                              <Check className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Sincronización automática activa
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setICloudContactsConnected(false)}
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Sincroniza automáticamente tus contactos de iCloud para tener toda tu agenda en un solo lugar
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Sincronización automática</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Importación de contactos</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Actualización en tiempo real</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setICloudContactsConnected(true)}
                      className="w-full bg-primary hover:bg-primary/90 h-10"
                    >
                      Conectar ahora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info box sobre diferencias */}
        <Card className="border-2 border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-gray-600" />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">¿Cuál es la diferencia?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong className="text-gray-900">CRM:</strong> Si ya usas un sistema de gestión de clientes, conéctalo para tener toda tu información centralizada.
                  </p>
                  <p>
                    <strong className="text-gray-900">Portales inmobiliarios:</strong> Si no usas CRM o quieres importar propiedades directamente desde tus anuncios publicados en Idealista o Fotocasa.
                  </p>
                  <p>
                    <strong className="text-gray-900">Contactos:</strong> Sincroniza tus contactos de Google o iCloud para tener acceso a toda tu agenda desde la plataforma.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para CRM */}
      <ConnectCrmPortalDialog 
        open={showCrmDialog}
        onOpenChange={setShowCrmDialog}
        mode="crm"
        crmName={otherCrmName || 'CRM'}
        onSaveName={handleSaveOtherCrmName}
      />
    </div>
  );
}
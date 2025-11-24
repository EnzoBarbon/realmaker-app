import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Switch } from "../ui/switch";
import { toast } from "sonner@2.0.3";
import { defaultRoles, type Question, type Role } from "../../utils/roles-config";
import { ConnectedChannels } from "./connected-channels";
import { 
  ArrowLeft, 
  Settings2, 
  Play, 
  Briefcase, 
  Smile, 
  Coffee, 
  Heart,
  Home,
  DollarSign,
  Key,
  Building2,
  HelpCircle,
  ChevronLeft,
  Trash2,
  Plus,
  X,
  Check,
  Lock,
  Edit,
  MessageCircle,
  Send,
  Bot,
  TrendingUp,
  BarChart3,
  Share2,
  Users,
  Sparkles,
  Info
} from "lucide-react";

interface AssistantsConfigProps {
  sidebarCollapsed?: boolean;
  isMobile?: boolean;
  onBackToSettings?: () => void;
}

export function AssistantsConfig({ sidebarCollapsed = false, isMobile: isMobileProp, onBackToSettings }: AssistantsConfigProps = {}) {
  const [welcomeMessage, setWelcomeMessage] = useState(
    `¡Hola! 👋\\nGracias por contactarme.\\nCuéntame brevemente qué estás buscando y vemos cómo puedo ayudarte.`
  );
  const [finalMessage, setFinalMessage] = useState(
    `Gracias por tu tiempo, con los datos que nos ha facilitado uno de nuestros agentes se pondrá en contacto lo antes posible. 🏡✨\\n\\nAquí podrá ver nuestro catálogo completo de propiedades:\\n🌐 www.tuinmobiliaria.com\\n\\n📱 Síguenos en Instagram\\nhttps://www.instagram.com/tuinmobiliaria\\n\\n🎵 Síguenos en TikTok\\nhttps://www.tiktok.com/@tuinmobiliaria`
  );
  const [conversationTone, setConversationTone] = useState("amigable");
  const [showPropertyStats, setShowPropertyStats] = useState(() => {
    const saved = localStorage.getItem('assistant_show_property_stats');
    return saved !== null ? saved === 'true' : true; // Por defecto activado
  });
  
  // Valores originales para detectar cambios y cancelar
  const [originalConfig, setOriginalConfig] = useState({
    welcomeMessage: `¡Hola! 👋\\\\nGracias por contactarme.\\\\nCuéntame brevemente qué estás buscando y vemos cómo puedo ayudarte.`,
    finalMessage: `Gracias por tu tiempo, con los datos que nos ha facilitado uno de nuestros agentes se pondrá en contacto lo antes posible. 🏡✨\\\\n\\\\nAquí podrá ver nuestro catálogo completo de propiedades:\\\\n🌐 www.tuinmobiliaria.com\\\\n\\\\n📱 Síguenos en Instagram\\\\nhttps://www.instagram.com/tuinmobiliaria\\\\n\\\\n🎵 Síguenos en TikTok\\\\nhttps://www.tiktok.com/@tuinmobiliaria`,
    conversationTone: "amigable",
    showPropertyStats: localStorage.getItem('assistant_show_property_stats') !== null ? localStorage.getItem('assistant_show_property_stats') === 'true' : true
  });
  
  // Estado para detectar cambios
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [roles, setRoles] = useState<Role[]>(defaultRoles);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingQuestionsForRole, setEditingQuestionsForRole] = useState<Role | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Detección de móvil - usar prop si está disponible, sino detectar
  const [isMobileState, setIsMobileState] = useState(window.innerWidth < 768);
  const isMobile = isMobileProp !== undefined ? isMobileProp : isMobileState;

  useEffect(() => {
    if (isMobileProp === undefined) {
      const checkMobile = () => {
        setIsMobileState(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isMobileProp]);

  // Detectar cambios no guardados
  useEffect(() => {
    const hasChanges = 
      welcomeMessage !== originalConfig.welcomeMessage ||
      finalMessage !== originalConfig.finalMessage ||
      conversationTone !== originalConfig.conversationTone ||
      showPropertyStats !== originalConfig.showPropertyStats;
    
    setHasUnsavedChanges(hasChanges);
  }, [welcomeMessage, finalMessage, conversationTone, showPropertyStats, originalConfig]);

  // Estados para probar el flujo
  const [isTestFlowOpen, setIsTestFlowOpen] = useState(false);
  const [testMessages, setTestMessages] = useState<Array<{ type: 'bot' | 'user', text: string, options?: string[] }>>([]);
  const [testCurrentStep, setTestCurrentStep] = useState<'welcome' | 'role-selection' | 'questions' | 'complete'>('welcome');
  const [testSelectedRole, setTestSelectedRole] = useState<Role | null>(null);
  const [testCurrentQuestionIndex, setTestCurrentQuestionIndex] = useState(0);
  const [testUserInput, setTestUserInput] = useState('');

  // Función para guardar cambios
  const handleSaveConfiguration = () => {
    // Aquí iría la lógica para guardar en el backend
    setOriginalConfig({
      welcomeMessage,
      finalMessage,
      conversationTone,
      showPropertyStats
    });
    setHasUnsavedChanges(false);
    toast.success("Configuración guardada correctamente");
  };

  // Función para cancelar cambios
  const handleCancelChanges = () => {
    setWelcomeMessage(originalConfig.welcomeMessage);
    setFinalMessage(originalConfig.finalMessage);
    setConversationTone(originalConfig.conversationTone);
    setShowPropertyStats(originalConfig.showPropertyStats);
    setHasUnsavedChanges(false);
  };

  const updateRoleName = (roleId: string, newName: string) => {
    setRoles(roles.map(role => 
      role.id === roleId ? { ...role, name: newName } : role
    ));
  };

  const toggleQuestion = (roleId: string, questionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.map(q => 
            q.id === questionId ? { ...q, enabled: !q.enabled } : q
          )
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const addQuestion = (roleId: string) => {
    const newQuestionId = `q${Date.now()}`;
    
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: [
            ...role.questions,
            {
              id: newQuestionId,
              text: '',
              type: 'text' as const,
              enabled: true,
              category: 'Personalizada'
            }
          ]
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
    
    // Activar modo edición para la nueva pregunta
    setEditingQuestionId(newQuestionId);
  };

  const removeQuestion = (roleId: string, questionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.filter(q => q.id !== questionId)
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const updateQuestion = (roleId: string, questionId: string, field: string, value: any) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.map(q => {
            if (q.id === questionId) {
              return { ...q, [field]: value };
            }
            return q;
          })
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const addOption = (roleId: string, questionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                options: [...(q.options || []), '']
              };
            }
            return q;
          })
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const updateOption = (roleId: string, questionId: string, optionIndex: number, value: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.map(q => {
            if (q.id === questionId && q.options) {
              const newOptions = [...q.options];
              newOptions[optionIndex] = value;
              return { ...q, options: newOptions };
            }
            return q;
          })
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const removeOption = (roleId: string, questionId: string, optionIndex: number) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedRole = {
          ...role,
          questions: role.questions.map(q => {
            if (q.id === questionId && q.options) {
              return {
                ...q,
                options: q.options.filter((_, i) => i !== optionIndex)
              };
            }
            return q;
          })
        };
        
        // Actualizar también editingQuestionsForRole si estamos editando este rol
        if (editingQuestionsForRole?.id === roleId) {
          setEditingQuestionsForRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  // Funciones para el flujo de prueba
  const startTestFlow = () => {
    setIsTestFlowOpen(true);
    setTestMessages([]);
    setTestCurrentStep('welcome');
    setTestSelectedRole(null);
    setTestCurrentQuestionIndex(0);
    setTestUserInput('');

    // Mostrar mensaje de bienvenida
    setTimeout(() => {
      setTestMessages([
        { type: 'bot', text: welcomeMessage }
      ]);

      // Mostrar pregunta de selección de rol con opciones
      setTimeout(() => {
        const roleOptions = roles.map(r => r.name);
        setTestMessages(prev => [
          ...prev,
          { type: 'bot', text: '¿Qué te trae por aquí hoy?', options: roleOptions }
        ]);
        setTestCurrentStep('role-selection');
      }, 800);
    }, 500);
  };

  const handleTestUserMessage = () => {
    if (!testUserInput.trim()) return;

    const userMessage = testUserInput.trim();
    setTestMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setTestUserInput('');

    if (testCurrentStep === 'role-selection') {
      // Usuario selecciona rol por número o por texto
      let selectedRole: Role | undefined;
      
      // Intentar buscar por número primero
      const roleIndex = parseInt(userMessage) - 1;
      if (roleIndex >= 0 && roleIndex < roles.length) {
        selectedRole = roles[roleIndex];
      } else {
        // Buscar por texto (nombre del rol)
        selectedRole = roles.find(r => r.name.toLowerCase() === userMessage.toLowerCase());
      }

      if (selectedRole) {
        setTestSelectedRole(selectedRole);
        setTestCurrentQuestionIndex(0);

        // Confirmar selección
        setTimeout(() => {
          setTestMessages(prev => [
            ...prev,
            { type: 'bot', text: `Perfecto, veo que ${selectedRole.name.toLowerCase()}. Voy a hacerte algunas preguntas para ayudarte mejor. ✅` }
          ]);

          // Hacer primera pregunta
          setTimeout(() => {
            if (selectedRole.questions.length > 0) {
              const firstQuestion = selectedRole.questions[0];
              setTestMessages(prev => [
                ...prev,
                { 
                  type: 'bot', 
                  text: firstQuestion.text,
                  options: firstQuestion.type === 'options' ? firstQuestion.options : undefined
                }
              ]);
              setTestCurrentStep('questions');
            } else {
              setTestMessages(prev => [
                ...prev,
                { type: 'bot', text: finalMessage }
              ]);
              setTestCurrentStep('complete');
            }
          }, 800);
        }, 600);
      } else {
        // Opción inválida
        setTimeout(() => {
          setTestMessages(prev => [
            ...prev,
            { type: 'bot', text: 'Por favor, selecciona una de las opciones mostradas.' }
          ]);
        }, 500);
      }
    } else if (testCurrentStep === 'questions' && testSelectedRole) {
      // Usuario responde pregunta actual
      const currentQuestion = testSelectedRole.questions[testCurrentQuestionIndex];
      
      if (currentQuestion.type === 'options') {
        // Validar que sea un número válido o el texto de la opción
        const optionIndex = parseInt(userMessage) - 1;
        const isValidNumber = optionIndex >= 0 && optionIndex < (currentQuestion.options?.length || 0);
        const isValidText = currentQuestion.options?.some(opt => opt.toLowerCase() === userMessage.toLowerCase());
        
        if (!isValidNumber && !isValidText) {
          setTimeout(() => {
            setTestMessages(prev => [
              ...prev,
              { type: 'bot', text: 'Por favor, selecciona una de las opciones mostradas.' }
            ]);
          }, 500);
          return;
        }
      }

      // Confirmar respuesta
      setTimeout(() => {
        setTestMessages(prev => [
          ...prev,
          { type: 'bot', text: 'Entendido. ✅' }
        ]);

        // Pasar a siguiente pregunta o finalizar
        const nextQuestionIndex = testCurrentQuestionIndex + 1;
        if (nextQuestionIndex < testSelectedRole.questions.length) {
          setTestCurrentQuestionIndex(nextQuestionIndex);
          const nextQuestion = testSelectedRole.questions[nextQuestionIndex];
          
          setTimeout(() => {
            setTestMessages(prev => [
              ...prev,
              { 
                type: 'bot', 
                text: nextQuestion.text,
                options: nextQuestion.type === 'options' ? nextQuestion.options : undefined
              }
            ]);
          }, 800);
        } else {
          // Completar flujo
          setTimeout(() => {
            setTestMessages(prev => [
              ...prev,
              { type: 'bot', text: finalMessage }
            ]);
            setTestCurrentStep('complete');
          }, 800);
        }
      }, 600);
    }
  };

  return (
    <>
    <div className="space-y-6 pb-24">
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Settings2 className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h2>Configuración del Asistente</h2>
            <p className="text-sm text-gray-600 mt-1">
              Personaliza el flujo de conversación y las preguntas de cualificación
            </p>
          </div>
        </div>
        <Button
          onClick={startTestFlow}
          className="bg-primary hover:bg-primary/90 gap-2"
          size="sm"
        >
          <Play className="h-4 w-4" />
          Probar flujo
        </Button>
      </div>

      {/* Canales Conectados */}
      <ConnectedChannels />

      {/* Mensaje de Bienvenida */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Mensajes</CardTitle>
          <CardDescription>
            Personaliza los mensajes y el tono de conversación del asistente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mensaje de Bienvenida */}
          <div className="space-y-2">
            <Label htmlFor="welcome">Mensaje de bienvenida</Label>
            <Textarea
              id="welcome"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              placeholder="Escribe el mensaje de bienvenida..."
            />
            <p className="text-xs text-gray-500">
              Este será el primer mensaje que recibirán los usuarios al iniciar la conversación
            </p>
          </div>

          {/* Mensaje Final */}
          <div className="space-y-2">
            <Label htmlFor="final-message">Mensaje final</Label>
            <Textarea
              id="final-message"
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              rows={3}
              placeholder="Escribe el mensaje final..."
            />
            <p className="text-xs text-gray-500">
              Este mensaje se enviará después de completar el flujo de preguntas
            </p>
          </div>

          {/* Tono de Conversación */}
          <div className="space-y-2">
            <Label>Tono de conversación</Label>
            <div className="overflow-x-auto -mx-4 px-4 hide-scrollbar">
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => setConversationTone('profesional')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    conversationTone === 'profesional'
                      ? 'bg-[#e7af2a] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Briefcase className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Profesional</span>
                </button>
                <button
                  onClick={() => setConversationTone('amigable')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    conversationTone === 'amigable'
                      ? 'bg-[#e7af2a] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Smile className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Amigable</span>
                </button>
                <button
                  onClick={() => setConversationTone('casual')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    conversationTone === 'casual'
                      ? 'bg-[#e7af2a] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Coffee className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Casual</span>
                </button>
                <button
                  onClick={() => setConversationTone('empatico')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    conversationTone === 'empatico'
                      ? 'bg-[#e7af2a] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Empático</span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Vista previa del tono:</strong> {
                conversationTone === 'profesional' ? 'El asistente utilizará un lenguaje formal y estructurado, ideal para clientes corporativos e inversores.' :
                conversationTone === 'amigable' ? 'El asistente será cercano y accesible, manteniendo profesionalismo. Ideal para la mayoría de clientes.' :
                conversationTone === 'casual' ? 'El asistente usará un lenguaje relajado y conversacional, como hablar con un amigo.' :
                'El asistente mostrará comprensión y empatía, ideal para clientes que necesitan orientación.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Estadísticas de Propiedades */}
      <Card className="border-2 border-gray-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base lg:text-lg">Estadísticas de Propiedades</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Controla qué información adicional comparte el asistente
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs lg:text-sm font-medium ${
                showPropertyStats ? 'text-primary' : 'text-gray-500'
              }`}>
                {showPropertyStats ? 'Activado' : 'Desactivado'}
              </span>
              <Switch
                checked={showPropertyStats}
                onCheckedChange={(checked) => {
                  setShowPropertyStats(checked);
                  localStorage.setItem('assistant_show_property_stats', String(checked));
                }}
                className="scale-110"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 space-y-5">
          {/* Vista previa visual con grid */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              {showPropertyStats ? '✅ El asistente compartirá:' : '❌ El asistente NO compartirá:'}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                showPropertyStats 
                  ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  showPropertyStats ? 'bg-primary/20' : 'bg-gray-200'
                }`}>
                  <Users className={`h-5 w-5 ${
                    showPropertyStats ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Interesados
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  Cuántas personas están preguntando
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                showPropertyStats 
                  ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  showPropertyStats ? 'bg-primary/20' : 'bg-gray-200'
                }`}>
                  <TrendingUp className={`h-5 w-5 ${
                    showPropertyStats ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Cualificación
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  Nivel de interés promedio
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                showPropertyStats 
                  ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  showPropertyStats ? 'bg-primary/20' : 'bg-gray-200'
                }`}>
                  <Share2 className={`h-5 w-5 ${
                    showPropertyStats ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  RRSS
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  Publicaciones en redes
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                showPropertyStats 
                  ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  showPropertyStats ? 'bg-primary/20' : 'bg-gray-200'
                }`}>
                  <MessageCircle className={`h-5 w-5 ${
                    showPropertyStats ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Canales
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  Vías de contacto usadas
                </p>
              </div>
            </div>
          </div>

          {/* Beneficio/Estado actual */}
          <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
            showPropertyStats 
              ? 'bg-gradient-to-br from-amber-50 to-amber-50/50 border-amber-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              showPropertyStats ? 'bg-amber-100' : 'bg-gray-200'
            }`}>
              <Sparkles className={`h-5 w-5 ${
                showPropertyStats ? 'text-amber-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold mb-1 ${
                showPropertyStats ? 'text-amber-900' : 'text-gray-700'
              }`}>
                {showPropertyStats ? 'Modo FOMO activado 🔥' : 'Modo básico'}
              </p>
              <p className={`text-sm leading-relaxed ${
                showPropertyStats ? 'text-amber-800' : 'text-gray-600'
              }`}>
                {showPropertyStats 
                  ? 'El asistente creará sensación de urgencia mostrando cuántas personas están interesadas, generando más demanda y acelerando las decisiones de compra.'
                  : 'El asistente compartirá solo la información básica de cada propiedad (precio, ubicación, características) sin datos de interés.'
                }
              </p>
            </div>
          </div>

          {/* Ejemplo visual */}
          {showPropertyStats && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-3">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-blue-900">Ejemplo de mensaje del asistente:</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-700 leading-relaxed">
                  "Este piso tiene mucha demanda. <strong className="text-primary">12 personas</strong> están muy interesadas. Si te interesa, te recomiendo que lo veas pronto porque hay bastante interés 😊"
                </p>
              </div>
            </div>
          )}

          {/* Nota informativa */}
          <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Importante:</strong> Esta configuración solo afecta a los mensajes automáticos del asistente. 
              Tú siempre podrás compartir fichas manualmente con o sin estadísticas desde la app.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Roles y Flujos de Cualificación</CardTitle>
          <CardDescription>
            Define las preguntas específicas para cada tipo de cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <Card key={role.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={`${role.color} text-sm px-3 py-1.5 gap-1 text-[#080808]`}>
                      {role.id === 'buyer' && <Home className="h-3.5 w-3.5 text-[#080808]" />}
                      {role.id === 'seller' && <DollarSign className="h-3.5 w-3.5 text-[#080808]" />}
                      {role.id === 'renter' && <Key className="h-3.5 w-3.5 text-[#080808]" />}
                      {role.id === 'landlord' && <Building2 className="h-3.5 w-3.5 text-[#080808]" />}
                      {!['buyer', 'seller', 'renter', 'landlord'].includes(role.id) && <HelpCircle className="h-3.5 w-3.5 text-[#080808]" />}
                      {role.name}
                    </Badge>

                    {!isMobile && (
                      <div className="flex-1 text-sm text-gray-600">
                        {role.questions.length} {role.questions.length === 1 ? 'pregunta configurada' : 'preguntas configuradas'}
                      </div>
                    )}

                    {isMobile && <div className="flex-1" />}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuestionsForRole(role)}
                        className={isMobile ? "h-8 w-8 p-0" : "gap-2"}
                      >
                        <Settings2 className="h-4 w-4" />
                        {!isMobile && "Editar preguntas"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}


          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Consejo:</strong> Estos roles te ayudan a clasificar automáticamente a tus clientes y hacerles las preguntas más relevantes según sus necesidades.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar nombre de rol */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nombre del Rol</DialogTitle>
            <DialogDescription>
              Cambia el nombre de este tipo de cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">Nombre del rol</Label>
              <Input
                id="edit-role-name"
                value={editingRole?.name || ''}
                onChange={(e) => setEditingRole(editingRole ? { ...editingRole, name: e.target.value } : null)}
                placeholder="Nombre del rol"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingRole) {
                    updateRoleName(editingRole.id, editingRole.name);
                    setEditingRole(null);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (editingRole) {
                  updateRoleName(editingRole.id, editingRole.name);
                  setEditingRole(null);
                }
              }}
              disabled={!editingRole?.name.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet lateral para editar preguntas de un rol */}
      <Sheet open={!!editingQuestionsForRole} onOpenChange={(open) => {
        if (!open) {
          setEditingQuestionsForRole(null);
          setEditingQuestionId(null);
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingQuestionsForRole(null);
                  setEditingQuestionId(null);
                }}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <SheetTitle>Editar Preguntas - {editingQuestionsForRole?.name}</SheetTitle>
                <SheetDescription>
                  Define las preguntas que se harán a los clientes de tipo "{editingQuestionsForRole?.name}"
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="space-y-6">
                {editingQuestionsForRole?.questions.map((question, index) => {
                  const isEditing = editingQuestionId === question.id;
                  
                  return (
                    <Card key={question.id} className="border-2">
                      <CardContent className="pt-6 pb-6">
                        {isEditing ? (
                          // Modo edición
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                Editando
                              </Badge>
                              {question.category !== 'Obligatorio' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    removeQuestion(editingQuestionsForRole.id, question.id);
                                    setEditingQuestionId(null);
                                  }}
                                  className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Borrar
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-1.5">
                              <Label className="text-xs">Pregunta</Label>
                              <Input
                                value={question.text}
                                onChange={(e) => updateQuestion(editingQuestionsForRole.id, question.id, 'text', e.target.value)}
                                placeholder="Escribe tu pregunta..."
                                className="text-sm"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs">Tipo de respuesta</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) => {
                                  updateQuestion(editingQuestionsForRole.id, question.id, 'type', value);
                                  if (value === 'options' && !question.options) {
                                    updateQuestion(editingQuestionsForRole.id, question.id, 'options', ['']);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Campo libre</SelectItem>
                                  <SelectItem value="options">Opciones</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {question.type === 'options' && question.options && (
                              <div className="space-y-2">
                                <Label className="text-xs">Opciones de respuesta</Label>
                                {question.options.map((opt, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <Input
                                      value={opt}
                                      onChange={(e) => updateOption(editingQuestionsForRole.id, question.id, idx, e.target.value)}
                                      placeholder={`Opción ${idx + 1}`}
                                      className="text-sm flex-1"
                                    />
                                    {question.options && question.options.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(editingQuestionsForRole.id, question.id, idx)}
                                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(editingQuestionsForRole.id, question.id)}
                                  className="w-full h-8 text-xs gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Añadir opción
                                </Button>
                              </div>
                            )}

                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                if (!question.enabled) {
                                  toggleQuestion(editingQuestionsForRole.id, question.id);
                                }
                                setEditingQuestionId(null);
                              }}
                              className="w-full h-9 gap-1 shadow-sm bg-primary hover:bg-primary/90"
                            >
                              <Check className="h-4 w-4" />
                              Guardar
                            </Button>
                          </div>
                        ) : (
                          // Modo vista
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              {question.category === 'Obligatorio' ? (
                                <div className="flex-shrink-0 w-11 h-6 flex items-center justify-center">
                                  <Bot className="h-5 w-5 text-primary" />
                                </div>
                              ) : (
                                <Switch
                                  checked={question.enabled}
                                  onCheckedChange={() => toggleQuestion(editingQuestionsForRole.id, question.id)}
                                  className="flex-shrink-0"
                                />
                              )}

                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  question.enabled ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                  {question.text || 'Pregunta sin título'}
                                </p>
                                {question.category === 'Obligatorio' && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    El bot detecta este dato automáticamente, no hace falta preguntar
                                  </p>
                                )}
                                {question.type === 'options' && question.options && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {question.options.map((opt, idx) => (
                                      <span key={idx} className={`text-xs px-2 py-1 bg-white border rounded ${
                                        !question.enabled ? 'opacity-50' : ''
                                      }`}>
                                        {opt}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {question.category !== 'Obligatorio' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingQuestionId(question.id);
                                  }}
                                  className="h-8 flex-1 text-xs gap-1"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  Editar
                                </Button>
                              )}
                              {question.category !== 'Obligatorio' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeQuestion(editingQuestionsForRole.id, question.id);
                                  }}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Botón para añadir pregunta */}
                {editingQuestionsForRole && editingQuestionsForRole.questions.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => editingQuestionsForRole && addQuestion(editingQuestionsForRole.id)}
                    className="w-full gap-2 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Añadir nueva pregunta</span>
                  </Button>
                )}

                {editingQuestionsForRole?.questions.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50/50">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">
                      No hay preguntas configuradas para este rol
                    </p>
                    <Button
                      onClick={() => editingQuestionsForRole && addQuestion(editingQuestionsForRole.id)}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                      Añadir primera pregunta
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-white">
            <Button
              onClick={() => {
                setEditingQuestionsForRole(null);
                setEditingQuestionId(null);
              }}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Guardar y Cerrar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog para probar el flujo */}
      <Dialog open={isTestFlowOpen} onOpenChange={setIsTestFlowOpen}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 pb-3 border-b bg-[#075E54] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-white">Simulador de WhatsApp</DialogTitle>
                <DialogDescription className="text-white/80 text-xs">
                  Prueba cómo se verá tu flujo para los usuarios
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]">
            {testMessages.map((message, index) => (
              <div key={index}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-[#DCF8C6]' 
                      : 'bg-white shadow-sm'
                  }`}>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
                
                {/* Mostrar opciones como tabs/botones clickeables */}
                {message.options && message.options.length > 0 && message.type === 'bot' && index === testMessages.length - 1 && testCurrentStep !== 'complete' && (
                  <div className="flex justify-start mt-2">
                    <div className="max-w-[80%] space-y-2">
                      {message.options.map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant="outline"
                          className="w-full justify-start bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary text-left h-auto py-3 px-4"
                          onClick={() => {
                            // Enviar directamente el mensaje sin escribirlo en el input
                            setTestMessages(prev => [...prev, { type: 'user', text: option }]);
                            
                            if (testCurrentStep === 'role-selection') {
                              // Usuario selecciona rol
                              const selectedRole = roles.find(r => r.name === option);
                              
                              if (selectedRole) {
                                setTestSelectedRole(selectedRole);
                                setTestCurrentQuestionIndex(0);

                                // Confirmar selección
                                setTimeout(() => {
                                  setTestMessages(prev => [
                                    ...prev,
                                    { type: 'bot', text: `Perfecto, veo que ${selectedRole.name.toLowerCase()}. Voy a hacerte algunas preguntas para ayudarte mejor. ✅` }
                                  ]);

                                  // Hacer primera pregunta
                                  setTimeout(() => {
                                    if (selectedRole.questions.length > 0) {
                                      const firstQuestion = selectedRole.questions[0];
                                      setTestMessages(prev => [
                                        ...prev,
                                        { 
                                          type: 'bot', 
                                          text: firstQuestion.text,
                                          options: firstQuestion.type === 'options' ? firstQuestion.options : undefined
                                        }
                                      ]);
                                      setTestCurrentStep('questions');
                                    } else {
                                      setTestMessages(prev => [
                                        ...prev,
                                        { type: 'bot', text: finalMessage }
                                      ]);
                                      setTestCurrentStep('complete');
                                    }
                                  }, 800);
                                }, 600);
                              }
                            } else if (testCurrentStep === 'questions' && testSelectedRole) {
                              // Usuario responde pregunta actual
                              const currentQuestion = testSelectedRole.questions[testCurrentQuestionIndex];
                              
                              // Confirmar respuesta
                              setTimeout(() => {
                                setTestMessages(prev => [
                                  ...prev,
                                  { type: 'bot', text: 'Entendido. ✅' }
                                ]);

                                // Pasar a siguiente pregunta o finalizar
                                const nextQuestionIndex = testCurrentQuestionIndex + 1;
                                if (nextQuestionIndex < testSelectedRole.questions.length) {
                                  setTestCurrentQuestionIndex(nextQuestionIndex);
                                  const nextQuestion = testSelectedRole.questions[nextQuestionIndex];
                                  
                                  setTimeout(() => {
                                    setTestMessages(prev => [
                                      ...prev,
                                      { 
                                        type: 'bot', 
                                        text: nextQuestion.text,
                                        options: nextQuestion.type === 'options' ? nextQuestion.options : undefined
                                      }
                                    ]);
                                  }, 800);
                                } else {
                                  // Completar flujo
                                  setTimeout(() => {
                                    setTestMessages(prev => [
                                      ...prev,
                                      { type: 'bot', text: finalMessage }
                                    ]);
                                    setTestCurrentStep('complete');
                                  }, 800);
                                }
                              }, 600);
                            }
                          }}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex-shrink-0 mr-3">
                            {optIndex + 1}
                          </span>
                          <span className="text-sm">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input de usuario */}
          <div className="p-3 border-t bg-white">
            {testCurrentStep === 'complete' ? (
              <div className="text-center">
                <Button
                  onClick={() => setIsTestFlowOpen(false)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Cerrar simulación
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={testUserInput}
                  onChange={(e) => setTestUserInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTestUserMessage();
                    }
                  }}
                  disabled={testCurrentStep === 'welcome'}
                  className="flex-1"
                />
                <Button
                  onClick={handleTestUserMessage}
                  disabled={!testUserInput.trim() || testCurrentStep === 'welcome'}
                  className="bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {/* Footer fijo */}
    <div className={`fixed bottom-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] py-4 z-10 ${isMobile ? 'left-0 pb-24' : sidebarCollapsed ? 'left-16' : 'left-64'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-end gap-3">
        {hasUnsavedChanges && (
          <Button 
            variant="outline"
            onClick={handleCancelChanges}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
        )}
        <Button 
          className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
          disabled={!hasUnsavedChanges}
          onClick={handleSaveConfiguration}
        >
          <span className="sm:hidden">Guardar</span>
          <span className="hidden sm:inline">Guardar Configuración</span>
        </Button>
      </div>
    </div>
    </>
  );
}
import { api } from '@/lib/httpClient';
import { OnboardingChannel, OnboardingPayload } from '@/models/onboarding';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeftIcon,
  BoltIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  SparklesIcon,
  WifiIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

type StepKey = 'business' | 'assistant' | 'messages' | 'sources' | 'review';

const steps: { key: StepKey; title: string; description: string }[] = [
  {
    key: 'business',
    title: 'Tu negocio',
    description: 'Cuéntanos sobre tu agencia para personalizar el asistente',
  },
  {
    key: 'assistant',
    title: 'Asistente',
    description: 'Define el canal principal y la personalidad del asistente',
  },
  {
    key: 'messages',
    title: 'Guiones',
    description: 'Personaliza el mensaje de bienvenida, cierre y preguntas clave',
  },
  {
    key: 'sources',
    title: 'Fuentes',
    description: 'Selecciona de dónde llegan tus leads e integra tus portales/CRM',
  },
  {
    key: 'review',
    title: 'Revisión',
    description: 'Confirma los datos y finaliza la activación',
  },
];

const defaultWelcome =
  '¡Hola! 👋 Soy tu asistente virtual. Cuéntame qué estás buscando y te ayudamos al instante.';
const defaultFarewell =
  '¡Gracias por contactarnos! Guardé tus datos y nuestro equipo te dará seguimiento enseguida.';

const initialPayload: OnboardingPayload = {
  businessName: '',
  businessPhone: '',
  website: '',
  teamSize: '1-3',
  socials: { instagram: '', facebook: '', tiktok: '', youtube: '' },
  communication: { whatsapp: true, email: true, phone: false },
  assistant: {
    channel: 'whatsapp',
    name: 'Ana',
    objective: 'Calificar leads automáticamente y responder dudas frecuentes.',
    welcomeMessage: defaultWelcome,
    farewellMessage: defaultFarewell,
    quickActions: ['datos', 'presupuesto', 'agendar', 'zona'],
  },
  leadSources: {
    portals: ['Idealista', 'Fotocasa'],
    crm: null,
    inboxEmail: '',
  },
  preferences: { showPropertyStats: true, marketingOptIn: true },
};

const quickActionsOptions = [
  { id: 'datos', label: 'Datos de contacto' },
  { id: 'presupuesto', label: 'Presupuesto' },
  { id: 'agendar', label: 'Agendar visita' },
  { id: 'zona', label: 'Zona de interés' },
  { id: 'urgencia', label: 'Urgencia' },
];

const portalOptions = ['Idealista', 'Fotocasa', 'Immobiliare', 'Habitaclia', 'Milanuncios'];
const crmOptions = ['Inmovilla', 'HubSpot', 'Salesforce', 'Otro'];
const teamSizes = ['1-3', '4-10', '11-30', '30+'];

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <View className="mb-3">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        {description ? <Text className="text-sm text-gray-500">{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

type PillProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

function Pill({ active, label, onPress, icon }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 mb-2 flex-row items-center rounded-full border px-3 py-2 ${
        active ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {icon}
      <Text className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function ProgressBar({ stepIndex }: { stepIndex: number }) {
  const percent = ((stepIndex + 1) / steps.length) * 100;
  return (
    <View className="my-4">
      <View className="h-2 rounded-full bg-gray-200">
        <View className="h-2 rounded-full bg-yellow-500" style={{ width: `${percent}%` }} />
      </View>
      <Text className="mt-2 text-xs text-gray-500">
        Paso {stepIndex + 1} de {steps.length}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [payload, setPayload] = useState<OnboardingPayload>(initialPayload);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentStep = steps[stepIndex];

  const toggleQuickAction = (id: string) => {
    setPayload((prev) => {
      const exists = prev.assistant.quickActions.includes(id);
      return {
        ...prev,
        assistant: {
          ...prev.assistant,
          quickActions: exists
            ? prev.assistant.quickActions.filter((q) => q !== id)
            : [...prev.assistant.quickActions, id],
        },
      };
    });
  };

  const togglePortal = (portal: string) => {
    setPayload((prev) => {
      const exists = prev.leadSources.portals.includes(portal);
      return {
        ...prev,
        leadSources: {
          ...prev.leadSources,
          portals: exists
            ? prev.leadSources.portals.filter((p) => p !== portal)
            : [...prev.leadSources.portals, portal],
        },
      };
    });
  };

  const handleChannelSelect = (channel: OnboardingChannel) => {
    setPayload((prev) => ({
      ...prev,
      assistant: { ...prev.assistant, channel },
      communication: {
        ...prev.communication,
        whatsapp: channel === 'whatsapp' ? true : prev.communication.whatsapp,
        email: channel === 'email' ? true : prev.communication.email,
        phone: channel === 'phone' ? true : prev.communication.phone,
      },
    }));
  };

  const setCrm = (crm: string | null) => {
    setPayload((prev) => ({
      ...prev,
      leadSources: { ...prev.leadSources, crm },
    }));
  };

  const validateStep = () => {
    if (stepIndex === 0 && !payload.businessName.trim()) {
      setError('Añade el nombre de tu agencia para continuar.');
      return false;
    }
    if (stepIndex === 1 && !payload.assistant.objective.trim()) {
      setError('Describe brevemente el objetivo del asistente.');
      return false;
    }
    if (stepIndex === steps.length - 1) {
      return true;
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setError('');
    setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  };

  const goBack = () => {
    setError('');
    setStepIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await api.completeOnboarding(payload);
      const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
      router.replace(isMobile ? '/(tabs)/dashboard' : '/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el onboarding.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const reviewBlocks = useMemo(
    () => [
      {
        title: 'Negocio',
        lines: [
          payload.businessName || 'Sin nombre',
          payload.businessPhone ? `Teléfono: ${payload.businessPhone}` : null,
          payload.website ? `Web: ${payload.website}` : null,
          payload.teamSize ? `Equipo: ${payload.teamSize} personas` : null,
        ].filter(Boolean),
      },
      {
        title: 'Asistente',
        lines: [
          `Canal principal: ${payload.assistant.channel}`,
          `Nombre: ${payload.assistant.name}`,
          payload.assistant.objective,
        ].filter(Boolean),
      },
      {
        title: 'Fuentes de leads',
        lines: [
          `Portales: ${payload.leadSources.portals.join(', ') || 'Sin definir'}`,
          payload.leadSources.crm ? `CRM: ${payload.leadSources.crm}` : 'CRM: ninguno',
          payload.leadSources.inboxEmail
            ? `Correo de leads: ${payload.leadSources.inboxEmail}`
            : null,
        ].filter(Boolean),
      },
    ],
    [payload],
  );

  const renderBusinessStep = () => (
    <>
      <SectionCard
        title="Tu agencia"
        description="Esto nos ayuda a personalizar la voz y los mensajes del asistente."
      >
        <View className="space-y-3">
          <TextInput
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
            placeholder="Nombre de tu inmobiliaria"
            value={payload.businessName}
            onChangeText={(text) => setPayload((prev) => ({ ...prev, businessName: text }))}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-600">Teléfono</Text>
              <TextInput
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="+34 600 000 000"
                value={payload.businessPhone ?? ''}
                onChangeText={(text) => setPayload((prev) => ({ ...prev, businessPhone: text }))}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-600">Sitio web</Text>
              <TextInput
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="https://tuinmobiliaria.com"
                value={payload.website ?? ''}
                onChangeText={(text) => setPayload((prev) => ({ ...prev, website: text }))}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text className="mb-2 text-xs font-medium text-gray-600">Redes sociales</Text>
            <View className="flex-row gap-3">
              <TextInput
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="Instagram"
                value={payload.socials.instagram ?? ''}
                onChangeText={(text) =>
                  setPayload((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, instagram: text },
                  }))
                }
                autoCapitalize="none"
              />
              <TextInput
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="Facebook"
                value={payload.socials.facebook ?? ''}
                onChangeText={(text) =>
                  setPayload((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, facebook: text },
                  }))
                }
                autoCapitalize="none"
              />
            </View>
            <View className="mt-3 flex-row gap-3">
              <TextInput
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="TikTok"
                value={payload.socials.tiktok ?? ''}
                onChangeText={(text) =>
                  setPayload((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, tiktok: text },
                  }))
                }
                autoCapitalize="none"
              />
              <TextInput
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="YouTube"
                value={payload.socials.youtube ?? ''}
                onChangeText={(text) =>
                  setPayload((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, youtube: text },
                  }))
                }
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mt-2">
            <Text className="mb-2 text-xs font-medium text-gray-600">Tamaño del equipo</Text>
            <View className="flex-row flex-wrap">
              {teamSizes.map((size) => (
                <Pill
                  key={size}
                  label={`${size} personas`}
                  active={payload.teamSize === size}
                  onPress={() => setPayload((prev) => ({ ...prev, teamSize: size }))}
                />
              ))}
            </View>
          </View>
        </View>
      </SectionCard>
    </>
  );

  const renderAssistantStep = () => (
    <>
      <SectionCard
        title="Selecciona el canal principal"
        description="Replica el flujo del prototipo: WhatsApp, Email o Teléfono."
      >
        <View className="flex-row flex-wrap gap-3">
          {[
            {
              key: 'whatsapp',
              label: 'WhatsApp',
              description: 'Responde 24/7 con el tono de tu marca.',
              icon: <BoltIcon size={20} color="#16a34a" />,
            },
            {
              key: 'email',
              label: 'Email / Portales',
              description: 'Conecta el buzón donde recibes leads.',
              icon: <EnvelopeIcon size={20} color="#2563eb" />,
            },
            {
              key: 'phone',
              label: 'Teléfono',
              description: 'Asistente que atiende y agenda llamadas.',
              icon: <PhoneIcon size={20} color="#f97316" />,
            },
          ].map((option) => (
            <Pressable
              key={option.key}
              onPress={() => handleChannelSelect(option.key as OnboardingChannel)}
              className={`w-full rounded-xl border p-3 ${
                payload.assistant.channel === option.key
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-base font-semibold text-gray-900">{option.label}</Text>
                  <Text className="text-sm text-gray-500">{option.description}</Text>
                </View>
                {option.icon}
              </View>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Personalidad del asistente"
        description="Dale un nombre y objetivo claro. Esto coincide con el flujo de referencia."
      >
        <View className="space-y-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-600">Nombre del asistente</Text>
              <TextInput
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
                placeholder="Ana, Leo, Sofía..."
                value={payload.assistant.name}
                onChangeText={(text) =>
                  setPayload((prev) => ({
                    ...prev,
                    assistant: { ...prev.assistant, name: text },
                  }))
                }
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-600">Canales activos</Text>
              <View className="flex-row items-center">
                <View className="mr-3 flex-row items-center">
                  <Switch
                    value={payload.communication.whatsapp}
                    onValueChange={(value) =>
                      setPayload((prev) => ({
                        ...prev,
                        communication: { ...prev.communication, whatsapp: value },
                      }))
                    }
                  />
                  <Text className="ml-2 text-xs text-gray-600">WhatsApp</Text>
                </View>
                <View className="mr-3 flex-row items-center">
                  <Switch
                    value={payload.communication.email}
                    onValueChange={(value) =>
                      setPayload((prev) => ({
                        ...prev,
                        communication: { ...prev.communication, email: value },
                      }))
                    }
                  />
                  <Text className="ml-2 text-xs text-gray-600">Email</Text>
                </View>
                <View className="flex-row items-center">
                  <Switch
                    value={payload.communication.phone}
                    onValueChange={(value) =>
                      setPayload((prev) => ({
                        ...prev,
                        communication: { ...prev.communication, phone: value },
                      }))
                    }
                  />
                  <Text className="ml-2 text-xs text-gray-600">Teléfono</Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-xs font-medium text-gray-600">Objetivo principal</Text>
            <TextInput
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
              placeholder="Ej: calificar leads de compradores y agendar visitas."
              value={payload.assistant.objective}
              onChangeText={(text) =>
                setPayload((prev) => ({
                  ...prev,
                  assistant: { ...prev.assistant, objective: text },
                }))
              }
              multiline
            />
          </View>
        </View>
      </SectionCard>
    </>
  );

  const renderMessagesStep = () => (
    <>
      <SectionCard
        title="Mensajes clave"
        description="Usa los textos del prototipo como base: bienvenida y despedida."
      >
        <View className="space-y-3">
          <View>
            <Text className="mb-1 text-xs font-medium text-gray-600">Mensaje de bienvenida</Text>
            <TextInput
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              value={payload.assistant.welcomeMessage}
              onChangeText={(text) =>
                setPayload((prev) => ({
                  ...prev,
                  assistant: { ...prev.assistant, welcomeMessage: text },
                }))
              }
            />
          </View>
          <View>
            <Text className="mb-1 text-xs font-medium text-gray-600">Mensaje de cierre</Text>
            <TextInput
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              value={payload.assistant.farewellMessage}
              onChangeText={(text) =>
                setPayload((prev) => ({
                  ...prev,
                  assistant: { ...prev.assistant, farewellMessage: text },
                }))
              }
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Preguntas rápidas"
        description="Activa las preguntas que el bot debe cubrir de forma automática."
      >
        <View className="flex-row flex-wrap">
          {quickActionsOptions.map((option) => (
            <Pill
              key={option.id}
              label={option.label}
              active={payload.assistant.quickActions.includes(option.id)}
              onPress={() => toggleQuickAction(option.id)}
            />
          ))}
        </View>
        <View className="mt-3 flex-row items-center">
          <Switch
            value={payload.preferences.showPropertyStats}
            onValueChange={(value) =>
              setPayload((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, showPropertyStats: value },
              }))
            }
          />
          <Text className="ml-2 text-sm text-gray-700">Mostrar estadísticas de propiedades</Text>
        </View>
      </SectionCard>
    </>
  );

  const renderSourcesStep = () => (
    <>
      <SectionCard
        title="Portales inmobiliarios"
        description="El asistente los usará para identificar el origen del lead."
      >
        <View className="flex-row flex-wrap">
          {portalOptions.map((portal) => (
            <Pill
              key={portal}
              label={portal}
              active={payload.leadSources.portals.includes(portal)}
              onPress={() => togglePortal(portal)}
            />
          ))}
        </View>
        <View className="mt-3">
          <Text className="mb-1 text-xs font-medium text-gray-600">
            Correo donde recibes leads de portales
          </Text>
          <TextInput
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
            placeholder="leads@tuagencia.com"
            value={payload.leadSources.inboxEmail ?? ''}
            onChangeText={(text) =>
              setPayload((prev) => ({
                ...prev,
                leadSources: { ...prev.leadSources, inboxEmail: text },
              }))
            }
            autoCapitalize="none"
          />
        </View>
      </SectionCard>

      <SectionCard
        title="CRM"
        description="Elige el CRM que usas para sincronizar contactos (igual que en la referencia)."
      >
        <View className="flex-row flex-wrap">
          {crmOptions.map((crm) => (
            <Pill
              key={crm}
              label={crm}
              active={payload.leadSources.crm === crm}
              onPress={() => setCrm(payload.leadSources.crm === crm ? null : crm)}
            />
          ))}
        </View>
        <View className="mt-4 flex-row items-center">
          <Switch
            value={payload.preferences.marketingOptIn}
            onValueChange={(value) =>
              setPayload((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, marketingOptIn: value },
              }))
            }
          />
          <Text className="ml-2 text-sm text-gray-700">
            Quiero recibir tips y casos de uso avanzados.
          </Text>
        </View>
      </SectionCard>
    </>
  );

  const renderReviewStep = () => (
    <>
      <SectionCard
        title="Resumen"
        description="Revisa los datos clave antes de lanzar el asistente."
      >
        <View className="space-y-3">
          {reviewBlocks.map((block) => (
            <View key={block.title} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Text className="text-sm font-semibold text-gray-900">{block.title}</Text>
              {block.lines.map((line) => (
                <Text key={line} className="text-sm text-gray-600">
                  {line}
                </Text>
              ))}
            </View>
          ))}
          <View className="flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-3">
            <SparklesIcon size={18} color="#eab308" />
            <Text className="ml-2 flex-1 text-sm text-gray-700">
              Al finalizar activaremos tu asistente con el flujo del prototipo y podrás editarlo en
              configuración.
            </Text>
          </View>
        </View>
      </SectionCard>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep.key) {
      case 'business':
        return renderBusinessStep();
      case 'assistant':
        return renderAssistantStep();
      case 'messages':
        return renderMessagesStep();
      case 'sources':
        return renderSourcesStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="pb-10">
        <View className="px-4 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable onPress={() => (stepIndex === 0 ? router.replace('/') : goBack())}>
              <View className="flex-row items-center">
                <ArrowLeftIcon size={20} color="#4b5563" />
                <Text className="ml-2 text-sm text-gray-600">
                  {stepIndex === 0 ? 'Volver' : 'Anterior'}
                </Text>
              </View>
            </Pressable>
            <View className="flex-row items-center">
              <BuildingOffice2Icon size={20} color="#111827" />
              <Text className="ml-2 text-lg font-semibold text-gray-900">Onboarding</Text>
            </View>
          </View>

          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <View>
                <Text className="text-xs uppercase text-gray-500">Configuración</Text>
                <Text className="text-xl font-semibold text-gray-900">{currentStep.title}</Text>
                <Text className="text-sm text-gray-500">{currentStep.description}</Text>
              </View>
              <View className="flex-row items-center rounded-full bg-yellow-50 px-3 py-2">
                <WifiIcon size={16} color="#ca8a04" />
                <Text className="ml-2 text-xs font-medium text-yellow-700">Flow de referencia</Text>
              </View>
            </View>

            <ProgressBar stepIndex={stepIndex} />
            {renderStepContent()}

            {error ? (
              <View className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <Text className="text-xs text-red-700">{error}</Text>
              </View>
            ) : null}

            <View className="mt-4 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={goBack}
                disabled={stepIndex === 0 || submitting}
                className={`flex-1 rounded-lg border border-gray-200 py-3 ${
                  stepIndex === 0 || submitting ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-center text-sm font-medium text-gray-700">Atrás</Text>
              </TouchableOpacity>
              <View className="w-3" />
              <TouchableOpacity
                onPress={stepIndex === steps.length - 1 ? handleSubmit : goNext}
                disabled={submitting}
                className="flex-1 flex-row items-center justify-center rounded-lg bg-yellow-500 py-3"
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="mr-2 text-sm font-semibold text-white">
                      {stepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </Text>
                    <CheckCircleIcon size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

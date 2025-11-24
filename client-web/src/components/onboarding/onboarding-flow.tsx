import { useMemo, useState } from 'react';
import { createApiClient, OnboardingPayload } from '@realmaker/shared';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { StepBusinessInfo } from './steps/step-business-info';
import { StepAssistant } from './steps/step-assistant';
import { StepMessages } from './steps/step-messages';
import { StepSources } from './steps/step-sources';
import { StepReview } from './steps/step-review';

type StepKey = 'business' | 'assistant' | 'messages' | 'sources' | 'review';

const steps: { key: StepKey; title: string; description: string }[] = [
  { key: 'business', title: 'Tu negocio', description: 'Personaliza el contexto del asistente.' },
  { key: 'assistant', title: 'Asistente', description: 'Selecciona canal y personalidad.' },
  { key: 'messages', title: 'Mensajes', description: 'Configura bienvenida y cierre.' },
  { key: 'sources', title: 'Fuentes', description: 'Portales y CRM para leads.' },
  { key: 'review', title: 'Revisión', description: 'Confirma y guarda.' },
];

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
    welcomeMessage: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte?',
    farewellMessage: '¡Gracias por contactarnos! Nuestro equipo seguirá contigo enseguida.',
    quickActions: ['datos', 'presupuesto', 'agendar', 'zona'],
  },
  leadSources: {
    portals: ['Idealista', 'Fotocasa'],
    crm: null,
    inboxEmail: '',
  },
  preferences: { showPropertyStats: true, marketingOptIn: true },
};

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<OnboardingPayload>(initialPayload);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const api = useMemo(() => createApiClient(import.meta.env.VITE_API_URL ?? ''), []);

  const updatePayload = (partial: Partial<OnboardingPayload>) => {
    setPayload((prev) => ({ ...prev, ...partial }));
  };

  const goNext = async () => {
    if (currentStep === steps.length - 1) {
      setSubmitting(true);
      setError('');
      try {
        await api.completeOnboarding(payload);
        navigate('/', { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No pudimos guardar el onboarding.';
        setError(message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    const key = steps[currentStep].key;
    switch (key) {
      case 'business':
        return <StepBusinessInfo data={payload} onChange={updatePayload} />;
      case 'assistant':
        return <StepAssistant data={payload} onChange={updatePayload} />;
      case 'messages':
        return <StepMessages data={payload} onChange={updatePayload} />;
      case 'sources':
        return <StepSources data={payload} onChange={updatePayload} />;
      case 'review':
        return <StepReview data={payload} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader className="space-y-1">
            <p className="text-sm text-gray-500">Onboarding</p>
            <CardTitle className="text-2xl text-gray-900">{steps[currentStep].title}</CardTitle>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            <div className="flex gap-3 justify-between">
              <Button variant="outline" onClick={goBack} disabled={currentStep === 0 || submitting}>
                Atrás
              </Button>
              <Button onClick={goNext} disabled={submitting}>
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

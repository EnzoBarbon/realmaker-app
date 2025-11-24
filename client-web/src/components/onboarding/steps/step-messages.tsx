import { OnboardingPayload } from '@realmaker/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';

type Props = {
  data: OnboardingPayload;
  onChange: (partial: Partial<OnboardingPayload>) => void;
};

const quickActions = [
  { id: 'datos', label: 'Datos de contacto' },
  { id: 'presupuesto', label: 'Presupuesto' },
  { id: 'agendar', label: 'Agendar visita' },
  { id: 'zona', label: 'Zona de interés' },
  { id: 'urgencia', label: 'Urgencia' },
];

export function StepMessages({ data, onChange }: Props) {
  const toggleQuickAction = (id: string) => {
    const exists = data.assistant.quickActions.includes(id);
    const quickActions = exists
      ? data.assistant.quickActions.filter((q) => q !== id)
      : [...data.assistant.quickActions, id];
    onChange({ assistant: { ...data.assistant, quickActions } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensajes</CardTitle>
        <CardDescription>Configura el mensaje de bienvenida, cierre y preguntas rápidas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Mensaje de bienvenida</Label>
          <Textarea
            rows={4}
            value={data.assistant.welcomeMessage}
            onChange={(e) =>
              onChange({ assistant: { ...data.assistant, welcomeMessage: e.target.value } })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Mensaje de despedida</Label>
          <Textarea
            rows={4}
            value={data.assistant.farewellMessage}
            onChange={(e) =>
              onChange({ assistant: { ...data.assistant, farewellMessage: e.target.value } })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Preguntas rápidas</Label>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((qa) => {
              const active = data.assistant.quickActions.includes(qa.id);
              return (
                <Badge
                  key={qa.id}
                  variant={active ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => toggleQuickAction(qa.id)}
                >
                  {qa.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

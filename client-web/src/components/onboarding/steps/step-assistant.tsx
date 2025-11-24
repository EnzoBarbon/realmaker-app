import { OnboardingPayload } from '@realmaker/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';

type Props = {
  data: OnboardingPayload;
  onChange: (partial: Partial<OnboardingPayload>) => void;
};

const channels = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email / Portales' },
  { value: 'phone', label: 'Teléfono' },
];

export function StepAssistant({ data, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configura tu asistente</CardTitle>
        <CardDescription>Selecciona el canal principal y define su tono.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Canal principal</Label>
          <Select
            value={data.assistant.channel}
            onValueChange={(value) =>
              onChange({
                assistant: { ...data.assistant, channel: value as OnboardingPayload['assistant']['channel'] },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona canal" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nombre del asistente</Label>
            <Input
              value={data.assistant.name}
              onChange={(e) =>
                onChange({ assistant: { ...data.assistant, name: e.target.value } })
              }
              placeholder="Ana, Leo..."
            />
          </div>
          <div className="space-y-2">
            <Label>Canales activos</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.communication.whatsapp}
                  onCheckedChange={(checked) =>
                    onChange({ communication: { ...data.communication, whatsapp: !!checked } })
                  }
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.communication.email}
                  onCheckedChange={(checked) =>
                    onChange({ communication: { ...data.communication, email: !!checked } })
                  }
                />
                <span className="text-sm text-gray-700">Email</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.communication.phone}
                  onCheckedChange={(checked) =>
                    onChange({ communication: { ...data.communication, phone: !!checked } })
                  }
                />
                <span className="text-sm text-gray-700">Teléfono</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Objetivo principal</Label>
          <Input
            value={data.assistant.objective}
            onChange={(e) =>
              onChange({ assistant: { ...data.assistant, objective: e.target.value } })
            }
            placeholder="Calificar leads, responder FAQs, agendar visitas..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

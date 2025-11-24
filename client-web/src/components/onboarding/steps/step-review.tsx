import { OnboardingPayload } from '@realmaker/shared';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type Props = {
  data: OnboardingPayload;
};

export function StepReview({ data }: Props) {
  return (
    <div className="space-y-3">
      <SummaryCard title="Negocio" items={[
        data.businessName,
        data.businessPhone ? `Teléfono: ${data.businessPhone}` : null,
        data.website ? `Web: ${data.website}` : null,
        data.teamSize ? `Equipo: ${data.teamSize}` : null,
      ]} />
      <SummaryCard title="Asistente" items={[
        `Canal: ${data.assistant.channel}`,
        `Nombre: ${data.assistant.name}`,
        data.assistant.objective,
      ]} />
      <SummaryCard title="Fuentes" items={[
        `Portales: ${data.leadSources.portals.join(', ') || 'Ninguno'}`,
        data.leadSources.crm ? `CRM: ${data.leadSources.crm}` : 'CRM: ninguno',
        data.leadSources.inboxEmail ? `Correo leads: ${data.leadSources.inboxEmail}` : null,
      ]} />
    </div>
  );
}

function SummaryCard({ title, items }: { title: string; items: (string | null | undefined)[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-gray-700">
        {items.filter(Boolean).map((item) => (
          <div key={item as string}>{item}</div>
        ))}
      </CardContent>
    </Card>
  );
}

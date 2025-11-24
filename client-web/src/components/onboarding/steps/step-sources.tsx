import { OnboardingPayload } from '@realmaker/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

type Props = {
  data: OnboardingPayload;
  onChange: (partial: Partial<OnboardingPayload>) => void;
};

const portals = ['Idealista', 'Fotocasa', 'Habitaclia', 'Milanuncios', 'Immobiliare'];
const crms = ['Inmovilla', 'HubSpot', 'Salesforce', 'Otro'];

export function StepSources({ data, onChange }: Props) {
  const togglePortal = (portal: string) => {
    const exists = data.leadSources.portals.includes(portal);
    const portalsList = exists
      ? data.leadSources.portals.filter((p) => p !== portal)
      : [...data.leadSources.portals, portal];
    onChange({ leadSources: { ...data.leadSources, portals: portalsList } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuentes de leads</CardTitle>
        <CardDescription>Selecciona portales y CRM para importar tus contactos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Portales inmobiliarios</Label>
          <div className="flex flex-wrap gap-2">
            {portals.map((portal) => {
              const active = data.leadSources.portals.includes(portal);
              return (
                <Badge
                  key={portal}
                  variant={active ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => togglePortal(portal)}
                >
                  {portal}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Correo donde recibes leads</Label>
          <Input
            placeholder="leads@tuagencia.com"
            value={data.leadSources.inboxEmail ?? ''}
            onChange={(e) =>
              onChange({ leadSources: { ...data.leadSources, inboxEmail: e.target.value } })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>CRM</Label>
          <Select
            value={data.leadSources.crm ?? undefined}
            onValueChange={(value) =>
              onChange({ leadSources: { ...data.leadSources, crm: value === 'none' ? null : value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu CRM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ninguno</SelectItem>
              {crms.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

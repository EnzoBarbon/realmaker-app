import { OnboardingPayload } from '@realmaker/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

type Props = {
  data: OnboardingPayload;
  onChange: (partial: Partial<OnboardingPayload>) => void;
};

export function StepBusinessInfo({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Información de tu agencia</CardTitle>
          <CardDescription>Estos datos se usarán para personalizar el asistente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la inmobiliaria</Label>
            <Input
              placeholder="Inmobiliaria Premium"
              value={data.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                placeholder="+34 600 000 000"
                value={data.businessPhone ?? ''}
                onChange={(e) => onChange({ businessPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sitio web</Label>
              <Input
                placeholder="https://tuinmobiliaria.com"
                value={data.website ?? ''}
                onChange={(e) => onChange({ website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Redes sociales</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Instagram"
                value={data.socials.instagram ?? ''}
                onChange={(e) =>
                  onChange({ socials: { ...data.socials, instagram: e.target.value } })
                }
              />
              <Input
                placeholder="Facebook"
                value={data.socials.facebook ?? ''}
                onChange={(e) =>
                  onChange({ socials: { ...data.socials, facebook: e.target.value } })
                }
              />
              <Input
                placeholder="TikTok"
                value={data.socials.tiktok ?? ''}
                onChange={(e) =>
                  onChange({ socials: { ...data.socials, tiktok: e.target.value } })
                }
              />
              <Input
                placeholder="YouTube"
                value={data.socials.youtube ?? ''}
                onChange={(e) =>
                  onChange({ socials: { ...data.socials, youtube: e.target.value } })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

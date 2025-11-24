import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  email: string;
  onEmailChange: (email: string) => void;
  onConnect: () => void;
  placeholder?: string;
}

export function TestModal({
  isOpen,
  onClose,
  title,
  description,
  email,
  onEmailChange,
  onConnect,
  placeholder = "tu-email@gmail.com"
}: TestModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
            {title}
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {description}
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConnect}
            disabled={!email}
            className="bg-primary hover:bg-primary/90"
          >
            Conectar
          </Button>
        </div>
      </div>
    </div>
  );
}

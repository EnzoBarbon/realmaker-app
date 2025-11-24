// Configuración de roles de clientes y sus preguntas de cualificación

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'options';
  options?: string[];
  enabled: boolean;
  category?: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  questions: Question[];
}

// Roles de clientes por defecto con sus preguntas de cualificación
export const defaultRoles: Role[] = [
  {
    id: 'buyer',
    name: 'Comprador',
    color: 'bg-green-50 text-green-700 border-green-200',
    questions: [
      {
        id: 'buyer-name',
        text: 'Nombre',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'buyer-phone',
        text: 'Teléfono',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'buyer-role',
        text: 'Tipo de rol',
        type: 'options',
        options: ['Comprador', 'Vendedor', 'Inquilino', 'Arrendador'],
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'q1',
        text: '¿Qué tipo de propiedad estás buscando?',
        type: 'options',
        options: ['Casa', 'Apartamento', 'Terreno', 'Local comercial'],
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q2',
        text: '¿En qué zona te gustaría vivir?',
        type: 'text',
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q3',
        text: '¿Cuál es tu presupuesto aproximado?',
        type: 'options',
        options: ['Menos de $100,000', '$100,000 - $250,000', '$250,000 - $500,000', 'Más de $500,000'],
        enabled: false,
        category: 'Esencial'
      }
    ]
  },
  {
    id: 'seller',
    name: 'Vendedor',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    questions: [
      {
        id: 'seller-name',
        text: 'Nombre',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'seller-phone',
        text: 'Teléfono',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'seller-role',
        text: 'Tipo de rol',
        type: 'options',
        options: ['Comprador', 'Vendedor', 'Inquilino', 'Arrendador'],
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'q1',
        text: '¿Qué tipo de propiedad quieres vender?',
        type: 'options',
        options: ['Casa', 'Apartamento', 'Terreno', 'Local comercial'],
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q2',
        text: '¿Dónde está ubicada tu propiedad?',
        type: 'text',
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q3',
        text: '¿En qué rango de precio esperarías venderla?',
        type: 'options',
        options: ['Menos de $100,000', '$100,000 - $250,000', '$250,000 - $500,000', 'Más de $500,000'],
        enabled: false,
        category: 'Esencial'
      }
    ]
  },
  {
    id: 'renter',
    name: 'Inquilino',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    questions: [
      {
        id: 'renter-name',
        text: 'Nombre',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'renter-phone',
        text: 'Teléfono',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'renter-role',
        text: 'Tipo de rol',
        type: 'options',
        options: ['Comprador', 'Vendedor', 'Inquilino', 'Arrendador'],
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'q1',
        text: '¿Qué tipo de propiedad buscas alquilar?',
        type: 'options',
        options: ['Casa', 'Apartamento', 'Habitación', 'Local comercial'],
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q2',
        text: '¿En qué zona te gustaría vivir?',
        type: 'text',
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q3',
        text: '¿Cuál es tu presupuesto mensual de alquiler?',
        type: 'options',
        options: ['Menos de $500', '$500 - $1,000', '$1,000 - $2,000', 'Más de $2,000'],
        enabled: false,
        category: 'Esencial'
      }
    ]
  },
  {
    id: 'landlord',
    name: 'Arrendador',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    questions: [
      {
        id: 'landlord-name',
        text: 'Nombre',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'landlord-phone',
        text: 'Teléfono',
        type: 'text',
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'landlord-role',
        text: 'Tipo de rol',
        type: 'options',
        options: ['Comprador', 'Vendedor', 'Inquilino', 'Arrendador'],
        enabled: false,
        category: 'Obligatorio'
      },
      {
        id: 'q1',
        text: '¿Qué tipo de propiedad quieres alquilar?',
        type: 'options',
        options: ['Casa', 'Apartamento', 'Habitación', 'Local comercial'],
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q2',
        text: '¿Dónde está ubicada tu propiedad?',
        type: 'text',
        enabled: false,
        category: 'Esencial'
      },
      {
        id: 'q3',
        text: '¿Cuál sería el precio mensual de alquiler?',
        type: 'options',
        options: ['Menos de $500', '$500 - $1,000', '$1,000 - $2,000', 'Más de $2,000'],
        enabled: false,
        category: 'Esencial'
      }
    ]
  }
];

// Función helper para obtener las preguntas de un rol específico
export function getRoleQuestions(roleId: string): Question[] {
  const role = defaultRoles.find(r => r.id === roleId);
  return role?.questions || [];
}

// Función helper para obtener el rol por ID
export function getRoleById(roleId: string): Role | undefined {
  return defaultRoles.find(r => r.id === roleId);
}

// Mapeo de tipos de cliente (intention) a roles
export const intentionToRoleMap: Record<string, string> = {
  'comprador': 'buyer',
  'vendedor': 'seller',
  'inquilino': 'renter',
  'arrendador': 'landlord',
  'otros': 'buyer' // Por defecto usa buyer para otros
};

// Función helper para obtener el roleId desde el intention del lead
export function getRoleIdFromIntention(intention: string): string {
  return intentionToRoleMap[intention] || 'buyer';
}
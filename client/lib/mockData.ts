import type {
  Appointment,
  Conversation,
  ConversationDetail,
  ConversationListItem,
  Lead,
  LeadListItem,
} from '@/models';

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    channel: 'phone',
    name: 'María González',
    phone: '+34 666 123 456',
    property: 'Casa unifamiliar',
    note: 'Interesada en visita esta semana',
    timeAgo: 'Hace 2 días',
    duration: '12m 34s',
    status: 'Completada',
    score: 95,
    createdAt: new Date('2024-09-28T10:30:00'),
    updatedAt: new Date('2024-09-28T10:42:34'),
  },
  {
    id: 'c2',
    channel: 'whatsapp',
    name: 'Sin nombre',
    phone: '+34 677 987 654',
    property: 'Piso',
    note: 'Consulta sobre precios',
    timeAgo: 'Hace 1 día',
    duration: '5m 12s',
    status: 'Completada',
    score: 73,
    createdAt: new Date('2024-09-29T14:20:00'),
    updatedAt: new Date('2024-09-29T14:25:12'),
  },
  {
    id: 'c3',
    channel: 'whatsapp',
    name: 'Fernando López',
    phone: '+34 633 321 654',
    property: 'Casa',
    note: 'Confirmar visita programada',
    timeAgo: 'Hace 2 días',
    duration: '8m 45s',
    status: 'Completada',
    score: 91,
    createdAt: new Date('2024-09-28T16:00:00'),
    updatedAt: new Date('2024-09-28T16:08:45'),
  },
  {
    id: 'c4',
    channel: 'phone',
    name: 'Carmen Vásquez',
    phone: '+34 644 456 789',
    property: 'Piso con terraza',
    note: 'Seguimiento de propuesta',
    timeAgo: 'Hace 3 días',
    duration: '15m 22s',
    status: 'En curso',
    score: 82,
    createdAt: new Date('2024-09-27T11:00:00'),
    updatedAt: new Date('2024-09-27T11:15:22'),
  },
  {
    id: 'c5',
    channel: 'whatsapp',
    name: 'Roberto Silva',
    phone: '+34 611 222 333',
    property: 'Local comercial',
    note: 'Propuesta enviada',
    timeAgo: 'Hace 1 día',
    duration: '20m 11s',
    status: 'Completada',
    score: 92,
    createdAt: new Date('2024-09-29T09:30:00'),
    updatedAt: new Date('2024-09-29T09:50:11'),
  },
  {
    id: 'c6',
    channel: 'phone',
    name: 'Alejandro Campos',
    phone: '+34 655 789 123',
    property: 'Casa adosada',
    note: 'Cliente quiere vender',
    timeAgo: 'Hace 4 días',
    duration: '10m 30s',
    status: 'Completada',
    score: 88,
    createdAt: new Date('2024-09-26T13:45:00'),
    updatedAt: new Date('2024-09-26T13:55:30'),
  },
  {
    id: 'c7',
    channel: 'whatsapp',
    name: 'Isabella Torres',
    phone: '+34 622 654 987',
    property: 'Departamento',
    note: 'No respondió follow-up',
    timeAgo: 'Hace 9 días',
    duration: '3m 45s',
    status: 'Perdida',
    score: 45,
    createdAt: new Date('2024-09-21T15:20:00'),
    updatedAt: new Date('2024-09-21T15:23:45'),
  },
];

// Mock Leads with conversation references
export const mockLeads: Lead[] = [
  {
    id: 'l1',
    conversationId: 'c1',
    name: 'María González',
    intention: 'comprar',
    stage: 'visita_agendada',
    phone: '+34 666 123 456',
    zone: 'Zona Norte',
    budget: '€180.000 - €220.000',
    interestedProperty: 'Casa unifamiliar',
    notes: 'Interesada en visita esta semana. Prefiere tardes. Busca 3 habitaciones mínimo.',
    score: 95,
    priority: 'alta',
    lastContactDays: 2,
    source: 'phone',
    createdAt: new Date('2024-09-28T10:30:00'),
    updatedAt: new Date('2024-09-28T10:42:34'),
  },
  {
    id: 'l2',
    conversationId: 'c2',
    name: 'Sin nombre',
    stage: 'nuevo',
    phone: '+34 677 987 654',
    zone: 'Centro',
    budget: '€150.000 - €180.000',
    interestedProperty: 'Piso',
    notes: 'Primera consulta. Necesita información básica sobre financiamiento.',
    score: 73,
    priority: 'alta',
    lastContactDays: 1,
    source: 'whatsapp',
    createdAt: new Date('2024-09-29T14:20:00'),
    updatedAt: new Date('2024-09-29T14:25:12'),
  },
  {
    id: 'l3',
    conversationId: 'c3',
    name: 'Fernando López',
    intention: 'visitar',
    stage: 'visita_agendada',
    phone: '+34 633 321 654',
    zone: 'Calle Olivos',
    interestedProperty: 'Casa',
    notes: 'Visita confirmada para el viernes a las 17:00.',
    score: 91,
    priority: 'alta',
    lastContactDays: 2,
    source: 'whatsapp',
    createdAt: new Date('2024-09-28T16:00:00'),
    updatedAt: new Date('2024-09-28T16:08:45'),
  },
  {
    id: 'l4',
    conversationId: 'c4',
    name: 'Carmen Vásquez',
    intention: 'comprar',
    stage: 'en_seguimiento',
    phone: '+34 644 456 789',
    zone: 'Zona Sur',
    budget: '€200.000 - €250.000',
    interestedProperty: 'Piso con terraza',
    notes: 'Esperando respuesta sobre propuesta inicial. Menciona necesidad de parking.',
    score: 82,
    priority: 'media',
    lastContactDays: 3,
    source: 'phone',
    createdAt: new Date('2024-09-27T11:00:00'),
    updatedAt: new Date('2024-09-27T11:15:22'),
  },
  {
    id: 'l5',
    conversationId: 'c5',
    name: 'Roberto Silva',
    intention: 'comprar',
    stage: 'propuesta_enviada',
    phone: '+34 611 222 333',
    zone: 'Centro Histórico',
    budget: '€400.000 - €500.000',
    interestedProperty: 'Local comercial',
    notes: 'Propuesta enviada. Cliente interesado en apertura de negocio gastronómico.',
    score: 92,
    priority: 'alta',
    lastContactDays: 1,
    source: 'whatsapp',
    createdAt: new Date('2024-09-29T09:30:00'),
    updatedAt: new Date('2024-09-29T09:50:11'),
  },
  {
    id: 'l6',
    conversationId: 'c6',
    name: 'Alejandro Campos',
    intention: 'vender',
    stage: 'calificado',
    phone: '+34 655 789 123',
    zone: 'Los Pinos',
    interestedProperty: 'Casa adosada',
    notes: 'Quiere vender su propiedad actual. Valoración programada.',
    score: 88,
    priority: 'media',
    lastContactDays: 4,
    source: 'phone',
    createdAt: new Date('2024-09-26T13:45:00'),
    updatedAt: new Date('2024-09-26T13:55:30'),
  },
  {
    id: 'l7',
    conversationId: 'c7',
    name: 'Isabella Torres',
    intention: 'comprar',
    stage: 'cerrado',
    phone: '+34 622 654 987',
    zone: 'Playa',
    budget: '€300.000+',
    interestedProperty: 'Departamento',
    notes: 'No respondió a múltiples intentos de contacto. Lead cerrado.',
    score: 45,
    priority: 'baja',
    lastContactDays: 9,
    source: 'whatsapp',
    createdAt: new Date('2024-09-21T15:20:00'),
    updatedAt: new Date('2024-09-21T15:23:45'),
  },
];

// Mock Lead List Items (for table display)
export const mockLeadListItems: LeadListItem[] = mockLeads.map((lead) => ({
  id: lead.id,
  name: lead.name,
  intention: lead.intention,
  stage: lead.stage,
  phone: lead.phone,
  zone: lead.zone,
  budget: lead.budget,
  interestedProperty: lead.interestedProperty,
  score: lead.score,
  priority: lead.priority,
  lastContactDays: lead.lastContactDays,
}));

// Mock Conversation List Items (for list display)
export const mockConversationListItems: ConversationListItem[] = mockConversations.map(
  (conversation) => ({
    id: conversation.id,
    channel: conversation.channel,
    name: conversation.name,
    phone: conversation.phone,
    property: conversation.property,
    note: conversation.note,
    timeAgo: conversation.timeAgo,
    duration: conversation.duration,
    status: conversation.status,
    score: conversation.score,
  }),
);

// Mock conversation details with messages
export const mockConversationDetails: Record<string, ConversationDetail> = {
  c1: {
    conversation: mockConversations[0],
    leadId: 'l1',
    messages: [
      {
        id: 'm1',
        author: 'User',
        text: 'Hola, estoy interesada en ver casas unifamiliares en la zona norte.',
        at: new Date('2024-09-28T10:30:00'),
      },
      {
        id: 'm2',
        author: 'IA',
        text: 'Hola María, ¡gracias por contactarnos! Tengo varias opciones disponibles en esa zona. ¿Cuál es tu presupuesto aproximado?',
        at: new Date('2024-09-28T10:30:30'),
        actions: [
          {
            type: 'estado_actualizado',
            description: 'Estado actualizado',
            value: 'En seguimiento',
          },
        ],
      },
      {
        id: 'm3',
        author: 'User',
        text: 'Entre 180.000 y 220.000 euros. Necesito al menos 3 habitaciones.',
        at: new Date('2024-09-28T10:31:15'),
      },
      {
        id: 'm4',
        author: 'IA',
        text: 'Perfecto. Te puedo agendar una visita esta semana. ¿Prefieres mañana o tarde?',
        at: new Date('2024-09-28T10:31:45'),
        actions: [
          {
            type: 'presupuesto_actualizado',
            description: 'Presupuesto actualizado',
            value: '€180.000 - €220.000',
          },
          {
            type: 'lead_calificado',
            description: 'Lead calificado',
            value: '95%',
          },
        ],
      },
      {
        id: 'm5',
        author: 'User',
        text: 'Prefiero las tardes, después de las 5 PM.',
        at: new Date('2024-09-28T10:32:30'),
      },
      {
        id: 'm6',
        author: 'IA',
        text: 'Excelente, he agendado la visita para el viernes a las 17:00.',
        at: new Date('2024-09-28T10:33:00'),
        actions: [
          {
            type: 'visita_agendada',
            description: 'Visita agendada',
            value: 'Viernes 17:00',
          },
          {
            type: 'estado_actualizado',
            description: 'Estado actualizado',
            value: 'Visita agendada',
          },
        ],
      },
    ],
  },
  c2: {
    conversation: mockConversations[1],
    leadId: 'l2',
    messages: [
      {
        id: 'm7',
        author: 'User',
        text: 'Quiero saber precios de pisos en el centro',
        at: new Date('2024-09-29T14:20:00'),
      },
      {
        id: 'm8',
        author: 'IA',
        text: '¡Hola! Gracias por contactarnos. Tenemos pisos desde 150.000 euros. ¿Te gustaría que te envíe información detallada?',
        at: new Date('2024-09-29T14:20:30'),
        actions: [
          {
            type: 'presupuesto_actualizado',
            description: 'Presupuesto actualizado',
            value: '€150.000 - €180.000',
          },
        ],
      },
      {
        id: 'm9',
        author: 'User',
        text: 'Sí, por favor. También quiero información sobre financiamiento.',
        at: new Date('2024-09-29T14:21:15'),
      },
      {
        id: 'm10',
        author: 'IA',
        text: 'Perfecto, te envío la información por email. Un asesor financiero te contactará mañana.',
        at: new Date('2024-09-29T14:21:45'),
        actions: [
          {
            type: 'nota_agregada',
            description: 'Nota agregada',
            value: 'Cliente interesado en financiamiento',
          },
        ],
      },
    ],
  },
  c3: {
    conversation: mockConversations[2],
    leadId: 'l3',
    messages: [
      {
        id: 'm11',
        author: 'User',
        text: 'Hola, quiero confirmar la visita para el viernes.',
        at: new Date('2024-09-28T16:00:00'),
      },
      {
        id: 'm12',
        author: 'IA',
        text: 'Hola Fernando, ¡perfecto! La visita está confirmada para el viernes a las 17:00 en Calle Olivos. ¿Te envío la ubicación?',
        at: new Date('2024-09-28T16:00:30'),
      },
      {
        id: 'm13',
        author: 'User',
        text: 'Sí, por favor. ¿Puedo llevar a mi esposa?',
        at: new Date('2024-09-28T16:01:15'),
      },
      {
        id: 'm14',
        author: 'IA',
        text: '¡Por supuesto! Será un placer recibirlos a ambos. Te envío la ubicación por WhatsApp.',
        at: new Date('2024-09-28T16:01:45'),
        actions: [
          {
            type: 'visita_agendada',
            description: 'Visita agendada',
            value: 'Viernes 17:00',
          },
        ],
      },
    ],
  },
  c4: {
    conversation: mockConversations[3],
    leadId: 'l4',
    messages: [
      {
        id: 'm16',
        author: 'User',
        text: 'Hola, revisé la propuesta del piso con terraza.',
        at: new Date('2024-09-27T11:00:00'),
      },
      {
        id: 'm17',
        author: 'IA',
        text: '¡Hola Carmen! ¿Qué te pareció? ¿Tienes alguna pregunta?',
        at: new Date('2024-09-27T11:00:30'),
      },
      {
        id: 'm17b',
        author: 'User',
        text: 'Me gusta mucho pero necesito hablar con el banco primero.',
        at: new Date('2024-09-27T11:01:15'),
      },
      {
        id: 'm18',
        author: 'IA',
        text: 'Entiendo perfectamente. Tenemos un asesor financiero que puede ayudarte con el proceso. ¿Te gustaría que coordine una llamada?',
        at: new Date('2024-09-27T11:02:00'),
      },
      {
        id: 'm19',
        author: 'User',
        text: 'Sí, eso sería genial. También quiero asegurarme de que tiene parking incluido.',
        at: new Date('2024-09-27T11:03:15'),
      },
      {
        id: 'm20',
        author: 'IA',
        text: 'Sí, incluye una plaza de parking y trastero. Te envío la info completa y coordino con el asesor financiero.',
        at: new Date('2024-09-27T11:04:00'),
        actions: [
          {
            type: 'estado_actualizado',
            description: 'Estado actualizado',
            value: 'En seguimiento',
          },
          {
            type: 'nota_agregada',
            description: 'Nota agregada',
            value: 'Cliente requiere parking incluido',
          },
        ],
      },
    ],
  },
  c5: {
    conversation: mockConversations[4],
    leadId: 'l5',
    messages: [
      {
        id: 'm21',
        author: 'User',
        text: 'Hola, vi el anuncio del local comercial en el Centro Histórico. ¿Está disponible?',
        at: new Date('2024-09-29T09:30:00'),
      },
      {
        id: 'm22',
        author: 'IA',
        text: 'Hola Roberto, ¡sí! El local está disponible. ¿Te gustaría conocer más detalles?',
        at: new Date('2024-09-29T09:30:30'),
      },
      {
        id: 'm22b',
        author: 'User',
        text: 'Sí, me interesa mucho. ¿Cuáles son los términos?',
        at: new Date('2024-09-29T09:31:15'),
      },
      {
        id: 'm23',
        author: 'IA',
        text: 'El local tiene 120m², licencia de actividad vigente y está en zona alta de tráfico peatonal. El precio es €450.000.',
        at: new Date('2024-09-29T09:32:00'),
      },
      {
        id: 'm24',
        author: 'User',
        text: 'Perfecto. Quiero abrir un restaurante. ¿Tiene salida de humos?',
        at: new Date('2024-09-29T09:33:15'),
      },
      {
        id: 'm25',
        author: 'IA',
        text: 'Sí, tiene salida de humos instalada. Te envío la propuesta formal con todos los detalles técnicos.',
        at: new Date('2024-09-29T09:34:00'),
      },
      {
        id: 'm26',
        author: 'User',
        text: 'Excelente. Revisaré la propuesta hoy y te respondo mañana.',
        at: new Date('2024-09-29T09:35:30'),
      },
      {
        id: 'm27',
        author: 'IA',
        text: 'Perfecto. Quedo pendiente de tu respuesta.',
        at: new Date('2024-09-29T09:36:00'),
        actions: [
          {
            type: 'propuesta_enviada',
            description: 'Propuesta enviada',
            value: 'Local comercial - €450.000',
          },
          {
            type: 'estado_actualizado',
            description: 'Estado actualizado',
            value: 'Propuesta enviada',
          },
        ],
      },
    ],
  },
  c6: {
    conversation: mockConversations[5],
    leadId: 'l6',
    messages: [
      {
        id: 'm28',
        author: 'User',
        text: 'Hola, quiero vender mi casa adosada en Los Pinos.',
        at: new Date('2024-09-26T13:45:00'),
      },
      {
        id: 'm29',
        author: 'IA',
        text: 'Hola Alejandro, ¡gracias por contactarnos! Perfecto, para darte una valoración precisa, necesito algunos datos. ¿Cuántos m² tiene y cuántas habitaciones?',
        at: new Date('2024-09-26T13:45:30'),
      },
      {
        id: 'm30',
        author: 'User',
        text: 'Tiene 180m², 4 habitaciones, 3 baños y un pequeño jardín.',
        at: new Date('2024-09-26T13:46:30'),
      },
      {
        id: 'm31',
        author: 'IA',
        text: 'Excelente. Programo una valoración para esta semana. Un agente se pondrá en contacto contigo para coordinar.',
        at: new Date('2024-09-26T13:47:15'),
        actions: [
          {
            type: 'visita_agendada',
            description: 'Valoración agendada',
            value: 'Esta semana',
          },
          {
            type: 'lead_calificado',
            description: 'Lead calificado',
            value: '88%',
          },
        ],
      },
    ],
  },
  c7: {
    conversation: mockConversations[6],
    leadId: 'l7',
    messages: [
      {
        id: 'm33',
        author: 'User',
        text: 'Hola, estoy buscando un departamento cerca de la playa.',
        at: new Date('2024-09-21T15:20:00'),
      },
      {
        id: 'm34',
        author: 'IA',
        text: 'Hola Isabella, ¡gracias por contactarnos! Tenemos varias opciones disponibles. ¿Cuál es tu presupuesto aproximado?',
        at: new Date('2024-09-21T15:20:30'),
        actions: [
          {
            type: 'estado_actualizado',
            description: 'Estado actualizado',
            value: 'Nuevo',
          },
        ],
      },
    ],
  },
};

// Helper functions to get data by ID
export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((lead) => lead.id === id);
}

export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find((conv) => conv.id === id);
}

export function getConversationDetailById(id: string): ConversationDetail | undefined {
  return mockConversationDetails[id];
}

export function getConversationByLeadId(leadId: string): Conversation | undefined {
  const lead = getLeadById(leadId);
  if (!lead?.conversationId) return undefined;
  return getConversationById(lead.conversationId);
}

// Mock Appointments linked to leads
export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    leadId: 'l1',
    title: 'Visita Torre Vista Hermosa',
    type: 'visita',
    status: 'confirmed',
    startDate: new Date(2025, 9, 3, 17, 0), // Oct 3, 2025 at 5 PM
    endDate: new Date(2025, 9, 3, 18, 0),
    clientName: 'María González',
    clientPhone: '+34 666 123 456',
    property: 'Casa unifamiliar - Zona Norte',
    location: 'Zona Norte',
    notes: 'Cliente busca casa de 3 habitaciones mínimo. Presupuesto: €180k-€220k',
  },
  {
    id: 'a2',
    leadId: 'l3',
    title: 'Visita Casa Calle Olivos',
    type: 'visita',
    status: 'confirmed',
    startDate: new Date(2025, 9, 3, 17, 0), // Oct 3, 2025 at 5 PM (same day as María)
    endDate: new Date(2025, 9, 3, 18, 0),
    clientName: 'Fernando López',
    clientPhone: '+34 633 321 654',
    property: 'Casa - Calle Olivos',
    location: 'Calle Olivos',
    notes: 'Visita confirmada. Viene con su esposa.',
  },
  {
    id: 'a3',
    leadId: 'l4',
    title: 'Llamada Seguimiento - Carmen',
    type: 'llamada',
    status: 'pending',
    startDate: new Date(2025, 8, 30, 14, 30), // Today at 2:30 PM
    endDate: new Date(2025, 8, 30, 15, 0),
    clientName: 'Carmen Vásquez',
    clientPhone: '+34 644 456 789',
    notes: 'Seguimiento sobre propuesta de piso con terraza. Verificar respuesta del banco.',
  },
  {
    id: 'a4',
    leadId: 'l5',
    title: 'Reunión Local Comercial',
    type: 'reunion',
    status: 'confirmed',
    startDate: new Date(2025, 8, 30, 16, 0), // Today at 4 PM
    endDate: new Date(2025, 8, 30, 17, 0),
    clientName: 'Roberto Silva',
    clientPhone: '+34 611 222 333',
    property: 'Local comercial - Centro Histórico',
    location: 'Oficina RealMaker',
    notes: 'Revisión de propuesta. Cliente quiere abrir restaurante.',
  },
  {
    id: 'a5',
    leadId: 'l6',
    title: 'Valoración Casa Adosada',
    type: 'visita',
    status: 'confirmed',
    startDate: new Date(2025, 9, 1, 11, 0), // Tomorrow at 11 AM
    endDate: new Date(2025, 9, 1, 12, 0),
    clientName: 'Alejandro Campos',
    clientPhone: '+34 655 789 123',
    property: 'Casa adosada - Los Pinos',
    location: 'Los Pinos',
    notes: 'Valoración para venta. 180m², 4 habitaciones, 3 baños, jardín.',
  },
  {
    id: 'a6',
    leadId: 'l2',
    title: 'Llamada Información Financiamiento',
    type: 'llamada',
    status: 'confirmed',
    startDate: new Date(2025, 9, 1, 10, 0), // Tomorrow at 10 AM
    endDate: new Date(2025, 9, 1, 10, 30),
    clientName: 'Sin nombre',
    clientPhone: '+34 677 987 654',
    notes: 'Primera llamada para explicar opciones de financiamiento para pisos en el centro.',
  },
  {
    id: 'a7',
    leadId: 'l1',
    title: 'Llamada Recordatorio Visita',
    type: 'llamada',
    status: 'confirmed',
    startDate: new Date(2025, 9, 3, 10, 0), // Oct 3 at 10 AM
    endDate: new Date(2025, 9, 3, 10, 15),
    clientName: 'María González',
    clientPhone: '+34 666 123 456',
    notes: 'Recordatorio de visita programada para las 17:00.',
  },
  {
    id: 'a8',
    leadId: 'l5',
    title: 'Cita Firma Propuesta',
    type: 'cita',
    status: 'pending',
    startDate: new Date(2025, 9, 7, 12, 0), // Oct 7 at noon
    endDate: new Date(2025, 9, 7, 13, 0),
    clientName: 'Roberto Silva',
    clientPhone: '+34 611 222 333',
    property: 'Local comercial - Centro Histórico',
    location: 'Notaría Centro',
    notes: 'Firma de propuesta inicial. Cliente muy interesado.',
  },
];

export function getAppointmentsByLeadId(leadId: string): Appointment[] {
  return mockAppointments.filter((apt) => apt.leadId === leadId);
}

export function getAppointmentById(id: string): Appointment | undefined {
  return mockAppointments.find((apt) => apt.id === id);
}

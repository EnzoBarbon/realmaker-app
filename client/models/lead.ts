import type { Channel, ID, Phone, Timestamp } from './common';

// Lead intention
export type LeadIntention = 'comprar' | 'visitar' | 'vender' | 'alquilar';

// Stages for a CRM-like lead pipeline
export type LeadStage =
  | 'nuevo'
  | 'visita_agendada'
  | 'en_seguimiento'
  | 'propuesta_enviada'
  | 'calificado'
  | 'cerrado';

// Lead priority
export type LeadPriority = 'alta' | 'media' | 'baja';

// Where the lead came from
export type LeadSource = Channel | 'referral' | 'email' | 'ads' | 'other';

export interface Lead {
  id: ID;
  conversationId?: ID; // Reference to associated conversation
  name: string;
  phone: Phone;
  email?: string;
  intention?: LeadIntention;
  stage: LeadStage;
  zone?: string; // e.g. "Zona Norte", "Centro"
  budget?: string; // e.g. "€180.000 - €220.000"
  interestedProperty?: string; // e.g. "Casa unifamiliar"
  notes?: string;
  tags?: string[];
  source?: LeadSource;
  score?: number; // 0..100
  priority?: LeadPriority;
  assignedTo?: string; // agent id or name
  lastActivityAt?: Timestamp;
  lastContactDays?: number; // days since last contact
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Compact version for list UIs (data table)
export type LeadListItem = Pick<
  Lead,
  | 'id'
  | 'name'
  | 'intention'
  | 'stage'
  | 'phone'
  | 'zone'
  | 'budget'
  | 'score'
  | 'priority'
  | 'lastContactDays'
  | 'interestedProperty'
> & { subtitle?: string };

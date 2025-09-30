import { ID, Timestamp } from './common';
import type { Conversation } from './conversation';

export type MessageAuthor = 'IA' | 'User';

export type MessageActionType =
  | 'estado_actualizado'
  | 'presupuesto_actualizado'
  | 'visita_agendada'
  | 'lead_calificado'
  | 'propuesta_enviada'
  | 'nota_agregada';

export interface MessageAction {
  type: MessageActionType;
  description: string;
  value?: string; // e.g., new stage, budget amount, visit date
}

export interface ConversationMessage {
  id: ID;
  author: MessageAuthor;
  text: string;
  at: Timestamp;
  actions?: MessageAction[]; // Actions taken by IA after this message
}

export interface ConversationDetail {
  conversation: Conversation;
  messages: ConversationMessage[];
  leadId?: ID; // Reference to associated lead
}

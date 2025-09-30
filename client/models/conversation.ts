import type { Channel, ConversationStatus, ID, Phone, Timestamp } from './common';

// A single customer conversation (phone, whatsapp, etc.)
export interface Conversation {
  id: ID;
  channel: Channel; // e.g. 'phone' | 'whatsapp'
  name: string;
  phone: Phone;
  property?: string; // e.g. "Casa en Zona Norte - $350,000"
  note?: string; // short note or last message
  timeAgo?: string; // UI-friendly relative time (e.g. "Hace 5 min")
  duration?: string; // call length or session duration (e.g., "8m 23s")
  status: ConversationStatus;
  score?: number; // 0..100 lead score inferred from the conversation
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// A compact representation optimized for list UIs
export type ConversationListItem = Pick<
  Conversation,
  'id' | 'channel' | 'name' | 'phone' | 'property' | 'note' | 'timeAgo' | 'duration' | 'status' | 'score'
>;


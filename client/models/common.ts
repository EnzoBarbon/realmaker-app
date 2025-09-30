// Common model types shared across the app

export type ID = string;
export type Phone = string;

// Supported channels where a conversation/lead can originate
export type Channel = 'phone' | 'whatsapp' | 'web' | 'email';

// Generic status for conversations
export type ConversationStatus = 'Completada' | 'Perdida' | 'En curso' | 'Rechazada' | 'Transferida';

// Timestamps are ISO strings in transport, Dates in memory if parsed
export type Timestamp = string | Date;


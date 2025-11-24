export interface WhatsappPayload {
  from: string;
  body: string;
  timestamp: number;
  messageId: string;
}

export interface IngressEvent {
  type: 'WHATSAPP_MESSAGE';
  payload: WhatsappPayload;
}

export interface EgressEvent {
  to: string;
  body: string;
  originalMessageId: string;
}

export const KAFKA_TOPICS = {
  INGRESS: 'whatsapp-ingress',
  EGRESS: 'whatsapp-egress',
} as const;

export const KAFKA_CLIENT_ID = 'realmaker-backend';
// Default to localhost:29092 for local dev outside docker, or use env var
export const KAFKA_BROKERS = [Deno.env.get('KAFKA_BROKER') || 'localhost:29092'];

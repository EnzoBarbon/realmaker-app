// models/appointment.ts
export type AppointmentType = 'visita' | 'llamada' | 'reunion' | 'cita';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  leadId: string; // Required - link to lead
  title: string;
  type: AppointmentType;
  status: AppointmentStatus;
  startDate: string | Date;
  endDate: string | Date;
  clientName?: string;
  clientPhone?: string;
  property?: string;
  location?: string;
  notes?: string;
  assignedTo?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

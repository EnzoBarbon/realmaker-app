import { AnimatedElement } from '@/components/animation/AnimatedElement';
import { Card, CardBody } from '@/components/ui/Card';
import { H1, Muted } from '@/components/ui/Typography';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';

export default function AssistantSettings() {
  const [autoReply, setAutoReply] = useState(true);
  const [autoScore, setAutoScore] = useState(true);
  const [scheduleVisits, setScheduleVisits] = useState(true);
  const [sendProperties, setSendProperties] = useState(false);
  const [oohMode, setOohMode] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      {/* Conexión */}
      <AnimatedElement animationIndex={0}>
        <Card>
          <CardBody>
            <H1>Conexión WhatsApp Business</H1>
            <View className="mt-3 gap-3">
              <Field label="Número de WhatsApp Business" value="+1 234 567 8900" />
              <Field label="Nombre del Negocio" value="Inmobiliaria Premium" />
              <Field label="Webhook URL" value="https://api.inmobiliaria.com/webhook" />
              <Field label="Token de Acceso" value="••••••••••••••••" />
            </View>
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Mensajes */}
      <AnimatedElement animationIndex={1}>
        <Card>
          <CardBody>
            <H1>Configuración de Mensajes</H1>
            <View className="mt-3 gap-3">
              <Field
                label="Mensaje de Bienvenida"
                value="¡Hola! 👋 Soy el asistente virtual de Inmobiliaria Premium..."
                multiline
              />
              <Field
                label="Personalidad del Asistente"
                value="Amigable y profesional especializado en bienes raíces."
                multiline
              />
              <Field label="Estilo de Respuesta" value="Amigable y Casual" />
            </View>
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Automatización */}
      <AnimatedElement animationIndex={2}>
        <Card>
          <CardBody>
            <H1>Funcionalidades Automáticas</H1>
            <View className="mt-3 gap-4">
              <ToggleRow label="Respuesta Automática" value={autoReply} onChange={setAutoReply} />
              <ToggleRow label="Calificación de Leads" value={autoScore} onChange={setAutoScore} />
              <ToggleRow
                label="Agendar Citas"
                value={scheduleVisits}
                onChange={setScheduleVisits}
              />
              <ToggleRow
                label="Envío de Propiedades"
                value={sendProperties}
                onChange={setSendProperties}
              />
            </View>
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Tiempo */}
      <AnimatedElement animationIndex={3}>
        <Card>
          <CardBody>
            <H1>Configuración de Tiempo</H1>
            <View className="mt-3 gap-3">
              <Field label="Tiempo de Respuesta (segundos)" value="2" />
              <Field label="Duración Máxima de Conversación (horas)" value="24" />
              <ToggleRow label="Modo Fuera de Horario" value={oohMode} onChange={setOohMode} />
              <Field
                label="Mensaje Fuera de Horario"
                value="Gracias por contactarnos..."
                multiline
              />
            </View>
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Templates */}
      <AnimatedElement animationIndex={4}>
        <Card>
          <CardBody>
            <H1>Templates de Respuesta</H1>
            <View className="mt-3 gap-2">
              <TemplateRow title="Información de Propiedades" />
              <TemplateRow title="Agendar Visita" />
              <TemplateRow title="Información de Contacto" />
              <View className="mt-2">
                <Muted>+ Agregar Nuevo Template</Muted>
              </View>
            </View>
          </CardBody>
        </Card>
      </AnimatedElement>
    </ScrollView>
  );
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View>
      <Text className="mb-1 text-xs text-gray-500">{label}</Text>
      <TextInput
        defaultValue={value}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
      />
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-gray-800">{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function TemplateRow({ title }: { title: string }) {
  return (
    <View className="flex-row items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <Text className="text-sm text-gray-800">{title}</Text>
      <Text className="text-xs text-primary">Editar</Text>
    </View>
  );
}

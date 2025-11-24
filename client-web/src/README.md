# RealMaker - Dashboard de Asistentes de IA para Inmobiliarias

## Descripción
RealMaker es una plataforma completa de dashboard para gestionar asistentes de IA especializados en el sector inmobiliario. La aplicación permite configurar y monitorear asistentes telefónicos y de WhatsApp para automatizar las interacciones con clientes potenciales.

## Características Principales

- 📊 **Dashboard Centralizado**: Vista general de todas las métricas y actividades
- 📞 **Asistente Telefónico**: Configuración completa para llamadas automatizadas
- 💬 **Asistente WhatsApp**: Integración con WhatsApp Business API
- 🔗 **Integraciones**: Conecta con CRM, calendarios y herramientas inmobiliarias
- 📱 **Diseño Responsive**: Optimizado para desktop y móvil
- 🎨 **UI Moderna**: Interfaz limpia y profesional con Tailwind CSS

## Tecnologías Utilizadas

- **React** + **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (iconos)
- **ShadCN/UI** (componentes)
- **React Hook Form** (formularios)

## Estructura del Proyecto

```
├── components/
│   ├── assistants/           # Configuración de asistentes
│   ├── dashboard/           # Dashboard principal
│   ├── integrations/        # Página de integraciones
│   ├── layout/             # Componentes de layout
│   └── ui/                 # Componentes base de UI
├── styles/
│   └── globals.css         # Estilos globales y variables CSS
└── App.tsx                 # Componente principal
```

## Componentes Principales

### Dashboard
- Estadísticas en tiempo real
- Actividad reciente de asistentes
- Estado de los asistentes (activo/inactivo)
- Top leads con porcentajes de conversión

### Asistentes
- **Telefónico**: Configuración de voz, horarios, y comportamiento
- **WhatsApp**: Conexión con Business API, templates de mensajes, y automatizaciones

### Integraciones
- CRM (HubSpot, Salesforce)
- Calendarios (Google Calendar, Calendly)
- Herramientas inmobiliarias (MLS, Zillow)
- Comunicación (Slack, Gmail)
- Analytics (Google Analytics)

## Responsive Design

La aplicación está completamente optimizada para dispositivos móviles:
- Header móvil con menú hamburguesa
- Sidebar convertible en drawer
- Grid layouts adaptativos
- Botones y formularios responsive

## Personalización

### Colores
El color primario principal es `#e7af2a` (dorado), que se puede modificar en `styles/globals.css`:

```css
--primary: #e7af2a;
```

### Logo
Utiliza el icono `Building2` de Lucide React para representar el sector inmobiliario.

## Instalación y Uso

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Ejecuta el proyecto: `npm run dev`

## Estado del Proyecto

✅ Dashboard principal completado
✅ Configuración de asistentes terminada  
✅ Página de integraciones funcional
✅ Diseño responsive implementado
✅ Rebranding a "RealMaker" completado

## Próximas Funcionalidades

- [ ] Módulo de Leads
- [ ] Calendario integrado
- [ ] Análisis avanzados
- [ ] Configuraciones generales
- [ ] Centro de ayuda

---

**RealMaker** - Potencia tu negocio inmobiliario con asistentes de IA inteligentes.
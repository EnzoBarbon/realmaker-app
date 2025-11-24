# Sistema de Etiquetado de Contactos - RealMaker AI

## 📋 Descripción General

El sistema de etiquetado de RealMaker AI permite organizar y categorizar contactos de manera inteligente, combinando **etiquetas automáticas** generadas desde las conversaciones con **etiquetas personalizadas** creadas por el usuario.

## 🎯 Tipos de Etiquetas

### 1. Etiquetas Automáticas (Cualificación)
Estas etiquetas se generan **automáticamente** desde los datos de cualificación de la conversación y aparecen debajo del nombre del contacto con iconos descriptivos:

- **📍 Zona**: Ubicación de interés del lead (ej: "Los Pinos", "Centro")
- **🏠 Tipo de Propiedad**: Tipo de inmueble buscado (ej: "Casa adosada", "Piso")
- **💰 Presupuesto**: Rango de presupuesto del lead (ej: "200.000-300.000€")
- **🛒 Intención**: Comprador, Vendedor o Consulta

**Características:**
- Se generan automáticamente desde `conversationData`
- No se pueden editar ni eliminar (son informativas)
- Tienen colores distintivos según categoría
- Ayudan a identificar rápidamente el perfil del contacto

### 2. Etiquetas del Sistema (Predefinidas)
Etiquetas predefinidas listas para usar que cubren casos comunes:

- Referido
- Alto presupuesto
- Urgente
- Inversión
- Primera vivienda
- VIP

**Características:**
- Predefinidas en el sistema
- Se pueden añadir/quitar del contacto con un clic
- No se pueden eliminar de la lista del sistema
- Color: Gris/Primario

### 3. Etiquetas Personalizadas
Etiquetas creadas por el usuario para necesidades específicas:

**Características:**
- Se pueden crear libremente (ej: "Busca parking", "Flexible", "Solo efectivo")
- Se guardan en `localStorage` para reutilizarlas
- Se pueden eliminar permanentemente con la "X"
- Aparecen en todos los diálogos de guardar contacto

## 🎨 Flujo de Uso

### Al Guardar un Contacto:

1. **Campo Nombre**: Introduce el nombre del contacto
2. **Etiquetas Automáticas**: Aparecen debajo del nombre (si hay datos de cualificación)
3. **Texto Explicativo**: "Estas etiquetas se generan automáticamente desde la conversación"
4. **Campo Teléfono**: Número del lead (no editable)
5. **Campo Email**: Correo electrónico (opcional)
6. **Sección Etiquetas**:
   - Etiquetas disponibles (sistema + personalizadas)
   - Botón "+ Nueva etiqueta" para crear
   - Área de etiquetas seleccionadas (donde aparecen las elegidas)
7. **Campo Notas**: Texto libre para información adicional

## 💡 Casos de Uso

### Ejemplo 1: Lead Cualificado
```
Nombre: Antonio Campos
Etiquetas Automáticas: 📍 Los Pinos | 🏠 Casa adosada | 💰 Vendedor
Etiquetas Seleccionadas: Alto presupuesto, Urgente
Notas: Cliente referido por María. Busca propiedad con jardín.
```

### Ejemplo 2: Lead Sin Cualificar
```
Nombre: María López
Etiquetas Automáticas: (ninguna)
Etiquetas Seleccionadas: Primera vivienda, Referido
Notas: Contactó por Instagram. Pendiente de cualificar.
```

### Ejemplo 3: Inversor VIP
```
Nombre: Carlos Investment SL
Etiquetas Automáticas: 🛒 Comprador | 💰 500.000-1.000.000€
Etiquetas Seleccionadas: VIP, Inversión, Alto presupuesto
Notas: Busca propiedades para alquiler turístico. Portfolio de 15 propiedades.
```

## 🔧 Componentes

### SaveContactDialog
Componente principal para guardar contactos con el sistema completo de etiquetado.

**Props:**
- `lead`: Datos del lead (incluye conversationData para etiquetas automáticas)
- `mode`: 'save' | 'saveAndCall'
- `onSave`: Callback al guardar
- `isMobile`: Diseño responsive

### ContactDetailsSheet  
Muestra los detalles del contacto con sus etiquetas y notas.

**Cambios:**
- "Etiquetas" → "Notas" (campo de texto libre)
- Visualización consistente en modo lectura y edición

## 📱 Responsividad

El sistema es completamente responsive:
- **Desktop**: Diálogo centrado con max-width 2xl
- **Móvil**: Pantalla completa con scroll optimizado
- **Botones**: Adaptados a touch (mínimo 44x44px)
- **Etiquetas**: Wrap automático en múltiples líneas

## 🎨 Diseño

- **Consistencia**: Mismo diseño en desktop y móvil
- **Accesibilidad**: WCAG AA compliant
- **Color primario**: #e7af2a
- **Microinteracciones**: Hover, active states
- **Feedback visual**: Estados claros para etiquetas seleccionadas

## 💾 Persistencia

- **Etiquetas personalizadas**: `localStorage` → `customContactTags`
- **Contactos guardados**: `localStorage` → `savedContacts`
- **Formato**:
```json
{
  "id": "uuid",
  "name": "Nombre",
  "phone": "+34...",
  "email": "email@example.com",
  "tags": ["tag1", "tag2"],
  "notes": "Texto libre"
}
```

## 🚀 Mejoras Futuras

- [ ] Filtrar contactos por etiquetas
- [ ] Estadísticas de etiquetas más usadas
- [ ] Sugerencias de etiquetas basadas en IA
- [ ] Colores personalizados para etiquetas
- [ ] Exportar contactos con etiquetas

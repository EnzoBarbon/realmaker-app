/**
 * Sistema centralizado para gestionar el estado de conversaciones leídas/no leídas
 * Sincroniza el estado entre la página de Conversaciones, Alertas y el Sidebar
 * 
 * NUEVA LÓGICA DE SESIÓN:
 * - Las conversaciones no leídas "originales" se guardan en localStorage (SOLO SE ESCRIBE AL INICIALIZAR)
 * - Las conversaciones leídas durante la sesión se rastrean en sessionStorage
 * - Al iniciar nueva sesión, se restauran las conversaciones no leídas originales
 * - Al cerrar sesión, se limpia sessionStorage y vuelven a aparecer no leídas
 * - IMPORTANTE: Durante la sesión normal, NUNCA se modifica localStorage
 */

const ORIGINAL_UNREAD_KEY = 'realmaker_original_unread_conversations'; // localStorage - persiste entre sesiones
const READ_IN_SESSION_KEY = 'realmaker_read_conversations_session'; // sessionStorage - solo durante la sesión

/**
 * Obtener los IDs de conversaciones originalmente no leídas desde localStorage
 */
function getOriginalUnreadConversations(): Set<string> {
  try {
    const stored = localStorage.getItem(ORIGINAL_UNREAD_KEY);
    if (!stored) {
      return new Set();
    }
    const array = JSON.parse(stored) as string[];
    return new Set(array);
  } catch (error) {
    console.error('Error al leer conversaciones no leídas originales:', error);
    return new Set();
  }
}

/**
 * Guardar los IDs de conversaciones originalmente no leídas en localStorage
 */
function saveOriginalUnreadConversations(unreadIds: Set<string>): void {
  try {
    const array = Array.from(unreadIds);
    localStorage.setItem(ORIGINAL_UNREAD_KEY, JSON.stringify(array));
  } catch (error) {
    console.error('Error al guardar conversaciones no leídas originales:', error);
  }
}

/**
 * Obtener los IDs de conversaciones leídas durante esta sesión desde sessionStorage
 */
function getReadInSession(): Set<string> {
  try {
    const stored = sessionStorage.getItem(READ_IN_SESSION_KEY);
    if (!stored) {
      return new Set();
    }
    const array = JSON.parse(stored) as string[];
    return new Set(array);
  } catch (error) {
    console.error('Error al leer conversaciones leídas en sesión:', error);
    return new Set();
  }
}

/**
 * Guardar los IDs de conversaciones leídas durante esta sesión en sessionStorage
 */
function saveReadInSession(readIds: Set<string>): void {
  try {
    const array = Array.from(readIds);
    sessionStorage.setItem(READ_IN_SESSION_KEY, JSON.stringify(array));
  } catch (error) {
    console.error('Error al guardar conversaciones leídas en sesión:', error);
  }
}

/**
 * Obtener los IDs de conversaciones no leídas actuales
 * (Originales - las leídas en esta sesión)
 */
export function getUnreadConversations(): Set<string> {
  const originalUnread = getOriginalUnreadConversations();
  const readInSession = getReadInSession();
  
  // Filtrar las conversaciones que ya fueron leídas en esta sesión
  const currentUnread = new Set<string>();
  originalUnread.forEach(id => {
    if (!readInSession.has(id)) {
      currentUnread.add(id);
    }
  });
  
  return currentUnread;
}

/**
 * Guardar los IDs de conversaciones no leídas ORIGINALES
 * IMPORTANTE: Esta función solo debe usarse para inicializar el estado original,
 * NO para operaciones normales durante la sesión.
 * Durante la sesión, usa markConversationAsRead() o markConversationAsUnread()
 */
export function saveUnreadConversations(unreadIds: Set<string>): void {
  try {
    // Actualizar las conversaciones originales no leídas en localStorage
    saveOriginalUnreadConversations(unreadIds);
    
    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
      detail: { count: unreadIds.size, unreadIds: Array.from(unreadIds) }
    }));
  } catch (error) {
    console.error('Error al guardar conversaciones no leídas:', error);
  }
}

/**
 * Marcar una conversación como leída
 */
export function markConversationAsRead(conversationId: string): void {
  const readInSession = getReadInSession();
  
  // Agregar a las leídas en esta sesión
  if (!readInSession.has(conversationId)) {
    readInSession.add(conversationId);
    saveReadInSession(readInSession);
    
    // Disparar evento para actualizar contadores
    const currentUnread = getUnreadConversations();
    window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
      detail: { count: currentUnread.size, unreadIds: Array.from(currentUnread) }
    }));
  }
}

/**
 * Marcar múltiples conversaciones como leídas
 */
export function markConversationsAsRead(conversationIds: string[]): void {
  const readInSession = getReadInSession();
  let hasChanges = false;
  
  conversationIds.forEach(id => {
    if (!readInSession.has(id)) {
      readInSession.add(id);
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    saveReadInSession(readInSession);
    
    // Disparar evento para actualizar contadores
    const currentUnread = getUnreadConversations();
    window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
      detail: { count: currentUnread.size, unreadIds: Array.from(currentUnread) }
    }));
  }
}

/**
 * Marcar una conversación como no leída
 */
export function markConversationAsUnread(conversationId: string): void {
  const originalUnread = getOriginalUnreadConversations();
  const readInSession = getReadInSession();
  
  // Agregar a las originales no leídas
  if (!originalUnread.has(conversationId)) {
    originalUnread.add(conversationId);
    saveOriginalUnreadConversations(originalUnread);
  }
  
  // Quitar de las leídas en esta sesión (si estaba)
  if (readInSession.has(conversationId)) {
    readInSession.delete(conversationId);
    saveReadInSession(readInSession);
  }
  
  // Disparar evento para actualizar contadores
  const currentUnread = getUnreadConversations();
  window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
    detail: { count: currentUnread.size, unreadIds: Array.from(currentUnread) }
  }));
}

/**
 * Obtener el contador de conversaciones no leídas
 */
export function getUnreadCount(): number {
  return getUnreadConversations().size;
}

/**
 * Verificar si una conversación está no leída
 */
export function isConversationUnread(conversationId: string): boolean {
  return getUnreadConversations().has(conversationId);
}

/**
 * Inicializar conversaciones no leídas (para cuando se carga la app por primera vez)
 */
export function initializeUnreadConversations(conversationIds: string[]): void {
  const existingUnread = getOriginalUnreadConversations();
  
  // Si no hay datos guardados, inicializar con los IDs proporcionados
  if (existingUnread.size === 0 && conversationIds.length > 0) {
    saveOriginalUnreadConversations(new Set(conversationIds));
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
      detail: { count: conversationIds.length, unreadIds: conversationIds }
    }));
  }
}

/**
 * Resetear todas las conversaciones no leídas (útil para testing o reset)
 */
export function resetUnreadConversations(): void {
  localStorage.removeItem(ORIGINAL_UNREAD_KEY);
  sessionStorage.removeItem(READ_IN_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
    detail: { count: 0, unreadIds: [] }
  }));
}

/**
 * Limpiar las conversaciones leídas de la sesión actual
 * Llamar esto al cerrar sesión para que vuelvan a aparecer como no leídas
 */
export function clearSessionReadConversations(): void {
  sessionStorage.removeItem(READ_IN_SESSION_KEY);
  
  // Disparar evento con el conteo original
  const originalUnread = getOriginalUnreadConversations();
  window.dispatchEvent(new CustomEvent('unreadConversationsChanged', {
    detail: { count: originalUnread.size, unreadIds: Array.from(originalUnread) }
  }));
}
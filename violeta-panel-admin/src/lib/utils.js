// Formatear tiempo relativo (ej: "hace 5 min")
export function formatTimeAgo(isoDate) {
  if (!isoDate) return '—';
  
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'ahora';
  if (diffMins < 60) return `hace ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `hace ${diffDays}d`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `hace ${diffMonths}m`;
}

// Formatear fecha completa
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Badge de estado de incidente
export function getStatusBadge(status) {
  const badges = {
    active: { tone: 'danger', label: 'Activo' },
    attended: { tone: 'warn', label: 'Atendido' },
    closed: { tone: 'ok', label: 'Cerrado' }
  };
  return badges[status] || { tone: 'neutral', label: status };
}

// Concatenar clases CSS
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

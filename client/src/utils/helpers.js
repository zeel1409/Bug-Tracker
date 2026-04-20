// Helper to get badge CSS class for priority/status/type
export function priorityBadge(priority) {
  return `badge badge-${priority}`;
}

export function typeBadge(type) {
  return `badge badge-${type}`;
}

export function statusBadge(status) {
  return `badge badge-${status}`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

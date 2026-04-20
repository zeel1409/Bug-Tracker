import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import AppLayout from '../components/layout/AppLayout';
import CreateTicketModal from '../components/tickets/CreateTicketModal';
import TicketDetailModal from '../components/tickets/TicketDetailModal';
import { priorityBadge, typeBadge, statusBadge, formatDate, getInitials } from '../utils/helpers';
import { Plus, Search, Filter } from 'lucide-react';

const PRIORITY_OPTIONS = ['', 'low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['', 'todo', 'inprogress', 'done'];

export default function TicketsPage() {
  const { activeProject, tickets, fetchProjects, fetchTickets } = useProject();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProjects().catch(() => { }); }, []);

  useEffect(() => {
    if (activeProject) {

      setLoading(true);
      fetchTickets(activeProject._id, {
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        search: filters.search || undefined
      }).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?._id, filters.status, filters.priority]);

  // client-side search filter for real-time input
  const displayed = filters.search
    ? tickets.filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()))
    : tickets;

  const members = activeProject?.members || [];

  return (
    <AppLayout>
      <div style={{ padding: 'clamp(14px, 4vw, 24px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-800">All Tickets</h1>
            <p className="text-xs text-[#6b7280] mt-0.5">
              {activeProject ? activeProject.title : 'Select a project'} · {displayed.length} results
            </p>
          </div>
          {activeProject && (
            <button onClick={() => setShowCreate(true)} className="btn btn-primary">
              <Plus size={14} /> New Ticket
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search tickets..."
              className="form-input pl-8 text-xs py-2" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="form-input text-xs py-2 w-32">
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
              className="form-input text-xs py-2 w-32">
              <option value="">All Priority</option>
              {PRIORITY_OPTIONS.filter(Boolean).map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets table */}
        {!activeProject ? (
          <div className="text-center py-16 text-slate-400 text-sm">Select a project from the sidebar</div>
        ) : loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No tickets found matching your filters</div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table className="w-full text-xs" style={{ minWidth: 600 }}>
              <thead>
                <tr className="border-b border-[#1e2335] text-slate-400 uppercase tracking-wide text-[10px]">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Assignee</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((t, i) => (
                  <tr key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`border-b border-slate-100 cursor-pointer hover:bg-white transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
                    <td className="px-4 py-3 text-slate-400">#{t.ticketNumber}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-xs">
                      <span className="truncate block">{t.title}</span>
                    </td>
                    <td className="px-4 py-3"><span className={typeBadge(t.type)}>{t.type}</span></td>
                    <td className="px-4 py-3"><span className={priorityBadge(t.priority)}>{t.priority}</span></td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(t.status)}>
                        {t.status === 'inprogress' ? 'In Progress' : t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.assignee ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center text-[9px] font-bold text-slate-800">
                            {getInitials(t.assignee.name)}
                          </div>
                          <span className="text-slate-500">{t.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateTicketModal
          projectId={activeProject._id}
          members={members}
          onClose={() => { setShowCreate(false); fetchTickets(activeProject._id); }} />
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          members={members}
          onClose={() => { setSelectedTicket(null); if (activeProject) fetchTickets(activeProject._id); }} />
      )}
    </AppLayout>
  );
}

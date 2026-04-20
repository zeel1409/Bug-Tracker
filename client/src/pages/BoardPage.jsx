import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import AppLayout from '../components/layout/AppLayout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CreateTicketModal from '../components/tickets/CreateTicketModal';
import TicketDetailModal from '../components/tickets/TicketDetailModal';
import { Plus, RefreshCw } from 'lucide-react';

export default function BoardPage() {
  const { activeProject, tickets, fetchProjects, fetchTickets } = useProject();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeProject) {
      setLoading(true);
      fetchTickets(activeProject._id).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?._id]);

  const members = activeProject?.members || [];

  const handleRefresh = () => {
    if (activeProject) {
      fetchTickets(activeProject._id);
    }
  };

  return (
    <AppLayout>
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>
              {activeProject ? activeProject.title : 'Kanban Board'}
            </h1>
            <p style={{ fontSize: 12, marginTop: 2, color: '#94a3b8', margin: '2px 0 0' }}>
              {activeProject ? `${tickets.length} tickets · Drag to change status` : 'Select a project from the sidebar'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handleRefresh} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
              <RefreshCw size={14} />
            </button>
            {activeProject && (
              <button onClick={() => setShowCreate(true)} className="btn btn-primary">
                <Plus size={14} /> New Ticket
              </button>
            )}
          </div>
        </div>

        {!activeProject ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm mb-2" style={{color:'#94a3b8'}}>No project selected</p>
              <p className="text-xs" style={{color:'#cbd5e1'}}>Create or select a project from the sidebar</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{color:'#94a3b8'}}>Loading tickets...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <KanbanBoard tickets={tickets} onTicketClick={setSelectedTicket} />
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

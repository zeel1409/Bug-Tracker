import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import AppLayout from '../components/layout/AppLayout';
import {
  Bug, CheckCircle, Clock, AlertTriangle,
  FolderOpen, Plus, ChevronRight
} from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, tickets, fetchProjects, fetchTickets, activeProject, setActiveProject } = useProject();
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (activeProject) fetchTickets(activeProject._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  /* ── Computed stats ── */
  const totalTickets = tickets.length;
  const openTickets  = tickets.filter(t => t.status === 'todo').length;
  const inProgress   = tickets.filter(t => t.status === 'inprogress').length;
  const done         = tickets.filter(t => t.status === 'done').length;
  const critical     = tickets.filter(t => t.priority === 'critical').length;
  const recent       = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statCards = [
    { label: 'Total Tickets', value: totalTickets, icon: Bug,          color: 'indigo' },
    { label: 'Open / To Do',  value: openTickets,  icon: Clock,         color: 'slate'  },
    { label: 'In Progress',   value: inProgress,   icon: AlertTriangle, color: 'yellow' },
    { label: 'Completed',     value: done,          icon: CheckCircle,   color: 'green'  },
  ];

  const iconColors = {
    indigo: '#818cf8',
    slate:  '#94a3b8',
    yellow: '#fbbf24',
    green:  '#4ade80',
  };

  const handleProjectClick = (p) => {
    setActiveProject(p);
    navigate('/board');
  };

  return (
    <AppLayout>
      <div className="dash-page">

        {/* ── Header ── */}
        <div className="dash-header">
          <h1 className="dash-greeting">
            Hey,{' '}
            <span>{user?.name?.split(' ')[0] || 'there'}</span>{' '}
            👋
          </h1>
          <p className="dash-subtext">
            {activeProject
              ? `Viewing project: ${activeProject.title} · ${totalTickets} ticket${totalTickets !== 1 ? 's' : ''}`
              : 'Create or select a project from the sidebar to get started'}
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="dash-stats">
          {statCards.map(card => (
            <div key={card.label} className={`dash-stat-card ${card.color}`}>
              <div className="dash-stat-icon-wrap">
                <card.icon size={20} color={iconColors[card.color]} />
              </div>
              <p className="dash-stat-value">{card.value}</p>
              <p className="dash-stat-label">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── Two Column ── */}
        <div className="dash-grid">

          {/* Projects */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <FolderOpen size={14} />
                Your Projects
              </h2>
              <span className="dash-section-count">{projects.length}</span>
            </div>

            {projects.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon">
                  <FolderOpen size={20} color="#1f2937" />
                </div>
                <p>No projects yet</p>
                <small>Click &quot;+&quot; in the sidebar to create one</small>
              </div>
            ) : (
              projects.slice(0, 4).map(p => (
                <div
                  key={p._id}
                  className="dash-project-card"
                  onClick={() => handleProjectClick(p)}
                >
                  <div className="dash-project-logo">
                    {(p.key?.[0] || p.title[0]).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="dash-project-name">{p.title}</p>
                    <p className="dash-project-meta">
                      {p.members?.length || 1} member{p.members?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight size={16} className="dash-project-arrow" />
                </div>
              ))
            )}

            {projects.length === 0 && (
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <button
                  className="dash-quick-btn"
                  onClick={() => navigate('/board')}
                >
                  <Plus size={14} />
                  New Project
                </button>
              </div>
            )}
          </div>

          {/* Recent Tickets */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Bug size={14} />
                Recent Tickets
              </h2>
              <span className="dash-section-count">{recent.length}</span>
            </div>

            {recent.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon">
                  <Bug size={20} color="#1f2937" />
                </div>
                <p>No tickets yet</p>
                <small>
                  {activeProject
                    ? 'Create your first ticket on the board'
                    : 'Select a project first'}
                </small>
                {activeProject && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      className="dash-quick-btn"
                      onClick={() => navigate('/board')}
                    >
                      <Plus size={14} />
                      Create Ticket
                    </button>
                  </div>
                )}
              </div>
            ) : (
              recent.map(t => (
                <div
                  key={t._id}
                  className="dash-ticket-row"
                  onClick={() => navigate('/tickets')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="dash-ticket-title">{t.title}</p>
                    <p className="dash-ticket-meta">
                      #{t.ticketNumber} ·{' '}
                      {t.status === 'inprogress' ? 'In Progress' : t.status}
                      {t.assignee ? ` · ${t.assignee.name}` : ''}
                    </p>
                  </div>
                  <span className={`dash-badge ${t.priority}`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Critical Alert ── */}
        {critical > 0 && (
          <div className="dash-alert">
            <div className="dash-alert-icon">
              <AlertTriangle size={18} color="#f87171" />
            </div>
            <p>
              You have <strong>{critical} critical</strong>{' '}
              ticket{critical > 1 ? 's' : ''} requiring immediate attention.{' '}
              <span
                style={{ color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/tickets')}
              >
                View now →
              </span>
            </p>
          </div>
        )}

      </div>
    </AppLayout>
  );
}

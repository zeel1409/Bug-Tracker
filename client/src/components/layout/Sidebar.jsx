/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import {
  Bug, LayoutDashboard, Kanban, LogOut,
  Plus, FolderOpen
} from 'lucide-react';
import './sidebar.css';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject, createProject } = useProject();
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      await createProject({ title: newProjectName });
      setNewProjectName('');
      setShowNewInput(false);
      navigate('/board');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/board', icon: Kanban, label: 'Kanban Board' },
    { to: '/tickets', icon: Bug, label: 'All Tickets' },
  ];

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>

      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Bug size={18} color="white" />
        </div>
        <div>
          <div className="sidebar-brand-name">BugTracker</div>
          <div className="sidebar-brand-tag">Issue Tracker</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">

        {/* Main nav */}
        <div className="sidebar-section-label">Main Menu</div>
        {navLinks.map(({ to, icon: NavIcon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-link-icon">
              <NavIcon size={16} />
            </span>
            {label}
          </Link>
        ))}

        {/* Projects */}
        <div className="sidebar-projects-header">
          <span className="sidebar-projects-title">
            <FolderOpen size={10} style={{ display: 'inline', marginRight: 4 }} />
            Projects
          </span>
          <button
            className="sidebar-projects-add"
            onClick={() => setShowNewInput(true)}
            title="New project"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* New project input */}
        {showNewInput && (
          <form onSubmit={handleCreateProject} style={{ padding: '0 4px 6px' }}>
            <input
              autoFocus
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Project name…"
              className="sidebar-new-input"
              onBlur={() => { if (!newProjectName) setShowNewInput(false); }}
            />
          </form>
        )}

        {/* Project list */}
        {projects.length === 0 ? (
          <p style={{ fontSize: 12, color: '#1f2937', padding: '6px 10px', fontStyle: 'italic' }}>
            No projects yet
          </p>
        ) : (
          projects.map(p => (
            <button
              key={p._id}
              className={`sidebar-project-item ${activeProject?._id === p._id ? 'active' : ''}`}
              onClick={() => { setActiveProject(p); navigate('/board'); onClose(); }}
            >
              <div className="sidebar-project-avatar">
                {(p.key?.[0] || p.title[0]).toUpperCase()}
              </div>
              <span className="sidebar-project-name">{p.title}</span>
            </button>
          ))
        )}
      </nav>

      {/* ── User ── */}
      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={13} />
          Sign out
        </button>
      </div>

    </aside>
  );
}

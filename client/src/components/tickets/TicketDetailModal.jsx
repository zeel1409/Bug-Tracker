import { useState, useEffect } from 'react';
import { X, Trash2, MessageSquare, Send } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { priorityBadge, typeBadge, statusBadge, formatDate, getInitials } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['todo', 'inprogress', 'done'];

export default function TicketDetailModal({ ticket, onClose, members = [] }) {
  const { updateTicket, deleteTicket } = useProject();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description || '',
    priority: ticket.priority,
    status: ticket.status,
    assignee: ticket.assignee?._id || ''
  });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    api.get('/comments', { params: { ticketId: ticket._id } })
      .then(res => setComments(res.data))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [ticket._id]);

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      await updateTicket(ticket._id, form);
      toast.success('Ticket updated');
      setEditing(false);
      onClose();
    } catch {
      toast.error('Update failed');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket(ticket._id);
      toast.success('Ticket deleted');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post('/comments', { ticketId: ticket._id, text: commentText });
      setComments(prev => [...prev, res.data]);
      setCommentText('');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={typeBadge(ticket.type)}>{ticket.type}</span>
              <span className={priorityBadge(ticket.priority)}>{ticket.priority}</span>
              <span className={statusBadge(ticket.status)}>{ticket.status === 'inprogress' ? 'In Progress' : ticket.status}</span>
            </div>
            <p className="text-[10px] text-[#5a637a]">
              #{ticket.ticketNumber} · Reported by {ticket.reporter?.name} · {formatDate(ticket.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {ticket.reporter?._id === user?._id && (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="text-[#6b7280] hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            )}
            <button onClick={onClose} className="text-[#6b7280] hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Delete confirm */}
        {showDeleteConfirm && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-3 mb-4 flex items-center justify-between">
            <p className="text-xs text-red-300">Are you sure you want to delete this ticket?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost text-xs py-1 px-2">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger text-xs py-1 px-2">Delete</button>
            </div>
          </div>
        )}

        {/* Edit form or view */}
        {editing ? (
          <div className="space-y-3 mb-4">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="form-input text-sm font-medium" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} className="form-input text-sm resize-none" placeholder="Description..." />
            <div className="grid grid-cols-3 gap-2">
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="form-input text-xs">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="form-input text-xs">
                {STATUSES.map(s => <option key={s} value={s}>{s === 'inprogress' ? 'In Progress' : s}</option>)}
              </select>
              <select value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} className="form-input text-xs">
                <option value="">Unassigned</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleSaveEdit} disabled={savingEdit} className="btn btn-primary">
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white mb-2">{ticket.title}</h2>
            {ticket.description && (
              <p className="text-sm text-[#8b93b0] leading-relaxed mb-3">{ticket.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-[#5a637a]">
              <span>Assignee: <span className="text-[#8b93b0]">{ticket.assignee?.name || 'Unassigned'}</span></span>
            </div>
            <button onClick={() => setEditing(true)}
              className="mt-3 text-xs text-[#5865f2] hover:underline">Edit ticket</button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[#1e2335] my-4" />

        {/* Comments */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={14} className="text-[#5a637a]" />
            <span className="text-xs font-semibold text-[#8b93b0] uppercase tracking-wide">Comments</span>
          </div>

          {loadingComments ? (
            <p className="text-xs text-[#5a637a]">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-[#5a637a] italic">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
              {comments.map(c => (
                <div key={c._id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2e3347] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {getInitials(c.author?.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-xs font-medium text-white">{c.author?.name}</span>
                      <span className="text-[10px] text-[#5a637a]">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#8b93b0]">{c.text}</p>
                  </div>
                  {c.author?._id === user?._id && (
                    <button onClick={() => handleDeleteComment(c._id)}
                      className="text-[#3d4154] hover:text-red-400 self-start mt-1">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="form-input text-xs flex-1" />
            <button type="submit" className="btn btn-primary px-3 py-1.5">
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

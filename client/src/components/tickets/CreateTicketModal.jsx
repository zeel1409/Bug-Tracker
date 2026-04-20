import { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const TYPES = ['bug', 'feature', 'task', 'improvement'];

export default function CreateTicketModal({ onClose, projectId, members = [] }) {
  const { createTicket, generateAiDescription } = useProject();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'bug',
    priority: 'medium',
    assigneeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title first to generate a description.');
      return;
    }
    setAiLoading(true);
    try {
      const desc = await generateAiDescription(form.title);
      setForm(prev => ({ ...prev, description: desc }));
      toast.success('Description generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate explanation');
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Ticket title is required');
      return;
    }
    setLoading(true);
    try {
      await createTicket({ ...form, projectId });
      toast.success('Ticket created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Create New Ticket</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6b7280] mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Login button not working on mobile"
              className="form-input" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-[#6b7280]">Description</label>
              <button 
                type="button" 
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#5865f2] hover:text-[#7c3aed] transition-colors disabled:opacity-50"
              >
                <Wand2 size={12} />
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={4} placeholder="Describe the issue..."
              className="form-input resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#6b7280] mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="form-input">
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6b7280] mb-1">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#6b7280] mb-1">Assign To</label>
            <select name="assigneeId" value={form.assigneeId} onChange={handleChange} className="form-input">
              <option value="">Unassigned</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

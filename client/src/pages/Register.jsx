import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Bug, Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import './auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength calculation
  const getStrength = () => {
    if (form.password.length === 0) return 0;
    if (form.password.length < 6) return 1;
    if (form.password.length < 10) return 2;
    return 3;
  };

  const strength = getStrength();
  const strengthColors = ['', '#ef4444', '#eab308', '#22c55e'];
  const strengthLabels = ['', 'Too short', 'Good', 'Strong ✓'];

  const perks = [
    'Unlimited bugs & projects',
    'Kanban drag-and-drop board',
    'Team member invites',
  ];

  return (
    <div className="auth-root">

      {/* Animated background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-wrapper">

        {/* ── Card ── */}
        <div className="auth-card">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-logo">
              <Bug size={22} color="white" />
            </div>
            <span className="auth-logo-text">BugTracker</span>
          </div>

          {/* Title */}
          <div className="auth-title-block">
            <div className="auth-free-badge">
              <span className="auth-free-dot" />
              Free forever — no card needed
            </div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Join teams shipping faster with better bug tracking
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">

            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={15} className="auth-icon" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Kumar"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-icon" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-icon" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="auth-input auth-input-pass"
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{
                          background: i <= strength
                            ? strengthColors[strength]
                            : 'rgba(255,255,255,0.07)'
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="auth-strength-label"
                    style={{ color: strengthColors[strength] }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading
                ? <span className="auth-spinner" />
                : <><span>Create Free Account</span> <ArrowRight size={16} /></>
              }
            </button>

          </form>

          {/* Feature perks */}
          <div className="auth-perks">
            {perks.map(perk => (
              <div key={perk} className="auth-perk">
                <CheckCircle2 size={14} color="#22c55e" strokeWidth={2.5} />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span />
            <p>Already have an account?</p>
            <span />
          </div>

          {/* Login link */}
          <Link to="/login" className="auth-alt-btn">
            Sign in to existing account
          </Link>

        </div>

        {/* Tech stack pills */}
        <div className="auth-features">
          {['Jira-like Tracker', 'JWT Secured', 'MongoDB + Express', 'React + Node.js'].map(label => (
            <div key={label} className="auth-feature-pill">
              <span className="auth-feature-dot" />
              {label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

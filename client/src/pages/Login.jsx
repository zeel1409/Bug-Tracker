import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Bug, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import './auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your workspace to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">

            {/* Email field */}
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

            {/* Password field */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-icon" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading
                ? <span className="auth-spinner" />
                : <><span>Sign In</span> <ArrowRight size={16} /></>
              }
            </button>

          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span />
            <p>Don&apos;t have an account?</p>
            <span />
          </div>

          {/* Register link */}
          <Link to="/register" className="auth-alt-btn">
            Create a free account
          </Link>

          {/* Security badge */}
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            <p>Secure login — powered by JWT authentication</p>
          </div>

        </div>

        {/* Feature pills below card */}
        <div className="auth-features">
          {['Kanban Board', 'Team Collaboration', 'Priority Tracking', 'Fast & Secure'].map(label => (
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

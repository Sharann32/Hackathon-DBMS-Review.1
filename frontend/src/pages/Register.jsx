import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Settings, Shield, UserCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password, role);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-grid" style={{ background: '#0a0a0f' }}>
      {/* Ambient Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Register Card */}
      <div className="relative w-full max-w-md fade-in-up" style={{ zIndex: 10 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 pulse-glow" 
               style={{ background: 'var(--gradient)' }}>
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
            Create <span className="gradient-text">Account</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Join the Settings Management System
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: '#475569' }} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: '#475569' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#475569' }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <p className="error-msg" style={{ marginTop: '6px', color: '#94a3b8' }}>
                Minimum 6 characters required
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="input-label">Account Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5" style={{ color: '#475569' }} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  required
                  style={{ paddingLeft: '44px', cursor: 'pointer' }}
                >
                  <option value="USER">User (Regular Access)</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </select>
              </div>
              <div style={{ 
                marginTop: '10px',
                padding: '10px 14px',
                background: role === 'ADMIN' 
                  ? 'rgba(239, 68, 68, 0.08)' 
                  : 'rgba(6, 182, 212, 0.08)',
                border: role === 'ADMIN'
                  ? '1px solid rgba(239, 68, 68, 0.2)'
                  : '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px'
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: role === 'ADMIN' ? '#f87171' : '#818cf8',
                  fontFamily: "'Fira Code', monospace"
                }}>
                  {role === 'ADMIN' 
                    ? '⚡ Admin: Full system access including user management' 
                    : '✓ User: Personal settings and view system settings'}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
              style={{ marginTop: '20px' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span style={{ 
                padding: '0 16px', 
                background: '#13131f', 
                color: '#94a3b8', 
                fontSize: '13px' 
              }}>
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2"
              style={{ 
                color: 'var(--accent-3)', 
                fontSize: '14px', 
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              Sign in instead
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6" style={{ color: '#475569', fontSize: '13px' }}>
          © 2026 Settings Management System
        </p>
      </div>
    </div>
  );
};

export default Register;

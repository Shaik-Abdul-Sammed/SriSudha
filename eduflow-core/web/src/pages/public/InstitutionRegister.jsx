import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { validateForm, validators } from '../../utils/validators';
import { ShieldCheck, Building, User, Mail, Lock, Globe } from 'lucide-react';

export default function InstitutionRegister() {
  const [formData, setFormData] = useState({
    institutionName: '',
    subdomain: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { register } = useAuth();

  const schema = {
    institutionName: { required: true, minLength: 3 },
    subdomain: { required: true, minLength: 3, pattern: /^[a-z0-9-]+$/ },
    adminName: { required: true, minLength: 3 },
    email: validators.email,
    password: validators.password,
    confirmPassword: validators.match(formData.password)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Auto-generate subdomain from institution name
    if (name === 'institutionName' && !formData.subdomain) {
      const generated = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, subdomain: generated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, schema);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register(formData);
      addToast(`Successfully registered ${formData.institutionName}! Workspace created at ${formData.subdomain}.eduflow.app`, 'success');
      navigate('/admin-dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--app-bg)' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              <Building size={20} />
            </div>
            <span className="fw-bold fs-4 text-gradient">EduFlow</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted d-none d-md-block">Already have an institution workspace?</span>
            <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center" style={{ marginTop: '80px', padding: '3rem 0' }}>
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left side branding */}
                <div className="col-12 col-md-4 d-none d-md-block p-4 text-white d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, var(--svc-navy) 0%, var(--svc-blue) 100%)' }}>
                  <div>
                    <h3 className="fw-bold mb-3">CampusCore Platform</h3>
                    <p className="opacity-75 small">Join hundreds of institutions managing their entire campus on EduFlow.</p>
                  </div>
                  <div>
                    <ul className="list-unstyled mb-0 small opacity-75">
                      <li className="mb-2 d-flex gap-2 align-items-center"><ShieldCheck size={16} /> Enterprise Security</li>
                      <li className="mb-2 d-flex gap-2 align-items-center"><Globe size={16} /> Custom Subdomain</li>
                      <li className="d-flex gap-2 align-items-center"><Building size={16} /> Multi-Role ERP</li>
                    </ul>
                  </div>
                </div>

                {/* Right side form */}
                <div className="col-12 col-md-8 p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-1">Create Your Workspace</h2>
                    <p className="text-muted small">Set up EduFlow for your institution in minutes.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Institution Name */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Institution Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Building size={18} className="text-muted" /></span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ps-0 ${errors.institutionName ? 'is-invalid' : ''}`}
                          name="institutionName"
                          placeholder="e.g. Springfield High School"
                          value={formData.institutionName}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.institutionName && <div className="text-danger small mt-1">{errors.institutionName}</div>}
                    </div>

                    {/* Subdomain */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Workspace URL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Globe size={18} className="text-muted" /></span>
                        <input
                          type="text"
                          className={`form-control border-start-0 border-end-0 ps-0 ${errors.subdomain ? 'is-invalid' : ''}`}
                          name="subdomain"
                          placeholder="springfield"
                          value={formData.subdomain}
                          onChange={handleChange}
                        />
                        <span className="input-group-text bg-light text-muted">.eduflow.app</span>
                      </div>
                      {errors.subdomain && <div className="text-danger small mt-1">{errors.subdomain}</div>}
                    </div>

                    <hr className="my-4 text-muted" />

                    {/* Admin Name & Email */}
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-semibold text-muted">Admin Full Name</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted" /></span>
                          <input
                            type="text"
                            className={`form-control border-start-0 ps-0 ${errors.adminName ? 'is-invalid' : ''}`}
                            name="adminName"
                            placeholder="John Doe"
                            value={formData.adminName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.adminName && <div className="text-danger small mt-1">{errors.adminName}</div>}
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-semibold text-muted">Admin Email</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted" /></span>
                          <input
                            type="email"
                            className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                            name="email"
                            placeholder="admin@school.edu"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                      </div>
                    </div>

                    {/* Passwords */}
                    <div className="row g-3 mb-4">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-semibold text-muted">Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
                          <input
                            type="password"
                            className={`form-control border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-semibold text-muted">Confirm Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
                          <input
                            type="password"
                            className={`form-control border-start-0 ps-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <><span className="spinner-border spinner-border-sm me-2" /> Creating Workspace...</>
                      ) : (
                        'Register Institution'
                      )}
                    </button>
                    
                    <p className="text-center text-muted small mt-3 mb-0">
                      By registering, you agree to EduFlow's Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- STYLES (Embedded for Single-File Execution) ---
const GlobalStyles: FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      --primary-color: #4f46e5;
      --primary-hover: #4338ca;
      --secondary-color: #6b7280;
      --secondary-hover: #4b5563;
      --background-color: #f9fafb;
      --card-background: #ffffff;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --border-color: #e5e7eb;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--background-color);
      color: var(--text-primary);
      margin: 0;
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    }

    .form-card {
      background-color: var(--card-background);
      padding: 2.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      width: 100%;
      max-width: 28rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .input-group {
      margin-bottom: 1.25rem;
    }

    .input-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .input-field {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      box-sizing: border-box;
      transition: all 0.2s;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    .btn-primary:hover {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    }
    
    .btn-secondary {
        background-color: var(--secondary-color);
        color: white;
    }
    .btn-secondary:hover {
        background-color: var(--secondary-hover);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: -0.75rem;
      margin-bottom: 1rem;
    }

    .dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: auto;
    }

    .navbar {
        background-color: var(--card-background);
        padding: 1rem 2rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .navbar-brand {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--primary-color);
    }

    .page-header {
        font-size: 2.25rem;
        font-weight: 800;
        margin-bottom: 2rem;
        color: var(--text-primary);
    }

    .stat-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background-color: var(--card-background);
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        border: 1px solid var(--border-color);
    }

    .stat-card-icon {
        background-color: #e0e7ff;
        color: var(--primary-color);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .stat-card-icon svg {
        width: 32px;
        height: 32px;
    }
    
    .stat-card-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-secondary);
    }

    .stat-card-info p {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-primary);
    }
    
    .table-container {
        overflow-x: auto;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1.5rem;
    }

    .table th, .table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .table th {
        background-color: #f9fafb;
        font-weight: 600;
        color: #4b5563;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .table tbody tr:hover {
        background-color: #f3f4f6;
    }

    .modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(17, 24, 39, 0.5);
        display: flex; justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
        background-color: white; padding: 2rem; border-radius: 0.75rem;
        width: 100%; max-width: 32rem;
    }
    .filter-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        background-color: #f9fafb;
        border-radius: 0.5rem;
    }
  `}</style>
);

// --- SVG ICON COMPONENTS ---
const UsersIcon: FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.68c.11-.32.22-.658.33-1.002h.001M.625 10.625a9.375 9.375 0 1118.75 0 9.375 9.375 0 01-18.75 0z" /></svg>);
const StoreIcon: FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h.001M10.5 21v-7.5A.75.75 0 009.75 12h-.001M16.5 21v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m-4.5 0v-7.5A.75.75 0 006.75 12h-.001M18.75 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const RatingIcon: FC = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>);
const PlusIcon: FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);

// --- 1. API & AUTHENTICATION LAYER ---
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// TypeScript Types
type UserRole = 'System Administrator' | 'Normal User' | 'Store Owner';
type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    address?: string;
};
type Store = {
    id: number;
    name: string;
    email: string;
    address: string;
    Owner?: { name: string };
    overallRating?: number;
    userSubmittedRating?: number;
};
type Rating = {
    id: number;
    rating: number;
    User: { name: string };
};
type OwnerDashboardData = {
    storeName: string;
    averageRating: number;
    usersWhoRated: Rating[];
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<User>;
    signup: (userData: any) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
};

const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (userData: any) => api.post('/auth/signup', userData),
};
const storeService = {
  getStores: (searchTerm = '') => api.get<Store[]>(`/stores?search=${searchTerm}`),
};
const ratingService = {
  submitOrUpdate: (storeId: number, rating: number) => api.post('/ratings', { storeId, rating }),
};
const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (filters = {}) => api.get<User[]>('/admin/users', { params: filters }),
  getStores: (filters = {}) => api.get<Store[]>('/admin/stores', { params: filters }),
  createUser: (userData: any) => api.post('/admin/users', userData),
  createStore: (storeData: any) => api.post('/admin/stores', storeData),
};
const ownerService = {
    getDashboard: () => api.get<OwnerDashboardData>('/owner/dashboard'),
};

const AuthContext = createContext<AuthContextType | null>(null);

const getInitialUser = (): User | null => {
    try {
        const userItem = localStorage.getItem('user');
        return userItem ? JSON.parse(userItem) : null;
    } catch (error) {
        localStorage.removeItem('user');
        return null;
    }
};

const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser());

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await authService.login(email, password);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };
  
  const signup = async (userData: any) => {
      return await authService.signup(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, signup, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// --- 2. REUSABLE UI COMPONENTS ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { id: string; label: string; error?: string; }
const Input: FC<InputProps> = ({ id, label, error, ...props }) => (
  <div className="input-group">
    <label htmlFor={id} className="input-label">{label}</label>
    <input id={id} className="input-field" {...props} />
    {error && <p className="error-message">{error}</p>}
  </div>
);
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { id: string; label: string; children: ReactNode; }
const Select: FC<SelectProps> = ({ id, label, children, ...props }) => (
    <div className="input-group">
        <label htmlFor={id} className="input-label">{label}</label>
        <select id={id} className="input-field" {...props}>{children}</select>
    </div>
);
const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => <button className="btn btn-primary" {...props}>{children}</button>;
const Card: FC<{children: ReactNode, style?: React.CSSProperties}> = ({ children, style }) => <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', ...style }}>{children}</div>;
const Navbar: FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <nav className="navbar">
            <div className="navbar-brand">Store Rater</div>
            {user && (
                 <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <span style={{color: '#374151'}}>Welcome, {user.name}</span>
                    <button className="btn btn-secondary" onClick={handleLogout} style={{width: 'auto', padding: '0.5rem 1rem'}}>Logout</button>
                </div>
            )}
        </nav>
    );
};
const AddUserModal: FC<{show: boolean, onClose: () => void, onUserAdded: () => void}> = ({ show, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [error, setError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            setError("Please fill all required fields.");
            return;
        }
        try {
            await adminService.createUser(formData);
            alert('User created successfully!');
            onUserAdded();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user.');
        }
    };
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="form-title" style={{marginBottom: '2rem'}}>Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <Input id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleChange} required />
                    <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
                    <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                    <Input id="address" name="address" label="Address" type="text" value={formData.address} onChange={handleChange} />
                    <Select id="role" name="role" label="User Role" value={formData.role} onChange={handleChange}>
                        <option value="Normal User">Normal User</option>
                        <option value="Store Owner">Store Owner</option>
                        <option value="System Administrator">System Administrator</option>
                    </Select>
                    {error && <p className="error-message">{error}</p>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <Button type="button" onClick={onClose} style={{backgroundColor: '#6b7280'}}>Cancel</Button>
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const AddStoreModal: FC<{show: boolean, onClose: () => void, onStoreAdded: () => void}> = ({ show, onClose, onStoreAdded }) => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [storeOwners, setStoreOwners] = useState<User[]>([]);
    const [error, setError] = useState('');
    useEffect(() => {
        if (show) {
            const fetchOwners = async () => {
                try {
                    const { data } = await adminService.getUsers({ role: 'Store Owner' });
                    setStoreOwners(data);
                } catch (err) {
                    console.error("Failed to fetch store owners", err);
                }
            };
            fetchOwners();
        }
    }, [show]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.email || !formData.address || !formData.ownerId) {
            setError("Please fill all fields.");
            return;
        }
        try {
            await adminService.createStore(formData);
            alert('Store created successfully!');
            onStoreAdded();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create store.');
        }
    };
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="form-title" style={{marginBottom: '2rem'}}>Add New Store</h2>
                <form onSubmit={handleSubmit}>
                    <Input id="name" name="name" label="Store Name" type="text" value={formData.name} onChange={handleChange} required />
                    <Input id="email" name="email" label="Store Email" type="email" value={formData.email} onChange={handleChange} required />
                    <Input id="address" name="address" label="Store Address" type="text" value={formData.address} onChange={handleChange} required />
                    <Select id="ownerId" name="ownerId" label="Assign Store Owner" value={formData.ownerId} onChange={handleChange} required>
                        <option value="">Select an owner...</option>
                        {storeOwners.map(owner => <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>)}
                    </Select>
                    {error && <p className="error-message">{error}</p>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <Button type="button" onClick={onClose} style={{backgroundColor: '#6b7280'}}>Cancel</Button>
                        <Button type="submit">Create Store</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- 3. PAGE COMPONENTS ---
const LoginPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await login(email, password);
            navigate(getHomeRoute(loggedInUser));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        }
    };
    return (
       <div className="auth-container">
        <div className="form-card">
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-subtitle">Log in</p>
          <form onSubmit={handleSubmit}>
            <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
            <Button type="submit" style={{marginTop: '1rem'}}>Login</Button>
            <p className="link-text">Don't have an account? <Link to="/signup">Sign up</Link></p>
          </form>
        </div>
      </div>
    );
};
const SignupPage: FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    if (formData.name.length < 3 || formData.name.length > 30) newErrors.name = 'Name must be 3-30 characters.';
    if (formData.address.length > 400) newErrors.address = 'Address max 400 characters.';
    if (formData.password.length < 8 || formData.password.length > 16) newErrors.password = 'Password must be 8-16 characters.';
    else if (!/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/.test(formData.password)) newErrors.password = 'Needs one uppercase letter and one special character.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
        await signup(formData);
        alert('Signup successful! Please log in.');
        navigate('/login');
    } catch (err: any) {
        setApiError(err.response?.data?.message || 'Signup failed.');
    }
  };
  return (
    <div className="auth-container">
      <div className="form-card">
        <h1 className="form-title">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <Input id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleChange} required error={errors.name} />
          <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required error={errors.email} />
          <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required error={errors.password} />
          <Input id="address" name="address" label="Address" type="text" value={formData.address} onChange={handleChange} error={errors.address} />
          {apiError && <p className="error-message" style={{textAlign: 'center'}}>{apiError}</p>}
          <Button type="submit" style={{ marginTop: '1rem' }}>Sign Up</Button>
          <p className="link-text">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </div>
  );
};
const StoreCard: FC<{store: Store, onRatingChange: () => void}> = ({ store, onRatingChange }) => {
  const [userRating, setUserRating] = useState(store.userSubmittedRating || 0);
  const handleRatingSubmit = async (newRatingStr: string) => {
    const newRating = parseInt(newRatingStr, 10);
    try {
      await ratingService.submitOrUpdate(store.id, newRating);
      setUserRating(newRating);
      alert('Rating submitted successfully!');
      onRatingChange();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating.');
    }
  };
  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>{store.name}</h3>
      <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{store.address}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>Overall Rating:</strong> {(store.overallRating || 0).toFixed(1)} / 5</div>
        <div>
          <strong>Your Rating:</strong> {userRating > 0 ? `${userRating} / 5` : 'Not Rated'}
          <select onChange={(e) => handleRatingSubmit(e.target.value)} value={userRating} style={{ marginLeft: '1rem', padding: '0.25rem' }}>
            <option value="0" disabled>{userRating > 0 ? 'Change...' : 'Rate...'}</option>
            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </Card>
  );
};
const UserDashboard: FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await storeService.getStores(searchTerm);
      setStores(data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => { fetchStores(); }, 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchStores]);
  
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="page-header">Find and Rate Stores</h1>
        <Input id="search" label="" type="text" placeholder="Search stores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <div style={{ marginTop: '2rem' }}>
          {isLoading ? <p>Loading stores...</p> : stores.length > 0 ? stores.map(store => <StoreCard key={store.id} store={store} onRatingChange={fetchStores} />) : <p>No stores found.</p>}
        </div>
      </div>
    </>
  );
};
const AdminDashboard: FC = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isStoreModalOpen, setStoreModalOpen] = useState(false);
    const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getUsers(userFilters),
                adminService.getStores()
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    }, [userFilters]);

    useEffect(() => {
        const debounceFetch = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(debounceFetch);
    }, [fetchData]);

    const handleUserFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserFilters({ ...userFilters, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            <AddUserModal show={isUserModalOpen} onClose={() => setUserModalOpen(false)} onUserAdded={fetchData} />
            <AddStoreModal show={isStoreModalOpen} onClose={() => setStoreModalOpen(false)} onStoreAdded={fetchData} />
            <div className="dashboard-container">
                <h1 className="page-header">Admin Dashboard</h1>
                {isLoading ? <p>Loading...</p> : (
                    <>
                        <div className="stat-card-grid">
                            <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon />} />
                            <StatCard title="Total Stores" value={stats.totalStores} icon={<StoreIcon />} />
                            <StatCard title="Total Ratings" value={stats.totalRatings} icon={<RatingIcon />} />
                        </div>
                        <Card>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                <h2 style={{marginTop: 0, marginBottom: 0}}>Manage Entities</h2>
                                <div style={{display: 'flex', gap: '1rem'}}>
                                    <Button onClick={() => setStoreModalOpen(true)} style={{width: 'auto', padding: '0.5rem 1rem'}}><PlusIcon /> Add Store</Button>
                                    <Button onClick={() => setUserModalOpen(true)} style={{width: 'auto', padding: '0.5rem 1rem'}}><PlusIcon /> Add User</Button>
                                </div>
                            </div>
                            <h3 style={{marginTop: '2rem'}}>All Users</h3>
                            <div className="filter-bar">
                                <Input id="nameFilter" name="name" label="Filter by Name" type="text" value={userFilters.name} onChange={handleUserFilterChange} />
                                <Input id="emailFilter" name="email" label="Filter by Email" type="text" value={userFilters.email} onChange={handleUserFilterChange} />
                                <Select id="roleFilter" name="role" label="Filter by Role" value={userFilters.role} onChange={handleUserFilterChange}>
                                    <option value="">All Roles</option>
                                    <option value="Normal User">Normal User</option>
                                    <option value="Store Owner">Store Owner</option>
                                    <option value="System Administrator">System Administrator</option>
                                </Select>
                            </div>
                            <div className="table-container">
                              <table className="table">
                                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Address</th></tr></thead>
                                  <tbody>
                                      {users.map(user => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.address || 'N/A'}</td></tr>)}
                                  </tbody>
                              </table>
                            </div>
                            <h3 style={{marginTop: '2rem'}}>All Stores</h3>
                            <div className="table-container">
                              <table className="table">
                                  <thead><tr><th>Store Name</th><th>Email</th><th>Address</th><th>Owner</th></tr></thead>
                                  <tbody>
                                      {stores.map(store => <tr key={store.id}><td>{store.name}</td><td>{store.email}</td><td>{store.address}</td><td>{store.Owner?.name || 'N/A'}</td></tr>)}
                                  </tbody>
                              </table>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
};
const StatCard: FC<{title: string, value: number | string, icon: ReactNode}> = ({title, value, icon}) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    </div>
);
const StoreOwnerDashboard: FC = () => {
    const [dashboardData, setDashboardData] = useState<OwnerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchDashboard = async () => {
            setIsLoading(true);
            try {
                const { data } = await ownerService.getDashboard();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch owner dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);
    if (isLoading) return <><Navbar /><div className="dashboard-container"><p>Loading...</p></div></>;
    if (!dashboardData) return <><Navbar /><div className="dashboard-container"><p>Could not load dashboard data.</p></div></>;
    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h1 className="page-header">Dashboard for {dashboardData.storeName}</h1>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
                    <StatCard title="Average Rating" value={dashboardData.averageRating.toFixed(1)} icon={<RatingIcon />} />
                    <Card>
                        <h3 style={{marginTop: 0}}>Users Who Rated Your Store</h3>
                        <div className="table-container">
                          <table className="table">
                            <thead><tr><th>User Name</th><th>Rating Given</th></tr></thead>
                            <tbody>
                                {dashboardData.usersWhoRated.map(r => <tr key={r.id}><td>{r.User.name}</td><td>{r.rating}</td></tr>)}
                            </tbody>
                          </table>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

// --- 4. ROUTING LOGIC ---
const getHomeRoute = (user: User | null) => {
    if (!user) return '/login';
    switch (user.role) {
        case 'System Administrator': return '/admin';
        case 'Store Owner': return '/owner';
        default: return '/dashboard';
    }
};
const ProtectedRoute: FC<{children: ReactNode, allowedRoles?: UserRole[]}> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to={getHomeRoute(user)} replace />;
    return <>{children}</>;
};
const AppRoutes: FC = () => {
    const { isAuthenticated, user } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRoute(user)} /> : <LoginPage />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to={getHomeRoute(user)} /> : <SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Normal User']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['System Administrator']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/owner" element={<ProtectedRoute allowedRoles={['Store Owner']}><StoreOwnerDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={getHomeRoute(user)} />} />
        </Routes>
    );
};

// --- 5. ROOT APP COMPONENT ---
const App: FC = () => {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;


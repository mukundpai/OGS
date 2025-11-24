import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="container section" style={{ paddingTop: '120px', maxWidth: '500px' }}>
            <div className="terminal-window">
                <div className="terminal-header">
                    <span>SYSTEM_AUTH</span>
                    <span>LOGIN.EXE</span>
                </div>

                <h1 className="text-xl font-bold mb-8 uppercase tracking-wider font-mono">
                    ACCESS TERMINAL
                </h1>

                {error && (
                    <div style={{
                        background: '#fff',
                        color: '#000',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderLeft: '4px solid #000',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem'
                    }}>
                        ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="font-mono text-xs text-gray uppercase tracking-wide block mb-2">
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="oracle-input"
                            placeholder="user@oglabs.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-mono text-xs text-gray uppercase tracking-wide block mb-2">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="oracle-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="cta-btn justify-center mt-8"
                        disabled={loading}
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="font-mono text-sm text-gray">
                        NEW USER?{' '}
                        <Link to="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>
                            CREATE ACCOUNT
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

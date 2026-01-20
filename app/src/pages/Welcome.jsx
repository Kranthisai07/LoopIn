import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome } from 'lucide-react';
import { Logo } from '../components/Logo'; // Import the new Logo

export default function Welcome() {
    const { loginWithGoogle } = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError('Failed to login. Try again.');
            console.error(err);
        }
    };

    return (
        <div className="padding flex-col flex-center animate-fade-in" style={{ minHeight: '100vh', textAlign: 'center', gap: '3rem', justifyContent: 'center' }}>
            <div className="flex-col flex-center gap-4">
                <div style={{
                    width: 90, height: 90,
                    background: 'var(--primary-gradient)',
                    borderRadius: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 40px -5px var(--primary-glow)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    {/* Replaced Text with Logo Component */}
                    <Logo size={48} color="white" />
                </div>

                <div>
                    <h1 className="text-xl" style={{ fontSize: '2.5rem', marginBottom: '8px', lineHeight: 1.1 }}>LoopIn</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Find Your Micro-Tribe.</p>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: 320 }}>
                {error && <p style={{ color: '#ef4444', marginBottom: 10 }}>{error}</p>}
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', height: '56px', fontSize: '1.1rem', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-gradient)', color: 'white' }}
                    onClick={handleLogin}
                >
                    <Chrome size={20} />
                    Continue with Google
                </button>
                <p className="text-muted text-sm" style={{ marginTop: 20 }}>
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
}

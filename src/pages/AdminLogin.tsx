import { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-dark-card border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-green/20">
            <Lock className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">System Access</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted Area. Authorized Personnel Only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin ID"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter secure key"
            required
          />

          {error && (
            <div className="p-3 bg-deep-red/10 border border-deep-red/20 rounded text-deep-red text-xs font-mono text-center">
              Error: {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

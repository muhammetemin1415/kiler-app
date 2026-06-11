'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error?.message || 'Request failed');
        return;
      }

      setMessage(data.data?.message || 'Check your email for password reset link');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card text-center">
        <div className="mb-4 text-4xl">✉️</div>
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href="/auth/login" className="btn btn-primary w-full">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Enter your email and we'll send you a link to reset your password
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <div className="form-error mb-4">{error}</div>}

        <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        <Link href="/auth/login" className="text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

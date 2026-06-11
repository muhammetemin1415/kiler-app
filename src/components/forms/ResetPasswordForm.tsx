'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error?.message || 'Reset failed');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="card text-center">
        <div className="mb-4 text-4xl">❌</div>
        <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
        <p className="text-gray-600 mb-6">This password reset link is invalid or expired</p>
        <Link href="/auth/login" className="btn btn-primary w-full">
          Back to Login
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="card text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h2 className="text-xl font-bold mb-2">Password Reset</h2>
        <p className="text-gray-600 mb-6">Your password has been successfully reset</p>
        <Link href="/auth/login" className="btn btn-primary w-full">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <small className="text-gray-500 mt-1 block">
            At least 8 chars, 1 uppercase, 1 number, 1 special char
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="form-error mb-4">{error}</div>}

        <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
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

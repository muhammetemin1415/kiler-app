'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName || 'User'}! 👋</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user?.email}</p>
            <p className="text-sm text-gray-500">
              {user?.isVerified ? '✅ Verified' : '⏳ Not verified'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

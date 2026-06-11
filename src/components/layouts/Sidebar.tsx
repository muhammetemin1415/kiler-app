'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  return (
    <aside className="w-64 bg-dark text-white h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">🌿 Kiler</h2>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          📊 Dashboard
        </Link>
        <Link href="/profile" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
          👤 Profile
        </Link>
        <Link href="/health" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
          ❤️ Health
        </Link>
        <hr className="my-4 border-gray-700" />
        <p className="text-xs text-gray-400 px-4 mb-2">Coming in Sprint 2+</p>
        <button
          disabled
          className="w-full text-left px-4 py-2 rounded opacity-50 cursor-not-allowed"
        >
          💰 Expenses
        </button>
        <button
          disabled
          className="w-full text-left px-4 py-2 rounded opacity-50 cursor-not-allowed"
        >
          🍳 Recipes
        </button>
        <button
          disabled
          className="w-full text-left px-4 py-2 rounded opacity-50 cursor-not-allowed"
        >
          🥘 Pantry
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="m-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition w-full"
      >
        🚪 Logout
      </button>
    </aside>
  );
}

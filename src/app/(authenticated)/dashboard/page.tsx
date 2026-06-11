'use client';

import { useSearchParams } from 'next/navigation';
import HealthProfileForm from '@/components/forms/HealthProfileForm';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const setupMode = searchParams.get('setup');
  const { user } = useAuth();

  if (setupMode === 'health') {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Let's Get Started! 🚀</h1>
          <p className="text-gray-600">
            Complete your health profile to receive personalized recommendations
          </p>
        </div>
        <HealthProfileForm />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">📊 Financial Tracking</h3>
          <p className="text-2xl font-bold mb-2">Coming Soon</p>
          <p className="text-gray-500 text-sm">Track your dining expenses and opportunity costs</p>
        </div>

        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">🍳 Smart Recipes</h3>
          <p className="text-2xl font-bold mb-2">Coming Soon</p>
          <p className="text-gray-500 text-sm">Get recipes based on your pantry inventory</p>
        </div>

        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">❤️ Health Goals</h3>
          <p className="text-2xl font-bold mb-2">Coming Soon</p>
          <p className="text-gray-500 text-sm">Track your progress toward your health goals</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-semibold">Account Created</h3>
              <p className="text-gray-600 text-sm">Welcome to Kiler, {user?.firstName}!</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Complete Health Profile</h3>
              <p className="text-gray-600 text-sm">Go to Health tab to set up your profile</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-400">Start Logging (Sprint 2)</h3>
              <p className="text-gray-600 text-sm">Track expenses, pantry, and meals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-900">
          <strong>Note:</strong> We're in active development! Sprint 1 features (authentication,
          health profile) are now available. Recipes, expense tracking, and more coming soon in Sprint
          2.
        </p>
      </div>
    </div>
  );
}

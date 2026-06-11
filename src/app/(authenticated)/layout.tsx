'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}

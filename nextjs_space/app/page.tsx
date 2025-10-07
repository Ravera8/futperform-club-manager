
'use client';

import { useAuth } from '@/lib/firebase-context';
import { LoginForm } from '@/components/auth/login-form';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FutPerform Club Manager</h1>
            <p className="text-gray-600 mt-2">Sistema de gestão de clubes de futebol</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <DashboardLayout />;
}

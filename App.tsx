import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { AuthView } from './views/Auth';
import { OnboardingView } from './views/Onboarding';
import { DashboardView } from './views/Dashboard';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [hasGoal, setHasGoal] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkGoal(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkGoal(session.user.id);
      else {
        setHasGoal(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkGoal = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      setHasGoal(data && data.length > 0);
    } catch (e) {
      console.error(e);
      setHasGoal(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyber-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  if (hasGoal === false) {
    return <OnboardingView onComplete={() => setHasGoal(true)} />;
  }

  return <DashboardView user={session.user} />;
};

export default App;